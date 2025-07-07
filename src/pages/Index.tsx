import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, // Renamed to avoid conflict with component
  Plus, 
  Search as SearchIcon, // Renamed to avoid conflict
  Clock, 
  Activity, 
  FileText, 
  List,
  ChevronRight,
  ChevronLeft,
  // ChevronDown, // Not used after refactor
  // ChevronUp, // Not used after refactor
  // User, // Not used directly in Index after refactor
  // Stethoscope, // Not used after refactor
  // Target, // Not used after refactor
  // BookOpen // Not used after refactor
} from 'lucide-react';

// Import new components
import Dashboard from '@/components/Dashboard';
import PatientManagement from '@/components/PatientManagement';
import PatientProfile from '@/components/PatientProfile';
import SOAPTemplates from '../components/SOAPTemplates'; // This might need refactoring later if it uses shared types/mock data
import AdvancedScheduling from '../components/AdvancedScheduling';
import ExercisePrescription from '../components/ExercisePrescription';

// Import shared types and utility functions
import { Patient, Appointment, Exercise, SOAPNote, PrescribedExercise } from '@/types';
import { formatDate, formatTime, getInitials } from '@/types';


import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading states

// ============================================================================
// MOCK DATA (Initial values before API fetch)
// ============================================================================

const initialPatients: Patient[] = [];
const initialAppointments: Appointment[] = [];
const initialExercises: Exercise[] = [];
const initialSOAPNotes: SOAPNote[] = [];


// Removed utility functions as they are now in types/index.ts

// ============================================================================
// MAIN EMR APPLICATION COMPONENT
// ============================================================================

const Index: React.FC = () => {
  // Data states
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [soapNotes, setSoapNotes] = useState<SOAPNote[]>(initialSOAPNotes);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Combined loading state

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Form states
  const [patientSearchTerm, setPatientSearchTerm] = useState<string>('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState<string>('');
  
  const [newSOAPNote, setNewSOAPNote] = useState<Omit<SOAPNote, 'id' | 'date' | 'patientName'>>({
    patientId: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  // Simulate API fetching
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, replace these with actual fetch calls
      // For now, we'll use the mock data defined at the top of the original file
      const fetchedPatients: Patient[] = [
        { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(555) 123-4567', dateOfBirth: '1985-06-15', address: '123 Oak Street, Springfield, IL 62701', emergencyContact: 'Michael Johnson (Husband)', emergencyPhone: '(555) 123-4568', medicalHistory: 'Previous ACL reconstruction (2019), occasional lower back pain', medications: ['Ibuprofen 400mg as needed', 'Vitamin D 1000 IU daily'], allergies: ['Penicillin'], diagnosis: 'Post-surgical knee rehabilitation, chronic lower back pain', treatmentGoals: ['Improve knee strength and stability', 'Reduce lower back pain', 'Return to recreational running'], status: 'active', lastVisit: '2024-01-15', nextAppointment: '2024-01-22'},
        { id: '2', name: 'Robert Chen', email: 'robert.chen@email.com', phone: '(555) 234-5678', dateOfBirth: '1972-11-08', address: '456 Maple Avenue, Springfield, IL 62702', emergencyContact: 'Lisa Chen (Wife)', emergencyPhone: '(555) 234-5679', medicalHistory: 'Rotator cuff injury (2023), hypertension', medications: ['Lisinopril 10mg daily', 'Fish oil 1000mg daily'], allergies: ['None known'], diagnosis: 'Right shoulder impingement syndrome', treatmentGoals: ['Restore full range of motion', 'Eliminate shoulder pain', 'Return to tennis'], status: 'active', lastVisit: '2024-01-10', nextAppointment: '2024-01-18'},
        { id: '3', name: 'Maria Garcia', email: 'maria.garcia@email.com', phone: '(555) 345-6789', dateOfBirth: '1990-03-22', address: '789 Pine Street, Springfield, IL 62703', emergencyContact: 'Carlos Garcia (Brother)', emergencyPhone: '(555) 345-6790', medicalHistory: 'No significant medical history', medications: ['Birth control pill'], allergies: ['Latex'], diagnosis: 'Plantar fasciitis, bilateral', treatmentGoals: ['Reduce heel pain', 'Improve foot mechanics', 'Return to running marathons'], status: 'active', lastVisit: '2024-01-12', nextAppointment: null}
      ];
      const fetchedAppointments: Appointment[] = [
        { id: '1', patientId: '1', patientName: 'Sarah Johnson', date: '2024-01-22', time: '09:00', duration: 60, type: 'Follow-up', status: 'scheduled', therapist: 'Dr. Sarah Martinez', room: 'Room 1' },
        { id: '2', patientId: '2', patientName: 'Robert Chen', date: '2024-01-18', time: '14:30', duration: 45, type: 'Evaluation', status: 'scheduled', therapist: 'Dr. James Wilson', room: 'Room 2' },
        { id: '3', patientId: '1', patientName: 'Sarah Johnson', date: '2024-01-15', time: '10:00', duration: 60, type: 'Follow-up', status: 'completed', notes: 'Good progress on knee exercises', therapist: 'Dr. Sarah Martinez', room: 'Room 1' }
      ];
      const fetchedExercises: Exercise[] = [
        { id: '1', name: 'Quadriceps Strengthening', category: 'Knee', description: 'Straight leg raises to strengthen the quadriceps muscle', instructions: 'Lie on your back, lift straight leg 6 inches off ground, hold for 5 seconds, lower slowly'},
        { id: '2', name: 'Shoulder External Rotation', category: 'Shoulder', description: 'Resistance band external rotation for rotator cuff', instructions: 'Hold resistance band, elbow at 90 degrees, rotate arm outward against resistance'},
      ];
      const fetchedSOAPNotes: SOAPNote[] = [
        { id: '1', patientId: '1', patientName: 'Sarah Johnson', date: '2024-01-15', appointmentId: '3', subjective: 'Patient reports knee feeling stronger. Minimal pain during daily activities.', objective: 'Knee flexion 135°, extension 0°. Quad strength 4/5.', assessment: 'Good progress with knee rehabilitation.', plan: 'Continue current exercises. Add single-leg balance work.'},
        { id: '2', patientId: '2', patientName: 'Robert Chen', date: '2024-01-10', subjective: 'Shoulder pain decreased from 7/10 to 4/10.', objective: 'Shoulder flexion 150°, abduction 140°.', assessment: 'Improving shoulder impingement.', plan: 'Progress strengthening exercises.'}
      ];

      setPatients(fetchedPatients);
      setAppointments(fetchedAppointments);
      setExercises(fetchedExercises);
      setSoapNotes(fetchedSOAPNotes);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Computed values
  const selectedPatient = useMemo(() => 
    patients.find(p => p.id === selectedPatientId),
    [selectedPatientId, patients]
  );

  const filteredPatients = useMemo(() => 
    patients.filter(patient =>
      patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(patientSearchTerm.toLowerCase())
    ), 
    [patientSearchTerm, patients]
  );

  const filteredExercises = useMemo(() => 
    exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
    ), 
    [exerciseSearchTerm, exercises]
  );

  // These might be useful for the Dashboard or Appointments components if passed as props
  // const todaysAppointments = useMemo(() => {
  //   const today = new Date().toISOString().split('T')[0];
  //   return mockAppointments.filter(apt => apt.date === today);
  // }, [mockAppointments]);

  // const upcomingAppointments = useMemo(() => {
  //   const today = new Date();
  //   return mockAppointments
  //     .filter(apt => new Date(apt.date) >= today && apt.status === 'scheduled')
  //     .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
  //     .slice(0, 5);
  // }, [mockAppointments]);


  // Handlers for PatientManagement
  const handlePatientSearchChange = (term: string) => {
    setPatientSearchTerm(term);
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentPage('patient-profile');
  };

  const handleAddNewPatient = () => {
    // Placeholder for new patient functionality
    console.log("Add new patient clicked");
    // Potentially navigate to a new patient form page or open a modal
  };

  // Handler for PatientProfile back button
  const handleBackToPatientList = () => {
    setSelectedPatientId(null);
    setCurrentPage('patients');
  };

  // Handler for navigating from PatientProfile to other main pages
  const handleNavigateToPage = (page: string) => {
    setCurrentPage(page);
  };


  // ============================================================================
  // APPOINTMENTS COMPONENT LOGIC (Simplified for now)
  // ============================================================================

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedPatientId(appointment.patientId);
    setCurrentPage('patient-profile');
    // setActivePatientTab('documentation'); // PatientProfile will manage its own internal tabs
  };

  const handleNewAppointment = () => {
    console.log('New appointment clicked - navigate or open modal');
    // This could navigate to a dedicated new appointment page or open a modal form
    // For now, let's assume it could change the page or state to show a form.
    // setCurrentPage('new-appointment'); // Example
  };

  // ============================================================================
  // TREATMENT NOTES COMPONENT LOGIC (Simplified for now)
  // ============================================================================

  const handleSOAPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientForNote = mockPatients.find(p => p.id === newSOAPNote.patientId);
    if (!patientForNote) {
        console.error("Patient not found for SOAP note");
        return;
    }
    const noteToSave: SOAPNote = {
        ...newSOAPNote,
        id: String(mockSOAPNotes.length + 1), // Simple ID generation
        date: new Date().toISOString().split('T')[0],
        patientName: patientForNote.name,
    };
    console.log('SOAP Note saved:', noteToSave); // In real app, add to mockSOAPNotes or send to API
    // mockSOAPNotes.push(noteToSave); // This would require state management for mockSOAPNotes for re-render
    setNewSOAPNote({
      patientId: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: ''
    });
  };

  // ============================================================================
  // EXERCISE PRESCRIPTION - Logic will be mostly within the component itself
  // ============================================================================
  // ExercisePrescriptionLegacy is removed, existing ExercisePrescription component will be used.
  // const ExercisePrescriptionLegacy: React.FC = () => (...); // This definition will be removed.

  // ============================================================================
  // NAVIGATION SIDEBAR
  // ============================================================================

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Patients', icon: List },
    { id: 'appointments', label: 'Appointments', icon: CalendarIcon },
    { id: 'notes', label: 'Treatment Notes', icon: FileText },
    { id: 'exercises', label: 'Exercises', icon: Activity }, // Will render the new ExercisePrescription
  ];

  const Sidebar: React.FC = () => (
    <div className="w-64 bg-card border-r border-border min-h-screen p-6 hidden md:block"> {/* Added hidden md:block for responsiveness */}
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
                // If navigating away from patient-profile or to a page that isn't 'patients', deselect patient
                if (item.id !== 'patient-profile' && item.id !== 'patients') {
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
    if (isLoading) {
      // Render a full-page skeleton loader or specific skeleton for the current page view
      return (
        <div className="space-y-8 p-4 sm:p-8"> {/* Added padding here to match content area */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
           <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      );
    }

    // Use fetched data (patients, appointments, etc.) instead of mockData
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard patients={patients} soapNotes={soapNotes} />;
      case 'patients':
        return (
          <PatientManagement
            patients={filteredPatients}
            searchTerm={patientSearchTerm}
            onSearchTermChange={handlePatientSearchChange}
            onPatientClick={handleSelectPatient}
            onAddNewPatientClick={handleAddNewPatient}
          />
        );
      case 'patient-profile':
        return (
          <PatientProfile
            patient={selectedPatient}
            appointments={appointments}
            notes={soapNotes}
            onBackClick={handleBackToPatientList}
            onNavigateToPage={handleNavigateToPage}
          />
        );
      case 'appointments':
        return (
          <AdvancedScheduling
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
            onNewAppointment={handleNewAppointment}
          />
        );
      case 'notes':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Treatment Notes</h1>
                <p className="text-muted-foreground mt-1">Create and manage SOAP notes for patient treatments.</p>
              </div>
            </div>
            <div className="emr-card">
              <h2 className="text-xl font-semibold mb-6">Create New SOAP Note</h2>
              <form onSubmit={handleSOAPSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="patientId" className="block text-sm font-medium mb-2">Patient</label>
                    <select
                      id="patientId"
                      className="emr-input"
                      value={newSOAPNote.patientId}
                      onChange={(e) => setNewSOAPNote({ ...newSOAPNote, patientId: e.target.value })}
                      required
                    >
                      <option value="">Select a patient</option>
                      {patients.map(patient => ( // Use fetched patients
                        <option key={patient.id} value={patient.id}>{patient.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="noteDate" className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      id="noteDate"
                      className="emr-input"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subjective" className="block text-sm font-medium mb-2">Subjective</label>
                    <textarea
                      id="subjective"
                      className="emr-input h-32 resize-none"
                      placeholder="Patient's subjective report..."
                      value={newSOAPNote.subjective}
                      onChange={(e) => setNewSOAPNote({...newSOAPNote, subjective: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="objective" className="block text-sm font-medium mb-2">Objective</label>
                    <textarea
                      id="objective"
                      className="emr-input h-32 resize-none"
                      placeholder="Measurable findings..."
                      value={newSOAPNote.objective}
                      onChange={(e) => setNewSOAPNote({...newSOAPNote, objective: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="assessment" className="block text-sm font-medium mb-2">Assessment</label>
                    <textarea
                      id="assessment"
                      className="emr-input h-32 resize-none"
                      placeholder="Clinical judgment..."
                      value={newSOAPNote.assessment}
                      onChange={(e) => setNewSOAPNote({...newSOAPNote, assessment: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="plan" className="block text-sm font-medium mb-2">Plan</label>
                    <textarea
                      id="plan"
                      className="emr-input h-32 resize-none"
                      placeholder="Treatment plan..."
                      value={newSOAPNote.plan}
                      onChange={(e) => setNewSOAPNote({...newSOAPNote, plan: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" className="emr-button-secondary">Save as Draft</button>
                  <button type="submit" className="emr-button-primary">Save Note</button>
                </div>
              </form>
            </div>
            <div className="emr-card">
                <h2 className="text-xl font-semibold mb-6">Recent Notes</h2>
                <div className="space-y-4">
                    {soapNotes.slice(0,5).map(note => ( // Use fetched soapNotes
                        <div key={note.id} className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold">{note.patientName}</h3>
                                    <p className="text-sm text-muted-foreground">{formatDate(note.date)}</p>
                                </div>
                                <button className="emr-button-secondary text-sm py-1 px-2">View</button>
                            </div>
                            <p className="text-sm truncate"><strong>S:</strong> {note.subjective}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* <SOAPTemplates onSelectTemplate={(template) => console.log(template)} /> */}
          </div>
        );
      case 'exercises':
        return (
          <ExercisePrescription
            exercises={exercises} // Use fetched exercises
            patients={patients} // Use fetched patients
          />
        );
      default:
        return <Dashboard patients={patients} soapNotes={soapNotes} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 max-w-full overflow-x-hidden"> {/* Changed div to main for semantics */}
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;