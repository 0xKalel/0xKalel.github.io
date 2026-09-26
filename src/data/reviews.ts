// Third-party voices: LinkedIn recommendations (quoted from public profiles,
// trimmed) and freelancer.com client reviews quoted verbatim from
// khalil.mawaki3.com. Shared by Reviews.astro and the ask-chat knowledge document.

/** Avatar image key under src/assets/reviews; null renders a monogram. */
export type AvatarKey = 'jesse' | 'med' | 'fateh' | 'richard' | 'zach';

export interface LinkedInReview {
  quote: string;
  name: string;
  role: string;
  tag: string;
  href: string;
  avatar: AvatarKey | null;
  lang?: string;
}

export const linkedinReviews: LinkedInReview[] = [
  {
    quote:
      'One of the best people I’ve ever worked with. I just write a few lines or share a quick prototype, and Khalil immediately gets it. We skip long documents and unnecessary meetings, which makes us truly agile and able to move fast.',
    name: 'Jesse Bouman',
    role: 'Strategic Partnerships · former Google',
    tag: 'Works with Khalil at StoragePal · Dec 2025',
    href: 'https://www.linkedin.com/in/jessebouman/',
    avatar: 'jesse',
  },
  {
    quote:
      'We have worked together for a number of years on a large project. Khalil has always been very attentive and fast to respond to design changes and issues. Would highly recommend him and his team.',
    name: 'Richard Harvey',
    role: 'CEO, Black and Yellow Ltd',
    tag: 'Khalil’s manager, 2018-2020 · Jun 2022',
    href: 'https://www.linkedin.com/in/richard-harvey/',
    avatar: 'richard',
  },
  {
    quote:
      'Khalil has been and will always be one of the biggest influences in my career. As a mentor, Khalil brought the best out of everyone under his wing.',
    name: 'Zach Rachedi',
    role: 'Senior Product Engineer, IDnow',
    tag: 'Reported to Khalil · Jun 2022',
    href: 'https://www.linkedin.com/in/zach-rachedi/',
    avatar: 'zach',
  },
  {
    quote:
      'I never saw him fail to deliver, no matter the tech stack or the complexity of the situation. Every company or client I saw hire him ended up extending his contracts.',
    name: 'Med Rezzag',
    role: 'Senior Web Developer',
    tag: 'Worked under Khalil for two years · Jun 2025',
    href: 'https://www.linkedin.com/in/algerian/',
    avatar: 'med',
  },
  {
    quote:
      'Ce qui définit Khalil, c’est sa remarquable clairvoyance en tant qu’architecte logiciel. Je recommande Khalil sans la moindre hésitation.',
    name: 'Fateh Hadjarsi',
    role: 'Frontend & 3D developer',
    tag: 'Worked under Khalil on Web3 projects · Jun 2025',
    href: 'https://www.linkedin.com/in/fateh-h/',
    avatar: 'fateh',
    lang: 'fr',
  },
  {
    quote:
      'His technical proficiency in both front-end and back-end development surpassed expectations. Khalil’s teamwork, work ethic, and attention to detail shone throughout our collaboration.',
    name: 'Imran Saleem',
    role: 'Full-stack developer',
    tag: 'Worked with Khalil at Singularity Creations · Apr 2024',
    href: 'https://www.linkedin.com/in/imran-saleem-396797a6/',
    avatar: null,
  },
];

export const freelanceReviews = [
  {
    quote:
      'Excellent. Delivered perfect solution, ensured requirements were well understood, asked good questions, excellent technical skills. One of the best freelancers I have had the pleasure to work with.',
    name: 'Steven G. M.',
  },
  {
    quote:
      'Very honest guy. Perfect execution on the vision I had. A big, big bonus for actually giving a demo before hiring. Will definitely come back.',
    name: 'Adam A.',
  },
  {
    quote:
      'His expertise is top drawer and he is totally focused on the customer being more than satisfied. Very happy with hiring him for all 3 phases of this project, and will hire again.',
    name: 'Talbot S.',
  },
];
