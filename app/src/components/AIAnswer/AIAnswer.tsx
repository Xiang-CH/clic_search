import {
    Card,
    CardContent,
    Chip,
    Typography,
    Link,
    Icon,
    IconButton,
} from "@mui/material";
// import Parser from "html-react-parser";
// import React from 'react';
import Markdown from 'react-markdown'
import rehypeRaw from "rehype-raw";
import styles from "./AIAnswer.module.css";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import LanguageIcon from "@mui/icons-material/Language";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { useTheme } from "@mui/material/styles";

// import { SearchResult } from '../../api/models';

interface Props {
    answer: string;
    getResultPath: (title: string) => string;
    error: string | undefined;
    cardExpanded: boolean;
    setCardExpanded: any;
    language: string;
    loading: boolean;
}

export function AIAnswer({
    answer,
    getResultPath,
    error,
    cardExpanded,
    setCardExpanded,
    language,
    loading,
}: Props) {
    const [citations, setCitations] = useState<any[]>([]); // [citation1, citation2, ...
    const [fragments, setFragments] = useState<string[]>([answer]);
    const theme = useTheme();

    useEffect(() => {
        if (!error) {
            const parts = answer.split(/\[([^\]]+)\]/g);
            const tempcitations: any = [];
            const citationTitle: string[] = [];

            setFragments(
                parts.map((part, index) => {
                    if (index % 2 === 0) {
                        return part;
                    } else {
                        let citationIndex: number;
                        const splice_index =
                            part.indexOf(". ", 0) !== -1 &&
                            part.indexOf(". ", 0) < 5
                                ? part.indexOf(". ", 0) + 2
                                : 0;
                        part = part.slice(splice_index, part.length);
                        const path = getResultPath(part);

                        if (citationTitle.indexOf(part) !== -1) {
                            citationIndex = citationTitle.indexOf(part) + 1;
                        } else {
                            citationTitle.push(part);
                            citationIndex = citationTitle.length;
                            tempcitations.push({
                                label: citationIndex + ". " + part,
                                url: path,
                            });
                        }

                        // return `[\[${citationIndex}\]](${path})`;

                        return renderToStaticMarkup(
                            <Link
                                title={part}
                                href={path}
                                target="_blank"
                                color={theme.palette.accent.main}
                            >
                                <sup className={styles.supContainer}>
                                    {citationIndex}
                                </sup>
                            </Link>
                        );
                    }
                })
            );

            setCitations(tempcitations);
        }
    }, [answer]);

    return (
        <Card
            className={
                cardExpanded ? styles.expandedCardStyle : styles.cardStyle
            }
            sx={{
                borderRadius: 0,
                boxShadow: 3,
                padding: 1.5,
                paddingBottom: 0.5,
            }}
        >
            <CardContent>
                <Typography
                        style={{ marginTop: 0, fontSize: 15, fontWeight: 600, color: theme.palette.secondary.main }}
                    >
                        {language == "en-US"? "GPT Summary": language == "zh-CN"? "GPT 智能总结（预览）": "GPT 智能總結（預覽）"}
                </Typography>
     
                <IconButton
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        zIndex: 3,
                        "&:focus": { outline: "none" },
                    }}
                    onClick={() => {
                        setCardExpanded(!cardExpanded);
                    }}
                >
                    {cardExpanded ? (
                        <CloseFullscreenIcon></CloseFullscreenIcon>
                    ) : (
                        <OpenInFullIcon></OpenInFullIcon>
                    )}
                </IconButton>

                {error ? (
                    <Typography style={{ marginTop: 2 }}>
                        Error: {error}
                    </Typography>
                ) : (
                    <div>
                        <Typography
                            sx={
                                loading
                                    ? {
                                          marginTop: 2,
                                          marginBottom: 0,
                                          whiteSpace: "pre-wrap",
                                      }
                                    : {
                                          marginTop: 2,
                                          marginBottom: 2,
                                          whiteSpace: "pre-wrap",
                                      }
                            }
                            // dangerouslySetInnerHTML={{
                            //     __html: fragments.join(""),
                            // }}
                        >
                        </Typography>
                        <Markdown rehypePlugins={[rehypeRaw]}>
                            {fragments.join("")}
                        </Markdown>
                        {loading && (
                            <Typography
                                sx={{
                                    marginTop: 0,
                                    marginBottom: 2,
                                    fontWeight: 400,
                                    fontSize: 20,
                                    fontFamily: 'monospace',
                                }}
                                className={styles.loading}
                            >
                                ...
                            </Typography>
                        )}
                        <div style={{ marginLeft: "-5px" }}>
                            {citations.map((citation, index) => {
                                return (
                                    <Chip
                                        icon={
                                            <LanguageIcon
                                                style={{
                                                    color: theme.palette
                                                        .componentColor.main,
                                                }}
                                            />
                                        }
                                        key={index}
                                        label={citation.label}
                                        component="a"
                                        href={citation.url}
                                        target="_blank"
                                        variant="outlined"
                                        clickable
                                        sx={{
                                            marginBottom: 1,
                                            // marginLeft: -0.5,
                                            marginRight: 0.5,
                                            borderColor: "transparent",
                                            // color: theme.palette.componentColor.main,
                                            backgroundColor:
                                                theme.palette.backgroundColor
                                                    .main,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
