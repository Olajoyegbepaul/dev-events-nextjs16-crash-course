export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: 'Next.js Conf 2026',
    image: '/images/event1.png',
    slug: 'nextjs-conf-2026',
    location: 'San Francisco, CA',
    date: 'September 14–15, 2026',
    time: '10:00 AM PDT',
  },
  {
    title: 'GraphQL Connect',
    image: '/images/event2.png',
    slug: 'graphql-connect-2026',
    location: 'New York, NY',
    date: 'October 5, 2026',
    time: '9:30 AM EDT',
  },
  {
    title: 'AI Dev Live',
    image: '/images/event3.png',
    slug: 'ai-dev-live-2026',
    location: 'Seattle, WA',
    date: 'November 2, 2026',
    time: '1:00 PM PST',
  },
  {
    title: 'Reactathon Hackathon',
    image: '/images/event4.png',
    slug: 'reactathon-hackathon-2026',
    location: 'Austin, TX',
    date: 'August 21–23, 2026',
    time: 'All day',
  },
  {
    title: 'Serverless Summit',
    image: '/images/event5.png',
    slug: 'serverless-summit-2026',
    location: 'Online',
    date: 'July 18, 2026',
    time: '11:00 AM GMT',
  },
  {
    title: 'Women Who Code Meetup',
    image: '/images/event6.png',
    slug: 'women-who-code-meetup-2026',
    location: 'London, UK',
    date: 'September 30, 2026',
    time: '6:30 PM BST',
  },
];
