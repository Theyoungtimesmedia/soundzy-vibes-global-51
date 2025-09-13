import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeStats {
  activeChats: number;
  newLeads: number;
  ordersToday: number;
  lowStock: number;
  totalRevenue: number;
}

export const useRealTimeData = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    activeChats: 0,
    newLeads: 0,
    ordersToday: 0,
    lowStock: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Get active chats count
        const { count: activeChatCount } = await supabase
          .from('chat_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get new leads today
        const today = new Date().toISOString().split('T')[0];
        const { count: newLeadsCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today);

        // Get orders today
        const { data: ordersToday, count: orderCount } = await supabase
          .from('orders')
          .select('total_amount', { count: 'exact' })
          .gte('created_at', today);

        // Calculate total revenue today
        const totalRevenue = ordersToday?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

        // Get low stock products
        const { count: lowStockCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .lt('stock_quantity', 10)
          .eq('is_active', true);

        setStats({
          activeChats: activeChatCount || 0,
          newLeads: newLeadsCount || 0,
          ordersToday: orderCount || 0,
          lowStock: lowStockCount || 0,
          totalRevenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching real-time stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscriptions
    const chatSubscription = supabase
      .channel('admin_dashboard_chats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_sessions'
      }, () => {
        fetchStats();
      })
      .subscribe();

    const leadsSubscription = supabase
      .channel('admin_dashboard_leads')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads'
      }, () => {
        fetchStats();
      })
      .subscribe();

    const ordersSubscription = supabase
      .channel('admin_dashboard_orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchStats();
      })
      .subscribe();

    const productsSubscription = supabase
      .channel('admin_dashboard_products')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatSubscription);
      supabase.removeChannel(leadsSubscription);
      supabase.removeChannel(ordersSubscription);
      supabase.removeChannel(productsSubscription);
    };
  }, []);

  return { stats, loading };
};