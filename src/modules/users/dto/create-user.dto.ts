import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @IsEnum(UserRole)
  role: UserRole;
}