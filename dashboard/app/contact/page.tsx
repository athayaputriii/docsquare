// import { Navbar } from '@/components/Navbar';
// import { Footer } from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ContactHero } from '@/components/contact/Hero';
import { ContactAddress } from '@/components/contact/Address';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        <ContactHero />
        <form className="card space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Full name" required />
            <Input placeholder="Work email" required type="email" />
          </div>
          <Textarea placeholder="Tell us about your WhatsApp workflow..." rows={4} />
          <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
            Request consultation
          </button>
        </form>
        <ContactAddress />
      </main>
      <Footer />
    </>
  );
}
