import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import { AreasService } from 'modules/areas/areas.service';
import { FilesUploadService } from 'modules/files-upload/files-upload.service';
import { PMTypes } from 'modules/preventive-maintenances/models/pm-types.enum';
import { PreventiveMaintenancesService } from 'modules/preventive-maintenances/preventive-maintenances.service';
import * as moment from 'moment';
import { join } from 'path';
import { In } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { AssetsRepository } from './repositories/assets.repository';

@Injectable()
export class AssetsService {
  constructor(
    private assetsRepository: AssetsRepository,
    @Inject(forwardRef(() => PreventiveMaintenancesService))
    private preventiveMaintenancesService: PreventiveMaintenancesService,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private readonly fileUploadService: FilesUploadService,
    private areaService: AreasService,
  ) {}

  async findByIds(ids: string[]) {
    try {
      return this.assetsRepository.findBy({ id: In(ids) });
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string) {
    try {
      const asset = await this.assetsRepository.findOne({
        where: { id },
        relations: ['subProject'],
      });
      return asset;
    } catch (error) {
      throw error;
    }
  }

  // async generateAssetReport(user, id) {
  //   try {
  //     const [asset, pmInternals] = await Promise.all([
  //       await this.findOneByIdWithTeamMembers(id),
  //       await this.preventiveMaintenancesService.findAllByAssetId(
  //         id,
  //         PMTypes.PM_INTERNAL,
  //       ),
  //     ]);
  //     const filePath = join(process.cwd(), 'views', 'pdf', 'asset-report.hbs');
  //     const pdfCreate = await createPdf(
  //       filePath,
  //       {
  //         format: 'A4',
  //         printBackground: true,
  //       },
  //       {
  //         documentData: {
  //           date: moment().toDate(),
  //           user: user,
  //         },
  //         asset: asset,
  //         pmInternals: pmInternals.data,
  //       },
  //     );
  //     // fs.writeFileSync(`./.temp/new.pdf`, pdfCreate, 'binary');
  //     // const getFile = fs.readFileSync(`./.temp/new.pdf`);
  //     const file = await this.fileUploadService.fileUpload(
  //       {
  //         file: pdfCreate,
  //         buffer: pdfCreate,
  //         mimetype: 'application/pdf',
  //         originalname: 'asset-details.pdf',
  //       },
  //       `${asset.subProject.id}/${id}/pdf`,
  //       true,
  //     );
  //     return {
  //       message: 'Asset Details File Created Successfully',
  //       data: file,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updateById(id: string, data) {
    return await this.assetsRepository.update(
      {
        id,
      },
      data,
    );
  }

  async getCount(projectIds: string[]): Promise<number> {
    return this.assetsRepository.count({
      where: { subProject: In(projectIds), isActive: 1 },
    });
  }
}
