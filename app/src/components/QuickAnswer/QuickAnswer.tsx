
import Parser from 'html-react-parser';
// import React from 'react';
import styles from './QuickAnswer.module.css';
import { SearchResult } from '../../api/models';
import { Chip, Typography } from '@mui/material';


interface Props {
    answer: SearchResult;
}

export function QuickAnswer ( {answer}: Props){

    return (

        <div className={styles.QuickAnswer}>

            <Typography className={styles.caption} color="secondary" sx={{marginBottom:2}}>
                {answer.caption_highlight? Parser(answer.caption_highlight) : answer.caption}
            </Typography>


               <Chip
                    sx = {{paddingTop: 0.4, marginLeft:-0.5}}
                    component="a"
                    href={answer.url}
                    target="_blank"
                    label = {answer.title}
                ></Chip>

        </div>
    
    )
}