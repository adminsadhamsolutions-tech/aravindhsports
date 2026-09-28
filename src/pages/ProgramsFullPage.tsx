import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Programs from '@/sections/Programs';

export default function ProgramsFullPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        <Programs showButton={false} />
      </main>
      <Footer />
    </div>
  );
}