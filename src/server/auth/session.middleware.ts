import { Injectable } from '@nestjs/common';
import session, { Store } from 'express-session';
import { RequestHandler } from '@nestjs/common/interfaces';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { ConfigService } from '../config/config.service';

/**
 * Configures express sessions for storing user data returned from Harvard Key.
 * Session key will be stored in a cookie and used to retrieve the values
 */
@Injectable()
class SessionMiddleware {
  public use: RequestHandler;

  public constructor(config: ConfigService, store: Store) {
    this.use = (req: Request, res: Response, next: NextFunction): void => {
      const sessionfactory = session({
        secret: config.get('SESSION_SECRET'),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        store,
        resave: true,
        saveUninitialized: false,
      });
      const passportSession = passport.session();

      sessionfactory(req, res, (): void => passportSession(req, res, next));
    };
  }
}

export { SessionMiddleware };
