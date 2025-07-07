import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  User,
  MapPin
} from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  type: 'Evaluation' | 'Follow-up' | 'Discharge' | 'Needs Attention';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  therapist: string;
  room: string;
  notes?: string;
}

interface AdvancedSchedulingProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onNewAppointment: () => void;
}

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
    date: '2024-01-22',
    time: '10:30',
    duration: 45,
    type: 'Evaluation',
    status: 'scheduled',
    therapist: 'Dr. James Wilson',
    room: 'Room 2'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Maria Garcia',
    date: '2024-01-22',
    time: '14:00',
    duration: 60,
    type: 'Discharge',
    status: 'scheduled',
    therapist: 'Dr. Sarah Martinez',
    room: 'Room 1'
  },
  {
    id: '4',
    patientId: '1',
    patientName: 'John Smith',
    date: '2024-01-22',
    time: '15:30',
    duration: 45,
    type: 'Needs Attention',
    status: 'scheduled',
    therapist: 'Dr. James Wilson',
    room: 'Room 3'
  },
  {
    id: '5',
    patientId: '2',
    patientName: 'Emma Davis',
    date: '2024-01-23',
    time: '09:00',
    duration: 60,
    type: 'Follow-up',
    status: 'scheduled',
    therapist: 'Dr. Sarah Martinez',
    room: 'Room 1'
  }
];

const AdvancedScheduling: React.FC<AdvancedSchedulingProps> = ({
  appointments = mockAppointments,
  onAppointmentClick,
  onNewAppointment
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTherapist, setFilterTherapist] = useState<string>('all');

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Evaluation': return 'bg-primary text-primary-foreground';
      case 'Follow-up': return 'bg-success text-success-foreground';
      case 'Discharge': return 'bg-secondary text-secondary-foreground';
      case 'Needs Attention': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const therapists = [...new Set(appointments.map(apt => apt.therapist))];
  const appointmentTypes = ['Evaluation', 'Follow-up', 'Discharge', 'Needs Attention'];

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.therapist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || apt.type === filterType;
      const matchesTherapist = filterTherapist === 'all' || apt.therapist === filterTherapist;
      
      return matchesSearch && matchesType && matchesTherapist;
    });
  }, [appointments, searchTerm, filterType, filterTherapist]);

  const getDayAppointments = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredAppointments
      .filter(apt => apt.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'daily') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const renderDailyView = () => {
    const dayAppointments = getDayAppointments(currentDate);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Schedule for {formatDate(currentDate)}</h3>
          <div className="text-sm text-muted-foreground">
            {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="space-y-3">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No appointments scheduled</p>
              <p className="text-sm">Click the + button to add a new appointment</p>
            </div>
          ) : (
            dayAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="emr-card hover:shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
                onClick={() => onAppointmentClick(appointment)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">{formatTime(appointment.time)}</div>
                      <div className="text-xs text-muted-foreground">{appointment.duration}min</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{appointment.patientName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                          {appointment.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>👨‍⚕️ {appointment.therapist}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {appointment.room}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthAppointments = useMemo(() => {
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      return filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= firstDayOfMonth && aptDate <= lastDayOfMonth;
      });
    }, [currentDate, filteredAppointments]);

    const getDaySummary = (date: Date) => {
      const dayAppointments = getDayAppointments(date);
      if (dayAppointments.length === 0) return null;

      return (
        <div className="mt-1 space-y-1">
          {dayAppointments.slice(0, 2).map(apt => (
            <div key={apt.id} className={`px-1 py-0.5 rounded text-xs ${getTypeColor(apt.type)}`}>
              {apt.patientName.split(' ')[0]} {/* Show first name */}
            </div>
          ))}
          {dayAppointments.length > 2 && (
            <div className="text-xs text-muted-foreground">
              + {dayAppointments.length - 2} more
            </div>
          )}
        </div>
      );
    };

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">
          {formatDate(currentDate).replace(/\d{1,2},/, '')} {/* Month Year */}
        </h3>
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => {
            if (date) {
              setCurrentDate(date);
              setViewMode('daily'); // Optionally switch to daily view on date click
            }
          }}
          month={currentDate}
          onMonthChange={setCurrentDate}
          className="rounded-md border"
          classNames={{
            day_today: "bg-accent text-accent-foreground font-bold",
          }}
          renderDay={(day, _selectedDate, _activeModifiers, dayProps) => {
            const date = dayProps.date;
            const summary = getDaySummary(date);
            return (
              <div
                className={`h-24 w-full p-1 border-t border-r text-sm relative flex flex-col items-start ${
                  date.getMonth() !== currentDate.getMonth() ? 'text-muted-foreground opacity-50' : ''
                } ${date.toDateString() === new Date().toDateString() ? 'bg-accent/50' : ''}`}
              >
                <span className={`font-medium ${date.toDateString() === new Date().toDateString() ? 'text-primary' : ''}`}>
                  {date.getDate()}
                </span>
                {summary}
              </div>
            );
          }}
        />
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Week of {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayAppointments = getDayAppointments(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div key={index} className={`emr-card min-h-[200px] ${isToday ? 'ring-2 ring-primary' : ''}`}>
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {day.getDate()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dayAppointments.map(appointment => (
                    <div
                      key={appointment.id}
                      className="p-2 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => onAppointmentClick(appointment)}
                    >
                      <div className="text-xs font-medium text-foreground">{formatTime(appointment.time)}</div>
                      <div className="text-xs text-muted-foreground truncate">{appointment.patientName}</div>
                      <div className={`inline-block px-1.5 py-0.5 rounded text-xs ${getTypeColor(appointment.type)}`}>
                        {appointment.type.charAt(0)}
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length === 0 && (
                     <p className="text-xs text-muted-foreground text-center pt-4">No appointments</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            {['daily', 'weekly', 'monthly'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onNewAppointment}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="emr-card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patients or therapists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="emr-input pl-10"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-foreground"
          >
            <option value="all">All Types</option>
            {appointmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filterTherapist}
            onChange={(e) => setFilterTherapist(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-foreground"
          >
            <option value="all">All Therapists</option>
            {therapists.map(therapist => (
              <option key={therapist} value={therapist}>{therapist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="emr-card">
        {viewMode === 'daily' && renderDailyView()}
        {viewMode === 'weekly' && renderWeeklyView()}
        {viewMode === 'monthly' && renderMonthlyView()}
      </div>
    </div>
  );
};

export default AdvancedScheduling;