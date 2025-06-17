export type SearchResponse = {
    quick_answer?: SearchResult;
    next_page_params?: any;
    results: SearchResult[];
    error?: string;
}

export type SearchResult = {
    caption: string;
    caption_highlight: string;
    title: string;
    topic: string;
    url: string;
}

export type TopicResponse = {
    topics: TopicNames;
    error?: string;
}

export type refineResponse = {
    result: string[];
    error?: string;
}

export type TopicNames = {
    [key: string]:{
        [key: string]: string;
        // 'en-US': string;
        // 'zh-HK': string;
        // 'zh-CN': string;
    }
}
export type GPTAnswerResponse = {
    answer: string;
    error?: string;
}

export type refineRequest = {
    story: string;
    topic: string;
}
