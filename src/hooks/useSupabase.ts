import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useQuery<T>(table: string, options?: {
  select?: string;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  eq?: { column: string; value: string | number | boolean };
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      setLoading(true);
      let query = supabase.from(table).select(options?.select || '*');
      if (options?.eq) query = query.eq(options.eq.column, options.eq.value);
      if (options?.order) query = query.order(options.order.column, { ascending: options.order.ascending ?? false });
      if (options?.limit) query = query.limit(options.limit);

      const { data: rows, error: err } = await query;
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setData([]);
      } else {
        setData((rows as T[]) || []);
        setError(null);
      }
      setLoading(false);
    }
    fetch();
    return () => { cancelled = true; };
  }, [table]);

  return { data, loading, error };
}
