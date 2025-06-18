
import { Card, CardActionArea, CardContent, Typography, autocompleteClasses, Box } from '@mui/material';
import styles from './SearchResult.module.css';
import Parser from 'html-react-parser';
import {useTheme} from '@mui/material/styles'

interface Props {
    title: string;
    caption: string | null;
    topic: string;
    url: string;
    hightlight: string | null;
    index: number;
    reranker_score: number | null;
    score: number;
}

export const SearchResultBlock = ({title, caption, topic, url, hightlight, index, reranker_score, score}: Props) => {

    const toSentenceCase = (camelCase: string) => {
        if (camelCase) {
            var result = camelCase.replace(/([A-Z])/g, ' $1');
            if (result == "bankcruptcy") {
                result = "bankruptcy";
            }
            return result.replace(/^\w/, (c) => c.toUpperCase());
            // return result[0].toUpperCase() + result.substring(1).toLowerCase();
        }
        return '';
    };
    const theme = useTheme()
    return (
        // <div className={styles.searchResultCard}>
            <Card className={styles.searchResultCard} sx = {{borderRadius: 0, boxShadow: 3, paddingLeft: 0, paddingRight: 0}}>
                <div className={styles.indicator}></div>
                <CardActionArea href={url} target="_blank" sx={{paddingLeft: 2, paddingRight: 2}}>
                 
                    <CardContent>
                        <Typography sx={{marginBottom:2, marginTop:1, fontWeight:600, fontSize: 20}}>{title}</Typography>
                        {hightlight? 
                            (<Typography color="secondary" className={styles.caption}>{Parser(hightlight)}</Typography>):
                            (<Typography color="secondary" className={styles.caption}>{caption}</Typography>)
                        }
                        <Box
                            sx = {{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                            <Typography 
                                sx={{
                                    marginTop: 2, 
                                    // marginBottom:1, 
                                    fontStyle:"italic", 
                                    component: "span",
                                    display: "inline-block",
                                    backgroundColor: theme.palette.accent.light,}}>
                                        # {(topic[0] == topic[0].toUpperCase()? topic : toSentenceCase(topic))}
                            </Typography>
                            <Typography
                                color = "secondary"
                                sx={{
                                    marginTop: 1, 
                                    marginBottom:1, 
                                    left: 0,
                                    component: "span",
                                    display: "inline-block"}}>
                                        Rank {index + 1}
                            </Typography>
                        </Box>
                        {reranker_score && <Typography color = "secondary" sx={{marginBottom:1, left: 0, component: "span", display: "inline-block"}}>reranker_score: {reranker_score.toFixed(2)}</Typography> } {"    "}
                        <Typography color = "secondary" sx={{marginBottom:1, left: 0, component: "span", display: "inline-block"}}>search_score: {score.toFixed(4)}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        // </div>
    )
}