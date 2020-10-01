export class Printer {
  id!: string;
  name!: string;
  host: string;
  port!: number;
  path!: string;

  constructor(partial: Partial<Printer>) {
    Object.assign(this, partial);
  }

  getUrl() {
    return `http://${this.host}:${this.port}/${this.path}`;
  }
}
