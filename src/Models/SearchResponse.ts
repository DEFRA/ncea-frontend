export class SearchResponse {
  took!: number;
  timed_out!: boolean;
  _shards!: Shards;
  hits!: Hits;
}

export class Hits {
  total!: Total;
  max_score!: number;
  hits!: Hit[];
}

export class Hit {
  _index!: string;
  _type!: string;
  _id!: string;
  _score!: number;
  _source!: Source;
  edit!: boolean;
  canReview!: boolean;
  owner!: boolean;
  isPublishedToAll!: boolean;
  view!: boolean;
  notify!: boolean;
  download!: boolean;
  dynamic!: boolean;
  featured!: boolean;
  selected!: boolean;
}

export class Source {
  OrgForResourceObject!: OrgForResourceObject[];
  contactForResource!: ContactForResource[];
  OrgObject!: OrgForResourceObject;
  rating!: string;
  link!: Link[];
  geom!: Geom;
  uuid!: string;
  valid!: string;
  draft!: string;
  contact!: ContactForResource[];
  cat!: string[];
  logo!: string;
  id!: string;
  owner!: string;
  groupOwner!: string;
  resourceTitleObject!: OrgForResourceObject;
  cl_topic!: Cltopic[];
  documentStandard!: string;
  dateStamp!: string;
  resourceAbstractObject!: OrgForResourceObject;
  isTemplate!: string;
  standardNameObject!: UrlObject;
  isHarvested!: string;
  resourceType!: string[];
}

export class Cltopic {
  default!: string;
  langeng!: string;
  key!: string;
}

export class Geom {
  coordinates!: number[][][];
  type!: string;
}

export class Link {
  protocol!: string;
  descriptionObject!: OrgForResourceObject;
  function!: string;
  applicationProfile!: string;
  mimeType!: string;
  urlObject!: UrlObject;
  nameObject!: OrgForResourceObject;
  group!: number;
}

export class UrlObject {
  default!: string;
}

export class ContactForResource {
  website!: string;
  role!: string;
  address!: string;
  individual!: string;
  phone!: string;
  logo!: string;
  position!: string;
  organisationObject!: OrgForResourceObject;
  email!: string;
}

export class OrgForResourceObject {
  default!: string;
  langeng!: string;
}

export class Total {
  value!: number;
  relation!: string;
}

export class Shards {
  total!: number;
  successful!: number;
  skipped!: number;
  failed!: number;
}
