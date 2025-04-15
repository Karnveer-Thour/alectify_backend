import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProcedureLibraryResponseDto } from './dto/create-procedure-libraray-response.dto';
import { CreateProcedureLibraryDto } from './dto/create-library-procedure.dto';
import { UpdateProcedureLibraryDto } from './dto/update-procedure-library.dto';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { GetAllProcedureLibraryResponseDto } from './dto/get-all-procedure-library-response.dto';
import { CreateCategoryResponseDto } from './dto/create-category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetAllCategoryResponseDto } from './dto/get-all-category-response.dto';
import { GetAllProcedureLibraryQueryDto } from './dto/get-all-procedure-library-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProcedureLibraryStepResponseDto } from './dto/create-procedure-libraray-step-response.dto';
import { CreateProcedureLibraryStepDto } from './dto/create-procedure-library-steps.dto';
import { UpdateProcedureLibraryStepDto } from './dto/update-procedure-library-steps.dto';
import { GetProcedureLibraryStepResponseDto } from './dto/get-procedure-libraray-step-response.dto';
import { UpdateOrderProcedureLibraryStepDto } from './dto/update-order-procedure-library-steps.dto';
import { CreateManyProceduresCSVDto } from './dto/create-many-procedures-csv.dto';
import { disAllowedExtensions } from '@common/utils/utils';

@ApiBearerAuth()
@ApiTags('Procedures')
@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @ApiCreatedResponse({
    type: CreateProcedureLibraryResponseDto,
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createProcedure(
    @Req() req,
    @Body() createProcedureDto: CreateProcedureLibraryDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<CreateProcedureLibraryResponseDto> {
    if (image) {
      const checkFiles = disAllowedExtensions([image.originalname]);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.proceduresService.createProcedureLibrary(
      req.user,
      req.headers.authorization,
      createProcedureDto,
      image,
    );
  }

  @ApiCreatedResponse({
    type: CreateProcedureLibraryStepResponseDto,
  })
  @Post('steps')
  @UseInterceptors(FileInterceptor('image'))
  createProcedureStep(
    @Req() req,
    @Body() createProcedureStepDto: CreateProcedureLibraryStepDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<CreateProcedureLibraryStepResponseDto> {
    if (image) {
      const checkFiles = disAllowedExtensions([image.originalname]);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.proceduresService.createProcedureStep(
      req.user,
      req.headers.authorization,
      createProcedureStepDto,
      image,
    );
  }

  @ApiOkResponse({
    type: CreateProcedureLibraryStepResponseDto,
  })
  @Put('steps/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateProcedureStep(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
    @Body() updateProcedureStepDto: UpdateProcedureLibraryStepDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<CreateProcedureLibraryStepResponseDto> {
    if (image) {
      const checkFiles = disAllowedExtensions([image.originalname]);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.proceduresService.updateProcedureStep(
      req.user,
      id,
      req.headers.authorization,
      updateProcedureStepDto,
      image,
    );
  }

  @ApiOkResponse({
    type: CreateProcedureLibraryStepResponseDto,
  })
  @Put('steps-order/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateOrderProcedureStep(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
    @Body()
    updateOrderProcedureLibraryStepDto: UpdateOrderProcedureLibraryStepDto,
  ): Promise<CreateProcedureLibraryResponseDto> {
    return this.proceduresService.updateOrderProcedureStep(
      id,
      req.headers.authorization,
      updateOrderProcedureLibraryStepDto,
    );
  }

  @ApiOkResponse({
    type: CreateProcedureLibraryStepResponseDto,
  })
  @Delete('steps/:id')
  deleteProcedureStep(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateProcedureLibraryStepResponseDto> {
    return this.proceduresService.deleteProcedureStep(id);
  }

  @ApiOkResponse({
    type: GetProcedureLibraryStepResponseDto,
  })
  @Get(':id/steps')
  getAllProcedureSteps(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetProcedureLibraryStepResponseDto> {
    return this.proceduresService.getAllProcedureSteps(id);
  }

  @ApiOkResponse({
    type: GetAllCategoryResponseDto,
  })
  @Get('categories')
  findAllCategory(
    @Query('search') search: string,
  ): Promise<GetAllCategoryResponseDto> {
    return this.proceduresService.findAllCategory(search);
  }

  @ApiOkResponse({
    type: CreateProcedureLibraryResponseDto,
  })
  @Get(':id')
  findOneProcedure(@Param('id', ParseUUIDPipe) id: string) {
    return this.proceduresService.findOneProcedure(id);
  }

  @ApiOkResponse({
    type: CreateProcedureLibraryResponseDto,
  })
  @Get('library/:id')
  findOneProcedureLibrary(@Param('id', ParseUUIDPipe) id: string) {
    return this.proceduresService.findOneProcedureLibrary(id);
  }

  @ApiOkResponse({
    type: CreateProcedureLibraryResponseDto,
  })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateProcedure(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProcedureDto: UpdateProcedureLibraryDto,
    @UploadedFile() uploadedImage: Express.Multer.File,
  ): Promise<CreateProcedureLibraryResponseDto> {
    if (uploadedImage) {
      const checkFiles = disAllowedExtensions([uploadedImage.originalname]);
      if (checkFiles.length) {
        throw new BadRequestException(
          `File type ${checkFiles[0]} is not allowed.`,
        );
      }
    }
    return this.proceduresService.updateProcedureLibrary(
      req.user,
      id,
      req.headers.authorization,
      updateProcedureDto,
      uploadedImage,
    );
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Delete(':id')
  deleteProcedure(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto> {
    return this.proceduresService.deleteProcedureLibrary(id);
  }

  @ApiOkResponse({
    type: GetAllProcedureLibraryResponseDto,
  })
  @Get()
  findAllProcedure(
    @Req() req,
    @Query()
    {
      limit = 10,
      page = 1,
      orderField = null,
      orderBy = null,
      search = null,
      projectIds = null,
      jobType = null,
    }: GetAllProcedureLibraryQueryDto,
  ): Promise<GetAllProcedureLibraryResponseDto> {
    return this.proceduresService.findAllProceduresLibrary(
      orderField,
      orderBy,
      search,
      projectIds,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
      jobType,
      req.user,
    );
  }

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Post('create-many-csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file to upload containing spare parts data',
    type: CreateManyProceduresCSVDto,
  })
  createManyWithCSV(
    @Req() req,
    @Body() createManyProceduresCSVDto: CreateManyProceduresCSVDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponseDto> {
    return this.proceduresService.createManyWithCSV(
      req.user,
      req.headers.authorization,
      file,
    );
  }
}
