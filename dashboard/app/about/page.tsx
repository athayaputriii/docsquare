import { AboutHero } from '@/components/about/Hero';
import { AboutSolution } from '@/components/about/Solution';
import { AboutTeam } from '@/components/about/Team';
import { AboutTestimonials } from '@/components/about/Testimonials';
import { VisionMission } from '@/components/about/VisionMission';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <AboutHero />
        <AboutSolution />
        <VisionMission />
        <AboutTeam />
        <AboutTestimonials />
      </main>
      <Footer />
    </>
  );
}
