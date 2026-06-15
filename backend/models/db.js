const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

let prisma;
let databaseConnected = false;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV !== 'production') {
  console.warn('[SECURITY WARNING] JWT_SECRET is not set. Using weak dev default — NEVER use in production.');
}
const _JWT_SECRET = JWT_SECRET || 'dev_only_weak_secret_do_not_use_in_prod';

const getPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
};

const connectDatabase = async () => {
  const client = getPrismaClient();
  if (!client) {
    const error = new Error('Prisma client is unavailable because DATABASE_URL is not configured.');
    console.error(error.message);
    throw error;
  }

  if (!databaseConnected) {
    await client.$connect();
    databaseConnected = true;
    console.info('Database connection established successfully.');
  }

  return client;
};

const BASE_TEMPLATES = {
  "cat-anime": [
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
  "cat-tech": [
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
  "cat-marvel": [
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
  "cat-dc": [
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
  "cat-minimal": [
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

let fallbackProducts = [];
Object.keys(BASE_TEMPLATES).forEach(catId => {
  const templates = BASE_TEMPLATES[catId];
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i % templates.length];
    const index = i + 1;
    const variationTitle = `${template.title} v${index}`;
    const price = 299 + (i % 5) * 50;
    const salePrice = price + 200;
    const rating = +(4.5 + (i % 6) * 0.1).toFixed(1);

    fallbackProducts.push({
      id: `prod-${catId}-${index}`,
      title: variationTitle,
      description: `${template.description} (Special edition variation #${index})`,
      price: price,
      salePrice: salePrice,
      images: [template.image],
      stock: 10 + (i % 10) * 5,
      deviceModels: ["iPhone 15 Pro", "iPhone 14 Pro Max", "Samsung S24 Ultra", "OnePlus 12"],
      materials: ["Glass Case", "Silicone Case", "Soft Armor"],
      rating: rating,
      categoryId: catId
    });
  }
});

fallbackProducts.push({
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
  categoryId: 'cat-minimal'
});

fallbackProducts.push({
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
  categoryId: 'cat-tech'
});


let fallbackCategories = [
  { id: "cat-anime", name: "Anime / Manga", slug: "anime", image: "/assets/anime.png" },
  { id: "cat-tech", name: "Tech & Circuits", slug: "tech", image: "/assets/tech.png" },
  { id: "cat-marvel", name: "Marvel Universe", slug: "marvel", image: "/assets/animal.png" },
  { id: "cat-dc", name: "DC Multiverse", slug: "dc", image: "/assets/abstract.png" },
  { id: "cat-minimal", name: "Minimal Solid", slug: "minimal", image: "/assets/floral.png" }
];

let fallbackOrders = [];
let fallbackUsers = [
  // NOTE: No hardcoded credentials. Admin users must be created via DB seed or Supabase dashboard.
  // For local dev, run: node seed-products.js to seed initial data.
];

let fallbackAddresses = [
  { id: 'addr-1', fullName: 'Ramesh Kumar', phone: '9999888877', email: 'ramesh@example.com', addressLine: '12, Nehru Place', landmark: 'Near Metro Station', city: 'New Delhi', state: 'Delhi', postalCode: '110019' }
];

let fallbackBanners = [
  { id: 'banner-1', title: 'Cyberpunk Circuits Pro', image: '/assets/tech.png' },
  { id: 'banner-2', title: 'Anime Shinobi Armor', image: '/assets/anime.png' },
  { id: 'banner-3', title: 'Aesthetic Marble Flow', image: '/assets/abstract.png' }
];

let fallbackReviews = [
  {
    id: "rev-1",
    rating: 5,
    comment: "The glass case print is stunning. The glossy back looks premium and doesn't get scratched at all. Will definitely buy more!",
    reviewerName: "Aarav K.",
    productId: "prod-1",
    image: null,
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rev-2",
    rating: 5,
    comment: "Created a personalized custom case with my design, and the online canvas preview is extremely accurate. Perfect print alignment.",
    reviewerName: "Neha S.",
    productId: "prod-2",
    image: null,
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rev-3",
    rating: 5,
    comment: "Superb shock absorption TPU border bumpers. Dropped my iPhone twice from shoulder height, not a single dent on my device!",
    reviewerName: "Rahul J.",
    productId: "prod-3",
    image: null,
    isApproved: true,
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  prisma,
  connectDatabase,
  JWT_SECRET: _JWT_SECRET,
  fallbackProducts,
  fallbackCategories,
  fallbackOrders,
  fallbackUsers,
  fallbackAddresses,
  fallbackBanners,
  fallbackReviews
};
