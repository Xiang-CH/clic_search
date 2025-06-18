export type SearchResponse = {
    quick_answer?: SearchResult;
    next_page_params?: any;
    results: SearchResult[];
    error?: string;
}

export type SearchResult = {
    caption: string | null;
    caption_highlight: string | null;
    title: string;
    topic: string;
    url: string;
    reranker_score: number | null;
    score: number;
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
