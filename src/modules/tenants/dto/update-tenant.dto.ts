
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTenantDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
