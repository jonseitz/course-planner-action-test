import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { FacultyResponseDTO } from 'common/dto/faculty/facultyResponse.dto';
import { CreateFacultyDTO } from 'common/dto/faculty/createFaculty.dto';
import { UpdateFacultyDTO } from 'common/dto/faculty/updateFaculty.dto';
import { Authentication } from 'server/auth/authentication.guard';
import { Area } from 'server/area/area.entity';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Faculty } from './faculty.entity';

@UseGuards(Authentication)
@Controller('api/faculty')
export class ManageFacultyController {
  @InjectRepository(Faculty)
  private facultyRepository: Repository<Faculty>

  @InjectRepository(Area)
  private areaRepository: Repository<Area>

  @Get('/')
  @ApiOperation({ title: 'Retrieve all faculty in the database' })
  @ApiOkResponse({
    type: FacultyResponseDTO,
    description: 'An array of all the faculty along with their area',
    isArray: true,
  })
  public async getAll(): Promise<FacultyResponseDTO[]> {
    const facultyMembers = await this.facultyRepository.find({
      relations: ['area'],
    });
    return facultyMembers.map((faculty: Faculty): FacultyResponseDTO => ({
      ...faculty,
      area: {
        id: faculty.area.id,
        name: faculty.area.name,
      },
    }));
  }

  @Post('/')
  @ApiOperation({ title: 'Create a new faculty entry in the database' })
  @ApiOkResponse({
    type: FacultyResponseDTO,
    description: 'An object with the newly created faculty member\'s information.',
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: the request is not in accordance with the createFaculty DTO',
  })
  public async create(@Body() faculty: CreateFacultyDTO):
  Promise<FacultyResponseDTO> {
    return this.facultyRepository.create({
      HUID: faculty.HUID,
      firstName: faculty.firstName,
      lastName: faculty.lastName,
      category: faculty.category,
      area: faculty.area,
      jointWith: faculty.jointWith,
    });
  }

  @Put(':id')
  @ApiOperation({ title: 'Edit an existing faculty entry in the database' })
  @ApiOkResponse({
    type: FacultyResponseDTO,
    description: 'An object with the edited faculty member\'s information.',
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: The request is not in accordance with the updateFaculty DTO',
  })
  @ApiNotFoundResponse({
    description: 'Not Found: The requested entity with the ID supplied could not be found',
  })
  public async update(@Param('id') id: string, @Body() faculty: UpdateFacultyDTO):
  Promise<FacultyResponseDTO> {
    try {
      await this.facultyRepository.findOneOrFail(id);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('Could not find any entity of type Faculty with the supplied ID');
      }
    }
    const existingArea = await this.areaRepository.findOneOrFail(faculty.area);
    if (!existingArea) {
      throw new BadRequestException('The entered Area does not exist');
    }
    const validFaculty = {
      ...faculty,
      area: existingArea,
    };
    this.facultyRepository.update(id, validFaculty);
    return {
      id,
      ...validFaculty,
    };
  }
}
