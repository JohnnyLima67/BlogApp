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
];