-- Create site_settings table for editable content
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "site_settings_select_all" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "site_settings_admin_manage" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Insert default footer services
INSERT INTO public.site_settings (key, value, description) VALUES 
('footer_services', '[
  {
    "id": "1",
    "title": "DJ Services",
    "description": "Professional DJ services for all events",
    "icon": "music"
  },
  {
    "id": "2", 
    "title": "Equipment Rental",
    "description": "High-quality sound equipment rental",
    "icon": "speaker"
  },
  {
    "id": "3",
    "title": "Event Planning",
    "description": "Complete event planning and coordination",
    "icon": "calendar"
  },
  {
    "id": "4",
    "title": "Creative Services",
    "description": "Logo design, branding, and marketing",
    "icon": "palette"
  }
]'::jsonb, 'Footer services section content'),

('homepage_services', '[
  {
    "id": "1",
    "title": "DJ Services",
    "description": "Professional DJ services for weddings, parties, and corporate events",
    "image": "/images/dj-equipment.jpg"
  },
  {
    "id": "2",
    "title": "Sound Equipment",
    "description": "High-quality sound systems and equipment rental",
    "image": "/images/sound-equipment.jpg"
  },
  {
    "id": "3",
    "title": "Creative Services", 
    "description": "Logo design, branding, and digital marketing solutions",
    "image": "/images/creative-workspace.jpg"
  }
]'::jsonb, 'Homepage services section content'),

('creative_services', '[
  {
    "id": "1",
    "title": "Logo Design",
    "description": "Custom logo design that captures your brand identity",
    "image": "/images/portfolio-logo-design.jpg"
  },
  {
    "id": "2",
    "title": "Brand Identity",
    "description": "Complete brand identity packages for businesses",
    "image": "/images/portfolio-brand-identity.jpg"
  },
  {
    "id": "3",
    "title": "Web Design",
    "description": "Responsive websites that convert visitors to customers",
    "image": "/images/portfolio-web-design.jpg"
  },
  {
    "id": "4",
    "title": "Print Design",
    "description": "Professional print materials and marketing collateral",
    "image": "/images/portfolio-print-design.jpg"
  },
  {
    "id": "5",
    "title": "Digital Marketing",
    "description": "Strategic digital marketing campaigns",
    "image": "/images/portfolio-digital-marketing.jpg"
  },
  {
    "id": "6",
    "title": "Video Production",
    "description": "Professional video content for marketing and events",
    "image": "/images/portfolio-video-production.jpg"
  }
]'::jsonb, 'Creative services page content'),

('shop_services', '[
  {
    "id": "1",
    "title": "Equipment Rental",
    "description": "Professional sound equipment for all your events",
    "image": "/images/sound-equipment.jpg"
  },
  {
    "id": "2", 
    "title": "DJ Packages",
    "description": "Complete DJ setups with mixing consoles and speakers",
    "image": "/images/dj-equipment.jpg"
  },
  {
    "id": "3",
    "title": "Lighting Systems",
    "description": "Stage lighting and effects for memorable events",
    "image": "/images/led-stage-lights.jpg"
  }
]'::jsonb, 'Shop page services section content');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();