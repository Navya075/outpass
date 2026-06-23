import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  FileText,
  AlertCircle
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
  updatedAt: string;
  qrGeneratedAt: string | null;
  scannedAt: string | null;
  student: Student;
  mentor: Mentor;
}

const HodOutpassDetails: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL filter query parameter: defaults to 'all'
  const filter = searchParams.get('filter') || 'all';
  
  // Determine main active tab based on filter parameter
  const getMainTab = (filterVal: string) => {
    if (filterVal.startsWith('today')) {
      return 'today';
    }
    if (['all', 'approved', 'pending', 'rejected', 'utilized'].includes(filterVal)) {
      return filterVal;
    }
    return 'all';
  };
  
  const mainTab = getMainTab(filter);
  
  const [outpasses, setOutpasses] = useState<Outpass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch filtered outpasses from the backend
  const fetchOutpasses = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/hod/outpasses?filter=${filter}`);
      setOutpasses(res.data);
    } catch (err) {
      console.error('Error fetching outpass details:', err);
      toast.error('Failed to load outpass details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutpasses();
  }, [filter]);

  const handleMainTabChange = (tabId: string) => {
    if (tabId === 'today') {
      setSearchParams({ filter: 'today' });
    } else {
      setSearchParams({ filter: tabId });
    }
  };

  const handleSubFilterChange = (subFilterId: string) => {
    setSearchParams({ filter: subFilterId });
  };

  // Local/client-side search and optional date filtering
  const filteredOutpasses = outpasses.filter(pass => {
    const matchesSearch = 
      pass.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.reason.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDate = selectedDate 
      ? new Date(pass.appliedAt).toDateString() === new Date(selectedDate).toDateString()
      : true;

    return matchesSearch && matchesDate;
  });

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-4 fade-in">
      {/* Header Panel */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary rounded-circle p-2 d-inline-flex align-items-center justify-content-center border"
            onClick={() => navigate('/hod')}
            style={{ width: '40px', height: '40px' }}
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="fw-bold text-dark mb-1">Gate Pass Details</h2>
            <p className="text-muted mb-0">Detailed outpass request logs and status history</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex flex-wrap bg-white p-1 rounded-3 shadow-sm border gap-1">
          {[
            { id: 'all', label: 'All Outpasses', icon: FileText },
            { id: 'approved', label: 'Approved', icon: CheckCircle },
            { id: 'pending', label: 'Pending', icon: Clock },
            { id: 'rejected', label: 'Rejected', icon: XCircle },
            { id: 'utilized', label: 'Utilized / Left', icon: Activity },
            { id: 'today', label: 'Today', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = mainTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`btn px-3 py-2 border-0 rounded-2 fw-medium transition-all d-inline-flex align-items-center ${isActive ? 'btn-primary text-white' : 'text-secondary'}`}
                onClick={() => handleMainTabChange(tab.id)}
                style={isActive ? { background: 'var(--primary-color)' } : { background: 'none' }}
              >
                <Icon size={16} className="me-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Today Sub-filters */}
      {mainTab === 'today' && (
        <div className="card border-0 shadow-sm mb-4 bg-light">
          <div className="card-body p-3 d-flex flex-wrap gap-2 align-items-center">
            <span className="text-secondary small fw-bold text-uppercase me-2" style={{ fontSize: '0.75rem' }}>Today's Filters:</span>
            {[
              { id: 'today', label: 'All Today' },
              { id: 'today-approved', label: 'Approved Today' },
              { id: 'today-pending', label: 'Pending Today' },
              { id: 'today-rejected', label: 'Rejected Today' },
              { id: 'today-utilized', label: 'Utilized Today' }
            ].map(sub => {
              const isActive = filter === sub.id;
              return (
                <button
                  key={sub.id}
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold border ${isActive ? 'btn-primary text-white border-primary' : 'btn-outline-secondary bg-white'}`}
                  onClick={() => handleSubFilterChange(sub.id)}
                  style={isActive ? { background: 'var(--primary-color)' } : {}}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Date Filter Controls */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            {/* Search Bar */}
            <div className="col-12 col-md-8">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search by student name, roll number, email, mentor, or reason..."
                  className="form-control ps-5 py-2 border rounded-pill"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
            </div>
            {/* Date Picker Filter */}
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small fw-semibold text-nowrap">Filter Date:</span>
                <input 
                  type="date" 
                  className="form-control border rounded-pill py-2 px-3"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ fontSize: '0.875rem' }}
                />
                {selectedDate && (
                  <button 
                    className="btn btn-sm btn-link text-danger text-decoration-none small text-nowrap"
                    onClick={() => setSelectedDate('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredOutpasses.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-3 border border-dashed">
              <AlertCircle size={40} className="text-muted mb-2" />
              <h6 className="fw-semibold text-dark mb-1">No Outpasses Found</h6>
              <p className="text-muted small mb-0">No records match the current filter, search query, or date.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student Name</th>
                    <th>Roll No / Email</th>
                    <th>Mentor Name</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Applied At</th>
                    <th>Approved At</th>
                    <th>QR Generated At</th>
                    <th>Scanned / Exit Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOutpasses.map((pass) => (
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
                        <span className="small text-secondary fw-semibold">{pass.mentor.name}</span>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <span className="text-dark small" title={pass.reason}>{pass.reason}</span>
                      </td>
                      <td>
                        <span className={`badge px-2 py-1 rounded small ${
                          pass.status === 'APPROVED' ? 'bg-success text-white' :
                          pass.status === 'PENDING' ? 'bg-warning text-dark' :
                          pass.status === 'REJECTED' ? 'bg-danger text-white' :
                          pass.status === 'UTILIZED' ? 'bg-info text-white' :
                          'bg-secondary text-white'
                        }`}>
                          {pass.status === 'UTILIZED' ? 'Utilized / Left' : pass.status}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {formatDateTime(pass.appliedAt)}
                      </td>
                      <td className="small text-muted">
                        {pass.status !== 'PENDING' ? formatDateTime(pass.updatedAt) : 'N/A'}
                      </td>
                      <td className="small text-muted">
                        {formatDateTime(pass.qrGeneratedAt)}
                      </td>
                      <td className="small text-muted">
                        {formatDateTime(pass.scannedAt)}
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
  );
};

export default HodOutpassDetails;
