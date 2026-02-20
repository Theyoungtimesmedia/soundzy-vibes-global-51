-- Insert profile for admin user DJ Soundzy
INSERT INTO public.profiles (user_id, email, full_name, role)
VALUES ('cabd5f0d-4824-4932-b720-fcd4309ed3b4', 'nathanielnimfas3@gmail.com', 'DJ Soundzy', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', email = 'nathanielnimfas3@gmail.com', full_name = 'DJ Soundzy';

-- Update product images with real URLs from soundzyworldglobal.com
UPDATE public.products SET image_url = 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/pa-system-BiX1CER1-1-768x768.jpg' WHERE name ILIKE '%PA System%';
UPDATE public.products SET image_url = 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/wireless-mic-set-B2JN2xUC-768x768.jpg' WHERE name ILIKE '%Wireless Microphone%';
UPDATE public.products SET image_url = 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/led-stage-lights-DD2AInF9-768x768.jpg' WHERE name ILIKE '%LED Stage%';
UPDATE public.products SET image_url = 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/dj-controller-CyptF9IN-768x768.jpg' WHERE name ILIKE '%DJ Controller%';
UPDATE public.products SET image_url = 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/sound-equipment-768x768.jpg' WHERE name ILIKE '%Event Sound Package%';
UPDATE public.products SET image_url = 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/dj-equipment-768x768.jpg' WHERE name ILIKE '%Studio Recording%';