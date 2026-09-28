import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Program } from '@/lib/supabase';

export function usePrograms(): [Program[], boolean] {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setPrograms(data);
        setLoading(false);
      });
  }, []);

  return [programs, loading];
}
