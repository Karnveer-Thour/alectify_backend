import { IsObjectOrEmptyString } from '@common/validators/is-object-or-empty-string.validator';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export abstract class LLMAPIResponseDTO<ResponseData> {
  @IsObjectOrEmptyString() @IsOptional() data?:
    | ''
    | ResponseData
    | Record<'array', Array<ResponseData>>;
  @IsBoolean() @IsOptional() status: boolean;
  @IsString() message: string;
}
