import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Contact from '@/sections/Contact';

export default function ContactFullPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 flex flex-col justify-center pt-20">
        {/* Contact Form & Information */}
        <Contact showButton={false} />

        {/* Dynamic Sports Academy Map Section */}
        <section className="max-w-5xl mx-auto w-full px-4 sm:px-6 pb-16">
          <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg shadow-slate-200/50 h-[380px] sm:h-[450px] w-full">
            <iframe
              title="Dynamic Sports Academy Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.709501111824!2d77.82003887790918!3d12.732364655489464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae710c5cb5e3a7%3A0x9f4c7c2f71d22c6d!2sDynamic%20Sports%20Academy-%20Yoga%2FKung%20Fu%2FKarate%2FTaekwondo%2FArchery%2FGymnastic%20Classes!5e0!3m2!1sen!2sin!4v1788953430232!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}