// Public, dated measurements used by project previews, case studies and CVs.
// Definitions matter: these are workflow events, not distinct physical items or uptime.
export const evidence = {
  storagepal: {
    pages: '12',
    responseBefore: '9.1 s',
    responseAfter: '0.884 s',
    // Orders: a count from the production database (created, not cancelled), October 2025 to September 2026
    // vs October 2023 to September 2024, the year before Khalil joined. Never revenue, which stays off the site.
    // Recent orders can still be cancelled: re-check these before changing the review date.
    ordersUp: '98%',
    ordersUpNonLuggage: '30%',
    preview: 'Twelve admin pages, one shared list system.',
    period: 'Orders: Oct 2025 - Sep 2026 compared with Oct 2023 - Sep 2024. This counts bookings, not money, and leaves out cancelled ones. Catalog: median of 15 test runs per version, September 2026.',
    metrics: [
      { value: '98%', label: 'more orders than the year before I joined (Oct 2025 - Sep 2026)' },
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
    period: 'Production use, April 13 - September 25, 2026. Counts reviewed September 26.',
    metrics: [
      { value: '120 / 120', label: 'weekdays with a completed scan session' },
      { value: '1,348', label: 'completed scanning sessions' },
      { value: '3,602', label: 'recorded moves between storage bays' },
    ],
  },
  ravenclip: {
    daysToCustomer: '105',
    customers: '3',
    preview: 'First external paying customer 105 days after the first commit.',
    period: 'First commit: May 24, 2026. First external payment: September 6. Customer count: September 26.',
    metrics: [
      { value: '105 days', label: 'from first commit to first external paying customer' },
      { value: '3', label: 'paying customers as of September 26, 2026' },
      { value: '2', label: 'live publishing platforms: YouTube and TikTok' },
    ],
  },
} as const;
export type ProjectId = keyof typeof evidence;
