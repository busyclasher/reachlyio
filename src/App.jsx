import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import KOLGrid from './components/KOLGrid';
import KOLModal from './components/KOLModal';
import CreateProfileModal from './components/CreateProfileModal';
import CreateCampaignModal from './components/CreateCampaignModal';
import CampaignsPage from './components/CampaignsPage';
import ApplyModal from './components/ApplyModal';
import MyApplications from './components/MyApplications';
import LandingPage from './components/LandingPage';
import FavoritesPage from './components/FavoritesPage';
import PricingPage from './components/PricingPage';
import StartPage from './components/StartPage';
import RoleFlowBanner from './components/RoleFlowBanner';
import Footer from './components/Footer';
import { useToast } from './components/useToast';
import CampaignDetailModal from './components/CampaignDetailModal';
import mockData from './data/mockKOLs.json';
import './App.css';

// Auth components
import { useAuth } from './context/authContext';
import AuthModal from './components/auth/AuthModal';
import RoleSelectionPage from './components/auth/RoleSelectionPage';
import BusinessOnboarding from './components/onboarding/BusinessOnboarding';
import InfluencerOnboarding from './components/onboarding/InfluencerOnboarding';
import BusinessDashboard from './components/dashboard/BusinessDashboard';
import InfluencerDashboard from './components/dashboard/InfluencerDashboard';
import InviteModal from './components/InviteModal';
import DealWorkroom from './components/deals/DealWorkroom';

const safeParse = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const ROLE_STORAGE_KEY = 'reachlyUserRole';

const getStoredRole = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(ROLE_STORAGE_KEY);
    return value === 'business' || value === 'kol' ? value : null;
  } catch {
    return null;
  }
};

const persistRole = (role) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (role) {
      window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    } else {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors (private mode, blocked storage).
  }
};

const getDefaultPageForRole = (role) => {
  if (role === 'business') {
    return 'kols';
  }
  if (role === 'kol') {
    return 'campaigns';
  }
  return 'start';
};

const inferRoleFromPage = (page) => {
  if (page === 'kols' || page === 'favorites') {
    return 'business';
  }
  if (page === 'applications') {
    return 'kol';
  }
  return null;
};

const CATEGORY_MATCHERS = {
  beauty: niches => niches.some(n => n.includes('beauty') || n.includes('fashion')),
  tech: niches => niches.some(n => n.includes('tech') || n.includes('gaming')),
  fitness: niches => niches.some(n => n.includes('fitness') || n.includes('wellness')),
  food: niches => niches.some(n => n.includes('food') || n.includes('lifestyle')),
  business: niches => niches.some(n => n.includes('business') || n.includes('finance') || n.includes('marketing')),
  travel: niches => niches.some(n => n.includes('travel') || n.includes('photography'))
};

const getNiches = (kol) => (kol.niche || []).map(niche => niche.toLowerCase());

const matchesCategory = (niches, category) => {
  const matcher = CATEGORY_MATCHERS[category];
  return matcher ? matcher(niches) : false;
};

const getTotalFollowers = (kol) => (
  Object.values(kol.platforms || {}).reduce((sum, platform) => sum + (platform.followers || 0), 0)
);

const getMaxEngagement = (kol) => (
  Object.values(kol.platforms || {}).reduce(
    (max, platform) => Math.max(max, platform.engagementRate || 0),
    0
  )
);

const getJoinTimestamp = (kol) => {
  if (kol.joinedDate) {
    const date = new Date(kol.joinedDate);
    const time = date.getTime();
    if (!Number.isNaN(time)) {
      return time;
    }
  }

  if (kol.proSince) {
    const date = new Date(`${kol.proSince}-01-01`);
    const time = date.getTime();
    if (!Number.isNaN(time)) {
      return time;
    }
  }

  return 0;
};

const getCampaignTimestamp = (campaign) => {
  if (campaign.postedDate) {
    const date = new Date(campaign.postedDate);
    const time = date.getTime();
    if (!Number.isNaN(time)) {
      return time;
    }
  }

  return 0;
};

const sortCampaigns = (list) => (
  [...list].sort((a, b) => getCampaignTimestamp(b) - getCampaignTimestamp(a))
);

const VALID_PAGES = ['start', 'landing', 'kols', 'campaigns', 'applications', 'favorites', 'pricing'];

const getUrlStateFromSearch = (search, role) => {
  const params = new URLSearchParams(search || '');
  const pageParam = params.get('page');
  const hasValidPage = pageParam && VALID_PAGES.includes(pageParam);
  const kolId = params.get('kol');
  const campaignId = params.get('campaign');
  const applyId = params.get('apply');
  const create = params.get('create') === '1';
  const createCampaign = params.get('createCampaign') === '1';
  let nextPage = hasValidPage ? pageParam : getDefaultPageForRole(role);

  if (!hasValidPage) {
    if (kolId) {
      nextPage = 'kols';
    } else if (campaignId || applyId || createCampaign) {
      nextPage = 'campaigns';
    }
  }

  const isKOLPage = nextPage === 'kols' || nextPage === 'favorites';
  const isCampaignsPage = nextPage === 'campaigns';

  return {
    currentPage: nextPage,
    selectedKOLId: isKOLPage ? kolId : null,
    campaignDetailId: isCampaignsPage && !applyId && !createCampaign ? campaignId : null,
    applyCampaignId: isCampaignsPage && !createCampaign ? applyId : null,
    showCreateModal: create && !createCampaign,
    showCreateCampaignModal: isCampaignsPage && createCampaign
  };
};

function App() {
  const { addToast } = useToast();
  const {
    user,
    isAuthenticated,
    needsRoleSelection,
    needsOnboarding,
    isBusiness,
    isInfluencer,
    logout
  } = useAuth();

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup');

  const [userRole, setUserRole] = useState(() => {
    const storedRole = getStoredRole();
    if (storedRole) {
      return storedRole;
    }

    if (typeof window === 'undefined') {
      return null;
    }

    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    return inferRoleFromPage(pageParam);
  });
  const initialUrlState = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        currentPage: 'start',
        selectedKOLId: null,
        campaignDetailId: null,
        applyCampaignId: null,
        showCreateModal: false,
        showCreateCampaignModal: false
      };
    }

    return getUrlStateFromSearch(window.location.search, userRole);
  }, [userRole]);
  const [kols, setKols] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedKOLId, setSelectedKOLId] = useState(initialUrlState.selectedKOLId);
  const [campaignDetailId, setCampaignDetailId] = useState(initialUrlState.campaignDetailId);
  const [applyCampaignId, setApplyCampaignId] = useState(initialUrlState.applyCampaignId);
  const [showCreateModal, setShowCreateModal] = useState(initialUrlState.showCreateModal);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(initialUrlState.showCreateCampaignModal);
  const [currentPage, setCurrentPage] = useState(initialUrlState.currentPage);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    platforms: [],
    followerRange: [],
    engagementRate: [],
    verifiedOnly: false
  });
  const skipUrlSyncRef = useRef(false);
  const warnedApplyIdRef = useRef(null);

  // Business workflow state
  const [invites, setInvites] = useState([]);
  const [deals, setDeals] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTargetKOL, setInviteTargetKOL] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState(null);

  const isKOLPage = currentPage === 'kols' || currentPage === 'favorites';
  const isCampaignsPage = currentPage === 'campaigns';
  const isDealsPage = currentPage === 'deals';

  const categoryCounts = useMemo(() => {
    const counts = {
      beauty: 0,
      tech: 0,
      fitness: 0,
      food: 0,
      business: 0,
      travel: 0
    };

    kols.forEach(kol => {
      const niches = getNiches(kol);
      Object.keys(counts).forEach(category => {
        if (matchesCategory(niches, category)) {
          counts[category] += 1;
        }
      });
    });

    return counts;
  }, [kols]);

  const appliedCampaignIds = useMemo(() => (
    new Set(applications.map(application => application.campaignId))
  ), [applications]);

  const selectedKOLData = useMemo(
    () => (selectedKOLId ? kols.find(kol => kol.id === selectedKOLId) || null : null),
    [kols, selectedKOLId]
  );
  const campaignDetailData = useMemo(
    () => (campaignDetailId ? campaigns.find(campaign => campaign.id === campaignDetailId) || null : null),
    [campaigns, campaignDetailId]
  );
  const applyCampaignData = useMemo(
    () => (applyCampaignId ? campaigns.find(campaign => campaign.id === applyCampaignId) || null : null),
    [campaigns, applyCampaignId]
  );
  const isApplyBlocked = useMemo(
    () => Boolean(!loading && applyCampaignId && appliedCampaignIds.has(applyCampaignId)),
    [loading, applyCampaignId, appliedCampaignIds]
  );
  const selectedKOL = useMemo(
    () => (isKOLPage ? selectedKOLData : null),
    [isKOLPage, selectedKOLData]
  );
  const campaignDetail = useMemo(
    () => (isCampaignsPage ? campaignDetailData : null),
    [isCampaignsPage, campaignDetailData]
  );
  const applyCampaign = useMemo(() => {
    if (!isCampaignsPage || !applyCampaignId || isApplyBlocked) {
      return null;
    }

    return applyCampaignData;
  }, [isCampaignsPage, applyCampaignId, isApplyBlocked, applyCampaignData]);
  const resolvedSelectedKOLId = useMemo(() => {
    if (!isKOLPage || !selectedKOLId) {
      return null;
    }

    if (loading) {
      return selectedKOLId;
    }

    return selectedKOLData ? selectedKOLId : null;
  }, [isKOLPage, selectedKOLId, loading, selectedKOLData]);
  const resolvedCampaignDetailId = useMemo(() => {
    if (!isCampaignsPage || !campaignDetailId) {
      return null;
    }

    if (loading) {
      return campaignDetailId;
    }

    return campaignDetailData ? campaignDetailId : null;
  }, [isCampaignsPage, campaignDetailId, loading, campaignDetailData]);
  const resolvedApplyCampaignId = useMemo(() => {
    if (!isCampaignsPage || !applyCampaignId) {
      return null;
    }

    if (loading) {
      return applyCampaignId;
    }

    if (isApplyBlocked) {
      return null;
    }

    return applyCampaignData ? applyCampaignId : null;
  }, [isCampaignsPage, applyCampaignId, loading, isApplyBlocked, applyCampaignData]);
  const resolvedShowCreateCampaignModal = isCampaignsPage && showCreateCampaignModal;
  const currentSearch = typeof window === 'undefined' ? '' : window.location.search;
  const locationSearch = useMemo(() => {
    const params = new URLSearchParams(currentSearch);
    params.set('page', currentPage);

    if (resolvedSelectedKOLId) {
      params.set('kol', resolvedSelectedKOLId);
    } else {
      params.delete('kol');
    }

    if (resolvedCampaignDetailId) {
      params.set('campaign', resolvedCampaignDetailId);
    } else {
      params.delete('campaign');
    }

    if (resolvedApplyCampaignId) {
      params.set('apply', resolvedApplyCampaignId);
    } else {
      params.delete('apply');
    }

    if (showCreateModal) {
      params.set('create', '1');
    } else {
      params.delete('create');
    }

    if (resolvedShowCreateCampaignModal) {
      params.set('createCampaign', '1');
    } else {
      params.delete('createCampaign');
    }

    const newSearch = params.toString();
    return newSearch ? `?${newSearch}` : '';
  }, [
    currentSearch,
    currentPage,
    resolvedSelectedKOLId,
    resolvedCampaignDetailId,
    resolvedApplyCampaignId,
    showCreateModal,
    resolvedShowCreateCampaignModal
  ]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const applyUrlState = useCallback((search) => {
    const nextState = getUrlStateFromSearch(search, userRole);
    skipUrlSyncRef.current = true;
    setCurrentPage(nextState.currentPage);
    setSelectedKOLId(nextState.selectedKOLId);
    setCampaignDetailId(nextState.campaignDetailId);
    setApplyCampaignId(nextState.applyCampaignId);
    setShowCreateModal(nextState.showCreateModal);
    setShowCreateCampaignModal(nextState.showCreateCampaignModal);
  }, [userRole]);

  useEffect(() => {
    const handlePopState = () => applyUrlState(window.location.search);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyUrlState]);

  useEffect(() => {
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    if (window.location.search !== locationSearch) {
      window.history.pushState({}, '', `${window.location.pathname}${locationSearch}`);
    }
  }, [locationSearch]);

  // Load data
  useEffect(() => {
    setTimeout(() => {
      const userProfiles = safeParse(localStorage.getItem('userKOLProfiles'), []);
      const savedApplications = safeParse(localStorage.getItem('userApplications'), []);
      const savedFavorites = safeParse(localStorage.getItem('userFavorites'), []);
      const savedCampaigns = safeParse(localStorage.getItem('userCampaigns'), []);
      const savedInvites = safeParse(localStorage.getItem('reachlyInvites'), []);
      const savedDeals = safeParse(localStorage.getItem('reachlyDeals'), []);
      const allKOLs = [...mockData.kols, ...userProfiles];
      const allCampaigns = sortCampaigns([...(savedCampaigns || []), ...(mockData.campaigns || [])]);
      setKols(allKOLs);
      setCampaigns(allCampaigns);
      setApplications(savedApplications);
      setFavorites(savedFavorites);
      setInvites(savedInvites);
      setDeals(savedDeals);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (!applyCampaignId) {
      warnedApplyIdRef.current = null;
      return;
    }

    if (loading) {
      return;
    }

    if (!appliedCampaignIds.has(applyCampaignId)) {
      return;
    }

    if (warnedApplyIdRef.current === applyCampaignId) {
      return;
    }

    warnedApplyIdRef.current = applyCampaignId;
    addToast('You have already applied to this campaign', 'warning');
  }, [applyCampaignId, appliedCampaignIds, addToast, loading]);

  const filteredKols = useMemo(() => {
    let result = [...kols];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(kol =>
        kol.name.toLowerCase().includes(query) ||
        kol.bio.toLowerCase().includes(query) ||
        kol.tagline.toLowerCase().includes(query) ||
        kol.niche.some(n => n.toLowerCase().includes(query)) ||
        Object.keys(kol.platforms).some(p => p.toLowerCase().includes(query))
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter(kol => {
        const niches = getNiches(kol);
        return filters.categories.some(category => matchesCategory(niches, category));
      });
    }

    if (filters.platforms.length > 0) {
      result = result.filter(kol =>
        filters.platforms.some(platform => kol.platforms[platform])
      );
    }

    if (filters.followerRange.length > 0) {
      result = result.filter(kol => {
        const maxFollowers = Math.max(...Object.values(kol.platforms).map(p => p.followers));
        return filters.followerRange.some(range => {
          switch (range) {
            case '10k-50k': return maxFollowers >= 10000 && maxFollowers < 50000;
            case '50k-100k': return maxFollowers >= 50000 && maxFollowers < 100000;
            case '100k-500k': return maxFollowers >= 100000 && maxFollowers < 500000;
            case '500k-1m': return maxFollowers >= 500000 && maxFollowers < 1000000;
            case '1m+': return maxFollowers >= 1000000;
            default: return false;
          }
        });
      });
    }

    if (filters.engagementRate.length > 0) {
      result = result.filter(kol => {
        const maxEngagement = Math.max(...Object.values(kol.platforms).map(p => p.engagementRate));
        return filters.engagementRate.some(range => {
          switch (range) {
            case '1-3': return maxEngagement >= 1 && maxEngagement < 3;
            case '3-5': return maxEngagement >= 3 && maxEngagement < 5;
            case '5-10': return maxEngagement >= 5 && maxEngagement < 10;
            case '10+': return maxEngagement >= 10;
            default: return false;
          }
        });
      });
    }

    if (filters.verifiedOnly) {
      result = result.filter(kol => kol.verified);
    }

    if (sortOption === 'followers') {
      result.sort((a, b) => getTotalFollowers(b) - getTotalFollowers(a));
    } else if (sortOption === 'engagement') {
      result.sort((a, b) => getMaxEngagement(b) - getMaxEngagement(a));
    } else {
      result.sort((a, b) => getJoinTimestamp(b) - getJoinTimestamp(a));
    }

    return result;
  }, [searchQuery, filters, kols, sortOption]);

  const handleSearch = (query) => setSearchQuery(query);
  const handleSortChange = (value) => setSortOption(value);
  const handleViewToggle = (mode) => setViewMode(mode);
  const handleKOLClick = (kol) => setSelectedKOLId(kol.id);
  const handleCloseModal = () => setSelectedKOLId(null);
  const handlePageChange = useCallback((page) => {
    if (!userRole) {
      const inferredRole = inferRoleFromPage(page);
      if (inferredRole) {
        setUserRole(inferredRole);
        persistRole(inferredRole);
      }
    }

    setCurrentPage(page);

    if (page !== 'kols' && page !== 'favorites') {
      setSelectedKOLId(null);
    }

    if (page !== 'campaigns') {
      setCampaignDetailId(null);
      setApplyCampaignId(null);
      setShowCreateCampaignModal(false);
    }
  }, [userRole]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({
        categories: [],
        platforms: [],
        followerRange: [],
        engagementRate: [],
        verifiedOnly: false
      });
      addToast('Filters cleared', 'info');
    } else if (filterType === 'verifiedOnly') {
      setFilters(prev => ({ ...prev, verifiedOnly: value }));
    } else {
      setFilters(prev => ({ ...prev, [filterType]: value }));
    }
  };

  const openCreateProfile = useCallback(() => {
    setUserRole('kol');
    persistRole('kol');
    setShowCreateCampaignModal(false);
    setShowCreateModal(true);
  }, [setUserRole]);

  const openCreateCampaign = useCallback(() => {
    setUserRole('business');
    persistRole('business');
    handlePageChange('campaigns');
    setCampaignDetailId(null);
    setApplyCampaignId(null);
    setShowCreateModal(false);
    setShowCreateCampaignModal(true);
  }, [handlePageChange, setUserRole]);

  const handleRoleSelect = useCallback((role) => {
    if (role === 'business' || role === 'kol') {
      setUserRole(role);
      persistRole(role);
    }

    if (role === 'business') {
      handlePageChange('kols');
      return;
    }

    if (role === 'kol') {
      handlePageChange('campaigns');
      return;
    }

    handlePageChange('landing');
  }, [handlePageChange, setUserRole]);

  const handleRoleReset = useCallback(() => {
    setUserRole(null);
    persistRole(null);
    handlePageChange('start');
  }, [handlePageChange, setUserRole]);

  const primaryActionLabel = userRole === 'business'
    ? 'Post a Campaign'
    : (userRole === 'kol' ? 'List Your Profile' : 'Choose Role');
  const handlePrimaryAction = useCallback(() => {
    if (userRole === 'business') {
      openCreateCampaign();
      return;
    }

    if (userRole === 'kol') {
      openCreateProfile();
      return;
    }

    handlePageChange('start');
  }, [handlePageChange, openCreateCampaign, openCreateProfile, userRole]);

  const handleCreateProfile = (newProfile) => {
    const existingProfiles = safeParse(localStorage.getItem('userKOLProfiles'), []);
    const updatedProfiles = [...existingProfiles, newProfile];
    localStorage.setItem('userKOLProfiles', JSON.stringify(updatedProfiles));
    const allKOLs = [...mockData.kols, ...updatedProfiles];
    setKols(allKOLs);
    addToast('Profile created successfully! 🎉', 'success');
  };

  const handleCreateCampaign = (newCampaign) => {
    const existingCampaigns = safeParse(localStorage.getItem('userCampaigns'), []);
    const updatedCampaigns = [newCampaign, ...existingCampaigns];
    localStorage.setItem('userCampaigns', JSON.stringify(updatedCampaigns));
    const allCampaigns = sortCampaigns([...updatedCampaigns, ...(mockData.campaigns || [])]);
    setCampaigns(allCampaigns);
    addToast('Campaign posted successfully!', 'success');
  };

  const handleViewCampaign = (campaign) => {
    if (!campaign) {
      return;
    }
    handlePageChange('campaigns');
    setCampaignDetailId(campaign.id);
    setApplyCampaignId(null);
  };

  const handleViewCampaignById = (campaignId) => {
    const campaign = campaigns.find(item => item.id === campaignId);
    if (!campaign) {
      addToast('Campaign not found', 'error');
      return;
    }
    handleViewCampaign(campaign);
  };

  const handleApplyCampaign = (campaign) => {
    if (!campaign) {
      return;
    }

    if (appliedCampaignIds.has(campaign.id)) {
      addToast('You have already applied to this campaign', 'warning');
      return;
    }

    handlePageChange('campaigns');
    setApplyCampaignId(campaign.id);
    setCampaignDetailId(null);
  };

  const handleSubmitApplication = (application) => {
    const updatedApplications = [...applications, application];
    setApplications(updatedApplications);
    localStorage.setItem('userApplications', JSON.stringify(updatedApplications));
    addToast('Application submitted! The brand will review it soon.', 'success');
  };

  const handleWithdrawApplication = (applicationId) => {
    const updatedApplications = applications.filter(app => app.id !== applicationId);
    setApplications(updatedApplications);
    localStorage.setItem('userApplications', JSON.stringify(updatedApplications));
    addToast('Application withdrawn', 'info');
  };

  const handleUpdateApplicationStatus = (applicationId, status) => {
    const updatedApplications = applications.map(app => (
      app.id === applicationId ? { ...app, status } : app
    ));
    setApplications(updatedApplications);
    localStorage.setItem('userApplications', JSON.stringify(updatedApplications));
    addToast('Application status updated', 'info');
  };

  const handleToggleFavorite = (kol) => {
    const isFavorite = favorites.some(f => f.id === kol.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(f => f.id !== kol.id);
      addToast(`Removed ${kol.name} from favorites`, 'info');
    } else {
      updatedFavorites = [...favorites, kol];
      addToast(`Added ${kol.name} to favorites ❤️`, 'success');
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
  };

  const handleRemoveFavorite = (kolId) => {
    const kol = favorites.find(f => f.id === kolId);
    const updatedFavorites = favorites.filter(f => f.id !== kolId);
    setFavorites(updatedFavorites);
    localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
    if (kol) {
      addToast(`Removed ${kol.name} from favorites`, 'info');
    }
  };

  // ============================================
  // BUSINESS WORKFLOW HANDLERS
  // ============================================

  const handleOpenInviteModal = (kol) => {
    setInviteTargetKOL(kol);
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setInviteTargetKOL(null);
  };

  const handleSendInvite = (invite) => {
    const updatedInvites = [...invites, invite];
    setInvites(updatedInvites);
    localStorage.setItem('reachlyInvites', JSON.stringify(updatedInvites));
    addToast(`Invitation sent to ${invite.influencerName}!`, 'success');
  };

  const handleAcceptApplication = (applicationId) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    // Update application status
    const updatedApplications = applications.map(a =>
      a.id === applicationId ? { ...a, status: 'accepted' } : a
    );
    setApplications(updatedApplications);
    localStorage.setItem('userApplications', JSON.stringify(updatedApplications));

    // Create a new deal
    const campaign = campaigns.find(c => c.id === app.campaignId);
    const newDeal = {
      id: `deal-${Date.now()}`,
      applicationId,
      campaignId: app.campaignId,
      campaignTitle: app.campaignTitle || campaign?.title || 'Campaign',
      influencerId: app.creatorId,
      influencerName: app.creatorName || 'Creator',
      influencerAvatar: app.creatorAvatar,
      businessName: campaign?.businessName || 'Business',
      compensation: app.proposedRate || campaign?.budgetMin ? `SGD ${campaign.budgetMin}` : 'TBD',
      deliverables: campaign?.deliverables || [],
      contentDueDate: campaign?.contentDueDate || '',
      usageRights: campaign?.usageRights || ['organic'],
      paymentTerms: campaign?.paymentTerms || 'on_approval',
      status: 'pending',
      escrowStatus: 'pending',
      files: [],
      createdAt: new Date().toISOString()
    };

    const updatedDeals = [...deals, newDeal];
    setDeals(updatedDeals);
    localStorage.setItem('reachlyDeals', JSON.stringify(updatedDeals));
    addToast('Application accepted! Deal created.', 'success');
  };

  const handleRejectApplication = (applicationId) => {
    const updatedApplications = applications.map(a =>
      a.id === applicationId ? { ...a, status: 'rejected' } : a
    );
    setApplications(updatedApplications);
    localStorage.setItem('userApplications', JSON.stringify(updatedApplications));
    addToast('Application rejected', 'info');
  };

  const handleShortlistApplication = (applicationId) => {
    const updatedApplications = applications.map(a =>
      a.id === applicationId ? { ...a, status: 'shortlisted' } : a
    );
    setApplications(updatedApplications);
    localStorage.setItem('userApplications', JSON.stringify(updatedApplications));
    addToast('Application shortlisted', 'success');
  };

  const handleFundDeal = (dealId) => {
    const updatedDeals = deals.map(d =>
      d.id === dealId ? { ...d, escrowStatus: 'funded', status: 'in_progress' } : d
    );
    setDeals(updatedDeals);
    localStorage.setItem('reachlyDeals', JSON.stringify(updatedDeals));
    addToast('Escrow funded! Deal is now in progress.', 'success');
  };

  const handleApproveDeal = (dealId) => {
    const updatedDeals = deals.map(d =>
      d.id === dealId ? { ...d, status: 'approved' } : d
    );
    setDeals(updatedDeals);
    localStorage.setItem('reachlyDeals', JSON.stringify(updatedDeals));
    addToast('Content approved!', 'success');
  };

  const handleRequestRevision = (dealId) => {
    const updatedDeals = deals.map(d =>
      d.id === dealId ? { ...d, status: 'revision_requested' } : d
    );
    setDeals(updatedDeals);
    localStorage.setItem('reachlyDeals', JSON.stringify(updatedDeals));
    addToast('Revision requested', 'info');
  };

  const handleCompleteDeal = (dealId) => {
    const updatedDeals = deals.map(d =>
      d.id === dealId ? { ...d, status: 'completed' } : d
    );
    setDeals(updatedDeals);
    localStorage.setItem('reachlyDeals', JSON.stringify(updatedDeals));
    addToast('Deal completed! Payment released.', 'success');
  };

  const handleUpdateDealChecklist = (dealId, index) => {
    const updatedDeals = deals.map(d => {
      if (d.id !== dealId) return d;
      const deliverables = [...(d.deliverables || [])];
      if (deliverables[index]) {
        deliverables[index] = { ...deliverables[index], completed: !deliverables[index].completed };
      }
      return { ...d, deliverables };
    });
    setDeals(updatedDeals);
    localStorage.setItem('reachlyDeals', JSON.stringify(updatedDeals));
  };

  const handleAddDealFile = (dealId, file) => {
    const updatedDeals = deals.map(d => {
      if (d.id !== dealId) return d;
      return { ...d, files: [...(d.files || []), file] };
    });
    setDeals(updatedDeals);
    localStorage.setItem('reachlyDeals', JSON.stringify(updatedDeals));
    addToast('File added', 'success');
  };

  const handleViewDeal = (dealId) => {
    setSelectedDealId(dealId);
    handlePageChange('deals');
  };

  const selectedDeal = useMemo(() => {
    return deals.find(d => d.id === selectedDealId) || null;
  }, [deals, selectedDealId]);

  const renderPage = () => {
    switch (currentPage) {
      case 'start':
        return (
          <StartPage
            onSelectRole={handleRoleSelect}
            onSeeOverview={() => handlePageChange('landing')}
          />
        );
      case 'landing':
        return (
          <LandingPage
            onGetStarted={openCreateProfile}
            onBrowseKOLs={() => handlePageChange('kols')}
            featuredKOLs={kols.slice(0, 4)}
          />
        );
      case 'kols':
        return (
          <>
            {userRole === 'business' && (
              <RoleFlowBanner
                eyebrow="Business flow"
                title="Find creators, shortlist fast"
                description="Browse KOLs, save your favorites, and post a brief when you are ready."
                steps={[
                  'Browse KOL profiles that fit your niche',
                  'Save creators to your favorites list',
                  'Post a campaign brief to reach them'
                ]}
                actions={[
                  { label: 'Post a Campaign', onClick: openCreateCampaign, variant: 'primary' },
                  { label: 'View Favorites', onClick: () => handlePageChange('favorites'), variant: 'secondary' }
                ]}
              />
            )}
            <div className="layout">
              <FilterSidebar
                onFilterChange={handleFilterChange}
                activeFilters={filters}
                categoryCounts={categoryCounts}
              />
              <div className="content">
                <div className="contentHeader">
                  <div>
                    <h1 className="pageTitle">Discover KOLs</h1>
                    <p className="pageSubtitle">
                      {loading ? 'Loading...' : `${filteredKols.length} influencer${filteredKols.length !== 1 ? 's' : ''} available`}
                    </p>
                  </div>
                  <div className="sortControls">
                    <label className="sortLabel" htmlFor="kol-sort">Sort by</label>
                    <select
                      id="kol-sort"
                      className="sortSelect"
                      value={sortOption}
                      onChange={(event) => handleSortChange(event.target.value)}
                    >
                      <option value="newest">Newest</option>
                      <option value="followers">Most Followers</option>
                      <option value="engagement">Top Engagement</option>
                    </select>
                  </div>
                </div>
                <KOLGrid
                  kols={filteredKols}
                  viewMode={viewMode}
                  onKOLClick={handleKOLClick}
                  loading={loading}
                  favorites={favorites}
                  onFavorite={handleToggleFavorite}
                />
              </div>
            </div>
          </>
        );
      case 'campaigns':
        return (
          <>
            {userRole === 'kol' && (
              <RoleFlowBanner
                eyebrow="Creator flow"
                title="Get discovered and win paid campaigns"
                description="Getting job ready on our platform is simple and easy. Complete your profile, connect your social media accounts, set your niche (Audience interest) and pricing. Once all details are added, our smart AI will match you with the right brands so you can start receiving jobs. Finally, link your PayPal account to accept job offers and start receiving payments."
                steps={[
                  'Complete your profile and connect your social media accounts',
                  'Set your niche (Audience interest) and pricing',
                  'Get matched by our smart AI and start receiving jobs',
                  'Link your PayPal account to accept job offers and receive payments'
                ]}
                actions={[
                  { label: 'Create Profile', onClick: openCreateProfile, variant: 'primary' },
                  { label: 'View Applications', onClick: () => handlePageChange('applications'), variant: 'secondary' }
                ]}
              />
            )}
            <CampaignsPage
              campaigns={campaigns}
              onApply={handleApplyCampaign}
              onViewCampaign={handleViewCampaign}
              appliedCampaignIds={appliedCampaignIds}
              loading={loading}
              onCreateCampaign={userRole === 'business' || !userRole ? openCreateCampaign : null}
            />
          </>
        );
      case 'applications':
        return (
          <MyApplications
            applications={applications}
            onViewCampaign={handleViewCampaignById}
            onWithdraw={handleWithdrawApplication}
            onUpdateStatus={handleUpdateApplicationStatus}
            onBrowseCampaigns={() => handlePageChange('campaigns')}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onKOLClick={handleKOLClick}
            onBrowseKOLs={() => handlePageChange('kols')}
          />
        );
      case 'pricing':
        return (
          <PricingPage locationSearch={locationSearch} />
        );
      case 'dashboard':
        // Route to appropriate dashboard based on role
        if (isBusiness) {
          return (
            <BusinessDashboard
              campaigns={campaigns}
              applications={applications}
              deals={deals}
              onBrowseKOLs={() => handlePageChange('kols')}
              onPostCampaign={openCreateCampaign}
              onViewCampaigns={() => handlePageChange('campaigns')}
              onViewApplications={() => handlePageChange('applications')}
              onViewDeals={() => handlePageChange('deals')}
              onAcceptApplication={handleAcceptApplication}
              onRejectApplication={handleRejectApplication}
              onShortlistApplication={handleShortlistApplication}
              onViewDeal={handleViewDeal}
            />
          );
        }
        if (isInfluencer) {
          return (
            <InfluencerDashboard
              campaigns={campaigns}
              applications={applications}
              invites={invites}
              onBrowseCampaigns={() => handlePageChange('campaigns')}
              onCreateListing={openCreateProfile}
              onViewApplications={() => handlePageChange('applications')}
            />
          );
        }
        return null;
      case 'deals':
        if (selectedDeal) {
          return (
            <DealWorkroom
              deal={selectedDeal}
              onClose={() => {
                setSelectedDealId(null);
                handlePageChange('dashboard');
              }}
              onFundEscrow={handleFundDeal}
              onApproveDeliverable={handleApproveDeal}
              onRequestRevision={handleRequestRevision}
              onCompleteAndPay={handleCompleteDeal}
              onUpdateChecklist={handleUpdateDealChecklist}
              onAddFile={handleAddDealFile}
              isBusiness={isBusiness}
            />
          );
        }
        // If no deal selected, go back to dashboard
        handlePageChange('dashboard');
        return null;
      default:
        return null;
    }
  };

  // Helper functions for auth modal
  const openAuthModal = (mode = 'signup') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthComplete = () => {
    setShowAuthModal(false);
    // After auth, if role selection needed, it will be shown automatically
  };

  const handleRoleComplete = (role) => {
    // After role selection, onboarding will be shown automatically
    addToast(`Welcome! Let's set up your ${role === 'BUSINESS' ? 'business' : 'creator'} profile.`, 'success');
  };

  const handleOnboardingComplete = () => {
    addToast('Profile setup complete! 🎉', 'success');
    handlePageChange('dashboard');
  };

  // If authenticated but needs role selection, show role selection page
  if (isAuthenticated && needsRoleSelection) {
    return (
      <RoleSelectionPage onComplete={handleRoleComplete} />
    );
  }

  // If authenticated with role but needs onboarding, show onboarding
  if (isAuthenticated && needsOnboarding) {
    if (isBusiness) {
      return <BusinessOnboarding onComplete={handleOnboardingComplete} />;
    }
    if (isInfluencer) {
      return <InfluencerOnboarding onComplete={handleOnboardingComplete} />;
    }
  }

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        onViewToggle={handleViewToggle}
        onPrimaryAction={handlePrimaryAction}
        primaryActionLabel={primaryActionLabel}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        viewMode={viewMode}
        applicationCount={applications.length}
        favoritesCount={favorites.length}
        campaignCount={campaigns.length}
        userRole={userRole}
        isAuthenticated={isAuthenticated}
        onSignUp={() => openAuthModal('signup')}
        onLogIn={() => openAuthModal('login')}
        onLogout={logout}
      />

      <main className="main">
        <div className="container">
          {renderPage()}
        </div>
      </main>

      <Footer onPageChange={handlePageChange} />

      {selectedKOL && <KOLModal kol={selectedKOL} onClose={handleCloseModal} />}

      {campaignDetail && (
        <CampaignDetailModal
          campaign={campaignDetail}
          onClose={() => setCampaignDetailId(null)}
          onApply={handleApplyCampaign}
          hasApplied={appliedCampaignIds.has(campaignDetail.id)}
        />
      )}

      {applyCampaign && (
        <ApplyModal
          campaign={applyCampaign}
          onClose={() => setApplyCampaignId(null)}
          onSubmit={handleSubmitApplication}
        />
      )}

      {showCreateModal && (
        <CreateProfileModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProfile}
        />
      )}

      {resolvedShowCreateCampaignModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateCampaignModal(false)}
          onSubmit={handleCreateCampaign}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default App;

