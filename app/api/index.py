import os
from openai import AzureOpenAI
# import json
import csv
import time
from threading import Thread
from flask import Flask, redirect, request, jsonify, Response
from flask_cors import CORS
# from azure.identity import DefaultAzureCredential
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import QueryType
from helper.messageHelper import orderTopicPrompt, extract_content, refineQuestionPrompt
from dotenv import load_dotenv, find_dotenv
from opentelemetry.instrumentation.flask import FlaskInstrumentor

load_dotenv(find_dotenv())

if (not os.environ.get("AZURE_OPENAI_ENDPOINT")):
    raise Exception("AZURE_OPENAI_ENDPOINT is not set")

openai = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", ""), 
  api_key=os.getenv("OPENAI_API_KEY"),  
  api_version = "2023-12-01-preview"
)

DEBUG = True
QUICK_ANSWER_THRESHOLD = 0.9

AZURE_SEARCH_SERVICE = os.environ.get("AZURE_SEARCH_SERVICE")
AZURE_SEARCH_KEY = os.environ.get("AZURE_SEARCH_KEY")

if (not AZURE_SEARCH_SERVICE or not AZURE_SEARCH_KEY):
    raise Exception("AZURE_SEARCH_SERVICE or AZURE_SEARCH_KEY is not set")

AZURE_OPENAI_EMB_DEPLOYMENT = os.getenv("AZURE_OPENAI_EMB_DEPLOYMENT", "clic-embedding")
AZURE_OPENAI_CHATGPT_DEPLOYMENT = os.getenv("AZURE_OPENAI_CHATGPT_DEPLOYMENT", "clic-chat")
# AZURE_OPENAI_CHATGPT_MODEL = os.getenv("AZURE_OPENAI_CHATGPT_MODEL")


# Set up azure credentials
# azure_credential = DefaultAzureCredential()

def ensure_openai_token():
    # global openai_token
    # if openai_token.expires_on < int(time.time()) - 60:
    #     openai_token = azure_credential.get_token("https://cognitiveservices.azure.com/.default")
    #     openai.api_key = openai_token.token
    pass

def GPTANSWER_clean():
    global GPTANSWER
    print(GPTANSWER)
    for key in list(GPTANSWER.keys()):
        if GPTANSWER[key]["created"] < time.time() - 40:
            del GPTANSWER[key]
    time.sleep(5000)


# Set up azure search client
search_client_en = SearchClient(
    endpoint=f"https://{AZURE_SEARCH_SERVICE}.search.windows.net",
    index_name="clic-index-en",
    credential=AzureKeyCredential(AZURE_SEARCH_KEY), #azure_credential,
    api_version="2023-07-01-Preview")

search_client_sc = SearchClient(
    endpoint=f"https://{AZURE_SEARCH_SERVICE}.search.windows.net",
    index_name="clic-index-sc",
    credential=AzureKeyCredential(AZURE_SEARCH_KEY), #azure_credential,
    api_version="2023-07-01-Preview")

search_client_tc = SearchClient(
    endpoint=f"https://{AZURE_SEARCH_SERVICE}.search.windows.net",
    index_name="clic-index-tc",
    credential=AzureKeyCredential(AZURE_SEARCH_KEY), #azure_credential,
    api_version="2023-07-01-Preview")

# TOPICS = []
# with open("./static/TOPICS.txt", "r") as f:
#     topic = f.readline()
#     while (topic != ""):
#         TOPICS.append(topic.strip())
#         topic = f.readline()

app = Flask(__name__)
FlaskInstrumentor().instrument_app(app)
cors = CORS(app)

#read translated topic names
static_folder_path = app.static_folder
print("static_folder_path:", static_folder_path)
TOPIC_NAMES = {}
TOPICS = ""
with open(os.path.join(static_folder_path, "topic_translation.csv"), 'r', encoding='utf8') as file:
    csv_reader = csv.reader(file)
    next(csv_reader)  # Skip header row if present
    for row in csv_reader:
        key = row[0]
        TOPICS += key + ", "
        en = row[1]
        tc = row[2]
        sc = row[3]
        TOPIC_NAMES[key] = {'en-US': en, 'zh-HK': tc, 'zh-CN': sc}

TOPICS = 'Topic List: (' + TOPICS[:-2] + ')'
FILTERSTR = "search.in(topic, '{}' , '|')"

GPTANSWER = {}
clean_GPTANSWER_thread = Thread(target=GPTANSWER_clean, daemon=True)
clean_GPTANSWER_thread.start()

@app.route("/", defaults={"path": "index.html"})

@app.route("/<path:path>")
def static_file(path):
    print(path)
    if path == "search" or path == "refine":
        return redirect("index.html")
    return app.send_static_file(path)

@app.route("/getTopics", methods=["GET"])
def getTopics():
    try:
        return jsonify({"topics": TOPIC_NAMES}), 200
    except Exception as e:
        print("Exception in /getTopics")
        return jsonify({"error": str(e)}), 500

@app.route("/search", methods=["POST"])
def search():
    if not request.json:
        return jsonify({"error": "request must be json"}), 400
    try:
        if request.json.get("query") == None or request.json.get("query") == "":
            return jsonify({"error": "query must be non-empty"}), 401
        
        if request.json.get("language") == None or request.json.get("language") == "":
            return jsonify({"error": "language must be non-empty"}), 401
        
        
        filter = FILTERSTR.format('|'.join(["{}".format(topic) for topic in request.json.get("filter")])) if request.json.get("filter") else  None
        vector_search = request.json.get("vector_search") if request.json.get("vector_search") else True
        query_text = request.json["query"] 
        if DEBUG: print(filter)
        
        language = request.json["language"]
        print("language:", language)
        
        query_vector = []
        if vector_search:
            try:
                ensure_openai_token()
                response = openai.embeddings.create(model=AZURE_OPENAI_EMB_DEPLOYMENT, input=query_text)
                # print(response)
                query_vector = response.data[0].embedding
                # print(query_vector)
            except Exception as e:
                if DEBUG:
                    print("Exception in openAI embedding api:")
                    print(e)
                vector_search = False
            
        search_client = search_client_en if language == "en-US" else (search_client_sc if language == "zh-CN" else search_client_tc)
        # search_client = search_client_en
        r = search_client.search(query_text,
                                filter=filter,
                                query_type=QueryType.SEMANTIC, 
                                query_language="en-us" if language == "en-US" else ("zh-cn" if language == "zh-CN" else "zh-tw"),
                                query_speller="lexicon" if language == "en-US" else None,
                                query_answer="extractive", 
                                semantic_configuration_name="default", 
                                query_caption="extractive",
                                top=10,
                                vector=query_vector if vector_search and query_vector else None,
                                top_k=50 if vector_search else None,
                                vector_fields="embedding" if vector_search else None)
                                     
        
        
        results = [result for result in r]
        
        response = {}
        quick_answer_id = -1
        quick_answer, quick_answer_highlights = None, None

        answers = r.get_answers()
        if answers and len(answers) <= 0:
            answer = answers[0]
            if answer and answer.score and answer.score > QUICK_ANSWER_THRESHOLD:
                quick_answer = answer.text
                quick_answer_highlights = answer.highlights
                quick_answer_id = answer.key
        else:
            if DEBUG: print("No quick answer")
        
        
        # Add next page param if there is next page
        # try:
        #     response['next_page_params'] = r['@search.nextPageParameters']
        #     if DEBUG: print("next page param set")
        # except:
        #     if DEBUG: print("No next page param")
        
        source_information = ''

        # Add results
        if len(results) > 0:
            response['results'] = []
            for i, result in enumerate(results):
                splice_index = result["title"].find(". ", 0, 5) + 2 if result["title"].find(". ", 0, 5) != -1 else 0
                if result['id'] == quick_answer_id:
                    response['quick_answer'] = {
                        "title": result["title"][splice_index:],
                        "url": result["address"],
                        "topic": result["topic"],
                        "caption": quick_answer,
                        "caption_highlight": quick_answer_highlights
                    }
                response['results'].append({
                    "title": result["title"][splice_index:],
                    "url": result["address"],
                    "topic": result["topic"],
                    "caption": result["@search.captions"][0].text if len(result["@search.captions"]) > 0 else None,
                    "caption_highlight": result["@search.captions"][0].highlights if len(result["@search.captions"]) > 0 else None
                })
                if (i < 6):
                    source_information += "\n{title: '"+ result["title"][splice_index:] + "', content: '" + result['content'] + "'},\n"
                
        
        global GPTANSWER
        key = str(request.environ.get('HTTP_X_FORWARD_IP', request.remote_addr)) + request.json["query"]
        GPTANSWER[key] = {'source': source_information, 'loading': True, 'language': language }
        
        return jsonify(response), 200
        
    except Exception as e:
        print("Exception in /search")
        return jsonify({"error": str(e)}), 500
    
def send_messages(messages):
    return openai.chat.completions.create(
        model=AZURE_OPENAI_CHATGPT_DEPLOYMENT,
        messages=messages, 
        temperature=0.5, 
        max_tokens=2048, 
        stream=True,
        n=1
    )


def gptAnswer(user_question, source, language):
    try:
        ensure_openai_token()
        system_message = """Assistant that helps people with their Hong Kong legal questions by providing summary of content in the Provided Sources.
         Only summarise the sources that are closely related to the user query. DO NOT include the irrelevant sources. 
         DO NOT include any information that are not from the sources below, and DO NOT include irrelevant information from the relevant sources. MAKE SURE the summary is relevant to the user query.
         Reduce the unnecessary information and emotional support, and focus on legal information.
        Be brief in your summary by extracting all the information in the source that are related to any key points in the question.
        Reponse generated must not be based on prior knowledge that are not from the sources below. Do not use internet resource. Do not ask questions.
        Each source is in json form surrounded by {} with key title and content, always include the title of the source for each fact you use in the response.
        Each paragraph of the summary must have a reference to its source.
        Use square brackets to reference the source by it's title, e.g. [title of source one]. Don't combine sources, list each source separately, e.g. [title of source one][title of source two]. Do not include the word "title" in the citation, do not index any reference.
        """

        user_question_source = "User query: " + user_question + "\n\nSources: \n" + source
    
        if language == "en-US":
            if (len(user_question_source)>10000): user_question_source = user_question_source[:10000]
        else:
            if (len(user_question_source)>2000): user_question_source = user_question_source[:2000]
        
        print(user_question_source)
        conversation = [
        {'role': 'system', 'content': system_message},
        # {'role': 'user', 'content': 'What To Do When Someone Uses Your Photo Without Permission'},
        # {'role': 'assistant', 'content': "If someone uses your photo without permission, there are a few steps you can take. First, verify that the photo is indeed yours and has been used without your consent. Then, contact the person or entity using the photo and politely ask them to remove it immediately, providing evidence of ownership. If they refuse, consider sending a formal cease and desist letter, stating your ownership and demanding removal. Additionally, report the infringement to the platform where the photo is being used, as most have mechanisms for reporting copyright violations. If the unauthorized use persists, you may want to consult with an attorney who specializes in intellectual property law for further guidance. It's also worth considering copyright registration for added protection. Stay calm and professional throughout the process, as it increases the likelihood of a positive resolution."},
        {'role': 'user', 'content': user_question_source}
        ]
        # print(prompt)
        # os.environ["OPENAI_LOG_LEVEL"] = "debug"
        # ensure_openai_token()
        
        def event_stream():
            for line in send_messages(messages=conversation):
                # print(line)
                try:
                    text = line.choices[0].delta.content
                    if text is not None:
                        yield text
                except:
                    pass
        

        # gptAnswer = chat_completion.choices[0].message.content
        # if DEBUG: print("gpt answer: ", event_stream)
        return(event_stream())
    
    except Exception as e:
        print("Exception in gptAnswer")
        print(e)
        return None
        

@app.route("/getGPTAnswer", methods=["POST"])
def getGPTAnswer():
    if not request.json:
        return jsonify({"error": "request must be json"}), 400
    if request.json.get('query') is None:
        return jsonify({"error": "No query"}), 401
    try:
        ip = request.environ.get('HTTP_X_FORWARD_IP', request.remote_addr)
        key = str(ip)+request.json.get('query')
        
        if key in GPTANSWER:
            timeStamp = time.time()
            
            source = GPTANSWER[key]["source"]
            language = GPTANSWER[key]["language"]
            del GPTANSWER[key]
            answer = gptAnswer(request.json.get('query'), source, language)

            if answer is not None:
                # answer = GPTANSWER[key]["answer"].replace("\n", "<br>")
                # answer = GPTANSWER[key]["answer"]
                # del GPTANSWER[key]
                # return jsonify({"answer": answer}), 200
            
                return Response(answer, mimetype='text/event-stream'), 200
            else:
                return jsonify({"error": "No answer found"}), 501
        else:
            return jsonify({"error": "No answer found"}), 501
    except Exception as e:
        print("Exception in /getGPTAnswer")
        return jsonify({"error": str(e)}), 500


def gptOrderTopic(story):
    ensure_openai_token()
    print(TOPICS)
    conversation = orderTopicPrompt(TOPICS)
    conversation.append({'role': 'user', 'content': story})
    
    chat_completion = openai.chat.completions.create(
        model=AZURE_OPENAI_CHATGPT_DEPLOYMENT,
        messages=conversation, 
        temperature=0.3, 
        max_tokens=1024, 
        n=1
    )

    output_text = chat_completion.choices[0].message.content
    topics = extract_content(output_text)
    print("output text: ", output_text)
    
    print("Ordered Topics:")
    for topic in topics:
        print(topic)

    return topics

@app.route("/getOrderedTopics", methods = ["POST"])
def getOrderedTopics():
    if not request.json:
        return jsonify({"error": "request must be json"}), 400
    try:
        if request.json.get("story") == None:
            return jsonify({"error": "query must be non-empty"}), 401
        response = {}
        try:
            response["result"] = gptOrderTopic(request.json["story"])
        except Exception as e:
            if DEBUG:
                print("Exception in openai api (getOrderedTopics):")
                print(e)
        return jsonify(response), 200
            
    except Exception as e:
        print("Exception in /getOrderedTopics")
        return jsonify({"error": str(e)}), 500
    
def gptGenerateQuestion(story, topic, language):
    ensure_openai_token()
    conversation = refineQuestionPrompt(language)
    conversation.append({'role': 'user', 'content': "Story: " + story + "Chosen Topic: " + topic})
    
    chat_completion = openai.chat.completions.create(
        model=AZURE_OPENAI_CHATGPT_DEPLOYMENT,
        messages=conversation, 
        temperature=0.3, 
        max_tokens=1024, 
        n=1
    )

    output_text = chat_completion.choices[0].message.content
    questions = extract_content(output_text)
    print("(gptGenerateQuestion)output text: ", output_text)
    
    print("Questions:")
    for question in questions:
        print(question)

    return questions

@app.route("/refine", methods = ["POST"])
def refine():
    if not request.json:
        return jsonify({"error": "request must be json"}), 400
    try:
        if request.json.get("story") == None or request.json.get("topic") == None:
            return jsonify({"error": "query must contains non-empty story and topic"}), 401
        response = {}
        try:
            response["result"] = gptGenerateQuestion(request.json["story"], request.json["topic"], request.json["language"])
        except Exception as e:
            if DEBUG:
                print("Exception in openai api (refine):")
                print(e)
        return jsonify(response), 200
            
    except Exception as e:
        print("Exception in /refine")
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run()