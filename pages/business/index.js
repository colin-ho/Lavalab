import styles from '../../styles/Admin.module.css';
import BusinessCheck from '../../components/BusinessCheck';
import SubscriptionFeed from '../../components/SubscriptionFeed';
import { AuthContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

export default function BusinessPage(props) {
  return (
    <main>
      <BusinessCheck>
        <SubscriptionList />
        <CreateNewSubscription />
      </BusinessCheck>
    </main>
  );
}

function SubscriptionList() {
    const ref = firestore.collection('businesses').doc(auth.currentUser.uid).collection('subscriptions');
    const query = ref.orderBy('createdAt');
    const [querySnapshot] = useCollection(query);
    const subscriptions = querySnapshot?.docs.map((doc) => doc.data());
  
    return (
      <>
        <h1>Manage your Subscriptions</h1>
        <SubscriptionFeed subscriptions={subscriptions} admin />
      </>
    );
  }

function CreateNewSubscription() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const { user } = useContext(AuthContext);
    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createSubscription = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = firestore.collection('businesses').doc(uid).collection('subscriptions').doc(slug);
        const createdProductId = await axios.post('/api/createProduct', {
            name:title,
            businessId:uid,
        });
        console.log(createdProductId.data.id);
        // Tip: give all fields a default value here
        const data = {
        title,
        slug,
        uid,
        stripePriceId:'',
        stripeProductId:createdProductId.data.id,
        businessName:user.displayName,
        businessId:auth.currentUser.uid,
        published: false,
        content: '# hello world!',
        price:0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        customerCount: 0,
        redemptionCount:0,
        };

        await ref.set(data);

        toast.success('Subscription created!')

        // Imperative navigation after doc is set
        router.push(`/business/${slug}`);

    };

    return (
        <form onSubmit={createSubscription}>
        <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Coffee Subscription!"
            className={styles.input}
        />
        <p>
            <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">
            Create New Subscription
        </button>
        </form>
    );
}