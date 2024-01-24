import { ISharedData } from '../interfaces/sharedData.interface';

declare module '@hapi/hapi' {
  interface Server {
    getSharedData: () => ISharedData;
    updateSharedData: (key: string, value: string | number | null | object) => void;
    purgeSharedData: (key: string) => void;
    resetSharedData: () => void;
  }
}
