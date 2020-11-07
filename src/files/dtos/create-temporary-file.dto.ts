export class CreateTemporaryFileDto {
  name!: string;
  mimetype!: string;
  numberOfSheets!: number;
  size!: number;
  ownerId!: string;
  content!: string;

  constructor(partial: Partial<CreateTemporaryFileDto>) {
    Object.assign(this, partial);
  }
}
