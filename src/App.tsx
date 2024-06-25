import { GlobalStyles } from './styles/globalStyles'
import { StyleSheetManager, ThemeProvider } from 'styled-components'
import { useState } from 'react'
import { darkTheme, lightTheme } from './styles/themes'
import { Navbar } from './components/Navbar'
import { AppWrapper } from './components/styled/layout'
import { Sidebar } from './components/Sidebar'
import { MainView } from './components/MainView'

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <StyleSheetManager shouldForwardProp={() => true}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles/>
        <AppWrapper>
          <Navbar/>
          <Sidebar/>
          <MainView/>
        </AppWrapper>
      </ThemeProvider>
    </StyleSheetManager>
  )
}

export default App

