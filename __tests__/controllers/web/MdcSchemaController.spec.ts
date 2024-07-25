'use strict';
import { MdcSchemaController } from '../../../src/controllers/web/MdcSchemaController';
import { environmentConfig } from '../../../src/config/environmentConfig';
import { Request, ResponseToolkit } from '@hapi/hapi';

describe('MdcSchemaController', () => {
  let request: Request;
  let responseToolkit: ResponseToolkit;

  beforeEach(() => {
    request = {} as any;
    responseToolkit = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn(),
      view: jest.fn(),
      header: jest.fn(),
    } as any;
  });

  it('MdcSchemaHandler should return the correct view with XML header', async () => {
      await MdcSchemaController.MdcSchemaHandler(request, responseToolkit);
      expect(responseToolkit.view).toHaveBeenCalledWith("screens/mdc/mdc", { webDomain: environmentConfig.webDomain });
  });

  it('MdcSchemaHandler should handle errors correctly', async () => {
    responseToolkit.view = jest.fn().mockImplementation(() => { throw new Error('Test error'); });
    const response = await MdcSchemaController.MdcSchemaHandler(request as Request, responseToolkit as ResponseToolkit);
    expect(responseToolkit.response).toHaveBeenCalledWith({ error: 'An error occurred while processing your request' });
    expect(responseToolkit.response().code).toHaveBeenCalledWith(500);
  });

  it('MdcClassifierSchemaHandler should return the correct view with XML header', async () => {
    await MdcSchemaController.MdcClassifierSchemaHandler(request, responseToolkit);
    expect(responseToolkit.view).toHaveBeenCalledWith("screens/mdc/classifiers", { webDomain: environmentConfig.webDomain });
  });

  it('MdcClassifierSchemaHandler should handle errors correctly', async () => {
    responseToolkit.view = jest.fn().mockImplementation(() => { throw new Error('Test error'); });
    const response = await MdcSchemaController.MdcClassifierSchemaHandler(request as Request, responseToolkit as ResponseToolkit);
    expect(responseToolkit.response).toHaveBeenCalledWith({ error: 'An error occurred while processing your request' });
    expect(responseToolkit.response().code).toHaveBeenCalledWith(500);
  });

  it('MdcIdentifierSchemaHandler should return the correct view with XML header', async () => {
    await MdcSchemaController.MdcIdentifierSchemaHandler(request, responseToolkit);
    expect(responseToolkit.view).toHaveBeenCalledWith("screens/mdc/identifiers", { webDomain: environmentConfig.webDomain });
  });

  it('MdcIdentifierSchemaHandler should handle errors correctly', async () => {
  responseToolkit.view = jest.fn().mockImplementation(() => { throw new Error('Test error'); });
  const response = await MdcSchemaController.MdcIdentifierSchemaHandler(request as Request, responseToolkit as ResponseToolkit);
  expect(responseToolkit.response).toHaveBeenCalledWith({ error: 'An error occurred while processing your request' });
  expect(responseToolkit.response().code).toHaveBeenCalledWith(500);
  });
});
