import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';
import { ProjectAffectedSystem } from 'modules/projects/entities/project-affected-system.entity';

export class CreateAffectedSystemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}

export class BulkCreateAffectedSystemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class AffectedSystemResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProjectAffectedSystem;
}
