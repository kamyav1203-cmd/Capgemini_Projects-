import { render, screen, waitFor } from '@testing-library/react';
 import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      metrics: {
        totalShipments: 3,
        delivered: 1,
        inTransit: 1,
        delayed: 1,
        onTimeRate: 67,
      },
      shipments: [
        {
          id: 'SHP-1001',
          customer: 'ACME Manufacturing',
          origin: 'Denver Distribution Center',
          destination: 'Phoenix Retail Hub',
          status: 'In Transit',
          progress: 84,
          eta: '2026-05-28',
          note: 'Route planning complete',
          carrier: 'Transcontinental Logistics',
          mode: 'Line haul',
          currentLocation: 'Flagstaff Cross-Dock',
          temperatureC: 7,
          priority: 'Medium',
          lastScan: '2026-05-27 07:10',
          timeline: [
            { timestamp: '2026-05-26 08:20', message: 'Picked up from origin warehouse' },
          ],
        },
      ],
      alerts: [
        { title: 'Network delay', description: 'One shipment is delayed by weather conditions.', priority: 'High' },
      ],
    }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the logistics dashboard', async () => {
  render(<App />);

  expect(screen.getByText(/logistics & supply chain tracking system/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByText('SHP-1001').length).toBeGreaterThan(0);
  });

  expect(screen.getByText('67%')).toBeInTheDocument();
  expect(screen.getByText('Transcontinental Logistics')).toBeInTheDocument();
  expect(screen.getByText(/operations watchlist/i)).toBeInTheDocument();
});
