import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity, 
  Calendar, 
  Shield, 
  Search, 
  FileText,
  MapPin
} from 'lucide-react';

interface Student {
  id: string;
  email: string;
  name: string;
  mobile: string | null;
}

interface Mentor {
  id: string;
  name: string;
  email: string;
}

interface Outpass {
  id: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UTILIZED' | 'ESCALATED';
  appliedAt: string;
  student: Student;
  mentor: Mentor;
}

interface AnalyticsData {
  summary: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    utilized: number;
    activeOutside: number;
  };
  today: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    utilized: number;
  };
  studentsOutside: Outpass[];
}

interface DailyTrend {
  date: string;
  dayName: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

interface TrendsData {
  dailyTrends: DailyTrend[];
  statsSummary: {
    APPROVED: number;
    REJECTED: number;
    PENDING: number;
    UTILIZED: number;
    ESCALATED: number;
    total: number;
    approvalRate: number;
  };
  commonReasons: {
    reason: string;
    count: number;
  }[];
  peakUsage: {
    peakDay: string;
    peakHourRange: string;
  };
}

interface StudentActivity {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  lastOutpassDate: string | null;
  mostCommonReason: string;
  usageStatus: 'Normal' | 'High Usage';
}

const HodPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'trends' | 'activity'>('analytics');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [studentActivity, setStudentActivity] = useState<StudentActivity[] | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<'all' | 'normal' | 'high'>('all');

  // Fetch Analytics
  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await api.get('/hod/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching HOD analytics:', err);
      toast.error('Failed to load analytics data.');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch Trends
  const fetchTrends = async () => {
    try {
      setLoadingTrends(true);
      const res = await api.get('/hod/trends');
      setTrends(res.data);
    } catch (err) {
      console.error('Error fetching HOD trends:', err);
      toast.error('Failed to load usage reports and trends.');
    } finally {
      setLoadingTrends(false);
    }
  };

  // Fetch Student Activity
  const fetchStudentActivity = async () => {
    try {
      setLoadingActivity(true);
      const res = await api.get('/hod/student-activity');
      setStudentActivity(res.data);
    } catch (err) {
      console.error('Error fetching student activity data:', err);
      toast.error('Failed to load student activity data.');
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'trends' && !trends) {
      fetchTrends();
    } else if (activeTab === 'activity' && !studentActivity) {
      fetchStudentActivity();
    }
  }, [activeTab]);

  const filteredStudentsOutside = analytics?.studentsOutside.filter(pass => 
    pass.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pass.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pass.reason.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredActivityData = studentActivity?.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(activitySearchQuery.toLowerCase());
    
    if (activityFilter === 'high') {
      return matchesSearch && student.usageStatus === 'High Usage';
    } else if (activityFilter === 'normal') {
      return matchesSearch && student.usageStatus === 'Normal';
    }
    return matchesSearch;
  }) || [];

  return (
    <div className="container py-4 fade-in">
      {/* Header Panel */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">HOD Control & Analytics Panel</h2>
          <p className="text-muted mb-0">Departmental gate pass monitoring, analytics, and trends</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="d-inline-flex bg-white p-1 rounded-3 shadow-sm border">
          <button 
            className={`btn px-3 py-2 border-0 rounded-2 fw-medium transition-all ${activeTab === 'analytics' ? 'btn-primary text-white' : 'text-secondary'}`}
            onClick={() => setActiveTab('analytics')}
            style={activeTab === 'analytics' ? { background: 'var(--primary-color)' } : { background: 'none' }}
          >
            <Shield size={16} className="me-2" />
            Analytics Dashboard
          </button>
          <button 
            className={`btn px-3 py-2 border-0 rounded-2 fw-medium transition-all ${activeTab === 'trends' ? 'btn-primary text-white' : 'text-secondary'}`}
            onClick={() => setActiveTab('trends')}
            style={activeTab === 'trends' ? { background: 'var(--primary-color)' } : { background: 'none' }}
          >
            <TrendingUp size={16} className="me-2" />
            Usage Reports & Trends
          </button>
          <button 
            className={`btn px-3 py-2 border-0 rounded-2 fw-medium transition-all ${activeTab === 'activity' ? 'btn-primary text-white' : 'text-secondary'}`}
            onClick={() => setActiveTab('activity')}
            style={activeTab === 'activity' ? { background: 'var(--primary-color)' } : { background: 'none' }}
          >
            <Users size={16} className="me-2" />
            Student Activity
          </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
        // ANALYTICS TAB
        <div>
          {loadingAnalytics ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !analytics ? (
            <div className="alert alert-warning">No analytics data available</div>
          ) : (
            <div>
              {/* Summary Cards */}
              <div className="row g-4 mb-4">
                {[
                  {
                    title: 'Total Outpasses',
                    value: analytics.summary.total,
                    icon: FileText,
                    color: 'primary',
                    desc: 'Overall gate passes applied',
                    filter: 'all'
                  },
                  {
                    title: 'Approved Outpasses',
                    value: analytics.summary.approved,
                    icon: CheckCircle,
                    color: 'success',
                    desc: 'Active approved passes',
                    filter: 'approved'
                  },
                  {
                    title: 'Rejected Outpasses',
                    value: analytics.summary.rejected,
                    icon: XCircle,
                    color: 'danger',
                    desc: 'Declined applications',
                    filter: 'rejected'
                  },
                  {
                    title: 'Pending Outpasses',
                    value: analytics.summary.pending,
                    icon: Clock,
                    color: 'warning',
                    desc: 'Awaiting mentor approval',
                    filter: 'pending'
                  }
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} className="col-12 col-sm-6 col-lg-3">
                      <div 
                        className="card h-100 border-0 shadow-sm transition-all"
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = '';
                        }}
                        onClick={() => navigate(`/hod/outpasses?filter=${card.filter}`)}
                      >
                        <div className="card-body p-4 d-flex align-items-center gap-3">
                          <div 
                            className={`rounded-3 p-3 bg-${card.color} bg-opacity-10 text-${card.color}`}
                            style={{ width: 'fit-content' }}
                          >
                            <Icon size={24} />
                          </div>
                          <div>
                            <h6 className="text-muted fw-semibold mb-1 small">{card.title}</h6>
                            <h3 className="fw-bold mb-1 text-dark">{card.value}</h3>
                            <small className="text-muted-50" style={{ fontSize: '0.75rem' }}>{card.desc}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Today's Activity */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Activity size={20} className="text-primary" />
                    <h5 className="fw-bold mb-0 text-dark">Today's Gate Pass Summary</h5>
                  </div>
                  <small className="text-muted d-flex align-items-center gap-1 fw-medium">
                    <Calendar size={14} />
                    {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </small>
                </div>
                
                <div className="card-body px-4 pb-4 pt-2">
                  <div className="row g-3">
                    {[
                      { label: 'Total Applied', value: analytics.today.total, color: 'text-primary', bg: 'bg-primary', filter: 'today' },
                      { label: 'Approved', value: analytics.today.approved, color: 'text-success', bg: 'bg-success', filter: 'today-approved' },
                      { label: 'Pending', value: analytics.today.pending, color: 'text-warning', bg: 'bg-warning', filter: 'today-pending' },
                      { label: 'Rejected', value: analytics.today.rejected, color: 'text-danger', bg: 'bg-danger', filter: 'today-rejected' },
                      { label: 'Utilized (Left)', value: analytics.today.utilized, color: 'text-info', bg: 'bg-info', filter: 'today-utilized' }
                    ].map((item, idx) => (
                      <div key={idx} className="col-6 col-md">
                        <div 
                          className="p-3 bg-light rounded-3 text-center border h-100 transition-all"
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 .25rem .5rem rgba(0,0,0,.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '';
                          }}
                          onClick={() => navigate(`/hod/outpasses?filter=${item.filter}`)}
                        >
                          <h6 className="text-secondary small fw-semibold text-uppercase mb-2">{item.label}</h6>
                          <div className={`h2 fw-bold mb-0 ${item.color}`}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Students Currently Outside */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={20} className="text-success animate-pulse" />
                      <div>
                        <h5 className="fw-bold mb-0 text-dark">Students Currently Outside</h5>
                        <small className="text-muted">Students with valid active gate passes who haven't returned</small>
                      </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="position-relative" style={{ maxWidth: '300px' }}>
                      <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <input 
                        type="text" 
                        placeholder="Search student, roll no..."
                        className="form-control ps-5 py-2 border rounded-pill"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="card-body p-4">
                  {filteredStudentsOutside.length === 0 ? (
                    <div className="text-center py-5 bg-light rounded-3 border border-dashed">
                      <Users size={40} className="text-muted mb-2" />
                      <h6 className="fw-semibold text-dark mb-1">No Students Outside</h6>
                      <p className="text-muted small mb-0">All approved students are either inside or passes have expired.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Student Name</th>
                            <th>Roll No / Email</th>
                            <th>Mentor</th>
                            <th>Reason for Outpass</th>
                            <th>Approved At</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudentsOutside.map((pass) => (
                            <tr key={pass.id}>
                              <td>
                                <div className="fw-bold text-dark">{pass.student.name}</div>
                                {pass.student.mobile && (
                                  <small className="text-muted">{pass.student.mobile}</small>
                                )}
                              </td>
                              <td>
                                <span className="small text-muted">{pass.student.email}</span>
                              </td>
                              <td>
                                <div className="fw-semibold text-secondary small">{pass.mentor.name}</div>
                              </td>
                              <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span className="text-dark small" title={pass.reason}>{pass.reason}</span>
                              </td>
                              <td>
                                <span className="small text-muted">
                                  {new Date(pass.appliedAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-success text-white px-2 py-1 small rounded">
                                  Outside
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'trends' && (
        // REPORTS AND TRENDS TAB
        <div>
          {loadingTrends ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !trends ? (
            <div className="alert alert-warning">No trend data available</div>
          ) : (
            <div className="row g-4">
              {/* Left Column: 7 Day Trend Chart */}
              <div className="col-12 col-lg-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                    <h5 className="fw-bold mb-1 text-dark">Gate Pass Daily Trends</h5>
                    <p className="text-muted small">Total outpasses applied in the last 7 days</p>
                  </div>
                  
                  <div className="card-body px-4 pb-4 pt-2 d-flex flex-column justify-content-between">
                    {/* Render Custom CSS Bar Chart */}
                    <div className="d-flex align-items-end justify-content-around bg-light p-4 rounded-3 border mb-4" style={{ height: '220px' }}>
                      {trends.dailyTrends.map((day) => {
                        const maxVal = Math.max(...trends.dailyTrends.map(d => d.total), 1);
                        const heightPct = (day.total / maxVal) * 80 + 10; // offset so even 0 has a tiny indicator or 0 has 0
                        const isZero = day.total === 0;

                        return (
                          <div 
                            key={day.date} 
                            className="d-flex flex-column align-items-center flex-grow-1"
                            style={{ maxWidth: '60px' }}
                          >
                            <div className="w-100 position-relative d-flex align-items-end justify-content-center" style={{ height: '150px' }}>
                              {!isZero && (
                                <span className="small fw-bold text-dark position-absolute" style={{ bottom: `${heightPct}%`, fontSize: '0.8rem' }}>
                                  {day.total}
                                </span>
                              )}
                              <div 
                                className="w-50 rounded-top transition-all"
                                style={{ 
                                  height: isZero ? '4px' : `${heightPct}%`, 
                                  background: isZero ? '#cbd5e1' : 'linear-gradient(180deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                                  cursor: 'pointer'
                                }}
                                title={`Total: ${day.total}\nApproved: ${day.approved}\nRejected: ${day.rejected}\nPending: ${day.pending}`}
                              />
                            </div>
                            <span className="small text-muted fw-bold mt-2 text-uppercase" style={{ fontSize: '0.75rem' }}>{day.dayName}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chart Legend */}
                    <div className="d-flex flex-wrap justify-content-center gap-4 text-muted small">
                      <div className="d-flex align-items-center gap-1">
                        <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: 'var(--primary-color)' }} />
                        <span>Daily Total Pass Applications</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#cbd5e1' }} />
                        <span>No Activity (0)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Approval/Rejection Insights */}
              <div className="col-12 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                    <h5 className="fw-bold mb-1 text-dark">Approval Statistics</h5>
                    <p className="text-muted small">Overview of approval rates and request breakdown</p>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column justify-content-between gap-3">
                    {/* Big rate display */}
                    <div className="text-center p-4 bg-light rounded-3 border">
                      <h6 className="text-uppercase small text-muted fw-bold mb-2">Overall Approval Rate</h6>
                      <div className="d-inline-flex align-items-center gap-2">
                        <div className="h1 fw-bold text-success mb-0">{trends.statsSummary.approvalRate}%</div>
                        <TrendingUp size={24} className="text-success" />
                      </div>
                      <p className="text-muted small mb-0 mt-2">
                        Out of {trends.statsSummary.APPROVED + trends.statsSummary.UTILIZED + trends.statsSummary.REJECTED} resolved outpasses
                      </p>
                    </div>

                    {/* Simple Breakdown Table */}
                    <div className="d-flex flex-column gap-2 small">
                      <div className="d-flex justify-content-between p-2 rounded hover:bg-light">
                        <span className="text-muted fw-semibold">Utilized (Used Passes)</span>
                        <span className="fw-bold text-dark">{trends.statsSummary.UTILIZED}</span>
                      </div>
                      <div className="d-flex justify-content-between p-2 rounded hover:bg-light">
                        <span className="text-muted fw-semibold">Approved (Unused Passes)</span>
                        <span className="fw-bold text-dark">{trends.statsSummary.APPROVED}</span>
                      </div>
                      <div className="d-flex justify-content-between p-2 rounded hover:bg-light">
                        <span className="text-muted fw-semibold">Rejected Passes</span>
                        <span className="fw-bold text-dark">{trends.statsSummary.REJECTED}</span>
                      </div>
                      <div className="d-flex justify-content-between p-2 rounded hover:bg-light">
                        <span className="text-muted fw-semibold">Awaiting Review</span>
                        <span className="fw-bold text-dark">{trends.statsSummary.PENDING}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Left: Common Reasons */}
              <div className="col-12 col-lg-7">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                    <h5 className="fw-bold mb-1 text-dark">Most Common Outpass Reasons</h5>
                    <p className="text-muted small">Top reasons students request to leave campus</p>
                  </div>
                  
                  <div className="card-body p-4">
                    {trends.commonReasons.length === 0 ? (
                      <div className="text-center py-5 text-muted">No data available</div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {trends.commonReasons.map((item, idx) => {
                          const maxReason = Math.max(...trends.commonReasons.map(r => r.count), 1);
                          const widthPct = (item.count / maxReason) * 100;
                          return (
                            <div key={idx}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-semibold text-dark small">{item.reason}</span>
                                <span className="badge bg-light text-primary fw-bold">{item.count} passes</span>
                              </div>
                              <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                <div 
                                  className="progress-bar bg-primary" 
                                  role="progressbar" 
                                  style={{ 
                                    width: `${widthPct}%`, 
                                    borderRadius: '4px',
                                    background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--primary-dark) 100%)' 
                                  }}
                                  aria-valuenow={widthPct} 
                                  aria-valuemin={0} 
                                  aria-valuemax={100}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Right: Peak Hours & Trends */}
              <div className="col-12 col-lg-5">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                    <h5 className="fw-bold mb-1 text-dark">Peak Usage Patterns</h5>
                    <p className="text-muted small">Identified peaks over the last 30 days</p>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column justify-content-around gap-3">
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border">
                      <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h6 className="text-muted small mb-1">Peak Day of Week</h6>
                        <h5 className="fw-bold text-dark mb-0">{trends.peakUsage.peakDay}</h5>
                        <small className="text-muted-50" style={{ fontSize: '0.72rem' }}>Day with the highest request volume</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border">
                      <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h6 className="text-muted small mb-1">Peak Hours for Requests</h6>
                        <h5 className="fw-bold text-dark mb-0">{trends.peakUsage.peakHourRange}</h5>
                        <small className="text-muted-50" style={{ fontSize: '0.72rem' }}>Most active time windows</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        // STUDENT ACTIVITY MONITORING TAB
        <div>
          {loadingActivity ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !studentActivity ? (
            <div className="alert alert-warning">No student activity data available</div>
          ) : (
            <div className="card border-0 shadow-sm fade-in">
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <Users size={20} className="text-primary" />
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">Student Activity Monitoring</h5>
                      <small className="text-muted">Track frequency of outpasses, last pass dates, and usage patterns</small>
                    </div>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center">
                    {/* Search */}
                    <div className="position-relative" style={{ minWidth: '220px' }}>
                      <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <input 
                        type="text" 
                        placeholder="Search student, email..."
                        className="form-control ps-5 py-2 border rounded-pill"
                        value={activitySearchQuery}
                        onChange={(e) => setActivitySearchQuery(e.target.value)}
                        style={{ fontSize: '0.875rem' }}
                      />
                    </div>

                    {/* Filter Buttons */}
                    <div className="btn-group border rounded-pill p-1 bg-light" role="group" aria-label="Usage Filter">
                      <button 
                        type="button" 
                        className={`btn btn-sm border-0 rounded-pill px-3 py-1 fw-semibold text-capitalize ${activityFilter === 'all' ? 'btn-primary text-white' : 'text-secondary bg-transparent'}`}
                        style={activityFilter === 'all' ? { background: 'var(--primary-color)' } : {}}
                        onClick={() => setActivityFilter('all')}
                      >
                        All
                      </button>
                      <button 
                        type="button" 
                        className={`btn btn-sm border-0 rounded-pill px-3 py-1 fw-semibold text-capitalize ${activityFilter === 'normal' ? 'btn-success text-white' : 'text-secondary bg-transparent'}`}
                        style={activityFilter === 'normal' ? { background: 'var(--success-color)' } : {}}
                        onClick={() => setActivityFilter('normal')}
                      >
                        Normal
                      </button>
                      <button 
                        type="button" 
                        className={`btn btn-sm border-0 rounded-pill px-3 py-1 fw-semibold text-capitalize ${activityFilter === 'high' ? 'btn-danger text-white' : 'text-secondary bg-transparent'}`}
                        style={activityFilter === 'high' ? { background: 'var(--danger-color)' } : {}}
                        onClick={() => setActivityFilter('high')}
                      >
                        High Usage
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-4">
                {filteredActivityData.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-3 border border-dashed">
                    <Users size={40} className="text-muted mb-2" />
                    <h6 className="fw-semibold text-dark mb-1">No Students Found</h6>
                    <p className="text-muted small mb-0">No student activity records match your search or filter.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Student Name</th>
                          <th>Roll No / Email</th>
                          <th className="text-center">Total Passes</th>
                          <th className="text-center text-success">Approved</th>
                          <th className="text-center text-danger">Rejected</th>
                          <th className="text-center text-warning">Pending</th>
                          <th>Last Outpass Date</th>
                          <th>Most Common Reason</th>
                          <th>Activity Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActivityData.map((student) => (
                          <tr key={student.id}>
                            <td>
                              <div className="fw-bold text-dark">{student.name}</div>
                              {student.mobile && (
                                <small className="text-muted">{student.mobile}</small>
                              )}
                            </td>
                            <td>
                              <span className="small text-muted">{student.email}</span>
                            </td>
                            <td className="text-center fw-bold text-dark">{student.total}</td>
                            <td className="text-center fw-bold text-success">{student.approved}</td>
                            <td className="text-center fw-bold text-danger">{student.rejected}</td>
                            <td className="text-center fw-bold text-warning">{student.pending}</td>
                            <td>
                              <span className="small text-muted">
                                {student.lastOutpassDate ? (
                                  new Date(student.lastOutpassDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                ) : (
                                  'N/A'
                                )}
                              </span>
                            </td>
                            <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <span className="text-dark small" title={student.mostCommonReason}>
                                {student.mostCommonReason}
                              </span>
                            </td>
                            <td>
                              <span className={`badge px-2 py-1 rounded small ${
                                student.usageStatus === 'High Usage' 
                                  ? 'bg-danger text-white' 
                                  : 'bg-success text-white'
                              }`}>
                                {student.usageStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HodPanel;
