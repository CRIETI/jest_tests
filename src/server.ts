import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios';
import autenticacaoRoutes from './routes/autenticacao';
import { basicAuth } from './middlewares/basic-auth';

const PORT: Number = Number(process.env.SERVER_PORT || 3000);

let server: Express = express();

server.use(cors());
server.use(express.json());

server.use((req: Request, res: Response, next: NextFunction) => {
  console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
  next();
});

server.use(autenticacaoRoutes);
server.use(usuariosRoutes);

const serverInstance = server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});

export const stopServer = () => {
  return new Promise<void>((resolve) => {
    serverInstance.close(() => {
      console.log('Server stopped');
      resolve();
    });
  });
};

export default server;
