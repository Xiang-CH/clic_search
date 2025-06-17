import { LinearProgress, createTheme, ThemeProvider} from '@mui/material';
import styles from './ProgressBar.module.css';

interface Props {
    progress: number;
}

const theme = createTheme({
    components:{
        MuiLinearProgress:{
            styleOverrides:{
                root:{
                    height: '7px',
                    backgroundColor: '#E5E5E5',
                    width: "70%",
                    borderRadius: '2px'
                    
                },

                bar:{
                    backgroundColor: '#e06856',
                    width: "100%",
                    borderRadius: '2px'
                }
            }
        }
    }
})

export default function LinearWithValueLabel({progress}: Props) {
  return (
    <div className = {styles.progressBarContainer}>
        <ThemeProvider theme={theme}>
            <LinearProgress 
                variant="determinate" 
                value={progress} 
            />
        </ThemeProvider>
    </div>
    
  );
}