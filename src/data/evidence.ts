// Public, dated measurements used by project previews, case studies and CVs.
// Definitions matter: these are workflow events, not distinct physical items or uptime.
export const evidence = {
  storagepal: {
    pages: '12',
    responseBefore: '9.1 s',
    responseAfter: '0.884 s',
    transport: '+34%',
    preview: 'Twelve admin pages, one shared list system.',
    period: 'Transport: 12 months after launch vs the 12 months before. Catalog: median of 15 runs per version on a local benchmark. Reviewed September 2026.',
    // Strongest first: business result, then speed, then a simpler checkout.
    metrics: [
      { value: '+34%', label: 'transport revenue in the year after launch vs the year before' },
      { value: '0.884 s', label: 'median catalog server response, down from 9.1 s' },
      { value: '3 → 1', label: 'pages in the payment flow' },
    ],
  },
  sps: {
    weekdays: '120 / 120',
    sessions: '1,348',
    verifications: '7,470',
    bayChanges: '8,847',
    bayMoves: '3,602',
    preview: 'Completed scan sessions on every weekday in the measured period.',
    period: 'Production use, 13 April - 25 September 2026. Counts reviewed 26 September.',
    metrics: [
      { value: '120 / 120', label: 'weekdays with a completed scan session' },
      { value: '1,348', label: 'completed scanning sessions' },
      { value: '3,602', label: 'recorded moves from one storage spot to another' },
    ],
  },
  ravenclip: {
    daysToCustomer: '105',
    customers: '3',
    preview: 'First external paying customer 105 days after the first commit.',
    period: 'First commit: 24 May 2026. First external payment: 6 September. Customer count: 26 September.',
    metrics: [
      { value: '105 days', label: 'from first commit to first external paying customer' },
      { value: '3', label: 'paying customers as of 26 September 2026' },
      { value: '2', label: 'live publishing platforms: YouTube and TikTok' },
    ],
  },
} as const;
export type ProjectId = keyof typeof evidence;
