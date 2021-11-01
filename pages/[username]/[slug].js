import styles from '../../styles/Post.module.css';
import SubscriptionContent from '../../components/SubscriptionContent';
import { firestore, getUserWithUsername, subToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import AuthCheck from '../../components/AuthCheck';
import Link from 'next/link';
import SubButton from '../../components/SubButton';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let subscription;
  let path;

  if (userDoc) {
    const subRef = userDoc.ref.collection('subscriptions').doc(slug);
    subscription = subToJSON(await subRef.get());

    path = subRef.path;
  }

  return {
    props: { subscription, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}
export default function Subscription(props) {
    const subRef = firestore.doc(props.path);
    const [realtimeSub] = useDocumentData(subRef);
  
    const subscription = realtimeSub || props.subscription;
  
    return (
      <main className={styles.container}>
  
        <section>
          <SubscriptionContent subscription={subscription} />
        </section>
  
        <aside className="card">
          <p>
            <strong>{subscription.customerCount || 0} 🤍</strong>
          </p>
          <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <SubButton subRef={subRef} />
        </AuthCheck>
        </aside>
      </main>
    );
  }