import { useEffect, useState } from "react";
import {
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Theme,
    useTheme,
    OutlinedInput,
    Chip,
    Box,
    Checkbox,
    ListItemText,
} from "@mui/material";
// import styles from './Filter.module.css';
import { getTopicApi } from "../../api/api";
import { TopicNames } from "../../api/models";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(
    topic: string,
    selectedTopics: readonly string[],
    theme: Theme
) {
    return {
        fontWeight:
            selectedTopics.indexOf(topic) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

interface Props {
    selectedTopics: string[];
    setSelectedTopics: any;
    language: string;
}

export function FilterMultiple({
    selectedTopics,
    setSelectedTopics,
    language,
}: Props) {
    const theme = useTheme();
    const [topicList, setTopicList] = useState<string[] | undefined>(undefined);
    const [topicNames, setTopicNames] = useState<TopicNames | undefined>(
        undefined
    );

    useEffect(() => {
        if (!topicList || !topicNames) {
            getTopicApi().then((res) => {
                setTopicNames(res);
                // for (name) in res:
                //     name['en'] = camelToNormal(name['en']);
                setTopicList(Object.keys(res));
            });
        }
    }, []);

    const handleChange = (event: SelectChangeEvent<typeof selectedTopics>) => {
        const {
            target: { value },
        } = event;
        setSelectedTopics(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    const removeTopic =  (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log(event.currentTarget.getAttribute("key"));
        event.preventDefault();
        const topic = event.currentTarget.getAttribute("key");
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    }

    const filterLabelStyle = {
        marginTop: "0",
        fontSize: "1rem",
        fontWeight: 400,
        border: "0 solid transparent",
    };

    return (
        <div style={{ display: "inline" }}>
            {topicList && topicNames && (
                <FormControl sx={{ width: 530, border: "none" }} size="small">
                    <InputLabel
                        id="search-filter-label"
                        style={filterLabelStyle}
                    >
                        {(language == "en-US" && "Filter") ||
                            (language == "zh-HK" && "篩選器") ||
                            (language == "zh-CN" && "筛选器")}
                    </InputLabel>
                    <Select
                        labelId="search-filter-label"
                        id="search-filter"
                        multiple
                        value={selectedTopics}
                        defaultValue={selectedTopics}
                        onChange={handleChange}
                        style={{
                            borderRadius: 0,
                            border: "none",
                            padding: 1,
                            minHeight: 30,
                            backgroundColor: "white",
                        }}
                        // variant="standard"
                        input={
                            <OutlinedInput
                                id="search-filter-chip"
                                label="Chip"
                            />
                        }
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                }}
                            >
                                {selected.map((topic) => (
                                    <Chip
                                        key={topic}
                                        label={topicNames[topic][language]}
                                        onClick={(e) => {removeTopic(e)}}
                                    />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {topicList.map((topic) => (
                            <MenuItem
                                key={topic}
                                value={topic}
                                style={getStyles(topic, selectedTopics, theme)}
                            >
                                {/* {camelToNormal(topic)} */}
                                <Checkbox
                                    checked={selectedTopics.indexOf(topic) > -1}
                                />
                                <ListItemText
                                    primary={topicNames[topic][language]}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </div>
    );
}
