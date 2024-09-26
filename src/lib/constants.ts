import { PicaFilter } from '../store/types'

export const THUMBNAIL_SIZE = 150;
export const SECTION_HEADER_HEIGHT = 50;
export const OVERLAY_ID = 'overlay';

export const OVERLAY_Z_INDEX = {
  TOOLTIP: 1,
  DROPDOWN: 2,
}

export const picaFilters: { [key in PicaFilter]: string } = {
  box: 'Box',
  hamming: 'Hamming',
  lanczos2: 'Lanczos',
  lanczos3: 'Lanczos',
  mks2013: 'MKS2013'

}