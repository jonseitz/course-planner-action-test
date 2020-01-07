import { Strategy } from 'passport-saml';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HarvardKeyProfile } from '../user/harvardKey.interface';
import { User } from '../user/user.entity';
import { ConfigService } from '../config/config.service';

/**
 * Implements passport-saml to connect to Harvard Key for authentication
 */

@Injectable()
class SAMLStrategy extends PassportStrategy(Strategy) {
  public constructor(config: ConfigService) {
    super({
      entryPoint: config.get('CAS_URL'),
      issuer: 'passport-saml',
      host: config.get('EXTERNAL_URL'),
    });
  }

  public async validate(profile?: HarvardKeyProfile): Promise<User> {
    if (!profile) {
      throw new UnauthorizedException('You are not authorized to use this application. Please contact SEAS computing');
    } else {
      return new User({
        eppn: profile.eppn,
        firstName: profile.givenName,
        lastName: profile.sn,
        email: profile.email,
      });
    }
  }
}

export { SAMLStrategy };
