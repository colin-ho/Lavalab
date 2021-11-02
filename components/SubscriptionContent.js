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
          <a className="text-info">@{subscription.businessName}</a>
        {' '}
        on {createdAt.toISOString()}ß
      </span>
      <ReactMarkdown>{subscription?.content}</ReactMarkdown>
    </div>
  );
}