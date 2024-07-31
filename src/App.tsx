import { GlobalStyles } from './styles/globalStyles'
import { ThemeProvider } from 'styled-components'
import { useState } from 'react'
import { darkTheme, lightTheme } from './styles/themes'
import { Navbar } from './components/layout/Navbar'
import { AppWrapper } from './components/styled/layout'
import { MainView } from './components/layout/MainView'
import { Toasts } from './components/Toasts'
import { RightSidebar } from './components/layout/RightSidebar'
import { LeftSidebar } from './components/layout/LeftSidebar'

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles/>
      <Toasts/>

      <AppWrapper>
        <Navbar/>
        <LeftSidebar/>
        <MainView/>
        <RightSidebar/>
      </AppWrapper>
      
    </ThemeProvider>
  )
}

export default App

