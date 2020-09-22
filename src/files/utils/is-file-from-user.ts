import { File } from '../entities/file.entity';

export const isFileFromUser = (userId: string, file: File) => userId === file.ownerId;
