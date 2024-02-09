import { initializeServer, startServer } from './infrastructure/server';

const bootstrap = async () => {
  await initializeServer()
    .then(startServer)
    .catch((error: Error) => {
      console.log(`Server initialization error, ${error}`);
    });
};

bootstrap();
