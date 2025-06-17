import styles from './SearchResult.module.css';
import { Skeleton, Stack } from '@mui/material';

// https://mui.com/material-ui/react-skeleton/

const rows: any = [];
for (let i = 0; i < 10; i++) {
    // note: we are adding a key prop here to allow react to uniquely identify each
    // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
    rows.push(<Skeleton key={i} variant="rectangular" width={670} height={170}/>);
}

export const SkeletonResultList = () => {
    return (
        <div className={styles.searchResultList}>
            <Stack spacing={2}>
                {rows}
            </Stack>
        </div>
    )
}