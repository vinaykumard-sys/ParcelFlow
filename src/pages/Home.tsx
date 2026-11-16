import React from 'react';
import { Hero } from '../components/Hero';
import { ProblemSection } from '../components/ProblemSection';
import { HowItWorks } from '../components/HowItWorks';
import { DeliveryTimeline } from '../components/DeliveryTimeline';
import { AppPreview } from '../components/AppPreview';
import { Features } from '../components/Features';
import { ResidentSection } from '../components/ResidentSection';
import { SocietySection } from '../components/SocietySection';
import { SecuritySection } from '../components/SecuritySection';
import { ComparisonSection } from '../components/ComparisonSection';
import { IndiaFirstSection } from '../components/IndiaFirstSection';
import { FutureVision } from '../components/FutureVision';
import { DownloadCTA } from '../components/DownloadCTA';
import { FAQ } from '../components/FAQ';
import { FinalCTA } from '../components/FinalCTA';

interface HomeProps {
  onOpenPilotModal?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenPilotModal }) => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Problem Section */}
      <ProblemSection />

      {/* 3. How It Works Section */}
      <HowItWorks />

      {/* 4. Interactive Delivery Timeline */}
      <DeliveryTimeline />

      {/* 5. Mobile App Interactive Mockup & Preview */}
      <AppPreview />

      {/* 6. Core Features Section */}
      <Features />

      {/* 7. For Residents Section */}
      <ResidentSection />

      {/* 8. For Societies & RWAs Section */}
      <SocietySection />

      {/* 9. Security & Audit Section */}
      <SecuritySection />

      {/* 10. Direct Comparison Section */}
      <ComparisonSection />

      {/* 11. India-First Apartment Living Realities */}
      <IndiaFirstSection />

      {/* 12. Future Vision & Product Roadmap */}
      <FutureVision />

      {/* 13. High-Impact Download App Card */}
      <DownloadCTA onOpenPilotModal={onOpenPilotModal} />

      {/* 14. Expandable FAQ Accordion */}
      <FAQ limit={6} showCategories={false} showSearch={false} />

      {/* 15. Final Call-to-Action */}
      <FinalCTA onOpenPilotModal={onOpenPilotModal} />
    </div>
  );
};
