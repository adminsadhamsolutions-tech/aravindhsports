import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Gallery from '@/sections/Gallery';

export default function GalleryFullPage() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-dark">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center pt-16">
        <Gallery showButton={false} />
      </main>
      <Footer />
    </div>
  );
}