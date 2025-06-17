
import styles from './RefineQuestion.module.css';
import { Typography, Card, CardActionArea, CardContent, Skeleton, Stack, IconButton } from '@mui/material';
import {ExpandCircleDown} from '@mui/icons-material'
import {useTheme} from '@mui/material/styles'
import {useState} from 'react';

interface questionCardProps {
    content: string,
    handleClick: any,
}
const format = (content: string)=>{
    if (content.charAt(2) == ' ')
        return content.slice(3)
    else return content.slice(4)
}

export const RefineQuestionCard = ({content, handleClick}: questionCardProps) => {
    const theme = useTheme()
    return (
        <Card sx = {{borderRadius: 0, boxShadow: 3, pl: 0, pr: 0, width: 700, ml:13, mt:1, display: "flex"}}>
            {/* <CardActionArea> */}
            <CardActionArea onClick = {()=>{handleClick(content)}}>
                <CardContent>
                    <Typography sx={{marginBottom:1, marginTop:1, fontWeight:600, fontSize: 20}}>{format(content)}</Typography>
                </CardContent>
            </CardActionArea>

        </Card>
    )
}

interface Props {
    questionList?: string[],
    setQuestion: any,
    onSend: any,
}



export const RefineQuestionList = ({questionList, onSend, setQuestion,}:Props) => {
    const [startIndex,setStartIndex] = useState<number>(0)
    
    const handelClick = (content: string) => {
        console.log("clicked")
        content = format(content)
        setQuestion(content)
        onSend(content)
        // onSend(question)
    }
    const theme = useTheme()
    return(
        <div className = {styles.questionListContainer}>
            {questionList && <div>
                {(startIndex < questionList.length) && <RefineQuestionCard
                    content = {questionList[startIndex]}
                    handleClick = {handelClick}
                    
                />}
                {(startIndex + 1 < questionList.length) && <RefineQuestionCard 
                    content = {questionList[startIndex+1]}
                    handleClick = {handelClick}
                />}
                {(startIndex + 2 < questionList.length) && <RefineQuestionCard 
                    content = {questionList[startIndex+2]}
                    handleClick = {handelClick}
                />}
            </div>}
            {questionList && <div className = {styles.buttonsContainer}>
                <IconButton 
                    className = {styles.buttonUp}
                    onClick = {()=>{
                        if (startIndex > 2)
                            setStartIndex(startIndex - 3)
                    }}>
                    <ExpandCircleDown
                        sx={{color: theme.palette.primary.light}}
                    />
                </IconButton>
                <Typography alignSelf={"center"} sx={{color: "gray"}}>
                    {startIndex/3+1}  / 4
                </Typography>
                <IconButton
                    onClick = {()=>{
                        if (startIndex + 3 < questionList.length)
                            setStartIndex(startIndex + 3)
                    }}>
                    <ExpandCircleDown
                        sx={{color: theme.palette.primary.light}}
                    />
                </IconButton>
            </div>}
        </div>
        
    )
}

const rows: any = [];
for (let i = 0; i < 3; i++) {
    rows.push(<Skeleton key = {i} variant="rectangular" width={700} height={110}/>);
}

export const RefineQuestionListSkeleton = () => {
    return (
        <Stack spacing={1} className = {styles.refineQuestionListSkeleton}>
                {rows}
        </Stack>
    )
}