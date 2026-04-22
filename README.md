# Client Dashboard

A marketing performance dashboard that pulls weekly metrics from Airtable and displays them as interactive charts and KPI cards. Account managers can filter by date range and share pre-filtered URLs with clients.

## What It Does

- Connects to an Airtable base to fetch weekly spend, impressions, and conversion data
- Displays KPI cards with trend indicators (vs. the prior equal-length period)
- Renders an interactive line chart with toggleable series
- Supports date filtering with quick-select presets (Last 30 Days, Last 90 Days, This Year)
- Syncs the active date filter to the URL so filtered views can be bookmarked or shared
- Exports the filtered data as a CSV file

## Tech Stack

- [Next.js 14](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org) — charting
- [PapaParse](https://www.papaparse.com) — CSV export
- [Airtable REST API](https://airtable.com/developers/web/api/introduction) — data source

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example below into a file called `.env.local` at the root of the project:

```
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
```

- **AIRTABLE_API_KEY** — your personal Airtable API key (found under your Airtable account settings)
- **AIRTABLE_BASE_ID** — the ID of the Airtable base containing the `WeeklyMetrics` table (visible in the base URL, starts with `app`)

The app will not work until both values are filled in. These credentials are never sent to the browser.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Airtable Table Structure

The dashboard expects a table named `WeeklyMetrics` with the following fields:

| Field name    | Type   | Description                        |
|---------------|--------|------------------------------------|
| `week_start`  | Date   | The Monday that starts the week    |
| `spend`       | Number | Total ad spend for the week        |
| `impressions` | Number | Total impressions for the week     |
| `conversions` | Number | Total conversions for the week     |

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions to deploy on Vercel, including how to add your Airtable credentials as environment variables.
