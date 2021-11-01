import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// UI component for main post content
export default function SubscriptionContent({ subscription }) {
  const createdAt = typeof subscription?.createdAt === 'number' ? new Date(subscription.createdAt) : subscription.createdAt.toDate();

  return (
    <div className="card">
      <h1>{subscription?.title}</h1>
      <h1>$ {subscription?.price}</h1>
      <span className="text-sm">
        Created by{' '}
        <Link href={`/${subscription.username}/`}>
          <a className="text-info">@{subscription.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{subscription?.content}</ReactMarkdown>
    </div>
  );
}