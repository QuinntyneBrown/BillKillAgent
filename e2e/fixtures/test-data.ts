export const TEST_USER = {
  email: 'test@billkill.app',
  password: 'TestPassword123!',
  name: 'Alex Johnson',
};

export const SUBSCRIPTIONS = [
  {
    name: 'Netflix Premium',
    category: 'Streaming',
    cost: '$22.99/mo',
    valueScore: 82,
    usage: 'high',
    action: 'Keep',
  },
  {
    name: 'Adobe Creative Cloud',
    category: 'Software',
    cost: '$54.99/mo',
    valueScore: 3,
    usage: 'none',
    action: 'Cancel',
  },
  {
    name: 'Comcast Internet',
    category: 'Utilities',
    cost: '$89.99/mo',
    valueScore: 92,
    usage: 'high',
    action: 'Negotiate',
  },
  {
    name: 'Planet Fitness',
    category: 'Health & Fitness',
    cost: '$24.99/mo',
    valueScore: 8,
    usage: 'low',
    action: 'Cancel',
  },
  {
    name: 'Spotify Premium',
    category: 'Streaming',
    cost: '$10.99/mo',
    valueScore: 95,
    usage: 'high',
    action: 'Keep',
  },
];

export const DASHBOARD_METRICS = {
  monthlyRecurring: '$2,847',
  savingsFound: '$347',
  savingsAchieved: '$1,204',
};

export const PENDING_ACTIONS = [
  { name: 'Cancel Hulu', savings: '$17.99/mo', type: 'cancel' },
  { name: 'Negotiate Comcast', savings: '~$35/mo', type: 'negotiate' },
  { name: 'Switch T-Mobile plan', savings: '$15/mo', type: 'switch' },
];

export const NEGOTIATIONS = [
  {
    provider: 'Verizon Wireless',
    date: 'Mar 28, 2026',
    originalRate: '$85/mo',
    newRate: '$60/mo',
    savings: '$25/mo',
    outcome: 'success',
  },
  {
    provider: 'State Farm Insurance',
    date: 'Mar 15, 2026',
    originalRate: '$180/mo',
    newRate: '$142/mo',
    savings: '$38/mo',
    outcome: 'success',
  },
  {
    provider: 'AT&T Internet',
    date: 'Mar 10, 2026',
    originalRate: '$75/mo',
    newRate: '$75/mo',
    savings: '$0/mo',
    outcome: 'failed',
  },
];

export const SAVINGS_DATA = {
  lifetime: '$4,128',
  monthly: '$347/mo',
  annual: '$4,164/yr',
  categories: [
    { name: 'Subscriptions', amount: '$1,840' },
    { name: 'Negotiations', amount: '$1,488' },
    { name: 'Plan Switches', amount: '$800' },
  ],
};

export const SETTINGS = {
  accounts: [
    { name: 'Chase Sapphire', mask: '····4821', status: 'Connected' },
    { name: 'Bank of America', mask: '····7392', status: 'Connected' },
  ],
  autonomyLevels: ['Supervised', 'Semi-Autonomous', 'Fully Autonomous'],
  savingsDestination: 'Fidelity Roth IRA ····9184',
};
