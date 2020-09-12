import { Converter } from '@nartc/automapper';

export class StringDateConverter implements Converter<string, Date> {
  convert(source: string): Date {
    //* Handle validation here if you like
    return new Date(source);
  }
}
