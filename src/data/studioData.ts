import { ServiceItem, PackageItem, GalleryPhoto, CustomerReview } from '../types';

export const STUDIO_INFO = {
  name: 'NG DIGITAL STUDIO',
  slogan: 'Add Glamour to Your Memories.',
  tagline: 'Preserving your most cherished milestones with cinematic grandeur and timeless artistry.',
  phone: '9842178068',
  altPhone: '9842178068',
  whatsapp: '919842178068',
  whatsappDirectUrl: 'https://wa.me/919842178068?text=Hello%20NG%20Digital%20Studio,%20I%20would%20like%20to%20inquire%20about%20booking%20photography%20and%20videography%20services.',
  email: 'ng.digitalstudiomdu@gmail.com',
  address: '39A/46 Hannumar Kovil Padithurai, Simmakkal, Madurai - 625001',
  hours: 'Monday – Sunday: 9:00 AM – 9:30 PM (24/7 Event Booking Assistance)',
  instagram: 'https://www.instagram.com/ng_digital_photography?psln=MTV5eG1hNG90czM5aA==',
  facebook: 'https://facebook.com/ngdigitalstudio',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125766.1963953539!2d78.0404217154563!3d9.925200676450654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c582b1189633%3A0xdc955b7264f63933!2sMadurai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1708640000000!5m2!1sen!2sin',
  stats: [
    { label: 'Years of Excellence', value: '12+' },
    { label: 'Celebrations Captured', value: '1,450+' },
    { label: 'Happy Families', value: '2,800+' },
    { label: 'Cinematic 4K Films', value: '950+' },
  ]
};

// 6 Home Highlights
export const HOME_SERVICES_HIGHLIGHT = [
  {
    id: 'photo-core',
    title: 'Professional Photography',
    iconName: 'Camera',
    desc: 'High-definition framing with prime cinema lenses capturing true emotions and timeless portraits.',
    badge: 'Master Artistry',
    serviceRef: 'wedding-photography'
  },
  {
    id: 'cinema-film',
    title: 'Cinematic Videography',
    iconName: 'Film',
    desc: 'Bespoke 4K story-driven highlight films with emotional sound design and cinematic color grading.',
    badge: '4K Ultra HD',
    serviceRef: 'cinematic-videography'
  },
  {
    id: 'trad-video',
    title: 'Videography',
    iconName: 'Video',
    desc: 'Complete multi-camera event coverage ensuring every ritual, greeting, and tradition is fully preserved.',
    badge: 'Full Coverage',
    serviceRef: 'marriage-videography'
  },
  {
    id: 'drone-aerial',
    title: 'Drone Coverage',
    iconName: 'Compass',
    desc: 'Breathtaking 4K aerial perspectives showcasing the grandeur of your venue and processions.',
    badge: 'Licensed Pilots',
    serviceRef: 'outdoor-shoot'
  },
  {
    id: 'album-luxury',
    title: 'Premium Album Design',
    iconName: 'BookOpen',
    desc: 'Handcrafted Italian metallic & feather-touch leather photobooks with archival longevity.',
    badge: 'Archival Print',
    serviceRef: 'wedding-photography'
  },
  {
    id: 'delivery-speed',
    title: 'Fast Photo Delivery',
    iconName: 'Zap',
    desc: 'Instant teaser preview within 48 hours and rapid cloud gallery delivery for friends and family.',
    badge: '48h Teaser',
    serviceRef: 'candid-photography'
  }
];

// Carousel items for About Page
export const CAROUSEL_ITEMS = [
  {
    id: 'c1',
    category: 'Wedding Photography',
    title: 'Bride & Groom',
    image: '/images%20of%20studio/bride%20groom.jpg',
  },
  {
    id: 'c2',
    category: 'Wedding Photography',
    title: 'Wedding Ceremony',
    image: '/images%20of%20studio/home%20wedding.jpg',
  },
  {
    id: 'c3',
    category: 'Candid Photography',
    title: 'Candid Moments',
    image: '/images%20of%20studio/candit.jpg',
  },
  {
    id: 'c4',
    category: 'Family Photography',
    title: 'Family Moments',
    image: '/images%20of%20studio/family.jpg',
  },
  {
    id: 'c5',
    category: 'Couple Photography',
    title: 'Couple Portraits',
    image: '/images%20of%20studio/couple.jpg',
  },
  {
    id: 'c6',
    category: 'Wedding Photography',
    title: 'Reception',
    image: '/images%20of%20studio/reception.jpg',
  },
  {
    id: 'c7',
    category: 'Birthday Photography',
    title: 'Birthday Celebration',
    image: '/images%20of%20studio/birthday%20home.jpg',
  },
  {
    id: 'c8',
    category: 'Modelling Photography',
    title: 'Model Portrait',
    image: '/images%20of%20studio/model.jpg',
  },
  {
    id: 'c9',
    category: 'Wedding Photography',
    title: 'Wedding Moments',
    image: '/images%20of%20studio/474452610_1746948942539795_8333476928887844059_n.jpg',
  },
];

// All 15 detailed services
export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'wedding-photography',
    name: 'Wedding Photography',
    categoryTag: 'Weddings',
    shortDesc: 'Royal, soulful, and timeless visual narratives that capture every sacred ritual and joyful emotion of your special day.',
    heroSubtitle: 'Every smile, every emotion, every tradition — beautifully captured.',
    fullDesc: 'Your wedding day is a tapestry of intimate gazes, sacred rituals, tears of joy, and vibrant celebrations. At NG Digital Studio, our signature wedding photography blends cinematic storytelling with photojournalistic precision, ensuring that the essence of your sacred vows remains alive for generations.',
    startingPrice: '₹45,000',
    iconName: 'Heart',
    image: '/images%20of%20studio/wedding%20ci.jpg',
    whatWeCapture: [
      {
        title: 'Bride & Groom',
        description: 'Bespoke solo portraits highlighting royal attire, jewelry, intricate mehndi, and regal composure.',
        image: '/images%20of%20studio/bride%20groom.jpg'
      },
      {
        title: 'Wedding Ceremony',
        description: 'Sacred Muhurtham, Mangalsutra tying, Kanyadaan, Saptapadi, and exchange of holy garlands.',
        image: '/images%20of%20studio/home%20wedding.jpg'
      },
      {
        title: 'Candid Moments',
        description: 'Unposed laughter, silent tears of blessing, heartfelt hugs, and spontaneous celebration bursts.',
        image: '/images%20of%20studio/candit.jpg'
      },
      {
        title: 'Family Moments',
        description: 'Generations coming together in joyous warmth, elders’ heartfelt blessings, and sibling banters.',
        image: '/images%20of%20studio/family.jpg'
      },
      {
        title: 'Couple Portraits',
        description: 'Cinematic, romantically styled frames with golden-hour ambient lighting and dreamy compositions.',
        image: '/images%20of%20studio/couple.jpg'
      },
      {
        title: 'Reception',
        description: 'Grand entrances, stage glamor, dazzling lights, music, speeches, and lively dance floor energy.',
        image: '/images%20of%20studio/reception.jpg'
      }
    ],
    highlightVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    featuredGallery: [
  {
    id: 'w1',
    url: '/images%20of%20studio/bride%20groom.jpg',
    title: 'Bride & Groom',
    tag: 'Wedding'
  },
  {
    id: 'w2',
    url: '/images%20of%20studio/reception.jpg',
    title: 'Wedding Reception',
    tag: 'Reception'
  },
  {
    id: 'w3',
    url: '/images%20of%20studio/couple.jpg',
    title: 'Couple Portrait',
    tag: 'Couple'
  },
  {
    id: 'w4',
    url: '/images%20of%20studio/family.jpg',
    title: 'Family Moments',
    tag: 'Family'
  },
  {
    id: 'w5',
    url: '/images%20of%20studio/candit.jpg',
    title: 'Candid Moments',
    tag: 'Candid'
  },
  {
    id: 'w6',
    url: '/images%20of%20studio/home%20wedding.jpg',
    title: 'Wedding Ceremony',
    tag: 'Ceremony'
  },
],
    includedHighlights: [
      'Dedicated Candid Master & Traditional Photographers',
      'Cinema 4K Drone Aerial Perspective Included in Gold/Premium',
      'Ultra HD Handcrafted Italian Album with Velvet Box',
      '48-Hour Fast Teaser Release for Instagram Reels & Stories',
      'Full High-Res Raw & Master-Edited Cloud Gallery'
    ]
  },
  {
    id: 'birthday-photography',
    name: 'Birthday Photography',
    categoryTag: 'Birthdays',
    shortDesc: 'Joyful celebrations, cake cutting smiles, playful giggles, and memorable milestones captured in vibrant high definition.',
    heroSubtitle: 'Cherish every giggle, milestone, and candle blown with pure delight.',
    fullDesc: 'From a magical 1st birthday wonderland to milestone golden jubilees, our team brings gentle patience and vibrant creativity to capture the genuine happiness of your loved ones.',
    startingPrice: '₹30,000',
    iconName: 'Cake',
    image: '/images%20of%20studio/birthday%20home.jpg',
    whatWeCapture: [
      { title: 'Theme Decor & Cake', description: 'Grand backdrop design, themed cake details, balloon arches, and custom props.', image: '/images%20of%20studio/506525509_3171397483035152_4409919685867799774_n.jpg' },
      { title: 'Birthday Star Portraits', description: 'Adorable solo portraits in celebration outfits with smiling expressions.', image: '/images%20of%20studio/bd%20ci.jpg' },
      { title: 'Cake Cutting Climax', description: 'The glowing candles, blowing wish, cheering family, and sweetest first bite.', image: '/images%20of%20studio/bd%20au.jpg' },
      { title: 'Fun & Games', description: 'Spontaneous action shots during magician shows, bouncy castles, and musical chairs.', image: '/images%20of%20studio/birthday%20home.jpg' },
      { title: 'Family & Friends', description: 'Warm group frames with grandparents, cousins, and closest school friends.', image: '/images%20of%20studio/bd%20cutting.jpg' },
      { title: 'Candid Highlights', description: 'Natural reactions, laughter, gift unwrapping surprises, and playful joy.', image: '/images%20of%20studio/bd%20cake.jpg' }
    ],
    featuredGallery: [
      { id: 'b1', url: '/images%20of%20studio/472617878_3009879789186923_5531279465493659804_n%20%281%29.jpg', title: 'First Birthday Crown', tag: 'Kids' },
      { id: 'b2', url: '/images%20of%20studio/473007779_3009880109186891_8103871398285501547_n%20%282%29.jpg', title: 'Confetti & Cake Sparks', tag: 'Party' },
      { id: 'b3', url: '/images%20of%20studio/506398921_3171397613035139_616853040549109524_n.jpg', title: 'Golden Milestone Celebration', tag: 'Portraits' },
      { id: 'b4', url: '/images%20of%20studio/168215228_903037496930948_9096982213888497380_n.jpg', title: 'Children Smiling Joy', tag: 'Candid' }
    ],
    includedHighlights: [
      'Full Party & Guest Coverage',
      'Themed Mini-Portrait Session before guests arrive',
      'Short High-Energy Reel for Social Media Sharing',
      'Custom Photobook with Lustre Finish'
    ]
  },
  {
    id: 'pre-wedding-shoot',
    name: 'Pre-Wedding Shoot',
    categoryTag: 'Couple',
    shortDesc: 'Cinematic romance in dream destinations, luxury resorts, heritage palaces, and scenic natural backdrops.',
    heroSubtitle: 'Your love story framed like a cinematic romantic movie.',
    fullDesc: 'Step away from the bustle of wedding preparations and celebrate your unique chemistry. With conceptual themes, drone sweeps, and dramatic lighting, we craft magazine-worthy portraits and a romantic music video.',
    startingPrice: '₹30,000',
    iconName: 'Sparkles',
    image: '/images%20of%20studio/pre%20ci.jpg',
    whatWeCapture: [
      { title: 'Romantic Portraits', description: 'Intimate, cinematic frames with soft lighting and natural posing guidance.', image: '/images%20of%20studio/prewedding%20home.jpg' },
      { title: 'Dramatic Drone Views', description: 'Epic wide angles across beaches, hills, heritage steps, and vast landscapes.', image: '/images%20of%20studio/473014327_3008711772637058_8966690060907972191_n.jpg' },
      { title: 'Costume & Style Changes', description: 'Traditional silk grandeur paired with modern contemporary gowns and tuxedos.', image: '/images%20of%20studio/cv%20ci.jpg' },
      { title: 'Sunset Magic Hour', description: 'Warm amber tones, silhouettes against golden skies, and ocean reflections.', image: '/images%20of%20studio/473611720_3014226445418924_2138311715257581764_n.jpg' },
      { title: 'Teaser Music Film', description: '4K slow-motion romance video with your favorite song track.', image: '/images%20of%20studio/176540802_1927093927465520_4463838385224398949_n.jpg' },
      { title: 'Playful Chemistry', description: 'Lively, joyful unscripted running, laughing, and spontaneous gestures.', image: '/images%20of%20studio/471108847_2993455684162667_2767508766663024320_n.jpg' }
    ],
    featuredGallery: [
      { id: 'pw1', url: '/images%20of%20studio/471293781_2995647517276817_6115517788689420417_n.jpg', title: 'Heritage Archway Romance', tag: 'Destination' },
      { id: 'pw2', url: '/images%20of%20studio/473014327_3008711772637058_8966690060907972191_n.jpg', title: 'Golden Hour Embrace', tag: 'Sunset' },
      { id: 'pw3', url: '/images%20of%20studio/cv%20ci.jpg', title: 'Coastal Serenity', tag: 'Beach' }
    ],
    includedHighlights: [
      'Up to 3 Location Changes & 4 Outfit Changes',
      'Cinematic 4K Drone Filming Included',
      '1 Romantic Music Video Highlight Film (2-3 mins)',
      '30 Magazine-Retouched Master Art Prints'
    ]
  },
  {
    id: 'post-wedding-shoot',
    name: 'Post-Wedding Shoot',
    categoryTag: 'Couple',
    shortDesc: 'Stress-free, relaxed portraits of the newlyweds in scenic destinations after the wedding ceremony.',
    heroSubtitle: 'Pure relaxation, intimacy, and timeless newlywed memories.',
    fullDesc: 'Once the busy rituals conclude, relax together in stunning locales. Capture the ease of marital bliss in serene beaches, tea estates, or heritage havelis without time constraints.',
    startingPrice: '₹30,000',
    iconName: 'Sun',
    image: '/images%20of%20studio/474452610_1746948942539795_8333476928887844059_n.jpg',
    whatWeCapture: [
      { title: 'Newlywed Intimacy', description: 'Natural warmth and gentle chemistry without any ritual rush.', image: '/images%20of%20studio/pre%20wedding%20au.jpg' },
      { title: 'Scenic Landscapes', description: 'Lush greenery, mist-covered hills, or calm sandy shores.', image: '/images%20of%20studio/outdor%20au.jpg' },
      { title: 'Wedding Rings & Details', description: 'Macro artistic shots of wedding rings, mangalsutra, and personalized tokens.', image: '/images%20of%20studio/outdoor%20ci.jpg' },
      { title: 'Casual & Formal Blend', description: 'Transitioning from festive elegance to relaxed casual resort wear.', image: '/images%20of%20studio/474499109_3022320647942837_2333498420312891890_n.jpg' },
      { title: 'Golden Hour Silhouettes', description: 'Dramatic backlighting against sunset horizons.', image: '/images%20of%20studio/473291828_3014226518752250_7265181339197313890_n.jpg' },
      { title: 'Short Love Reel', description: 'Reel-ready 4K vertical cuts tailored for Instagram.', image: '/images%20of%20studio/470592854_2993444697497099_3171302265841239215_n.jpg' }
    ],
    featuredGallery: [
      { id: 'pos1', url: '/images%20of%20studio/470798172_2993442214164014_3590792115316308014_n.jpg', title: 'Serene Shoreline Walk', tag: 'Beach' },
      { id: 'pos2', url: '/images%20of%20studio/178061278_1927093874132192_8049411446987167055_n.jpg', title: 'Cozy Resort Moments', tag: 'Luxury' }
    ],
    includedHighlights: [
      'Full Day Destination Assistance',
      'Artistic Color Grading with Film Emulation',
      'High Resolution Printable Files Delivery'
    ]
  },
  {
    id: 'outdoor-shoot',
    name: 'Outdoor Shoot',
    categoryTag: 'Outdoors',
    shortDesc: 'Artistic photography using natural sunlight, breathtaking outdoor environments, beaches, and greenery.',
    heroSubtitle: 'Nature as your canvas, illuminated by the finest golden light.',
    fullDesc: 'Harnessing the magic of dawn and dusk, our outdoor photography sessions craft breathtaking visual poetry using organic light, architectural symmetry, and dynamic environmental depth.',
    startingPrice: '₹30,000',
    iconName: 'Compass',
    image: '/images%20of%20studio/outdoor%20ci.jpg',
    whatWeCapture: [
      { title: 'Golden Light Aesthetics', description: 'Warm, radiant backlight creating luminous hair rims and soft skin tones.', image: '/images%20of%20studio/prewedding%20home.jpg' },
      { title: 'Architectural Heritage', description: 'Ancient pillars, temple gateways, stone carved arches, and modern textures.', image: '/images%20of%20studio/cv%20ci.jpg' },
      { title: 'Drone Aerial Perspectives', description: 'Top-down framing of ocean waves, geometric pathways, and forests.', image: '/images%20of%20studio/473611720_3014226445418924_2138311715257581764_n.jpg' },
      { title: 'Natural Candid Movement', description: 'Walking, twirling sarees, candid laughter, and breezy frames.', image: '/images%20of%20studio/176540802_1927093927465520_4463838385224398949_n.jpg' },
      { title: 'Fine-Art Framing', description: 'Carefully composed rule-of-thirds and symmetrical masterpiece portraits.', image: '/images%20of%20studio/471108847_2993455684162667_2767508766663024320_n.jpg' },
      { title: 'Mood & Atmospheric Shots', description: 'Misty mornings, rain ripples, and dusk silhouettes.', image: '/images%20of%20studio/471293781_2995647517276817_6115517788689420417_n.jpg' }
    ],
    featuredGallery: [
      { id: 'od1', url: '/images%20of%20studio/473014327_3008711772637058_8966690060907972191_n.jpg', title: 'Misty Hilltop Panorama', tag: 'Nature' },
      { id: 'od2', url: '/images%20of%20studio/473611720_3014226445418924_2138311715257581764_n.jpg', title: 'Golden Waves & Sun', tag: 'Coastal' }
    ],
    includedHighlights: [
      'Prime Location Guidance and Permit Advisory',
      'Full Dynamic Range Color Grading',
      'Drone 4K Drone Stills and Aerial Clips'
    ]
  },
  {
    id: 'puberty-photography',
    name: 'Puberty Photography',
    categoryTag: 'Tradition',
    shortDesc: 'Traditional Half-Saree Ceremony (Ritu Kala Samskara / Manjal Neerattu Vizha) documented with cultural elegance and dignity.',
    heroSubtitle: 'Celebrating the blossoming of womanhood with sacred grace and royal splendor.',
    fullDesc: 'The traditional Half-Saree / Puberty Ceremony is a momentous cultural milestone honoring tradition, family heritage, and the coming of age. We document every sacred bath, floral canopy, gift presentation, and radiant portraits of the young lady with royal decorum.',
    startingPrice: '₹30,000',
    iconName: 'Flower2',
    image: '/images%20of%20studio/puberty%20home.jpg',
    whatWeCapture: [
      { title: 'Traditional Half-Saree Attire', description: 'Stunning silk half-saree (Pavadai Dhavani), antique temple jewelry, and jada alankaram.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85' },
      { title: 'Manjal Neerattu / Sacred Bath', description: 'Aunties and maternal uncles performing turmeric water rituals and blessings.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=85' },
      { title: 'Floral Stage & Seer Plates', description: 'Artistically arranged fruit trays, sweets, gold ornaments, and jasmine flower mandapam.', image: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=700&q=85' },
      { title: 'Aalathi & Family Blessings', description: 'Maternal aunts performing traditional camphor flame aalathi to ward off evil eyes.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=85' },
      { title: 'Candid Cousins & Friends', description: 'Lively group frames with cheerful cousins, gifting moments, and happy celebrations.', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=85' },
      { title: 'Royal Solo Portraits', description: 'Regal posed portraits on the ceremonial throne radiating confidence and beauty.', image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'pb1', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85', title: 'Traditional Silk Grace', tag: 'Portraits' },
      { id: 'pb2', url: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=900&q=85', title: 'Seer Varisai Presentation', tag: 'Ritual' },
      { id: 'pb3', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85', title: 'Temple Jewelry Details', tag: 'Details' }
    ],
    includedHighlights: [
      'Comprehensive Ritual Coverage (Morning Bath & Evening Reception)',
      'Pre-Event Royal Portrait Session in Studio or Hall',
      'Exclusive Traditional Heirloom Photobook',
      'Full 4K Video Coverage & 1-Min Cinematic Reel'
    ]
  },
  {
    id: 'candid-photography',
    name: 'Candid Photography',
    categoryTag: 'Candid',
    shortDesc: 'Unobtrusive, heartfelt, and spontaneous emotional captures that preserve the genuine magic of unscripted moments.',
    heroSubtitle: 'The unposed glances and genuine emotions you didn’t know were happening.',
    fullDesc: 'True beauty lies in the fleeting micro-moments: a whispered joke among best friends, a tear rolling down a father’s cheek, or the silent glance shared between lovers. Our candid specialists work seamlessly in the background with silent shutter lenses.',
    startingPrice: '₹30,000',
    iconName: 'Camera',
    image: '/images%20of%20studio/candit%20ci.jpg',
    whatWeCapture: [
      { title: 'Spontaneous Tears of Joy', description: 'Raw, emotional hugs and tearful blessings captured without intrusion.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85' },
      { title: 'Secret Glances & Smiles', description: 'Private, unspoken connections between the couple amidst a crowded hall.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85' },
      { title: 'Behind the Scenes Magic', description: 'Makeup touch-ups, nervous excitement in greenrooms, and mirror reflections.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85' },
      { title: 'Lively Dance Energy', description: 'Dynamic movement on the dance floor frozen with crisp clarity.', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=85' },
      { title: 'Elders & Children Reactions', description: 'The cutest toddler antics and elders clapping in joy.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=85' },
      { title: 'Atmospheric Micro-Details', description: 'Clinking glasses, shoes, lighting flares, and floral ambiance.', image: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'cd1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85', title: 'Father Daughter Whisper', tag: 'Emotion' },
      { id: 'cd2', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85', title: 'Grandparents Warm Laughter', tag: 'Family' }
    ],
    includedHighlights: [
      'Master Prime Lens Kit for Creamy Bokeh & Low-Light Crispness',
      'Zero Stage Disruption Guarantee',
      'Artistic Fine Art Color Grading'
    ]
  },
  {
    id: 'newborn-baby-photography',
    name: 'Newborn Baby Photography',
    categoryTag: 'Baby',
    shortDesc: 'Safe, cozy, and angelic studio portraits of your precious newborn wrapped in heavenly warmth and love.',
    heroSubtitle: 'Tiny toes, sleepy yawns, and pure innocence preserved forever.',
    fullDesc: 'Welcoming a new life into the world is life’s greatest blessing. In our sanitized, temperature-controlled studio or in the comfort of your home, our certified baby whisperers safely pose your little angel in gentle wraps and dreamy themed setups.',
    startingPrice: '₹16,000',
    iconName: 'HeartHandshake',
    image: '/images%20of%20studio/new%20born%20ci.jpg',
    whatWeCapture: [
      { title: 'Peaceful Sleeping Poses', description: 'Angelic curled poses in wooden bowls, soft nests, and cloud-like cushions.', image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=700&q=85' },
      { title: 'Tiny Details (Macro)', description: 'Macro close-ups of miniature fingers, wrinkled feet, eyelashes, and baby lips.', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=85' },
      { title: 'Parent & Baby Bonding', description: 'Father cradling baby in strong hands; mother’s gentle forehead kisses.', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=700&q=85' },
      { title: 'Sibling First Embrace', description: 'Older brother or sister marveling at their new baby sibling.', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=85' },
      { title: 'Themed Props & Outfits', description: 'Handcrafted crochet beanies, floral halos, angel wings, and moon props.', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=85' },
      { title: 'Family Heirloom Trio', description: 'Grandparents, parents, and baby generational legacy portrait.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'nb1', url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=900&q=85', title: 'Angelic Dream Catcher', tag: 'Newborn' },
      { id: 'nb2', url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=85', title: 'Tiny Feet Love', tag: 'Macro' }
    ],
    includedHighlights: [
      '100% Sanitized & Hypoallergenic Props & Swaddles',
      'Zero Flash Gentle Continuous Lighting (Eyes Safe)',
      'Luxury Soft-Touch Mini Baby Photobook Included'
    ]
  },
  {
    id: 'engagement-photography',
    name: 'Engagement Photography',
    categoryTag: 'Weddings',
    shortDesc: 'Ring ceremonies, betrothals (Nichayathartham / Roka), and the beginning of your official journey together.',
    heroSubtitle: 'The sparkling ring, the formal promise, and two families uniting as one.',
    fullDesc: 'Capture the joyful anticipation and formal commitments of your engagement ceremony. From ring exchanges to grand stage decor and cheerful family banquets, we document every memorable second.',
    startingPrice: '₹24,000',
    iconName: 'Sparkles',
    image: '/images%20of%20studio/engagement%20ci.jpg',
    whatWeCapture: [
      { title: 'Ring Exchange Climax', description: 'Close-up crisp shots of slipping the diamond/gold ring on fingers.', image: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=700&q=85' },
      { title: 'Lagna Patrika Reading', description: 'Reading of the formal auspicious wedding date and mutual pledges.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=85' },
      { title: 'Stage Decor & Floral Grandeur', description: 'Custom floral monograms, LED backdrop arches, and stage lighting.', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=85' },
      { title: 'Couple Romantic Mini-Shoot', description: 'Posed portraits on stage and in venue corridors before the crowd arrives.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85' },
      { title: 'Gift & Tray Presentation', description: 'Silk sarees, dry fruit hampers, sweet platters, and betel leaves exchange.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85' },
      { title: 'Joyous Family Groupings', description: 'Both families gathering together for official milestone portraits.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'eng1', url: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=900&q=85', title: 'Diamond Sparkle & Promise', tag: 'Rings' },
      { id: 'eng2', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85', title: 'Traditional Nichayathartham', tag: 'Ceremony' }
    ],
    includedHighlights: [
      'Stage & Candid Dual Photographer Setup',
      'Instant 24-Hour Preview Gallery for Save-The-Date Invitations',
      'High Quality Photo Album'
    ]
  },
  {
    id: 'housewarming-photography',
    name: 'Housewarming Photography',
    categoryTag: 'Events',
    shortDesc: 'Gruhapravesam rituals, boiling of auspicious milk, Ganapathi homam, and architectural interiors of your dream home.',
    heroSubtitle: 'Blessing your new sanctuary with sacred fire, joy, and prosperous new beginnings.',
    fullDesc: 'A new home represents years of hard work, dreams, and devotion. Our housewarming photography covers the sacred dawn Ganapathi Homam, the overflowing auspicious milk ritual, Cow Pooja (Go Pooja), and architectural portraits of your new home.',
    startingPrice: '₹18,000',
    iconName: 'Home',
    image: '/images%20of%20studio/hw%20ci.jpg',
    whatWeCapture: [
      { title: 'Ganapathi Homam & Sacred Fire', description: 'Vedic priests chanting mantras, ghee offerings, and holy smoke rising.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=85' },
      { title: 'Milk Boiling Ritual (Paal Kaichuthal)', description: 'The auspicious moment milk overflows the vessel symbolizing abundance.', image: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=700&q=85' },
      { title: 'Go Pooja (Cow Blessings)', description: 'Welcoming the sacred cow and calf into the courtyard with floral garlands.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85' },
      { title: 'Home Architecture & Interiors', description: 'Wide-angle interior shots of modular kitchen, living hall, pooja room, and facade.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=85' },
      { title: 'Main Door Toranam & Threshold', description: 'Mango leaves, marigold flowers, kumkum threshold, and traditional kolam.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85' },
      { title: 'Proud Family Portraits', description: 'Homeowners posing in their new living room surrounded by loved ones.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'hw1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85', title: 'Modern Living Grandeur', tag: 'Architecture' },
      { id: 'hw2', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85', title: 'Auspicious Homam Flame', tag: 'Ritual' }
    ],
    includedHighlights: [
      'Early Morning Brahma Muhurtham Coverage Support',
      'Architectural Interior HDR Stills & Video Tour',
      'Hardcover Keepsake Album'
    ]
  },
  {
    id: 'baby-shower-photography',
    name: 'Baby Shower Photography',
    categoryTag: 'Events',
    shortDesc: 'Seemantham / Valaikaappu bangle ceremonies, maternal radiance, and heartfelt blessings for the mother-to-be.',
    heroSubtitle: 'The musical chime of glass bangles and maternal glow celebrated in splendor.',
    fullDesc: 'The traditional Valaikaappu / Seemantham / Godh Bharai ceremony is rich with colorful glass bangles, fragrant jasmine flowers, five types of variety rice offerings, and glowing maternal joy. We capture every loving touch and family blessing.',
    startingPrice: '₹20,000',
    iconName: 'Heart',
    image: '/images%20of%20studio/baby%20ci.jpg',
    whatWeCapture: [
      { title: 'Valaikaappu Bangle Wearing', description: 'Mother, grandmothers, and aunts sliding stacks of colorful glass bangles on her arms.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85' },
      { title: 'Maternity Glow Portraits', description: 'Bespoke portraits of the expectant mother cradling her baby bump in silk.', image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=700&q=85' },
      { title: 'Variety Rice & Seer Trays', description: 'Lemon, tamarind, curd, coconut, and sweet rice platters flanked by floral garlands.', image: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=700&q=85' },
      { title: 'Husband & Wife Sweet Moments', description: 'Loving couple frames sharing anticipation and joy for the impending parenthood.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85' },
      { title: 'Aalathi & Sandalwood Application', description: 'Applying sandalwood paste, kumkum on cheeks, and showering flower petals.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=85' },
      { title: 'Cheerful Women Gathering', description: 'Singing traditional folk songs, laughter, and loving gifts.', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'bs1', url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=900&q=85', title: 'Maternal Radiance & Silk', tag: 'Maternity' },
      { id: 'bs2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85', title: 'Stack of Glass Bangles', tag: 'Ritual' }
    ],
    includedHighlights: [
      'Pre-Ceremony Solo Maternity Portrait Session',
      'Full Bangle Ritual & Guest Greeting Coverage',
      'Fast Cloud Gallery & Social Reel'
    ]
  },
  {
    id: 'modelling-photography',
    name: 'Modelling Photography',
    categoryTag: 'Product',
    shortDesc: 'High-fashion editorial portfolios, lookbooks, agency comp cards, and cinematic studio lighting portraits.',
    heroSubtitle: 'High-fashion aesthetics, dramatic key lighting, and agency-standard portfolios.',
    fullDesc: 'Whether you are an aspiring model launching your career or a seasoned professional updating your agency portfolio, our state-of-the-art studio, lighting equipment, and posing direction will elevate your visual presence.',
    startingPrice: '₹15,000',
    iconName: 'UserCheck',
    image: '/images%20of%20studio/model.jpg',
    whatWeCapture: [
      { title: 'High-Fashion Editorial', description: 'Dramatic chiaroscuro studio lighting, avant-garde poses, and editorial styling.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85' },
      { title: 'Agency Comp Card Looks', description: 'Standard commercial headshots, 3/4 profiles, full body, and clean natural beauty.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85' },
      { title: 'Ethnic Couture Lookbook', description: 'Saree, lehenga, and sherwani styling with regal jewelry and luxury sets.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85' },
      { title: 'Contemporary Urban Chic', description: 'Streetwear, denim, and modern casuals in urban exterior environments.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=85' },
      { title: 'Creative Beauty & Macro', description: 'Close-up makeup artistry, lip texture, eye glamor, and hair styling.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=85' },
      { title: 'Motion Video Comp Card', description: '4K slow-motion model reels and walk-in clips for casting directors.', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'mod1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85', title: 'Editorial Noir', tag: 'Fashion' },
      { id: 'mod2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85', title: 'Studio High Key Portrait', tag: 'Headshot' }
    ],
    includedHighlights: [
      'Pro Studio Strobes with Octaboxes & Strip Modifiers',
      'High-End Frequency Separation Skin Retouching',
      'Digital Comp Card Layout & High-Res TIFF Files'
    ]
  },
  {
    id: 'product-photography',
    name: 'Product Photography',
    categoryTag: 'Product',
    shortDesc: 'Commercial e-commerce, jewelry, luxury apparel, food, and packshots designed to drive sales and prestige.',
    heroSubtitle: 'Pixel-perfect commercial imagery that elevates brands and turns viewers into buyers.',
    fullDesc: 'From high-end gold jewelry with zero reflections to crisp white-background Amazon/e-commerce catalogs and creative lifestyle branding, we craft images that highlight your product’s premium craftsmanship.',
    startingPrice: '₹12,000',
    iconName: 'ShoppingBag',
    image: '/images%20of%20studio/product%20ci.jpg',
    whatWeCapture: [
      { title: 'Fine Jewelry & Watches', description: 'Macro focus-stacked precision showcasing gemstones, gold polish, and diamond facets.', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85' },
      { title: 'White Background E-Commerce', description: 'Pure 100% RGB white background compliant with Amazon, Flipkart, and Shopify standards.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85' },
      { title: 'Creative Brand Lifestyle', description: 'Stylized prop settings with textured surfaces, shadows, and natural botanicals.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=85' },
      { title: 'Apparel & Flat Lays', description: 'Ghost mannequin, styled flat lays, and silk texture drape highlights.', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=700&q=85' },
      { title: '360° Product Rotation Spin', description: 'Smooth interactive turntable spins for premium website catalog integration.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85' },
      { title: 'Packaging & Unboxing Stills', description: 'Embossed foil boxes, ribbons, luxury seals, and unboxing sequences.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'prd1', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85', title: 'Luxury Diamond Brilliance', tag: 'Jewelry' },
      { id: 'prd2', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85', title: 'Botanical Cosmetics', tag: 'Commercial' }
    ],
    includedHighlights: [
      'Focus Stacking for Edge-to-Edge Razor Sharpness',
      'Color Calibrated for 100% True Fabric/Gold Accuracy',
      'Clipping Paths (PNG / PSD) Included'
    ]
  },
  {
    id: 'marriage-videography',
    name: 'Marriage Videography',
    categoryTag: 'Weddings',
    shortDesc: 'Complete, unedited-fidelity multi-camera event video coverage preserving every ritual from start to finish.',
    heroSubtitle: 'Complete ritual archives capturing every chant, smile, and guest blessing in crystal clarity.',
    fullDesc: 'While highlight reels capture the romance, traditional marriage videography ensures that every single sacred Vedic mantra, family greeting, reception stage guest, and traditional sequence is permanently preserved in full 4K UHD video.',
    startingPrice: '₹35,000',
    iconName: 'Video',
    image: '/images%20of%20studio/mv%20ci.jpg',
    whatWeCapture: [
      { title: 'Full Muhurtham Rituals', description: 'Uncut multi-angle recording of Kanyadaan, Mangalsutra, and Sapthapadi.', image: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=700&q=85' },
      { title: 'Stage Reception Guest Greetings', description: 'Every relative and VIP guest greeting the couple with crisp crystal audio.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85' },
      { title: 'Baraat & Janavasam Procession', description: 'Grand car procession, firecrackers, band music, and lively dancing.', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=85' },
      { title: 'Live Hall Display Feed (LED Wall)', description: 'Direct high-definition feed to venue LED walls for guest viewing.', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=85' },
      { title: 'Crystal Clear Audio Recording', description: 'Dedicated wireless lapel microphones on priests, groom, and bride.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85' },
      { title: 'Complete Multi-Hour Master Edit', description: 'Nicely Chaptered 2 to 3-hour full wedding video with music and titles.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=85' }
    ],
    featuredGallery: [
      { id: 'mv1', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85', title: 'Muhurtham Stage Coverage', tag: 'Rituals' },
      { id: 'mv2', url: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=900&q=85', title: 'Vows in 4K UHD', tag: 'Ceremony' }
    ],
    includedHighlights: [
      'Dual 4K Cinema Line Video Cameras',
      'Wireless Multi-Track Audio Synchronization',
      'Delivery on Custom Engraved Wooden 128GB USB Drive'
    ]
  },
  {
    id: 'cinematic-videography',
    name: 'Cinematic Videography',
    categoryTag: 'Weddings',
    shortDesc: 'Breathtaking 4K cinema-grade films with emotional soundtrack scoring, color grading, and Hollywood camera motion.',
    heroSubtitle: 'Turn your celebration into a movie worthy of the silver screen.',
    fullDesc: 'Shot with cinema cameras, gimbal stabilizers, anamorphic glass, and drone cinematography, our cinematic films weave speeches, vows, laughter, and music into an unforgettable cinematic wedding teaser and feature film.',
    startingPrice: '₹40,000',
    iconName: 'Film',
    image: '/images%20of%20studio/cv%20ci.jpg',
    whatWeCapture: [
      { title: 'The Wedding Trailer (3-5 Mins)', description: 'High-octane emotional trailer edited to a custom licensed musical score.', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=85' },
      { title: 'Cinematic Drone Sweeps', description: 'Sweeping aerial 4K shots of the mandapam, sunset beach, and royal entry.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=85' },
      { title: 'Story Interviews & Vows', description: 'Intimate audio recordings of how the couple met, parents’ blessings, and letters.', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85' },
      { title: 'Slow-Motion Gimbal Glides', description: 'Butter-smooth slow motion capturing flying flower petals and swirling lehengas.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85' },
      { title: 'Hollywood Color Grading', description: 'Custom LUTs bringing rich skin tones, velvety deep blacks, and gold glow.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85' },
      { title: 'Instagram Reel Teaser (60s)', description: 'Fast-paced vertical reel ready within 48 hours for immediate viral sharing.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=85' }
    ],
    highlightVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    featuredGallery: [
      { id: 'cv1', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=85', title: 'Cinematic Grandeur', tag: 'Cinema' },
      { id: 'cv2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85', title: 'Emotional Vows in 4K', tag: 'Film' }
    ],
    includedHighlights: [
      'Sony FX3 / Cinema Series 10-bit 4:2:2 4K 120fps Cameras',
      'DJI Ronin Gimbal & Wireless Focus Puller Kit',
      'Custom Audio Mastering & Licensed Music Scoring',
      'Both Landscape 4K Master & Vertical Reels Delivered'
    ]
  }
];

// 4 Customizable Optional Services across all packages
export const CUSTOMIZABLE_PACKAGE_OPTIONS = [
  'Drone Photography',
  'Pre-Wedding Shoot',
  'Post-Wedding Shoot',
  'Engagement Photography'
] as const;

export type CustomizableOptionType = typeof CUSTOMIZABLE_PACKAGE_OPTIONS[number];

// Packages Data
export const STUDIO_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-budget',
    name: 'BUDGET',
    badge: 'Essential',
    popular: false,
    price: '₹35,000',
    rawPrice: 35000,
    category: 'Wedding',
    description: 'Essential professional photography & HD video coverage with a handcrafted 15 × 10 album, pendrive, frame, and bag.',
    photographers: 'Traditional Photographer',
    albumDetails: '15 × 10 Album with 30 Pages',
    videoCoverage: 'HD Video',
    droneCoverage: 'Optional Add-on (Customizable)',
    photoCount: '300+ Color Graded Stills',
    deliveryTime: '15 Working Days',
    otherServices: [
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    features: [
      'Traditional Photographer',
      'HD Video',
      '15 × 10 Album with 30 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ]
  },
  {
    id: 'pkg-luxury',
    name: 'LUXURY',
    badge: 'Most Popular',
    popular: true,
    price: '₹50,000',
    rawPrice: 50000,
    category: 'Wedding',
    description: 'Luxury celebration coverage combining traditional & candid photography with HD video and an expanded 60-page 15 × 10 album.',
    photographers: 'Traditional Photographer + Candid Photography',
    albumDetails: '15 × 10 Album with 60 Pages',
    videoCoverage: 'HD Video',
    droneCoverage: 'Optional Add-on (Customizable)',
    photoCount: '500+ Color Graded Stills',
    deliveryTime: '10 Working Days',
    otherServices: [
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ]
  },
  {
    id: 'pkg-semi-luxury',
    name: 'SEMI-LUXURY',
    badge: 'Elite Cinema',
    popular: false,
    price: '₹65,000',
    rawPrice: 65000,
    category: 'Wedding',
    description: 'Complete comprehensive cinema suite featuring traditional photography, candid photography, HD video, candid videography, and 60-page album.',
    photographers: 'Traditional Photographer + Candid Photography',
    albumDetails: '15 × 10 Album with 60 Pages',
    videoCoverage: 'HD Video + Candid Videography',
    droneCoverage: 'Optional Add-on (Customizable)',
    photoCount: '700+ Master-Edited Masterpiece Stills',
    deliveryTime: '7 Working Days',
    otherServices: [
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      'Candid Videography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ]
  }
];

export const PACKAGES_DATA: Record<string, PackageItem[]> = {
  Wedding: STUDIO_PACKAGES,
  General: [
    {
      id: 'pkg-gen-budget',
      name: 'BUDGET',
      badge: 'Essential',
      popular: false,
      price: '₹30,000',
      rawPrice: 30000,
      category: 'Events',
      description: 'Essential celebration coverage for birthdays, puberty ceremonies, and studio/outdoor shoots with traditional photography, HD video, 15 × 10 album, pendrive, frame, and bag.',
      photographers: 'Traditional Photographer',
      albumDetails: '15 × 10 Album with 30 Pages',
      videoCoverage: 'HD Video',
      droneCoverage: 'Optional Add-on (Customizable)',
      photoCount: '300+ Color Graded Stills',
      deliveryTime: '12 Working Days',
      otherServices: [
        'Pendrive',
        'Photo Frame',
        'Bag'
      ],
      features: [
        'Traditional Photographer',
        'HD Video',
        '15 × 10 Album with 30 Pages',
        'Pendrive',
        'Photo Frame',
        'Bag'
      ]
    },
    {
      id: 'pkg-gen-luxury',
      name: 'LUXURY',
      badge: 'Most Popular',
      popular: true,
      price: '₹40,000',
      rawPrice: 40000,
      category: 'Events',
      description: 'Luxury celebration coverage combining traditional & candid photography with HD video and an expanded 60-page 15 × 10 album, pendrive, frame, and bag.',
      photographers: 'Traditional Photographer + Candid Photography',
      albumDetails: '15 × 10 Album with 60 Pages',
      videoCoverage: 'HD Video',
      droneCoverage: 'Optional Add-on (Customizable)',
      photoCount: '500+ Color Graded Stills',
      deliveryTime: '10 Working Days',
      otherServices: [
        'Pendrive',
        'Photo Frame',
        'Bag'
      ],
      features: [
        'Traditional Photographer',
        'HD Video',
        'Candid Photography',
        '15 × 10 Album with 60 Pages',
        'Pendrive',
        'Photo Frame',
        'Bag'
      ]
    },
    {
      id: 'pkg-gen-semi-luxury',
      name: 'SEMI-LUXURY',
      badge: 'Elite Cinema',
      popular: false,
      price: '₹60,000',
      rawPrice: 60000,
      category: 'Events',
      description: 'Complete comprehensive cinema suite featuring traditional photography, candid photography, HD video, candid videography, and 60-page album.',
      photographers: 'Traditional Photographer + Candid Photography',
      albumDetails: '15 × 10 Album with 60 Pages',
      videoCoverage: 'HD Video + Candid Videography',
      droneCoverage: 'Optional Add-on (Customizable)',
      photoCount: '700+ Master-Edited Masterpiece Stills',
      deliveryTime: '7 Working Days',
      otherServices: [
        'Pendrive',
        'Photo Frame',
        'Bag'
      ],
      features: [
        'Traditional Photographer',
        'HD Video',
        'Candid Photography',
        'Candid Videography',
        '15 × 10 Album with 60 Pages',
        'Pendrive',
        'Photo Frame',
        'Bag'
      ]
    }
  ]
};

// Gallery Photos
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'g-w1',
    url: '/images%20of%20studio/home%20wedding.jpg',
    title: 'Sacred Muhurtham Garland Exchange',
    category: 'Wedding',
    aspectRatio: 'landscape',
    location: 'Chennai'
  },
  {
    id: 'g-w2',
    url: '/images%20of%20studio/55711626_1229721277202792_7475459143545913344_n.jpg',
    title: 'Regal Kanjeevaram Bride in Gold',
    category: 'Wedding',
    aspectRatio: 'portrait',
    location: 'Mahabalipuram'
  },
  {
    id: 'g-w3',
    url: '/images%20of%20studio/62192430_1285277744980478_4742851867220901888_n.jpg',
    title: 'Mangalsutra Sacred Vows',
    category: 'Wedding',
    aspectRatio: 'landscape',
    location: 'Madurai'
  },
  {
    id: 'g-w4',
    url: '/images%20of%20studio/wedding%20ci.jpg',
    title: 'Grand Palace Reception Stage',
    category: 'Wedding',
    aspectRatio: 'landscape',
    location: 'Coimbatore'
  },
  {
    id: 'g-b1',
    url: '/images%20of%20studio/birthday%20home.jpg',
    title: 'Princess Themed 1st Birthday Wonder',
    category: 'Birthday',
    aspectRatio: 'portrait',
    location: 'Chennai'
  },
  {
    id: 'g-b2',
    url: '/images%20of%20studio/506525509_3171397483035152_4409919685867799774_n.jpg',
    title: 'Cake Cutting Fireworks & Joy',
    category: 'Birthday',
    aspectRatio: 'landscape',
    location: 'Bangalore'
  },
  {
    id: 'g-b3',
    url: '/images%20of%20studio/bd%20ci.jpg',
    title: 'Golden Milestone Birthday Gala',
    category: 'Birthday',
    aspectRatio: 'landscape',
    location: 'Chennai'
  },
  {
    id: 'g-pw1',
    url: '/images%20of%20studio/471293781_2995647517276817_6115517788689420417_n.jpg',
    title: 'Golden Hour Coastal Romance',
    category: 'Pre-Wedding',
    aspectRatio: 'landscape',
    location: 'ECR Coast, Chennai'
  },
  {
    id: 'g-pw2',
    url: '/images%20of%20studio/471108847_2993455684162667_2767508766663024320_n.jpg',
    title: 'Ocean Shoreline Footsteps',
    category: 'Pre-Wedding',
    aspectRatio: 'landscape',
    location: 'Pondicherry'
  },
  {
    id: 'g-od1',
    url: '/images%20of%20studio/outdoor%20ci.jpg',
    title: 'Misty Tea Estate Romance',
    category: 'Outdoor',
    aspectRatio: 'landscape',
    location: 'Ooty Hills'
  },
  {
    id: 'g-od2',
    url: '/images%20of%20studio/470592854_2993444697497099_3171302265841239215_n.jpg',
    title: 'Heritage Courtyard Pillars',
    category: 'Outdoor',
    aspectRatio: 'portrait',
    location: 'Chettinad'
  },
  {
    id: 'g-pb1',
    url: '/images%20of%20studio/puberty%20home.jpg',
    title: 'Traditional Manjal Neerattu Vizha',
    category: 'Puberty',
    aspectRatio: 'portrait',
    location: 'Tiruchirappalli'
  },
  {
    id: 'g-pb2',
    url: '/images%20of%20studio/474761795_3022310421277193_1011283433239639619_n.jpg',
    title: 'Seer Varisai Trays Presentation',
    category: 'Puberty',
    aspectRatio: 'landscape',
    location: 'Salem'
  },
  {
    id: 'g-bb1',
    url: '/images%20of%20studio/birthday%20home.jpg',
    title: 'Angelic Slumber in Floral Nest',
    category: 'Baby',
    aspectRatio: 'portrait',
    location: 'Studio Chennai'
  },
  {
    id: 'g-bb2',
    url: '/images%20of%20studio/473007779_3009880109186891_8103871398285501547_n%20%282%29.jpg',
    title: 'Gentle Tender Newborn Touch',
    category: 'Baby',
    aspectRatio: 'landscape',
    location: 'Studio Chennai'
  },
  {
    id: 'g-ev1',
    url: '/images%20of%20studio/_MG_4345.jpg',
    title: 'Gruhapravesam Homam & Sanctity',
    category: 'Events',
    aspectRatio: 'landscape',
    location: 'Chennai'
  },
  {
    id: 'g-ev2',
    url: '/images%20of%20studio/baby%20shower%20au.jpg',
    title: 'Seemantham Bangle Festivities',
    category: 'Events',
    aspectRatio: 'landscape',
    location: 'Vellore'
  },
  {
    id: 'g-pr1',
    url: '/images%20of%20studio/94037797_661337271100973_4489314188186877952_n.jpg',
    title: 'Temple Gold Jewelry Macro Stills',
    category: 'Product',
    aspectRatio: 'portrait',
    location: 'Studio Chennai'
  },
  {
    id: 'g-pr2',
    url: '/images%20of%20studio/198055036_1973153859526193_2205969542381741976_n.jpg',
    title: 'High-Fashion Editorial Lookbook',
    category: 'Product',
    aspectRatio: 'portrait',
    location: 'Studio Chennai'
  }
];

// Customer Reviews - Live Real-Time Data (No mock data)
export const CUSTOMER_REVIEWS: CustomerReview[] = [];

export const REVIEWS_DATA = CUSTOMER_REVIEWS;

