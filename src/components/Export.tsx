import JSZip from 'jszip'
import { MdFileDownload } from "react-icons/md";
import { useAppStore } from '../store/appStore'
import { Button } from './styled/globals'
import styled from 'styled-components'
import pica from 'pica'

type ImageData = { blob: Blob, name: string, prefix: string }

const resizer = new pica({ features: ['js', 'wasm', 'ww']});

export function Export() {
  const { images, variants } = useAppStore();

  function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      try {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = URL.createObjectURL(file);
      } catch {
        throw new Error(`Error loading image from file "${file.name}".`);
      }
    })
  }

  function resizeImage(image: HTMLImageElement): Promise<HTMLCanvasElement> {
    return new Promise(resolve => {
      try {
        const offScreenCanvas = document.createElement('canvas');
        // TODO: implement resizing
        offScreenCanvas.width = image.width;
        offScreenCanvas.height = image.height;
        const resized = resizer.resize(image, offScreenCanvas);
        resolve(resized);
      } catch {
        throw new Error('Failed to resize image.');
      }
    })
  }

  function imageToBlob(image: HTMLCanvasElement): Promise<Blob> {
    return new Promise(resolve => {
      try {
        const blob = resizer.toBlob(image, 'image/jpeg');
        resolve(blob);
      } catch {
        throw new Error('Failed to convert image to blob.');
      }
    })
  }
  
  async function blobItUp(): Promise<ImageData[]> {
    const promises: Promise<ImageData>[] = [];

    for (let i = 0; i < images.length; i++) {
      for (let j = 0; j < variants.length; j++) {
        const prefix = variants[j].prefix;
        const file = images[i].file;

        const image = await loadImage(file);
        const resized = await resizeImage(image);
        const blob = await imageToBlob(resized);
        promises.push(new Promise((resolve) => resolve({ blob, name: file.name, prefix })));
      }
    }
    return Promise.all(promises);
  }
  
  function zipItUp(zip: JSZip, blobs: ImageData[]): Promise<JSZip[]> {
    const promises: Promise<JSZip>[] = [];
    
    blobs.forEach(({ blob, name, prefix }) => {
      promises.push(new Promise(resolve => {
        try {
          resolve(zip.file(prefix + name, blob));
        } catch {
          throw new Error(`Failed to add file ${name} to the archive.`);
        }
      }));
    })
    return Promise.all(promises);
  }
  
  async function handleClick() {
    if (!images.length) return;
    
    let blobs: ImageData[];
    try {
      blobs = await blobItUp();
    } catch (error) {
      console.error(error);
      return;
    }
    
    const zip = new JSZip();
    
    try {
      await zipItUp(zip, blobs);
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

  return <StyledButton onClick={handleClick}>
    <MdFileDownload/>Export
  </StyledButton>
}

const StyledButton = styled(Button)`
background-color: #258d33;
color: #fff;
`