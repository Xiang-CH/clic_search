import { createTheme, ThemeProvider } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        backgroundColor: Palette['primary'];
        accent: Palette['primary'];
        componentColor: Palette['primary'];
    }
  
    interface PaletteOptions {
        backgroundColor?: PaletteOptions['primary'];
        accent?: PaletteOptions['primary'];
        componentColor?: PaletteOptions['primary'];
    }
}

export const theme = createTheme({
	palette: {
		primary:{ main: '#702e2e'},
		secondary:{ main: '#535252'},
		backgroundColor: { main: '#e5dfd5', dark:"#171615"},
        accent:{ main: '#ecce5e', light: '#f7eaae', dark: '#d4c17a'},
        componentColor:{main: '#381c1c',}
	},
	typography: {
		fontFamily: [
			"Noto Sans",
            "Noto Sans HK",
            "Noto Sans SC",
            "sans-serif"
		].join(','),
        
	},
})

