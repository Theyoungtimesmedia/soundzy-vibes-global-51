import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  [key: string]: any;
}

export const useServices = (sectionKey: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', sectionKey)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, use empty array
            setServices([]);
          } else {
            throw error;
          }
        } else {
          setServices(Array.isArray(data.value) ? data.value as Service[] : []);
        }
        setError(null);
      } catch (err) {
        console.error(`Error loading services for ${sectionKey}:`, err);
        setError('Failed to load services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: `key=eq.${sectionKey}`
        },
        (payload) => {
          if (payload.new && 'value' in payload.new) {
            setServices(Array.isArray(payload.new.value) ? payload.new.value as Service[] : []);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [sectionKey]);

  return { services, loading, error };
};