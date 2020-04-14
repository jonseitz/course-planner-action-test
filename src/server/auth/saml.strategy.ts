import { Strategy, Profile } from 'passport-saml';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_MODE } from 'common/constants';
import { User } from '../user/user.entity';
import { ConfigService } from '../config/config.service';

/**
 * Representation of user data as returned by HarvardKey. For more information
 * see {@link https://iam.harvard.edu/resources/idp-guide}
 *
 */
export interface HarvardKeyProfile extends Profile {
  /**
   * EPPN is a shorthand for eduPersonPrincipalName, an attribute defined in
   * the {@link http://middleware.internet2.edu/eduperson/docs/internet2-mace-dir-eduperson-201203.html Internet2 eduPerson object class specification}
   * that is intended to uniquely identify a user at a given institution. At
   * Harvard, we create an EPPN for each user by transforming a long
   * "opaque internal identifier" into a shorter opaque identifier and then
   * adding on "@harvard.edu" -  for example,  4A2849CF119852@harvard.edu.
   *
   * An EPPN remains the same even if a user change their name — making it, in
   * identity management terminology, unique and persistent.
   *
   * ---
   *
   * **Please note:** Whilst [[eppn]] may _look_ the same as an email address -
   * an email addresses can change (for example, if a user changes their
   * name etc.), whilst an EPPN cannot. This means that EPPN is **NOT**
   * nececcarily the same as `email`(inherited from `Profile`) and the two
   * should not be considered interchangeable
   *
   * For more information on harvard key and identity management, see
   * {@link https://iam.harvard.edu/resources/idp-guide the IAM web site}
   *
   * @example 4A2849CF119852@harvard.edu
   */
  eppn: string;

  /**
   * The user's first name
   * @example James
   */
  givenName: string;

  /**
   * The user's lastname
   * @example Waldo
   */
  sn: string;

  /**
   * The format in which the user's name should be displayed. This is often
   * (though not always) in the format of `<firstName> <lastName>`
   * @example James Waldo
   */
  displayName: string;
}


/**
 * Implements passport-saml to connect to Harvard Key for authentication
 */

@Injectable()
class SAMLStrategy extends PassportStrategy(Strategy, AUTH_MODE.HKEY) {
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
    }
    const authenticatedUser = new User({
      eppn: profile.eppn,
      firstName: profile.givenName,
      lastName: profile.sn,
      email: profile.email,
    });
    return authenticatedUser;
  }
}

export { SAMLStrategy };
