import { THUMBNAIL_SIZE } from '../../lib/constants'
import { Log } from '../../lib/log'
import { processImage } from '../../lib/utils'
import { openToast, ToastType } from '../toasts'
import { InputImageData, UploadedImage } from '../types'
import { v1 as uuid } from 'uuid'

export async function generateInputImage(image: UploadedImage): Promise<InputImageData | null> {
  Log.debug_verbose('Generating input image', { image });
  let inputImage: InputImageData | null = null;

  try {
      const id = uuid();
      const { file, height, width } = image;
      const processed = await processImage(file, 1, THUMBNAIL_SIZE, undefined);

      inputImage = { 
        id, 
        index: 0,
        image: {
          full: file,
          thumbnail: processed.blob,
        }, 
        filename: file.name, 
        dimensions: { 
          width, 
          height 
        }
      };
      
  } catch (error) {
    if (String(error).includes('fingerprint')) {
      openToast(
        ToastType.ERROR, 
        "Error generating input image. Make sure fingerprinting protection isn't enabled in the browser settings."
      );
    } else {
      throw error;
    }
  }
  
  return inputImage;
}