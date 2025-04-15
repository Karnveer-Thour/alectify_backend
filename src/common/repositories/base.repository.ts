import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export abstract class BaseRepository<T> extends Repository<T> {
  constructor(target: EntityTarget<T>, dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }
  //   findById(id: string, options?: FindManyOptions<T>): Promise<T> {
  //     return super.findByIds([id], options).then(([entity]) => entity);
  //   }
}
