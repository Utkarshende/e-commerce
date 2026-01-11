const productData = [
    {
        name: "Wireless Headphones",
        price: 149.99,
        stock: 25,
        image: "https://picsum.photos/seed/1/600/400",
        category: "Electronics",
        description: "High-quality sound with noise cancellation."
    },
    {
        name: "Smartphone Case",
        price: 29.99,
        stock: 50,
        image: "https://picsum.photos/seed/2/600/400",
        category: "Electronics",
        description: "Durable protective case for most smartphones."
    },
    {
        name: "Running Shoes",
        price: 119.99,
        stock: 20,
        image: "https://picsum.photos/seed/3/600/400",
        category: "Clothing",
        description: "Lightweight shoes designed for comfort and speed."
    },
    {
        name: "Leather Jacket",
        price: 299.99,
        stock: 10,
        image: "https://picsum.photos/seed/4/600/400",
        category: "Clothing",
        description: "Classic leather jacket with a modern fit."
    },
    {
        name: "Fitness Tracker",
        price: 99.99,
        stock: 40,
        image: "https://picsum.photos/seed/5/600/400",
        category: "Electronics",
        description: "Monitor activity, sleep, and heart rate."
    },
    {
        name: "Backpack",
        price: 49.99,
        stock: 35,
        image: "https://picsum.photos/seed/6/600/400",
        category: "Accessories",
        description: "Spacious backpack for daily use and travel."
    },
    {
        name: "Bluetooth Speaker",
        price: 79.99,
        stock: 15,
        image: "https://picsum.photos/seed/7/600/400",
        category: "Electronics",
        description: "Portable speaker with rich bass and long battery."
    },
    {
        name: "Casual T-Shirt",
        price: 19.99,
        stock: 60,
        image: "https://picsum.photos/seed/8/600/400",
        category: "Clothing",
        description: "Comfortable cotton t-shirt for everyday wear."
    },
    {
        name: "Sunglasses",
        price: 69.99,
        stock: 30,
        image: "https://picsum.photos/seed/9/600/400",
        category: "Accessories",
        description: "Stylish sunglasses with UV protection."
    },
    {
        name: "Travel Mug",
        price: 24.99,
        stock: 45,
        image: "https://picsum.photos/seed/10/600/400",
        category: "Kitchen",
        description: "Insulated mug to keep drinks hot or cold."
    },
    {
        name: "Electric Kettle",
        price: 59.99,
        stock: 18,
        image: "https://picsum.photos/seed/11/600/400",
        category: "Home",
        description: "Fast-boiling electric kettle with auto shut-off."
    },
    {
        name: "Yoga Mat",
        price: 39.99,
        stock: 28,
        image: "https://picsum.photos/seed/12/600/400",
        category: "Sports",
        description: "Non-slip yoga mat for all fitness levels."
    },
    {
        name: "Blender",
        price: 89.99,
        stock: 14,
        image: "https://picsum.photos/seed/13/600/400",
        category: "Kitchen",
        description: "Powerful blender for smoothies and sauces."
    },
    {
        name: "Desk Lamp",
        price: 34.99,
        stock: 22,
        image: "https://picsum.photos/seed/14/600/400",
        category: "Home",
        description: "Adjustable LED lamp with brightness settings."
    },
    {
        name: "Coffee Grinder",
        price: 49.99,
        stock: 16,
        image: "https://picsum.photos/seed/15/600/400",
        category: "Kitchen",
        description: "Electric grinder for fresh ground coffee."
    },
    {
        name: "Electric Toothbrush",
        price: 59.99,
        stock: 27,
        image: "https://picsum.photos/seed/16/600/400",
        category: "Beauty",
        description: "Rechargeable toothbrush with multiple modes."
    },
    {
        name: "Gaming Mouse",
        price: 49.99,
        stock: 32,
        image: "https://picsum.photos/seed/17/600/400",
        category: "Electronics",
        description: "High-precision mouse with customizable buttons."
    },
    {
        name: "Mechanical Keyboard",
        price: 129.99,
        stock: 12,
        image: "https://picsum.photos/seed/18/600/400",
        category: "Electronics",
        description: "Durable keyboard with tactile switches."
    },
    {
        name: "Water Bottle",
        price: 22.99,
        stock: 70,
        image: "https://picsum.photos/seed/19/600/400",
        category: "Outdoors",
        description: "Leak-proof bottle for active lifestyles."
    },
    {
        name: "Cookware Set",
        price: 199.99,
        stock: 8,
        image: "https://picsum.photos/seed/20/600/400",
        category: "Kitchen",
        description: "Non-stick cookware set for everyday cooking."
    },
    {
        name: "Office Chair",
        price: 249.99,
        stock: 6,
        image: "https://picsum.photos/seed/21/600/400",
        category: "Home",
        description: "Ergonomic chair with lumbar support."
    },
    {
        name: "Portable Charger",
        price: 39.99,
        stock: 55,
        image: "https://picsum.photos/seed/22/600/400",
        category: "Electronics",
        description: "High-capacity power bank for devices."
    },
    {
        name: "Noise Cancelling Earbuds",
        price: 129.99,
        stock: 20,
        image: "https://picsum.photos/seed/23/600/400",
        category: "Electronics",
        description: "Compact earbuds with active noise canceling."
    },
    {
        name: "Action Camera",
        price: 199.99,
        stock: 9,
        image: "https://picsum.photos/seed/24/600/400",
        category: "Electronics",
        description: "Rugged camera for outdoor adventures."
    },
    {
        name: "Smartwatch",
        price: 229.99,
        stock: 18,
        image: "https://picsum.photos/seed/25/600/400",
        category: "Electronics",
        description: "Feature-rich watch for health and notifications."
    },
    {
        name: "Digital Picture Frame",
        price: 99.99,
        stock: 14,
        image: "https://picsum.photos/seed/26/600/400",
        category: "Home",
        description: "Display photos with a high-resolution screen."
    },
    {
        name: "Electric Scooter",
        price: 499.99,
        stock: 4,
        image: "https://picsum.photos/seed/27/600/400",
        category: "Outdoors",
        description: "Foldable scooter for short commutes."
    },
    {
        name: "Kids Toy Car",
        price: 59.99,
        stock: 40,
        image: "https://picsum.photos/seed/28/600/400",
        category: "Toys",
        description: "Battery-powered ride-on car for children."
    },
    {
        name: "Board Game",
        price: 34.99,
        stock: 48,
        image: "https://picsum.photos/seed/29/600/400",
        category: "Toys",
        description: "Family-friendly strategy board game."
    },
    {
        name: "Cookbook",
        price: 24.99,
        stock: 30,
        image: "https://picsum.photos/seed/30/600/400",
        category: "Books",
        description: "Collection of practical and delicious recipes."
    },
    {
        name: "Ceramic Vase",
        price: 44.99,
        stock: 25,
        image: "https://picsum.photos/seed/31/600/400",
        category: "Home",
        description: "Decorative vase for floral arrangements."
    },
    {
        name: "Throw Blanket",
        price: 39.99,
        stock: 34,
        image: "https://picsum.photos/seed/32/600/400",
        category: "Home",
        description: "Soft and warm blanket for cozy nights."
    },
    {
        name: "Hair Dryer",
        price: 59.99,
        stock: 21,
        image: "https://picsum.photos/seed/33/600/400",
        category: "Beauty",
        description: "Fast-drying hair dryer with multiple heat settings."
    },
    {
        name: "Facial Cleanser",
        price: 19.99,
        stock: 80,
        image: "https://picsum.photos/seed/34/600/400",
        category: "Beauty",
        description: "Gentle cleanser for daily skincare routine."
    },
    {
        name: "Electric Grill",
        price: 129.99,
        stock: 11,
        image: "https://picsum.photos/seed/35/600/400",
        category: "Kitchen",
        description: "Indoor grill for quick and healthy meals."
    },
    {
        name: "Garden Tools Set",
        price: 49.99,
        stock: 26,
        image: "https://picsum.photos/seed/36/600/400",
        category: "Outdoors",
        description: "Durable tools for gardening enthusiasts."
    },
    {
        name: "Hiking Backpack",
        price: 119.99,
        stock: 13,
        image: "https://picsum.photos/seed/37/600/400",
        category: "Outdoors",
        description: "Comfortable pack for day hikes and travel."
    },
    {
        name: "Tent",
        price: 179.99,
        stock: 7,
        image: "https://picsum.photos/seed/38/600/400",
        category: "Outdoors",
        description: "Lightweight tent for 2-3 people."
    },
    {
        name: "Electric Blanket",
        price: 69.99,
        stock: 20,
        image: "https://picsum.photos/seed/39/600/400",
        category: "Home",
        description: "Heated blanket with adjustable temperature."
    },
    {
        name: "Pressure Cooker",
        price: 119.99,
        stock: 9,
        image: "https://picsum.photos/seed/40/600/400",
        category: "Kitchen",
        description: "Multi-function cooker for fast meals."
    },
    {
        name: "Wireless Charger",
        price: 29.99,
        stock: 60,
        image: "https://picsum.photos/seed/41/600/400",
        category: "Electronics",
        description: "Qi-compatible charger for smartphones."
    },
    {
        name: "Laptop Stand",
        price: 39.99,
        stock: 33,
        image: "https://picsum.photos/seed/42/600/400",
        category: "Home",
        description: "Adjustable stand to improve laptop ergonomics."
    },
    {
        name: "USB-C Hub",
        price: 49.99,
        stock: 29,
        image: "https://picsum.photos/seed/43/600/400",
        category: "Electronics",
        description: "Expand laptop ports with multiple connections."
    },
    {
        name: "Photo Printer",
        price: 149.99,
        stock: 10,
        image: "https://picsum.photos/seed/44/600/400",
        category: "Electronics",
        description: "Compact printer for high-quality photos."
    },
    {
        name: "Camping Lantern",
        price: 29.99,
        stock: 46,
        image: "https://picsum.photos/seed/45/600/400",
        category: "Outdoors",
        description: "Bright LED lantern for campsites."
    },
    {
        name: "Running Socks (3-pack)",
        price: 14.99,
        stock: 100,
        image: "https://picsum.photos/seed/46/600/400",
        category: "Clothing",
        description: "Breathable socks designed for runners."
    },
    {
        name: "Dress Shirt",
        price: 49.99,
        stock: 24,
        image: "https://picsum.photos/seed/47/600/400",
        category: "Clothing",
        description: "Crisp shirt suitable for office and events."
    },
    {
        name: "Men's Wallet",
        price: 39.99,
        stock: 44,
        image: "https://picsum.photos/seed/48/600/400",
        category: "Accessories",
        description: "Slim leather wallet with multiple slots."
    },
    {
        name: "Women's Scarf",
        price: 24.99,
        stock: 36,
        image: "https://picsum.photos/seed/49/600/400",
        category: "Accessories",
        description: "Soft scarf for style and warmth."
    },
    {
        name: "Kitchen Knife Set",
        price: 89.99,
        stock: 12,
        image: "https://picsum.photos/seed/50/600/400",
        category: "Kitchen",
        description: "High-quality knives for everyday cooking."
    },
    {
        name: "Smart Light Bulb",
        price: 19.99,
        stock: 85,
        image: "https://picsum.photos/seed/51/600/400",
        category: "Home",
        description: "Color-changing bulb controllable by app."
    },
    {
        name: "Robot Vacuum",
        price: 299.99,
        stock: 5,
        image: "https://picsum.photos/seed/52/600/400",
        category: "Home",
        description: "Automated vacuum for hassle-free cleaning."
    },
    {
        name: "Pet Bed",
        price: 44.99,
        stock: 30,
        image: "https://picsum.photos/seed/53/600/400",
        category: "Home",
        description: "Comfortable bed for small pets."
    },
    {
        name: "Dog Leash",
        price: 19.99,
        stock: 70,
        image: "https://picsum.photos/seed/54/600/400",
        category: "Outdoors",
        description: "Strong leash for daily walks."
    },
    {
        name: "Cat Toy Pack",
        price: 12.99,
        stock: 90,
        image: "https://picsum.photos/seed/55/600/400",
        category: "Toys",
        description: "Interactive toys to keep cats entertained."
    },
    {
        name: "Smart Plug",
        price: 14.99,
        stock: 120,
        image: "https://picsum.photos/seed/56/600/400",
        category: "Home",
        description: "Make appliances smart with remote control."
    },
    {
        name: "Floor Rug",
        price: 129.99,
        stock: 11,
        image: "https://picsum.photos/seed/57/600/400",
        category: "Home",
        description: "Decorative rug to enhance any room."
    },
    {
        name: "Infant Monitor",
        price: 149.99,
        stock: 13,
        image: "https://picsum.photos/seed/58/600/400",
        category: "Home",
        description: "Audio and video monitor for baby safety."
    },
    {
        name: "Wireless Security Camera",
        price: 99.99,
        stock: 17,
        image: "https://picsum.photos/seed/59/600/400",
        category: "Home",
        description: "Keep an eye on your home remotely."
    },
    {
        name: "Photo Album",
        price: 21.99,
        stock: 40,
        image: "https://picsum.photos/seed/60/600/400",
        category: "Books",
        description: "Classic album for printed memories."
    },
    {
        name: "Stationery Set",
        price: 14.99,
        stock: 75,
        image: "https://picsum.photos/seed/61/600/400",
        category: "Home",
        description: "Pens, notebooks and desk accessories."
    },
    {
        name: "Power Drill",
        price: 89.99,
        stock: 20,
        image: "https://picsum.photos/seed/62/600/400",
        category: "Home",
        description: "Cordless drill for DIY projects."
    },
    {
        name: "Toolbox",
        price: 59.99,
        stock: 38,
        image: "https://picsum.photos/seed/63/600/400",
        category: "Home",
        description: "Organize tools for easy access."
    },
    {
        name: "Wireless Earbuds Case",
        price: 12.99,
        stock: 150,
        image: "https://picsum.photos/seed/64/600/400",
        category: "Accessories",
        description: "Protective case for earbuds and small gadgets."
    },
    {
        name: "Portable Projector",
        price: 199.99,
        stock: 7,
        image: "https://picsum.photos/seed/65/600/400",
        category: "Electronics",
        description: "Create a big-screen experience anywhere."
    },
    {
        name: "Electric Wine Opener",
        price: 29.99,
        stock: 50,
        image: "https://picsum.photos/seed/66/600/400",
        category: "Kitchen",
        description: "Open bottles effortlessly with an electric opener."
    },
    {
        name: "Bread Maker",
        price: 159.99,
        stock: 6,
        image: "https://picsum.photos/seed/67/600/400",
        category: "Kitchen",
        description: "Bake fresh bread at home with ease."
    },
    {
        name: "Electric Scooter Helmet",
        price: 59.99,
        stock: 40,
        image: "https://picsum.photos/seed/68/600/400",
        category: "Outdoors",
        description: "Safety helmet with adjustable fit."
    },
    {
        name: "Phone Tripod",
        price: 24.99,
        stock: 55,
        image: "https://picsum.photos/seed/69/600/400",
        category: "Electronics",
        description: "Sturdy tripod for content creation."
    },
    {
        name: " DSLR Camera Bag",
        price: 79.99,
        stock: 18,
        image: "https://picsum.photos/seed/70/600/400",
        category: "Accessories",
        description: "Protective bag for cameras and lenses."
    },
    {
        name: "Sketchbook",
        price: 12.99,
        stock: 130,
        image: "https://picsum.photos/seed/71/600/400",
        category: "Books",
        description: "High-quality paper for sketches and notes."
    },
    {
        name: "Waterproof Jacket",
        price: 89.99,
        stock: 22,
        image: "https://picsum.photos/seed/72/600/400",
        category: "Clothing",
        description: "Lightweight jacket for rainy weather."
    },
    {
        name: "Scented Candle",
        price: 19.99,
        stock: 95,
        image: "https://picsum.photos/seed/73/600/400",
        category: "Home",
        description: "Long-lasting candle with a pleasant aroma."
    },
    {
        name: "Bluetooth Keyboard",
        price: 59.99,
        stock: 26,
        image: "https://picsum.photos/seed/74/600/400",
        category: "Electronics",
        description: "Slim keyboard compatible with multiple devices."
    },
    {
        name: "Protein Powder",
        price: 39.99,
        stock: 60,
        image: "https://picsum.photos/seed/75/600/400",
        category: "Sports",
        description: "High-quality protein for post-workout recovery."
    },
    {
        name: "Foam Roller",
        price: 29.99,
        stock: 44,
        image: "https://picsum.photos/seed/76/600/400",
        category: "Sports",
        description: "Relieve muscle tension with deep tissue massage."
    },
    {
        name: "Electric Shaver",
        price: 79.99,
        stock: 34,
        image: "https://picsum.photos/seed/77/600/400",
        category: "Beauty",
        description: "Close shave with minimal irritation."
    },
    {
        name: "Makeup Kit",
        price: 49.99,
        stock: 40,
        image: "https://picsum.photos/seed/78/600/400",
        category: "Beauty",
        description: "Compact set with essential makeup items."
    },
    {
        name: "Handheld Vacuum",
        price: 59.99,
        stock: 19,
        image: "https://picsum.photos/seed/79/600/400",
        category: "Home",
        description: "Quick cleanups with powerful suction."
    },
    {
        name: "Smart Scale",
        price: 39.99,
        stock: 30,
        image: "https://picsum.photos/seed/80/600/400",
        category: "Electronics",
        description: "Track weight and body metrics via app."
    },
    {
        name: "Guitar Starter Pack",
        price: 129.99,
        stock: 14,
        image: "https://picsum.photos/seed/81/600/400",
        category: "Toys",
        description: "Acoustic guitar with accessories for beginners."
    },
    {
        name: "Wireless HDMI Adapter",
        price: 59.99,
        stock: 25,
        image: "https://picsum.photos/seed/82/600/400",
        category: "Electronics",
        description: "Stream video wirelessly to your TV."
    },
    {
        name: "Bedroom Curtains",
        price: 49.99,
        stock: 29,
        image: "https://picsum.photos/seed/83/600/400",
        category: "Home",
        description: "Block-out curtains for better sleep."
    },
    {
        name: "Kitchen Thermometer",
        price: 19.99,
        stock: 65,
        image: "https://picsum.photos/seed/84/600/400",
        category: "Kitchen",
        description: "Quick-read thermometer for perfect cooking."
    },
    {
        name: "Memory Foam Pillow",
        price: 59.99,
        stock: 23,
        image: "https://picsum.photos/seed/85/600/400",
        category: "Home",
        description: "Supportive pillow for better neck alignment."
    },
    {
        name: "Electric Hand Mixer",
        price: 39.99,
        stock: 27,
        image: "https://picsum.photos/seed/86/600/400",
        category: "Kitchen",
        description: "Mixing tool for baking and cooking."
    },
    {
        name: "Smart Thermostat",
        price: 199.99,
        stock: 8,
        image: "https://picsum.photos/seed/87/600/400",
        category: "Home",
        description: "Save energy with intelligent temperature control."
    },
    {
        name: "LED Strip Lights",
        price: 29.99,
        stock: 70,
        image: "https://picsum.photos/seed/88/600/400",
        category: "Home",
        description: "Colorful lighting to set the mood."
    },
    {
        name: "Portable Monitor",
        price: 169.99,
        stock: 10,
        image: "https://picsum.photos/seed/89/600/400",
        category: "Electronics",
        description: "Secondary screen for productivity on the go."
    },
    {
        name: "Smart Doorbell",
        price: 129.99,
        stock: 12,
        image: "https://picsum.photos/seed/90/600/400",
        category: "Home",
        description: "See visitors remotely with two-way audio."
    },
    {
        name: "Wireless Garden Sprinkler",
        price: 69.99,
        stock: 15,
        image: "https://picsum.photos/seed/91/600/400",
        category: "Outdoors",
        description: "Automate watering for a healthy lawn."
    },
    {
        name: "Stainless Steel BBQ Set",
        price: 49.99,
        stock: 34,
        image: "https://picsum.photos/seed/92/600/400",
        category: "Outdoors",
        description: "Complete grilling tools for summer cookouts."
    },
    {
        name: "Vinyl Records (Pack)",
        price: 39.99,
        stock: 45,
        image: "https://picsum.photos/seed/93/600/400",
        category: "Books",
        description: "Curated selection of classic albums on vinyl."
    },
    {
        name: "Wireless Meat Thermometer",
        price: 49.99,
        stock: 22,
        image: "https://picsum.photos/seed/94/600/400",
        category: "Kitchen",
        description: "Monitor grill temps remotely with precision."
    },
    {
        name: "Indoor Herb Garden Kit",
        price: 34.99,
        stock: 30,
        image: "https://picsum.photos/seed/95/600/400",
        category: "Home",
        description: "Grow fresh herbs year-round in your kitchen."
    },
    {
        name: "Language Learning Book",
        price: 29.99,
        stock: 50,
        image: "https://picsum.photos/seed/96/600/400",
        category: "Books",
        description: "Beginner-friendly guide to learning a new language."
    },
    {
        name: "Puzzle (1000 pieces)",
        price: 24.99,
        stock: 60,
        image: "https://picsum.photos/seed/97/600/400",
        category: "Toys",
        description: "Challenging puzzle for quiet evenings."
    },
    {
        name: "Wall Clock",
        price: 34.99,
        stock: 41,
        image: "https://picsum.photos/seed/98/600/400",
        category: "Home",
        description: "Stylish clock to complement any decor."
    },
    {
        name: "Camping Cookware",
        price: 69.99,
        stock: 16,
        image: "https://picsum.photos/seed/99/600/400",
        category: "Outdoors",
        description: "Lightweight set for outdoor meals."
    },
    {
        name: "Portable Fan",
        price: 19.99,
        stock: 85,
        image: "https://picsum.photos/seed/100/600/400",
        category: "Home",
        description: "Compact fan for personal cooling."
    }
];

module.exports = productData;