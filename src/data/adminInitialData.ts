import { 
  AdminUser, 
  AdminCustomer, 
  AdminBooking, 
  AdminService, 
  AdminPackage, 
  AdminPortfolioItem, 
  AdminGalleryAlbum, 
  AdminReview, 
  AdminMessage, 
  AdminNotification, 
  StudioSettings 
} from '../types/admin';

export const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'adm-001',
  name: 'Studio Administrator',
  email: 'admin@ngstudio.com',
  phone: '9842178068',
  role: 'Studio Director',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  lastLogin: 'Just now'
};

export const INITIAL_STUDIO_SETTINGS: StudioSettings = {
  name: 'NG DIGITAL STUDIO',
  tagline: 'Add Glamour to Your Memories.',
  email: 'ng.digitalstudiomdu@gmail.com',
  phone: '9842178068',
  address: '39A/46 Hannumar Kovil Padithurai, Simmakkal, Madurai - 625001',
  workingHours: 'Mon - Sun: 9:00 AM - 8:30 PM',
  currencySymbol: '₹',
  autoConfirmBookings: false,
  notificationEmail: 'alerts@ngdigitalstudio.com',
  socialLinks: {
    instagram: 'https://instagram.com/ngdigitalstudio',
    facebook: 'https://facebook.com/ngdigitalstudio',
    youtube: 'https://youtube.com/@ngdigitalstudio'
  }
};

export const INITIAL_CUSTOMERS: AdminCustomer[] = [];

export const INITIAL_BOOKINGS: AdminBooking[] = [];

export const INITIAL_SERVICES: AdminService[] = [
  {
    id: 'serv-1',
    title: 'Wedding Photography',
    category: 'Wedding',
    startingPrice: '₹45,000',
    description: 'Master South Indian & North Indian marriage coverage, Muhurtham rituals, high-fashion portraits, and candid emotions.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    features: ['Dual Candid Masters', '4K Drone Aerials', 'Italian Matte Album', 'Express Teaser Video'],
    isActive: true,
    totalBookings: 84
  },
  {
    id: 'serv-2',
    title: 'Birthday Photography',
    category: 'Celebration',
    startingPrice: '₹15,000',
    description: 'Joyful 1st birthday milestones, theme setups, cake smashing candid portraits, and dynamic party video reels.',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
    features: ['Theme Backdrop Lighting', 'Cake Smash Candids', 'Family Group Portraits', 'HD Video Highlights'],
    isActive: true,
    totalBookings: 38
  },
  {
    id: 'serv-3',
    title: 'Pre-Wedding Shoot',
    category: 'Couples',
    startingPrice: '₹30,000',
    description: 'Cinematic romantic couple stories shot at scenic beach destinations, heritage temples, and luxury resorts.',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    features: ['3 Costume Changes', 'Drone Beach Sequences', '4K Teaser Film', 'Digital High-Res Proofs'],
    isActive: true,
    totalBookings: 42
  },
  {
    id: 'serv-4',
    title: 'Post-Wedding Shoot',
    category: 'Couples',
    startingPrice: '₹35,000',
    description: 'Relaxed, intimate honeymoon and coastal portraits after the wedding hustle with cinematic lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    features: ['Resort & Beach Access', 'Sunset Golden Hour', 'Framed Master Print', 'Express Editing'],
    isActive: true,
    totalBookings: 19
  },
  {
    id: 'serv-5',
    title: 'Outdoor Portraits',
    category: 'Portraits',
    startingPrice: '₹20,000',
    description: 'Natural light creative editorial portraits, drone aerial perspectives, and golden hour scenic sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    features: ['Location Scout Guide', 'Natural Light Masters', 'Skin Retouching', 'Social Media Cuts'],
    isActive: true,
    totalBookings: 27
  },
  {
    id: 'serv-6',
    title: 'Puberty Photography',
    category: 'Traditional',
    startingPrice: '₹25,000',
    description: 'Sacred Manjal Neerattu ceremony, maternal uncle traditions, ceremonial bathing, and royal silk saree portraits.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    features: ['Seer Procession Coverage', 'Silk Album Deliverable', 'Traditional Stage Setup', 'Family Tree Archive'],
    isActive: true,
    totalBookings: 31
  },
  {
    id: 'serv-7',
    title: 'Candid Moments',
    category: 'Creative',
    startingPrice: '₹30,000',
    description: 'Unposed, organic laughter, stolen glances, tears of joy, and genuine family emotions captured discreetly.',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
    features: ['Silent Shutter Primes', 'Emotion-Focused Grading', 'Raw Stills Access', 'Online Client Gallery'],
    isActive: true,
    totalBookings: 65
  },
  {
    id: 'serv-8',
    title: 'Newborn Baby Shoot',
    category: 'Baby',
    startingPrice: '₹18,000',
    description: 'Gentle, temperature-controlled studio sessions with soft sanitized props, wraps, and sleeping baby poses.',
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    features: ['Sanitized Wooden Props', 'Parent Posing Included', 'Heated Studio Bay', 'Memory Keepsake Book'],
    isActive: true,
    totalBookings: 24
  },
  {
    id: 'serv-9',
    title: 'Engagement Ceremony',
    category: 'Couples',
    startingPrice: '₹28,000',
    description: 'Ring exchange ceremony, traditional Nischayathartham documentation, family portraits, and teaser films.',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
    features: ['Stage Ring Exchange', 'Candid Guest Moments', 'Teaser Reel in 48h', 'Embossed Album'],
    isActive: true,
    totalBookings: 36
  },
  {
    id: 'serv-10',
    title: 'Housewarming Grihapravesam',
    category: 'Family',
    startingPrice: '₹20,000',
    description: 'Grihapravesam rituals, boiling milk tradition, Ganapathi homam, architectural shots of your new residence.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    features: ['Dawn Pooja Coverage', 'Home Architectural Views', 'Homam Ritual Portraits', 'Digital Delivery'],
    isActive: true,
    totalBookings: 22
  },
  {
    id: 'serv-11',
    title: 'Baby Shower Seemantham',
    category: 'Family',
    startingPrice: '₹22,000',
    description: 'Valaikappu and Seemantham rituals, glass bangle ceremonies, mother-to-be glow portraits, and family blessings.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    features: ['Bangle Ceremony Closeups', 'Maternity Solo Session', 'Family Blessing Groups', 'High-Res Download'],
    isActive: true,
    totalBookings: 26
  },
  {
    id: 'serv-12',
    title: 'Fashion & Modelling Lookbook',
    category: 'Fashion',
    startingPrice: '₹25,000',
    description: 'High-fashion model lookbooks, designer apparel portfolio, high-key studio strobe lighting, and retouched headshots.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    features: ['Strobe & Softbox Setup', 'Magazine Retouching', 'Lookbook Comp Card', 'Commercial Rights'],
    isActive: true,
    totalBookings: 15
  },
  {
    id: 'serv-13',
    title: 'Product & Commercial',
    category: 'Commercial',
    startingPrice: '₹20,000',
    description: 'E-commerce white-background packshots, lifestyle product sets, macro jewelry photography, and brand catalogs.',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    features: ['Pure White Studio Pack', 'Macro Jewelry Focus', 'E-Commerce Optimized', 'TIFF & RAW Delivery'],
    isActive: true,
    totalBookings: 18
  },
  {
    id: 'serv-14',
    title: 'Traditional Marriage Videography',
    category: 'Video',
    startingPrice: '₹35,000',
    description: 'Complete multi-camera traditional 4K coverage of Muhurtham and Reception with broadcast crane and live streaming.',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
    features: ['Multi-Cam 4K Setup', 'Live Stream Feed', 'Full Event Master Edit', 'Pen Drive Heirloom'],
    isActive: true,
    totalBookings: 47
  },
  {
    id: 'serv-15',
    title: 'Cinematic Cinema Story',
    category: 'Video',
    startingPrice: '₹50,000',
    description: 'Award-winning cinema aesthetic, anamorphic lenses, aerial drone storytelling, custom score composition, and 4K teasers.',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    features: ['Cinema Prime Lenses', 'Color Grade Grading', 'Drone 4K Sequences', 'Instagram 60s Reel'],
    isActive: true,
    totalBookings: 53
  }
];

export const INITIAL_PACKAGES: AdminPackage[] = [
  {
    id: 'pkg-budget',
    name: 'BUDGET',
    price: '₹35,000',
    rawPrice: 35000,
    duration: 'Full Event Coverage',
    serviceCategory: 'Wedding Photography',
    features: [
      'Traditional Photographer',
      'HD Video',
      '15 × 10 Album with 30 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isPopular: false
  },
  {
    id: 'pkg-luxury',
    name: 'LUXURY',
    price: '₹50,000',
    rawPrice: 50000,
    duration: 'Full Event Coverage',
    serviceCategory: 'Wedding Photography',
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isPopular: true
  },
  {
    id: 'pkg-semi-luxury',
    name: 'SEMI-LUXURY',
    price: '₹65,000',
    rawPrice: 65000,
    duration: 'Full Event Coverage',
    serviceCategory: 'Wedding Photography',
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      'Candid Videography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isPopular: false
  },
  {
    id: 'pkg-gen-budget',
    name: 'BUDGET (Birthdays, Puberty & Shoots)',
    price: '₹30,000',
    rawPrice: 30000,
    duration: 'Full Event / Session Coverage',
    serviceCategory: 'Birthdays, Puberty & Shoots',
    features: [
      'Traditional Photographer',
      'HD Video',
      '15 × 10 Album with 30 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isPopular: false
  },
  {
    id: 'pkg-gen-luxury',
    name: 'LUXURY (Birthdays, Puberty & Shoots)',
    price: '₹40,000',
    rawPrice: 40000,
    duration: 'Full Event / Session Coverage',
    serviceCategory: 'Birthdays, Puberty & Shoots',
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isPopular: true
  },
  {
    id: 'pkg-gen-semi-luxury',
    name: 'SEMI-LUXURY (Birthdays, Puberty & Shoots)',
    price: '₹60,000',
    rawPrice: 60000,
    duration: 'Full Event / Session Coverage',
    serviceCategory: 'Birthdays, Puberty & Shoots',
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      'Candid Videography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isPopular: false
  }
];

export const INITIAL_PORTFOLIO: AdminPortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Royal Muhurtham Talambralu',
    category: 'Weddings',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    clientName: 'Priya & Vignesh',
    location: 'MRC Nagar, Chennai',
    uploadDate: '01 Dec 2026',
    isFeatured: true,
    views: 1420
  },
  {
    id: 'port-2',
    title: 'First Birthday Crown Smiles',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    clientName: 'Arun & Family',
    location: 'T. Nagar, Chennai',
    uploadDate: '28 Nov 2026',
    isFeatured: true,
    views: 890
  },
  {
    id: 'port-3',
    title: 'Golden Sunset at Kovalam Shore',
    category: 'Pre-Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    clientName: 'Divya & Anand',
    location: 'Kovalam Beach, ECR',
    uploadDate: '25 Nov 2026',
    isFeatured: true,
    views: 2150
  },
  {
    id: 'port-4',
    title: 'Traditional Manjal Neerattu Ritual',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    clientName: 'Soundarya Family',
    location: 'Mylapore, Chennai',
    uploadDate: '20 Nov 2026',
    isFeatured: false,
    views: 1120
  },
  {
    id: 'port-5',
    title: 'Sleeping Angel Newborn Nest',
    category: 'Maternity',
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    clientName: 'Ananya S.',
    location: 'NG Studio Bay 1',
    uploadDate: '15 Nov 2026',
    isFeatured: true,
    views: 940
  },
  {
    id: 'port-6',
    title: 'Silk & Gold Ring Exchange',
    category: 'Weddings',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    clientName: 'Divya & Rahul',
    location: 'Feathers Hotel',
    uploadDate: '12 Nov 2026',
    isFeatured: false,
    views: 1380
  },
  {
    id: 'port-7',
    title: 'Luxury Saree Editorial Studio Shoot',
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    clientName: 'Silk Heritage Brand',
    location: 'NG Studio Bay 2',
    uploadDate: '05 Nov 2026',
    isFeatured: true,
    views: 1650
  },
  {
    id: 'port-8',
    title: 'Kumbakonam Temple Corridor Couple',
    category: 'Candid',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    clientName: 'Sanjay & Keerthi',
    location: 'Kumbakonam',
    uploadDate: '02 Nov 2026',
    isFeatured: false,
    views: 310
  }
];

export const INITIAL_GALLERY_ALBUMS: AdminGalleryAlbum[] = [
  {
    id: 'alb-1',
    title: 'Wedding Gallery',
    category: 'Weddings',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    photoCount: 2,
    createdDate: '10 Nov 2026',
    description: 'Grand South Indian and destination marriage highlights from recent seasons.',
    photos: [
      { id: 'gp-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', caption: 'Muhurtham Bliss', uploadedAt: '10 Nov 2026' },
      { id: 'gp-2', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', caption: 'Garland Exchange Joy', uploadedAt: '10 Nov 2026' }
    ]
  },
  {
    id: 'alb-2',
    title: 'Birthday Gallery',
    category: 'Events',
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    photoCount: 1,
    createdDate: '12 Nov 2026',
    description: 'Vibrant 1st birthdays, milestone parties, and thematic cake smash portraits.',
    photos: [
      { id: 'gp-3', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80', caption: 'Cake Smash Fun', uploadedAt: '12 Nov 2026' }
    ]
  },
  {
    id: 'alb-3',
    title: 'Pre-Wedding Gallery',
    category: 'Pre-Wedding',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    photoCount: 1,
    createdDate: '15 Nov 2026',
    description: 'Cinematic destination shoots across Mahabalipuram, Pondicherry and hill stations.',
    photos: [
      { id: 'gp-4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', caption: 'Sunset Silhouette', uploadedAt: '15 Nov 2026' }
    ]
  },
  {
    id: 'alb-4',
    title: 'Outdoor Gallery',
    category: 'Candid',
    coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    photoCount: 1,
    createdDate: '18 Nov 2026',
    description: 'Natural light creative editorial portraits and atmospheric scenic sessions.',
    photos: [
      { id: 'gp-5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', caption: 'Heritage Architecture', uploadedAt: '18 Nov 2026' }
    ]
  },
  {
    id: 'alb-5',
    title: 'Baby Gallery',
    category: 'Events',
    coverImage: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    photoCount: 1,
    createdDate: '20 Nov 2026',
    description: 'Adorable studio newborn moments, baby showers, and maternal glow portraits.',
    photos: [
      { id: 'gp-6', url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80', caption: 'Peaceful Slumber', uploadedAt: '20 Nov 2026' }
    ]
  },
  {
    id: 'alb-6',
    title: 'Events Gallery',
    category: 'Events',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    photoCount: 1,
    createdDate: '22 Nov 2026',
    description: 'Traditional Housewarmings, Puberty ceremonies, and festive celebrations.',
    photos: [
      { id: 'gp-7', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', caption: 'Traditional Blessings', uploadedAt: '22 Nov 2026' }
    ]
  }
];

export const INITIAL_REVIEWS: AdminReview[] = [];

export const INITIAL_MESSAGES: AdminMessage[] = [];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [];
