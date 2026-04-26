import React from 'react';
import '../assets/styles/styles.css';
import EventCarousel from '../components/EventCarousel';
import TicketListing from '../components/TicketListing';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <EventCarousel />
      <TicketListing />
    </div>
  );
};

export default HomePage;