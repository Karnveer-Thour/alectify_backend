import { IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '@common/dto/base-response.dto';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { UserNotification } from '../entities/user-notification.entity';
import { Notification } from '../entities/notification.entity';

export class GetNotificationsResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: UserNotification[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}

export class GetAllNotificationsResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: Notification[];

  @ApiProperty()
  @IsObject()
  links?: IPaginationLinks;

  @ApiProperty()
  @IsObject()
  meta?: IPaginationMeta;
}

export class GetUnreadNotificationsCountsResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: object;
}
