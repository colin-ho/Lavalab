import Head from 'next/head';

export default function Metatags({
  title = 'Punchcard',
  description = 'Discover and purchase subscriptions from local businesses',
}) {
  return (
    <Head>
      <title>{title}</title>
      <link rel="shortcut icon" href="/icons/favicon.ico" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description} key="twitterDescription"/>
      <meta name="twitter:image" content={"https://punchcardapp.com/images/punchcard-branding.png"} />
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description} key="description" />
      <meta property="og:image" content={"https://punchcardapp.com/images/punchcard-branding.png"} />
    </Head>
  );
}