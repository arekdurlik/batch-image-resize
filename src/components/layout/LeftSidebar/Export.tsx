import JSZip from 'jszip'
import styled from 'styled-components'
import { OutputImageData } from '../../../store/types'
import { useAppStore } from '../../../store/appStore'
import { Button } from '../../styled/globals'
import { useMemo } from 'react'
import { bytesToSizeFormatted } from '../../../helpers'

export function Export() {
  const { outputImages, totalInputImagesSize } = useAppStore();
  const totalInputBytes = totalInputImagesSize;
  const totalOutputBytes = useMemo(() => outputImages.reduce((a, b) => a + b.image.full.size, 0), [outputImages]);
  
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
    {totalOutputBytes > 0 && 
      `${bytesToSizeFormatted(totalInputBytes)} → ≈${bytesToSizeFormatted(totalOutputBytes)}`
    }
    <StyledButton onClick={handleClick}>
      Export
    </StyledButton>
  </Wrapper>
}

const Wrapper = styled.div`
border-top: 1px solid var(--borderColor-default);
display: grid;
place-items: center;
gap: 5px;
z-index: 2;
padding: 5px;
`

const StyledButton = styled(Button)`
background-color: #267e32;
color: var(--bgColor-default);
 
svg {
  fill: var(--bgColor-default);
}

&:hover {
  background-color: #28a539;
}
`