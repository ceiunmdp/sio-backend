import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { readFileSync } from 'fs-extra';
import * as ipp from 'ipp';
import { multirange } from 'multi-integer-range';
import { PDFDocument } from 'pdf-lib';
import { File } from 'src/files/entities/file.entity';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { Configuration } from 'src/orders/order-files/entities/configuration.entity';
import { OrderFile } from 'src/orders/order-files/entities/order-file.entity';
import { Printer } from './entities/printer.entity';
import { CUPSPrinterAttributes } from './interfaces/cups-printer-attributes.interface';
import { getJobAttributes, getPrinterAttributes, printJob } from './utils/promisified-functions';

@Injectable()
export class PrintersService {
  // private browser: mdns.Browser;
  private printersMap: Map<string, Printer> = new Map();

  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = PrintersService.name;
    // this.setBrowserConfiguration();

    // TODO: Momentary
    const ids = [
      'be279206-4fef-458a-bc11-4caded8cbc3e',
      '3f01e0f4-b2fa-4cb7-b725-e21a0df5a0c5',
      'bfe6455c-a452-4941-8544-32fbebb49019',
    ];

    this.printersMap.set(
      ids[0],
      new Printer({
        id: ids[0],
        name: 'Ricoh Aficio MP5000',
        host: 'localhost',
        port: 631,
        path: '/printers/RICOH_AFICIO_MP5000',
      }),
    );
    this.printersMap.set(
      ids[1],
      new Printer({
        id: ids[1],
        name: 'Ricoh SP 3710DN',
        host: 'localhost',
        port: 631,
        path: '/printers/RICOH_SP_3710DN',
      }),
    );
    this.printersMap.set(
      ids[2],
      new Printer({ id: ids[2], name: 'EPSON L210', host: 'localhost', port: 631, path: '/printers/EPSON_L210' }),
    );
  }

  // private setBrowserConfiguration() {
  //   mdns.Browser.defaultResolverSequence[1] =
  //     'DNSServiceGetAddrInfo' in mdns.dns_sd
  //       ? mdns.rst.DNSServiceGetAddrInfo()
  //       : mdns.rst.getaddrinfo({ families: [4] });

  //   this.browser = mdns.createBrowser(mdns.tcp('ipp'));

  //   this.browser.on('serviceUp', (service) => {
  //     this.logger.log(`Added printer: ${service.name}`);
  //     this.printersMap.set(service.txtRecord.UUID, this.createPrinter(service));
  //   });

  //   this.browser.on('serviceDown', ({ name }) => {
  //     this.logger.log(`Removed printer: ${name}`);
  //     this.printersMap.forEach((printer, id) => {
  //       if (printer.name === name) {
  //         this.printersMap.delete(id);
  //       }
  //     });
  //   });

  //   this.browser.start();
  // }

  // private createPrinter({ name, host, port, txtRecord: { UUID, rp } }: mdns.Service) {
  //   return new Printer({ id: UUID, name, host, port, path: rp });
  // }

  findAll() {
    return Array.from(this.printersMap.values());
  }

  findOne(id: string) {
    if (this.printersMap.has(id)) {
      return this.printersMap.get(id);
    } else {
      throw new NotFoundException(`Impresora ${id} no encontrada.`);
    }
  }

  // async printFile(printerId: string, file: File, configuration: Configuration) {
  //   const printer = new ipp.Printer(this.findOne(printerId).getUrl());

  //   // const printer = new ipp.Printer('http://localhost:631/printers/Ricoh_Aficio_MP_5500');
  //   // const printer = new ipp.Printer('http://localhost:631/printers/Ricoh_Aficio_MP_8000');
  //   // const printer = new ipp.Printer('http://localhost:631/printers/Savin_8060');

  //   await this.checkIfConfigurationIsSupported(printer, file.mimetype, configuration);
  //   // await this.checkIfConfigurationIsSupported(printer, null, configuration);

  //   return this.sendJob(printer, file, configuration);

  //   // TODO: Once the job is finished, file state should change to "Printed"
  // }

  async printFile(printerId: string, file: File, configuration: Configuration, cb: () => Promise<OrderFile>) {
    //* Once the job is finished, file state should change to "Printed"
    setTimeout(async () => {
      try {
        await cb();
      } catch (err) {
        // TODO: Decide what to do
        console.log(err);
      }
    }, 15 * 1000);
  }

  private async checkIfConfigurationIsSupported(printer: ipp.Printer, mimetype: string, configuration: Configuration) {
    try {
      const printerAttributes = await getPrinterAttributes(printer, {
        'operation-attributes-tag': {
          'requesting-user-name': 'System',
          'requested-attributes': [
            'document-format-supported',
            'color-supported',
            'sides-supported',
            'page-ranges-supported',
            'number-up-supported',
            'orientation-requested-supported',
          ],
        },
      });
      this.checkConfigurations(printerAttributes, mimetype, configuration);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private checkConfigurations(
    response: ipp.GetPrinterAttributesResponse,
    mimetype: string,
    { colour, doubleSided, slidesPerSheet }: Configuration,
  ) {
    const printerAttributes = response['printer-attributes-tag'] as CUPSPrinterAttributes;

    if (!printerAttributes['document-format-supported'].includes(mimetype as ipp.MimeMediaType)) {
      throw new BadRequestException('La impresora no soporta el formato del archivo.');
    }
    if (colour && !printerAttributes['color-supported']) {
      throw new BadRequestException('Impresi??n color no soportada por la impresora.');
    }
    if (doubleSided && !printerAttributes['sides-supported'].includes('two-sided-long-edge')) {
      throw new BadRequestException('Impresi??n doble faz no soportada por la impresora.');
    }
    if (!printerAttributes['page-ranges-supported']) {
      throw new BadRequestException('Impresi??n mediante rangos de p??ginas no soportada por la impresora.');
    }
    if (!printerAttributes['number-up-supported'].includes(slidesPerSheet)) {
      throw new BadRequestException(
        `La impresi??n de ${slidesPerSheet} filminas por carilla no est?? soportada por la impresora.`,
      );
    }
  }

  private async sendJob(
    printer: ipp.Printer,
    file: File,
    { colour, doubleSided, range, slidesPerSheet }: Configuration,
  ) {
    const pdf = await PDFDocument.load(readFileSync(file.path));
    const buffer = Buffer.from(await (await this.createPdfBasedOnRange(pdf, range)).save());

    const res = await printJob(printer, {
      'operation-attributes-tag': {
        'requesting-user-name': 'System',
        'document-format': file.mimetype as ipp.MimeMediaType,
        'document-name': file.name,
        'printer-uri': 'ipp://raspberrypi.local.:631/printers/EPSON_L210_Series',
      },
      'job-attributes-tag': {
        // 'copies': 7,
        'print-color-mode': colour ? 'color' : 'monochrome',
        sides: doubleSided ? 'two-sided-long-edge' : 'one-sided',
        'number-up': slidesPerSheet,
        'orientation-requested': slidesPerSheet === 1 || slidesPerSheet === 2 ? 'portrait' : 'landscape',
      },
      data: buffer,
    });

    if (res.statusCode === 'successful-ok') {
      return res['job-attributes-tag']['job-id'];
    } else {
      throw this.handleError(new Error(res.statusCode));
    }
  }

  private async createPdfBasedOnRange(pdf: PDFDocument, range: string) {
    const arrayOfDesiredPages = multirange(range).toArray();

    if (pdf.getPageCount() === arrayOfDesiredPages.length) {
      return pdf;
    } else {
      const rangedPdf = await PDFDocument.create();
      const pages = await rangedPdf.copyPages(
        pdf,
        arrayOfDesiredPages.map((i) => i - 1),
      );
      pages.forEach((page) => rangedPdf.addPage(page));
      return rangedPdf;
    }
  }

  // TODO: Create method that checks every 10 seconds until job is completed, or not and rollbacks transition state

  async getJobState(id: string, jobId: number) {
    const printer = new ipp.Printer(this.findOne(id).getUrl());
    const res = await getJobAttributes(printer, {
      'operation-attributes-tag': {
        'job-id': jobId,
        'requested-attributes': [
          'job-state',
          // 'date-time-at-creation',
          // 'date-time-at-processing'
        ],
      },
    });

    if (res.statusCode === 'successful-ok') {
      return res['job-attributes-tag']['job-state'] as ipp.JobState;
    } else if (res.statusCode === 'client-error-not-found') {
      throw new NotFoundException(`Job ${jobId} not found.`);
    } else {
      throw this.handleError(new Error(res.statusCode));
    }
  }

  private handleError(error: Error) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      this.logger.error(`IPP Error.\nError: ${error.name}\nMessage: ${error.message}`);
      throw new InternalServerErrorException();
    }
  }
}
