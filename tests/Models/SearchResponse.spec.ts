import { SearchResponse, Hits, Hit, Cltopic, ContactForResource, Geom, Link, 
         OrgForResourceObject, Shards, Source, Total, UrlObject } from '../../src/Models/SearchResponse'

describe('SearchResponse class', () => {
    let searchResponse: SearchResponse;
    let hits: Hits;
    let hit: Hit;
    let cltopic: Cltopic;
    let contactForResource: ContactForResource;
    let geom: Geom;
    let link: Link;
    let orgForResourceObject: OrgForResourceObject;
    let shards: Shards;
    let source: Source;
    let total: Total;
    let urlObject: UrlObject;

    beforeAll(() => {
        urlObject = new UrlObject();
        cltopic = new Cltopic();
        total = new Total();
        orgForResourceObject = new OrgForResourceObject();
        contactForResource = new ContactForResource();
        link = new Link();
        hit = new Hit();
        hits = new Hits();
        shards = new Shards();
        geom = new Geom();
        source = new Source();
        searchResponse = new SearchResponse();
    });

    it('Should create UrlObject instance', () => {
        expect(urlObject instanceof UrlObject).toBeTruthy();
    });
    
    it('Should create Cltopic instance', () => {
        expect(cltopic instanceof Cltopic).toBeTruthy();
    });
    
    it('Should create Total instance', () => {
        expect(total instanceof Total).toBeTruthy();
    });
    
    it('Should create OrgForResourceObject instance', () => {
        expect(orgForResourceObject instanceof OrgForResourceObject).toBeTruthy();
    });
    
    it('Should create ContactForResource instance', () => {
        expect(contactForResource instanceof ContactForResource).toBeTruthy();
    });
    
    it('Should create Link instance', () => {
        expect(link instanceof Link).toBeTruthy();
    });
    
    it('Should create Hit instance', () => {
        expect(hit instanceof Hit).toBeTruthy();
    });
    
    it('Should create Hits instance', () => {
        expect(hits instanceof Hits).toBeTruthy();
    });
    
    it('Should create Shards instance', () => {
        expect(shards instanceof Shards).toBeTruthy();
    });
    
    it('Should create Geom instance', () => {
        expect(geom instanceof Geom).toBeTruthy();
    });
    
    it('Should create Source instance', () => {
        expect(source instanceof Source).toBeTruthy();
    });
    
    it('Should create SearchResponse instance', () => {
        expect(searchResponse instanceof SearchResponse).toBeTruthy();
    });

});