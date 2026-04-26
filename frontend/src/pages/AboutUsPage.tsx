import React from 'react';
import useBlockchainAnimation from '../hooks/useBlockchainAnimation';
import HomepageHero from '../components/HomepageHero';
import FeaturesSection from '../components/FeaturesSection';
import BlockchainTrust from '../components/BlockchainTrust';

const AboutUsPage: React.FC = () => {
  useBlockchainAnimation();

  return (
    <div className="homepage">
      <HomepageHero />
      <FeaturesSection />
      <BlockchainTrust />
    </div>
  );
};

export default AboutUsPage;
