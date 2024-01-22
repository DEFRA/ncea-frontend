import { Server } from '@hapi/hapi';

module.exports = {
  plugin: 'SharedData',
  register: (server: Server) => {
    const sharedData: { [key: string]: null } = {};

    server.expose('getSharedData', () => sharedData);

    server.decorate('server', 'updateSharedData', (key, value) => {
      sharedData[key] = value;
    });

    server.decorate('server', 'purgeSharedData', (key) => {
      delete sharedData[key];
    });
  },
};
