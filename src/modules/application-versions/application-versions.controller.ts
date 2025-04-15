import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationVersionsService } from './application-versions.service';
import { CreateApplicationVersionResponseDto } from './dto/create-application-version-response.dto';
import { CreateApplicationVersionDto } from './dto/create-application-version.dto';
import { GetAllApplicationVersionsResponseDto } from './dto/get-all-application-versions-response.dto';
import { GetAllApplicationVersionsQueryDto } from './dto/get-all-application-versions.dto';
import { UpdateApplicationVersionDto } from './dto/update-application-version.dto';
import { ApplicationTypes } from './models/application-types.enum';
import { BypassAuth } from 'modules/users/decorators/bypass.decorator';

@ApiBearerAuth()
@ApiTags('Application Versions')
@Controller('application-versions')
export class ApplicationVersionsController {
  constructor(
    private readonly applicationVersionsService: ApplicationVersionsService,
  ) {}

  @ApiOkResponse({
    type: CreateApplicationVersionResponseDto,
  })
  @Post()
  create(
    @Body() createApplicationVersionDto: CreateApplicationVersionDto,
  ): Promise<CreateApplicationVersionResponseDto> {
    return this.applicationVersionsService.create(createApplicationVersionDto);
  }

  @ApiOkResponse({
    type: GetAllApplicationVersionsResponseDto,
  })
  @Get('')
  findAll(
    @Req() req,
    @Query()
    { applicationType }: GetAllApplicationVersionsQueryDto,
  ): Promise<GetAllApplicationVersionsResponseDto> {
    return this.applicationVersionsService.findAll(
      req.headers.authorization,
      applicationType,
    );
  }

  @ApiOkResponse({
    type: CreateApplicationVersionResponseDto,
  })
  @BypassAuth()
  @Get(':applicationType')
  findOneByApplicationType(
    @Req() req,
    @Param() { applicationType }: GetAllApplicationVersionsQueryDto,
  ): Promise<CreateApplicationVersionResponseDto> {
    return this.applicationVersionsService.findOneByApplicationType(
      applicationType,
    );
  }

  @ApiOkResponse({
    type: CreateApplicationVersionResponseDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApplicationVersionDto: UpdateApplicationVersionDto,
  ): Promise<CreateApplicationVersionResponseDto> {
    return this.applicationVersionsService.update(
      id,
      updateApplicationVersionDto,
    );
  }
}
