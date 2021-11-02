import toast from 'react-hot-toast';
import { firestore, fromMillis, subToJSON } from '../../lib/firebase';

import { useState } from 'react';
import SubscriptionFeed from '../../components/SubscriptionFeed';
import Loader from '../../components/Loader';

// Max post to query per page
const LIMIT = 3;

export async function getServerSideProps(context) {
  const subscriptionsQuery = firestore
    .collectionGroup('subscriptions')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const subscriptions = (await subscriptionsQuery.get()).docs.map(subToJSON);

  return {
    props: { subscriptions }, // will be passed to the page component as props
  };
}

export default function ShopsPage(props) {
  const [subscriptions, setSubscriptions] = useState(props.subscriptions);
  const [loading, setLoading] = useState(false);

  const [subscriptionsEnd, setSubscriptionsEnd] = useState(false);

  const getMoreSubscriptions = async () => {
    setLoading(true);
    const last = subscriptions[subscriptions.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('subscriptions')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newSubscriptions = (await query.get()).docs.map((doc) => doc.data());

    setSubscriptions(subscriptions.concat(newSubscriptions));
    setLoading(false);

    if (newSubscriptions.length < LIMIT) {
      setSubscriptionsEnd(true);
    }
  };

  return (
      <main>
        <SubscriptionFeed subscriptions={subscriptions} />

        {!loading && !subscriptionsEnd && <button onClick={getMoreSubscriptions}>Load more</button>}

        <Loader show={loading} />

        {subscriptionsEnd && 'You have reached the end!'}
      </main>
  );
}