import * as express from 'express';
import * as path from 'path';
import * as compression from 'compression';
import * as session from 'express-session';

let redisstore = require('connect-redis')(session);

export class Express {
  module(app: any, passport: any) {
    app.set('case sensitive routing', false);
    app.set('host', process.env.HOST || 'localhost');
    app.set('port', process.env.PORT || 8192);
    app.set('view cache', true);
    app.set('view engine', 'pug');
    app.use(compression());
    app.locals.pretty = true;

    app.use(function(req: any, res: any, next: any) {
        let schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
        if (schema === 'https') {
            next();
        } else if (process.env === 'production') {
            res.redirect('https://' + req.get('host') + req.url);
        } else {
            next();
        }
    });

    app.get('/app/main.js', ensureAuthenticated);


    app.use('/app', express.static('app', {
        maxAge: -1
    }));

    app.use('/angular', express.static('node_modules/@angular', {
        maxAge: 1536000000
    }));

    app.use('/public', express.static('public', {
        maxAge: 31536000000
    }));

    app.use('/docs', express.static('docs', {
        maxAge: 31536000000
    }));

    app.use('/modules', express.static('node_modules', {
        maxAge: 31536000000
    }));

    let sess: any = {
        store: new redisstore({
            client: redis
        }),
        genid: function(req: any) {
            return guid(); // use UUIDs for session IDs
        },
        key: 'JSESSIONID',
        secret: 'as5HjIILYjdjet',
        resave: false,
        cookie: {
            path: '/',
            httpOnly: false,
            maxAge: 86400000
        },
        saveUninitialized: false
    };

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1); // trust first proxy
        // sess.cookie.secure = true; // serve secure cookies
    }

    app.use(session(sess));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function(user: any, done: any) {
        done(null, user);
    });

    passport.deserializeUser(function(obj: any, done: any) {
        done(null, obj);
    });
  }
ensureAuthenticated(req: any, res: any, next: any) {
      if (req.isAuthenticated()) {
          console.log('authenticated');
          res.sendFile(path.resolve('app') + '/main.js');
      } else {
          console.log('not authenticated');
          res.sendFile(path.resolve('app') + '/main.js');
      }
  }
}
