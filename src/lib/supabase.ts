import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ACADEMY_PHONE = '919894828541';

export type Program = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string | null;
  display_order: number;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  title: string;
  image_url: string;
  category: string;
  display_order: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  text: string;
  image_url: string | null;
  display_order: number;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  program: string | null;
  message: string;
  created_at: string;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  program: string;
  message: string;
  created_at: string;
};

export type Schedule = {
  id: string;
  program: string;
  time_slot: string;
  days: string;
  trainer_name: string;
  display_order: number;
  created_at: string;
};

export type Trainer = {
  id: string;
  name: string;
  specialization: string;
  image_url: string | null;
  bio: string;
  display_order: number;
  created_at: string;
};

export type Pricing = {
  id: string;
  program: string;
  price: string;
  period: string;
  features: string[];
  is_popular: boolean;
  display_order: number;
  created_at: string;
};

export type SiteContent = {
  id: string;
  key: string;
  value: Record<string, any>;
  updated_at: string;
};

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${ACADEMY_PHONE}?text=${encodeURIComponent(message)}`;
}

export function buildEnquiryWhatsAppLink(name: string, phone: string, program: string, message?: string): string {
  const text = [
    `Hi, I'm interested in joining Dynamic Sports Academy.`,
    ``,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Program: ${program}`,
    message ? `Message: ${message}` : '',
    ``,
    `Please share details.`,
  ].filter(Boolean).join('\n');
  return buildWhatsAppLink(text);
}
