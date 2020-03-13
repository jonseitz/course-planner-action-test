import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from 'server/area/area.entity';
import { Course } from 'server/course/course.entity';
import { Semester } from 'server/semester/semester.entity';
import { Faculty } from 'server/faculty/faculty.entity';
import { Room } from 'server/location/room.entity';
import { Building } from 'server/location/building.entity';
import { Campus } from 'server/location/campus.entity';
import { CourseInstance } from 'server/courseInstance/courseinstance.entity';
import { Meeting } from 'server/meeting/meeting.entity';
import { FacultyCourseInstance } from 'server/courseInstance/facultycourseinstance.entity';
import { PopulationService } from './population.service';
import { SemesterPopulationService } from './semester.population';
import { AreaPopulationService } from './area.population';
import { CoursePopulationService } from './course.population';
import { FacultyPopulationService } from './faculty.population';
import { RoomPopulationService } from './room.population';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Area,
      Building,
      Campus,
      Course,
      CourseInstance,
      FacultyCourseInstance,
      Faculty,
      Meeting,
      Room,
      Semester,
    ]),
  ],
  providers: [
    AreaPopulationService,
    CoursePopulationService,
    FacultyPopulationService,
    RoomPopulationService,
    SemesterPopulationService,
    PopulationService,
  ],
  exports: [
    AreaPopulationService,
    CoursePopulationService,
    FacultyPopulationService,
    RoomPopulationService,
    SemesterPopulationService,
    PopulationService,
  ],
})
export class PopulationModule { }
