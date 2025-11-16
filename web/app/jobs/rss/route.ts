import { listJobs } from '@/lib/jobsStore';
import paths from '@/paths';

export const runtime = 'nodejs';

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const jobsListingUrl = `${siteUrl}${paths.JobsPage()}`;
  const jobs = await listJobs();
  const items = [...jobs].sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  const rssItems = items
    .map((j) => {
      const link = j.url.startsWith('http') ? j.url : jobsListingUrl;
      const description = j.description ? escapeXml(j.description) : `${escapeXml(j.title)} at ${escapeXml(j.company)} — ${escapeXml(j.location)}`;
      return `\n    <item>\n      <title>${escapeXml(j.title)} — ${escapeXml(j.company)}</title>\n      <link>${escapeXml(link)}</link>\n      <guid>${escapeXml(j.id)}</guid>\n      <pubDate>${new Date(j.postedAt).toUTCString()}</pubDate>\n      <description>${description}</description>\n    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Sitecore XM Cloud Jobs</title>
    <link>${escapeXml(jobsListingUrl)}</link>
    <description>Latest Sitecore XM Cloud job listings</description>${rssItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
