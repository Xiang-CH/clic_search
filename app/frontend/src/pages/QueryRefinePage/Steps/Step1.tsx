import {TopicList, TopicListSkeleton} from '../../../components/TopicList/TopicList'
import {refineResponse} from '../../../api/models'
import {Box, Button} from '@mui/material'

interface Props{
    orderedTopicList?: string[]
    isLoading: boolean
    chooseTopic: any
    showError: any
    language: string
}

export const Step1 = ({orderedTopicList, isLoading, chooseTopic, showError, language}:Props) =>{
    return (
        <div>
            {!isLoading? <div>
                <TopicList
                    // orderedTopicList={["1", "2", "3"]}
                    orderedTopicList={orderedTopicList}
                    chooseTopic={chooseTopic}   
                    showError={showError}
                    language={language}
                />
                {/* <Box sx={{ mb: 0, display:"flex", justifyContent:"flex-end", mr: -13, mt:2}} >
                    <Button
                        variant="outlined"
                        onClick={()=>{handleBack(1)}}
                    >
                        Back
                    </Button>
                    
                </Box> */}
            </div> : <TopicListSkeleton/>}
            
        </div>
    )
}