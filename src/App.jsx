import { useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import MyCampaignsPage from './components/MyCampaignsPage';
import CampaignApplicantsPage from './components/CampaignApplicantsPage';
import ApplicantProfileDrawer from './components/ApplicantProfileDrawer';
import CompareApplicantsPage from './components/CompareApplicantsPage';
import ShortlistPage from './components/ShortlistPage';
import MessagesPage from './components/MessagesPage';
import SettingsPage from './components/SettingsPage';
import { applicants, campaigns, buildApplications } from './data/portalData';
import { useToast } from './components/useToast';
import './App.css';

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const DECISION_STORAGE_KEY = 'reachlyDecisionMap';
const NOTES_STORAGE_KEY = 'reachlyNotes';
const CONTACT_STORAGE_KEY = 'reachlyContacts';

const getTimestamp = () => new Date().toLocaleString('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

const escapeCsv = (value) => {
  if (value == null) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

function App() {
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [decisions, setDecisions] = useState(() => safeParse(localStorage.getItem(DECISION_STORAGE_KEY), {}));
  const [notes, setNotes] = useState(() => safeParse(localStorage.getItem(NOTES_STORAGE_KEY), {}));
  const [threads, setThreads] = useState(() => safeParse(localStorage.getItem(CONTACT_STORAGE_KEY), {}));

  const applications = useMemo(() => buildApplications(), []);
  const applicantById = useMemo(() => Object.fromEntries(applicants.map(item => [item.id, item])), []);
  const campaignById = useMemo(() => Object.fromEntries(campaigns.map(item => [item.id, item])), []);
  const applicationById = useMemo(() => Object.fromEntries(applications.map(item => [item.id, item])), [applications]);

  const selectedCampaign = selectedCampaignId ? campaignById[selectedCampaignId] : null;
  const campaignApplications = useMemo(
    () => applications.filter(app => app.campaignId === selectedCampaignId),
    [applications, selectedCampaignId]
  );

  const selectedApplication = selectedApplicationId ? applicationById[selectedApplicationId] : null;
  const selectedApplicant = selectedApplication ? applicantById[selectedApplication.applicantId] : null;
  const selectedDecision = selectedApplication ? decisions[selectedApplication.id] : null;

  const compareRows = useMemo(() => (
    compareList.map((applicationId) => {
      const application = applicationById[applicationId];
      if (!application) return null;
      const applicant = applicantById[application.applicantId];
      return applicant ? { application, applicant } : null;
    }).filter(Boolean)
  ), [compareList, applicationById, applicantById]);

  const shortlistRows = useMemo(() => (
    applications
      .filter(app => decisions[app.id]?.decision === 'shortlisted')
      .map((application) => ({
        application,
        applicant: applicantById[application.applicantId],
        campaign: campaignById[application.campaignId],
        decision: decisions[application.id] || { decision: 'shortlisted', contacted: false }
      }))
      .filter(row => row.applicant && row.campaign)
  ), [applications, decisions, applicantById, campaignById]);

  const threadList = useMemo(() => (
    Object.values(threads)
      .map(thread => {
        const application = applicationById[thread.applicationId];
        if (!application) return null;
        return {
          ...thread,
          applicant: applicantById[application.applicantId],
          campaign: campaignById[application.campaignId]
        };
      })
      .filter(item => item && item.applicant && item.campaign)
  ), [threads, applicationById, applicantById, campaignById]);

  const persist = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore persistence errors.
    }
  };

  const updateDecisions = (applicationId, updates) => {
    setDecisions((prev) => {
      const next = {
        ...prev,
        [applicationId]: {
          decision: 'applied',
          contacted: false,
          ...prev[applicationId],
          ...updates
        }
      };
      persist(DECISION_STORAGE_KEY, next);
      return next;
    });
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('campaigns');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
    setSelectedApplicationId(null);
    setCompareList([]);
  };

  const handleSelectCampaign = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setCurrentPage('campaign');
    setSelectedApplicationId(null);
    setCompareList([]);
  };

  const handleBackToCampaigns = () => {
    setCurrentPage('campaigns');
    setSelectedApplicationId(null);
    setCompareList([]);
  };

  const handleViewApplicant = (applicationId) => {
    setSelectedApplicationId(applicationId);
  };

  const handleCloseApplicant = () => {
    setSelectedApplicationId(null);
  };

  const handleShortlist = (applicationId) => {
    updateDecisions(applicationId, { decision: 'shortlisted' });
    addToast('Applicant shortlisted', 'success');
  };

  const handleReject = (applicationId) => {
    updateDecisions(applicationId, { decision: 'rejected' });
    addToast('Applicant rejected', 'info');
  };

  const ensureThread = (applicationId) => {
    const existing = threads[applicationId];
    if (existing) return;

    const application = applicationById[applicationId];
    if (!application) return;

    const applicant = applicantById[application.applicantId];
    const campaign = campaignById[application.campaignId];
    if (!applicant || !campaign) return;

    const firstName = applicant.name.split(' ')[0];
    const intro = `Hi ${firstName}, thanks for applying to ${campaign.title}. We would love to learn more about your availability and proposed deliverables.`;

    const nextThreads = {
      ...threads,
      [applicationId]: {
        id: applicationId,
        applicationId,
        status: 'draft',
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: 'Business',
            text: intro,
            timestamp: getTimestamp()
          }
        ]
      }
    };
    setThreads(nextThreads);
    persist(CONTACT_STORAGE_KEY, nextThreads);
  };

  const handleContact = (applicationId) => {
    updateDecisions(applicationId, { contacted: true });
    ensureThread(applicationId);
    addToast('Contact request drafted', 'success');
  };

  const handleToggleCompare = (applicationId) => {
    setCompareList((prev) => {
      const exists = prev.includes(applicationId);
      if (exists) {
        return prev.filter(item => item !== applicationId);
      }
      if (prev.length >= 3) {
        addToast('You can compare up to 3 applicants.', 'warning');
        return prev;
      }
      return [...prev, applicationId];
    });
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleNotesChange = (applicantId, value) => {
    setNotes((prev) => {
      const next = { ...prev, [applicantId]: value };
      persist(NOTES_STORAGE_KEY, next);
      return next;
    });
  };

  const handleSendMessage = (threadId, text) => {
    setThreads((prev) => {
      const thread = prev[threadId];
      if (!thread) return prev;
      const nextThread = {
        ...thread,
        status: 'sent',
        messages: [
          ...thread.messages,
          {
            id: `m-${Date.now()}`,
            sender: 'Business',
            text,
            timestamp: getTimestamp()
          }
        ]
      };
      const next = { ...prev, [threadId]: nextThread };
      persist(CONTACT_STORAGE_KEY, next);
      return next;
    });
    addToast('Message sent', 'success');
  };

  const handleRemoveShortlist = (applicationId) => {
    updateDecisions(applicationId, { decision: 'applied' });
    addToast('Removed from shortlist', 'info');
  };

  const handleExportCsv = () => {
    if (!shortlistRows.length) {
      addToast('No shortlisted applicants to export.', 'warning');
      return;
    }
    const header = ['Applicant', 'Campaign', 'Platforms', 'Engagement', 'Followers', 'Price range', 'Status'];
    const rows = shortlistRows.map((row) => ([
      row.applicant.name,
      row.campaign.title,
      row.applicant.primaryPlatforms.join('|'),
      row.applicant.maxEngagement,
      row.applicant.followerTotal,
      row.applicant.pricingRange,
      row.decision.contacted ? 'Contacted' : 'Shortlisted'
    ]));
    const csv = [header, ...rows].map(values => values.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shortlist.csv';
    link.click();
    URL.revokeObjectURL(url);
    addToast('CSV exported', 'success');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'campaigns':
        return (
          <MyCampaignsPage
            campaigns={campaigns}
            applications={applications}
            decisions={decisions}
            onSelectCampaign={handleSelectCampaign}
          />
        );
      case 'campaign':
        return (
          <CampaignApplicantsPage
            key={selectedCampaignId}
            campaign={selectedCampaign}
            applicants={applicants}
            applications={campaignApplications}
            decisions={decisions}
            onBack={handleBackToCampaigns}
            onViewApplicant={handleViewApplicant}
            onShortlist={handleShortlist}
            onReject={handleReject}
            onContact={handleContact}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onClearCompare={handleClearCompare}
            onOpenCompare={() => setCurrentPage('compare')}
          />
        );
      case 'compare':
        return (
          <CompareApplicantsPage
            rows={compareRows}
            onRemove={handleToggleCompare}
            onShortlist={handleShortlist}
            onContact={handleContact}
            onBack={() => setCurrentPage('campaign')}
          />
        );
      case 'shortlist':
        return (
          <ShortlistPage
            shortlisted={shortlistRows}
            onContact={handleContact}
            onRemove={handleRemoveShortlist}
            onExport={handleExportCsv}
          />
        );
      case 'messages':
        return (
          <MessagesPage
            threads={threadList}
            onSendMessage={handleSendMessage}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        shortlistCount={shortlistRows.length}
        messageCount={threadList.length}
        compareCount={compareList.length}
        isAuthenticated={isAuthenticated}
      />

      <main className="main">
        <div className="container">
          {renderPage()}
        </div>
      </main>

      {isAuthenticated && <Footer />}

      <ApplicantProfileDrawer
        applicant={selectedApplicant}
        application={selectedApplication}
        decision={selectedDecision}
        notes={selectedApplicant ? notes[selectedApplicant.id] : ''}
        onNotesChange={handleNotesChange}
        onClose={handleCloseApplicant}
        onShortlist={handleShortlist}
        onReject={handleReject}
        onContact={handleContact}
      />
    </div>
  );
}

export default App;

