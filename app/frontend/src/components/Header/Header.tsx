// import { useState} from "react";

// import github from "../../assets/github.svg";
import {useTheme}from "@mui/material/styles";
import {Box, Link} from "@mui/material";
import styles from "./Header.module.css";
import clic_logo from '../../assets/clic_logo.gif'
import HKU_logo from '../../assets/HKU_logo.svg'


const Header = () => {
    // const [language, setLanguage] = useState("en-US");
    const theme = useTheme();
    return (
        <Box sx={{backgroundColor: theme.palette.componentColor.main}} className={styles.header}>
            <div className={styles.logoContainer}>
                <a href="https://clic.org.hk/en" target="_blank">
                    <img src={clic_logo} aria-label="CLIC Official Website" alt="CLIC logo" />
                </a>
                <a href="https://www.lawtech.hk" target="_blank">
                    <img src={HKU_logo} aria-label="HKU LAWTECH Official Website" alt="HKU LAWTECH logo"  />
                </a>
            </div>
            <a 
                href="/"
                className={styles.title}
                >
                CLIC Chat
            </a>
        </Box>
    );
};

export default Header;
