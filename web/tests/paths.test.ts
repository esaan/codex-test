import paths from '@/paths';

describe('paths helper', () => {
  it('returns all static routes', () => {
    expect(paths.HomePage()).toBe('/');
    expect(paths.AboutPage()).toBe('/about');
    expect(paths.ServicesPage()).toBe('/services');
    expect(paths.EmailMarketingPage()).toBe('/email-marketing');
    expect(paths.LocationsPage()).toBe('/locations');
    expect(paths.ContactPage()).toBe('/contact');
    expect(paths.NewsPage()).toBe('/news');
    expect(paths.EventsPage()).toBe('/events');
    expect(paths.DoctorsPage()).toBe('/doctors');
    expect(paths.BlogsPage()).toBe('/blogs');
    expect(paths.JobsPage()).toBe('/jobs');
  });

  it('builds dynamic doctor, blog, and job routes', () => {
    expect(paths.DoctorProfilePage('abc')).toBe('/doctors/abc');
    expect(paths.BlogPostPage('hello-world')).toBe('/blogs/hello-world');
    expect(paths.JobDetailsPage('123')).toBe('/jobs/123');
    expect(paths.ApiJob('123')).toBe('/api/jobs/123');
    expect(paths.ApiBlog('xyz')).toBe('/api/blogs/xyz');
    expect(paths.ApiBlogReview('xyz', 'rev-1')).toBe('/api/blogs/xyz/reviews/rev-1');
  });

  it('returns feed, RSS, and API helper routes', () => {
    expect(paths.JobsFeed()).toBe('/jobs/feed.json');
    expect(paths.JobsRss()).toBe('/jobs/rss');
    expect(paths.ApiHelloRoute()).toBe('/api/hello');
    expect(paths.ApiGraphqlEndpoint()).toBe('/api/graphql');
    expect(paths.GraphqlEndpoint()).toBe('/graphql');
  });
});
