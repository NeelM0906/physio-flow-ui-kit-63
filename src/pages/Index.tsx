import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  Activity, 
  FileText, 
  List,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  User,
  Stethoscope,
  Target,
  BookOpen
} from 'lucide-react';

// Import new components
import SOAPTemplates from '../components/SOAPTemplates';
import AdvancedScheduling from '../components/AdvancedScheduling';
import ExercisePrescription from '../components/ExercisePrescription';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  medications: string[];
  allergies: string[];
  diagnosis: string;
  treatmentGoals: string[];
  status: 'active' | 'inactive';
  lastVisit: string;
  nextAppointment: string | null;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  type: 'Evaluation' | 'Follow-up' | 'Discharge' | 'Needs Attention';
  status: 'scheduled' | 'completed' | 'cancelled';
  therapist: string;
  room: string;
  notes?: string;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string;
  imageUrl?: string;
}

interface SOAPNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  appointmentId?: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface PrescribedExercise {
  exerciseId: string;
  patientId: string;
  sets: number;
  reps: string;
  frequency: string;
  duration: string;
  notes: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    address: '123 Oak Street, Springfield, IL 62701',
    emergencyContact: 'Michael Johnson (Husband)',
    emergencyPhone: '(555) 123-4568',
    medicalHistory: 'Previous ACL reconstruction (2019), occasional lower back pain',
    medications: ['Ibuprofen 400mg as needed', 'Vitamin D 1000 IU daily'],
    allergies: ['Penicillin'],
    diagnosis: 'Post-surgical knee rehabilitation, chronic lower back pain',
    treatmentGoals: ['Improve knee strength and stability', 'Reduce lower back pain', 'Return to recreational running'],
    status: 'active',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-22'
  },
  {
    id: '2',
    name: 'Robert Chen',
    email: 'robert.chen@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1972-11-08',
    address: '456 Maple Avenue, Springfield, IL 62702',
    emergencyContact: 'Lisa Chen (Wife)',
    emergencyPhone: '(555) 234-5679',
    medicalHistory: 'Rotator cuff injury (2023), hypertension',
    medications: ['Lisinopril 10mg daily', 'Fish oil 1000mg daily'],
    allergies: ['None known'],
    diagnosis: 'Right shoulder impingement syndrome',
    treatmentGoals: ['Restore full range of motion', 'Eliminate shoulder pain', 'Return to tennis'],
    status: 'active',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-18'
  },
  {
    id: '3',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '(555) 345-6789',
    dateOfBirth: '1990-03-22',
    address: '789 Pine Street, Springfield, IL 62703',
    emergencyContact: 'Carlos Garcia (Brother)',
    emergencyPhone: '(555) 345-6790',
    medicalHistory: 'No significant medical history',
    medications: ['Birth control pill'],
    allergies: ['Latex'],
    diagnosis: 'Plantar fasciitis, bilateral',
    treatmentGoals: ['Reduce heel pain', 'Improve foot mechanics', 'Return to running marathons'],
    status: 'active',
    lastVisit: '2024-01-12',
    nextAppointment: null
  }
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-01-22',
    time: '09:00',
    duration: 60,
    type: 'Follow-up',
    status: 'scheduled',
    therapist: 'Dr. Sarah Martinez',
    room: 'Room 1'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Robert Chen',
    date: '2024-01-18',
    time: '14:30',
    duration: 45,
    type: 'Evaluation',
    status: 'scheduled',
    therapist: 'Dr. James Wilson',
    room: 'Room 2'
  },
  {
    id: '3',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-01-15',
    time: '10:00',
    duration: 60,
    type: 'Follow-up',
    status: 'completed',
    notes: 'Good progress on knee exercises',
    therapist: 'Dr. Sarah Martinez',
    room: 'Room 1'
  }
];

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Quadriceps Strengthening',
    category: 'Knee',
    description: 'Straight leg raises to strengthen the quadriceps muscle',
    instructions: 'Lie on your back, lift straight leg 6 inches off ground, hold for 5 seconds, lower slowly'
  },
  {
    id: '2',
    name: 'Shoulder External Rotation',
    category: 'Shoulder',
    description: 'Resistance band external rotation for rotator cuff',
    instructions: 'Hold resistance band, elbow at 90 degrees, rotate arm outward against resistance'
  },
  {
    id: '3',
    name: 'Calf Stretch',
    category: 'Foot/Ankle',
    description: 'Standing calf stretch for plantar fasciitis',
    instructions: 'Step forward, keep back leg straight, lean forward to stretch calf muscle'
  },
  {
    id: '4',
    name: 'Core Stabilization',
    category: 'Core',
    description: 'Plank exercise for core strengthening',
    instructions: 'Hold plank position, maintain straight line from head to feet'
  },
  {
    id: '5',
    name: 'Hip Flexor Stretch',
    category: 'Hip',
    description: 'Kneeling hip flexor stretch',
    instructions: 'Kneel on one knee, push hips forward to stretch hip flexors'
  },
  {
    id: '6',
    name: 'Hamstring Stretch',
    category: 'Knee',
    description: 'Seated hamstring stretch',
    instructions: 'Sit with leg extended, reach toward toes while keeping back straight'
  }
];

const mockSOAPNotes: SOAPNote[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-01-15',
    appointmentId: '3',
    subjective: 'Patient reports knee feeling stronger. Minimal pain during daily activities. Still hesitant with running activities.',
    objective: 'Knee flexion 135°, extension 0°. Quad strength 4/5. No swelling present. Gait normal.',
    assessment: 'Good progress with knee rehabilitation. Strength improving. Ready to progress exercise program.',
    plan: 'Continue current exercises. Add single-leg balance work. Schedule follow-up in 1 week. Clear for light jogging.'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Robert Chen',
    date: '2024-01-10',
    subjective: 'Shoulder pain decreased from 7/10 to 4/10. Better sleep. Still difficulty with overhead activities.',
    objective: 'Shoulder flexion 150°, abduction 140°. Positive impingement signs. Rotator cuff strength 3+/5.',
    assessment: 'Improving shoulder impingement. Range of motion gains noted. Strength still limited.',
    plan: 'Progress strengthening exercises. Add overhead mobility work. Continue manual therapy. RTC in 1 week.'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// ============================================================================
// MAIN EMR APPLICATION COMPONENT
// ============================================================================

const Index: React.FC = () => {
  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientSubPage, setPatientSubPage] = useState<string>('demographics'); // 'demographics' | 'documentation' | 'treatment'
  
  // Form states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState<string>('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  
  // Patient profile tab state
  const [activePatientTab, setActivePatientTab] = useState<string>('demographics');
  
  // New SOAP note form state
  const [newSOAPNote, setNewSOAPNote] = useState<Omit<SOAPNote, 'id' | 'date'>>({
    patientId: '',
    patientName: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  // SOAP Template state
  const [selectedSOAPCondition, setSelectedSOAPCondition] = useState<string>('');
  const [showSOAPTemplates, setShowSOAPTemplates] = useState<boolean>(false);

  // Computed values
  const selectedPatient = useMemo(() => 
    mockPatients.find(p => p.id === selectedPatientId), 
    [selectedPatientId]
  );

  const filteredPatients = useMemo(() => 
    mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
    [searchTerm]
  );

  const filteredExercises = useMemo(() => 
    mockExercises.filter(exercise => 
      exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
    ), 
    [exerciseSearchTerm]
  );

  const todaysAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return mockAppointments.filter(apt => apt.date === today);
  }, []);

  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    return mockAppointments
      .filter(apt => new Date(apt.date) >= today && apt.status === 'scheduled')
      .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
      .slice(0, 5);
  }, []);

  // Dashboard tab state
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>('case-overview');

  // Mock data for new dashboard metrics
  const dashboardData = {
    caseOverview: {
      total: mockPatients.length,
      active: mockPatients.filter(p => p.status === 'active').length,
      lost: 2, // Mock data
      paused: 1 // Mock data
    },
    planCompliance: {
      onSchedule: 18,
      underScheduled: 7,
      overScheduled: 2
    },
    upcomingVisits: {
      monday: { evaluations: 3, followUps: 8, discharges: 1, needsAttention: 2 },
      tuesday: { evaluations: 2, followUps: 12, discharges: 0, needsAttention: 1 },
      wednesday: { evaluations: 4, followUps: 10, discharges: 2, needsAttention: 0 },
      thursday: { evaluations: 1, followUps: 9, discharges: 1, needsAttention: 3 },
      friday: { evaluations: 2, followUps: 7, discharges: 3, needsAttention: 1 }
    },
    notes: {
      pending: 8,
      completed: 45
    },
    birthdays: {
      patients: [
        { name: 'Sarah Johnson', date: '2024-01-25' },
        { name: 'Michael Brown', date: '2024-01-28' }
      ],
      employees: [
        { name: 'Dr. Amanda White', date: '2024-01-30' }
      ]
    },
    reviews: {
      overall: 4.8,
      clinics: [
        { name: 'Main Clinic', rating: 4.9, reviews: 156 },
        { name: 'North Branch', rating: 4.7, reviews: 89 }
      ],
      providers: [
        { name: 'Dr. Sarah Martinez', rating: 4.9, reviews: 67 },
        { name: 'Dr. James Wilson', rating: 4.8, reviews: 54 }
      ]
    }
  };

  // ============================================================================
  // DASHBOARD COMPONENT
  // ============================================================================

  const Dashboard: React.FC = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-lg font-semibold">{formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="emr-card">
        <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-6">
          {[
            { id: 'case-overview', label: 'Case Overview' },
            { id: 'plan-compliance', label: 'Plan Compliance' },
            { id: 'upcoming-visits', label: 'Upcoming Visits' },
            { id: 'notes-status', label: 'Notes Status' },
            { id: 'birthdays', label: 'Birthdays' },
            { id: 'reviews', label: 'Reviews & Ratings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDashboardTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDashboardTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Case Overview Tab */}
        {activeDashboardTab === 'case-overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Patient Engagement Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{dashboardData.caseOverview.total}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
              <div className="text-center p-4 bg-success-light rounded-lg">
                <p className="text-2xl font-bold text-success">{dashboardData.caseOverview.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div className="text-center p-4 bg-destructive-light rounded-lg">
                <p className="text-2xl font-bold text-destructive">{dashboardData.caseOverview.lost}</p>
                <p className="text-sm text-muted-foreground">Lost</p>
              </div>
              <div className="text-center p-4 bg-warning-light rounded-lg">
                <p className="text-2xl font-bold text-warning">{dashboardData.caseOverview.paused}</p>
                <p className="text-sm text-muted-foreground">Paused</p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Compliance Tab */}
        {activeDashboardTab === 'plan-compliance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Plan of Care Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success-light rounded-lg">
                <p className="text-2xl font-bold text-success">{dashboardData.planCompliance.onSchedule}</p>
                <p className="text-sm text-muted-foreground">On Schedule</p>
              </div>
              <div className="text-center p-4 bg-warning-light rounded-lg">
                <p className="text-2xl font-bold text-warning">{dashboardData.planCompliance.underScheduled}</p>
                <p className="text-sm text-muted-foreground">Under Scheduled</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{dashboardData.planCompliance.overScheduled}</p>
                <p className="text-sm text-muted-foreground">Over Scheduled</p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Visits Tab */}
        {activeDashboardTab === 'upcoming-visits' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">This Week's Appointments</h3>
            <div className="space-y-4">
              {Object.entries(dashboardData.upcomingVisits).map(([day, data]) => (
                <div key={day} className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-3 capitalize">{day}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-2 bg-primary-light rounded">
                      <p className="font-bold text-primary">{data.evaluations}</p>
                      <p className="text-xs text-muted-foreground">Evaluations</p>
                    </div>
                    <div className="text-center p-2 bg-success-light rounded">
                      <p className="font-bold text-success">{data.followUps}</p>
                      <p className="text-xs text-muted-foreground">Follow-ups</p>
                    </div>
                    <div className="text-center p-2 bg-secondary/20 rounded">
                      <p className="font-bold text-foreground">{data.discharges}</p>
                      <p className="text-xs text-muted-foreground">Discharges</p>
                    </div>
                    <div className="text-center p-2 bg-destructive-light rounded">
                      <p className="font-bold text-destructive">{data.needsAttention}</p>
                      <p className="text-xs text-muted-foreground">Needs Attention</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Status Tab */}
        {activeDashboardTab === 'notes-status' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Documentation Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-warning-light rounded-lg">
                <p className="text-3xl font-bold text-warning">{dashboardData.notes.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Notes</p>
              </div>
              <div className="text-center p-6 bg-success-light rounded-lg">
                <p className="text-3xl font-bold text-success">{dashboardData.notes.completed}</p>
                <p className="text-sm text-muted-foreground">Completed Notes</p>
              </div>
            </div>
          </div>
        )}

        {/* Birthdays Tab */}
        {activeDashboardTab === 'birthdays' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Upcoming Birthdays</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Patients</h4>
                <div className="space-y-2">
                  {dashboardData.birthdays.patients.map((person, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{person.name}</span>
                      <span className="text-sm text-muted-foreground">{formatDate(person.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Employees</h4>
                <div className="space-y-2">
                  {dashboardData.birthdays.employees.map((person, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{person.name}</span>
                      <span className="text-sm text-muted-foreground">{formatDate(person.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeDashboardTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{dashboardData.reviews.overall}</p>
                <p className="text-sm text-muted-foreground">Overall Rating</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">By Clinic</h4>
                <div className="space-y-2">
                  {dashboardData.reviews.clinics.map((clinic, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{clinic.name}</p>
                        <p className="text-sm text-muted-foreground">{clinic.reviews} reviews</p>
                      </div>
                      <span className="text-lg font-bold text-success">{clinic.rating}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">By Provider</h4>
                <div className="space-y-2">
                  {dashboardData.reviews.providers.map((provider, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">{provider.reviews} reviews</p>
                      </div>
                      <span className="text-lg font-bold text-success">{provider.rating}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // PATIENT MANAGEMENT COMPONENT
  // ============================================================================

  const PatientManagement: React.FC = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground mt-1">Manage your patient records and information.</p>
        </div>
        <button className="emr-button-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="emr-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="emr-input pl-10"
            />
          </div>
          <select className="emr-input w-full sm:w-auto">
            <option>All Patients</option>
            <option>Active Only</option>
            <option>Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <div 
            key={patient.id} 
            className="emr-patient-card"
            onClick={() => {
              setSelectedPatientId(patient.id);
              setCurrentPage('patient-profile');
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                  {getInitials(patient.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                </div>
              </div>
              <span className={patient.status === 'active' ? 'emr-status-active' : 'emr-status-inactive'}>
                {patient.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Visit:</span>
                <span className="font-medium">{formatDate(patient.lastVisit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Appointment:</span>
                <span className="font-medium">
                  {patient.nextAppointment ? formatDate(patient.nextAppointment) : 'Not scheduled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diagnosis:</span>
                <span className="font-medium text-right text-xs">{patient.diagnosis.substring(0, 30)}...</span>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================================================
  // PATIENT PROFILE COMPONENT
  // ============================================================================

  const PatientProfile: React.FC = () => {
    if (!selectedPatient) return <div>Patient not found</div>;

    const patientAppointments = mockAppointments.filter(apt => apt.patientId === selectedPatient.id);
    const patientNotes = mockSOAPNotes.filter(note => note.patientId === selectedPatient.id);

    const TabButton: React.FC<{ tabId: string; children: React.ReactNode }> = ({ tabId, children }) => (
      <button
        onClick={() => setActivePatientTab(tabId)}
        className={`emr-tab ${activePatientTab === tabId ? 'emr-tab-active' : ''}`}
      >
        {children}
      </button>
    );

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage('patients')}
              className="p-2 hover:bg-muted rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                {getInitials(selectedPatient.name)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{selectedPatient.name}</h1>
                <p className="text-muted-foreground">Patient ID: {selectedPatient.id}</p>
              </div>
            </div>
          </div>
          <span className={selectedPatient.status === 'active' ? 'emr-status-active' : 'emr-status-inactive'}>
            {selectedPatient.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-8">
            <TabButton tabId="demographics">Demographics</TabButton>
            <TabButton tabId="medical-history">Medical History</TabButton>
            <TabButton tabId="treatment-plan">Treatment Plan</TabButton>
            <TabButton tabId="documentation">Documentation</TabButton>
            <TabButton tabId="treatment">Treatment</TabButton>
            <TabButton tabId="appointments">Appointments</TabButton>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activePatientTab === 'demographics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="emr-card">
                <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-medium">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="font-medium">{formatDate(selectedPatient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="font-medium">{selectedPatient.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="emr-card">
                <h3 className="text-lg font-semibold mb-6">Emergency Contact</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                    <p className="font-medium">{selectedPatient.emergencyContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="font-medium">{selectedPatient.emergencyPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePatientTab === 'medical-history' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="emr-card">
                <h3 className="text-lg font-semibold mb-6">Medical History</h3>
                <p className="text-foreground leading-relaxed">{selectedPatient.medicalHistory}</p>
              </div>
              
              <div className="space-y-6">
                <div className="emr-card">
                  <h3 className="text-lg font-semibold mb-4">Current Medications</h3>
                  <ul className="space-y-2">
                    {selectedPatient.medications.map((medication, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>{medication}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="emr-card">
                  <h3 className="text-lg font-semibold mb-4">Allergies</h3>
                  <ul className="space-y-2">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-destructive rounded-full"></div>
                        <span>{allergy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activePatientTab === 'treatment-plan' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="emr-card">
                <h3 className="text-lg font-semibold mb-6">Current Diagnosis</h3>
                <p className="text-foreground leading-relaxed">{selectedPatient.diagnosis}</p>
              </div>
              
              <div className="emr-card">
                <h3 className="text-lg font-semibold mb-6">Treatment Goals</h3>
                <ul className="space-y-3">
                  {selectedPatient.treatmentGoals.map((goal, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-success-light rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                      </div>
                      <span className="flex-1">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activePatientTab === 'notes' && (
            <div className="space-y-6">
              {patientNotes.length > 0 ? patientNotes.map(note => (
                <div key={note.id} className="emr-card">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-semibold">SOAP Note - {formatDate(note.date)}</h3>
                    <button className="emr-button-secondary text-sm">Edit</button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-primary mb-2">Subjective</h4>
                      <p className="text-sm text-foreground leading-relaxed">{note.subjective}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-2">Objective</h4>
                      <p className="text-sm text-foreground leading-relaxed">{note.objective}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-2">Assessment</h4>
                      <p className="text-sm text-foreground leading-relaxed">{note.assessment}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-2">Plan</h4>
                      <p className="text-sm text-foreground leading-relaxed">{note.plan}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="emr-card text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No treatment notes recorded yet.</p>
                  <button 
                    onClick={() => setCurrentPage('notes')}
                    className="emr-button-primary mt-4"
                  >
                    Create First Note
                  </button>
                </div>
              )}
            </div>
          )}

          {activePatientTab === 'appointments' && (
            <div className="space-y-6">
              {patientAppointments.length > 0 ? (
                <div className="space-y-4">
                  {patientAppointments
                    .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
                    .map(appointment => (
                    <div key={appointment.id} className="emr-card">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold">{appointment.type}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'completed' ? 'bg-success-light text-success' :
                              appointment.status === 'scheduled' ? 'bg-warning-light text-warning' :
                              'bg-destructive-light text-destructive'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-foreground mt-3 p-3 bg-muted/30 rounded-lg">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="emr-card text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments scheduled yet.</p>
                  <button 
                    onClick={() => setCurrentPage('appointments')}
                    className="emr-button-primary mt-4"
                  >
                    Schedule Appointment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // APPOINTMENTS COMPONENT
  // ============================================================================

  const Appointments: React.FC = () => {
    const handleAppointmentClick = (appointment: any) => {
      // Navigate to patient profile when appointment is clicked
      setSelectedPatientId(appointment.patientId);
      setCurrentPage('patient-profile');
      setActivePatientTab('documentation'); // Go directly to documentation tab
    };

    const handleNewAppointment = () => {
      // Handle new appointment creation
      console.log('New appointment clicked');
    };

    return (
      <AdvancedScheduling 
        appointments={mockAppointments}
        onAppointmentClick={handleAppointmentClick}
        onNewAppointment={handleNewAppointment}
      />
    );
  };

  // ============================================================================
  // TREATMENT NOTES COMPONENT
  // ============================================================================

  const TreatmentNotes: React.FC = () => {
    const handleSOAPSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would save to the backend
      console.log('SOAP Note saved:', newSOAPNote);
      // Reset form
      setNewSOAPNote({
        patientId: '',
        patientName: '',
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
      });
    };

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Treatment Notes</h1>
            <p className="text-muted-foreground mt-1">Create and manage SOAP notes for patient treatments.</p>
          </div>
        </div>

        {/* New SOAP Note Form */}
        <div className="emr-card">
          <h2 className="text-xl font-semibold mb-6">Create New SOAP Note</h2>
          <form onSubmit={handleSOAPSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Patient</label>
                <select 
                  className="emr-input"
                  value={newSOAPNote.patientId}
                  onChange={(e) => {
                    const selectedPatient = mockPatients.find(p => p.id === e.target.value);
                    setNewSOAPNote({
                      ...newSOAPNote,
                      patientId: e.target.value,
                      patientName: selectedPatient?.name || ''
                    });
                  }}
                  required
                >
                  <option value="">Select a patient</option>
                  {mockPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input 
                  type="date" 
                  className="emr-input"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* SOAP Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Subjective</label>
                <textarea
                  className="emr-input h-32 resize-none"
                  placeholder="Patient's subjective report of symptoms, pain levels, functional limitations..."
                  value={newSOAPNote.subjective}
                  onChange={(e) => setNewSOAPNote({...newSOAPNote, subjective: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Objective</label>
                <textarea
                  className="emr-input h-32 resize-none"
                  placeholder="Measurable findings: ROM, strength, gait, palpation, special tests..."
                  value={newSOAPNote.objective}
                  onChange={(e) => setNewSOAPNote({...newSOAPNote, objective: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assessment</label>
                <textarea
                  className="emr-input h-32 resize-none"
                  placeholder="Clinical judgment, progress toward goals, problems identified..."
                  value={newSOAPNote.assessment}
                  onChange={(e) => setNewSOAPNote({...newSOAPNote, assessment: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Plan</label>
                <textarea
                  className="emr-input h-32 resize-none"
                  placeholder="Treatment plan, interventions, home exercises, follow-up..."
                  value={newSOAPNote.plan}
                  onChange={(e) => setNewSOAPNote({...newSOAPNote, plan: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" className="emr-button-secondary">
                Save as Draft
              </button>
              <button type="submit" className="emr-button-primary">
                Save Note
              </button>
            </div>
          </form>
        </div>

        {/* Recent Notes */}
        <div className="emr-card">
          <h2 className="text-xl font-semibold mb-6">Recent Notes</h2>
          <div className="space-y-4">
            {mockSOAPNotes.map(note => (
              <div key={note.id} className="p-6 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{note.patientName}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(note.date)}</p>
                  </div>
                  <button className="emr-button-secondary text-sm">Edit</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-primary">S:</span> {note.subjective.substring(0, 100)}...
                  </div>
                  <div>
                    <span className="font-medium text-primary">O:</span> {note.objective.substring(0, 100)}...
                  </div>
                  <div>
                    <span className="font-medium text-primary">A:</span> {note.assessment.substring(0, 100)}...
                  </div>
                  <div>
                    <span className="font-medium text-primary">P:</span> {note.plan.substring(0, 100)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // EXERCISE PRESCRIPTION COMPONENT (Legacy - now using separate component)
  // ============================================================================

  const ExercisePrescriptionLegacy: React.FC = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exercise Prescription</h1>
          <p className="text-muted-foreground mt-1">Browse and prescribe exercises to your patients.</p>
        </div>
        <button className="emr-button-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Custom Exercise</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="emr-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={exerciseSearchTerm}
              onChange={(e) => setExerciseSearchTerm(e.target.value)}
              className="emr-input pl-10"
            />
          </div>
          <select className="emr-input w-full sm:w-auto">
            <option>All Categories</option>
            <option>Knee</option>
            <option>Shoulder</option>
            <option>Hip</option>
            <option>Core</option>
            <option>Foot/Ankle</option>
          </select>
        </div>
      </div>

      {/* Exercise Library */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="emr-card hover:shadow-lg transition-shadow">
            {/* Exercise Image Placeholder */}
            <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
              <Activity className="w-12 h-12 text-muted-foreground" />
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg leading-tight">{exercise.name}</h3>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    {exercise.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{exercise.description}</p>
              </div>
              
              <div className="border-t pt-3">
                <details>
                  <summary className="text-sm font-medium cursor-pointer text-primary hover:text-primary-hover">
                    View Instructions
                  </summary>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">
                    {exercise.instructions}
                  </p>
                </details>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <button className="flex-1 emr-button-primary text-sm">
                  Prescribe
                </button>
                <button className="emr-button-secondary text-sm">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Form Modal (would be implemented as a modal in real app) */}
      <div className="emr-card">
        <h2 className="text-xl font-semibold mb-6">Quick Prescription</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Patient</label>
            <select className="emr-input">
              <option>Select patient</option>
              {mockPatients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sets</label>
            <input type="number" className="emr-input" placeholder="3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reps</label>
            <input type="text" className="emr-input" placeholder="10-15" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <select className="emr-input">
              <option>Daily</option>
              <option>3x per week</option>
              <option>2x per day</option>
              <option>As needed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button className="emr-button-primary">
            Prescribe Exercise
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // NAVIGATION SIDEBAR
  // ============================================================================

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Patients', icon: List },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'notes', label: 'Treatment Notes', icon: FileText },
    { id: 'exercises', label: 'Exercises', icon: Activity },
  ];

  const Sidebar: React.FC = () => (
    <div className="w-64 bg-card border-r border-border min-h-screen p-6">
      {/* Logo/Brand */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary">PhysioEMR</h2>
        <p className="text-sm text-muted-foreground">Physical Therapy EMR</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || 
                          (currentPage === 'patient-profile' && item.id === 'patients');
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                if (item.id !== 'patients') {
                  setSelectedPatientId(null);
                }
              }}
              className={`emr-nav-item w-full ${isActive ? 'emr-nav-active' : ''}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientManagement />;
      case 'patient-profile':
        return <PatientProfile />;
      case 'appointments':
        return <Appointments />;
      case 'notes':
        return <TreatmentNotes />;
      case 'exercises':
        return <ExercisePrescriptionLegacy />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 max-w-full overflow-x-hidden">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default Index;