import Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';
import { ISharedData } from '../../../src/models/interfaces/sharedData.interface';
const sharedDataPlugin = require('../../../src/infrastructure/plugins/shared_data');

describe('SharedData Plugin', () => {
  let server: Server;

  beforeEach(async () => {
    server = Hapi.server();
    await server.register(sharedDataPlugin);
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should expose getSharedData method', () => {
    expect(server.getSharedData).toBeDefined();
    expect(typeof server.getSharedData).toBe('function');
  });

  it('should expose updateSharedData method', () => {
    expect(server.updateSharedData).toBeDefined();
    expect(typeof server.updateSharedData).toBe('function');
  });

  it('should expose purgeSharedData method', () => {
    expect(server.purgeSharedData).toBeDefined();
    expect(typeof server.purgeSharedData).toBe('function');
  });

  it('should expose resetSharedData method', () => {
    expect(server.resetSharedData).toBeDefined();
    expect(typeof server.resetSharedData).toBe('function');
  });

  it('should update and get shared data', () => {
    const key = 'testKey';
    const value = 'testValue';

    server.updateSharedData(key, value);

    const retrievedValue = server.getSharedData()[key];

    expect(retrievedValue).toBe(value);
  });

  it('should purge shared data', () => {
    const key = 'testKey';
    const value = 'testValue';

    server.updateSharedData(key, value);
    server.purgeSharedData(key);

    const retrievedValue = server.getSharedData()[key];

    expect(retrievedValue).toBeUndefined();
  });

  it('should reset shared data', () => {
    const key = 'testKey';
    const value = 'testValue';

    server.updateSharedData(key, value);
    server.resetSharedData();

    const retrievedValue = server.getSharedData()[key];

    expect(retrievedValue).toBeUndefined();
  });
});
