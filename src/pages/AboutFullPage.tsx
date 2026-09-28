import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutSection from '@/sections/About';

export default function AboutFullPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        {/* Pass showButton={false} so the button does not show inside this full page */}
        <AboutSection showButton={false} />
      </main>
      <Footer />
    </div>
  );
}