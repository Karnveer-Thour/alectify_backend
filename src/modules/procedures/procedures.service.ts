import { BaseResponseDto } from '@common/dto/base-response.dto';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from 'modules/comments/comments.service';
import { CommentsMessages } from 'modules/comments/models/comments-messages';
import { ContentTypes } from 'modules/comments/models/content-types';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';
import { Folders } from 'modules/preventive-maintenance-documents/models/folders.enum';
import { PreventiveMaintenances } from 'modules/preventive-maintenances/entities/preventive-maintenances.entity';
import { User } from 'modules/users/entities/user.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Brackets, ILike, In } from 'typeorm';
import { CreateCategoryResponseDto } from './dto/create-category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProcedureLibraryDto } from './dto/create-library-procedure.dto';
import { CreateProcedureLibraryResponseDto } from './dto/create-procedure-libraray-response.dto';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { GetAllCategoryResponseDto } from './dto/get-all-category-response.dto';
import { GetAllProcedureLibraryResponseDto } from './dto/get-all-procedure-library-response.dto';
import { GetProcedureResponseDto } from './dto/get-procedure-response.dto';
import { UpdateProcedureLibraryDto } from './dto/update-procedure-library.dto';
import { ProcedureCategories } from './entities/procedure-category-entity';
import { SortOrder } from './models/sort-order.enum';
import { ProcedureCategoriesRepository } from './repositories/procedure-category-repository';
import { ProcedureLibraryStepsRepository } from './repositories/procedure-library-steps.repository';
import { ProcedureStepsRepository } from './repositories/procedure-steps-repository';
import { ProceduresLibraryRepository } from './repositories/procedures-library.repository';
import { ProceduresRepository } from './repositories/procedures-repository';
import { S3 } from '@common/helpers/s3';
import { InjectConfig } from '@common/decorators/inject-config.decorator';
import { AWSConfig, AWSConfigType } from '@core/aws/aws.config';
import { dateToUTC, decodeURL } from '@common/utils/utils';
import { PreventiveMaintenancesService } from 'modules/preventive-maintenances/preventive-maintenances.service';
import { CreateProcedureLibraryStepDto } from './dto/create-procedure-library-steps.dto';
import { CreateProcedureLibraryStepResponseDto } from './dto/create-procedure-libraray-step-response.dto';
import { UpdateProcedureLibraryStepDto } from './dto/update-procedure-library-steps.dto';
import { GetProcedureLibraryStepResponseDto } from './dto/get-procedure-libraray-step-response.dto';
import { UsersService } from 'modules/users/users.service';
import { UpdateOrderProcedureLibraryStepDto } from './dto/update-order-procedure-library-steps.dto';
import { PreventiveMaintenanceDocumentsService } from 'modules/preventive-maintenance-documents/preventive-maintenance-documents.service';
import { ProcedureLibrarySteps } from './entities/procedure-library-steps-entity';
import { ProjectsService } from 'modules/projects/projects.service';
import { CSVToJSON } from '@common/utils/csv/csv-to-json';

@Injectable()
export class ProceduresService {
  S3: S3;
  constructor(
    @InjectConfig(AWSConfig)
    private readonly AWSConfigFactory: AWSConfigType,
    private proceduresLibraryRepository: ProceduresLibraryRepository,
    private procedureLibraryStepsRepository: ProcedureLibraryStepsRepository,
    private proceduresRepository: ProceduresRepository,
    private procedureStepsRepository: ProcedureStepsRepository,
    private categoriesRepository: ProcedureCategoriesRepository,
    private readonly fileUploadService: FilesUploadService,
    private commentsService: CommentsService,
    private pmDocumentsService: PreventiveMaintenanceDocumentsService,
    private projectsService: ProjectsService,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private pmService: PreventiveMaintenancesService,
    private userService: UsersService,
  ) {
    this.S3 = new S3(
      this.AWSConfigFactory.accessKeyId,
      this.AWSConfigFactory.secretAccessKey,
      this.AWSConfigFactory.region,
    );
  }

  async createProcedureLibrary(
    user: User,
    token: string,
    createPRDLto: CreateProcedureLibraryDto,
    image?: Express.Multer.File,
  ): Promise<CreateProcedureLibraryResponseDto> {
    try {
      user = await this.userService.findOneById(user.id);
      if (createPRDLto?.procedureSteps?.length) {
        createPRDLto.procedureSteps = JSON.parse(createPRDLto.procedureSteps);
      }

      if (!createPRDLto.categoryName && !createPRDLto.categoryId)
        throw new BadRequestException(
          'Either category name or  category_id required',
        );

      let category;
      if (createPRDLto.categoryId) {
        category = await this.findOneCategoryHelper(createPRDLto.categoryId);
      } else if (createPRDLto.categoryName) {
        category = await this.createCategoryHelper({
          name: createPRDLto.categoryName,
        });
      }
      if (image) {
        const fileUpload = await this.fileUploadService.fileUpload(
          image,
          `procedures`,
          true,
          token,
          user.branch.company.id,
        );
        createPRDLto['imageUrl'] = fileUpload.key;
      }

      createPRDLto['procedureCategory'] = category;

      const steps = createPRDLto?.procedureSteps;
      delete createPRDLto.procedureSteps;
      let project = null;
      if (createPRDLto.projectId) {
        project = await this.projectsService.findOneById(
          createPRDLto.projectId,
        );
      }

      const newPRDL = this.proceduresLibraryRepository.create({
        ...createPRDLto,
        project,
        branch: user.branch.id as any,
        createdBy: user.id as any,
      });
      if (steps?.length) {
        const newPRDLS = this.procedureLibraryStepsRepository.create(steps);
        newPRDL.procedureSteps = newPRDLS;
      }
      await this.proceduresLibraryRepository.save(newPRDL);

      return {
        message: 'Procedure Library created successfully',
        data: newPRDL,
      };
    } catch (error) {
      throw error;
    }
  }

  async createProcedureStep(
    user: User,
    token: string,
    createProcedureStepDto: CreateProcedureLibraryStepDto,
    image: Express.Multer.File,
  ): Promise<CreateProcedureLibraryStepResponseDto> {
    if (image) {
      user = await this.userService.findOneById(user.id);
      const fileUpload = await this.fileUploadService.fileUpload(
        image,
        `procedure-step`,
        true,
        token,
        user.branch.company.id,
      );
      createProcedureStepDto['imageUrl'] = fileUpload.key;
    }

    const procedureToCreate = this.procedureLibraryStepsRepository.create({
      name: createProcedureStepDto.name,
      order: +createProcedureStepDto.order,
      imageUrl: createProcedureStepDto.imageUrl,
      description: createProcedureStepDto.description,
      procedureLibrary: createProcedureStepDto.procedureLibraryId as any,
    });

    const step = await this.procedureLibraryStepsRepository.save(
      procedureToCreate,
    );

    return {
      data: !image
        ? step
        : await this.procedureLibraryStepsRepository.findOne({
            where: { id: step.id },
          }),
      message: 'Procedure Library Step is created successfully',
    };
  }

  async updateProcedureStep(
    user: User,
    id: string,
    token: string,
    updateProcedureStepDto: UpdateProcedureLibraryStepDto,
    image: Express.Multer.File,
  ): Promise<CreateProcedureLibraryStepResponseDto> {
    user = await this.userService.findOneById(user.id);
    const existingStep = await this.procedureLibraryStepsRepository.findOne({
      where: { id },
    });
    if (!existingStep) {
      throw new NotFoundException("Procedure step doesn't exist");
    }
    existingStep.imageUrl = existingStep.imageUrl
      ? decodeURL(existingStep.imageUrl)
      : null;
    if (updateProcedureStepDto.imageUrl == 'null') {
      if (existingStep.imageUrl) {
        await this.fileUploadService.fileDelete(existingStep.imageUrl);
      }
      updateProcedureStepDto.imageUrl = null;
    } else {
      updateProcedureStepDto.imageUrl = updateProcedureStepDto.imageUrl
        ? decodeURL(updateProcedureStepDto.imageUrl)
        : null;
    }

    if (image) {
      if (existingStep.imageUrl) {
        await this.fileUploadService.fileDelete(existingStep.imageUrl);
      }
      const fileUpload = await this.fileUploadService.fileUpload(
        image,
        `procedure-step`,
        true,
        token,
        user.branch.company.id,
      );
      updateProcedureStepDto['imageUrl'] = fileUpload.key;
    }

    const step = await this.procedureLibraryStepsRepository.save({
      id,
      ...updateProcedureStepDto,
    });

    return {
      data: await this.procedureLibraryStepsRepository.findOne({
        where: { id: step.id },
      }),
      message: 'Procedure Library Step is updated successfully',
    };
  }

  async updateOrderProcedureStep(
    id: string,
    token: string,
    updateOrderProcedureLibraryStepDto: UpdateOrderProcedureLibraryStepDto,
  ): Promise<CreateProcedureLibraryResponseDto> {
    await Promise.all(
      updateOrderProcedureLibraryStepDto.StepOrderDto.map((stp) =>
        this.procedureLibraryStepsRepository.update(
          {
            id: stp.id,
          },
          {
            order: stp.order,
          },
        ),
      ),
    );

    return {
      data: (await this.findOneProcedureLibrary(id)).data,
      message: 'Procedure Library Step is updated successfully',
    };
  }

  async deleteProcedureStep(
    id: string,
  ): Promise<CreateProcedureLibraryStepResponseDto> {
    const existingStep = await this.procedureLibraryStepsRepository.findOne({
      where: { id },
    });
    if (!existingStep) {
      throw new NotFoundException("Procedure step doesn't exist");
    }

    if (existingStep.imageUrl) {
      const bucketKey = existingStep.imageUrl.split('.com/')[1].split('?')[0];
      await this.fileUploadService.fileDelete(bucketKey);
    }

    await this.procedureLibraryStepsRepository.delete({ id });

    return {
      data: existingStep,
      message: 'Procedure Library Step is deleted successfully',
    };
  }

  async getAllProcedureSteps(
    id: string,
  ): Promise<GetProcedureLibraryStepResponseDto> {
    const steps = await this.procedureLibraryStepsRepository.find({
      where: { procedureLibrary: { id } },
      order: { order: 'ASC' },
    });

    return {
      data: steps,
      message: 'Get Procedure Library Steps successfully',
    };
  }

  async createCategory(
    createCategoryto: CreateCategoryDto,
  ): Promise<CreateCategoryResponseDto> {
    try {
      const newC = this.categoriesRepository.create(createCategoryto);

      return {
        message: 'Category created successfully',
        data: newC,
      };
    } catch (error) {
      throw error;
    }
  }

  async createCategoryHelper(createCategoryto: CreateCategoryDto) {
    try {
      let findOneOrCreate = await this.categoriesRepository.findOneBy({
        name: ILike(`%${createCategoryto.name}%`),
      });
      if (!findOneOrCreate) {
        findOneOrCreate = await this.categoriesRepository.save(
          new ProcedureCategories({
            ...createCategoryto,
          }),
        );
      }
      return findOneOrCreate;
    } catch (error) {
      throw error;
    }
  }

  async findOneProcedureLibrary(
    id: string,
  ): Promise<CreateProcedureLibraryResponseDto> {
    try {
      const prdl = await this.proceduresLibraryRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.procedureSteps', 'procedureSteps')
        .leftJoinAndSelect('p.procedureCategory', 'procedureCategory')
        .where('p.id = :id', { id })
        .addOrderBy('procedureSteps.order', SortOrder.ASC)
        .getOne();

      return {
        message: 'Get procedure library successfully',
        data: prdl,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneProcedure(id: string): Promise<GetProcedureResponseDto> {
    try {
      const prdl = await this.proceduresRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.procedureSteps', 'procedureSteps')
        .where('p.id = :id', { id })
        .addOrderBy('procedureSteps.order', SortOrder.ASC)
        .getOne();
      return {
        message: 'Get procedure library successfully',
        data: prdl,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneCategory(id: string): Promise<CreateCategoryResponseDto> {
    try {
      const isExist = await this.categoriesRepository
        .createQueryBuilder('p')
        .where('p.id = :id', { id })
        .getOne();

      if (!isExist) throw new NotFoundException('Category does not exit.');

      return {
        message: 'Get category library successfully',
        data: isExist,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneCategoryHelper(id: string) {
    try {
      const isExist = await this.categoriesRepository
        .createQueryBuilder('p')
        .where('p.id = :id', { id })
        .getOne();

      if (!isExist) throw new NotFoundException('Category does not exit.');

      return isExist;
    } catch (error) {
      throw error;
    }
  }

  async updateProcedureLibrary(
    user: User,
    id: string,
    token: string,
    updatePRDLto: UpdateProcedureLibraryDto,
    uploadedImage: Express.Multer.File,
  ): Promise<CreateProcedureLibraryResponseDto> {
    try {
      if (updatePRDLto?.procedureSteps) {
        updatePRDLto.procedureSteps = JSON.parse(updatePRDLto.procedureSteps);
      }

      if (!updatePRDLto.categoryName && !updatePRDLto.categoryId) {
        throw new BadRequestException(
          'Either category name or  category_id required',
        );
      }

      const isExist = await this.proceduresLibraryRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.procedureSteps', 'procedureSteps')
        .where('p.id = :id', { id })
        .getOne();
      isExist.procedureSteps = isExist.procedureSteps.map(
        (st) =>
          ({
            ...st,
            imageUrl: st.imageUrl ? decodeURL(st.imageUrl) : null,
          } as ProcedureLibrarySteps),
      );
      if (!isExist) {
        throw new NotFoundException('Procedure library does not exist');
      }
      if (isExist.imageUrl) {
        isExist.imageUrl = decodeURL(isExist.imageUrl);
      }
      if (updatePRDLto.image == 'null') {
        if (isExist.imageUrl) {
          await this.fileUploadService.fileDelete(isExist.imageUrl);
        }
        isExist.imageUrl = null;
      }
      if (uploadedImage) {
        if (isExist.imageUrl) {
          await this.fileUploadService.fileDelete(isExist.imageUrl);
        }
        user = await this.userService.findOneById(user.id);
        const fileUpload = await this.fileUploadService.fileUpload(
          uploadedImage,
          `procedures`,
          true,
          token,
          user.branch.company.id,
        );
        updatePRDLto['imageUrl'] = fileUpload.key;
      }
      const upatedPRDLSObject = {};
      isExist.procedureSteps.forEach((step) => {
        upatedPRDLSObject[step.id] = { count: 1, step: step };
      });

      if (updatePRDLto?.procedureSteps?.length) {
        updatePRDLto.procedureSteps.forEach((step) => {
          if (step.id) {
            if (upatedPRDLSObject[step.id] === undefined)
              upatedPRDLSObject[step.id] = { count: 1, step: step };
            else
              upatedPRDLSObject[step.id] = {
                count: upatedPRDLSObject[step.id].count + 1,
                step: step,
              };
          } else {
            upatedPRDLSObject[`${new Date()}`] = { count: 0, step: step };
          }
        });

        const steps = [];
        for (const step in upatedPRDLSObject) {
          if (upatedPRDLSObject[step].count == 2) {
            steps.push(upatedPRDLSObject[step].step);
          } else if (upatedPRDLSObject[step].count == 1) {
            const newStep = this.procedureLibraryStepsRepository.delete(
              upatedPRDLSObject[step].step.id,
            );
            steps.push(newStep);
          } else if (upatedPRDLSObject[step].count == 0) {
            const newStep = this.procedureLibraryStepsRepository.create(
              upatedPRDLSObject[step].step,
            );
            steps.push(newStep);
          }
        }
        isExist.procedureSteps = steps;
      }

      let procedureCategory;
      if (updatePRDLto.categoryId) {
        procedureCategory = await this.findOneCategoryHelper(
          updatePRDLto.categoryId,
        );
      } else if (updatePRDLto.categoryName) {
        procedureCategory = await this.createCategoryHelper({
          name: updatePRDLto.categoryName,
        });
      }
      isExist.procedureCategory = procedureCategory;
      let project = null;
      if (updatePRDLto.projectId) {
        project = await this.projectsService.findOneById(
          updatePRDLto.projectId,
        );
      }
      await this.proceduresLibraryRepository.save({
        ...isExist,
        ...updatePRDLto,
        project,
      });
      const pr = await this.proceduresLibraryRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.procedureSteps', 'procedureSteps')
        .leftJoinAndSelect('p.procedureCategory', 'procedureCategory')
        .where('p.id = :id', { id })
        .addOrderBy('procedureSteps.order', SortOrder.ASC)
        .getOne();

      return {
        message: 'Procedure library updated successfully',
        data: pr,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateStep(
    id: string,
    procedureId: string,
    status: string,
    date: Date,
    pm: PreventiveMaintenances,
    user: User,
    token: string,
    durationMins?: string,
    comments?: string,
    image?: string,
    uploadedImage?: Express.Multer.File,
  ) {
    try {
      const isChecked = status === 'true';

      // Fetch procedure step
      const isExist = await this.procedureStepsRepository
        .createQueryBuilder('p')
        .where('p.id = :id', { id })
        .andWhere('p.procedure_id = :procedureId', { procedureId })
        .getOne();

      if (!isExist) {
        throw new NotFoundException('Procedure step does not exist');
      }

      isExist.imageUrl = isExist.imageUrl ? decodeURL(isExist.imageUrl) : null;

      // Handle image deletion
      if (image === 'null' && isExist.imageUrl) {
        try {
          await this.pmDocumentsService.softDeleteByFilePath(
            user,
            isExist.imageUrl,
          );
        } catch (error) {
          console.error('Error deleting existing image:', error);
        }
        isExist.imageUrl = null;
      }

      let fileName = null;
      if (uploadedImage) {
        if (isExist.imageUrl) {
          try {
            await this.pmDocumentsService.softDeleteByFilePath(
              user,
              isExist.imageUrl,
            );
          } catch (error) {
            console.error('Error deleting previous image:', error);
          }
        }

        const fileUpload = await this.pmDocumentsService.createOne(
          pm,
          user,
          uploadedImage,
          Folders.PROCEDURES,
          token,
        );
        fileName = fileUpload.fileName;
        isExist.imageUrl = fileUpload.filePath;
      }

      // Build message text dynamically
      let messageText = CommentsMessages.PROCEDURE_STEP_UPDATED.replace(
        '{stepNo}',
        isExist.order.toString(),
      );

      if (isExist.isChecked !== isChecked) {
        messageText += `, status is ${isChecked ? 'checked' : 'unchecked'}`;
      }
      if (isExist.durationMins !== durationMins) {
        messageText += `, Duration is "${durationMins}"`;
      }
      if (uploadedImage) {
        messageText += `, uploaded an image "${fileName}"`;
      }
      if (isExist.comments !== comments) {
        messageText += `, added a comment "${comments}"`;
      }

      // Update fields
      Object.assign(isExist, {
        defaultImageUrl: isExist.defaultImageUrl
          ? decodeURL(isExist.defaultImageUrl)
          : null,
        isChecked,
        completedAt: dateToUTC(date),
        completedBy: user,
        durationMins,
        comments,
      });

      // Save step and create comment simultaneously for performance
      await Promise.all([
        this.procedureStepsRepository.save(isExist),
        this.commentsService.create({
          referenceId: pm.id,
          subProject: pm.subProject.id,
          sentBy: user.id,
          text: messageText,
          contentType: uploadedImage
            ? ContentTypes.ATTACHMENT
            : ContentTypes.TEXT,
          referenceType: pm.pmType,
          s3Key: uploadedImage ? isExist.imageUrl : null,
          fileName: uploadedImage ? fileName : null,
          isSystemGenerated: true,
        }),
      ]);

      return isExist;
    } catch (error) {
      console.error('Error in updateStep:', error);
      throw error;
    }
  }

  async updateAllSteps(
    procedureId: string,
    status: boolean,
    pm: PreventiveMaintenances,
    user: User,
    token: string,
  ) {
    try {
      const isExist = await this.procedureStepsRepository
        .createQueryBuilder('p')
        .where('p.procedure = :procedureId', { procedureId })
        .getMany();
      if (!isExist.length) {
        throw new NotFoundException('Procedure step does not exist');
      }
      const stepIds = isExist.map(({ id }) => id);
      await this.procedureStepsRepository.update(
        {
          id: In(stepIds),
        },
        {
          isChecked: status,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteProcedureLibrary(id: string): Promise<BaseResponseDto> {
    try {
      const isExist = await this.proceduresLibraryRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.procedureSteps', 'procedureSteps')
        .where('p.id = :id', { id })
        .getOne();

      if (!isExist) {
        throw new NotFoundException('Procedure library does not exist');
      }
      const stepsId = isExist.procedureSteps.map((step) => step.id);
      await this.procedureLibraryStepsRepository.delete({ id: In(stepsId) });
      await this.proceduresLibraryRepository.delete(id);
      return {
        message: 'Procedure library deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteProcedure(id: string): Promise<BaseResponseDto> {
    try {
      const isExist = await this.proceduresRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.procedureSteps', 'procedureSteps')
        .where('p.id = :id', { id })
        .getOne();

      if (!isExist) {
        throw new NotFoundException('Procedure does not exist');
      }
      const stepsId = isExist.procedureSteps.map((step) => step.id);

      await this.procedureStepsRepository.delete({ id: In(stepsId) });
      await this.proceduresRepository.delete(id);
      return {
        message: 'Procedure deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteProcedureMany(
    prIds: string[],
    prsIds: string[],
  ): Promise<BaseResponseDto> {
    try {
      await this.procedureStepsRepository.delete({ id: In(prsIds) });
      await this.proceduresRepository.delete({ id: In(prIds) });

      return {
        message: 'Procedure deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteProcedureManyByPm(ids: string[]): Promise<BaseResponseDto> {
    try {
      const findPros = await this.proceduresRepository.findBy({
        id: In(ids),
      });
      if (findPros.length) {
        const ids = findPros.map((pro) => pro.id);
        await this.procedureStepsRepository.delete({
          procedure: In(ids),
        });
        await this.proceduresRepository.delete({
          id: In(ids),
        });
      }

      return {
        message: 'Procedure deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllProceduresLibrary(
    orderField: string,
    orderBy: 'ASC' | 'DESC',
    search: string,
    projectIds: string[],
    options: IPaginationOptions,
    jobType: string,
    user?: User,
  ): Promise<GetAllProcedureLibraryResponseDto> {
    try {
      user = await this.userService.findOneById(user.id);

      options.limit = Number(options.limit);
      options.page = Number(options.page);

      const query = this.proceduresLibraryRepository
        .createQueryBuilder('procedure')
        .leftJoinAndSelect('procedure.project', 'project')
        .leftJoinAndSelect('procedure.procedureCategory', 'procedureCategory')
        .leftJoinAndSelect('procedure.procedureSteps', 'procedureSteps')
        .leftJoinAndSelect('procedure.createdBy', 'createdBy')
        // .where('procedure.branch = :branchId', { branchId: user.branch.id })
        .take(options.limit)
        .skip((options.page - 1) * options.limit);

      if (projectIds && projectIds?.length) {
        query.andWhere('project.id IN (:...projectIds)', {
          projectIds,
        });
      } else {
        const mProjectIds = (
          await this.projectsService.findProjectsAndSubProjectByUserId(user.id)
        ).map(({ project }) => project.id);
        query.andWhere('project.id IN (:...mProjectIds)', {
          mProjectIds,
        });
      }
      if (jobType) {
        query.andWhere('procedure.jobType = :jobType', { jobType });
      }
      if (search) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('procedure.name ILIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('procedure.description ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('procedureCategory.name ILIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('procedure.reference ILIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }

      if (orderField) {
        query.orderBy(`procedure.${orderField}`, orderBy || 'DESC');
      } else {
        query.orderBy('procedure.reference', 'ASC');
      }

      const [totalCount, data] = await Promise.all([
        query.getCount(),
        query.getMany(),
      ]);

      return {
        message: 'Get all procedures library successfully',
        data: data,
        meta: {
          itemCount: data.length,
          totalItems: totalCount,
          currentPage: options.page,
          itemsPerPage: options.limit,
          totalPages: Math.ceil(totalCount / options.limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllCategory(search = null): Promise<GetAllCategoryResponseDto> {
    try {
      const crs = await this.categoriesRepository.createQueryBuilder('c');
      if (search) {
        crs.where('c.name ILIKE :search', {
          search: `%${search}%`,
        });
      }

      return {
        message: 'Get all categories library successfully',
        data: await crs.getMany(),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string) {
    try {
      return await this.proceduresLibraryRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.project', 'project')
        .leftJoinAndSelect('p.procedureSteps', 'procedureSteps')
        .where('p.id = :id', { id })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneProcedureById(id: string) {
    try {
      return await this.proceduresRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.procedureSteps', 'procedureSteps')
        .leftJoinAndSelect('p.procedureLibrary', 'procedureLibrary')
        .where('p.id = :id', { id })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async createProcedure(createPRDto: CreateProcedureDto) {
    try {
      const steps = createPRDto.procedureSteps;
      delete createPRDto.procedureSteps;
      let project = null;
      if (createPRDto.projectId) {
        project = await this.projectsService.findOneById(createPRDto.projectId);
      }
      const newPRD = this.proceduresRepository.create({
        ...createPRDto,
        project,
      });
      const newPRDS = this.procedureStepsRepository.create(steps);
      newPRD.procedureSteps = newPRDS;
      await this.proceduresRepository.save(newPRD);
      return newPRD;
    } catch (error) {
      throw error;
    }
  }

  async getCount(projectIds: string[]): Promise<number> {
    return this.proceduresLibraryRepository.count({
      where: { project: { id: In(projectIds) } },
    });
  }

  async createManyWithCSV(
    user: User,
    token: string,
    file: Express.Multer.File,
  ): Promise<BaseResponseDto> {
    try {
      const proceduresCSV = CSVToJSON<any>(file.buffer.toString());

      const validProcedures = proceduresCSV
        .filter(
          (element) =>
            element.name &&
            element.jobtype &&
            element.description &&
            element.categoryname &&
            element.reference,
        )
        .map((element) => {
          const procedure: any = {
            jobType: element.jobtype,
            reference: element.reference,
            fileUpload: element.fileupload === '1',
            comments: element.comments === '1',
            name: element.name,
            description: element.description,
            categoryName: element.categoryname,
          };

          if (element.steps) {
            procedure['procedureSteps'] = JSON.stringify(
              element.steps.split(';').map((stp, stpi) => ({
                name: stp.trim(),
                order: stpi + 1,
              })),
            );
          }
          console.log('procedureprocedure', procedure);
          return procedure;
        });

      await Promise.all(
        validProcedures.map((procedure) =>
          this.createProcedureLibrary(user, token, procedure),
        ),
      );

      return {
        message: 'Procedures created successfully',
      };
    } catch (error) {
      throw new Error(`Failed to create procedures: ${error.message}`);
    }
  }

  private async getSubProjectIds(
    userId: string,
    projectIds: string[],
  ): Promise<string[]> {
    if (projectIds) {
      const projects =
        await this.projectsService.findByIdsMasterProjectWithSubProjects(
          projectIds,
        );
      return projects
        .map(({ subProjects }) =>
          subProjects.map((subProject) => subProject.id),
        )
        .flat(1);
    } else {
      const projects =
        await this.projectsService.findProjectsAndSubProjectByUserId(userId);
      return projects
        .map(({ project }) =>
          project.subProjects.map((subProject) => subProject.id),
        )
        .flat(1);
    }
  }
}
