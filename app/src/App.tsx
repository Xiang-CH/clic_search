import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router';
import './App.css';
// import {Search} from '@mui/icons-material';
import Header from './components/Header/Header'
import { DefaultPage } from './pages/DefaultPage/DefaultPage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { getGPTAnswerApi, getOrderedTopicApi, searchApi, refineApi } from './api/api';
import { SearchResponse, refineResponse } from './api/models';
import { QueryRefinePage } from './pages/QueryRefinePage/QueryRefinePage';

function App() {
  const navigate = useNavigate();
//  const location = useLocation();
//   const [page, setPage] = useState<string>(getPageFromPath(location.pathname));
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [gptError, setGptError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | undefined>(undefined);
  const [gptResult, setGptResult] = useState<string | undefined>(undefined);
  const [gptLoading, setGptLoading] = useState<boolean>(false);
  const [orderedTopics, setOrderedTopics] = useState<refineResponse | undefined>(undefined);
  const [refinedQuestions, setRefinedQuestions] = useState<refineResponse | undefined>(undefined);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [useVectorSearch, setUseVectorSearch] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>("en-US");
  const [chosenTopic, setChosenTopic] = useState<string>("");
  const [refineObject, setRefineObject] = useState<any | undefined>(undefined);

//   useEffect(() => {
//     setPage(getPageFromPath(location.pathname));
//   }, [location.pathname]);

//   function getPageFromPath(path: string): string {
//     if (path === '/search') return 'search';
//     if (path === '/refine') return 'refine';
//     return 'default';
//   }

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const onSend = async (question: string, refineObject?: any) => {
    if (refineObject){
      setRefineObject(refineObject);
    }
    error && setError(undefined)
    gptError && setGptError(undefined)
    setIsLoading(true);
    setQuestion(question);
    setGptLoading(true);
    setUseVectorSearch(true);
    // setPage("search");
    navigateTo("/search");
    setGptResult(undefined);
    try{
      console.log("onSend", question, language, useVectorSearch, selectedTopics)
      setSearchResult(await searchApi(question, language, useVectorSearch, selectedTopics));
      setIsLoading(false);
      try{
        const gptSteamResponse = await getGPTAnswerApi(question);
        let chunks = "";
        
        // Create a new TextDecoder to decode the streamed response text
   				const decoder = new TextDecoder();
   
        // Set up a new ReadableStream to read the response body
        const reader = gptSteamResponse.getReader();
   
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setGptLoading(false);
            break
          };
          chunks += decoder.decode(value);
          // console.log("Value", chunks)
          setGptResult(chunks);
        }
      } catch(e: any){
        console.log("getGPTAnswerApi error", e.message)
        setGptError(e.message);
        setGptLoading(false);
   
      }
      return Promise.resolve();
    } catch(e: any){
      console.log("searchApi error", e)
      setError(e.message);
      setGptError("Search api error")
      // return Promise.reject();
    } finally{
      setIsLoading(false);
    }
  }

  const sendQuestion = (refineObject?: any) => {
    setRefineObject(undefined);
    if (!question.trim()){
      alert("empty question")
      return;
    }
    onSend(question);
    // setIsDefaultPage(false)	
  }

  const sendStory = async (story: string) => {
    error && setError(undefined)
    setIsLoading(true);
    if (!story.trim()){
      alert("empty story")
      return;
    }
    try{
      setOrderedTopics(await getOrderedTopicApi(story));
    }
    catch(e:any){
      setError(e);
    } finally{
      setIsLoading(false)
    }
  }

  const refine = async (story: string, topic: string) => {
    error && setError(undefined)
    setIsLoading(true);
    if (!story.trim()){
      alert("empty story")
      return;
    }
    try{
      console.log("refine", story, topic)
      setRefinedQuestions(await refineApi(story, topic, language));
    }
    catch(e:any){
      setError(e);
    } finally{
      setIsLoading(false)
    }
  }

//   const back = () => {
//     if (refineObject) {
//       // setPage("refine");
//       navigateTo("/refine");
//     } else {
//       // setPage("default");
//       navigateTo("/");
//     }
//   };

  return (
    <div style={{minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative"}}>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<DefaultPage
            language={language}
            setLanguage={setLanguage}
            sendQuestion={sendQuestion}
            question={question}
            setQuestion={setQuestion}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            // setPage={setPage}
            // setPage={(pageName: string) => navigateTo(pageName === 'refine' ? '/refine' : '/')}
          />}
        />
        <Route
          path="/search"
          element={<SearchPage
            sendQuestion={sendQuestion}
            setQuestion={setQuestion}
            language={language}
            question={question}
            searchResult={searchResult}
            gptResult={gptResult}
            isLoading={isLoading}
            gptLoading={gptLoading}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            error={error}
            gptError={gptError}
            // setPage={setPage}
            // setPage={(pageName: string) => navigateTo(pageName === 'refine' ? '/refine' : '/')}
            // back={back}
          />}
        />
        <Route
          path="/refine"
          element={<QueryRefinePage
            setQuestion={setQuestion}
            orderedTopics={orderedTopics?.result}
            refinedQuestions={refinedQuestions?.result}
            onSend={onSend}
            isLoading={isLoading}
            sendStory={sendStory}
            chosenTopic={chosenTopic}
            question={question}
            language={language}
            refine={refine}
            refineObject={refineObject}
            // back={back}
          />}
        />
      </Routes>
    </div>
  );
}

export default App;