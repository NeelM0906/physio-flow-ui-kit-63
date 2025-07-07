import React, { useState } from 'react';
import { ChevronLeft, FileText, Calendar as CalendarIcon, Clock, User } from 'lucide-react'; // Renamed Calendar to CalendarIcon, Added User
import { Patient, Appointment, SOAPNote } from '@/types'; // Adjusted import path
import { formatDate, formatTime, getInitials } from '@/types'; // Assuming utils are moved here or to a separate utils.ts

interface PatientProfileProps {
  patient: Patient | undefined; // Can be undefined if not found or loading
  appointments: Appointment[]; // All appointments, will be filtered
  notes: SOAPNote[]; // All notes, will be filtered
  onBackClick: () => void;
  onNavigateToPage: (page: string) => void; // For "Create First Note" or "Schedule Appointment"
}

const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  appointments,
  notes,
  onBackClick,
  onNavigateToPage
}) => {
  const [activePatientTab, setActivePatientTab] = useState<string>('demographics');

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <User className="w-24 h-24 text-muted-foreground mb-4" /> {}
        <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Patient Not Found</h2>
        <p className="text-muted-foreground mb-6">The selected patient could not be found or is not available.</p>
        <button onClick={onBackClick} className="emr-button-secondary">
          Go Back to Patient List
        </button>
      </div>
    );
  }

  const patientAppointments = appointments.filter(apt => apt.patientId === patient.id);
  const patientNotes = notes.filter(note => note.patientId === patient.id);

  const TabButton: React.FC<{ tabId: string; children: React.ReactNode }> = ({ tabId, children }) => (
    <button
      onClick={() => setActivePatientTab(tabId)}
      className={`emr-tab ${activePatientTab === tabId ? 'emr-tab-active' : ''}`} // Ensure these classes are defined
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
            onClick={onBackClick}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
              {getInitials(patient.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
              <p className="text-muted-foreground">Patient ID: {patient.id}</p>
            </div>
          </div>
        </div>
        <span className={patient.status === 'active' ? 'emr-status-active' : 'emr-status-inactive'}> {/* Ensure these classes are defined */}
          {patient.status}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-px">
          <TabButton tabId="demographics">Demographics</TabButton>
          <TabButton tabId="medical-history">Medical History</TabButton>
          <TabButton tabId="treatment-plan">Treatment Plan</TabButton>
          <TabButton tabId="documentation">Documentation</TabButton>
          {/* <TabButton tabId="treatment">Treatment</TabButton> // This tab seemed to be a duplicate or placeholder */}
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
                  <p className="font-medium">{patient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">{patient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="font-medium">{patient.address}</p>
                </div>
              </div>
            </div>

            <div className="emr-card">
              <h3 className="text-lg font-semibold mb-6">Emergency Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                  <p className="font-medium">{patient.emergencyContact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="font-medium">{patient.emergencyPhone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePatientTab === 'medical-history' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="emr-card">
              <h3 className="text-lg font-semibold mb-6">Medical History</h3>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{patient.medicalHistory}</p>
            </div>

            <div className="space-y-6">
              <div className="emr-card">
                <h3 className="text-lg font-semibold mb-4">Current Medications</h3>
                {patient.medications && patient.medications.length > 0 ? (
                  <ul className="space-y-2">
                    {patient.medications.map((medication, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>{medication}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground text-sm">No medications listed.</p>}
              </div>

              <div className="emr-card">
                <h3 className="text-lg font-semibold mb-4">Allergies</h3>
                 {patient.allergies && patient.allergies.length > 0 ? (
                  <ul className="space-y-2">
                    {patient.allergies.map((allergy, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-destructive rounded-full"></div>
                        <span>{allergy}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground text-sm">No allergies listed.</p>}
              </div>
            </div>
          </div>
        )}

        {activePatientTab === 'treatment-plan' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="emr-card">
              <h3 className="text-lg font-semibold mb-6">Current Diagnosis</h3>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{patient.diagnosis}</p>
            </div>

            <div className="emr-card">
              <h3 className="text-lg font-semibold mb-6">Treatment Goals</h3>
              {patient.treatmentGoals && patient.treatmentGoals.length > 0 ? (
                <ul className="space-y-3">
                  {patient.treatmentGoals.map((goal, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-success-light rounded-full flex items-center justify-center mt-0.5 shrink-0">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                      </div>
                      <span className="flex-1">{goal}</span>
                    </li>
                  ))}
                </ul>
              ): <p className="text-muted-foreground text-sm">No treatment goals listed.</p>}
            </div>
          </div>
        )}

        {activePatientTab === 'documentation' && ( // Changed from 'notes' to 'documentation' to match tab label
          <div className="space-y-6">
            {patientNotes.length > 0 ? patientNotes
              .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(note => (
              <div key={note.id} className="emr-card">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-semibold">SOAP Note - {formatDate(note.date)}</h3>
                  <button className="emr-button-secondary text-sm">Edit</button> {/* Functionality not implemented */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-primary mb-2">Subjective</h4>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{note.subjective}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-2">Objective</h4>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{note.objective}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-2">Assessment</h4>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{note.assessment}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-2">Plan</h4>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{note.plan}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="emr-card text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No treatment notes recorded yet.</p>
                <button
                  onClick={() => onNavigateToPage('notes')} // Navigate to the main "Treatment Notes" page
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
                            'bg-destructive-light text-destructive' // Ensure these classes are defined
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
                          </div>
                           <div className="flex items-center space-x-2">
                             <User className="w-4 h-4" /> {}
                            <span>{appointment.therapist}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-foreground mt-3 p-3 bg-muted/30 rounded-lg whitespace-pre-wrap">
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
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled yet.</p>
                <button
                  onClick={() => onNavigateToPage('appointments')} // Navigate to main "Appointments" page
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

export default PatientProfile;
