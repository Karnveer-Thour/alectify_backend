import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { GetAllCommentsResponseDto } from './dto/get-all-comments.dto';
import { CreateCommentForAPIDto } from './dto/create-comments.dto';
import { CreateCommentDjangoResponseDto } from './dto/create-comment-response.dto';
import { CreateCommentParamsDto } from './dto/create-comment-params.dto';

@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOkResponse({
    type: GetAllCommentsResponseDto,
  })
  @Get()
  getCompleteTimeline(
    @Req() req,
    @Query()
    { page = 1, limit = 10 }: { limit: number; page: number },
  ): Promise<GetAllCommentsResponseDto> {
    return this.commentsService.getCompleteTimeline(req.user, {
      page,
      limit,
      route: req.protocol + '://' + req.get('host') + req.path,
    });
  }

  @ApiOkResponse({
    type: CreateCommentDjangoResponseDto,
  })
  @Post(':subProjectId/:referenceId')
  create(
    @Req() req,
    @Param() params: CreateCommentParamsDto,
    @Body() createCommentsDto: CreateCommentForAPIDto,
  ): Promise<CreateCommentDjangoResponseDto> {
    const authToken = req.headers.authorization;
    return this.commentsService.createComment(
      params,
      createCommentsDto,
      authToken,
    );
  }
}
