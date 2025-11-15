import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PricingHero } from '@/components/pricing/Hero';
import { PricingCompare } from '@/components/pricing/Compare';
import { PricingTestimonials } from '@/components/pricing/Testimonials';
import { FooterWithCTA } from '@/components/FooterWithCTA';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <PricingHero />
        <PricingCompare />
        <PricingTestimonials />
      </main>
      <FooterWithCTA />
      <Footer />
    </>
  );
}
