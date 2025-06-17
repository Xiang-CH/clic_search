from bs4 import BeautifulSoup
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
import pandas as pd
import openai
import json
import os

dict = {
    "en": {"file": "data/CLIC_Content_List.xlsx", "index": "clic-index-en"},
    "sc": {"file": "data/sc_with_topic.xlsx", "index": "clic-index-sc"},
    "tc": {"file": "data/tc_with_topic.xlsx", "index": "clic-index-tc"},
}

endpoint = f"https://{os.environ.get('AZURE_SEARCH_SERVICE')}.search.windows.net/"
api_key = os.environ.get("AZURE_SEARCH_KEY")

openai.api_type = "azure"
openai.api_base = "https://clic-openai.openai.azure.com/"
openai.api_version = "2023-03-15-preview"
openai.api_key = os.getenv("OPENAI_API_KEY")


credential = AzureKeyCredential(api_key)

for LANG in ['en', 'sc', 'tc']:
    index_name = dict[LANG]["index"]
    client = SearchClient(endpoint=endpoint, credential=credential, index_name=index_name)

    table = pd.read_excel(dict[LANG]["file"], usecols = ['title','path','topic','content']).dropna()

    contentData = []

    for i in range(table.shape[0]):
        # Extract the ID, address, and HTML content from the columns
        id = str(i)
        address = table['path'][i]
        html_content = table['content'][i]
        title = table['title'][i]
        topic = table['topic'][i]
        soup = BeautifulSoup(html_content, 'html.parser')
        plain_text = soup.get_text()
        
        if len(plain_text) - len(title)  >  4:
            plain_text = plain_text.replace(title, '')
            
        embedding = openai.Embedding.create(engine = 'embedding', input = plain_text)["data"][0]["embedding"]
        
        row_data= {
            'id': id,
            'title': title,
            'content': plain_text,
            'address': address,
            'embedding': embedding,
            'topic': topic,
        }

        contentData.append(row_data)

    with open("contentData.json", "w") as fp:
        json.dump(contentData, fp)
        
        
    print("Uploading documents to Azure Search...")
    results = client.upload_documents(documents=contentData[:1000])
    succeeded = sum([1 for r in results if r.succeeded])
    print(f"\tIndexed {len(results)} sections, {succeeded} succeeded")

    print("Uploading documents to Azure Search...")
    results = client.upload_documents(documents=contentData[1000:])
    succeeded = sum([1 for r in results if r.succeeded])
    print(f"\tIndexed {len(results)} sections, {succeeded} succeeded")
