export interface Post {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  modifiedDate?: string;
  author: string;
  content: string;
  postImage?: string;
}

export const posts: Post[] = [
  {
    id: '1',
    title: 'Introducing Our New Feature',
    subtitle: 'Discover the benefits of our latest update',
    date: '2024-01-15',
    author: 'Jane Doe',
    content: 'We are excited to announce the launch of our new feature that will enhance your experience. This update includes several improvements and new functionalities designed to make your workflow smoother and more efficient. Stay tuned for more details!',
    postImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Pygoscelis_adeliae.jpg/330px-Pygoscelis_adeliae.jpg',
  },
  {
    id: '2',
    title: 'How to Maximize Productivity',
    subtitle: 'Tips and tricks for getting the most out of your day',
    date: '2024-02-10',
    author: 'John Smith',
    content: 'Maximizing productivity is essential for achieving your goals. In this article, we share practical tips and tricks to help you stay focused, manage your time effectively, and boost your overall efficiency throughout the day.',
    postImage: 'https://example.com/images/productivity-tips.jpg',
  },
  {
    id: '3',
    title: 'The Future of Technology',
    subtitle: 'Exploring upcoming trends and innovations',
    date: '2024-03-05',
    author: 'Alice Johnson',
    content: 'Technology is evolving at a rapid pace, bringing forth new trends and innovations that are set to transform various industries. In this article, we delve into the future of technology and what we can expect in the coming years.',
    postImage: 'https://example.com/images/future-technology.jpg',
  },
  {
    id: '4',
    title: 'Sustainable Living Practices',
    subtitle: 'How to reduce your environmental footprint',
    date: '2024-04-20',
    author: 'Michael Brown',
    content: 'Sustainable living is more important than ever. This article provides practical advice on how to reduce your environmental footprint through simple lifestyle changes, eco-friendly habits, and conscious consumption.',
    postImage: 'https://example.com/images/sustainable-living.jpg',
  },
  {
    "id": "5",
    "title": "Mastering Time Management",
    "subtitle": "Tips to boost your daily productivity",
    "date": "2024-05-01",
    "author": "Sophia Lee",
    "content": "Learn how to manage your time effectively with proven strategies that help you stay focused, organized, and in control of your schedule.",
    "postImage": "https://example.com/images/time-management.jpg"
  },
  {
    "id": "6",
    "title": "The Art of Minimalism",
    "subtitle": "Living more with less",
    "date": "2024-05-10",
    "author": "Daniel Kim",
    "content": "Minimalism is more than a design trend—it's a lifestyle. Discover how simplifying your space and mindset can lead to greater clarity and peace.",
    "postImage": "https://example.com/images/minimalism.jpg"
  },
  {
    "id": "7",
    "title": "Exploring the World on a Budget",
    "subtitle": "Affordable travel tips for adventurers",
    "date": "2024-05-18",
    "author": "Lena Torres",
    "content": "Traveling doesn't have to break the bank. This guide shares practical ways to explore new destinations while keeping costs low.",
    "postImage": "https://example.com/images/budget-travel.jpg"
  },
  {
    "id": "8",
    "title": "Digital Detox 101",
    "subtitle": "Reclaim your time from screens",
    "date": "2024-05-25",
    "author": "Marcus Allen",
    "content": "Constant connectivity can be draining. Learn how to unplug, recharge, and find balance in a hyper-digital world.",
    "postImage": "https://example.com/images/digital-detox.jpg"
  },
  {
    "id": "9",
    "title": "Creative Journaling Ideas",
    "subtitle": "Unlock your thoughts through writing",
    "date": "2024-06-02",
    "author": "Emily Zhang",
    "content": "Journaling is a powerful tool for self-reflection and creativity. Try these prompts and techniques to get started.",
    "postImage": "https://example.com/images/journaling.jpg"
  },
  {
    "id": "10",
    "title": "Home Office Makeover",
    "subtitle": "Designing a space that inspires",
    "date": "2024-06-10",
    "author": "Carlos Mendes",
    "content": "Your workspace affects your productivity. Discover how to create a home office that’s both functional and motivating.",
    "postImage": "https://example.com/images/home-office.jpg"
  },
  {
    "id": "11",
    "title": "Mindful Eating Habits",
    "subtitle": "A healthier relationship with food",
    "date": "2024-06-18",
    "author": "Aisha Patel",
    "content": "Mindful eating helps you enjoy food more and make better choices. Learn how to tune into your body’s needs.",
    "postImage": "https://example.com/images/mindful-eating.jpg"
  },
  {
    "id": "12",
    "title": "Beginner’s Guide to Meditation",
    "subtitle": "Finding calm in everyday life",
    "date": "2024-06-25",
    "author": "Noah Rivera",
    "content": "Meditation can reduce stress and improve focus. This guide walks you through simple techniques to get started.",
    "postImage": "https://example.com/images/meditation.jpg"
  },
  {
    "id": "13",
    "title": "How to Start a Side Hustle",
    "subtitle": "Turn your passion into profit",
    "date": "2024-07-01",
    "author": "Rachel Nguyen",
    "content": "Looking to earn extra income? Learn how to launch a side hustle that aligns with your skills and interests.",
    "postImage": "https://example.com/images/side-hustle.jpg"
  },
  {
    "id": "14",
    "title": "The Science of Better Sleep",
    "subtitle": "Rest well, live better",
    "date": "2024-07-08",
    "author": "James Carter",
    "content": "Quality sleep is essential for health and productivity. Discover science-backed tips to improve your sleep routine.",
    "postImage": "https://example.com/images/sleep.jpg"
  }
  

];