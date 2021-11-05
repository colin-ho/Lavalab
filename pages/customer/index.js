import styles from '../../styles/Admin.module.css';
import CustomerCheck from '../../components/CustomerCheck';
import SubscriptionFeed from '../../components/SubscriptionFeed';
import { firestore, auth } from '../../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function CustomerPage(props) {
  return (
    <main>
      <CustomerCheck>
        <SubscriptionList />
      </CustomerCheck>
    </main>
  );
}

function SubscriptionList() {
    
    const ref = firestore.collection('customers').doc(auth.currentUser.uid).collection('subscribedTo');
    const query = ref.orderBy('boughtAt');
    const [snapshot] = useCollection(query);
    const subscriptionSlugs = snapshot?.docs.map((doc) => doc.data().subscription);
    console.log(subscriptionSlugs)
    let subscriptionsQuery;
    if(subscriptionSlugs && subscriptionSlugs.length!==0){
        console.log('check',subscriptionSlugs)
        subscriptionsQuery = firestore
        .collectionGroup('subscriptions')
        .where('slug', 'in', subscriptionSlugs)
    }
    
    const [querySnapshot] = useCollection(subscriptionsQuery);
    const subscriptions= querySnapshot?.docs.map((doc) => doc.data());
    console.log(subscriptions)
    /*
    
*/
    return (
      <>
        <h1>Manage your Subscriptions</h1>
        {subscriptions && <SubscriptionFeed subscriptions={subscriptions} admin />}
      </>
    );
  }
