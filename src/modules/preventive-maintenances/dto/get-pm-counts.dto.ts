import { BaseResponseDto } from '@common/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { User } from 'modules/users/entities/user.entity';
import { TaskCategories } from '../models/task-categories.enum';

class PmCounts {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pending: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  skipped: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  completed: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  inProgress: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  waitingForReview: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  recurring: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nonRecurring: number;
}

export class PmCountsResponse {
  @ApiProperty()
  @IsObject()
  [TaskCategories.CORRECTIVE_MAINTENANCE]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.CLEANUP]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.REPLACEMENT]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.OTHERS]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.PREVENTIVE_MAINTENANCE]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.DAMAGE]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.INSPECTION]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.SAFETY]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.TASK]: PmCounts;

  @ApiProperty()
  @IsObject()
  [TaskCategories.DEFICIENCY]: PmCounts;
}

export class GetPmCountsResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: PmCountsResponse;
}

export class ClosedWorkOrdersByAssignees {
  @ApiProperty()
  @IsNumber()
  completedThisWeek: number;

  @ApiProperty()
  @IsNumber()
  completedThisMonth: number;

  @ApiProperty()
  @IsNumber()
  completedSinceInception: number;

  @ApiProperty()
  @IsObject()
  completedBy: User;
}

export class GetClosedWorkOrdersByAssigneesResponse extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ClosedWorkOrdersByAssignees[];
}

export class ClosedWorkOrders {
  @ApiProperty()
  @IsNumber()
  completedThisWeek: number;

  @ApiProperty()
  @IsNumber()
  completedThisMonth: number;

  @ApiProperty()
  @IsNumber()
  completedSinceInception: number;
}

export class ClosedWorkOrdersResponse {
  @ApiProperty()
  @IsObject()
  [TaskCategories.CORRECTIVE_MAINTENANCE]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.CLEANUP]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.REPLACEMENT]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.OTHERS]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.PREVENTIVE_MAINTENANCE]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.DAMAGE]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.INSPECTION]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.SAFETY]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.TASK]: ClosedWorkOrders;

  @ApiProperty()
  @IsObject()
  [TaskCategories.DEFICIENCY]: ClosedWorkOrders;
}

export class GetClosedWorkOrdersResponseDto extends BaseResponseDto {
  @ApiProperty()
  @IsObject()
  data: ClosedWorkOrdersResponse;
}
