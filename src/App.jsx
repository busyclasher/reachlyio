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
import Footer from './components/Footer';
import { useToast } from './components/Toast';
import CampaignDetailModal from './components/CampaignDetailModal';
import mockData from './data/mockKOLs.json';
import './App.css';

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

function App() {
  const { addToast } = useToast();
  const [kols, setKols] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filteredKols, setFilteredKols] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedKOLId, setSelectedKOLId] = useState(null);
  const [campaignDetailId, setCampaignDetailId] = useState(null);
  const [applyCampaignId, setApplyCampaignId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    platforms: [],
    followerRange: [],
    engagementRate: [],
    verifiedOnly: false
  });
  const skipUrlSyncRef = useRef(false);

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

  const selectedKOL = useMemo(
    () => kols.find(kol => kol.id === selectedKOLId) || null,
    [kols, selectedKOLId]
  );

  const campaignDetail = useMemo(
    () => campaigns.find(campaign => campaign.id === campaignDetailId) || null,
    [campaigns, campaignDetailId]
  );

  const applyCampaign = useMemo(
    () => campaigns.find(campaign => campaign.id === applyCampaignId) || null,
    [campaigns, applyCampaignId]
  );

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const applyUrlState = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const validPages = ['landing', 'kols', 'campaigns', 'applications', 'favorites'];
    const hasValidPage = pageParam && validPages.includes(pageParam);
    const kolId = params.get('kol');
    const campaignId = params.get('campaign');
    const applyId = params.get('apply');
    const create = params.get('create') === '1';
    const createCampaign = params.get('createCampaign') === '1';
    let nextPage = hasValidPage ? pageParam : 'landing';

    if (!hasValidPage) {
      if (kolId) {
        nextPage = 'kols';
      } else if (campaignId || applyId || createCampaign) {
        nextPage = 'campaigns';
      }
    }

    skipUrlSyncRef.current = true;
    setCurrentPage(nextPage);
    setSelectedKOLId(kolId);
    setCampaignDetailId(applyId || createCampaign ? null : campaignId);
    setApplyCampaignId(createCampaign ? null : applyId);
    setShowCreateModal(create && !createCampaign);
    setShowCreateCampaignModal(createCampaign);
  }, []);

  useEffect(() => {
    applyUrlState();
    const handlePopState = () => applyUrlState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyUrlState]);

  useEffect(() => {
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }

    const params = new URLSearchParams();
    params.set('page', currentPage);

    if (selectedKOLId) {
      params.set('kol', selectedKOLId);
    }

    if (campaignDetailId) {
      params.set('campaign', campaignDetailId);
    }

    if (applyCampaignId) {
      params.set('apply', applyCampaignId);
    }

    if (showCreateModal) {
      params.set('create', '1');
    }

    if (showCreateCampaignModal) {
      params.set('createCampaign', '1');
    }

    const newSearch = params.toString();
    if (window.location.search !== `?${newSearch}`) {
      window.history.pushState({}, '', `${window.location.pathname}?${newSearch}`);
    }
  }, [currentPage, selectedKOLId, campaignDetailId, applyCampaignId, showCreateModal, showCreateCampaignModal]);

  // Load data
  useEffect(() => {
    setTimeout(() => {
      const userProfiles = safeParse(localStorage.getItem('userKOLProfiles'), []);
      const savedApplications = safeParse(localStorage.getItem('userApplications'), []);
      const savedFavorites = safeParse(localStorage.getItem('userFavorites'), []);
      const savedCampaigns = safeParse(localStorage.getItem('userCampaigns'), []);
      const allKOLs = [...mockData.kols, ...userProfiles];
      const allCampaigns = sortCampaigns([...(savedCampaigns || []), ...(mockData.campaigns || [])]);
      setKols(allKOLs);
      setFilteredKols(allKOLs);
      setCampaigns(allCampaigns);
      setApplications(savedApplications);
      setFavorites(savedFavorites);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (currentPage !== 'kols' && currentPage !== 'favorites') {
      setSelectedKOLId(null);
    }

    if (currentPage !== 'campaigns') {
      setCampaignDetailId(null);
      setApplyCampaignId(null);
      setShowCreateCampaignModal(false);
    }
  }, [currentPage]);

  useEffect(() => {
    if (!loading && selectedKOLId && !selectedKOL) {
      setSelectedKOLId(null);
    }
  }, [loading, selectedKOLId, selectedKOL]);

  useEffect(() => {
    if (!loading && campaignDetailId && !campaignDetail) {
      setCampaignDetailId(null);
    }
  }, [loading, campaignDetailId, campaignDetail]);

  useEffect(() => {
    if (!loading && applyCampaignId && !applyCampaign) {
      setApplyCampaignId(null);
    }
  }, [loading, applyCampaignId, applyCampaign]);

  useEffect(() => {
    if (applyCampaignId && appliedCampaignIds.has(applyCampaignId)) {
      addToast('You have already applied to this campaign', 'warning');
      setApplyCampaignId(null);
    }
  }, [applyCampaignId, appliedCampaignIds, addToast]);

  // Apply filters and search
  useEffect(() => {
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

    setFilteredKols(result);
  }, [searchQuery, filters, kols, sortOption]);

  const handleSearch = (query) => setSearchQuery(query);
  const handleSortChange = (value) => setSortOption(value);
  const handleViewToggle = (mode) => setViewMode(mode);
  const handleKOLClick = (kol) => setSelectedKOLId(kol.id);
  const handleCloseModal = () => setSelectedKOLId(null);

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

  const openCreateProfile = () => {
    setShowCreateCampaignModal(false);
    setShowCreateModal(true);
  };

  const openCreateCampaign = () => {
    setCurrentPage('campaigns');
    setCampaignDetailId(null);
    setApplyCampaignId(null);
    setShowCreateModal(false);
    setShowCreateCampaignModal(true);
  };

  const handleCreateProfile = (newProfile) => {
    const existingProfiles = safeParse(localStorage.getItem('userKOLProfiles'), []);
    const updatedProfiles = [...existingProfiles, newProfile];
    localStorage.setItem('userKOLProfiles', JSON.stringify(updatedProfiles));
    const allKOLs = [...mockData.kols, ...updatedProfiles];
    setKols(allKOLs);
    setFilteredKols(allKOLs);
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
    setCurrentPage('campaigns');
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

    setCurrentPage('campaigns');
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

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={openCreateProfile}
            onBrowseKOLs={() => setCurrentPage('kols')}
            featuredKOLs={kols.slice(0, 4)}
          />
        );
      case 'kols':
        return (
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
        );
      case 'campaigns':
        return (
          <CampaignsPage
            campaigns={campaigns}
            onApply={handleApplyCampaign}
            onViewCampaign={handleViewCampaign}
            appliedCampaignIds={appliedCampaignIds}
            loading={loading}
            onCreateCampaign={openCreateCampaign}
          />
        );
      case 'applications':
        return (
          <MyApplications
            applications={applications}
            onViewCampaign={handleViewCampaignById}
            onWithdraw={handleWithdrawApplication}
            onUpdateStatus={handleUpdateApplicationStatus}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onKOLClick={handleKOLClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        onViewToggle={handleViewToggle}
        onCreateClick={openCreateProfile}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        viewMode={viewMode}
        applicationCount={applications.length}
        favoritesCount={favorites.length}
        campaignCount={campaigns.length}
      />

      <main className="main">
        <div className="container">
          {renderPage()}
        </div>
      </main>

      <Footer onPageChange={setCurrentPage} />

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

      {showCreateCampaignModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateCampaignModal(false)}
          onSubmit={handleCreateCampaign}
        />
      )}
    </div>
  );
}

export default App;
