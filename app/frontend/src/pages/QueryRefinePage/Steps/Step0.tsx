import {Box, InputBase, Typography, Button} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

function getPlaceHolder(language: string): string {
    if (language == "en-US") return "Search for legal information";
    if (language === "zh-HK") return "輸入法律問題";
    if (language === "zh-CN") return "输入法律问题";
    return ""
}

interface Props{
    setQuestion: any,
    setStory: any,
    question: string,
    story: string,
    language: string,
    handleNext: any,
}

export const Step0 = ({setQuestion, setStory, question, story, language, handleNext}: Props)=>{
    let placeholder = getPlaceHolder(language);
    return (
        <div>
            <Box sx = {{width: "fit-content", height: "fit-content", padding:5}}>
                <InputBase
                    placeholder={placeholder}
                    onChange={(e) => {
                        setQuestion(e.target.value);
                        setStory(e.target.value)
                    }}
                    sx={{
                        // mt: 2,
                        // ml: 16,
                        width: 800,
                        borderRadius: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        minHeight: 260,
                        maxRows: 3,
                        paddingLeft: 3,
                        paddingRight: 3,
                        paddingTop: 2,
                        paddingBottom: 1,
                        alignItems: 'start',
                    }}
                    defaultValue = {story}
                    multiline
                    inputProps={{maxLength: 2500}}
                />
                <Typography variant="body2" align="right" sx={{color: "#ccc"}}>
                    {question.length}/2500 
                </Typography>
                <Box sx={{ mb: 0, display:"flex", justifyContent:"flex-end", mt:1, mr:-20}} >
                    <Button
                        variant="contained"
                        onClick={()=>{handleNext(0)}}
                        sx={{pt: 1, pb: 1, pl: 3, pr:3}}

                    >
                        <SendIcon/>
                    </Button>
                    
                </Box>
            </Box>
            
        </div>
        
    )
}