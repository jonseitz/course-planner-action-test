import { Test, TestingModule } from '@nestjs/testing';
import { stub } from 'sinon';
import { regularUser } from 'testData';
import { deepStrictEqual, strictEqual } from 'assert';
import { HarvardKeyProfile } from 'server/interfaces';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'server/models';
import { SAMLStrategy } from '../saml.strategy';
import { ConfigService } from '../config.service';

describe('SAML Strategy', function () {
  const config = {
    isProduction: null,
    get: stub(),
  };

  afterEach(function () {
    config.get.resetHistory();
  });

  it('re-maps harvard key user info to a user object', async function () {
    config.isProduction = true;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: config,
        },
        SAMLStrategy,
      ],
    }).compile();

    const saml = module.get<SAMLStrategy>(SAMLStrategy);

    const {
      id,
      lastName,
      firstName,
      email,
    } = regularUser;

    const user = await saml.validate({
      eppn: id,
      givenName: firstName,
      sn: lastName,
      email,
    } as HarvardKeyProfile);

    deepStrictEqual(user, regularUser);
  });
  it('rejects failed auth attempts with an exception', async function () {
    config.isProduction = true;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: config,
        },
        SAMLStrategy,
      ],
    }).compile();

    const saml = module.get<SAMLStrategy>(SAMLStrategy);

    try {
      await saml.validate();
    } catch (error) {
      strictEqual(error instanceof UnauthorizedException, true);
    }
  });
  it('returns a dummy user when app is in dev mode', async function () {
    config.isProduction = false;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: config,
        },
        SAMLStrategy,
      ],
    }).compile();

    const saml = module.get<SAMLStrategy>(SAMLStrategy);

    const user = await saml.validate();

    deepStrictEqual(user, new User({
      email: 'noreply@seas.harvard.edu',
      id: 'abc123',
      firstName: 'Test',
      lastName: 'User',
    }));
  });
});
