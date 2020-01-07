import { Test, TestingModule } from '@nestjs/testing';
import { stub } from 'sinon';
import { regularUser } from 'testData';
import { deepStrictEqual, strictEqual } from 'assert';
import { UnauthorizedException } from '@nestjs/common';
import { HarvardKeyProfile } from '../../user/harvardKey.interface';
import { SAMLStrategy } from '../saml.strategy';
import { ConfigService } from '../../config/config.service';

describe('SAML Strategy', function () {
  let strategy: SAMLStrategy;

  const config = {
    get: stub(),
  };

  beforeEach(async function () {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: config,
        },
        SAMLStrategy,
      ],
    }).compile();

    strategy = module.get<SAMLStrategy>(SAMLStrategy);
  });

  afterEach(function () {
    config.get.resetHistory();
  });

  it('re-maps HarvardKey response to a user object on successful authentication', async function () {
    const {
      eppn,
      lastName,
      firstName,
      email,
    } = regularUser;

    const user = await strategy.validate({
      eppn,
      givenName: firstName,
      sn: lastName,
      email,
    } as HarvardKeyProfile);

    deepStrictEqual(user, regularUser);
  });
  it('rejects failed auth attempts with an exception', async function () {
    try {
      await strategy.validate();
    } catch (error) {
      strictEqual(error instanceof UnauthorizedException, true);
    }
  });
});
