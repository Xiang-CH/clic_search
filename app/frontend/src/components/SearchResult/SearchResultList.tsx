import { SearchResultBlock } from "./SearchResultBlock";
import { SearchResult } from "../../api/models";
import { QuickAnswer } from "../QuickAnswer/QuickAnswer";
import styles from "./SearchResult.module.css";

interface Props {
    searchResult: SearchResult[];
    quickAnswer: SearchResult | undefined;
}

export const SearchResultList = ({searchResult, quickAnswer} : Props) => {

    return (
        <div className={styles.searchResultList}>
            {quickAnswer && <QuickAnswer answer={quickAnswer}/>}
            {searchResult.map((row, index) => (
                <SearchResultBlock 
                    key={index} 
                    title={row.title} 
                    caption={row.caption} 
                    hightlight={row.caption_highlight} 
                    topic={row.topic} 
                    url={row.url}
                    index = {index}
                />
            ))}
        </div>
    );
};
