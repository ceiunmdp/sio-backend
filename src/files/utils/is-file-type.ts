import { File } from '../entities/file.entity';
import { FileType } from '../enums/file-type.enum';

export const isSystemStaffFile = (file: File) => file.type === FileType.SYSTEM_STAFF;

export const isSystemProfessorshipFile = (file: File) => file.type === FileType.SYSTEM_PROFESSORSHIP;

export const isTemporaryFile = (file: File) => file.type === FileType.TEMPORARY;
