import { ApiResponse } from '../../../src/models/ApiResponse';
import { geoNetworkClient } from '../../../src/config/geoNetworkClient';
import { getSearchResults } from '../../../src/services/handlers/searchResultsApi';

jest.mock('../../../src/config/geoNetworkClient');

describe('Get Search Results API Handler', () => {
  it('should make a successful API call', async () => {
    (geoNetworkClient.post as jest.Mock).mockResolvedValue(
      new ApiResponse({}, 200, true)
    );
    const result = await getSearchResults('test search term');
    expect(result.isSuccessful).toEqual(true);
    expect(result.status).toEqual(200);
  });

  it('should handle API call error', async () => {
    (geoNetworkClient.post as jest.Mock).mockResolvedValue(
      new ApiResponse(
        { message: 'Unable to fetch the search results.' },
        400,
        false
      )
    );
    const result = await getSearchResults(null);
    expect(result.isSuccessful).toEqual(false);
    expect(result.status).toEqual(400);
  });
});
