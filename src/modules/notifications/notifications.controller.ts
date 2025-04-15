import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  GetNotificationsResponseDto,
  GetUnreadNotificationsCountsResponseDto,
} from './dto/get-notifications.dto';
import { MarkNotificationAsReadResponseDto } from './dto/mark-notifications-as-read-response.dto';
import { MarkNotificationAsReadDto } from './dto/mark-notifications-as-read.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @ApiOkResponse({
    type: GetNotificationsResponseDto,
  })
  @Get()
  getNotifications(
    @Req() req,
    @Query()
    {
      page = 1,
      limit = 10,
      isSystemGenerated,
    }: { limit: number; page: number; isSystemGenerated: boolean },
  ): Promise<GetNotificationsResponseDto> {
    return this.notificationService.getNotifications(
      req.user,
      isSystemGenerated,
      {
        page,
        limit,
        route: req.protocol + '://' + req.get('host') + req.path,
      },
    );
  }

  @ApiOkResponse({
    type: GetUnreadNotificationsCountsResponseDto,
  })
  @Get('unread-counts')
  getUnreadCounts(
    @Req() req,
  ): Promise<GetUnreadNotificationsCountsResponseDto> {
    return this.notificationService.getUnreadCounts(req.user);
  }

  @ApiCreatedResponse({
    type: MarkNotificationAsReadResponseDto,
  })
  @Post('mark-as-read')
  markAsRead(
    @Req() req,
    @Body() markAsReadDto: MarkNotificationAsReadDto,
  ): Promise<MarkNotificationAsReadResponseDto> {
    return this.notificationService.markAsRead(req.user, markAsReadDto);
  }
}
