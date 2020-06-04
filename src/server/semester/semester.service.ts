import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './semester.entity';
import { TERM } from 'common/constants';

/**
 * @class SemesterService
 * Injectable service that provides additional methods for querying the
 * database for Semester data.
 */
@Injectable()
export class SemesterService {
  @InjectRepository(Semester)
  private readonly semesterRepository: Repository<Semester>

  /**
   * Resolves to an array containing all of the years that currently exist in the
   * database, as strings
   */
  public async getYearList(): Promise<string[]> {
    return this.semesterRepository
      .createQueryBuilder('sem')
      .select('sem.academicYear', 'year')
      .distinct(true)
      .orderBy('year', 'ASC')
      .getRawMany()
      .then(
        // raw result is array of e.g. { year: '2020'} so we need to map
        (results): string[] => results.map(({ year }): string => year)
      );
  }

  /**
   * Resolve an array containing all semesters that currently exist in the
   * database, as strings
   */
  public async getSemesterList(): Promise<string[]> {
    return this.semesterRepository
      .createQueryBuilder('sem')
      .select('sem.term', 'term')
      .addSelect('sem."academicYear"', 'year')
      .addSelect(`CASE
      WHEN term = '${TERM.SPRING}' THEN 1
      WHEN term = '${TERM.FALL}' THEN 2
      ELSE 3
    END`, 'termOrder')
      .distinct(true)
      .orderBy('year', 'ASC')
      .addOrderBy('"termOrder"', 'ASC')
      .getRawMany()
      .then(
        // raw result is array, so we need to map to get the desired format (e.g. 'FALL 2021')
        (results): string[] => results.map(({ term, year }): string => `${term} ${year}`)
      );
  }
}
