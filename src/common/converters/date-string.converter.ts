import { Converter } from '@nartc/automapper';

export class DateStringConverter implements Converter<Date, string> {
  convert(source: Date): string {
    //* Handle validation here if you like
    return source.toISOString();
  }
}
