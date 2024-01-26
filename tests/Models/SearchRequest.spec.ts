import { SearchRequest, BoolModel, Must, Query, Querystring, Source } from '../../src/Models/SearchRequest'


describe('SearchRequest class', () => {
    let queryString: Querystring;
    let must: Must;
    let boolModel: BoolModel;
    let queryModel: Query;
    let searchRequestObj: SearchRequest;
    let source: Source;
    let searchTerm: string = 'Test Search Keyword';

    beforeAll(() => {
        queryString = new Querystring(searchTerm, 'AND');
        must = new Must(queryString);
        boolModel = new BoolModel([must]);
        queryModel = new Query(boolModel);
        source = new Source(['source1'])
        searchRequestObj = new SearchRequest(queryModel,source);
    });

    it('Should create SearchRequest instance', () => {
        expect(queryString).toBeDefined();
        expect(must).toBeDefined();
        expect(boolModel).toBeDefined();
        expect(queryModel).toBeDefined();
        expect(source).toBeDefined();
        expect(searchRequestObj).toBeDefined();
        expect(searchRequestObj._source).toBe(source);
        expect(searchRequestObj.query).toBe(queryModel);
    });

});