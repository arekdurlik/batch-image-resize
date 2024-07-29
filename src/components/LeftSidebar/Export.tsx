import JSZip from 'jszip'
import { useAppStore } from '../../store/appStore'
import { Button } from '../styled/globals'
import styled from 'styled-components'
import { OutputImageData } from '../../store/types'

export function Export() {
  const { outputImages, inputImages } = useAppStore();
  const totalInputBytes = inputImages.reduce((a, b) => a + b.image.full.size, 0)
  const totalOutputBytes = outputImages.reduce((a, b) => a + b.image.full.size, 0)
  const totalInputMb = totalInputBytes * 0.000001;
  const totalOutputMb = totalOutputBytes * 0.000001;
  const totalInputMbFormatted = `${Math.round(totalInputMb * 100) / 100}mb`;
  const totalOutputMbFormatted = `${Math.round(totalOutputMb * 100) / 100}mb`;
  
  function zipItUp(zip: JSZip, outputImages: OutputImageData[]): Promise<JSZip[]> {
    const promises: Promise<JSZip>[] = [];
    
    outputImages.forEach(({ image, filename }) => {
      promises.push(new Promise(resolve => {
        try {
          resolve(zip.file(filename.value, image.full));
        } catch {
          throw new Error(`Failed to add file ${name} to the archive.`);
        }
      }));
    });
    return Promise.all(promises);
  }
  
  async function handleClick() {
    if (!outputImages.length) return;

    const zip = new JSZip();
    
    try {
      await zipItUp(zip, outputImages);
    } catch (error) {
      console.error(error);
      return;
    }

    const blob = await zip.generateAsync({ type: 'blob', streamFiles: true });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `image_batch_${Date.now()}`;
    a.click();
  }

  return <Wrapper>
    {totalOutputMb > 0 && `${totalInputMbFormatted} → ≈${totalOutputMbFormatted}`}
    <StyledButton onClick={handleClick}>
      Export
    </StyledButton>
  </Wrapper>
}

const Wrapper = styled.div`
border-top: 1px solid ${props => props.theme.border};
display: grid;
place-items: center;
gap: 5px;
z-index: 2;
padding: 5px;
`

const StyledButton = styled(Button)`
background-color: #267e32;
color: ${props => props.theme.background};
 
svg {
  fill: ${props => props.theme.background};
}

&:hover {
  background-color: #28a539;
}
`