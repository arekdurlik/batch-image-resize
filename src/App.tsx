import { GlobalStyles } from './styles/globalStyles'
import { AppWrapper } from './components/layout'
import { Sidebar } from './components/sidebar'
import { ThemeProvider } from 'styled-components'
import { useState } from 'react'
import { darkTheme, lightTheme } from './styles/themes'
import { MainView } from './components/mainView'

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <AppWrapper>
        <GlobalStyles/>
        <Sidebar/>
        <MainView/>
      </AppWrapper>
    </ThemeProvider>
  )
}

export default App
