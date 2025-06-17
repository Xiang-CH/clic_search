
import {SearchResponse, TopicResponse, GPTAnswerResponse, TopicNames, refineResponse} from './models';

export async function getTopicApi(): Promise<TopicNames>{
    const response = await fetch("/getTopics", { method: "GET" });
    const parsedResponse: TopicResponse = await response.json();
    if (response.status !== 200) {
        throw Error(parsedResponse.error);
    }
    return parsedResponse.topics;
}

export async function searchApi(question: string, language: string, vector_search?: boolean, filter?: string[], ): Promise<SearchResponse>{
    if (vector_search === undefined){
        vector_search = true
    }
    console.log("language", language)
    const response= await fetch("/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query:  question,
            language: language,
            vector_search: vector_search,
            filter: filter,
            // next_page_params: []
        })
    });
    
    const parsedResponse: SearchResponse = await response.json();
    if (response.status !== 200) {
        if (response.status === 502){
            throw Error("Timeout");
        }
        throw Error(parsedResponse.error);
    }
    return parsedResponse
}

export async function getOrderedTopicApi(story: string): Promise<refineResponse>{
    const response= await fetch("/getOrderedTopics", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            story:  story,
        })
    });
    
    const parsedResponse: refineResponse = await response.json();
    if (response.status !== 200) {
        throw Error(parsedResponse.error);
    }
    return parsedResponse
}

export async function refineApi(story: string, topic: string, language: string): Promise<refineResponse>{
    console.log("call Refine API", story, topic)
    const response= await fetch("/refine", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            story: story,
            topic: topic,
            language: language
        })
    });
    
    const parsedResponse: refineResponse = await response.json();
    if (response.status !== 200) {
        throw Error(parsedResponse.error);
    }
    return parsedResponse
}

export async function getGPTAnswerApi(query: string): Promise<any | undefined>{
    const response = await fetch("/getGPTAnswer", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query:  query
        })
    });

   
    if (response.status == 501 || response.body == null) {
        throw undefined
    }

    if (response.status !== 200) {
        const parsedResponse: GPTAnswerResponse = await response.json();
        throw Error(parsedResponse.error);
    }

    return response.body
}
