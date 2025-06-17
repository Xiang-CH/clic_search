import { RefineQuestionList, RefineQuestionListSkeleton } from "../../../components/RefineQuestion/RefineQuestion"

import {Box, Button} from "@mui/material"

interface Props{
    onSend: any,
    isLoading: boolean,
    questionList?: string[],
    setQuestion: any,
    handleBack: any,
}

export const Step2 = ({onSend, isLoading, questionList, setQuestion, handleBack}:Props)=>{
    return (
        <div>
            {!isLoading? <div>
                <RefineQuestionList
                    questionList={questionList}
                    onSend={onSend}
                    setQuestion={setQuestion}
                />
                {/* <Box sx={{ mb: 4, display:"flex", justifyContent:"flex-end", mr: -28, mt:2}} >
                    <Button
                        variant="outlined"
                        onClick={()=>{handleBack(1)}}
                    >
                        Back
                    </Button>
                    
                </Box> */}
            </div> : <RefineQuestionListSkeleton/>}
            
        </div>
    )
}