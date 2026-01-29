import { useMemo, useState } from 'react';
import styles from '../styles/CampaignApplicantsPage.module.css';
import { filterOptions } from '../data/portalData';

const rangeMatch = (min, max, rangeMin, rangeMax) => max >= rangeMin && min <= rangeMax;

const CampaignApplicantsPage = ({
  campaign,
  applicants,
  applications,
  decisions,
  onBack,
  onViewApplicant,
  onShortlist,
  onReject,
  onContact,
  compareList,
  onToggleCompare,
  onClearCompare,
  onOpenCompare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [filters, setFilters] = useState({
    platforms: [],
    priceRange: [],
    niche: [],
    audienceLocation: [],
    engagementRate: [],
    audienceAge: [],
    language: [],
    contentFormat: [],
    availability: [],
    pastBrandCategories: []
  });

  const applicantRows = useMemo(() => (
    applications.map((application) => {
      const applicant = applicants.find(item => item.id === application.applicantId);
      return { application, applicant };
    }).filter(row => row.applicant)
  ), [applications, applicants]);

  const nicheOptions = useMemo(() => (
    Array.from(new Set(applicantRows.flatMap(row => row.applicant.niche || [])))
  ), [applicantRows]);

  const languageOptions = useMemo(() => (
    Array.from(new Set(applicantRows.flatMap(row => row.applicant.languages || [])))
  ), [applicantRows]);

  const contentOptions = useMemo(() => (
    Array.from(new Set(applicantRows.flatMap(row => row.applicant.contentFormats || [])))
  ), [applicantRows]);

  const brandCategoryOptions = useMemo(() => (
    Array.from(new Set(applicantRows.flatMap(row => row.applicant.pastBrandCategories || [])))
  ), [applicantRows]);

  const audienceLocations = useMemo(() => (
    Array.from(new Set(applicantRows.flatMap(row => (row.applicant.audience?.locations || []).map(loc => loc.label))))
  ), [applicantRows]);

  const toggleFilterValue = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter(item => item !== value) : [...current, value]
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      platforms: [],
      priceRange: [],
      niche: [],
      audienceLocation: [],
      engagementRate: [],
      audienceAge: [],
      language: [],
      contentFormat: [],
      availability: [],
      pastBrandCategories: []
    });
  };

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = applicantRows.filter(({ applicant }) => {
      if (!applicant) return false;

      if (query) {
        const queryMatch = [
          applicant.name,
          applicant.tagline,
          ...(applicant.niche || []),
          ...(Object.values(applicant.platforms || {}).map(platform => platform.handle || ''))
        ].some(value => value && value.toLowerCase().includes(query));

        if (!queryMatch) {
          return false;
        }
      }

      if (filters.platforms.length > 0) {
        const matchesPlatform = filters.platforms.some(platform => applicant.primaryPlatforms.includes(platform));
        if (!matchesPlatform) return false;
      }

      if (filters.priceRange.length > 0) {
        const matchesPrice = filters.priceRange.some((range) => {
          if (range === '0-1000') return rangeMatch(applicant.priceMin, applicant.priceMax, 0, 1000);
          if (range === '1000-2500') return rangeMatch(applicant.priceMin, applicant.priceMax, 1000, 2500);
          if (range === '2500-5000') return rangeMatch(applicant.priceMin, applicant.priceMax, 2500, 5000);
          if (range === '5000+') return applicant.priceMax >= 5000;
          return true;
        });
        if (!matchesPrice) return false;
      }

      if (filters.niche.length > 0) {
        const matchesNiche = filters.niche.some(niche => (applicant.niche || []).includes(niche));
        if (!matchesNiche) return false;
      }

      if (filters.audienceLocation.length > 0) {
        const locations = (applicant.audience?.locations || []).map(loc => loc.label);
        const matchesLocation = filters.audienceLocation.some(location => locations.includes(location));
        if (!matchesLocation) return false;
      }

      if (filters.engagementRate.length > 0) {
        const matchesEngagement = filters.engagementRate.some((range) => {
          if (range === '1-3') return applicant.maxEngagement >= 1 && applicant.maxEngagement < 3;
          if (range === '3-5') return applicant.maxEngagement >= 3 && applicant.maxEngagement < 5;
          if (range === '5-8') return applicant.maxEngagement >= 5 && applicant.maxEngagement < 8;
          if (range === '8+') return applicant.maxEngagement >= 8;
          return true;
        });
        if (!matchesEngagement) return false;
      }

      if (filters.audienceAge.length > 0) {
        const ageRanges = Object.keys(applicant.audience?.age || {});
        const matchesAge = filters.audienceAge.some(range => ageRanges.includes(range));
        if (!matchesAge) return false;
      }

      if (filters.language.length > 0) {
        const matchesLanguage = filters.language.some(language => (applicant.languages || []).includes(language));
        if (!matchesLanguage) return false;
      }

      if (filters.contentFormat.length > 0) {
        const matchesContent = filters.contentFormat.some(content => (applicant.contentFormats || []).includes(content));
        if (!matchesContent) return false;
      }

      if (filters.availability.length > 0) {
        const matchesAvailability = filters.availability.includes(applicant.availability);
        if (!matchesAvailability) return false;
      }

      if (filters.pastBrandCategories.length > 0) {
        const matchesCategory = filters.pastBrandCategories.some(category => (applicant.pastBrandCategories || []).includes(category));
        if (!matchesCategory) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    if (sortOption === 'engagement') {
      sorted.sort((a, b) => b.applicant.maxEngagement - a.applicant.maxEngagement);
    } else if (sortOption === 'priceLow') {
      sorted.sort((a, b) => a.applicant.priceMin - b.applicant.priceMin);
    } else if (sortOption === 'priceHigh') {
      sorted.sort((a, b) => b.applicant.priceMax - a.applicant.priceMax);
    } else if (sortOption === 'response') {
      sorted.sort((a, b) => (a.applicant.responseTimeHours || 0) - (b.applicant.responseTimeHours || 0));
    } else {
      sorted.sort((a, b) => new Date(b.application.appliedAt) - new Date(a.application.appliedAt));
    }

    return sorted;
  }, [applicantRows, filters, searchQuery, sortOption]);

  const activeFiltersCount = Object.values(filters).reduce((sum, list) => sum + (list.length || 0), 0);

  if (!campaign) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <button className={styles.backButton} type="button" onClick={onBack}>
            Back to My Campaigns
          </button>
          <h1>{campaign.title}</h1>
          <p>{campaign.description}</p>
          <div className={styles.campaignMeta}>
            <span>Budget: {campaign.budget}</span>
            <span>Platforms: {campaign.platforms.join(', ')}</span>
            <span>Applicants: {applications.length}</span>
          </div>
        </div>
        <div className={styles.searchSort}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search applicants by name, niche, or platform"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className={styles.sortBox}>
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
              <option value="recent">Most recent</option>
              <option value="engagement">Engagement rate</option>
              <option value="priceLow">Lowest price</option>
              <option value="priceHigh">Highest price</option>
              <option value="response">Fastest response</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.filters}>
          <div className={styles.filterHeader}>
            <h3>Filters</h3>
            {activeFiltersCount > 0 && (
              <button type="button" onClick={clearFilters} className={styles.clearFilters}>
                Clear all
              </button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <h4>Platform</h4>
            {filterOptions.platforms.map(platform => (
              <label key={platform} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.platforms.includes(platform)}
                  onChange={() => toggleFilterValue('platforms', platform)}
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Price range</h4>
            {filterOptions.priceRange.map(range => (
              <label key={range} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.priceRange.includes(range)}
                  onChange={() => toggleFilterValue('priceRange', range)}
                />
                <span>{range.replace('-', ' - ')}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Niche</h4>
            {nicheOptions.map(niche => (
              <label key={niche} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.niche.includes(niche)}
                  onChange={() => toggleFilterValue('niche', niche)}
                />
                <span>{niche}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Audience location</h4>
            {audienceLocations.map(location => (
              <label key={location} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.audienceLocation.includes(location)}
                  onChange={() => toggleFilterValue('audienceLocation', location)}
                />
                <span>{location}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Engagement rate</h4>
            {filterOptions.engagementRate.map(range => (
              <label key={range} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.engagementRate.includes(range)}
                  onChange={() => toggleFilterValue('engagementRate', range)}
                />
                <span>{range}%</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Audience age</h4>
            {filterOptions.audienceAge.map(range => (
              <label key={range} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.audienceAge.includes(range)}
                  onChange={() => toggleFilterValue('audienceAge', range)}
                />
                <span>{range}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Language</h4>
            {languageOptions.map(language => (
              <label key={language} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.language.includes(language)}
                  onChange={() => toggleFilterValue('language', language)}
                />
                <span>{language}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Content format</h4>
            {contentOptions.map(format => (
              <label key={format} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.contentFormat.includes(format)}
                  onChange={() => toggleFilterValue('contentFormat', format)}
                />
                <span>{format}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Availability</h4>
            {filterOptions.availability.map(option => (
              <label key={option} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.availability.includes(option)}
                  onChange={() => toggleFilterValue('availability', option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Past brand categories</h4>
            {brandCategoryOptions.map(category => (
              <label key={category} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.pastBrandCategories.includes(category)}
                  onChange={() => toggleFilterValue('pastBrandCategories', category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </aside>

        <section className={styles.tableSection}>
          <div className={styles.tableMeta}>
            <span>{filteredRows.length} applicants shown</span>
            {activeFiltersCount > 0 && <span>{activeFiltersCount} filters active</span>}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Compare</th>
                  <th>Applicant</th>
                  <th>Platforms</th>
                  <th>Engagement</th>
                  <th>Audience</th>
                  <th>Price range</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map(({ application, applicant }) => {
                  const decision = decisions[application.id] || { decision: 'applied', contacted: false };
                  const statusLabels = [];
                  if (decision.decision === 'shortlisted') statusLabels.push('Shortlisted');
                  if (decision.decision === 'rejected') statusLabels.push('Rejected');
                  if (decision.contacted) statusLabels.push('Contacted');
                  if (!statusLabels.length) statusLabels.push('Applied');

                  const compareChecked = compareList.includes(application.id);
                  const compareDisabled = !compareChecked && compareList.length >= 3;

                  return (
                    <tr key={application.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={compareChecked}
                          disabled={compareDisabled}
                          onChange={() => onToggleCompare(application.id)}
                        />
                      </td>
                      <td>
                        <div className={styles.applicantCell}>
                          <img src={applicant.profilePhoto} alt="" />
                          <div>
                            <strong>{applicant.name}</strong>
                            <span>{applicant.tagline}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.tagList}>
                          {applicant.primaryPlatforms.map(platform => (
                            <span key={platform} className={styles.tag}>{platform}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong>{applicant.maxEngagement.toFixed(1)}%</strong>
                        <span className={styles.muted}>{(applicant.followerTotal / 1000).toFixed(0)}k followers</span>
                      </td>
                      <td>
                        <strong>{applicant.audience?.locations?.[0]?.label || 'Global'}</strong>
                        <span className={styles.muted}>Top age {applicant.topAgeRange || '--'}</span>
                      </td>
                      <td>
                        <strong>{applicant.pricingRange}</strong>
                        <span className={styles.muted}>{applicant.contentFormats?.slice(0, 2).join(', ')}</span>
                      </td>
                      <td>
                        <strong>{applicant.availability}</strong>
                        <span className={styles.muted}>Response {applicant.responseTimeHours}h</span>
                      </td>
                      <td>
                        <div className={styles.statusList}>
                          {statusLabels.map(label => (
                            <span key={label} className={styles.status}>{label}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className={styles.actionStack}>
                          <button className={styles.linkButton} type="button" onClick={() => onViewApplicant(application.id)}>
                            View profile
                          </button>
                          <button className="btn btn-cta btn-sm" type="button" onClick={() => onShortlist(application.id)}>
                            Shortlist
                          </button>
                          <button className="btn btn-secondary btn-sm" type="button" onClick={() => onReject(application.id)}>
                            Reject
                          </button>
                          <button className="btn btn-cta btn-sm" type="button" onClick={() => onContact(application.id)}>
                            Contact
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {compareList.length > 0 && (
        <div className={styles.compareBar}>
          <div>
            Compare queue: {compareList.length} selected
          </div>
          <div className={styles.compareActions}>
            <button className="btn btn-secondary btn-sm" type="button" onClick={onClearCompare}>
              Clear
            </button>
            <button className="btn btn-cta btn-sm" type="button" onClick={onOpenCompare}>
              Compare
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignApplicantsPage;

