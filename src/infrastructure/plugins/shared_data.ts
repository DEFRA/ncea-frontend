import { Server } from '@hapi/hapi';

interface ShareData {
  [key: string]: null;
}

interface ServerWithDecorators extends Server {
  updateSharedData: (key: string, value: null) => void;
  purgeSharedData: (key: string) => void;
}

module.exports = {
  plugin: 'SharedData',
  register: (server: ServerWithDecorators) => {
    const sharedData: ShareData = {};

    server.expose('getSharedData', () => sharedData);

    server.decorate(
      'server',
      'updateSharedData',
      (key: string, value: null) => {
        sharedData[key] = value;
      }
    );

    server.decorate('server', 'purgeSharedData', (key: string) => {
      delete sharedData[key];
    });
  },
};
