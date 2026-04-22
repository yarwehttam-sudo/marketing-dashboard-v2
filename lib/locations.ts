export interface City {
  name: string;
  slug: string;
}

export interface State {
  abbr: string;
  name: string;
  slug: string;
  isVppEligible: boolean;
  avgKwhRate: number;
  peakSunHours: number;
  cities: City[];
}

function city(name: string): City {
  return { name, slug: name.toLowerCase().replace(/\s+/g, '-') };
}

export const STATES: State[] = [
  {
    abbr: 'AR',
    name: 'Arkansas',
    slug: 'arkansas',
    isVppEligible: false,
    avgKwhRate: 0.099,
    peakSunHours: 4.7,
    cities: [city('Little Rock'), city('Fort Smith'), city('Fayetteville'), city('Springdale')],
  },
  {
    abbr: 'CA',
    name: 'California',
    slug: 'california',
    isVppEligible: false,
    avgKwhRate: 0.236,
    peakSunHours: 5.8,
    cities: [city('Los Angeles'), city('San Diego'), city('San Jose'), city('San Francisco'), city('Sacramento')],
  },
  {
    abbr: 'CO',
    name: 'Colorado',
    slug: 'colorado',
    isVppEligible: false,
    avgKwhRate: 0.125,
    peakSunHours: 5.5,
    cities: [city('Denver'), city('Colorado Springs'), city('Aurora'), city('Fort Collins'), city('Boulder')],
  },
  {
    abbr: 'CT',
    name: 'Connecticut',
    slug: 'connecticut',
    isVppEligible: false,
    avgKwhRate: 0.238,
    peakSunHours: 4.2,
    cities: [city('Bridgeport'), city('New Haven'), city('Hartford'), city('Stamford')],
  },
  {
    abbr: 'DE',
    name: 'Delaware',
    slug: 'delaware',
    isVppEligible: false,
    avgKwhRate: 0.133,
    peakSunHours: 4.3,
    cities: [city('Wilmington'), city('Dover'), city('Newark'), city('Middletown')],
  },
  {
    abbr: 'GA',
    name: 'Georgia',
    slug: 'georgia',
    isVppEligible: false,
    avgKwhRate: 0.117,
    peakSunHours: 5.0,
    cities: [city('Atlanta'), city('Augusta'), city('Columbus'), city('Savannah'), city('Macon')],
  },
  {
    abbr: 'HI',
    name: 'Hawaii',
    slug: 'hawaii',
    isVppEligible: false,
    avgKwhRate: 0.328,
    peakSunHours: 6.0,
    cities: [city('Honolulu'), city('Pearl City'), city('Hilo'), city('Kailua'), city('Waipahu')],
  },
  {
    abbr: 'IL',
    name: 'Illinois',
    slug: 'illinois',
    isVppEligible: false,
    avgKwhRate: 0.128,
    peakSunHours: 4.0,
    cities: [city('Chicago'), city('Aurora'), city('Rockford'), city('Joliet'), city('Naperville')],
  },
  {
    abbr: 'IA',
    name: 'Iowa',
    slug: 'iowa',
    isVppEligible: false,
    avgKwhRate: 0.109,
    peakSunHours: 4.4,
    cities: [city('Des Moines'), city('Cedar Rapids'), city('Davenport'), city('Sioux City')],
  },
  {
    abbr: 'ME',
    name: 'Maine',
    slug: 'maine',
    isVppEligible: false,
    avgKwhRate: 0.186,
    peakSunHours: 4.0,
    cities: [city('Portland'), city('Lewiston'), city('Bangor'), city('South Portland')],
  },
  {
    abbr: 'MD',
    name: 'Maryland',
    slug: 'maryland',
    isVppEligible: false,
    avgKwhRate: 0.143,
    peakSunHours: 4.4,
    cities: [city('Baltimore'), city('Frederick'), city('Rockville'), city('Gaithersburg'), city('Annapolis')],
  },
  {
    abbr: 'MA',
    name: 'Massachusetts',
    slug: 'massachusetts',
    isVppEligible: false,
    avgKwhRate: 0.236,
    peakSunHours: 4.2,
    cities: [city('Boston'), city('Worcester'), city('Springfield'), city('Cambridge'), city('Lowell')],
  },
  {
    abbr: 'MI',
    name: 'Michigan',
    slug: 'michigan',
    isVppEligible: false,
    avgKwhRate: 0.168,
    peakSunHours: 3.8,
    cities: [city('Detroit'), city('Grand Rapids'), city('Warren'), city('Ann Arbor'), city('Lansing')],
  },
  {
    abbr: 'MT',
    name: 'Montana',
    slug: 'montana',
    isVppEligible: false,
    avgKwhRate: 0.108,
    peakSunHours: 4.8,
    cities: [city('Billings'), city('Missoula'), city('Great Falls'), city('Bozeman')],
  },
  {
    abbr: 'NE',
    name: 'Nebraska',
    slug: 'nebraska',
    isVppEligible: false,
    avgKwhRate: 0.099,
    peakSunHours: 4.8,
    cities: [city('Omaha'), city('Lincoln'), city('Bellevue'), city('Grand Island')],
  },
  {
    abbr: 'NV',
    name: 'Nevada',
    slug: 'nevada',
    isVppEligible: false,
    avgKwhRate: 0.118,
    peakSunHours: 6.4,
    cities: [city('Las Vegas'), city('Henderson'), city('Reno'), city('North Las Vegas'), city('Sparks')],
  },
  {
    abbr: 'NH',
    name: 'New Hampshire',
    slug: 'new-hampshire',
    isVppEligible: false,
    avgKwhRate: 0.214,
    peakSunHours: 4.1,
    cities: [city('Manchester'), city('Nashua'), city('Concord'), city('Dover')],
  },
  {
    abbr: 'NJ',
    name: 'New Jersey',
    slug: 'new-jersey',
    isVppEligible: false,
    avgKwhRate: 0.168,
    peakSunHours: 4.3,
    cities: [city('Newark'), city('Jersey City'), city('Paterson'), city('Elizabeth'), city('Trenton')],
  },
  {
    abbr: 'NM',
    name: 'New Mexico',
    slug: 'new-mexico',
    isVppEligible: false,
    avgKwhRate: 0.124,
    peakSunHours: 6.8,
    cities: [city('Albuquerque'), city('Las Cruces'), city('Rio Rancho'), city('Santa Fe')],
  },
  {
    abbr: 'NY',
    name: 'New York',
    slug: 'new-york',
    isVppEligible: false,
    avgKwhRate: 0.196,
    peakSunHours: 4.0,
    cities: [city('New York City'), city('Buffalo'), city('Rochester'), city('Yonkers'), city('Syracuse')],
  },
  {
    abbr: 'OH',
    name: 'Ohio',
    slug: 'ohio',
    isVppEligible: false,
    avgKwhRate: 0.124,
    peakSunHours: 4.0,
    cities: [city('Columbus'), city('Cleveland'), city('Cincinnati'), city('Toledo'), city('Akron')],
  },
  {
    abbr: 'OR',
    name: 'Oregon',
    slug: 'oregon',
    isVppEligible: false,
    avgKwhRate: 0.116,
    peakSunHours: 4.5,
    cities: [city('Portland'), city('Salem'), city('Eugene'), city('Gresham'), city('Hillsboro')],
  },
  {
    abbr: 'PA',
    name: 'Pennsylvania',
    slug: 'pennsylvania',
    isVppEligible: false,
    avgKwhRate: 0.143,
    peakSunHours: 4.1,
    cities: [city('Philadelphia'), city('Pittsburgh'), city('Allentown'), city('Erie'), city('Reading')],
  },
  {
    abbr: 'RI',
    name: 'Rhode Island',
    slug: 'rhode-island',
    isVppEligible: false,
    avgKwhRate: 0.228,
    peakSunHours: 4.2,
    cities: [city('Providence'), city('Cranston'), city('Warwick'), city('Pawtucket')],
  },
  {
    abbr: 'TX',
    name: 'Texas',
    slug: 'texas',
    isVppEligible: true,
    avgKwhRate: 0.124,
    peakSunHours: 5.7,
    cities: [
      city('Houston'),
      city('San Antonio'),
      city('Dallas'),
      city('Austin'),
      city('Fort Worth'),
    ],
  },
  {
    abbr: 'UT',
    name: 'Utah',
    slug: 'utah',
    isVppEligible: false,
    avgKwhRate: 0.103,
    peakSunHours: 5.6,
    cities: [city('Salt Lake City'), city('West Valley City'), city('Provo'), city('West Jordan'), city('Orem')],
  },
  {
    abbr: 'VT',
    name: 'Vermont',
    slug: 'vermont',
    isVppEligible: false,
    avgKwhRate: 0.198,
    peakSunHours: 4.0,
    cities: [city('Burlington'), city('South Burlington'), city('Rutland'), city('Barre')],
  },
  {
    abbr: 'VA',
    name: 'Virginia',
    slug: 'virginia',
    isVppEligible: false,
    avgKwhRate: 0.123,
    peakSunHours: 4.5,
    cities: [city('Virginia Beach'), city('Norfolk'), city('Chesapeake'), city('Richmond'), city('Newport News')],
  },
  {
    abbr: 'WA',
    name: 'Washington',
    slug: 'washington',
    isVppEligible: false,
    avgKwhRate: 0.099,
    peakSunHours: 4.0,
    cities: [city('Seattle'), city('Spokane'), city('Tacoma'), city('Vancouver'), city('Bellevue')],
  },
  {
    abbr: 'WV',
    name: 'West Virginia',
    slug: 'west-virginia',
    isVppEligible: false,
    avgKwhRate: 0.107,
    peakSunHours: 4.0,
    cities: [city('Charleston'), city('Huntington'), city('Morgantown'), city('Parkersburg')],
  },
];

// ---------------------------------------------------------------------------
// Helper: up to 3 other cities in the same state, excluding the current city
// ---------------------------------------------------------------------------

export function getNearbyStateCities(
  stateSlug: string,
  currentCitySlug: string
): City[] {
  const state = STATES.find((s) => s.slug === stateSlug);
  if (!state) return [];
  const cities = state.cities;
  const idx = cities.findIndex((c) => c.slug === currentCitySlug);
  if (idx === -1) return cities.slice(0, 3);
  // Return the 3 cities that follow the current city, wrapping around.
  // Example for [A,B,C,D,E]: A→[B,C,D], B→[C,D,E], C→[D,E,A], D→[E,A,B], E→[A,B,C]
  // This guarantees every city receives exactly 3 inbound sibling links.
  const result: City[] = [];
  for (let i = 1; i <= 3; i++) {
    const neighbor = cities[(idx + i) % cities.length];
    result.push(neighbor);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Helper: up to 3 geographically adjacent SR Energy service states
// ---------------------------------------------------------------------------

// Adjacency pairs based on shared land borders.
// Only SR Energy service states appear as values.
const ADJACENCY: Record<string, string[]> = {
  AR: ['TX', 'TN', 'MS', 'LA', 'MO', 'OK'],
  CA: ['OR', 'NV'],
  CO: ['NM', 'UT', 'NE'],
  CT: ['NY', 'RI', 'MA'],
  DE: ['MD', 'PA', 'NJ'],
  GA: ['AL', 'TN', 'NC', 'SC'],
  HI: [],
  IL: ['WI', 'IN', 'KY', 'MO', 'IA'],
  IA: ['WI', 'IL', 'MO', 'NE'],
  ME: ['NH', 'VT'],
  MD: ['VA', 'WV', 'PA', 'DE'],
  MA: ['RI', 'CT', 'NY', 'NH', 'VT'],
  MI: ['OH', 'IN', 'WI'],
  MT: ['WY', 'ND', 'ID'],
  NE: ['IA', 'MO', 'CO', 'WY'],
  NV: ['CA', 'OR', 'UT'],
  NH: ['ME', 'VT', 'MA'],
  NJ: ['NY', 'PA', 'DE'],
  NM: ['CO', 'UT', 'TX'],
  NY: ['PA', 'NJ', 'CT', 'MA', 'VT'],
  OH: ['PA', 'WV', 'IN', 'MI'],
  OR: ['WA', 'CA', 'NV'],
  PA: ['NY', 'NJ', 'DE', 'MD', 'WV', 'OH'],
  RI: ['CT', 'MA'],
  TX: ['NM', 'AR', 'LA'],
  UT: ['CO', 'NM', 'NV'],
  VT: ['NY', 'NH', 'MA', 'ME'],
  VA: ['MD', 'WV', 'TN', 'NC'],
  WA: ['OR', 'ID'],
  WV: ['OH', 'PA', 'MD', 'VA'],
};

const SERVICE_ABBRS = new Set(STATES.map((s) => s.abbr));

export function getNearbyStates(stateAbbr: string): State[] {
  const neighbors = (ADJACENCY[stateAbbr] ?? []).filter(
    (abbr) => SERVICE_ABBRS.has(abbr) && abbr !== stateAbbr
  );
  // Prefer states with more cities (richer cross-linking targets)
  return neighbors
    .map((abbr) => STATES.find((s) => s.abbr === abbr)!)
    .sort((a, b) => b.cities.length - a.cities.length)
    .slice(0, 3);
}
