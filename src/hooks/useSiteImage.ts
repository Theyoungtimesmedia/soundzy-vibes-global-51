import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSiteImage(key: string, fallback: string = '') {
  const [imageUrl, setImageUrl] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImage();

    const channel = supabase
      .channel(`website-image-${key}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'website_images',
        filter: `key=eq.${key}`,
      }, (payload) => {
        setImageUrl((payload.new as any).url || fallback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [key, fallback]);

  const loadImage = async () => {
    const { data } = await supabase
      .from('website_images')
      .select('url')
      .eq('key', key)
      .single();

    if (data?.url) {
      setImageUrl(data.url);
    }
    setLoading(false);
  };

  return { imageUrl, loading };
}
