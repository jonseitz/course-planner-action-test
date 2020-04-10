import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseListingView } from 'server/course/CourseListingView.entity';
import { MultiYearPlanView } from 'server/multiYearPlan/MultiYearPlanView.entity';
import { MultiYearPlanInstanceView } from 'server/multiYearPlan/MultiYearPlanInstanceView.entity';
import { SemesterModule } from 'server/semester/semester.module';
import { SemesterService } from 'server/semester/semester.service';
import { CourseInstanceService } from './courseInstance.service';
import { CourseInstanceController } from './courseInstance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseListingView,
      MultiYearPlanView,
      MultiYearPlanInstanceView,
    ]),
    SemesterModule,
  ],
  providers: [
    SemesterService,
    CourseInstanceService,
  ],
  controllers: [CourseInstanceController],
  exports: [
    CourseInstanceService,
    TypeOrmModule,
  ],
})
export class CourseInstanceModule { }
