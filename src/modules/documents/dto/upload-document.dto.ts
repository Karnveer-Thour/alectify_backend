import { IsArray, IsObject } from 'class-validator';
import { Folders } from '../models/folders.enum';

export class UploadFilesDto {
  @IsObject()
  @IsArray()
  [Folders.PM_INSTRUCTIONS]: Express.Multer.File[];
  @IsObject()
  @IsArray()
  [Folders.COMMERCIAL_DOCS]: Express.Multer.File[];
  @IsObject()
  @IsArray()
  [Folders.PM_REPORTS]?: Express.Multer.File[];
  @IsObject()
  @IsArray()
  [Folders.IMAGES]?: Express.Multer.File[];
  @IsObject()
  @IsArray()
  [Folders.VIDEOS]?: Express.Multer.File[];
}
