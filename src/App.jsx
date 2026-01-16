import { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import KOLGrid from './components/KOLGrid';
import KOLModal from './components/KOLModal';
import CreateProfileModal from './components/CreateProfileModal';
import CampaignsPage from './components/CampaignsPage';
import ApplyModal from './components/ApplyModal';
import MyApplications from './components/MyApplications';
import LandingPage from './components/LandingPage';
import FavoritesPage from './components/FavoritesPage';
import Footer from './components/Footer';
import { useToast } from './components/Toast';
import mockData from './data/mockKOLs.json';
import './App.css';

function App() {
  const { addToast } = useToast();
  const [kols, setKols] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filteredKols, setFilteredKols] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedKOL, setSelectedKOL] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    platforms: [],
    followerRange: [],
    engagementRate: [],
    verifiedOnly: false
  });

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Load data
  useEffect(() => {
    setTimeout(() => {
      const userProfiles = JSON.parse(localStorage.getItem('userKOLProfiles') || '[]');
      const savedApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
      const savedFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
      const allKOLs = [...mockData.kols, ...userProfiles];
      setKols(allKOLs);
      setFilteredKols(allKOLs);
      setCampaigns(mockData.campaigns || []);
      setApplications(savedApplications);
      setFavorites(savedFavorites);
      setLoading(false);
    }, 800);
  }, []);

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
        const kolNiches = kol.niche.map(n => n.toLowerCase());
        return filters.categories.some(cat => {
          if (cat === 'beauty') return kolNiches.some(n => n.includes('beauty') || n.includes('fashion'));
          if (cat === 'tech') return kolNiches.some(n => n.includes('tech') || n.includes('gaming'));
          if (cat === 'fitness') return kolNiches.some(n => n.includes('fitness') || n.includes('wellness'));
          if (cat === 'food') return kolNiches.some(n => n.includes('food') || n.includes('lifestyle'));
          if (cat === 'business') return kolNiches.some(n => n.includes('business') || n.includes('finance') || n.includes('marketing'));
          if (cat === 'travel') return kolNiches.some(n => n.includes('travel') || n.includes('photography'));
          return false;
        });
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

    setFilteredKols(result);
  }, [searchQuery, filters, kols]);

  const handleSearch = (query) => setSearchQuery(query);
  const handleViewToggle = (mode) => setViewMode(mode);
  const handleKOLClick = (kol) => setSelectedKOL(kol);
  const handleCloseModal = () => setSelectedKOL(null);

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

  const handleCreateProfile = (newProfile) => {
    const existingProfiles = JSON.parse(localStorage.getItem('userKOLProfiles') || '[]');
    const updatedProfiles = [...existingProfiles, newProfile];
    localStorage.setItem('userKOLProfiles', JSON.stringify(updatedProfiles));
    const allKOLs = [...mockData.kols, ...updatedProfiles];
    setKols(allKOLs);
    setFilteredKols(allKOLs);
    addToast('Profile created successfully! 🎉', 'success');
  };

  const handleApplyCampaign = (campaign) => {
    const alreadyApplied = applications.some(a => a.campaignId === campaign.id);
    if (alreadyApplied) {
      addToast('You have already applied to this campaign', 'warning');
      return;
    }
    setSelectedCampaign(campaign);
  };

  const handleSubmitApplication = (application) => {
    const updatedApplications = [...applications, application];
    setApplications(updatedApplications);
    localStorage.setItem('userApplications', JSON.stringify(updatedApplications));
    addToast('Application submitted! The brand will review it soon.', 'success');
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
            onGetStarted={() => setShowCreateModal(true)}
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
            />
            <div className="content">
              <div className="contentHeader">
                <div>
                  <h1 className="pageTitle">Discover KOLs</h1>
                  <p className="pageSubtitle">
                    {loading ? 'Loading...' : `${filteredKols.length} influencer${filteredKols.length !== 1 ? 's' : ''} available`}
                  </p>
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
          />
        );
      case 'applications':
        return (
          <MyApplications
            applications={applications}
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
        onCreateClick={() => setShowCreateModal(true)}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        viewMode={viewMode}
        applicationCount={applications.length}
        favoritesCount={favorites.length}
      />

      <main className="main">
        <div className="container">
          {renderPage()}
        </div>
      </main>

      <Footer onPageChange={setCurrentPage} />

      {selectedKOL && <KOLModal kol={selectedKOL} onClose={handleCloseModal} />}

      {selectedCampaign && (
        <ApplyModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onSubmit={handleSubmitApplication}
        />
      )}

      {showCreateModal && (
        <CreateProfileModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProfile}
        />
      )}
    </div>
  );
}

export default App;
