interface SearchResponse {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}

interface Hits {
  total: Total;
  max_score: number;
  hits: Hit[];
}

interface Hit {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: Source;
  edit: boolean;
  canReview: boolean;
  owner: boolean;
  isPublishedToAll: boolean;
  view: boolean;
  notify: boolean;
  download: boolean;
  dynamic: boolean;
  featured: boolean;
  selected: boolean;
}

interface Source {
  OrgForResourceObject: OrgForResourceObject[];
  contactForResource: ContactForResource[];
  OrgObject: OrgForResourceObject;
  rating: string;
  link: Link[];
  geom: Geom;
  uuid: string;
  valid: string;
  draft: string;
  contact: ContactForResource[];
  cat: string[];
  logo: string;
  id: string;
  owner: string;
  groupOwner: string;
  resourceTitleObject: OrgForResourceObject;
  cl_topic: Cltopic[];
  documentStandard: string;
  dateStamp: string;
  resourceAbstractObject: OrgForResourceObject;
  isTemplate: string;
  standardNameObject: UrlObject;
  isHarvested: string;
  resourceType: string[];
}

interface Cltopic {
  default: string;
  langeng: string;
  key: string;
}

interface Geom {
  coordinates: number[][][];
  type: string;
}

interface Link {
  protocol: string;
  descriptionObject: OrgForResourceObject;
  function: string;
  applicationProfile: string;
  mimeType: string;
  urlObject: UrlObject;
  nameObject: OrgForResourceObject;
  group: number;
}

interface UrlObject {
  default: string;
}

interface ContactForResource {
  website: string;
  role: string;
  address: string;
  individual: string;
  phone: string;
  logo: string;
  position: string;
  organisationObject: OrgForResourceObject;
  email: string;
}

interface OrgForResourceObject {
  default: string;
  langeng: string;
}

interface Total {
  value: number;
  relation: string;
}

interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export { SearchResponse };
