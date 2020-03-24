import { strictEqual, deepStrictEqual } from 'assert';
import {
  createStubInstance,
  SinonStubbedInstance,
  SinonStub,
  stub,
} from 'sinon';
import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { Semester } from 'server/semester/semester.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SemesterService } from '../semester.service';

describe('Semester Service', function () {
  let semesterService: SemesterService;
  let mockSemesterRepository: Record<string, SinonStub>;
  let mockSemesterQueryBuilder: SinonStubbedInstance<
  SelectQueryBuilder<Semester>
  >;

  beforeEach(async function () {
    mockSemesterQueryBuilder = createStubInstance(SelectQueryBuilder);
    mockSemesterRepository = {};
    mockSemesterRepository.createQueryBuilder = stub()
      .returns(mockSemesterQueryBuilder);
    const testModule = await Test.createTestingModule({
      providers: [
        SemesterService,
        {
          provide: getRepositoryToken(Semester),
          useValue: mockSemesterRepository,
        },
        SemesterService,
      ],
    }).compile();
    semesterService = testModule.get<SemesterService>(SemesterService);
  });
  describe('getYearList', function () {
    context('When there are records in the database', function () {
      const rawYearList = [
        { year: '2018' },
        { year: '2019' },
        { year: '2020' },
        { year: '2021' },
      ];
      beforeEach(function () {
        mockSemesterQueryBuilder.select.returnsThis();
        mockSemesterQueryBuilder.distinct.returnsThis();
        mockSemesterQueryBuilder.orderBy.returnsThis();
        mockSemesterQueryBuilder.getRawMany.resolves(rawYearList);
      });
      it('returns a list of years as string[]', async function () {
        const result = await semesterService.getYearList();
        strictEqual(result.length, rawYearList.length);
        deepStrictEqual(result, ['2018', '2019', '2020', '2021']);
      });
    });
    context('When there are no records in the database', function () {
      const rawYearList = [];
      beforeEach(function () {
        mockSemesterQueryBuilder.select.returnsThis();
        mockSemesterQueryBuilder.distinct.returnsThis();
        mockSemesterQueryBuilder.orderBy.returnsThis();
        mockSemesterQueryBuilder.getRawMany.resolves(rawYearList);
      });
      it('returns an empty array', async function () {
        const result = await semesterService.getYearList();
        strictEqual(result.length, rawYearList.length);
        deepStrictEqual(result, []);
      });
    });
  });
});
