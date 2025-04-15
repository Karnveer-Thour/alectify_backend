import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';
import { ProjectIncidentImpact } from '../entities/project-incident-impact.entity';

export class CreateImpactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  projectId: string;
}

export class ImpactResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ProjectIncidentImpact;
}

export class BulkCreateImpactDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
