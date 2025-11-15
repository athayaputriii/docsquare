import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StaticCustomers } from '@/components/StaticCustomers';

const posts = [
  { title: 'Shipping LangChain to WhatsApp', date: 'May 2024' },
  { title: 'AssemblyAI tips for clinical dictation', date: 'April 2024' },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Blog</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Product notes & release stories</h1>
        </header>
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.title} className="card flex items-center justify-between text-white">
              <span>{post.title}</span>
              <span className="text-sm text-slate-500">{post.date}</span>
            </li>
          ))}
        </ul>
        <StaticCustomers />
      </main>
      <Footer />
    </>
  );
}
