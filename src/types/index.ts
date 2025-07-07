export interface Patient {
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

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  type: 'Evaluation' | 'Follow-up' | 'Discharge' | 'Needs Attention';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'; // Added 'no-show' from AdvancedScheduling
  therapist: string;
  room: string;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string;
  imageUrl?: string;
}

export interface SOAPNote {
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

export interface PrescribedExercise {
  exerciseId: string;
  patientId: string;
  sets: number;
  reps: string;
  frequency: string;
  duration: string;
  notes: string;
}

// Utility functions that were in Index.tsx can also be moved here or to a separate utils.ts file
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // Try to parse if it's already in YYYY-MM-DD format from an input
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) -1; // Month is 0-indexed
        const day = parseInt(parts[2]);
        const newDate = new Date(year, month, day);
        if (!isNaN(newDate.getTime())) {
           return newDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

export const formatTime = (timeString?: string): string => {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  if (hours === undefined || minutes === undefined) return 'Invalid Time';
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getInitials = (name?: string): string => {
  if (!name) return '';
  return name.split(' ')
    .map(n => n[0])
    .filter(n => n && n.match(/[a-zA-Z]/)) // Ensure it's a letter
    .join('')
    .toUpperCase();
};
