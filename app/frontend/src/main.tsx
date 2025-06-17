import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {theme} from './theme/theme'
import {ThemeProvider} from '@mui/material/styles'
import { BrowserRouter as Router } from 'react-router';
  
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Router>
			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>
		</Router>
	</React.StrictMode>
)
