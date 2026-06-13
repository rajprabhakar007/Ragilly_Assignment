
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { UserRole } from '../../../common/enums/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  password_hash?: string;
}

