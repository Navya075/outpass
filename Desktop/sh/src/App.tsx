import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HazardProvider, useHazard } from './context/HazardContext';
import { UserRole } from './types/user';
import { HazardZone } from './types/hazard';

// Layout & Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Auth & Onboarding Pages
import { LandingPage } from './components/auth/LandingPage';
import { RoleSelectionPage } from './components/auth/RoleSelectionPage';
import { CitizenRegistration } from './components/auth/CitizenRegistration';
import { RescueRegistration } from './components/auth/RescueRegistration';
import { ControlRegistration } from './components/auth/ControlRegistration';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';

// Citizen Views
import { CitizenHome } from './components/citizen/CitizenHome';
import { CitizenRiskMap } from './components/citizen/CitizenRiskMap';
import { CitizenRiskDetails } from './components/citizen/CitizenRiskDetails';
import { CitizenEvacuate } from './components/citizen/CitizenEvacuate';
import { CitizenAlerts } from './components/citizen/CitizenAlerts';
import { CitizenEmergency } from './components/citizen/CitizenEmergency';
import { CitizenSafetyGuide } from './components/citizen/CitizenSafetyGuide';
import { CitizenProfile } from './components/citizen/CitizenProfile';

// Rescue Views
import { RescueOverview } from './components/rescue/RescueOverview';
import { RescueLiveMap } from './components/rescue/RescueLiveMap';
import { PriorityLocationsTable } from './components/rescue/PriorityLocationsTable';
import { RescueMissions } from './components/rescue/RescueMissions';
import { RescueTeams } from './components/rescue/RescueTeams';
import { RoadAccessibility } from './components/rescue/RoadAccessibility';
import { ResourceTracker } from './components/rescue/ResourceTracker';
import { RescueAlerts } from './components/rescue/RescueAlerts';
import { RescueProfile } from './components/rescue/RescueProfile';

// Control Center Views
import { ControlOverview } from './components/control/ControlOverview';
import { RegionalRiskMap } from './components/control/RegionalRiskMap';
import { RiskEvolutionView } from './components/control/RiskEvolutionView';
import { ResponsePriorityQueue } from './components/control/ResponsePriorityQueue';
import { ImpactAssessmentView } from './components/control/ImpactAssessmentView';
import { LeadTimeUrgencyView } from './components/control/LeadTimeUrgencyView';
import { BroadcastAlertCenter } from './components/control/BroadcastAlertCenter';
import { CommandOperationsView } from './components/control/CommandOperationsView';
import { EnvironmentalSensorsView } from './components/control/EnvironmentalSensorsView';
import { AIInsightsConsole } from './components/control/AIInsightsConsole';
import { ControlProfile } from './components/control/ControlProfile';

export type AppView =
  | 'landing'
  | 'select-role'
  | 'register-citizen'
  | 'register-rescue'
  | 'register-control'
  | 'login'
  | 'forgot'
  | 'dashboard';

const MainLayout: React.FC<{ onNavigateLanding: () => void }> = ({ onNavigateLanding }) => {
  const { currentRole } = useAuth();
  const { setSelectedZone } = useHazard();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('citizen-home');
  const [missionTargetZone, setMissionTargetZone] = useState<HazardZone | null>(null);

  // Automatically sync default tab when role changes
  useEffect(() => {
    if (currentRole === 'citizen') {
      setCurrentTab('citizen-home');
    } else if (currentRole === 'rescue') {
      setCurrentTab('rescue-overview');
    } else if (currentRole === 'control') {
      setCurrentTab('control-overview');
    }
  }, [currentRole]);

  const handleSelectZoneForMission = (zone: HazardZone) => {
    setMissionTargetZone(zone);
    setSelectedZone(zone);
  };

  const handleNavigateProfile = () => {
    if (currentRole === 'citizen') setCurrentTab('citizen-profile');
    else if (currentRole === 'rescue') setCurrentTab('rescue-profile');
    else setCurrentTab('control-profile');
  };

  const getPageTitle = (): string => {
    const titles: Record<string, string> = {
      'citizen-home': 'Home',
      'citizen-map': 'Risk Map',
      'citizen-details': 'Risk Details',
      'citizen-evacuate': 'Evacuation Assistant',
      'citizen-alerts': 'Alerts',
      'citizen-emergency': 'Emergency SOS',
      'citizen-guide': 'Safety Guide',
      'citizen-profile': 'Profile & Contacts',
      'rescue-overview': 'Rescue Operations',
      'rescue-map': 'Live Risk Map',
      'rescue-priority': 'Priority Locations',
      'rescue-missions': 'Missions',
      'rescue-teams': 'Rescue Teams',
      'rescue-roads': 'Road Accessibility',
      'rescue-resources': 'Resource Tracker',
      'rescue-alerts': 'Alerts',
      'rescue-profile': 'Profile & Team',
      'control-overview': 'Control Operations',
      'control-map': 'Regional Risk Map',
      'control-evolution': 'Risk Forecast',
      'control-impact': 'Impact Assessment',
      'control-priority': 'Response Priority',
      'control-leadtime': 'Urgency & Lead Time',
      'control-alertcenter': 'Alert Broadcast',
      'control-command': 'Command Coordination',
      'control-sensors': 'Sensor Network',
      'control-insights': 'AI Explanations',
      'control-profile': 'Profile & System',
    };
    return titles[currentTab] || 'Overview';
  };

  const renderActiveView = () => {
    // 1. Citizen Role Views
    if (currentRole === 'citizen') {
      switch (currentTab) {
        case 'citizen-home':
          return <CitizenHome onNavigate={(t) => setCurrentTab(t)} />;
        case 'citizen-map':
          return <CitizenRiskMap onNavigate={(t) => setCurrentTab(t)} />;
        case 'citizen-details':
          return <CitizenRiskDetails onNavigate={(t) => setCurrentTab(t)} />;
        case 'citizen-evacuate':
          return <CitizenEvacuate />;
        case 'citizen-alerts':
          return <CitizenAlerts onNavigate={(t) => setCurrentTab(t)} />;
        case 'citizen-emergency':
          return <CitizenEmergency />;
        case 'citizen-guide':
          return <CitizenSafetyGuide />;
        case 'citizen-profile':
          return <CitizenProfile />;
        default:
          return <CitizenHome onNavigate={(t) => setCurrentTab(t)} />;
      }
    }

    // 2. Rescue Team Role Views
    if (currentRole === 'rescue') {
      switch (currentTab) {
        case 'rescue-overview':
          return (
            <RescueOverview
              onNavigate={(t) => setCurrentTab(t)}
              onSelectZoneForMission={handleSelectZoneForMission}
            />
          );
        case 'rescue-map':
          return (
            <RescueLiveMap
              onNavigate={(t) => setCurrentTab(t)}
              onSelectZoneForMission={handleSelectZoneForMission}
            />
          );
        case 'rescue-priority':
          return (
            <PriorityLocationsTable
              onSelectZoneForMission={handleSelectZoneForMission}
              onNavigate={(t) => setCurrentTab(t)}
            />
          );
        case 'rescue-missions':
          return (
            <RescueMissions
              initialSelectedZone={missionTargetZone}
              onNavigate={(t) => setCurrentTab(t)}
            />
          );
        case 'rescue-teams':
          return <RescueTeams />;
        case 'rescue-roads':
          return <RoadAccessibility />;
        case 'rescue-resources':
          return <ResourceTracker />;
        case 'rescue-alerts':
          return <RescueAlerts onNavigate={(t) => setCurrentTab(t)} />;
        case 'rescue-profile':
          return <RescueProfile />;
        default:
          return (
            <RescueOverview
              onNavigate={(t) => setCurrentTab(t)}
              onSelectZoneForMission={handleSelectZoneForMission}
            />
          );
      }
    }

    // 3. Control Center Role Views
    if (currentRole === 'control') {
      switch (currentTab) {
        case 'control-overview':
          return (
            <ControlOverview
              onNavigate={(t) => setCurrentTab(t)}
              onSelectZone={(zone) => setSelectedZone(zone)}
            />
          );
        case 'control-map':
          return <RegionalRiskMap />;
        case 'control-evolution':
          return <RiskEvolutionView />;
        case 'control-priority':
          return <ResponsePriorityQueue onNavigate={(t) => setCurrentTab(t)} />;
        case 'control-impact':
          return <ImpactAssessmentView />;
        case 'control-leadtime':
          return <LeadTimeUrgencyView />;
        case 'control-alertcenter':
          return <BroadcastAlertCenter />;
        case 'control-ops':
          return <CommandOperationsView />;
        case 'control-sensors':
          return <EnvironmentalSensorsView />;
        case 'control-ai':
          return <AIInsightsConsole />;
        case 'control-profile':
          return <ControlProfile />;
        default:
          return (
            <ControlOverview
              onNavigate={(t) => setCurrentTab(t)}
              onSelectZone={(zone) => setSelectedZone(zone)}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 text-slate-900 antialiased">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateHome={() => {
          if (currentRole === 'citizen') setCurrentTab('citizen-home');
          else if (currentRole === 'rescue') setCurrentTab('rescue-overview');
          else setCurrentTab('control-overview');
        }}
        onNavigateLanding={onNavigateLanding}
        onNavigateAlerts={() => {
          if (currentRole === 'citizen') setCurrentTab('citizen-alerts');
          else if (currentRole === 'rescue') setCurrentTab('rescue-alerts');
          else setCurrentTab('control-alertcenter');
        }}
        onNavigateProfile={handleNavigateProfile}
        currentPageTitle={getPageTitle()}
        showEmergencyNotice={!(currentRole === 'citizen' && currentTab === 'citizen-home')}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tabId) => setCurrentTab(tabId)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-w-0">
          <div className="mx-auto max-w-7xl">{renderActiveView()}</div>
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [activeView, setActiveView] = useState<AppView>('landing');

  // Protected route guard: dashboard is only accessible when authenticated
  useEffect(() => {
    if (activeView === 'dashboard' && !isLoggedIn) {
      setActiveView('landing');
    }
  }, [activeView, isLoggedIn]);

  const handleRoleSelected = (role: UserRole) => {
    if (role === 'citizen') setActiveView('register-citizen');
    else if (role === 'rescue') setActiveView('register-rescue');
    else setActiveView('register-control');
  };

  return (
    <>
      {/* 1. Landing Page (Default initial view) */}
      {activeView === 'landing' && (
        <LandingPage
          onGetStarted={() => setActiveView('select-role')}
          onNavigateLogin={() => setActiveView('login')}
          onSelectRole={handleRoleSelected}
        />
      )}

      {/* 2. Role Selection Page ("How will you use LANDSAFE?") */}
      {activeView === 'select-role' && (
        <RoleSelectionPage
          onSelectRole={handleRoleSelected}
          onNavigateLogin={() => setActiveView('login')}
          onNavigateLanding={() => setActiveView('landing')}
        />
      )}

      {/* 3. Role-Specific 5-Step Registrations */}
      {activeView === 'register-citizen' && (
        <CitizenRegistration
          onSuccess={() => setActiveView('dashboard')}
          onNavigateLogin={() => setActiveView('login')}
          onNavigateLanding={() => setActiveView('landing')}
          onBackToRoles={() => setActiveView('select-role')}
        />
      )}

      {activeView === 'register-rescue' && (
        <RescueRegistration
          onSuccess={() => setActiveView('dashboard')}
          onNavigateLogin={() => setActiveView('login')}
          onNavigateLanding={() => setActiveView('landing')}
          onBackToRoles={() => setActiveView('select-role')}
        />
      )}

      {activeView === 'register-control' && (
        <ControlRegistration
          onSuccess={() => setActiveView('dashboard')}
          onNavigateLogin={() => setActiveView('login')}
          onNavigateLanding={() => setActiveView('landing')}
          onBackToRoles={() => setActiveView('select-role')}
        />
      )}

      {/* 4. Unified Login Page with Demo Quick Login */}
      {activeView === 'login' && (
        <LoginPage
          onSuccess={(_role) => setActiveView('dashboard')}
          onNavigateRegister={() => setActiveView('select-role')}
          onNavigateForgot={() => setActiveView('forgot')}
          onNavigateLanding={() => setActiveView('landing')}
        />
      )}

      {/* 5. Forgot Password */}
      {activeView === 'forgot' && (
        <ForgotPasswordPage
          onNavigateLogin={() => setActiveView('login')}
          onNavigateLanding={() => setActiveView('landing')}
        />
      )}

      {/* 6. Authenticated Role Dashboards */}
      {activeView === 'dashboard' && isLoggedIn && (
        <MainLayout onNavigateLanding={() => setActiveView('landing')} />
      )}
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <HazardProvider>
        <AppContent />
      </HazardProvider>
    </AuthProvider>
  );
}

export default App;
