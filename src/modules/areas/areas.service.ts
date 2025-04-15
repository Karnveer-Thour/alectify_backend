import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsService } from 'modules/projects/projects.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { Area } from './entities/area.entity';
import { AreasRepository } from './repositories/areas.repository';
import { UsersRepository } from 'modules/users/repositories/users.repository';
import { In } from 'typeorm';

@Injectable()
export class AreasService {
  constructor(
    private areasRepository: AreasRepository,
    private usersRepository: UsersRepository,
  ) {}

  async findByIds(ids: string[]) {
    return this.areasRepository.findBy({ id: In(ids) });
  }

  async findOneById(id: string) {
    try {
      return this.areasRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw error;
    }
  }

  async getCount(projectIds: string[]): Promise<number> {
    return this.areasRepository.count({
      where: { subProject: In(projectIds), isActive: 1 },
    });
  }
}
