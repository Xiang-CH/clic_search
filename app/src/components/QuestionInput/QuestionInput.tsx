import {
    InputBase,
    Button,
    Tooltip,
    InputAdornment,
    Typography,
    Box,
    TextField,
    Input,
} from "@mui/material";
import styles from "./QuestionInput.module.css";
import { Search, AutoFixHigh } from "@mui/icons-material";
import { theme } from "../../theme/theme";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
// import { VectorSwitch } from '../VectorSwitch/VectorSwitch'
interface Props {
    sendQuestion: any;
    question: string;
    setQuestion: any;
    language?: string;
}

export function QuestionInput({
    sendQuestion,
    question,
    setQuestion,
    language,
}: Props) {
    let placeholder = "";
    if (language) {
        if (language == "en-US") placeholder = "Search for legal information";
        if (language === "zh-HK") placeholder = "輸入法律問題";
        if (language === "zh-CN") placeholder = "输入法律问题";
    }
    const theme = useTheme();
    const wordLimit = 2500;
    const [inputFocus, setInputFocus] = useState<boolean>(false);

    const inputOnFocus = (e: any) => {
        console.log("inputOnFocus", e.currentTarget)
        setInputFocus(true);

    }


    const inputOnBlur = (e: any) => {
        setTimeout(() => {setInputFocus(false)}, 50);
    }

    return (
        <div className={styles.searchInputContainer}>
            <div className={styles.searchInputOuter} id="searchInputOuter">
                <Box
                    className={styles.searchInput}
                    sx={{
                        position: "relative",
                        width: 645,
                        // zIndex:3,
                        // height: "fit-content",
                        borderRadius: 0,
                        border: "1px solid #ccc",
                        backgroundColor: "white",
                        padding: "10px 12px 10px 12px",
                        // resize: "vertical",
                        // display: "flex",
                        // alignItems: "center",
                        "&:focus-within": {
                            border: "1px solid " + theme.palette.primary.main,
                            boxShadow: "0 0.5px 5px 1.5px rgba(0,0,0,0.15)"
                        },
                        "&:hover": {
                            border: "1px solid " + theme.palette.primary.main
                        },
                    }}
                >
                    <InputBase
                        placeholder={placeholder}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendQuestion();
                            }
                        }}
                        onChange={(e) => {
                            setQuestion(e.target.value);
                        }}
                        id="outlined-multiline-flexible"
                        maxRows={inputFocus? 5 : 1}
                        sx={{
                            width: "100%",
                            minHeight: 25,
                            // height: 25,
                            // maxHeight: 148,
                            resize: "vertical",
                            padding: 0,
                            boxSizing: "border-box",
                            alignContent: "flex-start",
                            flexDirection: "column",
                            // overflowY: "auto",
                            // overflow:"scroll",
                            border: "none",
                        }}
                        value={question}
                        multiline
                        onFocus={inputOnFocus}
                        onBlur={inputOnBlur}
                        // inputProps={{maxLength: wordLimit}}
                    ></InputBase>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.secondary.light,
                            position: "absolute",
                            right: "4px",
                            bottom: "1px",
                            opacity: 0.5,
                            fontSize: "0.7rem",
                        }}
                    >
                        {question.length}/{wordLimit}
                    </Typography>
                </Box>
            </div>

            {/* <div className={styles.buttonContainer}>
                <div className={styles.buttons}>
                    <Tooltip title="Search" sx={{ margin: 0 }}>
                        <Button
                            className={styles.searchButton}
                            sx={{
                                color: "white",
                                borderRadius: 0,
                                boxShadow: 1,
                                backgroundColor: theme.palette.primary.main,
                                border: "1px solid " + theme.palette.primary.main,
                                "&:hover": {
                                    color: theme.palette.primary.main,
                                    backgroundColor: "#d4d4d4",
                                    border: "1px solid " + theme.palette.primary.main,
                                }
                            }}
                            onClick={() => {
                                sendQuestion();
                            }}
                        >
                            <Search />
                        </Button>
                    </Tooltip>
                    <Tooltip title="AI refine search">
                        <Button
                            className={styles.refineButton}
                            sx={{
                                color: "white",
                                borderRadius: 0,
                                boxShadow: 1,
                                backgroundColor: theme.palette.primary.main,
                                border: "1px solid " + theme.palette.primary.main,
                                "&:hover": {
                                    color: theme.palette.primary.main,
                                    backgroundColor: "#d4d4d4",
                                    border: "1px solid " + theme.palette.primary.main,
                                }
                            }}
                            onClick={() => {
                                setPage("refine")
                            }}
                        >
                            <AutoFixHigh />
                        </Button>
                    </Tooltip>
                </div>
            </div> */}
        </div>
    );
}
