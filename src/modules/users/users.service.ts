import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UserContactsRepository } from './repositories/user-contacts.repository';
import { S3 } from '@common/helpers/s3';
import { InjectConfig } from '@common/decorators/inject-config.decorator';
import { AWSConfig, AWSConfigType } from '@core/aws/aws.config';

@Injectable()
export class UsersService {
  S3: S3;
  constructor(
    @InjectConfig(AWSConfig)
    private readonly AWSConfigFactory: AWSConfigType,
    private usersRepository: UsersRepository,
    private userContactsRepository: UserContactsRepository,
  ) {
    this.S3 = new S3(
      this.AWSConfigFactory.accessKeyId,
      this.AWSConfigFactory.secretAccessKey,
      this.AWSConfigFactory.region,
    );
  }

  async createMany(users: User[]) {
    try {
      return this.usersRepository.insert(users);
    } catch (error) {
      throw error;
    }
  }

  async createOne(user: User) {
    try {
      return this.usersRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async findByEmailWithOrganisation(email: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({ where: { email },relations:['organization'] });
    } catch (error) {
      throw error;
    }
  }

  async findUsersByIds(Ids: string[]) {
    try {
      return await this.usersRepository.findBy({
        id: In(Ids),
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string) {
    try {
      return await this.usersRepository.findOne({
        where: {
          id,
        },
        relations: ['branch', 'branch.company'],
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdWithProjects(id: string) {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.projectsAccounts', 'projectsAccounts')
        .leftJoinAndSelect('projectsAccounts.project', 'project')
        .leftJoinAndSelect('user.subProjectsAccounts', 'subProjectsAccounts')
        .leftJoinAndSelect('subProjectsAccounts.subProject', 'subProject')
        .where('user.id =:id', {
          id,
        })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdWithSubProjects(id: string) {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.projectsAccounts', 'projectsAccounts')
        .leftJoinAndSelect('projectsAccounts.project', 'project')
        .leftJoinAndSelect('user.subProjectsAccounts', 'subProjectsAccounts')
        .leftJoinAndSelect('subProjectsAccounts.subProject', 'subProject')
        .where('user.id =:id', {
          id,
        })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  async findUsersBySubProjectId(subProjectId: string) {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.subProjectsAccounts', 'subProjectsAccounts')
        .leftJoinAndSelect('subProjectsAccounts.subProject', 'subProject')
        .where('subProject.id =:subProjectId', {
          subProjectId,
        })
        .getMany();
    } catch (error) {
      throw error;
    }
  }

  async getContactsByDate(date: string) {
    try {
      return await this.userContactsRepository
        .createQueryBuilder('uc')
        .leftJoinAndSelect('uc.user', 'user')
        .leftJoinAndSelect('uc.contact', 'contact')
        .where('contact.accessExpiryDate = :date', {
          date,
        })
        .getMany();
    } catch (error) {
      throw error;
    }
  }
}
