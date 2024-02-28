export const resourceTypeAPIResponse = {
  took: 2,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 1,
      relation: 'eq',
    },
    max_score: null,
    hits: [],
  },
  aggregations: {
    unique_values: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: 'dataset',
          doc_count: 1,
        },
        {
          key: 'map',
          doc_count: 1,
        },
        {
          key: 'map/static',
          doc_count: 1,
        },
      ],
    },
  },
};

export const formattedResourceTypeResponse = [
  {
    value: 'dataset',
    text: 'Dataset',
  },
  {
    value: 'map',
    text: 'Map',
  },
  {
    value: 'map/static',
    text: 'Map/Static',
  },
];
