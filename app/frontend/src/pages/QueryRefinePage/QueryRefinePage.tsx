import styles from "./QueryRefinePage.module.css";
import {
    Stepper,
    Button,
    Card,
    Step,
    StepLabel,
    StepContent,
    Typography,
    Alert,
    Snackbar,
    Link,
    Box,
    IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { topicNameDictionary } from "../../components/TopicList/helper";
import { useState, useEffect } from "react";
import { Step0 } from "./Steps/Step0";
import { Step1 } from "./Steps/Step1";
import { Step2 } from "./Steps/Step2";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { SignalCellularConnectedNoInternet4BarRounded } from "@mui/icons-material";

const steps: { [key: string]: string }[] = [
    {
        "en-US": "Tell your story",
        "zh-CN": "讲述你的故事",
        "zh-HK": "講述你的故事",
    },
    {
        "en-US": "Choose a topic",
        "zh-CN": "选择一个主题",
        "zh-HK": "選擇一個主題",
    },
    {
        "en-US": "Refine your question",
        "zh-CN": "AI 智能搜索",
        "zh-HK": "AI 智能檢索",
    },
];

interface Props {
    orderedTopics?: string[];
    refinedQuestions?: string[];
    onSend: any;
    isLoading: boolean;
    setQuestion: any;
    chosenTopic: string;
    language: string;
    question: string;
    sendStory: any;
    refine: any;
    refineObject: any;
    // back: any;
}
export function QueryRefinePage({
    orderedTopics,
    refinedQuestions,
    onSend,
    isLoading,
    setQuestion,
    chosenTopic,
    sendStory,
    language,
    question,
    refine,
    refineObject,
    // back,
}: Props) {
    const [activeStep, setActiveStep] = useState(0);
    const [story, setStory] = useState<string>(refineObject ? refineObject.story : question);
    const [topic, setTopic] = useState<string>(refineObject ?  refineObject.topics: "");
    const [topicError, setTopicError] = useState<boolean>(false);
    const [optionalLabel, setOptionalLabel] = useState<string[]>(["", "", ""]);
    const theme = useTheme();

    useEffect(() => {
        if (refineObject) {
            setActiveStep(2);
        }
    }, []);

    const handleNext = (index: number) => {
        if (index == 0) {
            // sendStory(story)
            sendStory(story);
        }
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const toStep = (index: number) => {
        if (story && index == 0) {
            setActiveStep(index);
        }
        if (orderedTopics && index == 1) {
            setActiveStep(index);
        }
        if (refinedQuestions && index == 2) {
            setActiveStep(index);
        }
    };

    function removeIndex(string: string): string {
        if (string.charAt(2) == " ") return string.slice(3);
        else return string.slice(4);
    }

    useEffect(() => {
        if (story != "") {
            setOptionalLabel([story, optionalLabel[1], optionalLabel[2]]);
        }
        if (topic != "") {
            setOptionalLabel([
                optionalLabel[0],
                topicNameDictionary[removeIndex(topic)][language],
                optionalLabel[2],
            ]);
        }
        console.log(steps[0][language]);
    }, [activeStep]);

    const handelChooseTopic = (topic: string) => {
        console.log("click");
        setTopic(topic);
        refine(story, topic);
        handleNext(activeStep);
    };

    const showTopicError = () => {
        setTopicError(true);
        handleBack();
    };

    return (
        <div className={styles.queryRefinePageContainer}>
            <div style={{position: "relative", width: "100%"}}>
                {/* <IconButton  onClick={back} sx={{position: "absolute", left: 15, top:15, "&:focus": {outline: "none"}}}>
                    <ArrowBackIcon/>
                </IconButton> */}
            </div>
                {language == "en-US" && (
                    <Typography
                        sx={{
                            mt: 4,
                            mb: -3,
                            ml: 0,
                            color: theme.palette.componentColor.main,
                        }}
                        fontSize={30}
                        fontFamily={"optima"}
                        fontWeight={"bold"}
                    >
                        Refine your search with AI
                    </Typography>
                )}
                {language == "zh-CN" && (
                    <Typography
                        sx={{
                            mt: 4,
                            mb: -3,
                            ml: 0,
                            color: theme.palette.componentColor.main,
                        }}
                        fontSize={30}
                        fontFamily={"optima"}
                        fontWeight={"bold"}
                    >
                        AI 智能搜索
                    </Typography>
                )}
                {language == "zh-HK" && (
                    <Typography
                        sx={{
                            mt: 4,
                            mb: -3,
                            ml: 0,
                            color: theme.palette.componentColor.main,
                        }}
                        fontSize={30}
                        fontFamily={"optima"}
                        fontWeight={"bold"}
                    >
                        AI 智能檢索
                    </Typography>
                )}
                <div className={styles.stepperContainer}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step[language]}>
                                <StepLabel
                                    onClick={() => toStep(index)}
                                    optional={
                                        <Box
                                            onClick={() => toStep(index)}
                                            sx={{
                                                marginLeft: 1,
                                                "&:hover": {
                                                    color: theme.palette
                                                        .backgroundColor.dark,
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{ fontSize: 15 }}
                                            >
                                                {index == 0 &&
                                                    activeStep != 0 &&
                                                    story}
                                                {index == 1 && optionalLabel[1]}
                                                {index == 2 && optionalLabel[2]}
                                            </Typography>
                                        </Box>
                                    }
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 20,
                                            fontFamily: "optima bold",
                                        }}
                                    >
                                        {step[language]}
                                    </Typography>
                                </StepLabel>
                                <StepContent
                                    sx={{
                                        justifyItems: "center",
                                        alignItems: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    {/* step1: input story  */}
                                    {activeStep == 0 && (
                                        <Step0
                                            setQuestion={setQuestion}
                                            setStory={setStory}
                                            question={question}
                                            story={story}
                                            language={language}
                                            handleNext={handleNext}
                                        />
                                    )}

                                    {/* step2: choose topics */}
                                    {activeStep == 1 && (
                                        <Step1
                                            orderedTopicList={orderedTopics}
                                            isLoading={isLoading}
                                            chooseTopic={handelChooseTopic}
                                            showError={showTopicError}
                                            language={language}
                                        />
                                    )}

                                    {activeStep == 2 && (
                                        <Step2
                                            onSend={(question: string) => {onSend(question, {"story": story, "topics": topic})}}
                                            isLoading={isLoading}
                                            questionList={refinedQuestions}
                                            setQuestion={setQuestion}
                                            handleBack={handleBack}
                                        />
                                    )}
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    <Snackbar
                        open={topicError}
                        autoHideDuration={8000}
                        onClose={() => {
                            setTopicError(false);
                        }}
                    >
                        <Alert
                            variant="filled"
                            onClose={() => {
                                setTopicError(false);
                            }}
                            severity="error"
                            sx={{ width: "100%" }}
                        >
                            Topic generatation failed, please try to clearify your
                            story.
                        </Alert>
                    </Snackbar>
                </div>
            
        </div>
    );
}
