import { ISharedData } from '../../models/interfaces/sharedData.interface';
import { Server } from '@hapi/hapi';

module.exports = {
  name: 'SharedData',
  register: async (server: Server) => {
    const sharedData: ISharedData = {};

    server.decorate('server', 'getSharedData', () => sharedData);

    server.decorate('server', 'updateSharedData', (key: string, value: string | number | null | object) => {
      sharedData[key] = value;
    });

    server.decorate('server', 'purgeSharedData', (key: string) => {
      delete sharedData[key];
    });
  },
};
