import { ApiResponse } from '../../src/Models/ApiResponse'

describe('ApiResponse class', () => {
    let apiResponse: ApiResponse;
    let response:any = {message:'success'};

    beforeEach(() => {
        apiResponse = new ApiResponse(response, 200, true);
    });

    it('Should create ApiResponse instance', () => {
        expect(apiResponse).toBeDefined();
        expect(apiResponse.response).toBe(response);
        expect(apiResponse.status).toBe(200);
        expect(apiResponse.isSuccessful).toBe(true);
    });

});