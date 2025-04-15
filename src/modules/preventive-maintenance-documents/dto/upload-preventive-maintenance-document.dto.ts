import { IsArray } from 'class-validator';
import { Folders } from '../models/folders.enum';

export class UploadFilesDto {
  @IsArray()
  [Folders.PM_INSTRUCTIONS]: Express.Multer.File[];
  @IsArray()
  [Folders.COMMERCIAL_DOCS]: Express.Multer.File[];
  @IsArray()
  [Folders.PM_REPORTS]?: Express.Multer.File[];
  @IsArray()
  [Folders.IMAGES]?: Express.Multer.File[];
  @IsArray()
  [Folders.VIDEOS]?: Express.Multer.File[];
}
