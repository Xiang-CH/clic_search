import styles from "./TopicList.module.css";
import {
    Typography,
    Skeleton,
    Card,
    CardContent,
    CardActionArea,
    Stack,
    IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { ExpandLess, ExpandCircleDown } from "@mui/icons-material";
import { topicDescriptionDictionary, topicNameDictionary } from "./helper";

interface topicCardProps {
    topic: string;
    handleClick: any;
    showError: any;
    language: string;
}

function removeIndex(string: string): string {
    if (string.charAt(2) == " ") return string.slice(3);
    else return string.slice(4);
}

export const TopicCard = ({ topic, handleClick, showError, language}: topicCardProps) => {
    const theme = useTheme();
    const [topicName, setTopicName] = useState<string | undefined>(undefined)
    const [topicDescrip, setTopicDescrip] = useState<string | undefined>(undefined)

    useEffect(() => {
        try {
            console.log(topic)
            if (topic){
                setTopicName(topicNameDictionary[removeIndex(topic)][language])
                setTopicDescrip(topicDescriptionDictionary[removeIndex(topic)][language])
            }
            else{
                showError()
            }
        } catch {
            showError()
        }
    }, [topic]);

    return (
        <Card
            sx={{
                borderRadius: 0,
                boxShadow: 3,
                pl: 0,
                pr: 0,
                width: 700,
                ml:13,
                mt: 1,
                display: "flex",
            }}
        >
            {/* <CardActionArea> */}
            <CardActionArea
                onClick={() => {
                    handleClick(topic);
                }}
            >
                <CardContent>
                    <Typography
                        sx={{
                            marginBottom: 1,
                            // marginTop: 1,
                            fontWeight: 600,
                            fontSize: 20,
                        }}
                    >
                        {topicName}
                    </Typography>
                    
                    <Typography
                        sx={{
                            marginTop: -0,
                            // marginBottom:1,
                            // fontStyle:"italic",
                            component: "span",
                            display: "inline-block",
                        }}
                    >
                        {topicDescrip}
                    </Typography>
                    
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

interface Props {
    orderedTopicList?: string[];
    chooseTopic: any;
    showError: any;
    language: string;
}

export const TopicList = ({ orderedTopicList, chooseTopic, showError,language }: Props) => {
    const theme = useTheme();
    const [startIndex, setStartIndex] = useState<number>(0);

    useEffect(() => {
        if(!orderedTopicList){
            showError()
        }
    }, [orderedTopicList])

    return (
        <div className={styles.topicListContainer}>
            {orderedTopicList && (
                <div className={styles.topicList}>
                    {startIndex < orderedTopicList.length && (
                        <TopicCard
                            topic={orderedTopicList[startIndex]}
                            handleClick={chooseTopic}
                            showError={showError}
                            language={language}
                        />
                    )}
                    {startIndex + 1 < orderedTopicList.length && (
                        <TopicCard
                            topic={orderedTopicList[startIndex + 1]}
                            handleClick={chooseTopic}
                            showError={showError}
                            language={language}
                        />
                    )}
                    {startIndex + 2 < orderedTopicList.length && (
                        <TopicCard
                            topic={orderedTopicList[startIndex + 2]}
                            handleClick={chooseTopic}
                            showError={showError}
                            language={language}
                        />
                    )}
                </div>
            )}
            {orderedTopicList && (
                <div className={styles.buttonsContainer}>
                    <IconButton
                        className={styles.buttonUp}
                        onClick={() => {
                            if (startIndex > 2) setStartIndex(startIndex - 3);
                        }}
                    >
                        <ExpandCircleDown
                            sx={{ color: theme.palette.primary.light }}
                        />
                    </IconButton>
                    <Typography alignSelf={"center"} sx={{ color: "gray" }}>
                        {startIndex / 3 + 1} /{" "}
                        {Math.ceil(orderedTopicList.length / 3)}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            if (startIndex + 3 < orderedTopicList.length)
                                setStartIndex(startIndex + 3);
                        }}
                    >
                        <ExpandCircleDown
                            sx={{ color: theme.palette.primary.light }}
                        />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

const rows: any = [];
for (let i = 0; i < 3; i++) {
    rows.push(
        <Skeleton key={i} variant="rectangular" width={700} height={110} />
    );
}

export const TopicListSkeleton = () => {
    return (
        <Stack spacing={1} className={styles.topicListSkeleton}>
            {rows}
        </Stack>
    );
};
