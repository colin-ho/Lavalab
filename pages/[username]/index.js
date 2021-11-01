import { getUserWithUsername, subToJSON } from '../../lib/firebase';
import UserProfile from '../../components/UserProfile';
import SubscriptionFeed from '../../components/SubscriptionFeed';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }
  // JSON serializable data
  let user = null;
  let subscriptions = null;

  if (userDoc) {
    user = userDoc.data();
    const subscriptionsQuery = userDoc.ref
      .collection('subscriptions')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    subscriptions = (await subscriptionsQuery.get()).docs.map(subToJSON);
  }

  return {
    props: { user, subscriptions }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, subscriptions }) {
  return (
    <main>
      <UserProfile user={user} />
      <SubscriptionFeed subscriptions={subscriptions} />
    </main>
  );
}