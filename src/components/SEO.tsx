
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({ 
  title = 'DataQuest Solutions - Expert Data Analytics & Training Services in Kenya',
  description = 'Leading data analytics company in Kenya offering machine learning, business intelligence, data visualization, and professional training courses. Transform your business with data-driven insights.',
  keywords = ['data analytics', 'machine learning', 'business intelligence', 'data science training', 'Kenya data solutions', 'analytics consulting', 'data visualization'],
  image = '/placeholder.svg',
  url = 'https://dataquestsolutions.com',
  type = 'website'
}: SEOProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DataQuest Solutions",
    "description": "Expert data analytics and training services in Kenya",
    "url": "https://dataquestsolutions.com",
    "logo": "https://dataquestsolutions.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254-700-000-000",
      "contactType": "customer service",
      "areaServed": "Kenya",
      "availableLanguage": ["English", "Swahili"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nairobi",
      "addressCountry": "Kenya"
    },
    "sameAs": [
      "https://www.linkedin.com/company/dataquest-solutions",
      "https://twitter.com/dataquestke",
      "https://www.facebook.com/dataquestsolutions"
    ],
    "offers": {
      "@type": "Service",
      "serviceType": "Data Analytics Services",
      "provider": {
        "@type": "Organization",
        "name": "DataQuest Solutions"
      }
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="DataQuest Solutions" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="DataQuest Solutions" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@dataquestke" />
      <meta name="twitter:creator" content="@dataquestke" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <meta name="geo.region" content="KE" />
      <meta name="geo.placename" content="Nairobi" />
      <meta name="geo.position" content="-1.286389;36.817223" />
      <meta name="ICBM" content="-1.286389, 36.817223" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional Meta Tags for Local SEO */}
      <meta name="geo.country" content="Kenya" />
      <meta name="geo.region" content="Nairobi" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
    </Helmet>
  );
};

export default SEO;
