import { MdFileDownload } from "react-icons/md";
import { useAppStore } from '../store/appStore'
import { Button } from './styled/globals'
import styled from 'styled-components'

export function Export() {
  const { images, variants } = useAppStore();

  async function handleClick() {
    if (!images.length) return;
   
  }

  return <StyledButton onClick={handleClick}>
    <MdFileDownload/>Export
  </StyledButton>
}

const StyledButton = styled(Button)`
background-color: #258d33;
color: #fff;
`