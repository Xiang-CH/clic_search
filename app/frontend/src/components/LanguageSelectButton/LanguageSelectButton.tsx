import {Box, FormControl, Select, MenuItem} from '@mui/material';
import { SelectChangeEvent } from "@mui/material/Select";
import styles from './LanguageSelectButton.module.css'

interface Props{
    language: string;
    setLanguage: any;
}

export function LanguageSelectButton({language, setLanguage}: Props){
    const handleChangeSelect = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as string);
      };
    const color = ' #483939'
    return (
        <Box className={styles.lanBox} sx={{ minWidth: 120, position: 'absolute', top:5, right: 10}} >
            <FormControl fullWidth>
                {/* <InputLabel id="language-select" sx={{color:"white"}}>LANGUAGE</InputLabel> */}
                <Select
                    className = {styles.Select}
                    labelId="langage-select"
                    id="language-select"
                    value={language}
                    defaultValue={language}
                    // label="Language"
                    placeholder="Language"
                    onChange={(handleChangeSelect)}
                    sx={{
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: color,

                        },
                        '.MuiOutlinedInput-notchedOutline:focused': {
                            borderColor: color,
                        },
                        height: 45,
                        width: 120,
                        color: color,
                        borderRadius: 0,
                        border: 0.75,
                        }}
                    //https://mui.com/base-ui/react-select/
                    >
                    <MenuItem value={"en-US"}>English</MenuItem>
                    <MenuItem value={"zh-CN"}>简体中文</MenuItem>
                    <MenuItem value={"zh-HK"}>繁體中文</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}