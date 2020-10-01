import { MimeMediaType, Sides } from 'ipp';

export interface CUPSPrinterAttributes {
  'document-format-supported': MimeMediaType[];
  'color-supported': boolean;
  'sides-supported': Sides[];
  'number-up-supported': number[];
  'page-ranges-supported': boolean;
}
