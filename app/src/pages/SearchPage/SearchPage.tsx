// import { useState } from 'react'
// import '../../App.css'
import styles from "./SearchPage.module.css";
import { SearchResultList } from "../../components/SearchResult/SearchResultList";
import { SkeletonResultList } from "../../components/SearchResult/SkeletonResultList";
import { AIAnswer } from "../../components/AIAnswer/AIAnswer";
import { SearchResponse } from "../../api/models";
import { InputContainer } from "../../components/InputContainer/InputContainer";
import { useEffect, useState } from "react";
import { Skeleton, Box, IconButton } from "@mui/material";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
    sendQuestion: any;
    setQuestion: any;
    language: string;
    // setPage: any;
    question: string;
    searchResult: SearchResponse | undefined;
    gptResult: string | undefined;
    isLoading: boolean;
    gptLoading: boolean;
    selectedTopics: string[];
    setSelectedTopics: any;
    error: string | undefined;
    gptError: string | undefined;
    // back: any;
}

export const SearchPage = ({
    sendQuestion,
    setQuestion,
    // setPage,
    question,
    language,
    searchResult,
    gptResult,
    isLoading,
    gptLoading,
    selectedTopics,
    setSelectedTopics,
    error,
    gptError,
    // back,
}: Props) => {
    // const [isDefaultPage, setIsDefaultPage] = useState(true);
    const [AICardExpanded, setAICardExpanded] = useState(false);

    useEffect(() => {
        const searchBox = document.getElementById("searchInputOuter");
        searchBox?.style.setProperty("height", "45px");
    }, []);

    const getResultPath = (title: string): string => {
        if (searchResult === undefined) {
            return "";
        }
        for (let res of searchResult.results) {
            if (res.title.toLowerCase().includes(title.toLowerCase())) {
                return res.url;
            }
        }
        return "";
    };

    // useEffect(() => {console.log("change", gptResult)}, [gptResult])

    return (
        <div>
            <div className={styles.Container}>
                {/* <div className={styles.centerText}>
                    <h1>{question}</h1>
                </div> */}
                <div className={styles.wrapper}>
                    {/* <IconButton  onClick={back} sx={{position: "absolute", left: 15, top:15, "&:focus": {outline: "none"}}}>
                        <ArrowBackIcon/>
                    </IconButton> */}
                    {AICardExpanded && <div className={styles.overlay}></div>}
                    <div className={styles.subContainer}>
                        <div className={styles.searchContainer}>
                            <InputContainer
                                sendQuestion={sendQuestion}
                                question={question}
                                setQuestion={setQuestion}
                                language={language}
                                selectedTopics={selectedTopics}
                                setSelectedTopics={setSelectedTopics}
                            />
                        </div>

                        <div className={styles.resultContainer}>
                            <div className={styles.resultListContainer}>
                                {/* <h1>Search Result</h1> */}

                                {error ? (
                                    <p
                                        style={{
                                            color: "black",
                                            width: "680px",
                                        }}
                                    >
                                        An Error oocured while searching,
                                        details: <br /> {error}{" "}
                                    </p>
                                ) : !isLoading && searchResult != undefined ? (
                                    <SearchResultList
                                        searchResult={searchResult.results}
                                        quickAnswer={searchResult.quick_answer}
                                    />
                                ) : (
                                    <SkeletonResultList />
                                )}
                            </div>

                            <div className={styles.resultRightContainer}>
                                {!isLoading ? (
                                    <AIAnswer
                                        answer={gptResult || ""}
                                        loading={gptLoading}
                                        getResultPath={getResultPath}
                                        error={gptError}
                                        cardExpanded={AICardExpanded}
                                        setCardExpanded={setAICardExpanded}
                                        language={language}
                                    />
                                ) : (
                                    <Box>
                                        <Skeleton
                                            variant="rectangular"
                                            width={450}
                                            height={500}
                                            sx={{ marginTop: 0 }}
                                        />
                                        {/* <CircularProgress /> */}
                                    </Box>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
