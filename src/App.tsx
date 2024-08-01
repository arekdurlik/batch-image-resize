import { GlobalStyles } from './styles/globalStyles'
import { Navbar } from './components/layout/Navbar'
import { MainView } from './components/layout/MainView'
import { Toasts } from './components/Toasts'
import { RightSidebar } from './components/layout/RightSidebar'
import { LeftSidebar } from './components/layout/LeftSidebar'
import { AppWrapper } from './components/styled'

function App() {
  return (
    <>
      <GlobalStyles/>
      <Toasts/>

      <AppWrapper>
        <Navbar/>
        <LeftSidebar/>
        <MainView/>
        <RightSidebar/>
      </AppWrapper>
    </>
  )
}

export default App;

