import raw from './mockKOLs.json';

const campaignApplicants = {
  c1: ['1', '5', '3', '4', '7'],
  c2: ['2', '6', '7'],
  c3: ['3', '1', '8', '7'],
  c4: ['5', '1', '8'],
  c5: ['4', '8', '1']
};

const applicantEnhancements = {
  '1': {
    availability: 'Available now',
    responseTimeHours: 6,
    contentFormats: ['Reels', 'Stories', 'Posts'],
    pastBrandCategories: ['Beauty', 'Skincare', 'Retail'],
    audience: {
      age: { '18-24': 35, '25-34': 42, '35-44': 15, '45+': 8 },
      locations: [
        { label: 'Singapore', percent: 78 },
        { label: 'Malaysia', percent: 8 },
        { label: 'Indonesia', percent: 6 }
      ],
      gender: { female: 79, male: 21 }
    },
    rateCard: [
      { label: 'Instagram Reel', price: 'SGD 1,200' },
      { label: 'Story Set (3 frames)', price: 'SGD 650' },
      { label: 'Static Post', price: 'SGD 900' }
    ],
    mediaKit: { fileName: 'JessicaTan_MediaKit.pdf', updated: 'Jan 2025', size: '4.2MB' },
    recentPosts: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop'
    ]
  },
  '2': {
    availability: 'Next 2 weeks',
    responseTimeHours: 12,
    contentFormats: ['Review Video', 'Livestream', 'Carousel'],
    pastBrandCategories: ['Tech', 'Gaming', 'Software'],
    audience: {
      age: { '18-24': 28, '25-34': 46, '35-44': 18, '45+': 8 },
      locations: [
        { label: 'Singapore', percent: 62 },
        { label: 'Malaysia', percent: 12 },
        { label: 'Philippines', percent: 7 }
      ],
      gender: { female: 32, male: 68 }
    },
    rateCard: [
      { label: 'YouTube Review', price: 'SGD 3,500' },
      { label: 'Livestream (60 mins)', price: 'SGD 2,000' },
      { label: 'Instagram Carousel', price: 'SGD 1,000' }
    ],
    mediaKit: { fileName: 'MarcusTech_MediaKit.pdf', updated: 'Dec 2024', size: '3.6MB' },
    recentPosts: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=600&fit=crop'
    ]
  },
  '3': {
    availability: 'Available now',
    responseTimeHours: 8,
    contentFormats: ['Stories', 'Reels', 'Challenge Video'],
    pastBrandCategories: ['Fitness', 'Athleisure', 'Wellness'],
    audience: {
      age: { '18-24': 31, '25-34': 44, '35-44': 18, '45+': 7 },
      locations: [
        { label: 'Singapore', percent: 74 },
        { label: 'Malaysia', percent: 9 },
        { label: 'Indonesia', percent: 6 }
      ],
      gender: { female: 66, male: 34 }
    },
    rateCard: [
      { label: 'TikTok Video', price: 'SGD 1,400' },
      { label: 'Instagram Reel', price: 'SGD 1,200' },
      { label: 'YouTube Feature', price: 'SGD 2,000' }
    ],
    mediaKit: { fileName: 'AishaFit_MediaKit.pdf', updated: 'Jan 2025', size: '3.9MB' },
    recentPosts: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop'
    ]
  },
  '4': {
    availability: 'Flexible',
    responseTimeHours: 24,
    contentFormats: ['Reels', 'Stories', 'Food Review'],
    pastBrandCategories: ['Food', 'Hospitality', 'Retail'],
    audience: {
      age: { '18-24': 22, '25-34': 41, '35-44': 24, '45+': 13 },
      locations: [
        { label: 'Singapore', percent: 81 },
        { label: 'Malaysia', percent: 7 },
        { label: 'Thailand', percent: 4 }
      ],
      gender: { female: 54, male: 46 }
    },
    rateCard: [
      { label: 'Instagram Reel', price: 'SGD 700' },
      { label: 'Story Set (3 frames)', price: 'SGD 350' },
      { label: 'Food Review Post', price: 'SGD 500' }
    ],
    mediaKit: { fileName: 'DavidFood_MediaKit.pdf', updated: 'Nov 2024', size: '2.8MB' },
    recentPosts: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=600&fit=crop'
    ]
  },
  '5': {
    availability: 'Next 4 weeks',
    responseTimeHours: 10,
    contentFormats: ['Styling Reel', 'Haul Video', 'Carousel'],
    pastBrandCategories: ['Fashion', 'Retail', 'Luxury'],
    audience: {
      age: { '18-24': 27, '25-34': 48, '35-44': 17, '45+': 8 },
      locations: [
        { label: 'Singapore', percent: 69 },
        { label: 'Malaysia', percent: 10 },
        { label: 'Hong Kong', percent: 6 }
      ],
      gender: { female: 81, male: 19 }
    },
    rateCard: [
      { label: 'Instagram Reel', price: 'SGD 2,800' },
      { label: 'YouTube Haul', price: 'SGD 4,200' },
      { label: 'Pinterest Lookbook', price: 'SGD 1,200' }
    ],
    mediaKit: { fileName: 'PriyaStyle_MediaKit.pdf', updated: 'Jan 2025', size: '5.1MB' },
    recentPosts: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop'
    ]
  },
  '6': {
    availability: 'Limited (Esports season)',
    responseTimeHours: 18,
    contentFormats: ['Livestream', 'Highlight Reel', 'Shorts'],
    pastBrandCategories: ['Gaming', 'Hardware', 'Streaming'],
    audience: {
      age: { '18-24': 45, '25-34': 38, '35-44': 12, '45+': 5 },
      locations: [
        { label: 'Singapore', percent: 58 },
        { label: 'Philippines', percent: 14 },
        { label: 'Malaysia', percent: 9 }
      ],
      gender: { female: 21, male: 79 }
    },
    rateCard: [
      { label: 'Twitch Stream (2 hrs)', price: 'SGD 4,000' },
      { label: 'YouTube Feature', price: 'SGD 3,200' },
      { label: 'Twitter Promo', price: 'SGD 800' }
    ],
    mediaKit: { fileName: 'RyanGaming_MediaKit.pdf', updated: 'Oct 2024', size: '3.2MB' },
    recentPosts: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=600&fit=crop'
    ]
  },
  '7': {
    availability: 'Available now',
    responseTimeHours: 6,
    contentFormats: ['LinkedIn Post', 'Workshop Recap', 'Carousel'],
    pastBrandCategories: ['Business', 'Finance', 'SaaS'],
    audience: {
      age: { '18-24': 18, '25-34': 41, '35-44': 28, '45+': 13 },
      locations: [
        { label: 'Singapore', percent: 64 },
        { label: 'Indonesia', percent: 11 },
        { label: 'Malaysia', percent: 9 }
      ],
      gender: { female: 48, male: 52 }
    },
    rateCard: [
      { label: 'LinkedIn Post', price: 'SGD 1,300' },
      { label: 'YouTube Feature', price: 'SGD 2,400' },
      { label: 'Instagram Carousel', price: 'SGD 900' }
    ],
    mediaKit: { fileName: 'SofiaBiz_MediaKit.pdf', updated: 'Jan 2025', size: '3.7MB' },
    recentPosts: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=600&fit=crop'
    ]
  },
  '8': {
    availability: 'Next 3 weeks',
    responseTimeHours: 14,
    contentFormats: ['Photo Essay', 'Reels', 'Vlog'],
    pastBrandCategories: ['Travel', 'Tourism', 'Hospitality'],
    audience: {
      age: { '18-24': 26, '25-34': 43, '35-44': 20, '45+': 11 },
      locations: [
        { label: 'Singapore', percent: 59 },
        { label: 'Malaysia', percent: 13 },
        { label: 'Australia', percent: 6 }
      ],
      gender: { female: 52, male: 48 }
    },
    rateCard: [
      { label: 'Instagram Reel', price: 'SGD 2,200' },
      { label: 'YouTube Vlog', price: 'SGD 3,800' },
      { label: 'Photo Set (6)', price: 'SGD 1,200' }
    ],
    mediaKit: { fileName: 'AlexTravel_MediaKit.pdf', updated: 'Dec 2024', size: '4.0MB' },
    recentPosts: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop'
    ]
  }
};

const parsePriceRange = (pricingRange) => {
  if (!pricingRange) {
    return { min: 0, max: 0 };
  }
  const matches = pricingRange.match(/\d+[\d,]*/g);
  if (!matches || matches.length < 2) {
    return { min: 0, max: 0 };
  }
  const numbers = matches.map(value => Number(value.replace(/,/g, '')));
  return { min: numbers[0] || 0, max: numbers[1] || numbers[0] || 0 };
};

const getTopAgeRange = (ageMap = {}) => {
  const entries = Object.entries(ageMap);
  if (!entries.length) {
    return '';
  }
  return entries.reduce((top, entry) => (entry[1] > top[1] ? entry : top), entries[0])[0];
};

const getMaxEngagement = (platforms = {}) => (
  Object.values(platforms).reduce((max, platform) => Math.max(max, platform.engagementRate || 0), 0)
);

const getFollowerTotal = (platforms = {}) => (
  Object.values(platforms).reduce((sum, platform) => sum + (platform.followers || 0), 0)
);

export const applicants = raw.kols.map((kol) => {
  const enhancement = applicantEnhancements[kol.id] || {};
  const priceRange = parsePriceRange(kol.pricingRange);
  const maxEngagement = getMaxEngagement(kol.platforms);
  const followerTotal = getFollowerTotal(kol.platforms);
  const topAgeRange = getTopAgeRange(enhancement.audience?.age);
  const primaryPlatforms = Object.keys(kol.platforms || {});

  return {
    ...kol,
    ...enhancement,
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    maxEngagement,
    followerTotal,
    topAgeRange,
    primaryPlatforms
  };
});

export const campaigns = raw.campaigns.map((campaign) => ({
  ...campaign,
  applicantIds: campaignApplicants[campaign.id] || []
}));

export const buildApplications = () => (
  campaigns.flatMap((campaign) => (
    (campaign.applicantIds || []).map((applicantId, index) => {
      const appliedDate = new Date(campaign.postedDate);
      appliedDate.setDate(appliedDate.getDate() + index + 1);

      return {
        id: `${campaign.id}-${applicantId}`,
        campaignId: campaign.id,
        applicantId,
        appliedAt: appliedDate.toISOString().slice(0, 10)
      };
    })
  ))
);

export const filterOptions = {
  platforms: ['instagram', 'tiktok', 'youtube', 'twitch', 'twitter', 'linkedin', 'pinterest'],
  priceRange: ['0-1000', '1000-2500', '2500-5000', '5000+'],
  engagementRate: ['1-3', '3-5', '5-8', '8+'],
  audienceAge: ['18-24', '25-34', '35-44', '45+'],
  availability: ['Available now', 'Next 2 weeks', 'Next 3 weeks', 'Next 4 weeks', 'Flexible', 'Limited (Esports season)']
};
