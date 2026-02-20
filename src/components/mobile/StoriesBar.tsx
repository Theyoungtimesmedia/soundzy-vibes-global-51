import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';

interface StoryUser {
  display_name: string;
  media_url: string | null;
  user_id: string | null;
}

export function StoriesBar() {
  const [stories, setStories] = useState<StoryUser[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    const { data } = await supabase
      .from('posts')
      .select('display_name, media_urls, user_id')
      .not('media_urls', 'eq', '{}')
      .order('created_at', { ascending: false })
      .limit(15);

    if (data) {
      const seen = new Set<string>();
      const unique: StoryUser[] = [];
      data.forEach(p => {
        const key = p.user_id || p.display_name;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push({
            display_name: p.display_name,
            media_url: p.media_urls?.[0] || null,
            user_id: p.user_id,
          });
        }
      });
      setStories(unique.slice(0, 10));
    }
  };

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const gradientColors = [
    'from-primary to-amber-500',
    'from-secondary to-purple-400',
    'from-pink-500 to-rose-500',
    'from-emerald-500 to-teal-500',
    'from-blue-500 to-indigo-500',
  ];

  return (
    <div className="px-4 py-3 overflow-x-auto no-scrollbar">
      <div className="flex gap-3">
        {/* Your Post */}
        <button onClick={() => navigate('/create-post')} className="flex flex-col items-center gap-1 shrink-0">
          <div className="h-[60px] w-[60px] rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <span className="text-[10px] text-muted-foreground w-[60px] truncate text-center">Your Post</span>
        </button>

        {/* Story circles */}
        {stories.map((story, i) => (
          <button key={i} className="flex flex-col items-center gap-1 shrink-0">
            <div className="h-[62px] w-[62px] rounded-full p-[2px] bg-gradient-to-br from-primary to-secondary">
              <div className="h-full w-full rounded-full overflow-hidden bg-background p-[2px]">
                <div className={`h-full w-full rounded-full flex items-center justify-center bg-gradient-to-br ${gradientColors[i % gradientColors.length]} overflow-hidden`}>
                  {story.media_url ? (
                    <img src={story.media_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-white text-lg font-bold">{getInitials(story.display_name)}</span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground w-[60px] truncate text-center">
              {story.display_name.length > 8 ? story.display_name.slice(0, 8) : story.display_name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
