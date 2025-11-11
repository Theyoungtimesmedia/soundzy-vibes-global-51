import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useSiteImage(key: string, fallbackUrl: string) {
  return useQuery({
    queryKey: ['site-image', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_images')
        .select('url')
        .eq('key', key)
        .single();
      
      if (error || !data) {
        return fallbackUrl;
      }
      
      return data.url || fallbackUrl;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: fallbackUrl,
  });
}
