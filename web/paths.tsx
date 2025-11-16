// This is a Paths helper functions to maintain the routes
// if there is a change in the route then we can simply update here 
// and don't have to search all the files to update them manually.

const paths ={
    HomePage(){
        return '/';
    },
    AboutPage(){
        return '/about';
    },
    ServicesPage(){
        return '/services';
    },
    EmailMarketingPage(){
        return '/email-marketing';
    },
    LocationsPage(){
        return '/locations';
    },
    ContactPage(){
        return '/contact';
    },
    NewsPage(){
        return '/news';
    },
    EventsPage(){
        return '/events';
    },
    DoctorsPage(){
        return '/doctors';
    },
    DoctorProfilePage(id: string){
        return `/doctors/${id}`;
    },
    BlogsPage(){
        return '/blogs';
    },
    BlogPostPage(slug: string){
        return `/blogs/${slug}`;
    },
    JobsPage(){
        return '/jobs';
    },
    JobDetailsPage(id: string){
        return `/jobs/${id}`;
    },
    JobsFeed(){
        return '/jobs/feed.json';
    },
    JobsRss(){
        return '/jobs/rss';
    },
    GraphqlEndpoint(){
        return '/graphql';
    },
    ApiHelloRoute(){
        return '/api/hello';
    },
    ApiGraphqlEndpoint(){
        return '/api/graphql';
    },
    ApiJobs(){
        return '/api/jobs';
    },
    ApiJob(id: string){
        return `/api/jobs/${id}`;
    },
    ApiBlogs(){
        return '/api/blogs';
    },
    ApiBlog(id: string){
        return `/api/blogs/${id}`;
    },
    ApiBlogReviews(id: string){
        return `/api/blogs/${id}/reviews`;
    },
    ApiBlogReviewSummary(id: string){
        return `/api/blogs/${id}/reviews/summary`;
    },
    ApiBlogReview(id: string, reviewId: string){
        return `/api/blogs/${id}/reviews/${reviewId}`;
    }
};

export default paths;
