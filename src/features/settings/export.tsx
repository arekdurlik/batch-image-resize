import JSZip from 'jszip'
import { useMemo } from 'react'
import styled from 'styled-components'
import { bytesToSizeFormatted } from '../../lib/helpers'
import { useInputImages } from '../../store/input-images'
import { useOutputImages } from '../../store/output-images'
import { OutputImageData } from '../../store/types'
import { Button } from '../ui/inputs/button'

export function Export() {
  const totalInputBytes = useInputImages(state => state.totalSize);
  const outputImages = useOutputImages(state => state.images);
  const totalOutputBytes = useMemo(() => outputImages.reduce((a, b) => a + b.image.full.file.size, 0), [outputImages]);
  
  function zipItUp(zip: JSZip, outputImages: OutputImageData[]): Promise<JSZip[]> {
    const promises: Promise<JSZip>[] = [];
    
    outputImages.forEach(({ image, filename }) => {
      promises.push(new Promise(resolve => {
        try {
          resolve(zip.file(filename, image.full.file));
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

  return (
    <Wrapper>
      {totalOutputBytes > 0 && 
        `${bytesToSizeFormatted(totalInputBytes)} → ≈${bytesToSizeFormatted(totalOutputBytes)}`
      }
      <Button onClick={handleClick}>
        Export
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
border-top: 1px solid var(--borderColor-default);
display: grid;
place-items: center;
gap: 5px;
z-index: 2;
padding: 5px;
`
