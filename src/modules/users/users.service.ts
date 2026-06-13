
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    tenantId: string,
  ) {
    const user =
      this.userRepository.create({

        email: createUserDto.email,

        role: createUserDto.role,

        password_hash:
          createUserDto.password_hash,

        tenant_id:
          tenantId,

        // tenant: {
        //   id: createUserDto.tenantId,
        // },
      });

    return await this.userRepository.save(
      user,
    );
  }

  async findAll() {
    return await this.userRepository.find({
      // relations: {
      //   tenant: true,
      // },
    });
  }

  async findOne(id: string) {
    const user =
      await this.userRepository.findOne({
        where: { id },

        relations: {
          tenant: true,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    const user =
      await this.findOne(id);

    const oldData = {
      ...user,
    };

    Object.assign(
      user,
      updateUserDto,
    );

    const updatedUser =
      await this.userRepository.save(
        user,
      );

    return {
      oldData,

      newData: updatedUser,
    };
  }

  async remove(id: string) {
    const user =
      await this.findOne(id);

    const deletedData = {
      ...user,
    };

    await this.userRepository.remove(
      user,
    );

    return {
      message:
        'User deleted successfully',

      deletedData,
    };
  }
}

