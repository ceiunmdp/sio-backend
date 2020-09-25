export class CreateStudentDto {
  displayName!: string;
  uid!: string;

  constructor(partial: Partial<CreateStudentDto>) {
    Object.assign(this, partial);
  }
}
