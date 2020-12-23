export class CreateStudentDto {
  uid!: string;
  displayName!: string;
  email!: string;

  constructor(partial: Partial<CreateStudentDto>) {
    Object.assign(this, partial);
  }
}
