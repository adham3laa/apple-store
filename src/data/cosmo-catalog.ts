export type ProductCategory = 'all' | 'iphones' | 'macbooks' | 'airpods' | 'watches' | 'accessories';

export interface ProductFinishes {
  id: string
  name: string
  colorCode: string
  heroImage: string
  editorialDescription: string
  stockCount?: number // Units available in this specific color
}

export interface SpecCategory {
  title: string
  specs: { label: string; value: string }[]
}

export interface CosmoProduct {
  id: string
  slug: string
  title: string
  curatorialSubtitle: string
  category: 'iphones' | 'macbooks' | 'airpods' | 'watches' | 'accessories'
  era: string
  designerNote: string
  basePrice: number
  currency: string
  material: string
  dimensions: string
  weight: string
  primaryImage: string
  secondaryImage: string
  galleryImages: {
    url: string
    caption: string
    plateNumber: string
  }[]
  specHighlights: string[]
  technicalDossier: SpecCategory[]
  finishes?: ProductFinishes[]
  capacities?: { size: string; priceDelta: number }[]
  condition?: string
  provenance?: string
  inStock: boolean
  stockQuantity?: number // Total units across all colors
  totalAllocated?: number // Total capacity/allocation
}

export interface CategoryInfo {
  id: ProductCategory
  label: string
  thumbnail: string
}

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'all',
    label: 'All Devices',
    thumbnail: '/devices/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium.png'
  },
  {
    id: 'iphones',
    label: 'iPhones',
    thumbnail: '/devices/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium.png'
  },
  {
    id: 'macbooks',
    label: 'MacBooks',
    thumbnail: '/devices/mbp14-spaceblack-select-202410.png'
  },
  {
    id: 'airpods',
    label: 'AirPods',
    thumbnail: '/devices/airpods-max-select-202409-starlight.png'
  },
  {
    id: 'watches',
    label: 'Watches',
    thumbnail: '/devices/watch-card-40-ultra2-202409.png'
  },
  {
    id: 'accessories',
    label: 'Accessories',
    thumbnail: '/devices/MK0U3.png'
  }
];

export const COSMO_CATALOG: CosmoProduct[] = [
  // 1. iPhone 16 Pro
  {
    id: "iphone-16-pro",
    slug: "iphone-16-pro-titanium",
    title: "iPhone 16 Pro",
    curatorialSubtitle: "Sculpted in Grade 5 Titanium. A monolith of micro-blasted aerospace metallurgy and silicon precision.",
    category: "iphones",
    era: "COLLECTION 2026 // PRO MONOLITH",
    designerNote: "The thinnest display borders ever engineered on an Apple canvas. Precision micro-blasted Grade 5 titanium frame bonded to an internal aluminum substructure through solid-state diffusion.",
    basePrice: 999,
    currency: "USD",
    material: "Grade 5 Titanium (Ti-6Al-4V) & Textured Matte Glass",
    dimensions: "149.6 × 71.5 × 8.25 mm",
    weight: "199 grams",
    primaryImage: "/devices/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium.png",
    secondaryImage: "/devices/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium.png",
    galleryImages: [
      {
        url: "/devices/iphone-16-pro-model-unselect-gallery-1-202409.png",
        caption: "Super Retina XDR Display // Borderless OLED with Dynamic Island & Ceramic Shield",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/iphone-16-pro-model-unselect-gallery-2-202409.png",
        caption: "Grade 5 Titanium Profile // Tactile Force-Sensitive Camera Control & Action Button",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium.png",
        caption: "Natural Titanium Finish // Crystalline Satin Luster with Textured Matte Glass",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/iphone-16-pro-finish-select-202409-6-3inch-whitetitanium.png",
        caption: "White Titanium Ceramic Plate // High-Purity Micro-Blasted Chassis",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Apple A18 Pro Silicon // Second-Gen 3nm Transistor Architecture",
      "Grade 5 Titanium Enclosure // Micro-blasted Finish with 100% Recycled Aluminum Core",
      "48MP Fusion Camera Array // 4K 120 fps Dolby Vision & 5x Optical Telephoto",
      "Capacitive Force-Sensitive Camera Control Button with Sapphire Crystal Cap"
    ],
    technicalDossier: [
      {
        title: "COMPUTATIONAL SILICON",
        specs: [
          { label: "Processor", value: "Apple A18 Pro SoC (Second-Generation 3nm Lithography)" },
          { label: "CPU Architecture", value: "6-core CPU with 2 performance cores and 4 efficiency cores" },
          { label: "GPU Architecture", value: "6-core GPU with hardware-accelerated ray tracing & mesh shading" },
          { label: "Neural Engine", value: "16-core NPU delivering 35 trillion operations per second (TOPS)" },
          { label: "Apple Intelligence", value: "On-device LLM inference paired with Private Cloud Compute" }
        ]
      },
      {
        title: "OPTICAL ARCHITECTURE & SENSORS",
        specs: [
          { label: "Primary Fusion Lens", value: "48MP Fusion (24mm, ƒ/1.78 aperture, 2.44µm quad-pixel, sensor-shift OIS)" },
          { label: "Ultra Wide Lens", value: "48MP Ultra Wide (13mm, ƒ/2.2 aperture, 120° field of view, hybrid focus pixels)" },
          { label: "Telephoto Optical Array", value: "12MP 5x Telephoto (120mm, ƒ/2.8 aperture, 3D sensor-shift tetraprism OIS)" },
          { label: "Cinematic Video Capture", value: "4K Dolby Vision video recording at 120 fps, 60 fps, 30 fps, and 24 fps" },
          { label: "Audio Capture Array", value: "Studio-quality four-mic array with Spatial Audio and Audio Mix studio mode" }
        ]
      },
      {
        title: "DISPLAY & RETINA ENGINE",
        specs: [
          { label: "Display Canvas", value: "6.3-inch Super Retina XDR all-screen OLED display" },
          { label: "Resolution & Density", value: "2622 × 1206 pixel resolution at 460 ppi" },
          { label: "ProMotion Dynamic Refresh", value: "Adaptive refresh rates from 1Hz to 120Hz for seamless efficiency" },
          { label: "Luminance Calibration", value: "2,000 nits peak outdoor, 1,600 nits peak HDR, 1 nit minimum night mode" },
          { label: "Glass Metallurgy", value: "Latest-generation Ceramic Shield front, 2x tougher than any smartphone glass" }
        ]
      },
      {
        title: "METALLURGY, PORTS & ENERGY",
        specs: [
          { label: "Structural Alloy", value: "Grade 5 Titanium (Ti-6Al-4V) bonded via solid-state diffusion to aluminum" },
          { label: "Port Controller", value: "USB-C with USB 3 support for blazing data transfer speeds up to 10 Gb/s" },
          { label: "Battery Endurance", value: "Up to 27 hours video playback, 85 hours audio playback" },
          { label: "Wireless Induction", value: "MagSafe wireless charging up to 25W with 30W power adapter or higher" },
          { label: "Environmental Rating", value: "Rated IP68 (maximum depth of 6 meters up to 30 minutes) under IEC 60529" }
        ]
      }
    ],
    finishes: [
      {
        id: "desert",
        name: "Desert Titanium (Gold)",
        colorCode: "#CBB69D",
        heroImage: "/devices/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium.png",
        editorialDescription: "Warm architectural golden bronze undertones evoking raw quartz under golden hour lighting."
      },
      {
        id: "black",
        name: "Black Titanium",
        colorCode: "#262626",
        heroImage: "/devices/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium.png",
        editorialDescription: "Physical vapor deposition treatment resulting in a deep, light-absorbing obsidian finish."
      },
      {
        id: "white",
        name: "White Titanium",
        colorCode: "#EDEAE5",
        heroImage: "/devices/iphone-16-pro-finish-select-202409-6-3inch-whitetitanium.png",
        editorialDescription: "Stark alabaster textured matte back glass with silver titanium satin rails."
      },
      {
        id: "natural",
        name: "Natural Titanium",
        colorCode: "#C4BFB6",
        heroImage: "/devices/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium.png",
        editorialDescription: "Unadorned raw titanium alloy celebrating the crystalline luster of aerospace metal."
      }
    ],
    capacities: [
      { size: "128 GB", priceDelta: 0 },
      { size: "256 GB", priceDelta: 100 },
      { size: "512 GB", priceDelta: 300 },
      { size: "1 TB", priceDelta: 500 }
    ],
    inStock: true
  },

  // 2. iPhone 16
  {
    id: "iphone-16",
    slug: "iphone-16",
    title: "iPhone 16",
    curatorialSubtitle: "Saturated color-infused back glass with aerospace-grade aluminum contours.",
    category: "iphones",
    era: "COLLECTION 2026 // COLOR INFUSED",
    designerNote: "Built with color-infused back glass formulated with custom micro-crystals. Dual vertical camera array engineered specifically for Spatial Video capture.",
    basePrice: 799,
    currency: "USD",
    material: "Color-Infused Back Glass & Aerospace Aluminum",
    dimensions: "147.6 × 71.6 × 7.80 mm",
    weight: "170 grams",
    primaryImage: "/devices/iphone-16-finish-select-202409-6-1inch-ultramarine.png",
    secondaryImage: "/devices/iphone-16-finish-select-202409-6-1inch-teal.png",
    galleryImages: [
      {
        url: "/devices/iphone-16-model-unselect-gallery-1-202409.png",
        caption: "Dynamic Island Display // 2,000 Nits Outdoor Peak Brightness with Ceramic Shield",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/iphone-16-model-unselect-gallery-2-202409.png",
        caption: "Vertical Dual Fusion Optics // Spatial Video Recording for Apple Vision Pro",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/iphone-16-finish-select-202409-6-1inch-teal.png",
        caption: "Teal Anodized Alchemy // Color-Infused Matte Glass with Matching Rail",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/iphone-16-finish-select-202409-6-1inch-pink.png",
        caption: "Pink Formulation // Rich Pigment Density Embedded in Rear Substrate",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Apple A18 Silicon // Built from the ground up for Apple Intelligence",
      "Camera Control // Instant tactile capacitive sensor for optical zoom and exposure",
      "48MP Fusion 2-in-1 Lens // Optical-Quality 2x Telephoto via Quad-Pixel Crop",
      "Action Button for bespoke personal macros and workflow triggers"
    ],
    technicalDossier: [
      {
        title: "CORE HARDWARE & SILICON",
        specs: [
          { label: "SoC Architecture", value: "Apple A18 (Second-generation 3nm fabrication node)" },
          { label: "CPU Cores", value: "6-core CPU with 2 performance and 4 efficiency cores" },
          { label: "GPU Cores", value: "5-core GPU with hardware-accelerated ray tracing" },
          { label: "Neural Engine", value: "16-core NPU delivering 35 TOPS for local foundation models" }
        ]
      },
      {
        title: "OPTICAL CALIBRATION",
        specs: [
          { label: "Fusion Camera", value: "48MP Fusion (26mm, ƒ/1.6, sensor-shift optical image stabilization)" },
          { label: "Ultra Wide Macro", value: "12MP Ultra Wide (13mm, ƒ/2.2, autofocus macro photography)" },
          { label: "Spatial Capture", value: "Spatial video and photo capture calibrated for Apple Vision Pro" },
          { label: "Optical Zoom Range", value: ".5x, 1x, 2x optical zoom quality" }
        ]
      },
      {
        title: "DISPLAY & CHASSIS METRICS",
        specs: [
          { label: "Screen Canvas", value: "6.1-inch Super Retina XDR OLED (2556 × 1179 at 460 ppi)" },
          { label: "Peak Luminance", value: "2000 nits outdoor peak, 1 nit minimum for comfortable dark reading" },
          { label: "Enclosure Material", value: "Aerospace-grade aluminum enclosure with color-infused back glass" },
          { label: "Battery Endurance", value: "Up to 22 hours video playback, fast charge to 50% in 30 minutes" }
        ]
      }
    ],
    finishes: [
      {
        id: "ultramarine",
        name: "Ultramarine",
        colorCode: "#3E5788",
        heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-ultramarine.png",
        editorialDescription: "Vibrant deep lapis lazuli pigment suspended in satin-finished rear glass."
      },
      {
        id: "teal",
        name: "Teal",
        colorCode: "#7A9E9F",
        heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-teal.png",
        editorialDescription: "Soft ocean patina tone paired with bead-blasted aluminum side rails."
      },
      {
        id: "pink",
        name: "Pink",
        colorCode: "#D88B9E",
        heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-pink.png",
        editorialDescription: "Rich coral berry blush formulated with custom glass pigments."
      },
      {
        id: "black",
        name: "Black",
        colorCode: "#272729",
        heroImage: "/devices/iphone-16-finish-select-202409-6-1inch-black.png",
        editorialDescription: "Stealth matte carbon black rear glass with color-matched rails."
      }
    ],
    capacities: [
      { size: "128 GB", priceDelta: 0 },
      { size: "256 GB", priceDelta: 100 },
      { size: "512 GB", priceDelta: 300 }
    ],
    inStock: true
  },

  // 3. MacBook Pro 16″ M4 Max
  {
    id: "macbook-pro-m4-max",
    slug: "macbook-pro-space-black",
    title: "MacBook Pro 16″ M4 Max",
    curatorialSubtitle: "An uncompromising slab of continuous anodized aluminum. Light-absorbing Space Black.",
    category: "macbooks",
    era: "COLLECTION 2026 // ATELIER COMPUTING",
    designerNote: "Engineered with a breakthrough chemistry forming an anodization seal that drastically reduces fingerprints. Liquid Retina XDR with 1,600 nits peak luminance and Thunderbolt 5.",
    basePrice: 3499,
    currency: "USD",
    material: "100% Recycled Custom Anodized Aluminum",
    dimensions: "355.7 × 248.1 × 16.8 mm",
    weight: "2.16 kg",
    primaryImage: "/devices/mbp14-spaceblack-select-202410.png",
    secondaryImage: "/devices/mbp14-silver-select-202410.png",
    galleryImages: [
      {
        url: "/devices/mbp14-spaceblack-gallery1-202410.png",
        caption: "Liquid Retina XDR Display // 16.2-inch Mini-LED Canvas with 1,600 Nits Peak HDR",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/mbp14-spaceblack-gallery2-202410.png",
        caption: "Magic Keyboard Top View // Full-Height Function Row & Force Touch Trackpad",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/mbp14-spaceblack-gallery3-202410.png",
        caption: "Left Flank Array // MagSafe 3 Fast Charge & Dual Thunderbolt 5 Ports (120 Gb/s)",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/mbp14-spaceblack-gallery4-202410.png",
        caption: "Right Flank Array // HDMI 2.1 8K Output, Thunderbolt 5 & SDXC Card Slot",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Apple M4 Max // 16-Core CPU & 40-Core GPU Architecture",
      "128GB Unified Memory with 546 GB/s memory bandwidth",
      "Liquid Retina XDR Display // 1,600 nits peak luminance & 1,000,000:1 contrast",
      "Thunderbolt 5 I/O Controller transferring up to 120 Gb/s"
    ],
    technicalDossier: [
      {
        title: "COMPUTATIONAL POWER & MEMORY",
        specs: [
          { label: "Silicon Architecture", value: "Apple M4 Max (Second-Gen 3nm Process Node)" },
          { label: "Compute Cores", value: "16-core CPU (12 performance cores and 4 efficiency cores)" },
          { label: "Graphics Subsystem", value: "40-core GPU with 2x faster hardware ray-tracing & dynamic caching" },
          { label: "Unified Memory", value: "128GB unified RAM operating at 546 GB/s memory bandwidth" },
          { label: "Neural Engine", value: "16-core NPU delivering 38 TOPS for machine learning workloads" }
        ]
      },
      {
        title: "LIQUID RETINA XDR DISPLAY",
        specs: [
          { label: "Panel Technology", value: "16.2-inch Liquid Retina XDR mini-LED backlight display" },
          { label: "Native Resolution", value: "3456 × 2234 native resolution at 254 pixels per inch" },
          { label: "Luminance Calibration", value: "1,000 nits sustained full-screen XDR, 1,600 nits peak HDR" },
          { label: "ProMotion Frequency", value: "Adaptive refresh rates up to 120Hz" }
        ]
      },
      {
        title: "PRO CONNECTIVITY & THERMAL ARCHITECTURE",
        specs: [
          { label: "I/O Ports", value: "Three Thunderbolt 5 (USB-C) ports supporting Charging, DisplayPort, 120 Gb/s" },
          { label: "Media Slots & Video", value: "SDXC card slot, HDMI 2.1 port (up to 8K at 60Hz), 3.5mm headphone jack" },
          { label: "Acoustic System", value: "High-fidelity six-speaker sound system with force-cancelling woofers" },
          { label: "Battery Life", value: "Up to 24 hours video streaming, 100-watt-hour lithium-polymer battery" }
        ]
      }
    ],
    finishes: [
      {
        id: "spaceblack",
        name: "Space Black",
        colorCode: "#222120",
        heroImage: "/devices/mbp14-spaceblack-select-202410.png",
        editorialDescription: "Dark architectural aluminum treated with light-absorbing nano chemistry."
      },
      {
        id: "silver",
        name: "Silver",
        colorCode: "#E2E2E2",
        heroImage: "/devices/mbp14-silver-select-202410.png",
        editorialDescription: "Classic pure silver raw aluminum celebrating timeless Cupertino industrial design."
      }
    ],
    capacities: [
      { size: "1 TB SSD", priceDelta: 0 },
      { size: "2 TB SSD", priceDelta: 400 },
      { size: "4 TB SSD", priceDelta: 1000 }
    ],
    inStock: true
  },

  // 4. MacBook Air 15″ M3
  {
    id: "macbook-air-m3",
    slug: "macbook-air-15-m3",
    title: "MacBook Air 15″ M3",
    curatorialSubtitle: "Strikingly thin at 11.5mm. Pure unibody aluminum with all-day silent performance.",
    category: "macbooks",
    era: "COLLECTION 2026 // ULTRALIGHT SILHOUETTE",
    designerNote: "A 15.3-inch Liquid Retina canvas enclosed in an extraordinarily thin 11.5mm chassis. Completely fanless acoustic architecture delivering total silence.",
    basePrice: 1299,
    currency: "USD",
    material: "Unibody Precision-Milled Aluminum",
    dimensions: "340.4 × 237.6 × 11.5 mm",
    weight: "1.51 kg",
    primaryImage: "/devices/mba15-midnight-select-202306.png",
    secondaryImage: "/devices/mba15-starlight-select-202306.png",
    galleryImages: [
      {
        url: "/devices/mba15-midnight-gallery1-202306.png",
        caption: "15.3-inch Liquid Retina Canvas // 500 Nits Brightness and 1 Billion Colors",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/mba15-midnight-gallery2-202306.png",
        caption: "11.5mm Ultrathin Profile // Fanless Thermodynamic Monolith with MagSafe 3 Port",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/mba15-midnight-gallery3-202306.png",
        caption: "Magic Keyboard with Touch ID // Integrated Six-Speaker Sound System",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/mba15-starlight-select-202306.png",
        caption: "Starlight Metallurgy // Warm Champagne Anodized Aluminum Shell",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Apple M3 Silicon // 8-Core CPU & 10-Core GPU with Hardware Ray Tracing",
      "Fanless Silent Design // 0 Decibels Acoustic Output Under Sustained Load",
      "15.3-inch Liquid Retina Display (500 nits luminance)",
      "Up to 18 Hours Battery Endurance with MagSafe 3 Fast Charging"
    ],
    technicalDossier: [
      {
        title: "ENGINEERING PROFILE & THERMALS",
        specs: [
          { label: "Chassis Thickness", value: "11.5 millimeters (The thinnest 15-inch laptop on earth)" },
          { label: "Acoustic Footprint", value: "0 dB (Completely fanless thermodynamic passive dissipation)" },
          { label: "Structural Alloy", value: "100% recycled aluminum unibody with anti-fingerprint seal" }
        ]
      },
      {
        title: "M3 SILICON ARCHITECTURE",
        specs: [
          { label: "Processor", value: "Apple M3 chip (8-core CPU with 4 performance and 4 efficiency cores)" },
          { label: "GPU Subsystem", value: "10-core GPU with Dynamic Caching and hardware mesh shading" },
          { label: "Neural Engine", value: "16-core NPU accelerated for consumer AI applications" },
          { label: "External Displays", value: "Supports up to two external displays with laptop lid closed" }
        ]
      },
      {
        title: "MEDIA, AUDIO & BATTERY",
        specs: [
          { label: "Audio Transducers", value: "Six-speaker sound system with force-cancelling woofers" },
          { label: "FaceTime Camera", value: "1080p FaceTime HD camera with advanced computational image processor" },
          { label: "Battery Specification", value: "66.5-watt-hour lithium-polymer battery providing up to 18 hours" }
        ]
      }
    ],
    finishes: [
      {
        id: "midnight",
        name: "Midnight",
        colorCode: "#1E2430",
        heroImage: "/devices/mba15-midnight-select-202306.png",
        editorialDescription: "Deep maritime dark blue with advanced anodized fingerprint seal."
      },
      {
        id: "starlight",
        name: "Starlight",
        colorCode: "#E7E2D7",
        heroImage: "/devices/mba15-starlight-select-202306.png",
        editorialDescription: "Warm champagne silver hue that shifts subtly across daylight."
      }
    ],
    capacities: [
      { size: "256 GB SSD", priceDelta: 0 },
      { size: "512 GB SSD", priceDelta: 200 },
      { size: "1 TB SSD", priceDelta: 400 }
    ],
    inStock: true
  },

  // 5. AirPods Max USB-C
  {
    id: "airpods-max-usb-c",
    slug: "airpods-max-sculpture",
    title: "AirPods Max (USB-C)",
    curatorialSubtitle: "Kinetic luxury. Anodized aluminum earcups suspended on stainless steel friction arms.",
    category: "airpods",
    era: "COLLECTION 2026 // ACOUSTICS",
    designerNote: "A breathable knit mesh canopy distributes weight to reduce on-head pressure. Acoustically engineered memory foam ear cushions finished in bespoke textile weave.",
    basePrice: 549,
    currency: "USD",
    material: "Bead-blasted Aluminum & Surgical Stainless Steel",
    dimensions: "187.3 × 168.6 × 83.4 mm",
    weight: "384.8 grams",
    primaryImage: "/devices/airpods-max-select-202409-starlight.png",
    secondaryImage: "/devices/airpods-max-select-202409-midnight.png",
    galleryImages: [
      {
        url: "/devices/airpods-max-select-202409-midnight.png",
        caption: "Midnight Anodized Aluminum Earcups // Breathable Knit Mesh Acoustic Canopy",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/airpods-max-select-202409-blue.png",
        caption: "Deep Blue Colorway // Telescoping Surgical Stainless Steel Friction Arms",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/airpods-max-select-202409-purple.png",
        caption: "Purple Formulation // Acoustically Engineered Viscoelastic Memory Foam",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/airpods-max-select-202409-orange.png",
        caption: "Vibrant Orange // Modern USB-C Architecture with Lossless Audio Precision",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Custom 40mm Dynamic Driver with Dual Neodymium Ring Motors",
      "Dual H1 Silicon Computational Audio (9 Billion Operations Per Second)",
      "Pro-Level Active Noise Cancellation & Adaptive Transparency",
      "Lossless Digital Audio Support via Modern USB-C Wired Protocol"
    ],
    technicalDossier: [
      {
        title: "ACOUSTIC ENGINEERING & TRANSDUCERS",
        specs: [
          { label: "Transducer Unit", value: "Apple-designed 40mm dynamic driver with dual neodymium ring magnet motor" },
          { label: "Harmonic Distortion", value: "<1% Total Harmonic Distortion (THD) across the entire audible frequency range" },
          { label: "Acoustic Cushion", value: "Acoustically engineered memory foam creating an optimal sound seal" },
          { label: "Digital Crown Controller", value: "Tactile rotational wheel for precision volume, track skipping, and Siri activation" }
        ]
      },
      {
        title: "COMPUTATIONAL AUDIO ENGINES",
        specs: [
          { label: "Acoustic Silicon", value: "Apple H1 headphone chip in each ear cup (10 audio cores per chip)" },
          { label: "ANC Technology", value: "Eight microphones for Active Noise Cancellation; three microphones for voice pickup" },
          { label: "Spatial Audio", value: "Personalized Spatial Audio with dynamic head tracking for theater-like immersion" }
        ]
      },
      {
        title: "I/O, SENSORS & POWER",
        specs: [
          { label: "Interface Standard", value: "USB-C charging and lossless digital wired audio transmission" },
          { label: "Sensors", value: "Optical sensor, position sensor, case-detect sensor, accelerometer, gyroscope" },
          { label: "Battery Endurance", value: "Up to 20 hours listening time with Active Noise Cancellation enabled" },
          { label: "Fast Fuel", value: "5-minute charge delivers approximately 1.5 hours of continuous listening" }
        ]
      }
    ],
    finishes: [
      {
        id: "starlight",
        name: "Starlight",
        colorCode: "#E7E2D7",
        heroImage: "/devices/airpods-max-select-202409-starlight.png",
        editorialDescription: "Warm champagne silver aluminum with ivory textile canopy."
      },
      {
        id: "midnight",
        name: "Midnight",
        colorCode: "#20242B",
        heroImage: "/devices/airpods-max-select-202409-midnight.png",
        editorialDescription: "Deep petroleum midnight tone with matching dark canopy."
      },
      {
        id: "blue",
        name: "Blue",
        colorCode: "#3E5788",
        heroImage: "/devices/airpods-max-select-202409-blue.png",
        editorialDescription: "Architectural oceanic blue anodized aluminum with coordinated headband."
      },
      {
        id: "purple",
        name: "Purple",
        colorCode: "#7A6588",
        heroImage: "/devices/airpods-max-select-202409-purple.png",
        editorialDescription: "Subtle muted lilac metallic sheen suspended from polished steel stems."
      },
      {
        id: "orange",
        name: "Orange",
        colorCode: "#D96838",
        heroImage: "/devices/airpods-max-select-202409-orange.png",
        editorialDescription: "Vibrant high-fashion citrus copper tone celebrating modern luxury."
      }
    ],
    inStock: true
  },

  // 6. AirPods Pro 2 (USB-C)
  {
    id: "airpods-pro-2",
    slug: "airpods-pro-2",
    title: "AirPods Pro 2 (USB-C)",
    curatorialSubtitle: "Pro-grade active noise cancellation with clinical-grade hearing aid capability.",
    category: "airpods",
    era: "COLLECTION 2026 // MICRO ACOUSTICS",
    designerNote: "Engineered around the H2 silicon processor. Delivers up to 2x more active noise cancellation, personalized spatial audio with dynamic head tracking, and MagSafe charging.",
    basePrice: 249,
    currency: "USD",
    material: "Gloss Acrylic & Silicone Acoustic Ear Tips",
    dimensions: "30.9 × 21.8 × 24.0 mm",
    weight: "5.3 grams per earbud",
    primaryImage: "/devices/MTJV3.png",
    secondaryImage: "/devices/airpods-pro-2-hero-select-202409.png",
    galleryImages: [
      {
        url: "/devices/MTJV3_AV1.png",
        caption: "Open MagSafe Enclosure // Precision Molded Acoustic Housing & Earbud Fit",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/MTJV3_AV2.png",
        caption: "Earbud Architecture // Vent System for Equalizing Pressure & Force Touch Stems",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/MTJV3_AV3.png",
        caption: "Acoustic Silicone Ear Tips // Four Sizes (XS, S, M, L) for Custom Ergonomics",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/MTJV3_AV4.png",
        caption: "MagSafe Enclosure Rear // Integrated Speaker for Find My & Lanyard Anchor",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Apple H2 Silicon // Up to 2x more Active Noise Cancellation than prior generation",
      "Adaptive Audio // Dynamically blends Transparency and Active Noise Cancellation",
      "Clinical Hearing Health // Scientifically validated Hearing Test & Hearing Aid feature",
      "IP54 Dust, Sweat, and Water Resistance for both earbuds and charging case"
    ],
    technicalDossier: [
      {
        title: "COMPUTATIONAL ACOUSTICS",
        specs: [
          { label: "Silicon Engine", value: "Apple H2 headphone chip paired with Apple U1 in charging case" },
          { label: "Transducer Array", value: "Custom high-excursion Apple driver with custom high dynamic range amplifier" },
          { label: "ANC Reduction Factor", value: "Up to 2x more Active Noise Cancellation compared to AirPods Pro (1st gen)" },
          { label: "Adaptive Audio", value: "Combines Transparency and ANC to adjust noise control as environment changes" }
        ]
      },
      {
        title: "HEARING HEALTH & INTELLIGENCE",
        specs: [
          { label: "Hearing Test", value: "Clinically validated hearing assessment administered in minutes via iPhone" },
          { label: "Hearing Aid Capability", value: "Software-based clinical-grade hearing aid for perceived mild to moderate loss" },
          { label: "Loud Sound Reduction", value: "Passively and actively reduces exposure to loud ambient noise at 48,000 times/sec" }
        ]
      },
      {
        title: "CHARGING ENCLOSURE & SENSORS",
        specs: [
          { label: "Charging Standards", value: "USB-C, MagSafe, Apple Watch charger, or Qi-certified chargers" },
          { label: "Battery Performance", value: "Up to 6 hours listening with ANC; up to 30 hours total with MagSafe case" },
          { label: "Find My Telemetry", value: "Precision Finding with U1 chip and built-in acoustic speaker locator" }
        ]
      }
    ],
    inStock: true
  },

  // 7. AirPods 4 (ANC)
  {
    id: "airpods-4-anc",
    slug: "airpods-4-anc",
    title: "AirPods 4 with ANC",
    curatorialSubtitle: "The first open-ear architecture with Active Noise Cancellation.",
    category: "airpods",
    era: "COLLECTION 2026 // OPEN ACOUSTICS",
    designerNote: "Redesigned geometry created by scanning 50 million individual ear data points. Delivers remarkable acoustic isolation without silicone tips.",
    basePrice: 179,
    currency: "USD",
    material: "High-Gloss Polycarbonate Enclosure",
    dimensions: "30.2 × 18.3 × 18.1 mm",
    weight: "4.3 grams per earbud",
    primaryImage: "/devices/airpods-4-anc-select-202409.png",
    secondaryImage: "/devices/airpods-4-anc-select-202409.png",
    galleryImages: [
      {
        url: "/devices/airpods-4-anc-select-202409.png",
        caption: "Open-Ear Acoustic Architecture // Ergonomic Contour Sculpted from 50 Million Data Points",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/MTJV3_AV1.png",
        caption: "Ultracompact Wireless Charging Enclosure // Smallest Case Ever Engineered by Apple",
        plateNumber: "PLATE 02"
      }
    ],
    specHighlights: [
      "Active Noise Cancellation in an open-ear tip-free design",
      "Apple H2 Chip // Personalized Spatial Audio with dynamic head tracking",
      "Smallest wireless charging case in the industry with built-in Find My speaker",
      "Voice Isolation for crystal-clear phone calls in loud conditions"
    ],
    technicalDossier: [
      {
        title: "AUDIO ARCHITECTURE",
        specs: [
          { label: "Acoustic Type", value: "Open-ear transducer with custom low-distortion driver and amplifier" },
          { label: "Active Noise Cancellation", value: "World-first open-ear ANC powered by advanced computational H2 algorithms" },
          { label: "Conversation Awareness", value: "Automatically lowers media volume and enhances voices in front of you" }
        ]
      },
      {
        title: "POWER & DIMENSIONS",
        specs: [
          { label: "Listening Time", value: "Up to 4 hours with ANC on single charge; up to 20 hours with charging case" },
          { label: "Case Charging Method", value: "USB-C, Apple Watch charger, or Qi-certified wireless charging pad" },
          { label: "Ingress Protection", value: "IP54 dust, sweat, and water resistant under IEC standard 60529" }
        ]
      }
    ],
    inStock: true
  },

  // 8. Apple Watch Ultra 2 (Black Titanium)
  {
    id: "apple-watch-ultra-2",
    slug: "apple-watch-ultra-2-black",
    title: "Apple Watch Ultra 2",
    curatorialSubtitle: "Satin Black Titanium. Aerospace-grade 49mm chassis built for extreme endurance.",
    category: "watches",
    era: "COLLECTION 2026 // ADVENTURE HOROLOGY",
    designerNote: "Grade 5 titanium coated with diamond-like carbon (DLC) surface treatment for extreme scratch resistance. 3,000 nits Always-On display with dual-frequency GPS.",
    basePrice: 799,
    currency: "USD",
    material: "Black Grade 5 Titanium & Sapphire Front Crystal",
    dimensions: "49.0 × 44.0 × 14.4 mm",
    weight: "61.4 grams",
    primaryImage: "/devices/watch-card-40-ultra2-202409.png",
    secondaryImage: "/devices/MXK83.png",
    galleryImages: [
      {
        url: "/devices/watch-card-40-ultra2-202409.png",
        caption: "Satin Black Diamond-Like Carbon Coating on Grade 5 Titanium // 49mm Monolith",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/MXK83_AV1.png",
        caption: "Titanium Milanese Loop // Parachute-Style Buckle Milled from Matching Black Alloy",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/MXK83_AV3.png",
        caption: "Side Flank Profile // Orange Action Button, Dual Speakers & 86dB Siren",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/MXK83_AV4.png",
        caption: "Digital Crown Flank // Guarded Crown with Haptic Feedback & Depth Gauge Sensor",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "S9 SiP Silicon // 4-Core Neural Engine with magical Double Tap Gesture control",
      "3,000 Nits Maximum OLED Luminance (1 nit night mode minimum)",
      "Precision Dual-Frequency GPS (L1 and L5) with custom antenna architecture",
      "100m Water Resistance & Recreational Dive certified to 40m (EN13319)"
    ],
    technicalDossier: [
      {
        title: "HOROLOGICAL METALLURGY & SCREEN",
        specs: [
          { label: "Case Metallurgy", value: "Black Grade 5 titanium (95% recycled) with physical vapor diamond-like carbon" },
          { label: "Crystal Surface", value: "Flat sapphire front crystal with raised titanium edge protection" },
          { label: "Display Luminance", value: "Always-On Retina display outputting 3000 nits peak outdoor brightness" },
          { label: "Night Mode", value: "Rotational Modular Ultra face turns vivid red to preserve night vision" }
        ]
      },
      {
        title: "EXPEDITION & SENSORS",
        specs: [
          { label: "GPS Telemetry", value: "Precision dual-frequency GPS (L1 and L5), GLONASS, Galileo, BeiDou" },
          { label: "Marine Capabilities", value: "Depth gauge with water temperature sensor, certified EN13319 for diving to 40m" },
          { label: "Acoustic Safety Siren", value: "Dual speaker 86-decibel siren audible up to 600 feet (180 meters)" },
          { label: "Health Sensors", value: "Blood oxygen sensor, electrical heart sensor (ECG), third-gen optical heart sensor" }
        ]
      },
      {
        title: "POWER ARCHITECTURE",
        specs: [
          { label: "Battery Endurance", value: "Up to 36 hours normal use; up to 72 hours in Low Power Mode" },
          { label: "Workout Tracking", value: "Up to 17 hours outdoor workout tracking in Low Power Mode" },
          { label: "Fast Charging", value: "Fast charge from 0 to 80% in approximately 60 minutes via magnetic puck" }
        ]
      }
    ],
    finishes: [
      {
        id: "black-titanium",
        name: "Black Titanium",
        colorCode: "#262626",
        heroImage: "/devices/watch-card-40-ultra2-202409.png",
        editorialDescription: "Dark diamond-like carbon coating treated onto aerospace grade 5 titanium."
      },
      {
        id: "natural-titanium",
        name: "Natural Titanium",
        colorCode: "#C4BFB6",
        heroImage: "/devices/MXK83.png",
        editorialDescription: "Satin brushed raw titanium alloy with contrasting high-visibility accents."
      }
    ],
    inStock: true
  },

  // 9. Apple Watch Series 10
  {
    id: "apple-watch-series-10",
    slug: "apple-watch-series-10",
    title: "Apple Watch Series 10",
    curatorialSubtitle: "Thinnest Apple Watch ever. Wide-angle OLED display with polished Jet Black finish.",
    category: "watches",
    era: "COLLECTION 2026 // TIMELESS HOROLOGY",
    designerNote: "Nearly 10 percent thinner than previous generations. Features an expansive wide-angle OLED that is up to 40 percent brighter when viewed from an angle.",
    basePrice: 399,
    currency: "USD",
    material: "Polished Jet Black Aluminum & Ion-X Front Glass",
    dimensions: "46.0 × 39.0 × 9.7 mm",
    weight: "36.4 grams",
    primaryImage: "/devices/watch-card-40-s10-202409.png",
    secondaryImage: "/devices/MX753.png",
    galleryImages: [
      {
        url: "/devices/watch-card-40-s10-202409.png",
        caption: "Polished Jet Black Mirror Enclosure // 9.7mm Ultrathin Chassis",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/MX753_AV1.png",
        caption: "Milanese Magnetic Mesh Band // Fluid Stainless Steel Woven Wrap",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/MX753_AV2.png",
        caption: "Side Flank Profile // Re-Engineered Speaker Port & Digital Crown Integration",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/MX753_AV3.png",
        caption: "Wide-Angle LTPO3 OLED Canvas // Up to 40% Brighter Off-Axis Luminance",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Thinnest Apple Watch ever made at just 9.7mm thickness",
      "Wide-Angle OLED display with faster 1-second ticking second-hand refresh",
      "Sleep Apnea notifications & water depth and temperature sensors",
      "Fastest charging ever: 0 to 80 percent in approximately 30 minutes"
    ],
    technicalDossier: [
      {
        title: "TIMEKEEPING ARCHITECTURE & DISPLAY",
        specs: [
          { label: "Chassis Thickness", value: "9.7 mm (Nearly 10% thinner than Series 9)" },
          { label: "Display Technology", value: "Wide-angle LTPO3 OLED Always-On Retina display" },
          { label: "Screen Area", value: "Up to 1220 sq mm with rounded corners and curved edge glass" },
          { label: "Off-Axis Brightness", value: "Up to 40% brighter when viewed at an angle" }
        ]
      },
      {
        title: "HEALTH METRICS & SENSORS",
        specs: [
          { label: "Sleep Apnea Detection", value: "Accelerometric Breathing Disturbances analysis over 30-day windows" },
          { label: "Water Telemetry", value: "Depth gauge to 6 meters and water temperature sensor for snorkeling" },
          { label: "Vitals App", value: "Overnight health metrics: heart rate, respiratory rate, wrist temperature" },
          { label: "ECG App", value: "Electrical heart sensor generating single-lead electrocardiogram" }
        ]
      },
      {
        title: "ACOUSTICS & RAPID CHARGE",
        specs: [
          { label: "Direct Audio Playback", value: "Play music and podcasts directly from the built-in speaker" },
          { label: "Voice Isolation", value: "Neural network suppresses background noise for crystal clear phone calls" },
          { label: "Battery & Fast Charge", value: "18 hours all-day battery life; 15 minutes of charging gives up to 8 hours" }
        ]
      }
    ],
    finishes: [
      {
        id: "jetblack",
        name: "Jet Black",
        colorCode: "#111111",
        heroImage: "/devices/watch-card-40-s10-202409.png",
        editorialDescription: "High-gloss mirror polished aluminum achieved through a 30-step anodization process."
      },
      {
        id: "silver",
        name: "Silver Aluminum",
        colorCode: "#E2E2E2",
        heroImage: "/devices/MX753.png",
        editorialDescription: "Clean satin matte aluminum paired with stainless steel woven mesh."
      }
    ],
    inStock: true
  },

  // 10. Studio Display 27″ 5K
  {
    id: "studio-display-5k",
    slug: "studio-display-nano",
    title: "Studio Display 27″ 5K",
    curatorialSubtitle: "A continuous plane of 14.7 million pixels framed in satin-finish silver chassis.",
    category: "accessories",
    era: "COLLECTION 2026 // MONITORS",
    designerNote: "All-screen architectural silhouette. Integrated A13 Bionic silicon powering a 12MP Center Stage camera and three studio-grade microphones.",
    basePrice: 1599,
    currency: "USD",
    material: "Extruded Architectural Aluminum & Nano-Texture Glass",
    dimensions: "623 × 478 × 168 mm",
    weight: "7.7 kg",
    primaryImage: "/devices/MK0U3.png",
    secondaryImage: "/devices/MMMR3.png",
    galleryImages: [
      {
        url: "/devices/MK0U3.png",
        caption: "27-inch 5K Retina Canvas // Architectural Aluminum Tilt-Adjustable Stand",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/MMMR3.png",
        caption: "Paired Studio Workstation // Studio Display with Space Black Magic Keyboard & Mouse",
        plateNumber: "PLATE 02"
      }
    ],
    specHighlights: [
      "27-inch 5K Retina display (5120 × 2880 at 218 ppi, 14.7M pixels)",
      "600 nits brightness with P3 wide color gamut and True Tone",
      "12MP Ultra Wide camera with Center Stage video framing",
      "High-fidelity six-speaker sound system with Spatial Audio"
    ],
    technicalDossier: [
      {
        title: "OPTICAL RETINA METRICS",
        specs: [
          { label: "Screen Canvas", value: "27-inch (diagonal) 5K Retina display" },
          { label: "Pixel Count", value: "5120 × 2880 resolution at 218 pixels per inch (14.7 million pixels)" },
          { label: "Color Gamut", value: "P3 wide color gamut with 1 billion colors supported" },
          { label: "Luminance", value: "600 nits sustained brightness across entire glass canvas" }
        ]
      },
      {
        title: "CAMERA & COMPUTATIONAL AUDIO",
        specs: [
          { label: "Onboard Silicon", value: "Apple A13 Bionic chip powering camera and audio processing" },
          { label: "Center Stage Camera", value: "12MP Ultra Wide camera with 122° field of view and ƒ/2.4 aperture" },
          { label: "Microphone Array", value: "Studio-quality three-mic array with high signal-to-noise ratio and directional beamforming" },
          { label: "Acoustic System", value: "Six-speaker sound system with force-cancelling woofers and Dolby Atmos" }
        ]
      },
      {
        title: "CONNECTIVITY & POWER DELIVERY",
        specs: [
          { label: "Thunderbolt 3 Upstream", value: "One Thunderbolt 3 port with 96W host charging for MacBook Pro" },
          { label: "Downstream USB-C", value: "Three USB-C ports (up to 10 Gb/s) for peripherals and high-speed storage" }
        ]
      }
    ],
    inStock: true
  },

  // 11. Magic Keyboard with Touch ID
  {
    id: "magic-keyboard-touch-id",
    slug: "magic-keyboard-space-black",
    title: "Magic Keyboard with Touch ID",
    curatorialSubtitle: "Wireless precision typing with biometric Touch ID authentication in Space Black.",
    category: "accessories",
    era: "COLLECTION 2026 // INPUT APPARATUS",
    designerNote: "Low-profile scissor mechanism with extended layout including document navigation controls and full-size arrow keys. Anodized Space Black aluminum frame.",
    basePrice: 199,
    currency: "USD",
    material: "Anodized Space Black Aluminum & Woven USB-C Cable",
    dimensions: "418.7 × 114.9 × 10.9 mm",
    weight: "369 grams",
    primaryImage: "/devices/MMMR3.png",
    secondaryImage: "/devices/MX6X3.png",
    galleryImages: [
      {
        url: "/devices/MMMR3.png",
        caption: "Space Black Aluminum Frame // Integrated Biometric Touch ID Sensor",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/MX6X3.png",
        caption: "Multi-Touch Surface Companion // Magic Trackpad in Space Black Glass",
        plateNumber: "PLATE 02"
      }
    ],
    specHighlights: [
      "Integrated Biometric Touch ID Sensor for instant authentication and Apple Pay",
      "Full-Size Numeric Keypad and Extended Document Navigation Keys",
      "Rechargeable internal lithium battery powering 1+ month per charge",
      "Braided black USB-C to USB-C charging and pairing cable included"
    ],
    technicalDossier: [
      {
        title: "INPUT ARCHITECTURE & MECHANISM",
        specs: [
          { label: "Switch Mechanism", value: "Optimized scissor mechanism with 1mm key travel for tactile precision" },
          { label: "Biometric Security", value: "Dedicated Secure Enclave hardware link directly to Apple Silicon" },
          { label: "Layout Format", value: "Extended layout with numeric keypad and full-height inverted-T arrow keys" }
        ]
      },
      {
        title: "WIRELESS & POWER MANAGEMENT",
        specs: [
          { label: "Connectivity Protocol", value: "Bluetooth Low Energy and wired direct USB-C transmission" },
          { label: "Battery Longevity", value: "Built-in rechargeable battery delivering approximately a month or more between charges" },
          { label: "Cabling Architecture", value: "Included braided woven USB-C cable for simultaneous charging and pairing" }
        ]
      }
    ],
    inStock: true
  },

  // 12. Apple MagSafe Fast Charger (2m)
  {
    id: "magsafe-charger-2m",
    slug: "magsafe-charger-woven",
    title: "Apple MagSafe Fast Charger (2m)",
    curatorialSubtitle: "Braided magnetic induction charging up to 25W with Qi2 certified alignment.",
    category: "accessories",
    era: "COLLECTION 2026 // POWER INTERFACE",
    designerNote: "Upgraded with a durable braided cable design. Delivers high-speed wireless charging up to 25W when paired with 30W power adapters on iPhone 16 models.",
    basePrice: 49,
    currency: "USD",
    material: "Bead-Blasted Aluminum Puck & Braided Woven Cable",
    dimensions: "2.0 meters length",
    weight: "82 grams",
    primaryImage: "/devices/MX6Y3.png",
    secondaryImage: "/devices/MM0Y3.png",
    galleryImages: [
      {
        url: "/devices/MX6Y3.png",
        caption: "Magnetic Ring Induction Puck // 25W Fast Wireless Energy Transfer",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/MM0Y3.png",
        caption: "MagSafe FineWoven Wallet Accessory // Built-In Find My NFC Telemetry",
        plateNumber: "PLATE 02"
      }
    ],
    specHighlights: [
      "Up to 25W fast wireless charging on iPhone 16 and iPhone 16 Pro",
      "Perfect magnetic alignment with Qi2 and MagSafe magnetic arrays",
      "Durable 2-meter braided woven cable architecture",
      "Universal compatibility with AirPods and Qi-certified wireless devices"
    ],
    technicalDossier: [
      {
        title: "POWER ELECTRICAL SPECIFICATIONS",
        specs: [
          { label: "Peak Induction Output", value: "Up to 25W with 30W Power Adapter (charges iPhone 16 to 50% in 30 mins)" },
          { label: "Induction Protocol", value: "Apple MagSafe and Qi2 standard certified magnetic induction" },
          { label: "Cable Metallurgy", value: "Extra-long 2.0-meter reinforced braided woven shielding preventing frays" }
        ]
      },
      {
        title: "MAGNETIC INTEGRATION & COMPATIBILITY",
        specs: [
          { label: "Magnetic Array", value: "Neodymium magnet ring aligning perfectly with iPhone internal inductive coils" },
          { label: "Supported Devices", value: "iPhone 12 through iPhone 16 Pro Max, AirPods with MagSafe Charging Cases" }
        ]
      }
    ],
    inStock: true
  },

  // 13. iPhone 17 Pro
  {
    id: "iphone-17-pro",
    slug: "iphone-17-pro",
    title: "iPhone 17 Pro",
    curatorialSubtitle: "A19 Pro Silicon with Deionized Water Vapor Chamber, All-48MP Triple Periscope Array & Horizontal Camera Plateau.",
    category: "iphones",
    era: "COLLECTION 2026 // PRO WORKSTATION",
    designerNote: "Precision-crafted with an anodized aluminum unibody and a two-tone Ceramic Shield 2 rear inlay. An integrated deionized water vapor chamber system dissipates heat throughout the chassis for 40% higher sustained performance. Features a full-width camera plateau with all-48MP sensors.",
    basePrice: 1099,
    currency: "USD",
    material: "Anodized Aerospace Aluminum Unibody & Ceramic Shield 2",
    dimensions: "150.0 × 71.9 × 8.75 mm",
    weight: "206 grams",
    primaryImage: "/devices/iphone-17-pro-cosmic-orange.jpg",
    secondaryImage: "/devices/iphone-17-pro-deep-blue.jpg",
    galleryImages: [
      {
        url: "/devices/iphone-17-pro-cosmic-orange.jpg",
        caption: "Cosmic Orange Anodized Unibody // Horizontal Camera Plateau & All-48MP Optics",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/iphone-17-pro-deep-blue.jpg",
        caption: "Deep Blue Two-Tone Inlay // Deionized Water Vapor Chamber",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/iphone-17-pro-silver.jpg",
        caption: "Silver Aluminum Chassis // All-48MP Triple Optical System",
        plateNumber: "PLATE 03"
      }
    ],
    specHighlights: [
      "Apple A19 Pro Silicon with Deionized Water Vapor Chamber Cooling (+40% Sustained Performance)",
      "All-48MP Triple Optical Array (48MP Fusion, 48MP Ultra Wide, 48MP 8x Periscope Telephoto)",
      "Horizontal Camera Plateau with Two-Tone Ceramic Shield 2 Drop Armor",
      "18MP Center Stage Front Camera with Apple's First Square Sensor for Landscape Selfies",
      "12GB Unified Memory for On-Device Apple Intelligence and Studio Multicam Genlock"
    ],
    technicalDossier: [
      {
        title: "COMPUTATIONAL SILICON & THERMALS",
        specs: [
          { label: "Silicon Engine", value: "Apple A19 Pro (TSMC 3nm N3P, 6-core CPU [2P+4E], unbinned 6-core GPU, 16-core NPU)" },
          { label: "Thermal System", value: "Internal deionized water vapor chamber loop delivering 40% higher sustained performance" },
          { label: "Neural Memory", value: "12GB high-bandwidth unified memory dedicated to on-device Apple Intelligence" }
        ]
      },
      {
        title: "OPTICAL ARCHITECTURE (ALL-48MP TRIPLE SYSTEM)",
        specs: [
          { label: "Primary Fusion Sensor", value: "48MP Fusion (24mm, ƒ/1.78, 2nd-gen sensor-shift OIS, 100% Focus Pixels)" },
          { label: "Periscope Telephoto", value: "48MP Tetraprism Periscope (120mm, 56% larger sensor, 4x & 8x optical zoom, up to 40x digital)" },
          { label: "Ultra Wide Lens", value: "48MP Ultra Wide (13mm, ƒ/2.2, 120° FOV, hybrid focus pixels, macro & spatial video)" },
          { label: "Front-Facing Camera", value: "18MP Center Stage front camera with square sensor for portrait & landscape orientation" },
          { label: "Studio Production", value: "ProRes RAW, Apple Log 2, Genlock multicam hardware timecode sync, 4K 120 fps Dolby Vision" }
        ]
      },
      {
        title: "DISPLAY & ARMOR",
        specs: [
          { label: "Screen Canvas", value: "6.27-inch (6.3\") Super Retina XDR LTPO OLED (2622 × 1206 at 460 ppi, 1-120Hz ProMotion)" },
          { label: "Peak Outdoor Luminance", value: "3,000 nits peak outdoor brightness (1,600 nits HDR, 1-nit minimum)" },
          { label: "Structural Armor", value: "Ceramic Shield 2 front and rear with 7-layer anti-reflective coating reducing glare by 33%" }
        ]
      },
      {
        title: "BATTERY & CHARGING",
        specs: [
          { label: "Battery Endurance", value: "4,252 mAh high-density cell delivering up to 33 hours continuous video playback" },
          { label: "Fast Charge Delivery", value: "Fast charge to 50% in 20 minutes with 40W adapter; MagSafe wireless charging up to 25W" }
        ]
      }
    ],
    finishes: [
      {
        id: "cosmic-orange",
        name: "Cosmic Orange",
        colorCode: "#E65C00",
        heroImage: "/devices/iphone-17-pro-cosmic-orange.jpg",
        editorialDescription: "Vibrant metallic amber burnt orange unibody — the boldest, most radiant Pro color Apple has ever crafted.",
        stockCount: 14
      },
      {
        id: "deep-blue",
        name: "Deep Blue",
        colorCode: "#1E2C3D",
        heroImage: "/devices/iphone-17-pro-deep-blue.jpg",
        editorialDescription: "Regal oceanic navy with deep slate undertones and satin anodized luster.",
        stockCount: 12
      },
      {
        id: "silver-pro",
        name: "Silver Unibody",
        colorCode: "#E3E4E5",
        heroImage: "/devices/iphone-17-pro-silver.jpg",
        editorialDescription: "Pure bead-blasted raw aerospace aluminum with luminous silver chamfered edges.",
        stockCount: 18
      }
    ],
    capacities: [
      { size: "256GB", priceDelta: 0 },
      { size: "512GB", priceDelta: 200 },
      { size: "1TB", priceDelta: 400 }
    ],
    inStock: true
  },

  // 14. iPhone 17 Pro Max
  {
    id: "iphone-17-pro-max",
    slug: "iphone-17-pro-max",
    title: "iPhone 17 Pro Max",
    curatorialSubtitle: "6.9-inch Monolith with 5,088 mAh Battery (39h Life), All-48MP Triple Periscope, Metalens Face ID & A19 Pro Silicon.",
    category: "iphones",
    era: "COLLECTION 2026 // PRO MAX APEX",
    designerNote: "The largest, most enduring iPhone in Apple history. Features internal metalens metasurfaces that shrink the Dynamic Island footprint, alongside Apple's largest battery ever (5,088 mAh) and full-width camera plateau.",
    basePrice: 1199,
    currency: "USD",
    material: "Anodized Aerospace Aluminum Unibody & Ceramic Shield 2",
    dimensions: "163.4 × 78.0 × 8.75 mm",
    weight: "233 grams",
    primaryImage: "/devices/iphone-17-pro-cosmic-orange.jpg",
    secondaryImage: "/devices/iphone-17-pro-deep-blue.jpg",
    galleryImages: [
      {
        url: "/devices/iphone-17-pro-cosmic-orange.jpg",
        caption: "6.9-inch Super Retina XDR Canvas // Miniaturized Metalens Dynamic Island",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/iphone-17-pro-deep-blue.jpg",
        caption: "Giant 5,088 mAh Battery Architecture // Up to 39 Hours Continuous Endurance",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/iphone-17-pro-silver.jpg",
        caption: "All-48MP Periscope Telephoto System with 8× Optical Zoom",
        plateNumber: "PLATE 03"
      }
    ],
    specHighlights: [
      "Largest 5,088 mAh Battery in iPhone History (Up to 39 Hours Continuous Video Playback)",
      "6.9-inch 120Hz ProMotion LTPO Display with Smaller Metalens Dynamic Island",
      "All-48MP Triple Optical Camera Array with 8x Optical Periscope Zoom",
      "Apple A19 Pro Silicon with Deionized Water Vapor Chamber Thermal Dissipation",
      "Studio-Quality 4-Mic Array, Genlock Multicam Video Sync, and Apple Log 2"
    ],
    technicalDossier: [
      {
        title: "RECORD-BREAKING POWER & EFFICIENCY",
        specs: [
          { label: "Battery Capacity", value: "5,088 mAh cell delivering up to 39 hours continuous video playback" },
          { label: "Charging Metrics", value: "Fast charge 50% in 20 minutes with 40W+ adapter; MagSafe wireless up to 25W" }
        ]
      },
      {
        title: "DISPLAY & METALENS ARCHITECTURE",
        specs: [
          { label: "Screen Canvas", value: "6.86-inch (marketed 6.9\") Super Retina XDR LTPO OLED (2868 × 1320 at 460 ppi, 1-120Hz ProMotion)" },
          { label: "Metalens Metasurface", value: "Nanostructured flat metasurface lenses shrinking Face ID infrared hardware footprint" },
          { label: "Dynamic Island", value: "Compact profile displaying up to 3 simultaneous Live Activities" }
        ]
      },
      {
        title: "COMPUTATIONAL SILICON",
        specs: [
          { label: "Processor", value: "Apple A19 Pro (TSMC 3nm N3P, 6-core CPU, 6-core GPU, 16-core NPU, 12GB RAM)" },
          { label: "Thermals", value: "Integrated deionized water vapor chamber loop distributing heat across unibody frame" }
        ]
      }
    ],
    finishes: [
      {
        id: "cosmic-orange-max",
        name: "Cosmic Orange",
        colorCode: "#E65C00",
        heroImage: "/devices/iphone-17-pro-cosmic-orange.jpg",
        editorialDescription: "Radiant metallic amber burnt orange unibody with two-tone Ceramic Shield MagSafe inlay.",
        stockCount: 11
      },
      {
        id: "deep-blue-max",
        name: "Deep Blue",
        colorCode: "#1E2C3D",
        heroImage: "/devices/iphone-17-pro-deep-blue.jpg",
        editorialDescription: "Midnight oceanic navy with deep slate undertones.",
        stockCount: 9
      },
      {
        id: "silver-pro-max",
        name: "Silver Unibody",
        colorCode: "#E3E4E5",
        heroImage: "/devices/iphone-17-pro-silver.jpg",
        editorialDescription: "Pure bead-blasted raw aluminum with bright silver chamfers.",
        stockCount: 16
      }
    ],
    capacities: [
      { size: "256GB", priceDelta: 0 },
      { size: "512GB", priceDelta: 200 },
      { size: "1TB", priceDelta: 400 },
      { size: "2TB", priceDelta: 800 }
    ],
    inStock: true
  },

  // 15. iPhone 17 Air (iPhone 17 Slim)
  {
    id: "iphone-17-air",
    slug: "iphone-17-air",
    title: "iPhone 17 Air",
    curatorialSubtitle: "The Thinnest iPhone in History. Just 5.64mm Profile with 6.5-inch 120Hz ProMotion, Apple C1X Modem & A19 Pro Silicon.",
    category: "iphones",
    era: "COLLECTION 2026 // ULTRA SLIM FEATHER",
    designerNote: "Replacing the Plus model with a design-forward luxury statement: at only 5.64mm thin and 165g, it is the thinnest iPhone ever made. Features a polished Grade 5 Titanium frame, centered horizontal camera plateau, eSIM-only worldwide architecture, and Apple's first in-house C1X 5G modem.",
    basePrice: 999,
    currency: "USD",
    material: "Mirror-Polished Grade 5 Titanium Frame & Ceramic Shield Front and Back",
    dimensions: "156.2 × 74.7 × 5.64 mm",
    weight: "165 grams",
    primaryImage: "/devices/iphone-air-official-og.png",
    secondaryImage: "/devices/iphone-air-official-hero.jpg",
    galleryImages: [
      {
        url: "/devices/iphone-air-official-hero.jpg",
        caption: "5.64mm Record-Breaking Profile // Polished Grade 5 Titanium Frame",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/iphone-air-official-og.png",
        caption: "Centered Minimalist Camera Plateau with Single 48MP Fusion Optics",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/apple-iphone-air-sky-blue.jpg",
        caption: "Ultramarine Sky Blue Hero Finish // Apple C1X Proprietary 5G Modem",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/apple-iphone-air-gold.jpg",
        caption: "Light Gold Champagne Elegance // Ceramic Shield Front and Back",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Ultra-Thin 5.64mm Profile & 165g Featherweight Titanium Chassis",
      "6.5-inch 120Hz ProMotion LTPO OLED Display with Always-On Mode",
      "Apple A19 Pro Silicon with 12GB Unified Memory for Apple Intelligence",
      "Apple's First Proprietary C1X 5G Custom Modem with Extreme Power Efficiency",
      "Single 48MP Fusion Camera (26mm ƒ/1.6 with 2× Optical Crop)",
      "Global eSIM Architecture with No Physical SIM Tray"
    ],
    technicalDossier: [
      {
        title: "REVOLUTIONARY THINNESS & CHASSIS",
        specs: [
          { label: "Depth Dimension", value: "5.64 mm (0.22 inches) — 35% thinner than iPhone 16 Pro and 1.3mm thinner than iPhone 6" },
          { label: "Titanium Rigidity", value: "Mirror-polished Grade 5 Titanium frame with 3D-printed titanium USB-C housing" },
          { label: "Total Mass", value: "165 grams (5.82 ounces) featherweight distribution" },
          { label: "SIM Architecture", value: "100% eSIM worldwide — physical SIM tray omitted to maximize battery volume" }
        ]
      },
      {
        title: "PROPRIETARY SILICON & CONNECTIVITY",
        specs: [
          { label: "Modem Innovation", value: "Apple C1X custom 5G cellular modem with breakthrough ultra-low power draw" },
          { label: "Main Processor", value: "Apple A19 Pro (3nm N3P, 6-core CPU, 5-core GPU, 12GB RAM for on-device AI models)" },
          { label: "Wireless Standards", value: "Wi-Fi 7 (802.11be), Bluetooth 5.4, Thread, and Ultra Wideband Gen 2" }
        ]
      },
      {
        title: "OPTICS & ACOUSTICS",
        specs: [
          { label: "Rear Camera", value: "Single 48MP Fusion camera on centered plateau (26mm, ƒ/1.6, sensor-shift OIS, 1x and 2x optical crop)" },
          { label: "Front Camera", value: "18MP Center Stage front camera with square sensor for portrait & landscape selfies" },
          { label: "Speaker Chamber", value: "Acoustic mono speaker engineered specifically for ultra-thin internal resonance chamber" }
        ]
      },
      {
        title: "BATTERY & ENDURANCE",
        specs: [
          { label: "Battery Capacity", value: "3,149 mAh custom stepped cell delivering up to 27 hours of video playback" },
          { label: "Wireless Charging", value: "MagSafe wireless charging up to 20W; magnetic alignment support for snap-on MagSafe battery packs" }
        ]
      }
    ],
    finishes: [
      {
        id: "sky-blue",
        name: "Sky Blue",
        colorCode: "#7EB0D5",
        heroImage: "/devices/apple-iphone-air-sky-blue.jpg",
        editorialDescription: "Signature hero cyan tint with soft anodized reflectivity and polished titanium rails.",
        stockCount: 15
      },
      {
        id: "space-black-air",
        name: "Space Black",
        colorCode: "#1C1D1F",
        heroImage: "/devices/apple-iphone-air-black.jpg",
        editorialDescription: "Deep mirror-polished obsidian titanium with matte black rear Ceramic Shield.",
        stockCount: 20
      },
      {
        id: "cloud-white",
        name: "Cloud White",
        colorCode: "#F8F9FA",
        heroImage: "/devices/apple-iphone-air-white.jpg",
        editorialDescription: "Pure porcelain ceramic white with silver mirror titanium perimeter.",
        stockCount: 14
      },
      {
        id: "light-gold",
        name: "Light Gold",
        colorCode: "#EBD8B8",
        heroImage: "/devices/apple-iphone-air-gold.jpg",
        editorialDescription: "Warm champagne luxury luster inspired by morning sunlight.",
        stockCount: 10
      }
    ],
    capacities: [
      { size: "256GB", priceDelta: 0 },
      { size: "512GB", priceDelta: 200 },
      { size: "1TB", priceDelta: 400 }
    ],
    inStock: true
  },

  // 16. iPhone 17 Standard
  {
    id: "iphone-17",
    slug: "iphone-17",
    title: "iPhone 17",
    curatorialSubtitle: "6.3-inch 120Hz ProMotion Display, Apple A19 Silicon, Dual 48MP Fusion Optics & 256GB Base Storage.",
    category: "iphones",
    era: "COLLECTION 2026 // CORE PURITY",
    designerNote: "The baseline iPhone redesigned from the core. For the first time, 120Hz ProMotion and Always-On display come to the standard line. Saturated color-infused back glass with dual 48MP optics, doubled base storage to 256GB, and Apple N1 networking chip.",
    basePrice: 799,
    currency: "USD",
    material: "Aerospace-Grade Aluminum & Color-Infused Matte Glass",
    dimensions: "149.6 × 71.5 × 7.95 mm",
    weight: "177 grams",
    primaryImage: "/devices/iphone-17-official-og.png",
    secondaryImage: "/devices/iphone-17-official-hero.jpg",
    galleryImages: [
      {
        url: "/devices/iphone-17-official-hero.jpg",
        caption: "Official Apple Studio Overview // 6.3-inch 120Hz ProMotion Super Retina XDR",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/iphone-17-official-ceramic.jpg",
        caption: "Latest-Generation Ceramic Shield Armor // Dual 48MP Fusion & Ultra Wide",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/apple-iphone-17-display.jpg",
        caption: "Dynamic Island & ProMotion Display // Center Stage Front Camera",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/iphone-17-official-og.png",
        caption: "Five Saturated Colors // Apple A19 Silicon and N1 Networking",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "6.3-inch 120Hz ProMotion LTPO OLED Display with Always-On Technology",
      "Dual 48MP Optics (48MP Fusion + 48MP Ultra Wide with Macro and Spatial Video)",
      "Apple A19 Bionic 3nm Silicon with 8GB RAM for Apple Intelligence",
      "Doubled Base Storage to 256GB at the Same $799 Starting Price",
      "Apple-Designed N1 Wi-Fi 7 & Bluetooth Networking Chip",
      "Up to 30 Hours Continuous Video Battery Life (3,692 mAh)"
    ],
    technicalDossier: [
      {
        title: "CORE PROMOTION DISPLAY",
        specs: [
          { label: "Screen Canvas", value: "6.27-inch (marketed 6.3\") Super Retina XDR LTPO OLED (2622 × 1206 at 460 ppi)" },
          { label: "Fluid Refresh Rate", value: "1Hz-120Hz dynamic ProMotion with Always-On display capability" },
          { label: "Brightness & Armor", value: "3,000 nits peak outdoor brightness; 7-layer anti-reflective Ceramic Shield 2" }
        ]
      },
      {
        title: "DUAL 48MP OPTICS",
        specs: [
          { label: "Main Fusion Sensor", value: "48MP Fusion (26mm, ƒ/1.6, sensor-shift OIS, 100% Focus Pixels, 1x & 2x optical crop)" },
          { label: "Ultra Wide Lens", value: "48MP Ultra Wide (13mm, ƒ/2.2, 120° FOV, macro photography, spatial photos & video)" },
          { label: "Optical Zoom Range", value: "0.5x, 1x, and 2x optical zoom options" },
          { label: "Front-Facing Camera", value: "18MP Center Stage front camera with square sensor and portrait auto-framing" }
        ]
      },
      {
        title: "PERFORMANCE & CONNECTIVITY",
        specs: [
          { label: "System Processor", value: "Apple A19 (TSMC 3nm N3P, 6-core CPU, 5-core GPU with Neural Accelerators, 8GB RAM)" },
          { label: "Network Silicon", value: "Apple N1 custom networking chip (Wi-Fi 7, Bluetooth 6, Thread) + Snapdragon X80 5G" }
        ]
      },
      {
        title: "BATTERY & CHARGING",
        specs: [
          { label: "Battery Endurance", value: "3,692 mAh high-efficiency battery delivering up to 30 hours video playback" },
          { label: "Charge Standard", value: "50% in 20 minutes with 40W adapter; MagSafe wireless charging up to 25W" }
        ]
      }
    ],
    finishes: [
      {
        id: "lavender",
        name: "Lavender",
        colorCode: "#CBBEE3",
        heroImage: "/devices/apple-iphone-17-lavender.jpg",
        editorialDescription: "Delicate pastel lilac with satin-matte micro-etched glass and matched rails.",
        stockCount: 18
      },
      {
        id: "mist-blue",
        name: "Mist Blue",
        colorCode: "#9FBBD1",
        heroImage: "/devices/apple-iphone-17-mist-blue.jpg",
        editorialDescription: "Airy subtle pastel cyan inspired by coastal morning atmosphere.",
        stockCount: 16
      },
      {
        id: "sage-green",
        name: "Sage",
        colorCode: "#9EAEA2",
        heroImage: "/devices/apple-iphone-17-sage.jpg",
        editorialDescription: "Soft organic botanical eucalyptus hue with micro-textured glass.",
        stockCount: 14
      },
      {
        id: "white",
        name: "White",
        colorCode: "#F5F5F7",
        heroImage: "/devices/apple-iphone-17-white.jpg",
        editorialDescription: "Pure chalk porcelain with silver anodized perimeter band.",
        stockCount: 20
      },
      {
        id: "black",
        name: "Black",
        colorCode: "#2E3033",
        heroImage: "/devices/apple-iphone-17-black.jpg",
        editorialDescription: "Deep anodized graphite obsidian with velvet anti-fingerprint surface.",
        stockCount: 22
      }
    ],
    capacities: [
      { size: "256GB", priceDelta: 0 },
      { size: "512GB", priceDelta: 200 }
    ],
    inStock: true
  },

  // 17. iPhone 18 Pro (Flagship Vision 2026)
  {
    id: "iphone-18-pro",
    slug: "iphone-18-pro",
    title: "iPhone 18 Pro",
    curatorialSubtitle: "Next-Gen 2nm A20 Pro Silicon, Mechanical Variable Aperture (ƒ/1.48–ƒ/4.0), Apple Reference Authenticity & C2 Modem.",
    category: "iphones",
    era: "COLLECTION 2026 // FLAGSHIP VISION",
    designerNote: "The pinnacle of computational optics and quantum silicon. Debuts the world's first physical 4-stop variable aperture diaphragm on an iPhone, TSMC 2nm A20 Pro architecture, and hardware-level cryptographic pixel signing (Apple Reference Image) to guarantee visual provenance.",
    basePrice: 1199,
    currency: "USD",
    material: "Seamless Monochromatic Titanium Unibody & Ceramic Shield Matched Inlay",
    dimensions: "150.0 × 71.9 × 8.75 mm",
    weight: "211 grams",
    primaryImage: "/devices/iphone-18-pro-official-og.png",
    secondaryImage: "/devices/iphone-18-pro-official-hero.jpg",
    galleryImages: [
      {
        url: "/devices/iphone-18-pro-official-og.png",
        caption: "Official Flagship Vision // Apple A20 Pro 2nm Silicon & Total AI Architecture",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/apple-iphone-18-pro-aperture.jpg",
        caption: "World-First Physical 4-Stop Variable Aperture Iris (ƒ/1.48–ƒ/4.0)",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/iphone-18-pro-official-camera.jpg",
        caption: "All-48MP Triple Periscope System with Apple Reference Cryptographic Signing",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/iphone-18-pro-official-endframe.jpg",
        caption: "Next-Generation Deionized Vapor Chamber // Grade 5 Titanium Monolith",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "World-First Mechanical Variable Aperture (ƒ/1.48, ƒ/1.8, ƒ/2.8, ƒ/4.0 Physical Iris)",
      "Next-Generation Apple A20 Pro Silicon Built on TSMC 2nm (N2) GAA Process",
      "Apple Reference Image Hardware Cryptographic Pixel Signing for Visual Authenticity",
      "Ultra-Miniaturized Dynamic Island Capable of 3 Simultaneous Live Activities",
      "All-48MP Optics with 8× Periscope Optical Zoom and 12GB+ High-Speed Unified Memory"
    ],
    technicalDossier: [
      {
        title: "OPTICAL REVOLUTION: VARIABLE APERTURE",
        specs: [
          { label: "Mechanical Iris", value: "Physical 4-stop iris diaphragm (ƒ/1.48, ƒ/1.8, ƒ/2.8, ƒ/4.0) for authentic depth of field and optical exposure control" },
          { label: "Hardware Provenance", value: "Apple Reference Image: on-sensor cryptographic chip signing every pixel to guarantee provenance against AI manipulation" },
          { label: "Optical System", value: "48MP Fusion Variable + 48MP Ultra Wide + 48MP 8x Periscope Telephoto" }
        ]
      },
      {
        title: "TSMC 2nm SILICON ARCHITECTURE",
        specs: [
          { label: "Foundry Node", value: "TSMC 2nm (N2) Gate-All-Around (GAA) nanosheet transistor architecture" },
          { label: "Processor", value: "Apple A20 Pro: 6-core CPU (2 super performance + 4 efficiency), 7-core GPU with dedicated neural accelerators" },
          { label: "Memory & Bus", value: "12GB Unified Memory with +50% memory bandwidth via side-by-side die packaging" }
        ]
      },
      {
        title: "CELLULAR & DISPLAY",
        specs: [
          { label: "Modem", value: "Apple C2 custom second-generation modem with full mmWave and sub-6GHz support" },
          { label: "Display Canvas", value: "6.3-inch Super Retina XDR OLED with reduced Dynamic Island footprint showing 3 Live Activities" }
        ]
      }
    ],
    finishes: [
      {
        id: "burgundy-wine",
        name: "Burgundy Wine",
        colorCode: "#5E1924",
        heroImage: "/devices/apple-iphone-18-pro-burgundy.jpg",
        editorialDescription: "Deep royal wine ruby with subtle metallic luster — the signature hero color.",
        stockCount: 14
      },
      {
        id: "glacier-blue",
        name: "Glacier Blue",
        colorCode: "#A2B9C8",
        heroImage: "/devices/apple-iphone-18-pro-glacier.jpg",
        editorialDescription: "Icy crystalline frost blue with high-luster perimeter frame.",
        stockCount: 12
      },
      {
        id: "silver-18",
        name: "Silver",
        colorCode: "#E1E2E4",
        heroImage: "/devices/apple-iphone-18-pro-silver.jpg",
        editorialDescription: "Classic bright silver aerospace luster.",
        stockCount: 16
      },
      {
        id: "obsidian-black",
        name: "Obsidian Black",
        colorCode: "#18181A",
        heroImage: "/devices/apple-iphone-18-pro-black.jpg",
        editorialDescription: "Darkest mirror-polished obsidian titanium unibody with matched ceramic shield.",
        stockCount: 10
      }
    ],
    capacities: [
      { size: "256GB", priceDelta: 0 },
      { size: "512GB", priceDelta: 200 },
      { size: "1TB", priceDelta: 400 },
      { size: "2TB", priceDelta: 800 }
    ],
    inStock: true
  },

  // 18. iPhone 17e
  {
    id: "iphone-17e",
    slug: "iphone-17e",
    title: "iPhone 17e",
    curatorialSubtitle: "Durable Ceramic Shield 2. 48MP Fusion Camera, Long Battery Life, 256GB Storage & A19 Silicon Built for Apple Intelligence.",
    category: "iphones",
    era: "COLLECTION 2026 // ACCESSIBLE BRILLIANCE",
    designerNote: "Engineered to deliver Apple Intelligence, 48MP computational photography, and all-day endurance in a beautifully sculpted aerospace aluminum unibody with Ceramic Shield 2 front protection.",
    basePrice: 599,
    currency: "USD",
    material: "Aerospace-Grade Aluminum & Durable Ceramic Shield 2",
    dimensions: "146.7 × 71.5 × 7.80 mm",
    weight: "168 grams",
    primaryImage: "/devices/iphone-17e-official-og.png",
    secondaryImage: "/devices/iphone-17e-official-hero.jpg",
    galleryImages: [
      {
        url: "/devices/iphone-17e-official-hero.jpg",
        caption: "Soft Pink Aluminum Architecture // 48MP Fusion Camera with 2x Telephoto Crop",
        plateNumber: "PLATE 01"
      },
      {
        url: "/devices/iphone-17e-official-design.jpg",
        caption: "Durable Ceramic Shield 2 Armor // Ultra-Durable Scratch & Drop Resistance",
        plateNumber: "PLATE 02"
      },
      {
        url: "/devices/apple-iphone-17e-colors.jpg",
        caption: "Finish Selection // Soft Pink, Pure White, and Anodized Black",
        plateNumber: "PLATE 03"
      },
      {
        url: "/devices/iphone-17e-official-og.png",
        caption: "Apple Intelligence & iOS 27 Architecture Powered by Apple A19 Silicon",
        plateNumber: "PLATE 04"
      }
    ],
    specHighlights: [
      "Apple A19 Silicon Built Specifically for On-Device Apple Intelligence",
      "48MP Fusion Camera System with Optical-Quality 2× Telephoto Crop",
      "Durable Ceramic Shield 2 Front Glass with 2x Drop Toughness",
      "256GB Base Storage & Up to 26 Hours Video Playback Battery Life",
      "Action Button & Fast USB-C Charging Interface"
    ],
    technicalDossier: [
      {
        title: "COMPUTATIONAL SILICON & PERFORMANCE",
        specs: [
          { label: "Processor", value: "Apple A19 SoC (3nm lithography, 6-core CPU, 5-core GPU, 16-core Neural Engine)" },
          { label: "Intelligence Engine", value: "Native Apple Intelligence integration with Private Cloud Compute" }
        ]
      },
      {
        title: "OPTICS & IMAGING",
        specs: [
          { label: "Fusion Main Camera", value: "48MP Fusion (26mm, ƒ/1.6, sensor-shift OIS, 100% Focus Pixels, 2x 12MP telephoto)" },
          { label: "Front Camera", value: "12MP TrueDepth front camera with autofocus and Focus Pixels" }
        ]
      },
      {
        title: "DISPLAY & ARMOR",
        specs: [
          { label: "Display Canvas", value: "6.1-inch Super Retina XDR OLED (2556 × 1179 at 460 ppi)" },
          { label: "Glass Armor", value: "Ceramic Shield 2 with enhanced scratch and impact resistance" }
        ]
      },
      {
        title: "BATTERY & STORAGE",
        specs: [
          { label: "Storage", value: "256GB base storage (upgradeable to 512GB)" },
          { label: "Battery Playback", value: "Up to 26 hours continuous video playback; fast charge 50% in 30 minutes" }
        ]
      }
    ],
    finishes: [
      {
        id: "soft-pink-17e",
        name: "Soft Pink",
        colorCode: "#E8B4B8",
        heroImage: "/devices/iphone-17e-official-hero.jpg",
        editorialDescription: "Delicate pastel blush anodized aluminum with satin matte back.",
        stockCount: 15
      },
      {
        id: "white-17e",
        name: "White",
        colorCode: "#F5F5F7",
        heroImage: "/devices/apple-iphone-17-white.jpg",
        editorialDescription: "Clean porcelain white with silver aluminum frame.",
        stockCount: 18
      },
      {
        id: "black-17e",
        name: "Black",
        colorCode: "#2E3033",
        heroImage: "/devices/apple-iphone-17-black.jpg",
        editorialDescription: "Classic midnight obsidian anodized aluminum.",
        stockCount: 20
      }
    ],
    capacities: [
      { size: "256GB", priceDelta: 0 },
      { size: "512GB", priceDelta: 150 }
    ],
    inStock: true
  },

  // 18. MacBook Pro 16" (M5 Max Silicon)
  {
    id: "macbook-pro-16-m5-max",
    slug: "macbook-pro-16-m5-max",
    title: "MacBook Pro 16\" (M5 Max)",
    curatorialSubtitle: "16-Core CPU, 40-Core GPU, 128GB Unified Memory with Quantum Dot Mini-LED Display.",
    category: "macbooks",
    era: "COLLECTION 2026 // PRO WORKSTATION",
    designerNote: "Built for unprecedented generative AI compile workflows, 8K spatial video rendering, and raw computational dominance in an anodized Space Obsidian unibody.",
    basePrice: 3499,
    currency: "USD",
    material: "100% Recycled Aluminum Enclosure & Liquid Retina XDR Nano-Texture",
    dimensions: "355.7 × 248.1 × 16.8 mm",
    weight: "2.16 kg",
    primaryImage: "/devices/mbp14-spaceblack-select-202410.png",
    secondaryImage: "/devices/mbp14-silver-select-202410.png",
    galleryImages: [
      {
        url: "/devices/mbp14-spaceblack-select-202410.png",
        caption: "M5 Max Architecture // 128GB Unified Memory Workstation",
        plateNumber: "PLATE 01"
      }
    ],
    specHighlights: [
      "Apple M5 Max Silicon with 16-Core CPU and 40-Core GPU",
      "16.2-inch Liquid Retina XDR with Quantum Dot Film",
      "Thunderbolt 5 Connectivity with 120 Gb/s Bandwidth",
      "Up to 24 Hours of Professional Workstation Battery Life"
    ],
    technicalDossier: [
      {
        title: "PRO PERFORMANCE",
        specs: [
          { label: "Silicon Engine", value: "Apple M5 Max 16-core CPU (12 performance, 4 efficiency)" },
          { label: "Memory Subsystem", value: "128GB Unified Memory with 800GB/s bandwidth" }
        ]
      }
    ],
    finishes: [
      {
        id: "space-obsidian-m5",
        name: "Space Obsidian",
        colorCode: "#1D1D20",
        heroImage: "/devices/mbp14-spaceblack-select-202410.png",
        editorialDescription: "Ultra-dark anodized finish with breakthrough carbon seal.",
        stockCount: 9
      },
      {
        id: "silver-m5",
        name: "Silver",
        colorCode: "#E3E4E5",
        heroImage: "/devices/mbp14-silver-select-202410.png",
        editorialDescription: "Classic aerospace aluminum finish.",
        stockCount: 12
      }
    ],
    capacities: [
      { size: "1TB SSD · 64GB RAM", priceDelta: 0 },
      { size: "2TB SSD · 128GB RAM", priceDelta: 800 },
      { size: "4TB SSD · 128GB RAM", priceDelta: 1600 }
    ],
    inStock: true
  },

  // 19. Apple Watch Ultra 3
  {
    id: "apple-watch-ultra-3",
    slug: "apple-watch-ultra-3",
    title: "Apple Watch Ultra 3",
    curatorialSubtitle: "49mm Grade 5 Titanium with 3,500-Nit MicroLED Display & Dual-Frequency Satellite Emergency Link.",
    category: "watches",
    era: "COLLECTION 2026 // EXPEDITION HORIZON",
    designerNote: "Engineered for deep-sea diving down to 100 meters, high-altitude navigation, and up to 72 hours of low-power expedition battery life.",
    basePrice: 799,
    currency: "USD",
    material: "Aerospace Grade 5 Titanium & Sapphire Crystal Lens",
    dimensions: "49 × 44 × 14.4 mm",
    weight: "61.4 grams",
    primaryImage: "/devices/watch-card-40-ultra2-202409.png",
    secondaryImage: "/devices/watch-card-40-s10-202409.png",
    galleryImages: [
      {
        url: "/devices/watch-card-40-ultra2-202409.png",
        caption: "Grade 5 Titanium Rugged Enclosure // MicroLED 3,500-Nit Visibility",
        plateNumber: "PLATE 01"
      }
    ],
    specHighlights: [
      "Ultra-Bright 3,500-Nit MicroLED Display with Always-On Red Mode",
      "Direct Satellite Two-Way Emergency Messaging and Telemetry",
      "Up to 72 Hours of Battery Life in Low Power Mode",
      "Certified EN13319 Scuba Dive Computer to 40 Meters"
    ],
    technicalDossier: [
      {
        title: "OUTDOOR SENSORS",
        specs: [
          { label: "Display Technology", value: "Self-emissive MicroLED delivering 3,500 nits sunlight clarity" },
          { label: "Emergency Beacon", value: "86-decibel dual-speaker siren audible up to 600 feet" }
        ]
      }
    ],
    finishes: [
      {
        id: "natural-titanium-u3",
        name: "Natural Titanium",
        colorCode: "#8C857B",
        heroImage: "/devices/watch-card-40-ultra2-202409.png",
        editorialDescription: "Raw bead-blasted satin titanium case.",
        stockCount: 15
      },
      {
        id: "black-titanium-u3",
        name: "Black Titanium",
        colorCode: "#222224",
        heroImage: "/devices/watch-card-40-s10-202409.png",
        editorialDescription: "Diamond-Like Carbon (DLC) black titanium finish.",
        stockCount: 11
      }
    ],
    inStock: true
  },

  // 20. Apple 35W Dual USB-C Compact Power Adapter
  {
    id: "apple-35w-dual-usbc",
    slug: "apple-35w-dual-usbc-adapter",
    title: "Apple 35W Dual USB-C Compact Power Adapter",
    curatorialSubtitle: "Simultaneous high-speed fast charging for iPhone and Apple Watch or AirPods.",
    category: "accessories",
    era: "COLLECTION 2026 // POWER INTERFACE",
    designerNote: "Compact folding pins design. Dynamically shares 35W power across two USB-C ports to fast charge an iPhone to 50% in 20 minutes while simultaneously charging AirPods.",
    basePrice: 59,
    currency: "USD",
    material: "Flame-Retardant Polycarbonate & Nickel-Plated Folding Pins",
    dimensions: "Compact Travel Form Factor",
    weight: "105 grams",
    primaryImage: "/devices/MX6X3.png",
    secondaryImage: "/devices/MX6Y3.png",
    galleryImages: [
      {
        url: "/devices/MX6X3.png",
        caption: "Dual USB-C Port Array // Dynamic Intelligent Power Balancing",
        plateNumber: "PLATE 01"
      }
    ],
    specHighlights: [
      "35W Total Dynamic Output across Dual USB-C Ports",
      "Foldable AC prongs for compact travel ergonomics",
      "Charges iPhone 17/16 Pro to 50% in 20 minutes",
      "Compatible with all Mac, iPhone, iPad, Apple Watch, and AirPods models"
    ],
    technicalDossier: [
      {
        title: "POWER SPECIFICATIONS",
        specs: [
          { label: "Output Modes", value: "35W Single Port, or 27W + 8W Dual Port intelligent allocation" },
          { label: "Port Standard", value: "Dual USB-C with USB Power Delivery 3.0" }
        ]
      }
    ],
    inStock: true
  },

  // 21. MagSafe Protective Case with Camera Control
  {
    id: "magsafe-case-camera-control",
    slug: "magsafe-silicone-case-camera-control",
    title: "MagSafe Silicone Case with Camera Control",
    curatorialSubtitle: "Sapphire crystal conductive surface seamlessly transmits finger swipes and clicks to Camera Control.",
    category: "accessories",
    era: "COLLECTION 2026 // PROTECTION SHIELD",
    designerNote: "Custom-crafted with an embedded sapphire crystal layer that bridges your capacitive touch directly to the Camera Control button without latency.",
    basePrice: 49,
    currency: "USD",
    material: "Liquid Silicone Exterior & Microfiber Suede Lining",
    dimensions: "Form-Fitted Precision Shell",
    weight: "38 grams",
    primaryImage: "/devices/MM0Y3.png",
    secondaryImage: "/devices/MX6Y3.png",
    galleryImages: [
      {
        url: "/devices/MM0Y3.png",
        caption: "Sapphire Crystal Conductive Bridge // Zero-Latency Gesture Detection",
        plateNumber: "PLATE 01"
      }
    ],
    specHighlights: [
      "Conductive sapphire crystal button interface for Camera Control",
      "Integrated neodymium MagSafe magnetic alignment ring",
      "Soft-touch liquid silicone with shock-absorbing microfiber lining",
      "Raised 1.2mm defensive lip around display and camera plateau"
    ],
    technicalDossier: [
      {
        title: "MATERIALS & RESISTANCE",
        specs: [
          { label: "Button Mechanism", value: "Conductive sapphire crystal with custom capacitive trace" },
          { label: "Drop Protection", value: "Military-spec 2.4-meter drop certified shock absorption" }
        ]
      }
    ],
    inStock: true
  }
];

export const HERO_PRODUCT: CosmoProduct = COSMO_CATALOG[0];
