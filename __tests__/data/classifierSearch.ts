export const level1ApiResponse = [
  {
    sectionTitle: '',
    sectionIntroduction: '',
    level: 1,
    classifiers: [
      {
        code: 'lvl1-001',
        name: 'Natural asset',
        definition:
          'Natural Assets are the living and non-living elements of ecosystems including soils, freshwater, minerals, air and oceans. We often group assets by broad habitat types (e.g. woodland or pelagic) but can also group them by the components that make up ecosystems  (e.g. by species that span multiple habitats,  soils and sediments).',
      },
      {
        code: 'lvl1-002',
        name: 'Ecosystem service or benefit',
        definition:
          'Ecosystem services are the functions and goods that flow from natural assets which deliver benefits to people e.g. climate regulation, food production, water, energy, cultural significance. They are grouped into four broad categories: provisioning, regulating, cultural and supporting services. As most measurable ecosystem services fall under the first three categories, these have been included in this search tool.\nNatural capital benefits are the positive impacts of ecosystem services on human welfare, they enrich our lives and underpin the economy and wellbeing. The extent to which individuals and society receive benefits is affected by their values and available resources.',
      },
      {
        code: 'lvl1-003',
        name: 'Natural capital valuation',
        definition:
          'For the purposes of this search tool, natural capital valuation is defined as the method used to determine the value of an ecosystem service. This can be in non-monetary terms (e.g. heritage values or existence values) or in monetary terms (e.g. market price or willingness to pay).',
      },
      {
        code: 'lvl1-004',
        name: 'Pressure',
        definition:
          'Pressures affect the state of natural assets (their condition, extent, or location) thereby changing their ability to deliver ecosystem services. Pressures include climate change, chemical and other types of pollution, biological disturbances, hydrological changes, and land or seabed use change, and are influenced by drivers such as population growth and societal needs for food, energy, wellbeing etc. Where the pressure cannot be directly measured, the impact on natural assets can be measured instead, such as habitat destruction.  In contrast, Drivers are much broader and indirect in nature, generally creating pressures.',
      },
    ],
  },
];

export const level2ApiResponse = [
  {
    themeCode: 'lvl1-003',
    themeName: 'Natural capital valuation',
    sectionTitle: 'Natural capital valuation',
    sectionIntroduction:
      'For the purposes of this search tool, natural capital valuation is defined as the method used to determine the value of an ecosystem service. This can be in non-monetary terms (e.g. heritage values or existence values) or in monetary terms (e.g. market price or willingness to pay).',
    level: 2,
    classifiers: [
      {
        code: 'lv2-009',
        name: 'Monetary',
        definition:
          'The amount of value an item or a service has in relation to its acceptable cash price for a willing seller and buyer.',
      },
      {
        code: 'lv2-010',
        name: 'Non-monetary',
        definition:
          'The value attributable to an item or a service without relation to any acceptable cash price and for which a fixed or determinable amount of currency is absent (e.g. many ecosystem services, interpersonal good-will, health, etc.).',
      },
    ],
  },
];

export const level3ApiResponse = [
  {
    themeCode: 'lvl1-001',
    themeName: 'Natural asset',
    sectionTitle: 'Natural asset',
    sectionIntroduction:
      'Natural Assets are the living and non-living elements of ecosystems including soils, freshwater, minerals, air and oceans. We often group assets by broad habitat types (e.g. woodland or pelagic) but can also group them by the components that make up ecosystems  (e.g. by species that span multiple habitats,  soils and sediments).',
    level: 3,
    classifiers: [
      {
        code: 'lv2-001',
        name: 'Terrestrial and freshwater habitats',
        classifiers: [
          {
            code: 'lv3-001',
            name: 'Broadleaved, mixed and yew woodland',
            definition:
              'Covers all broadleaved, yew, and mixed broadleaved and coniferous stands which have more than 20% cover of broadleaved and yew trees. It includes patches of scrub where the woody element creates a canopy of more than 30% and the scrub area is above 0.25ha, recently felled broadleaved woodland, and integral features of woodland such as glades (clearings) and rides (pathways).',
          },
          {
            code: 'lv3-002',
            name: 'Coniferous woodland',
            definition:
              'Covers all coniferous stands where native and non-native conifers exceed more than 80% of the total cover of trees present.  It includes recently felled coniferous woodland and integral features of woodland, such as glades (clearings) and rides (pathways). It excludes yew woodlands.',
          },
          {
            code: 'lv3-003',
            name: 'Boundary and linear features',
            definition:
              'Covers landscape features that are linear in appearance, such as hedgerows, lines of trees, stonewalls, and built components of the rural landscape such as railways, roads, and verges. It excludes canals, rivers, woodland rides or arable field margins managed for nature conservation which are covered in other broad habitats.',
          },
          {
            code: 'lv3-004',
            name: 'Arable and horticulture',
            definition:
              "Covers arable cropland, commercial horticultural land, freshly ploughed land, other cultivated areas such as temporary grasslands and fallow. It excludes domestic gardens and allotments which are covered by 'Built-up areas and gardens'.",
          },
          {
            code: 'lv3-005',
            name: 'Improved grassland',
            definition:
              'Highly modified / intensively managed grassland, dominated by a few fast-growing grasses on fertile, neutral soils. These grasslands tend to be managed as pasture, used for silage production, and for recreation and amenity purposes.',
          },
          {
            code: 'lv3-006',
            name: 'Neutral grassland',
            definition:
              'Covers semi-improved and unimproved grassland on soils with a neutral pH. It includes managed grassland like hay meadows and pastures, grasslands with various amounts of waterlogging.  These grasslands have a greater range and cover of herbs than improved grassland.',
          },
          {
            code: 'lv3-007',
            name: 'Calcareous grassland',
            definition:
              'Covers semi-improved and unimproved grassland on soils with a pH above 7. They are found on shallow soils rich in lime, typically underlain by chalk or limestone rocks.',
          },
          {
            code: 'lv3-008',
            name: 'Acid grassland',
            definition:
              'Covers semi-improved and unimproved grassland on soils with a pH below 5.5. It excludes saltmarsh and sand-dune communities.',
          },
          {
            code: 'lv3-009',
            name: 'Bracken',
            definition:
              'Areas covered by continuous bracken. It excludes scattered patches and areas of bracken that are less than 0.25ha which should be classified with their associated broad habitat type.',
          },
          {
            code: 'lv3-010',
            name: 'Dwarf shrub heath',
            definition:
              'Vegetation dominated by heath family species or dwarf gorse on well-drained, nutrient poor, acid soils.  It excludes dwarf shrub associated with peat (formation and substrate), alpine and coastal areas.',
          },
          {
            code: 'lv3-011',
            name: 'Fen, marsh and swamp',
            definition:
              'Vegetation types found on groundwater-fed, permanently, seasonally, or periodically waterlogged peat, peaty, or mineral soils. It excludes areas of waterlogged wooded terrain over 0.25ha and wet grassland which are covered by other broad habitats.',
          },
          {
            code: 'lv3-012',
            name: 'Bogs',
            definition:
              'Wetlands with vegetation that typically forms peat, receiving nutrients principally from precipitation rather than ground water. It includes blanket bog, raised bog, and intermediate bog habitats.',
          },
          {
            code: 'lv3-013',
            name: 'Standing open water and canals',
            definition:
              "Covers natural water bodies like lakes and man-made ones like reservoirs, ponds, and canals. It includes open water vegetation and vegetation at the water's edge. Also includes ditches having open water for most of the year and adjacent wetland habitats with connected water levels that are less than 0.25 hectares.",
          },
          {
            code: 'lv3-014',
            name: 'Rivers and streams',
            definition:
              "Large (rivers) and small (streams) running waters. It covers the area up to the average yearly flood level, including the open channel, vegetation at the water's edge, and exposed sediments and shingle banks.",
          },
          {
            code: 'lv3-015',
            name: 'Montane habitats',
            definition:
              'Covers vegetation types occurring in the montane zone (above the natural tree line).  This includes dwarf shrub heath, snow bed communities, sedge and rush heaths, and moss and lichen heaths.',
          },
          {
            code: 'lv3-016',
            name: 'Inland rock',
            definition:
              'Covers natural and man-made exposed rock surfaces that are greater than 0.25 ha and almost entirely lack vegetation. It covers inland cliffs, ledges, caves, screes, limestone pavements, quarries, waste tips.  Plant communities include those that colonise cracks and fissures, grasslands on soils containing heavy metals, and some tall herbs and fern vegetation.',
          },
          {
            code: 'lv3-017',
            name: 'Built up areas and gardens',
            definition:
              'Covers urban and rural settlements, farm buildings, caravan parks, industrial areas and other man-made structures like retail parks, urban parks, transport infrastructure and derelict land. It includes domestic gardens and allotments. Amenity grassland is included in the Improved Grassland category.',
          },
        ],
      },
      {
        code: 'lv2-002',
        name: 'Coastal and estuarine habitats',
        classifiers: [
          {
            code: 'lv3-018',
            name: 'Coastal dunes and sandy shores',
            definition:
              'Sand-covered shorelines of the oceans, their connected seas and associated coastal lagoons, fashioned by the action of wind or waves. They include gently sloping beaches and beach-ridges, formed by sands brought by waves, longshore drift and storm waves, as well as dunes, formed by aeolian deposits, though sometimes re-fashioned by waves.',
          },
          {
            code: 'lv3-019',
            name: 'Coastal shingle',
            definition:
              'Beaches of the oceans, of their connected seas and of their associated coastal lagoons, covered by pebbles, or sometimes boulders, usually formed by wave action.',
          },
          {
            code: 'lv3-020',
            name: 'Rock cliffs, ledges and shores including the supralittoral',
            definition:
              'Sea-cliffs, or parts of sea-cliffs, and rocky shores colonized by disjunct assemblages of salt-tolerant crevice plants (chasmophytes) or by more or less closed salt-tolerant grasslands with associated terrestrial invertebrate and vertebrate faunal communities.',
          },
          {
            code: 'lv3-021',
            name: 'Estuaries',
            definition:
              'An estuary is a semi-enclosed coastal body of water with one or more rivers or streams flowing into it, where saltwater is measurably diluted with freshwater from the land and the river is subject to tidal action. Estuaries are often associated with high rates of biological productivity.',
          },
        ],
      },
    ],
  },
];

export const level3MissingClassifiersApiResponse = [
    {
      themeCode: 'lvl1-001',
      themeName: 'Natural asset',
      sectionTitle: 'Natural asset',
      sectionIntroduction:
        'Natural Assets are the living and non-living elements of ecosystems including soils, freshwater, minerals, air and oceans. We often group assets by broad habitat types (e.g. woodland or pelagic) but can also group them by the components that make up ecosystems  (e.g. by species that span multiple habitats,  soils and sediments).',
      level: 3,
      classifiers: [
        {
          code: 'lv2-001',
          name: 'Terrestrial and freshwater habitats',
          classifiers: [
            {
              code: 'lv3-001',
              name: 'Broadleaved, mixed and yew woodland',
              definition:
                'Covers all broadleaved, yew, and mixed broadleaved and coniferous stands which have more than 20% cover of broadleaved and yew trees. It includes patches of scrub where the woody element creates a canopy of more than 30% and the scrub area is above 0.25ha, recently felled broadleaved woodland, and integral features of woodland such as glades (clearings) and rides (pathways).',
            },
            {
              code: 'lv3-002',
              name: 'Coniferous woodland',
              definition:
                'Covers all coniferous stands where native and non-native conifers exceed more than 80% of the total cover of trees present.  It includes recently felled coniferous woodland and integral features of woodland, such as glades (clearings) and rides (pathways). It excludes yew woodlands.',
            },
            {
              code: 'lv3-003',
              name: 'Boundary and linear features',
              definition:
                'Covers landscape features that are linear in appearance, such as hedgerows, lines of trees, stonewalls, and built components of the rural landscape such as railways, roads, and verges. It excludes canals, rivers, woodland rides or arable field margins managed for nature conservation which are covered in other broad habitats.',
            },
            {
              code: 'lv3-004',
              name: 'Arable and horticulture',
              definition:
                "Covers arable cropland, commercial horticultural land, freshly ploughed land, other cultivated areas such as temporary grasslands and fallow. It excludes domestic gardens and allotments which are covered by 'Built-up areas and gardens'.",
            },
            {
              code: 'lv3-005',
              name: 'Improved grassland',
              definition:
                'Highly modified / intensively managed grassland, dominated by a few fast-growing grasses on fertile, neutral soils. These grasslands tend to be managed as pasture, used for silage production, and for recreation and amenity purposes.',
            },
            {
              code: 'lv3-006',
              name: 'Neutral grassland',
              definition:
                'Covers semi-improved and unimproved grassland on soils with a neutral pH. It includes managed grassland like hay meadows and pastures, grasslands with various amounts of waterlogging.  These grasslands have a greater range and cover of herbs than improved grassland.',
            },
            {
              code: 'lv3-007',
              name: 'Calcareous grassland',
              definition:
                'Covers semi-improved and unimproved grassland on soils with a pH above 7. They are found on shallow soils rich in lime, typically underlain by chalk or limestone rocks.',
            },
            {
              code: 'lv3-008',
              name: 'Acid grassland',
              definition:
                'Covers semi-improved and unimproved grassland on soils with a pH below 5.5. It excludes saltmarsh and sand-dune communities.',
            },
            {
              code: 'lv3-009',
              name: 'Bracken',
              definition:
                'Areas covered by continuous bracken. It excludes scattered patches and areas of bracken that are less than 0.25ha which should be classified with their associated broad habitat type.',
            },
            {
              code: 'lv3-010',
              name: 'Dwarf shrub heath',
              definition:
                'Vegetation dominated by heath family species or dwarf gorse on well-drained, nutrient poor, acid soils.  It excludes dwarf shrub associated with peat (formation and substrate), alpine and coastal areas.',
            },
            {
              code: 'lv3-011',
              name: 'Fen, marsh and swamp',
              definition:
                'Vegetation types found on groundwater-fed, permanently, seasonally, or periodically waterlogged peat, peaty, or mineral soils. It excludes areas of waterlogged wooded terrain over 0.25ha and wet grassland which are covered by other broad habitats.',
            },
            {
              code: 'lv3-012',
              name: 'Bogs',
              definition:
                'Wetlands with vegetation that typically forms peat, receiving nutrients principally from precipitation rather than ground water. It includes blanket bog, raised bog, and intermediate bog habitats.',
            },
            {
              code: 'lv3-013',
              name: 'Standing open water and canals',
              definition:
                "Covers natural water bodies like lakes and man-made ones like reservoirs, ponds, and canals. It includes open water vegetation and vegetation at the water's edge. Also includes ditches having open water for most of the year and adjacent wetland habitats with connected water levels that are less than 0.25 hectares.",
            },
            {
              code: 'lv3-014',
              name: 'Rivers and streams',
              definition:
                "Large (rivers) and small (streams) running waters. It covers the area up to the average yearly flood level, including the open channel, vegetation at the water's edge, and exposed sediments and shingle banks.",
            },
            {
              code: 'lv3-015',
              name: 'Montane habitats',
              definition:
                'Covers vegetation types occurring in the montane zone (above the natural tree line).  This includes dwarf shrub heath, snow bed communities, sedge and rush heaths, and moss and lichen heaths.',
            },
            {
              code: 'lv3-016',
              name: 'Inland rock',
              definition:
                'Covers natural and man-made exposed rock surfaces that are greater than 0.25 ha and almost entirely lack vegetation. It covers inland cliffs, ledges, caves, screes, limestone pavements, quarries, waste tips.  Plant communities include those that colonise cracks and fissures, grasslands on soils containing heavy metals, and some tall herbs and fern vegetation.',
            },
            {
              code: 'lv3-017',
              name: 'Built up areas and gardens',
              definition:
                'Covers urban and rural settlements, farm buildings, caravan parks, industrial areas and other man-made structures like retail parks, urban parks, transport infrastructure and derelict land. It includes domestic gardens and allotments. Amenity grassland is included in the Improved Grassland category.',
            },
          ],
        },
        {
          code: 'lv2-002',
          name: 'Coastal and estuarine habitats',
        },
      ],
    },
  ];
export const level1ClassifierItems = [
  {
    sectionTitle: '',
    sectionIntroduction: '',
    classifiers: [
      {
        code: 'lvl1-001',
        name: 'Natural asset',
        definition:
          'Natural Assets are the living and non-living elements of ecosystems including soils, freshwater, minerals, air and oceans. We often group assets by broad habitat types (e.g. woodland or pelagic) but can also group them by the components that make up ecosystems  (e.g. by species that span multiple habitats,  soils and sediments).',
        text: 'Natural Assets are the living and non-living elements of ecosystems including soils, freshwater, minerals, air and oceans. We often group assets by broad habitat types (e.g. woodland or pelagic) but can also group them by the components that make up ecosystems  (e.g. by species that span multiple habitats,  soils and sediments).',
        value: 'Natural asset',
      },
      {
        code: 'lvl1-002',
        name: 'Ecosystem service or benefit',
        definition:
          'Ecosystem services are the functions and goods that flow from natural assets which deliver benefits to people e.g. climate regulation, food production, water, energy, cultural significance. They are grouped into four broad categories: provisioning, regulating, cultural and supporting services. As most measurable ecosystem services fall under the first three categories, these have been included in this search tool.\nNatural capital benefits are the positive impacts of ecosystem services on human welfare, they enrich our lives and underpin the economy and wellbeing. The extent to which individuals and society receive benefits is affected by their values and available resources.',
        text: 'Ecosystem services are the functions and goods that flow from natural assets which deliver benefits to people e.g. climate regulation, food production, water, energy, cultural significance. They are grouped into four broad categories: provisioning, regulating, cultural and supporting services. As most measurable ecosystem services fall under the first three categories, these have been included in this search tool.\nNatural capital benefits are the positive impacts of ecosystem services on human welfare, they enrich our lives and underpin the economy and wellbeing. The extent to which individuals and society receive benefits is affected by their values and available resources.',
        value: 'Ecosystem service or benefit',
      },
      {
        code: 'lvl1-003',
        name: 'Natural capital valuation',
        definition:
          'For the purposes of this search tool, natural capital valuation is defined as the method used to determine the value of an ecosystem service. This can be in non-monetary terms (e.g. heritage values or existence values) or in monetary terms (e.g. market price or willingness to pay).',
        text: 'For the purposes of this search tool, natural capital valuation is defined as the method used to determine the value of an ecosystem service. This can be in non-monetary terms (e.g. heritage values or existence values) or in monetary terms (e.g. market price or willingness to pay).',
        value: 'Natural capital valuation',
      },
      {
        code: 'lvl1-004',
        name: 'Pressure',
        definition:
          'Pressures affect the state of natural assets (their condition, extent, or location) thereby changing their ability to deliver ecosystem services. Pressures include climate change, chemical and other types of pollution, biological disturbances, hydrological changes, and land or seabed use change, and are influenced by drivers such as population growth and societal needs for food, energy, wellbeing etc. Where the pressure cannot be directly measured, the impact on natural assets can be measured instead, such as habitat destruction.  In contrast, Drivers are much broader and indirect in nature, generally creating pressures.',
        text: 'Pressures affect the state of natural assets (their condition, extent, or location) thereby changing their ability to deliver ecosystem services. Pressures include climate change, chemical and other types of pollution, biological disturbances, hydrological changes, and land or seabed use change, and are influenced by drivers such as population growth and societal needs for food, energy, wellbeing etc. Where the pressure cannot be directly measured, the impact on natural assets can be measured instead, such as habitat destruction.  In contrast, Drivers are much broader and indirect in nature, generally creating pressures.',
        value: 'Pressure',
      },
    ],
    selectAll: 'lvl1-001,lvl1-002,lvl1-003,lvl1-004',
  },
];

export const level2ClassifierItems = [
  {
    sectionTitle: 'Natural capital valuation',
    sectionIntroduction:
      'For the purposes of this search tool, natural capital valuation is defined as the method used to determine the value of an ecosystem service. This can be in non-monetary terms (e.g. heritage values or existence values) or in monetary terms (e.g. market price or willingness to pay).',
    classifiers: [
      {
        code: 'lv2-009',
        name: 'Monetary',
        definition:
          'The amount of value an item or a service has in relation to its acceptable cash price for a willing seller and buyer.',
        text: 'The amount of value an item or a service has in relation to its acceptable cash price for a willing seller and buyer.',
        value: 'Monetary',
      },
      {
        code: 'lv2-010',
        name: 'Non-monetary',
        definition:
          'The value attributable to an item or a service without relation to any acceptable cash price and for which a fixed or determinable amount of currency is absent (e.g. many ecosystem services, interpersonal good-will, health, etc.).',
        text: 'The value attributable to an item or a service without relation to any acceptable cash price and for which a fixed or determinable amount of currency is absent (e.g. many ecosystem services, interpersonal good-will, health, etc.).',
        value: 'Non-monetary',
      },
    ],
    selectAll: 'lv2-009,lv2-010',
  },
];

export const level3ClassifierItems = [
  {
    sectionTitle: 'Natural asset',
    sectionIntroduction:
      'Natural Assets are the living and non-living elements of ecosystems including soils, freshwater, minerals, air and oceans. We often group assets by broad habitat types (e.g. woodland or pelagic) but can also group them by the components that make up ecosystems  (e.g. by species that span multiple habitats,  soils and sediments).',
    classifiers: [],
    selectAll: '',
  },
  {
    code: 'lv2-001',
    name: 'Terrestrial and freshwater habitats',
    classifiers: [
      {
        code: 'lv3-001',
        name: 'Broadleaved, mixed and yew woodland',
        definition:
          'Covers all broadleaved, yew, and mixed broadleaved and coniferous stands which have more than 20% cover of broadleaved and yew trees. It includes patches of scrub where the woody element creates a canopy of more than 30% and the scrub area is above 0.25ha, recently felled broadleaved woodland, and integral features of woodland such as glades (clearings) and rides (pathways).',
        text: 'Covers all broadleaved, yew, and mixed broadleaved and coniferous stands which have more than 20% cover of broadleaved and yew trees. It includes patches of scrub where the woody element creates a canopy of more than 30% and the scrub area is above 0.25ha, recently felled broadleaved woodland, and integral features of woodland such as glades (clearings) and rides (pathways).',
        value: 'Broadleaved, mixed and yew woodland',
      },
      {
        code: 'lv3-002',
        name: 'Coniferous woodland',
        definition:
          'Covers all coniferous stands where native and non-native conifers exceed more than 80% of the total cover of trees present.  It includes recently felled coniferous woodland and integral features of woodland, such as glades (clearings) and rides (pathways). It excludes yew woodlands.',
        text: 'Covers all coniferous stands where native and non-native conifers exceed more than 80% of the total cover of trees present.  It includes recently felled coniferous woodland and integral features of woodland, such as glades (clearings) and rides (pathways). It excludes yew woodlands.',
        value: 'Coniferous woodland',
      },
      {
        code: 'lv3-003',
        name: 'Boundary and linear features',
        definition:
          'Covers landscape features that are linear in appearance, such as hedgerows, lines of trees, stonewalls, and built components of the rural landscape such as railways, roads, and verges. It excludes canals, rivers, woodland rides or arable field margins managed for nature conservation which are covered in other broad habitats.',
        text: 'Covers landscape features that are linear in appearance, such as hedgerows, lines of trees, stonewalls, and built components of the rural landscape such as railways, roads, and verges. It excludes canals, rivers, woodland rides or arable field margins managed for nature conservation which are covered in other broad habitats.',
        value: 'Boundary and linear features',
      },
      {
        code: 'lv3-004',
        name: 'Arable and horticulture',
        definition:
          "Covers arable cropland, commercial horticultural land, freshly ploughed land, other cultivated areas such as temporary grasslands and fallow. It excludes domestic gardens and allotments which are covered by 'Built-up areas and gardens'.",
        text: "Covers arable cropland, commercial horticultural land, freshly ploughed land, other cultivated areas such as temporary grasslands and fallow. It excludes domestic gardens and allotments which are covered by 'Built-up areas and gardens'.",
        value: 'Arable and horticulture',
      },
      {
        code: 'lv3-005',
        name: 'Improved grassland',
        definition:
          'Highly modified / intensively managed grassland, dominated by a few fast-growing grasses on fertile, neutral soils. These grasslands tend to be managed as pasture, used for silage production, and for recreation and amenity purposes.',
        text: 'Highly modified / intensively managed grassland, dominated by a few fast-growing grasses on fertile, neutral soils. These grasslands tend to be managed as pasture, used for silage production, and for recreation and amenity purposes.',
        value: 'Improved grassland',
      },
      {
        code: 'lv3-006',
        name: 'Neutral grassland',
        definition:
          'Covers semi-improved and unimproved grassland on soils with a neutral pH. It includes managed grassland like hay meadows and pastures, grasslands with various amounts of waterlogging.  These grasslands have a greater range and cover of herbs than improved grassland.',
        text: 'Covers semi-improved and unimproved grassland on soils with a neutral pH. It includes managed grassland like hay meadows and pastures, grasslands with various amounts of waterlogging.  These grasslands have a greater range and cover of herbs than improved grassland.',
        value: 'Neutral grassland',
      },
      {
        code: 'lv3-007',
        name: 'Calcareous grassland',
        definition:
          'Covers semi-improved and unimproved grassland on soils with a pH above 7. They are found on shallow soils rich in lime, typically underlain by chalk or limestone rocks.',
        text: 'Covers semi-improved and unimproved grassland on soils with a pH above 7. They are found on shallow soils rich in lime, typically underlain by chalk or limestone rocks.',
        value: 'Calcareous grassland',
      },
      {
        code: 'lv3-008',
        name: 'Acid grassland',
        definition:
          'Covers semi-improved and unimproved grassland on soils with a pH below 5.5. It excludes saltmarsh and sand-dune communities.',
        text: 'Covers semi-improved and unimproved grassland on soils with a pH below 5.5. It excludes saltmarsh and sand-dune communities.',
        value: 'Acid grassland',
      },
      {
        code: 'lv3-009',
        name: 'Bracken',
        definition:
          'Areas covered by continuous bracken. It excludes scattered patches and areas of bracken that are less than 0.25ha which should be classified with their associated broad habitat type.',
        text: 'Areas covered by continuous bracken. It excludes scattered patches and areas of bracken that are less than 0.25ha which should be classified with their associated broad habitat type.',
        value: 'Bracken',
      },
      {
        code: 'lv3-010',
        name: 'Dwarf shrub heath',
        definition:
          'Vegetation dominated by heath family species or dwarf gorse on well-drained, nutrient poor, acid soils.  It excludes dwarf shrub associated with peat (formation and substrate), alpine and coastal areas.',
        text: 'Vegetation dominated by heath family species or dwarf gorse on well-drained, nutrient poor, acid soils.  It excludes dwarf shrub associated with peat (formation and substrate), alpine and coastal areas.',
        value: 'Dwarf shrub heath',
      },
      {
        code: 'lv3-011',
        name: 'Fen, marsh and swamp',
        definition:
          'Vegetation types found on groundwater-fed, permanently, seasonally, or periodically waterlogged peat, peaty, or mineral soils. It excludes areas of waterlogged wooded terrain over 0.25ha and wet grassland which are covered by other broad habitats.',
        text: 'Vegetation types found on groundwater-fed, permanently, seasonally, or periodically waterlogged peat, peaty, or mineral soils. It excludes areas of waterlogged wooded terrain over 0.25ha and wet grassland which are covered by other broad habitats.',
        value: 'Fen, marsh and swamp',
      },
      {
        code: 'lv3-012',
        name: 'Bogs',
        definition:
          'Wetlands with vegetation that typically forms peat, receiving nutrients principally from precipitation rather than ground water. It includes blanket bog, raised bog, and intermediate bog habitats.',
        text: 'Wetlands with vegetation that typically forms peat, receiving nutrients principally from precipitation rather than ground water. It includes blanket bog, raised bog, and intermediate bog habitats.',
        value: 'Bogs',
      },
      {
        code: 'lv3-013',
        name: 'Standing open water and canals',
        definition:
          "Covers natural water bodies like lakes and man-made ones like reservoirs, ponds, and canals. It includes open water vegetation and vegetation at the water's edge. Also includes ditches having open water for most of the year and adjacent wetland habitats with connected water levels that are less than 0.25 hectares.",
        text: "Covers natural water bodies like lakes and man-made ones like reservoirs, ponds, and canals. It includes open water vegetation and vegetation at the water's edge. Also includes ditches having open water for most of the year and adjacent wetland habitats with connected water levels that are less than 0.25 hectares.",
        value: 'Standing open water and canals',
      },
      {
        code: 'lv3-014',
        name: 'Rivers and streams',
        definition:
          "Large (rivers) and small (streams) running waters. It covers the area up to the average yearly flood level, including the open channel, vegetation at the water's edge, and exposed sediments and shingle banks.",
        text: "Large (rivers) and small (streams) running waters. It covers the area up to the average yearly flood level, including the open channel, vegetation at the water's edge, and exposed sediments and shingle banks.",
        value: 'Rivers and streams',
      },
      {
        code: 'lv3-015',
        name: 'Montane habitats',
        definition:
          'Covers vegetation types occurring in the montane zone (above the natural tree line).  This includes dwarf shrub heath, snow bed communities, sedge and rush heaths, and moss and lichen heaths.',
        text: 'Covers vegetation types occurring in the montane zone (above the natural tree line).  This includes dwarf shrub heath, snow bed communities, sedge and rush heaths, and moss and lichen heaths.',
        value: 'Montane habitats',
      },
      {
        code: 'lv3-016',
        name: 'Inland rock',
        definition:
          'Covers natural and man-made exposed rock surfaces that are greater than 0.25 ha and almost entirely lack vegetation. It covers inland cliffs, ledges, caves, screes, limestone pavements, quarries, waste tips.  Plant communities include those that colonise cracks and fissures, grasslands on soils containing heavy metals, and some tall herbs and fern vegetation.',
        text: 'Covers natural and man-made exposed rock surfaces that are greater than 0.25 ha and almost entirely lack vegetation. It covers inland cliffs, ledges, caves, screes, limestone pavements, quarries, waste tips.  Plant communities include those that colonise cracks and fissures, grasslands on soils containing heavy metals, and some tall herbs and fern vegetation.',
        value: 'Inland rock',
      },
      {
        code: 'lv3-017',
        name: 'Built up areas and gardens',
        definition:
          'Covers urban and rural settlements, farm buildings, caravan parks, industrial areas and other man-made structures like retail parks, urban parks, transport infrastructure and derelict land. It includes domestic gardens and allotments. Amenity grassland is included in the Improved Grassland category.',
        text: 'Covers urban and rural settlements, farm buildings, caravan parks, industrial areas and other man-made structures like retail parks, urban parks, transport infrastructure and derelict land. It includes domestic gardens and allotments. Amenity grassland is included in the Improved Grassland category.',
        value: 'Built up areas and gardens',
      },
    ],
    sectionTitle: 'Terrestrial and freshwater habitats',
    sectionIntroduction: '',
    selectAll:
      'lv3-001,lv3-002,lv3-003,lv3-004,lv3-005,lv3-006,lv3-007,lv3-008,lv3-009,lv3-010,lv3-011,lv3-012,lv3-013,lv3-014,lv3-015,lv3-016,lv3-017',
    text: '',
    value: 'Terrestrial and freshwater habitats',
  },
  {
    code: 'lv2-002',
    name: 'Coastal and estuarine habitats',
    classifiers: [
      {
        code: 'lv3-018',
        name: 'Coastal dunes and sandy shores',
        definition:
          'Sand-covered shorelines of the oceans, their connected seas and associated coastal lagoons, fashioned by the action of wind or waves. They include gently sloping beaches and beach-ridges, formed by sands brought by waves, longshore drift and storm waves, as well as dunes, formed by aeolian deposits, though sometimes re-fashioned by waves.',
        text: 'Sand-covered shorelines of the oceans, their connected seas and associated coastal lagoons, fashioned by the action of wind or waves. They include gently sloping beaches and beach-ridges, formed by sands brought by waves, longshore drift and storm waves, as well as dunes, formed by aeolian deposits, though sometimes re-fashioned by waves.',
        value: 'Coastal dunes and sandy shores',
      },
      {
        code: 'lv3-019',
        name: 'Coastal shingle',
        definition:
          'Beaches of the oceans, of their connected seas and of their associated coastal lagoons, covered by pebbles, or sometimes boulders, usually formed by wave action.',
        text: 'Beaches of the oceans, of their connected seas and of their associated coastal lagoons, covered by pebbles, or sometimes boulders, usually formed by wave action.',
        value: 'Coastal shingle',
      },
      {
        code: 'lv3-020',
        name: 'Rock cliffs, ledges and shores including the supralittoral',
        definition:
          'Sea-cliffs, or parts of sea-cliffs, and rocky shores colonized by disjunct assemblages of salt-tolerant crevice plants (chasmophytes) or by more or less closed salt-tolerant grasslands with associated terrestrial invertebrate and vertebrate faunal communities.',
        text: 'Sea-cliffs, or parts of sea-cliffs, and rocky shores colonized by disjunct assemblages of salt-tolerant crevice plants (chasmophytes) or by more or less closed salt-tolerant grasslands with associated terrestrial invertebrate and vertebrate faunal communities.',
        value: 'Rock cliffs, ledges and shores including the supralittoral',
      },
      {
        code: 'lv3-021',
        name: 'Estuaries',
        definition:
          'An estuary is a semi-enclosed coastal body of water with one or more rivers or streams flowing into it, where saltwater is measurably diluted with freshwater from the land and the river is subject to tidal action. Estuaries are often associated with high rates of biological productivity.',
        text: 'An estuary is a semi-enclosed coastal body of water with one or more rivers or streams flowing into it, where saltwater is measurably diluted with freshwater from the land and the river is subject to tidal action. Estuaries are often associated with high rates of biological productivity.',
        value: 'Estuaries',
      },
    ],
    sectionTitle: 'Coastal and estuarine habitats',
    sectionIntroduction: '',
    selectAll: 'lv3-018,lv3-019,lv3-020,lv3-021',
    text: '',
    value: 'Coastal and estuarine habitats',
  },
];

export const level3MissingClassifierItems = [
    {
      "classifiers": [],
      "sectionIntroduction": "Natural Assets are the living and non-living elements of ecosystems including soils, freshwater, minerals, air and oceans. We often group assets by broad habitat types (e.g. woodland or pelagic) but can also group them by the components that make up ecosystems  (e.g. by species that span multiple habitats,  soils and sediments).",
      "sectionTitle": "Natural asset",
      "selectAll": "",
    },
    {
      "classifiers": [
        {
          "code": "lv3-001",
          "definition": "Covers all broadleaved, yew, and mixed broadleaved and coniferous stands which have more than 20% cover of broadleaved and yew trees. It includes patches of scrub where the woody element creates a canopy of more than 30% and the scrub area is above 0.25ha, recently felled broadleaved woodland, and integral features of woodland such as glades (clearings) and rides (pathways).",
          "name": "Broadleaved, mixed and yew woodland",
          "text": "Covers all broadleaved, yew, and mixed broadleaved and coniferous stands which have more than 20% cover of broadleaved and yew trees. It includes patches of scrub where the woody element creates a canopy of more than 30% and the scrub area is above 0.25ha, recently felled broadleaved woodland, and integral features of woodland such as glades (clearings) and rides (pathways).",
          "value": "Broadleaved, mixed and yew woodland",
        },
        {
          "code": "lv3-002",
          "definition": "Covers all coniferous stands where native and non-native conifers exceed more than 80% of the total cover of trees present.  It includes recently felled coniferous woodland and integral features of woodland, such as glades (clearings) and rides (pathways). It excludes yew woodlands.",
          "name": "Coniferous woodland",
          "text": "Covers all coniferous stands where native and non-native conifers exceed more than 80% of the total cover of trees present.  It includes recently felled coniferous woodland and integral features of woodland, such as glades (clearings) and rides (pathways). It excludes yew woodlands.",
          "value": "Coniferous woodland",
        },
        {
          "code": "lv3-003",
          "definition": "Covers landscape features that are linear in appearance, such as hedgerows, lines of trees, stonewalls, and built components of the rural landscape such as railways, roads, and verges. It excludes canals, rivers, woodland rides or arable field margins managed for nature conservation which are covered in other broad habitats.",
          "name": "Boundary and linear features",
          "text": "Covers landscape features that are linear in appearance, such as hedgerows, lines of trees, stonewalls, and built components of the rural landscape such as railways, roads, and verges. It excludes canals, rivers, woodland rides or arable field margins managed for nature conservation which are covered in other broad habitats.", 
          "value": "Boundary and linear features",
        },
        {
          "code": "lv3-004",
          "definition": "Covers arable cropland, commercial horticultural land, freshly ploughed land, other cultivated areas such as temporary grasslands and fallow. It excludes domestic gardens and allotments which are covered by 'Built-up areas and gardens'.",
          "name": "Arable and horticulture",
          "text": "Covers arable cropland, commercial horticultural land, freshly ploughed land, other cultivated areas such as temporary grasslands and fallow. It excludes domestic gardens and allotments which are covered by 'Built-up areas and gardens'.",   
          "value": "Arable and horticulture",
        },
        {
          "code": "lv3-005",
          "definition": "Highly modified / intensively managed grassland, dominated by a few fast-growing grasses on fertile, neutral soils. These grasslands tend to be managed as pasture, used for silage production, and for recreation and amenity purposes.", 
          "name": "Improved grassland",
          "text": "Highly modified / intensively managed grassland, dominated by a few fast-growing grasses on fertile, neutral soils. These grasslands tend to be managed as pasture, used for silage production, and for recreation and amenity purposes.",       
          "value": "Improved grassland",
        },
        {
          "code": "lv3-006",
          "definition": "Covers semi-improved and unimproved grassland on soils with a neutral pH. It includes managed grassland like hay meadows and pastures, grasslands with various amounts of waterlogging.  These grasslands have a greater range and cover of herbs than improved grassland.",
          "name": "Neutral grassland",
          "text": "Covers semi-improved and unimproved grassland on soils with a neutral pH. It includes managed grassland like hay meadows and pastures, grasslands with various amounts of waterlogging.  These grasslands have a greater range and cover of herbs than improved grassland.",
          "value": "Neutral grassland",
        },
        {
          "code": "lv3-007",
          "definition": "Covers semi-improved and unimproved grassland on soils with a pH above 7. They are found on shallow soils rich in lime, typically underlain by chalk or limestone rocks.",
          "name": "Calcareous grassland",
          "text": "Covers semi-improved and unimproved grassland on soils with a pH above 7. They are found on shallow soils rich in lime, typically underlain by chalk or limestone rocks.",
          "value": "Calcareous grassland",
        },
        {
          "code": "lv3-008",
          "definition": "Covers semi-improved and unimproved grassland on soils with a pH below 5.5. It excludes saltmarsh and sand-dune communities.",
          "name": "Acid grassland",
          "text": "Covers semi-improved and unimproved grassland on soils with a pH below 5.5. It excludes saltmarsh and sand-dune communities.",
          "value": "Acid grassland",
        },
        {
          "code": "lv3-009",
          "definition": "Areas covered by continuous bracken. It excludes scattered patches and areas of bracken that are less than 0.25ha which should be classified with their associated broad habitat type.",
          "name": "Bracken",
          "text": "Areas covered by continuous bracken. It excludes scattered patches and areas of bracken that are less than 0.25ha which should be classified with their associated broad habitat type.",
          "value": "Bracken",
        },
        {
          "code": "lv3-010",
          "definition": "Vegetation dominated by heath family species or dwarf gorse on well-drained, nutrient poor, acid soils.  It excludes dwarf shrub associated with peat (formation and substrate), alpine and coastal areas.",
          "name": "Dwarf shrub heath",
          "text": "Vegetation dominated by heath family species or dwarf gorse on well-drained, nutrient poor, acid soils.  It excludes dwarf shrub associated with peat (formation and substrate), alpine and coastal areas.",
          "value": "Dwarf shrub heath",
        },
        {
          "code": "lv3-011",
          "definition": "Vegetation types found on groundwater-fed, permanently, seasonally, or periodically waterlogged peat, peaty, or mineral soils. It excludes areas of waterlogged wooded terrain over 0.25ha and wet grassland which are covered by other broad habitats.",
          "name": "Fen, marsh and swamp",
          "text": "Vegetation types found on groundwater-fed, permanently, seasonally, or periodically waterlogged peat, peaty, or mineral soils. It excludes areas of waterlogged wooded terrain over 0.25ha and wet grassland which are covered by other broad habitats.",
          "value": "Fen, marsh and swamp",
        },
        {
          "code": "lv3-012",
          "definition": "Wetlands with vegetation that typically forms peat, receiving nutrients principally from precipitation rather than ground water. It includes blanket bog, raised bog, and intermediate bog habitats.",
          "name": "Bogs",
          "text": "Wetlands with vegetation that typically forms peat, receiving nutrients principally from precipitation rather than ground water. It includes blanket bog, raised bog, and intermediate bog habitats.",
          "value": "Bogs",
        },
        {
          "code": "lv3-013",
          "definition": "Covers natural water bodies like lakes and man-made ones like reservoirs, ponds, and canals. It includes open water vegetation and vegetation at the water's edge. Also includes ditches having open water for most of the year and adjacent wetland habitats with connected water levels that are less than 0.25 hectares.",      
          "name": "Standing open water and canals",
          "text": "Covers natural water bodies like lakes and man-made ones like reservoirs, ponds, and canals. It includes open water vegetation and vegetation at the water's edge. Also includes ditches having open water for most of the year and adjacent wetland habitats with connected water levels that are less than 0.25 hectares.",
          "value": "Standing open water and canals",
        },
        {
          "code": "lv3-014",
          "definition": "Large (rivers) and small (streams) running waters. It covers the area up to the average yearly flood level, including the open channel, vegetation at the water's edge, and exposed sediments and shingle banks.",
          "name": "Rivers and streams",
          "text": "Large (rivers) and small (streams) running waters. It covers the area up to the average yearly flood level, including the open channel, vegetation at the water's edge, and exposed sediments and shingle banks.",
          "value": "Rivers and streams",
        },
        {
          "code": "lv3-015",
          "definition": "Covers vegetation types occurring in the montane zone (above the natural tree line).  This includes dwarf shrub heath, snow bed communities, sedge and rush heaths, and moss and lichen heaths.",
          "name": "Montane habitats",
          "text": "Covers vegetation types occurring in the montane zone (above the natural tree line).  This includes dwarf shrub heath, snow bed communities, sedge and rush heaths, and moss and lichen heaths.",
          "value": "Montane habitats",
        },
        {
          "code": "lv3-016",
          "definition": "Covers natural and man-made exposed rock surfaces that are greater than 0.25 ha and almost entirely lack vegetation. It covers inland cliffs, ledges, caves, screes, limestone pavements, quarries, waste tips.  Plant communities include those that colonise cracks and fissures, grasslands on soils containing heavy metals, and some tall herbs and fern vegetation.",
          "name": "Inland rock",
          "text": "Covers natural and man-made exposed rock surfaces that are greater than 0.25 ha and almost entirely lack vegetation. It covers inland cliffs, ledges, caves, screes, limestone pavements, quarries, waste tips.  Plant communities include those that colonise cracks and fissures, grasslands on soils containing heavy metals, and some tall herbs and fern vegetation.",
          "value": "Inland rock",
        },
        {
          "code": "lv3-017",
          "definition": "Covers urban and rural settlements, farm buildings, caravan parks, industrial areas and other man-made structures like retail parks, urban parks, transport infrastructure and derelict land. It includes domestic gardens and allotments. Amenity grassland is included in the Improved Grassland category.",
          "name": "Built up areas and gardens",
          "text": "Covers urban and rural settlements, farm buildings, caravan parks, industrial areas and other man-made structures like retail parks, urban parks, transport infrastructure and derelict land. It includes domestic gardens and allotments. Amenity grassland is included in the Improved Grassland category.",
          "value": "Built up areas and gardens",
        },
      ],
      "code": "lv2-001",
      "name": "Terrestrial and freshwater habitats",
      "sectionIntroduction": "",
      "sectionTitle": "Terrestrial and freshwater habitats",
      "selectAll": "lv3-001,lv3-002,lv3-003,lv3-004,lv3-005,lv3-006,lv3-007,lv3-008,lv3-009,lv3-010,lv3-011,lv3-012,lv3-013,lv3-014,lv3-015,lv3-016,lv3-017",
      "text": "",
      "value": "Terrestrial and freshwater habitats",
    },
    {
      "classifiers": [],
      "code": "lv2-002",
      "name": "Coastal and estuarine habitats",
      "sectionIntroduction": "",
      "sectionTitle": "Coastal and estuarine habitats",
      "selectAll": "",
      "text": "",
      "value": "Coastal and estuarine habitats",
    },
  ]