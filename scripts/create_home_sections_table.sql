-- Home Page Sections Management Table
CREATE TABLE IF NOT EXISTS home_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(100) NOT NULL UNIQUE COMMENT 'Unique identifier for section (e.g., hero, about, why_us)',
  title VARCHAR(255) DEFAULT NULL,
  content TEXT DEFAULT NULL COMMENT 'Main content/description',
  
  -- Images
  image_url VARCHAR(500) DEFAULT NULL,
  image_alt VARCHAR(255) DEFAULT NULL,
  background_image VARCHAR(500) DEFAULT NULL,
  
  -- CTA (Call to Action)
  cta_text VARCHAR(100) DEFAULT NULL,
  cta_link VARCHAR(255) DEFAULT NULL,
  cta_text_2 VARCHAR(100) DEFAULT NULL,
  cta_link_2 VARCHAR(255) DEFAULT NULL,
  
  -- Additional JSON data for flexible content
  extra_data JSON DEFAULT NULL COMMENT 'Store additional section-specific data',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_section_key (section_key),
  INDEX idx_active_order (is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Home Page Features (for cards/highlights)
CREATE TABLE IF NOT EXISTS home_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(100) NOT NULL COMMENT 'Parent section (e.g., why_us, about)',
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  icon_url VARCHAR(500) DEFAULT NULL,
  icon_alt VARCHAR(255) DEFAULT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_section (section_key, is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default home sections
INSERT INTO home_sections (section_key, title, content, image_url, image_alt, cta_text, cta_link, cta_text_2, cta_link_2, extra_data, display_order) VALUES 
('hero', 
 'Votre guide de confiance pour la santé des reins', 
 'Comprenez les maladies rénales, obtenez des conseils d''experts et connectez-vous avec des cliniques fiables.',
 '/images/kidney-hero2.png',
 'Illustration du rein humain',
 'En savoir plus',
 '/about',
 'Guide des maladies',
 '/diseases',
 JSON_OBJECT(
   'subtitle', 'Des informations simples, fiables et validées par des médecins',
   'description', 'Découvrez les symptômes, les causes, les conseils alimentaires et les options de traitements naturels expliqués de manière claire et compréhensible.',
   'background', 'linear-gradient(135deg, rgba(203, 227, 255, 1) 0%, rgb(131 193 255) 100%)'
 ),
 1),

('consultation_banner', 
 'Consultation gratuite', 
 'Parlez à un spécialiste des reins.',
 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg',
 'France Flag',
 'RÉSERVER',
 '/contact',
 NULL,
 NULL,
 JSON_OBJECT(
   'background', 'linear-gradient(90deg, #436f96, #02203a)',
   'badge_text', 'N''attendez pas'
 ),
 2),

('trust_section', 
 'Un hôpital de confiance pour la guérison naturelle des reins', 
 'Karma Ayurveda USA est un hôpital spécialisé dans les soins naturels des reins, combinant l''Ayurveda et la science moderne sous la direction de Dr Puneet Dhawan.\n\nForts de plus de 84 ans d''expertise, nous traitons les maladies rénales grâce à des thérapies naturelles éprouvées.\n\nCertifié NABH & FDA, notre hôpital garantit des soins sûrs, transparents et centrés sur le patient.',
 'https://www.karmaayurvedausa.com/assets/serve_static.php?file=image/about-3-2.gif',
 'Karma Ayurveda USA - Certifié FDA',
 'Demander un avis',
 '#contact',
 NULL,
 NULL,
 JSON_OBJECT('background', '#f8fbff'),
 3),

('about_us', 
 'Un accompagnement fiable pour une meilleure santé des reins', 
 'Nous nous engageons à fournir des informations claires, fiables et faciles à comprendre sur la santé rénale, afin d''aider les patients et leurs proches à mieux comprendre les maladies des reins.\n\nGrâce à notre expérience en sensibilisation à la santé rénale, nous rendons les informations médicales accessibles au quotidien, pour vous permettre de prendre des décisions éclairées en toute confiance.',
 '/images/Dr.puneet-dhawan.jpg',
 'Experts en soins rénaux',
 'En savoir plus',
 '/about',
 'Nous contacter',
 '/contact',
 JSON_OBJECT('badge', 'À propos de nous'),
 4),

('why_choose_us', 
 'Pourquoi choisir Karma Ayurveda ?', 
 'Choisir l''Ayurveda est une décision personnelle, basée sur vos besoins et votre approche du bien-être. Cette médecine traditionnelle, pratiquée depuis des milliers d''années, aide de nombreuses personnes à mieux comprendre leur corps et à prendre soin de leur santé de manière naturelle.',
 'https://www.karmaayurvedausa.com/assets/image/1.png',
 'Trusted by US Patients',
 NULL,
 NULL,
 NULL,
 NULL,
 JSON_OBJECT(
   'stamp_image', '/images/france.png',
   'background_color', '#003b72'
 ),
 5),

('contact_cta', 
 'Besoin d''aide ? Parlez à des experts rénaux', 
 'Conseils personnalisés selon votre situation — consultation gratuite.',
 '/images/kidney-hero2.png',
 'Consultation médicale',
 'Consultation gratuite',
 '/contact',
 'Appeler',
 'tel:+919999999999',
 JSON_OBJECT(
   'background', 'linear-gradient(135deg, #0d6efd 0%, #084298 100%)',
   'badges', JSON_ARRAY('✔ Suivi médical', '✔ Gratuit', '✔ Confidentiel')
 ),
 6);

-- Insert default features for about_us section
INSERT INTO home_features (section_key, title, description, icon_url, display_order) VALUES
('about_us', 'Contenu validé par des médecins', NULL, NULL, 1),
('about_us', 'Langage simple et compréhensible', NULL, NULL, 2),
('about_us', 'Conseils sur l''alimentation et le mode de vie', NULL, NULL, 3),
('about_us', 'Réseau de cliniques de confiance', NULL, NULL, 4);

-- Insert default features for why_choose_us section
INSERT INTO home_features (section_key, title, description, icon_url, icon_alt, display_order) VALUES
('why_choose_us', '100 % naturel et authentique', '', 'https://www.karmaayurvedausa.com/assets/image/why2.webp', '100% authentique et naturel', 1),
('why_choose_us', 'Naturel & non invasif', '', 'https://www.karmaayurvedausa.com/assets/image/why1.webp', 'Naturel et non invasif', 2),
('why_choose_us', 'Tradition éprouvée', '', 'https://www.karmaayurvedausa.com/assets/image/why3.webp', 'Tradition éprouvée', 3),
('why_choose_us', 'Certifié NABH', '2023 – 2026', 'https://www.karmaayurvedausa.com/assets/image/NABH-Logo.webp', 'Certifié NABH', 4);
