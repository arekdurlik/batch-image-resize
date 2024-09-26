import JSZip from 'jszip'
import styled from 'styled-components'
import { bytesToSizeFormatted, getFileExtension, getFileNameWithoutExtension } from '../../lib/helpers'
import { useInputImages } from '../../store/input-images'
import { useOutputImages } from '../../store/output-images'
import { OutputImageData } from '../../store/types'
import { Button } from '../ui/inputs/button'
import { MdDownload } from 'react-icons/md'
import { PercentageChange } from '../active-image/output-image-details'

export function Export() {
  const outputImages = useOutputImages(state => state.images);
  const totalInputBytes = useInputImages(state => state.totalSize);
  const totalOutputBytes = outputImages.reduce((a, b) => a + b.image.full.file.size, 0);
  const increase = totalOutputBytes > totalInputBytes;
  const percentage = (totalOutputBytes - totalInputBytes) / totalInputBytes * 100;
  const percentageRounded = Math.round(percentage * 10) / 10;

  function zipItUp(zip: JSZip, outputImages: OutputImageData[]): Promise<JSZip[]> {
    const promises: Promise<JSZip>[] = [];
    const duplicateIndexes: { [key:string]: number } = {}
    
    outputImages.forEach(outputImage => {
      promises.push(new Promise(resolve => {
        try {
          let finalFilename = outputImage.filename;

          const isDuplicate = (i: OutputImageData) => (
            i.id !== outputImage.id && i.filename === outputImage.filename
          );

          const duplicates = outputImages.filter(isDuplicate);

          if (duplicates.length > 0) {
            if (Object.prototype.hasOwnProperty.call(duplicateIndexes, outputImage.filename)) {
              const name = getFileNameWithoutExtension(finalFilename);
              const extension = getFileExtension(finalFilename);
              finalFilename = `${name} (${duplicateIndexes[outputImage.filename]}).${extension}`;

              duplicateIndexes[outputImage.filename]++;
            } else {
              duplicateIndexes[outputImage.filename] = 2;
            }
          }

          resolve(zip.file(finalFilename, outputImage.image.full.file));
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
        <Size>
        {bytesToSizeFormatted(totalInputBytes)} → ≈{bytesToSizeFormatted(totalOutputBytes)}
        <PercentageChange $value={percentageRounded}> ({increase && '+'}{percentageRounded}%)</PercentageChange>
        </Size>
      }
      <Button onClick={handleClick}>
      <MdDownload/>Export
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
border-top: 1px solid var(--borderColor-default);
background-color: var(--bgColor-default);
display: grid;
place-items: center;
gap: 5px;
z-index: 2;
padding: var(--spacing-large);
position: relative;
top: -1px;
`

const Size = styled.div`
display: flex;
gap: 5px;
`
