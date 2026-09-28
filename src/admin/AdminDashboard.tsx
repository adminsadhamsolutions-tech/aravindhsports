import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Activity, Image, MessageSquare, Star, Phone,
  Plus, Trash2, Save, LogOut, Menu, X, Edit3, Layers, Mail
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Program, GalleryImage, Testimonial, ContactMessage } from '@/lib/supabase';
import AdminOverview from './AdminOverview';
import AdminHero from './AdminHero';
import AdminAbout from './AdminAbout';
import AdminPrograms from './AdminPrograms';
import AdminGallery from './AdminGallery';
import AdminTestimonials from './AdminTestimonials';
import AdminMessages from './AdminMessages';
import AdminContact from './AdminContact';

const tabs = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, component: AdminOverview },
  { id: 'hero', label: 'Hero Section', icon: Activity, component: AdminHero },
  { id: 'about', label: 'About Section', icon: Edit3, component: AdminAbout },
  { id: 'programs', label: 'Programs', icon: Layers, component: AdminPrograms },
  { id: 'gallery', label: 'Gallery', icon: Image, component: AdminGallery },
  { id: 'testimonials', label: 'Testimonials', icon: Star, component: AdminTestimonials },
  { id: 'messages', label: 'Messages', icon: MessageSquare, component: AdminMessages },
  { id: 'contact', label: 'Contact Info', icon: Phone, component: AdminContact },
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || AdminOverview;

  return (
    <div className="min-h-screen bg-primary-dark flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass-dark border-r border-white/5 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center glow-accent">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="font-display font-extrabold text-sm">
              <span className="text-white">DYNAMIC</span>
              <span className="block text-accent text-[0.5rem] tracking-[0.2em] font-semibold">SPORTS ACADEMY</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-accent/15 text-accent border border-accent/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* User + sign out */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-3 rounded-xl glass-dark mb-3">
              <div className="text-xs text-white/40">Logged in as</div>
              <div className="text-sm text-white font-medium truncate">{user?.email}</div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-0 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 glass-dark border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
          <span className="font-display font-bold text-white">Admin Panel</span>
        </div>

        <div className="p-6 md:p-10">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
