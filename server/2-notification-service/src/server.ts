import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { config } from '@notifications/config';
import { winstonLogger } from '@notifications/logger';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
const SERVER_PORT = 4001;

export function start(app: Application): void {
  app.use('', healthRoutes());
  startServer(app);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
