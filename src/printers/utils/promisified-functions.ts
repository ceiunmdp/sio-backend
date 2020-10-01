import { Promise } from 'bluebird';
import {
  GetJobAttributesRequest,
  GetJobAttributesResponse,
  GetPrinterAttributesRequest,
  GetPrinterAttributesResponse,
  Printer,
  PrintJobRequest,
  PrintJobResponse,
} from 'ipp';

export const getPrinterAttributes = Promise.promisify(
  (
    printer: Printer,
    message: GetPrinterAttributesRequest,
    callback?: (error: Error, response: GetPrinterAttributesResponse) => void,
  ) => printer.execute('Get-Printer-Attributes', message, callback),
);

export const printJob = Promise.promisify(
  (printer: Printer, message: PrintJobRequest, callback?: (error: Error, response: PrintJobResponse) => void) =>
    printer.execute('Print-Job', message, callback),
);

export const getJobAttributes = Promise.promisify(
  (
    printer: Printer,
    message: GetJobAttributesRequest,
    callback?: (error: Error, response: GetJobAttributesResponse) => void,
  ) => printer.execute('Get-Job-Attributes', message, callback),
);
