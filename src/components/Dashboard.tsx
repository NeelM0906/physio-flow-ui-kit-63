import React, { useState } from 'react';
// Assuming Activity icon is used, add others if needed
// import { Activity } from 'lucide-react';
import { Patient, SOAPNote } from '@/types'; // Adjusted import path
import { formatDate } from '@/types'; // Assuming utils are moved here or to a separate utils.ts

interface DashboardProps {
  patients: Patient[];
  soapNotes: SOAPNote[];
  // Add any other props needed from the main state, like appointments for upcoming visits if dynamic
}

// Dynamically calculate dashboard metrics
const getDashboardData = (patients: Patient[], soapNotes: SOAPNote[]) => {
  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'active').length;

  // Assuming SOAPNotes have a status property, e.g., 'pending' or 'completed'
  // If not, this part needs adjustment based on actual SOAPNote structure or business logic
  // For now, let's use a placeholder logic for notes if status isn't directly available.
  // This is a common simplification; in a real app, you'd have clear criteria for pending/completed.
  const pendingNotes = soapNotes.filter(note => !note.assessment || !note.plan).length; // Example: pending if assessment or plan is missing
  const completedNotes = soapNotes.length - pendingNotes;

  return {
    caseOverview: {
      total: totalPatients,
      active: activePatients,
      lost: 2, // Mock data - keep as is for now, or define logic if available
      paused: 1 // Mock data - keep as is for now, or define logic if available
    },
    planCompliance: { // Keep as mock data for now
      onSchedule: 18,
      underScheduled: 7,
      overScheduled: 2
    },
    upcomingVisits: { // Keep as mock data for now
      monday: { evaluations: 3, followUps: 8, discharges: 1, needsAttention: 2 },
      tuesday: { evaluations: 2, followUps: 12, discharges: 0, needsAttention: 1 },
      wednesday: { evaluations: 4, followUps: 10, discharges: 2, needsAttention: 0 },
      thursday: { evaluations: 1, followUps: 9, discharges: 1, needsAttention: 3 },
      friday: { evaluations: 2, followUps: 7, discharges: 3, needsAttention: 1 }
    },
    notes: {
      pending: pendingNotes,
      completed: completedNotes
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
};

const Dashboard: React.FC<DashboardProps> = ({ patients, soapNotes }) => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>('case-overview');
  const dashboardData = getDashboardData(patients, soapNotes); // Use the function to get data

  return (
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
};

export default Dashboard;
