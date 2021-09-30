import { ConfigService } from 'server/config/config.service';
import { TestingModule, Test } from '@nestjs/testing';
import { stub } from 'sinon';
import {
  strictEqual, deepStrictEqual, rejects,
} from 'assert';
import {
  rawAreaList,
  year,
  createNonClassParent,
  computationalModelingofFluidsReadingGroup,
  dataScienceReadingGroup,
  nonClassParent,
} from 'testData';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Area } from 'server/area/area.entity';
import { BadRequestException } from '@nestjs/common';
import { AuthModule } from 'server/auth/auth.module';
import { AUTH_MODE } from 'common/constants';
import { EntityNotFoundError } from 'typeorm';
import { NonClassEventService } from '../nonClassEvent.service';
import { NonClassEventController } from '../nonClassEvent.controller';
import { TestingStrategy } from '../../../../tests/mocks/authentication/testing.strategy';
import { NonClassParent } from '../nonclassparent.entity';

const mockNonClassEventService = {
  find: stub(),
  createWithNonClassEvents: stub(),
};

const mockAreaRepository = {
  findOneOrFail: stub(),
};

const mockParentRepository = {
  findOne: stub(),
};

describe.only('NonClassEvent controller', function () {
  let controller: NonClassEventController;
  let configService: ConfigService;

  beforeEach(async function () {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule.register({
          strategies: [TestingStrategy],
          defaultStrategy: AUTH_MODE.TEST,
        }),
      ],
      controllers: [NonClassEventController],
      providers: [
        ConfigService,
        {
          provide: NonClassEventService,
          useValue: mockNonClassEventService,
        },
        {
          provide: getRepositoryToken(Area),
          useValue: mockAreaRepository,
        },
        {
          provide: getRepositoryToken(NonClassParent),
          useValue: mockParentRepository,
        },
      ],
    })
      .compile();
    controller = testModule
      .get<NonClassEventController>(NonClassEventController);
    configService = testModule
      .get<ConfigService>(ConfigService);
  });
  afterEach(function () {
    mockNonClassEventService.find.resetHistory();
  });
  describe('find', function () {
    it('retrieves all results for the specified academic year', async function () {
      mockNonClassEventService.find.resolves([]);

      await controller.find(year);

      strictEqual(mockNonClassEventService.find.args[0][0], year);
    });
    it('defaults to the current academic year if one was not specified', async function () {
      // A ridiculously out of date value, that couldn't be generated by an
      // off-by-one error
      const currentAcdemicYear = 2012;
      mockNonClassEventService.find.resolves([]);
      stub(configService, 'academicYear').get(() => currentAcdemicYear);

      await controller.find();

      strictEqual(mockNonClassEventService.find.args[0][0], currentAcdemicYear);
    });
    it('returns all the NonClassEvent records in the database', async function () {
      const mockData = [
        dataScienceReadingGroup,
        computationalModelingofFluidsReadingGroup,
      ];
      mockNonClassEventService.find.resolves(mockData);

      const results = await controller.find();

      deepStrictEqual(
        Object.values(results)
          .reduce((acc, val) => acc.concat(val), []),
        mockData
      );
    });
    it('groups NonClassParents by academic year', async function () {
      const {
        spring: springSemester,
      } = computationalModelingofFluidsReadingGroup;

      const mockData = [
        dataScienceReadingGroup,
        {
          ...computationalModelingofFluidsReadingGroup,
          spring: {
            ...springSemester,
            academicYear: (
              parseInt(springSemester.calendarYear, 10) + 2
            ).toString(),
          },
        },
      ];
      mockNonClassEventService.find.resolves(mockData);

      const results = await controller.find();

      deepStrictEqual(
        Object.keys(results),
        [...new Set(mockData.map(({ spring }) => spring.calendarYear))]
      );
    });
  });
  describe.only('create', function () {
    it('creates non class parents within an existing area', async function () {
      const mockArea = rawAreaList[0];
      mockAreaRepository.findOneOrFail.resolves(mockArea);

      await controller.create(createNonClassParent);

      strictEqual(
        mockNonClassEventService.createWithNonClassEvents.args[0][0].area,
        mockArea
      );
    });
    it('reteurns the newly created non-class parent data', async function () {
      const mockArea = rawAreaList[0];
      mockAreaRepository.findOneOrFail.resolves(mockArea);
      mockParentRepository.findOne.resolves(nonClassParent);

      const parent = await controller.create(createNonClassParent);

      strictEqual(
        parent,
        nonClassParent
      );
    });
    it('throws BadRequestException for an invalid area', function () {
      mockAreaRepository.findOneOrFail.rejects(EntityNotFoundError);

      void rejects(() => controller.create({
        ...createNonClassParent,
        area: 'I don\'t exist',
      }), BadRequestException);
    });
    it('allows other errors to bubble', function () {
      mockAreaRepository.findOneOrFail.rejects(Error);

      void rejects(() => controller.create(createNonClassParent), Error);
    });
  });
});
