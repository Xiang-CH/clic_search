// import { useState } from 'react'
// import '../../App.css'
// import { InputBase, Button} from '@mui/material';
// import {Search} from '@mui/icons-material';
import styles from "./DefaultPage.module.css";
import { InputContainer } from "../../components/InputContainer/InputContainer";
import { LanguageSelectButton } from "../../components/LanguageSelectButton/LanguageSelectButton";
// import { useTheme } from "@mui/material/styles";
// import { Button, Popover, Typography } from "@mui/material";
// import { useState } from "react";
// import { sampleQuestionsEn, sampleQuestionsZh } from "./SampleQuestions";

interface Props {
    // setIsDefaultPage: any;
    language: string;
    setLanguage: any;
    sendQuestion: any;
    setQuestion: any;
    question: string;
    selectedTopics: string[];
    setSelectedTopics: any;
    // setPage: any;
}

export const DefaultPage = ({
    language,
    setLanguage,
    setQuestion,
    question,
    sendQuestion,
    // setPage,
    selectedTopics,
    setSelectedTopics,
}: Props) => {
    // const [isDefaultPage, setIsDefaultPage] = useState(true);
    // const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const sampleQuestions = language == "en-US" ? sampleQuestionsEn : sampleQuestionsZh;

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    // const open = Boolean(anchorEl);
    // const id = open ? "simple-popover" : undefined;

    // const theme = useTheme();
    return (
        <div className={styles.container}>
            <div className={styles.defaultPageContainer}>
                <LanguageSelectButton
                    language={language}
                    setLanguage={setLanguage}
                />
                {/* <Button
                    aria-describedby={id}
                    variant="contained"
                    onClick={handleClick}
                    sx={{
                        borderRadius: 0,
                        width: 160,
                        height: 45,
                        marginTop: 1.5,
                        marginLeft: 2,
                        "&:focus": {
                            outline: "none",
                        },
                    }}
                >
                    {language == "zh-CN" && <Typography sx={{fontSize: 17, padding: "4px 0px" }}>样例搜索</Typography>}
                    {language == "en-US" && <Typography sx={{fontSize: 14.5, padding: "4px 0px" }}>Sample Search</Typography>}
                    {language == "zh-HK" && <Typography sx={{fontSize: 17, padding: "4px 0px" }}>樣例檢索</Typography>}
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    sx={{ width: "50vw" }}
                    className={styles.popover}
                >
                    {sampleQuestions.map((q, i) => {
                        return (
                            <Button
                                key={i}
                                variant="outlined"
                                sx={{
                                    borderRadius: 0,
                                    margin: 1,
                                    width: "97%",
                                }}
                                onClick={() => {
                                    setQuestion(q);
                                    handleClose();
                                }}
                            >
                                <Typography sx={{ p: 2 }}>{q}</Typography>
                            </Button>
                        );
                    })}
                </Popover> */}
                <div className={styles.centerContainer}>
                    <div className={styles.centerText}>
                        {language == "en-US" && (
                            <h1>Community Legal Information Centre</h1>
                        )}
                        {language == "zh-HK" && <h1>社區法網</h1>}
                        {language == "zh-CN" && <h1>社区法网</h1>}
                        {/* <h2>{question}</h2> */}
                    </div>
                    <div className={styles.searchContainer}>
                        <InputContainer
                            sendQuestion={sendQuestion}
                            // setPage={setPage} // This will now correctly pass the navigateTo function
                            question={question}
                            setQuestion={setQuestion}
                            language={language}
                            selectedTopics={selectedTopics}
                            setSelectedTopics={setSelectedTopics}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
