import { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import KOLGrid from './components/KOLGrid';
import KOLModal from './components/KOLModal';
import CreateProfileModal from './components/CreateProfileModal';
import mockKOLsData from './data/mockKOLs.json';
import './App.css';

function App() {
  const [kols, setKols] = useState([]);
  const [filteredKols, setFilteredKols] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedKOL, setSelectedKOL] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    platforms: [],
    followerRange: [],
    engagementRate: [],
    verifiedOnly: false
  });

  // Load mock data + user-created profiles from localStorage
  useEffect(() => {
    setTimeout(() => {
      const userProfiles = JSON.parse(localStorage.getItem('userKOLProfiles') || '[]');
      const allKOLs = [...mockKOLsData.kols, ...userProfiles];
      setKols(allKOLs);
      setFilteredKols(allKOLs);
      setLoading(false);
    }, 800);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...kols];

    // Search filter
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

    // Category filter
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

    // Platform filter
    if (filters.platforms.length > 0) {
      result = result.filter(kol =>
        filters.platforms.some(platform => kol.platforms[platform])
      );
    }

    // Follower range filter
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

    // Engagement rate filter
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

    // Verified filter
    if (filters.verifiedOnly) {
      result = result.filter(kol => kol.verified);
    }

    setFilteredKols(result);
  }, [searchQuery, filters, kols]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewToggle = (mode) => {
    setViewMode(mode);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({
        categories: [],
        platforms: [],
        followerRange: [],
        engagementRate: [],
        verifiedOnly: false
      });
    } else if (filterType === 'verifiedOnly') {
      setFilters(prev => ({
        ...prev,
        verifiedOnly: value
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const handleKOLClick = (kol) => {
    setSelectedKOL(kol);
  };

  const handleCloseModal = () => {
    setSelectedKOL(null);
  };

  const handleCreateProfile = (newProfile) => {
    const existingProfiles = JSON.parse(localStorage.getItem('userKOLProfiles') || '[]');
    const updatedProfiles = [...existingProfiles, newProfile];
    localStorage.setItem('userKOLProfiles', JSON.stringify(updatedProfiles));
    const allKOLs = [...mockKOLsData.kols, ...updatedProfiles];
    setKols(allKOLs);
    setFilteredKols(allKOLs);
    alert('Profile created successfully! 🎉');
  };

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        onViewToggle={handleViewToggle}
        viewMode={viewMode}
      />

      <main className="main">
        <div className="container">
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
              />
            </div>
          </div>
        </div>
      </main>

      {selectedKOL && (
        <KOLModal kol={selectedKOL} onClose={handleCloseModal} />
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
