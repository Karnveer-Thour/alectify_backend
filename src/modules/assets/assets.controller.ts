import { BaseResponseDto } from '@common/dto/base-response.dto';
import { Controller, Param, ParseUUIDPipe, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssetsService } from './assets.service';

@ApiBearerAuth()
@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @ApiOkResponse({
    type: BaseResponseDto,
  })
  @Post('generate-asset-report/:id')
  generateAssetReport(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    // return this.assetsService.generateAssetReport(req.user, id);
  }
}
