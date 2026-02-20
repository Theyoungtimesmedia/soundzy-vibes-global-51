
-- Seed products with real images
INSERT INTO products (name, description, category, price_cents, original_price_cents, image_url, is_active, stock_quantity, is_rentable, rental_price) VALUES
('Professional PA System', 'High-power PA system for events up to 500 people. Includes 2x 15" speakers, amplifier, and cabling.', 'Speakers', 45000000, NULL, 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/pa-system-BiX1CER1-1-768x768.jpg', true, 5, true, 2000000),
('Wireless Microphone Set', 'Professional dual wireless microphone system with receiver.', 'Microphones', 8500000, NULL, 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/wireless-mic-set-B2JN2xUC-768x768.jpg', true, 10, true, 800000),
('LED Stage Light Kit', 'Complete stage lighting setup with LED par cans, moving heads, and controller.', 'Stage Lighting', 12000000, NULL, 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/led-stage-lights-DD2AInF9-768x768.jpg', true, 8, true, 1500000),
('DJ Controller Pro', 'Professional 4-channel DJ controller with built-in sound card and performance pads.', 'DJ Equipment', 28000000, NULL, 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/dj-controller-CyptF9IN-768x768.jpg', true, 3, true, 2500000),
('Complete Event Sound Package', 'PA System + Wireless Mics + LED Lights bundle. Save ₦55,000.', 'Bundles', 60000000, 65500000, 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/sound-equipment-768x768.jpg', true, 2, true, 4500000),
('Studio Recording Package', 'Studio-grade recording setup: audio interface, condenser mic, headphones.', 'Studio', 19500000, NULL, 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/dj-equipment-768x768.jpg', true, 4, true, 1800000)
ON CONFLICT DO NOTHING;

-- Seed mixtapes
INSERT INTO mixtapes (title, genre, artwork_url, duration, likes_count) VALUES
('Superhero Named', 'Hip-Hop', 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/1763572513911-1024x1024.jpg', 180, 0),
('Odogwu Vibes Vol. 1', 'Afrobeats', 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/1763572513911-1024x1024.jpg', 240, 0),
('Port Harcourt Nights', 'Party Anthems', 'https://www.soundzyworldglobal.com/wp-content/uploads/2025/11/1763572513911-1024x1024.jpg', 200, 0)
ON CONFLICT DO NOTHING;
