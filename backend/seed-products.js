const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Anime / Manga', slug: 'anime', image: '/assets/anime.png' },
  { name: 'Tech & Circuits', slug: 'tech', image: '/assets/tech.png' },
  { name: 'Marvel Universe', slug: 'marvel', image: '/assets/animal.png' },
  { name: 'DC Multiverse', slug: 'dc', image: '/assets/abstract.png' },
  { name: 'Minimal Solid', slug: 'minimal', image: '/assets/floral.png' }
];

const DEVICE_MODELS = [
  'iPhone 15 Pro',
  'iPhone 14 Pro Max',
  'Samsung S24 Ultra',
  'Samsung S23 FE',
  'OnePlus 12',
  'OnePlus Nord 4',
  'Realme GT 6',
  'Xiaomi 14 Ultra'
];

const MATERIALS = ['Glass Case', 'Silicone Case', 'Soft Armor'];

const BASE_TEMPLATES = {
  "anime": [
    { title: "Anime Cyber-Ninja Glass Case", description: "Sleek metallic accents, high-tensile glass backplanes, and shock-absorbent TPU bumpers tailored for future-proof protection.", image: "/assets/anime.png" },
    { title: "Goku Ultra Instinct Glass Case", description: "Vibrant sublimation print featuring Goku in master state with shockproof bumper protection.", image: "/assets/anime.png" },
    { title: "Sharingan Cyber Eye Cover", description: "Minimalist red eye design on a matte finish backplate.", image: "/assets/anime.png" },
    { title: "Demon Slayer Tanjiro Armor", description: "Green checkered pattern with double-tempered premium glass protection.", image: "/assets/anime.png" },
    { title: "One Piece Straw Hat Emblem Case", description: "Pirate king crest on premium carbon fiber texture.", image: "/assets/anime.png" },
    { title: "Attack on Titan Scout Regiment Case", description: "Wings of freedom motif printed with scratch-resistant coating.", image: "/assets/anime.png" },
    { title: "Jujutsu Kaisen Gojo Domain Expansion", description: "Infinite void design with high-gloss premium look.", image: "/assets/anime.png" },
    { title: "Naruto Sage Mode Case", description: "Vibrant orange and yellow sunset sage scroll case.", image: "/assets/anime.png" },
    { title: "Neon Tokyo Mecha Unit", description: "Cyber-mech design inspired by iconic neon cities.", image: "/assets/anime.png" },
    { title: "Hunter x Hunter Gon Rage Edition", description: "Intense shadow sketch design featuring Gon Freecss dark aura.", image: "/assets/anime.png" }
  ],
  "tech": [
    { title: "Cyberpunk Tech Circuits Case", description: "Futuristic neon traces matching cybernetic hardware styles.", image: "/assets/tech.png" },
    { title: "Matrix Code Fall Case", description: "Digital green rain cyber-matrix stream design.", image: "/assets/tech.png" },
    { title: "Carbon Fiber Exo-Shield", description: "Highly textured military-grade carbon fiber styling.", image: "/assets/tech.png" },
    { title: "Holographic Circuit Armor", description: "Shift colors at different angles with premium tech lines.", image: "/assets/tech.png" },
    { title: "Stealth Black PCB Panel", description: "Matte black PCB pattern with subtle golden solder accents.", image: "/assets/tech.png" },
    { title: "Quantum Grid Blueprint Case", description: "Mathematical blueprint vector grids for tech enthusiasts.", image: "/assets/tech.png" },
    { title: "Glow-in-Dark Flux Capacitor", description: "Luminescent core charge style protective cover.", image: "/assets/tech.png" },
    { title: "Industrial Cyber Mesh", description: "Hexagonal mesh prints mimicking advanced aircraft framing.", image: "/assets/tech.png" },
    { title: "Retro Synthwave Grid Shell", description: "Vibrant neon pink and purple sunset grid landscape.", image: "/assets/tech.png" },
    { title: "Binary Terminal Command Case", description: "Classic hacker green terminal lines of source code.", image: "/assets/tech.png" }
  ],
  "marvel": [
    { title: "Iron Man Arc Reactor Armor", description: "Tony Stark reactor core glow printed on premium tempered glass.", image: "/assets/animal.png" },
    { title: "Captain America Vibranium Shield", description: "Classic star shield styling with battle-worn textures.", image: "/assets/animal.png" },
    { title: "Spider-Man Web-Slinger Case", description: "Classic red and blue suit textures with elevated web lines.", image: "/assets/animal.png" },
    { title: "Thor Mjolnir Lightning Case", description: "Crackling blue lightning surrounding the hammer of Thor.", image: "/assets/animal.png" },
    { title: "Wakanda Forever Panther Mask", description: "Subtle metallic black-purple pattern inspired by Vibranium armor.", image: "/assets/animal.png" },
    { title: "Deadpool Merc-with-Mouth Mask", description: "Fun textured red design with dual sword backplates.", image: "/assets/animal.png" },
    { title: "Wolverine Slash Marks Cover", description: "Vibrant yellow background with carbon metal claw gashes.", image: "/assets/animal.png" },
    { title: "Loki God of Mischief Helmet", description: "Deep green backplate with royal gold horns printing.", image: "/assets/animal.png" },
    { title: "Doctor Strange Eye of Agamotto", description: "Mystical green time stone mandala print.", image: "/assets/animal.png" },
    { title: "Venom Symbiote Fusion Case", description: "Half-mask black sludge print emerging on a white background.", image: "/assets/animal.png" }
  ],
  "dc": [
    { title: "Batman Dark Knight Emblem", description: "Sleek matte-black bat symbol with carbon fiber backdrop.", image: "/assets/abstract.png" },
    { title: "Superman House of El Shield", description: "Bold crimson and gold hope emblem on a royal blue texture.", image: "/assets/abstract.png" },
    { title: "Wonder Woman Tiara Crest", description: "Elegant golden armor plates with red-blue stars highlights.", image: "/assets/abstract.png" },
    { title: "The Flash Speedforce Wave", description: "Lightning bolt trailing across a hyper-velocity scarlet background.", image: "/assets/abstract.png" },
    { title: "Joker Ha-Ha Collage Cover", description: "Mischievous green text overlay and comic-book style sketches.", image: "/assets/abstract.png" },
    { title: "Harley Quinn Diamond Print", description: "Split pink-blue diamonds pattern with graffiti details.", image: "/assets/abstract.png" },
    { title: "Green Lantern Power Ring", description: "Glowing emerald central insignia on a dark space grid.", image: "/assets/abstract.png" },
    { title: "Aquaman Atlantean Scales Case", description: "Golden armor scales pattern offset with marine turquoise.", image: "/assets/abstract.png" },
    { title: "Cyborg Cybernetic Frame", description: "Brushed steel and red laser light design for military protection.", image: "/assets/abstract.png" },
    { title: "Lex Luthor LexCorp Tech Shell", description: "Clean corporate layout with light green accents and custom steel styling.", image: "/assets/abstract.png" }
  ],
  "minimal": [
    { title: "Matte Obsidian Black Shell", description: "Ultra-thin sleek black cover for minimalist styling.", image: "/assets/floral.png" },
    { title: "Nordic Cream Sand Cover", description: "Soft warm earth tone with a smooth fingerprint-resistant surface.", image: "/assets/floral.png" },
    { title: "Sage Green Leaf Minimal", description: "Understated calming sage tones that match any accessory.", image: "/assets/floral.png" },
    { title: "Midnight Indigo Blue Armor", description: "Deep ocean blue shade looking premium and professional.", image: "/assets/floral.png" },
    { title: "Cherry Wine Premium Solid", description: "Dark burgundy shade with high contrast tactile buttons.", image: "/assets/floral.png" },
    { title: "Pastel Lilac Blossom", description: "Charming light purple shade with anti-dust surface coating.", image: "/assets/floral.png" },
    { title: "Terracotta Clay Case", description: "Warm rust hue offering a clean and modern design statement.", image: "/assets/floral.png" },
    { title: "Smokey Quartz Gray Cover", description: "Neutral modern dark gray colorway for corporate styles.", image: "/assets/floral.png" },
    { title: "Alpine White Classic Case", description: "Bright pure white casing featuring standard anti-yellowing attributes.", image: "/assets/floral.png" },
    { title: "Soft Lavender Whisper Case", description: "Soothing muted purple finish offering high-tactility protection.", image: "/assets/floral.png" }
  ]
};

async function main() {
  console.log('Starting Database Seed for 200 Products...');

  // Create categories
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const dbCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, image: cat.image },
      create: { name: cat.name, slug: cat.slug, image: cat.image }
    });
    categoryMap[cat.slug] = dbCat.id;
    console.log(`Upserted category: ${dbCat.name}`);
  }

  // Create 40 products per category
  let productCount = 0;
  for (const slug of Object.keys(BASE_TEMPLATES)) {
    const categoryId = categoryMap[slug];
    const templates = BASE_TEMPLATES[slug];

    for (let i = 0; i < 40; i++) {
      const template = templates[i % templates.length];
      const index = i + 1;
      const price = 299 + (i % 5) * 50;
      const salePrice = price + 200;
      const rating = parseFloat((4.5 + (i % 6) * 0.1).toFixed(1));
      const stock = Math.floor(Math.random() * 50) + 10;

      const devices = [...DEVICE_MODELS].sort(() => 0.5 - Math.random()).slice(0, 4);

      await prisma.product.create({
        data: {
          title: `${template.title} v${index}`,
          description: `${template.description} (Special edition variation #${index})`,
          price: price,
          salePrice: salePrice,
          images: [template.image],
          stock: stock,
          rating: rating,
          deviceModels: devices,
          materials: MATERIALS,
          categoryId: categoryId
        }
      });
      productCount++;
    }
  }

  // Seed the specialized products
  console.log('Seeding custom products (Mystery Pouch & BMW M Sport Cover)...');

  // Ensure minimal category exists or map it
  const minimalCategory = await prisma.category.findUnique({ where: { slug: 'minimal' } });
  const minimalCategoryId = minimalCategory ? minimalCategory.id : categoryMap['minimal'];

  const techCategory = await prisma.category.findUnique({ where: { slug: 'tech' } });
  const techCategoryId = techCategory ? techCategory.id : categoryMap['tech'];

  if (minimalCategoryId) {
    await prisma.product.upsert({
      where: { id: 'mystery-pouch' },
      update: {
        title: 'Mystery Pouch',
        description: 'You choose the device. We choose the surprise. This is an experimental mystery concept. You will receive a random pouch/case designed specially for your selected device. Each pouch is curated from our premium collections, including anime, minimalist, and leather-finish series.',
        price: 299,
        salePrice: 799,
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC9BB-466fZwfzCOrumMo-YoXW4XKm7bKIHV12-6XblT8odf3rU8CyWIMud-Od3fuyHwvJPCxD4S5GqTOHSyLq0tFVNGYs_ebD4UQwxXZAa09rFJyIKQGvoc2CkRYohXeQAsJtka513IkCdLWNoe1djjvwqKbcfoVUCSBgux3kAQBbKBWmjNymGzx1SFhbWbnYlpFyxHhOXpRv-iET0r1MUZ6UTuHL0XP7ZmucJ1Sog1E_itwT-n0Zto0eseQYm_gjRNM-kYKhd1GQ'],
        stock: 100,
        deviceModels: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 14 Plus", "iPhone 13", "Samsung S24 Ultra", "Samsung S23 FE", "OnePlus 12"],
        materials: ["Mystery Glass Case", "Mystery Silicone Case", "Mystery Soft Armor"],
        rating: 4.8,
        categoryId: minimalCategoryId
      },
      create: {
        id: 'mystery-pouch',
        title: 'Mystery Pouch',
        description: 'You choose the device. We choose the surprise. This is an experimental mystery concept. You will receive a random pouch/case designed specially for your selected device. Each pouch is curated from our premium collections, including anime, minimalist, and leather-finish series.',
        price: 299,
        salePrice: 799,
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC9BB-466fZwfzCOrumMo-YoXW4XKm7bKIHV12-6XblT8odf3rU8CyWIMud-Od3fuyHwvJPCxD4S5GqTOHSyLq0tFVNGYs_ebD4UQwxXZAa09rFJyIKQGvoc2CkRYohXeQAsJtka513IkCdLWNoe1djjvwqKbcfoVUCSBgux3kAQBbKBWmjNymGzx1SFhbWbnYlpFyxHhOXpRv-iET0r1MUZ6UTuHL0XP7ZmucJ1Sog1E_itwT-n0Zto0eseQYm_gjRNM-kYKhd1GQ'],
        stock: 100,
        deviceModels: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 14 Plus", "iPhone 13", "Samsung S24 Ultra", "Samsung S23 FE", "OnePlus 12"],
        materials: ["Mystery Glass Case", "Mystery Silicone Case", "Mystery Soft Armor"],
        rating: 4.8,
        categoryId: minimalCategoryId
      }
    });
    productCount++;
  }

  if (techCategoryId) {
    await prisma.product.upsert({
      where: { id: 'bmw-m-sport-racing-glass' },
      update: {
        title: 'BMW M Sport Racing Glass Mobile Cover',
        description: 'BMW M Sport Racing Glass Mobile Cover – Premium Printed Car Design. High quality printed design on a premium double-tempered glass backplate with shock-absorbing TPU bumpers.',
        price: 299,
        salePrice: 799,
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuA2ZMEy8RXBayMfa0j-l8hiv0TKqo2Y3xfKY1KamdEnx8r55wBc10U79aAO-sBsnrWAT8HWYgFqcqiI5cIPfzys5BYxzakvlZke_WMJjYGEH-zy-am75TB-UFm3D4N80UpzeQ4_n2k6PX8mHgzVcD8x_0os8_QAP7AbukPJvDO2scTQs2tdFNpGOy9dpa-zJeFsaK7uiweYSlToUnd_N0wnMbYYbMAsk7qwEl_yxJEU13OUbjv30t827y_P_LeUhJbIUxXm0UGowxo'],
        stock: 50,
        deviceModels: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 14 Plus", "iPhone 13", "Samsung S24 Ultra", "Samsung S23 FE", "OnePlus 12"],
        materials: ["Glass Case"],
        rating: 5.0,
        categoryId: techCategoryId
      },
      create: {
        id: 'bmw-m-sport-racing-glass',
        title: 'BMW M Sport Racing Glass Mobile Cover',
        description: 'BMW M Sport Racing Glass Mobile Cover – Premium Printed Car Design. High quality printed design on a premium double-tempered glass backplate with shock-absorbing TPU bumpers.',
        price: 299,
        salePrice: 799,
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuA2ZMEy8RXBayMfa0j-l8hiv0TKqo2Y3xfKY1KamdEnx8r55wBc10U79aAO-sBsnrWAT8HWYgFqcqiI5cIPfzys5BYxzakvlZke_WMJjYGEH-zy-am75TB-UFm3D4N80UpzeQ4_n2k6PX8mHgzVcD8x_0os8_QAP7AbukPJvDO2scTQs2tdFNpGOy9dpa-zJeFsaK7uiweYSlToUnd_N0wnMbYYbMAsk7qwEl_yxJEU13OUbjv30t827y_P_LeUhJbIUxXm0UGowxo'],
        stock: 50,
        deviceModels: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 14 Plus", "iPhone 13", "Samsung S24 Ultra", "Samsung S23 FE", "OnePlus 12"],
        materials: ["Glass Case"],
        rating: 5.0,
        categoryId: techCategoryId
      }
    });
    productCount++;
  }

  console.log(`Successfully seeded all ${productCount} products into PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
