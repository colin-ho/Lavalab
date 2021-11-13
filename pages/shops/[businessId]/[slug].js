import styles from '../../../styles/Post.module.css';
import SubscriptionContent from '../../../components/SubscriptionContent';
import { firestore, getBusinessWithBusinessId, subToJSON } from '../../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import CustomerCheck from '../../../components/CustomerCheck';
import Link from 'next/link';
import SubButton from '../../../components/SubButton';
import RedeemButton from '../../../components/RedeemButton';

export async function getStaticProps({ params }) {
  const { businessId, slug } = params;
  const businessDoc = await getBusinessWithBusinessId(businessId);
  let subscription;
  let path;

  if (businessDoc) {
    const subRef = businessDoc.ref.collection('subscriptions').doc(slug);
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
  const snapshot = await firestore.collectionGroup('subscriptions').get();

  const paths = snapshot.docs.map((doc) => {
    const { businessId,slug } = doc.data();
    return {
      params: { businessId, slug },
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
          <CustomerCheck
          fallback={
            <Link href="/customerLogin">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <SubButton subscription = {subscription} subRef={subRef} />
          <RedeemButton subscription = {subscription} subRef={subRef} />
        </CustomerCheck>
        </aside>
      </main>
    );
  }