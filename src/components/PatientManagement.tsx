import React from 'react';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { Patient } from '@/types'; // Adjusted import path
import { formatDate, getInitials } from '@/types'; // Assuming utils are moved here or to a separate utils.ts

interface PatientManagementProps {
  patients: Patient[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onPatientClick: (patientId: string) => void;
  onAddNewPatientClick: () => void; // Added for future use
}

const PatientManagement: React.FC<PatientManagementProps> = ({
  patients,
  searchTerm,
  onSearchTermChange,
  onPatientClick,
  onAddNewPatientClick
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground mt-1">Manage your patient records and information.</p>
        </div>
        <button
          onClick={onAddNewPatientClick}
          className="emr-button-primary flex items-center space-x-2"
        >
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
              onChange={(e) => onSearchTermChange(e.target.value)}
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
        {patients.map(patient => (
          <div
            key={patient.id}
            className="emr-patient-card" // Ensure this class is defined in your global CSS or Tailwind config
            onClick={() => onPatientClick(patient.id)}
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
              <span className={patient.status === 'active' ? 'emr-status-active' : 'emr-status-inactive'}> {/* Ensure these classes are defined */}
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
};

export default PatientManagement;
