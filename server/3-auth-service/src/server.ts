import http from 'http';

import { Logger } from 'winston';
import { Application } from 'express';
// import hpp from 'hpp';
// import helmet from 'helmet';
// import cors from 'cors';
import { IAuthPayload } from '@rohanpradev/jobber-shared';
// import { verify } from 'jsonwebtoken';

import { config } from './config';
import { winstonLogger } from './logger';

declare global {
  namespace Express {
    interface Request {
      currentUser?: IAuthPayload;
    }
  }
}

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export function start(app: Application): void {
  startServer(app);
}

// function securityMiddleware(app: Application): void {
//   app.set('trust proxy', 1);
//   app.use(hpp());
//   app.use(helmet());
//   app.use(
//     cors({
//       origin: config.API_GATEWAY_URL,
//       credentials: true,
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
//     })
//   );
//   app.use((req: Request, _res: Response, next: NextFunction) => {
//     if (req.headers.authorization) {
//       const token = req.headers.authorization.split(' ')[1];
//       const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
//       req.currentUser = payload;
//     }
//     next();
//   });
// }

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Authentication server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Authentication server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'AuthService startServer() method error:', error);
  }
}
