import Link from 'next/link';

export default function SubscriptionFeed({ subscriptions, admin }) {
  return subscriptions ? subscriptions.map((subscription) => <SubscriptionItem subscription={subscription} key={subscription.slug} admin={admin} />) : null;
}

function SubscriptionItem({ subscription, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = subscription?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/shops/${subscription.businessId}/${subscription.slug}`}>
        <a>
          <strong>By @{subscription.businessName}</strong>
        </a>
      </Link>
      <h2>$ {subscription.price}</h2>
      <Link href={`/shops/${subscription.businessId}/${subscription.slug}`}>
        <h2>
          <a>{subscription.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💗 {subscription.customerCount || 0} Customers</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/business/${subscription.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {subscription.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
        </>
      )}
    </div>
  );
}