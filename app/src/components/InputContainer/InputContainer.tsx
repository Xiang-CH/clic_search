import { FilterMultiple } from "../Filter/Filter";
import { QuestionInput } from "../QuestionInput/QuestionInput";
import { Button, Tooltip } from "@mui/material";
import { Search, AutoFixHigh } from "@mui/icons-material";
import {useTheme} from '@mui/material/styles'
import styles from "./InputContainer.module.css";
import { useNavigate } from "react-router";

interface Props {
    sendQuestion: any;
    question: string;
    setQuestion: any;
    selectedTopics: any;
    setSelectedTopics: any;
    language: string;
}

export function InputContainer({
    sendQuestion,
    question,
    setQuestion,
    selectedTopics,
    setSelectedTopics,
    language
}: Props) {
    const navigate = useNavigate();
    const theme = useTheme()
    return (
        <div>
            <QuestionInput
                sendQuestion={sendQuestion}
                question={question}
                setQuestion={setQuestion}
                language={language}
            />

            {/* <Filter /> */}
        <div className={styles.container}>

                <FilterMultiple
                    selectedTopics={selectedTopics}
                    setSelectedTopics={setSelectedTopics}
                    language={language}
                />

                {/* <div className={styles.buttonContainer}> */}
                    <div className={styles.buttons}>
                        <Tooltip title="Search" sx={{ margin: 0 }}>
                            <Button
                                className={styles.searchButton}
                                sx={{
                                    borderRadius: 0,
                                    boxShadow: 1,
                                    backgroundColor: theme.palette.primary.main,
                                    border: "1px solid " + theme.palette.primary.main,
                                    color: "white",
                                    "&:hover": {
                                        color: theme.palette.primary.main,
                                        backgroundColor: "#d4d4d4",
                                        border: "1px solid " + theme.palette.primary.main,
                                    },
                                    "&:focus": {
                                        outline: "none"
                                    }
                                }}
                                onClick={() => {
                                    sendQuestion();
                                }}
                            >
                                <Search />
                            </Button>
                        </Tooltip>
                        {/* </div> */}
                        <Tooltip title="AI refine search">
                            <Button
                                className={styles.refineButton}
                                sx={{
                                    marginLeft: "5px",
                                    borderRadius: 0,
                                    boxShadow: 1,
                                    backgroundColor: theme.palette.primary.main,
                                    border: "1px solid " + theme.palette.primary.main,
                                    color: "white",
                                    "&:hover": {
                                        color: theme.palette.primary.main,
                                        backgroundColor: "#d4d4d4",
                                        border: "1px solid " + theme.palette.primary.main,
                                    },
                                    "&:focus": {
                                        outline: "none"
                                    }
                                }}
                                onClick={() => {
                                    navigate("/refine");
                                }}
                            >
                                <AutoFixHigh />
                            </Button>
                        </Tooltip>
                        {/* <VectorSwitch /> */}
                    </div>
                {/* </div> */}
            </div>
        </div>
    );
}
