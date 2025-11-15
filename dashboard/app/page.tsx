import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Solutions from '@/components/Solutions';
import Steps from '@/components/Steps';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import FooterWithCTA from '@/components/FooterWithCTA';
import React from 'react';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-4">
        <section>
          <Features />
          <Solutions />
          <Steps />
          <Testimonials />
          <FAQ className="mt-24 lg:mt-64 mb-24 lg:mb-64" />
          <FooterWithCTA className="mt-24 lg:mt-64"/>
        </section>
      </div>
    </>
  );
}
