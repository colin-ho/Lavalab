import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import ImageUploader from '../../components/ImageUploader';
import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminSubscriptionEdit(props) {
  return (
    <AuthCheck>
        <SubscriptionManager />
    </AuthCheck>
  );
}

function SubscriptionManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const subRef = firestore.collection('users').doc(auth.currentUser.uid).collection('subscriptions').doc(slug);
  const [subscription] = useDocumentData(subRef);

  return (
    <main className={styles.container}>
      {subscription && (
        <>
          <section>
            <h1>{subscription.title}</h1>
            <p>ID: {subscription.slug}</p>

            <SubForm subRef={subRef} defaultValues={subscription} preview={preview} />
          </section>

          <aside>
          <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${subscription.username}/${subscription.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function SubForm({ defaultValues, subRef, preview }) {
    const { register, handleSubmit, reset, watch, formState: { isDirty, isValid, errors } } = useForm({ defaultValues, mode: 'onChange' });

    const updateSubscription = async ({ content, published,price }) => {
        await subRef.update({
        content,
        published,
        price,
        updatedAt: serverTimestamp(),
        });

        reset({ content, published,price });

        toast.success('Subscription updated successfully!')
    };

    return (
        <form onSubmit={handleSubmit(updateSubscription)}>
        {preview && (
            <div className="card">
            <ReactMarkdown>{watch('content')}</ReactMarkdown>
            </div>
        )}

        <div className={preview ? styles.hidden : styles.controls}>
    
            <ImageUploader/>
            <textarea name="content" {...register('content',{
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required'}
          })}></textarea>

          

            {errors.content && <p className="text-danger">{errors.content.message}</p>}

            <fieldset>
            <input className={styles.checkbox} name="published" type="checkbox" {...register('published')}/>
            <label>Published</label>
            </fieldset>

            <fieldset>
            <input name="price" type="number" {...register('price')}/>
            <label>Price</label>
            </fieldset>

            <button type="submit" disabled={!isDirty || !isValid}>
            Save Changes
            </button>
        </div>
        </form>
    );
}