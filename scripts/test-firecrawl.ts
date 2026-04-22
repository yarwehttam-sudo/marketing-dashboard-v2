import 'dotenv/config';
import { firecrawl } from '../lib/firecrawl';

async function main() {
  const url = 'https://srenergy.us';
  console.log(`Scraping ${url}...`);

  const { markdown, creditsUsed } = await firecrawl.scrape(url, 'test');

  console.log(`\nMarkdown length: ${markdown.length} chars`);
  console.log(`Credits used this call: ${creditsUsed}`);
  console.log(`\nFirst 300 chars of markdown:\n${markdown.slice(0, 300)}`);
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
