const productsData = [
  // --- SIGNATURE CATEGORY ---
  {
    name: "Aurelius Chronograph",
    description: "Hand-assembled timepiece with a 24k gold bezel and sapphire crystal face.",
    price: 1250.00,
    category: "Signature",
    image: "https://picsum.photos/seed/aurelius-chronograph/900/1100",
    stock: 5
  },
  {
    name: "Noir Leather Weekender",
    description: "Italian full-grain leather travel bag with brushed steel hardware.",
    price: 890.00,
    category: "Signature",
    image: "https://picsum.photos/seed/noir-weekender/900/1100",
    stock: 8
  },

  // --- ESSENTIALS CATEGORY ---
  {
    name: "Minimalist Silk Scarf",
    description: "100% mulberry silk scarf featuring a hand-rolled hem and neutral tones.",
    price: 120.00,
    category: "Essentials",
    image: "https://picsum.photos/seed/minimalist-scarf/900/1100",
    stock: 25
  },
  {
    name: "Amber & Cedar Parfum",
    description: "A warm, woody fragrance notes of aged cedar and golden amber resin.",
    price: 195.00,
    category: "Essentials",
    image: "https://picsum.photos/seed/amber-cedar-parfum/900/1100",
    stock: 15
  },

  // --- LIMITED CATEGORY ---
  {
    name: "Obsidian Fountain Pen",
    description: "Limited run of 50. Carved from volcanic glass with a rhodium-plated nib.",
    price: 450.00,
    category: "Limited",
    image: "https://picsum.photos/seed/obsidian-pen/900/1100",
    stock: 3
  },
  {
    name: "Gold Leaf Notebook",
    description: "Acid-free vellum paper with genuine gold leaf edges and linen binding.",
    price: 85.00,
    category: "Limited",
    image: "https://picsum.photos/seed/gold-leaf-notebook/900/1100",
    stock: 12
  }
  ,
  {
    name: "Monochrome Knit Sweater",
    description: "Soft cashmere blend with a relaxed fit—everyday luxury.",
    price: 165.00,
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
    stock: 30
  },
  {
    name: "Sable Verge Sunglasses",
    description: "UV400 polarized lenses with a lightweight titanium frame.",
    price: 220.00,
    category: "Signature",
    image: "https://images.unsplash.com/photo-1518546305920-8d21c8b9d9d4?q=80&w=1000&auto=format&fit=crop",
    stock: 18
  },
  {
    name: "Ceramic Pour-Over Set",
    description: "Artisan ceramic dripper and server — hand-glazed finish.",
    price: 95.00,
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop",
    stock: 40
  },
  {
    name: "Midnight Leather Gloves",
    description: "Soft lambskin gloves with cashmere lining for colder months.",
    price: 120.00,
    category: "Limited",
    image: "https://images.unsplash.com/photo-1541099649105-4f5f0b8cb5b1?q=80&w=1000&auto=format&fit=crop",
    stock: 7
  },
  {
    name: "Atlas Travel Mug",
    description: "Double-walled steel mug keeps beverages hot for hours.",
    price: 45.00,
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1567016432779-7a2a4f3a9f8e?q=80&w=1000&auto=format&fit=crop",
    stock: 60
  },
  {
    name: "Velvet Box Cufflinks",
    description: "Engineered brass cufflinks plated in ruthenium with velvet box.",
    price: 75.00,
    category: "Signature",
    image: "https://images.unsplash.com/photo-1521068803979-2c5825e7e52d?q=80&w=1000&auto=format&fit=crop",
    stock: 22
  }
];

module.exports = productsData;