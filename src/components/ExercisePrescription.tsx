import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Check, 
  X, 
  Clock, 
  Target,
  Dumbbell,
  Filter,
  BookOpen
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string;
  imageUrl?: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface PrescribedExercise extends Exercise {
  prescriptionId: string;
  sets: number;
  reps: string;
  time: string;
  resistance: string;
  resistanceType: 'weight' | 'band' | 'bodyweight';
  modifications: string;
  frequency: string;
  completed: boolean;
  notes: string;
}

interface ExercisePrescriptionProps {
  patientId: string;
  patientName: string;
  prescribedExercises: PrescribedExercise[];
  onExerciseToggle: (exerciseId: string, completed: boolean) => void;
  onExerciseAdd: (exercise: Exercise, prescription: any) => void;
  onExerciseRemove: (prescriptionId: string) => void;
  onPrescriptionUpdate: (prescriptionId: string, updates: any) => void;
}

const mockExerciseLibrary: Exercise[] = [
  {
    id: '1',
    name: 'Quadriceps Strengthening',
    category: 'Knee',
    description: 'Straight leg raises to strengthen the quadriceps muscle',
    instructions: 'Lie on your back, lift straight leg 6 inches off ground, hold for 5 seconds, lower slowly',
    muscleGroups: ['Quadriceps', 'Hip Flexors'],
    equipment: ['Mat'],
    difficulty: 'Beginner'
  },
  {
    id: '2',
    name: 'Shoulder External Rotation',
    category: 'Shoulder',
    description: 'Resistance band external rotation for rotator cuff',
    instructions: 'Hold resistance band, elbow at 90 degrees, rotate arm outward against resistance',
    muscleGroups: ['Infraspinatus', 'Teres Minor'],
    equipment: ['Resistance Band'],
    difficulty: 'Intermediate'
  },
  {
    id: '3',
    name: 'Wall Slides',
    category: 'Shoulder',
    description: 'Wall-based shoulder mobility exercise',
    instructions: 'Stand with back against wall, slide arms up and down maintaining contact',
    muscleGroups: ['Rhomboids', 'Middle Trapezius'],
    equipment: ['Wall'],
    difficulty: 'Beginner'
  },
  {
    id: '4',
    name: 'Single Leg Balance',
    category: 'Balance',
    description: 'Standing balance exercise on one leg',
    instructions: 'Stand on one leg, maintain balance for specified time, progress with eyes closed',
    muscleGroups: ['Core', 'Ankle Stabilizers'],
    equipment: ['None'],
    difficulty: 'Intermediate'
  },
  {
    id: '5',
    name: 'Clamshells',
    category: 'Hip',
    description: 'Side-lying hip abduction strengthening',
    instructions: 'Lie on side, knees bent, lift top knee while keeping feet together',
    muscleGroups: ['Gluteus Medius', 'Deep Hip Rotators'],
    equipment: ['Mat', 'Resistance Band'],
    difficulty: 'Beginner'
  },
  {
    id: '6',
    name: 'Bird Dog',
    category: 'Core',
    description: 'Core stabilization exercise',
    instructions: 'On hands and knees, extend opposite arm and leg, hold, return to start',
    muscleGroups: ['Core', 'Glutes', 'Shoulders'],
    equipment: ['Mat'],
    difficulty: 'Intermediate'
  }
];

const mockPrescribedExercises: PrescribedExercise[] = [
  {
    ...mockExerciseLibrary[0],
    prescriptionId: 'p1',
    sets: 3,
    reps: '15',
    time: '5 sec hold',
    resistance: '0',
    resistanceType: 'bodyweight',
    modifications: 'Support leg if needed',
    frequency: '2x daily',
    completed: true,
    notes: 'Patient reports easier today'
  },
  {
    ...mockExerciseLibrary[1],
    prescriptionId: 'p2',
    sets: 2,
    reps: '12',
    time: '',
    resistance: 'Yellow',
    resistanceType: 'band',
    modifications: 'Use lighter band if painful',
    frequency: '3x daily',
    completed: false,
    notes: ''
  },
  {
    ...mockExerciseLibrary[4],
    prescriptionId: 'p3',
    sets: 2,
    reps: '20',
    time: '',
    resistance: 'Red',
    resistanceType: 'band',
    modifications: 'Can do without band initially',
    frequency: '2x daily',
    completed: false,
    notes: ''
  }
];

const ExercisePrescription: React.FC<ExercisePrescriptionProps> = ({
  patientId,
  patientName,
  prescribedExercises = mockPrescribedExercises,
  onExerciseToggle,
  onExerciseAdd,
  onExerciseRemove,
  onPrescriptionUpdate
}) => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    sets: 3,
    reps: '10',
    time: '',
    resistance: '',
    resistanceType: 'bodyweight' as 'weight' | 'band' | 'bodyweight',
    modifications: '',
    frequency: '2x daily'
  });

  const categories = [...new Set(mockExerciseLibrary.map(ex => ex.category))];
  
  const filteredLibrary = useMemo(() => {
    return mockExerciseLibrary.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getResistanceColor = (resistanceType: string, resistance: string) => {
    if (resistanceType === 'band') {
      const colorMap: { [key: string]: string } = {
        'Yellow': 'bg-yellow-200 text-yellow-800',
        'Red': 'bg-red-200 text-red-800',
        'Green': 'bg-green-200 text-green-800',
        'Blue': 'bg-blue-200 text-blue-800',
        'Black': 'bg-gray-200 text-gray-800'
      };
      return colorMap[resistance] || 'bg-muted text-muted-foreground';
    }
    return 'bg-muted text-muted-foreground';
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      onExerciseAdd(selectedExercise, prescriptionForm);
      setSelectedExercise(null);
      setPrescriptionForm({
        sets: 3,
        reps: '10',
        time: '',
        resistance: '',
        resistanceType: 'bodyweight',
        modifications: '',
        frequency: '2x daily'
      });
      setShowLibrary(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Exercise Prescription</h2>
          <p className="text-muted-foreground">Patient: {patientName}</p>
        </div>
        <button
          onClick={() => setShowLibrary(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Exercise
        </button>
      </div>

      {/* Prescribed Exercises */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Current Exercise Plan</h3>
        
        {prescribedExercises.length === 0 ? (
          <div className="emr-card text-center py-12">
            <Dumbbell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">No exercises prescribed yet</p>
            <p className="text-sm text-muted-foreground">Add exercises from the library to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescribedExercises.map(exercise => (
              <div key={exercise.prescriptionId} className="emr-exercise-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Exercise Status Toggle */}
                    <button
                      onClick={() => onExerciseToggle(exercise.prescriptionId, !exercise.completed)}
                      className={`p-2 rounded-full transition-colors ${
                        exercise.completed
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {exercise.completed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>

                    {/* Exercise Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-semibold ${exercise.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {exercise.name}
                        </h4>
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          {exercise.category}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>

                      {/* Prescription Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center p-2 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium text-foreground">{exercise.sets}</div>
                          <div className="text-xs text-muted-foreground">Sets</div>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium text-foreground">{exercise.reps}</div>
                          <div className="text-xs text-muted-foreground">Reps</div>
                        </div>
                        {exercise.time && (
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <div className="text-sm font-medium text-foreground">{exercise.time}</div>
                            <div className="text-xs text-muted-foreground">Time</div>
                          </div>
                        )}
                        <div className="text-center p-2 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium text-foreground">{exercise.frequency}</div>
                          <div className="text-xs text-muted-foreground">Frequency</div>
                        </div>
                      </div>

                      {/* Resistance */}
                      {exercise.resistance && (
                        <div className="mb-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getResistanceColor(exercise.resistanceType, exercise.resistance)}`}>
                            {exercise.resistanceType === 'weight' && `${exercise.resistance} kg`}
                            {exercise.resistanceType === 'band' && `${exercise.resistance} Band`}
                            {exercise.resistanceType === 'bodyweight' && 'Body Weight'}
                          </span>
                        </div>
                      )}

                      {/* Instructions */}
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>Instructions:</strong> {exercise.instructions}
                      </div>

                      {/* Modifications */}
                      {exercise.modifications && (
                        <div className="text-sm text-muted-foreground mb-2">
                          <strong>Modifications:</strong> {exercise.modifications}
                        </div>
                      )}

                      {/* Notes */}
                      {exercise.notes && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {exercise.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onExerciseRemove(exercise.prescriptionId)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">Exercise Library</h3>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search exercises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="emr-input pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {filteredLibrary.map(exercise => (
                  <div
                    key={exercise.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      selectedExercise?.id === exercise.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        {exercise.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {exercise.muscleGroups.map(muscle => (
                        <span key={muscle} className="px-2 py-1 bg-secondary/20 text-secondary-foreground text-xs rounded">
                          {muscle}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Equipment:</span> {exercise.equipment.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescription Form */}
            {selectedExercise && (
              <div className="p-6 border-t border-border bg-muted/20">
                <h4 className="font-semibold text-foreground mb-4">Prescription Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Sets</label>
                    <input
                      type="number"
                      value={prescriptionForm.sets}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, sets: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Reps</label>
                    <input
                      type="text"
                      value={prescriptionForm.reps}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, reps: e.target.value})}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Time (optional)</label>
                    <input
                      type="text"
                      value={prescriptionForm.time}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, time: e.target.value})}
                      placeholder="e.g., 30 sec hold"
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Frequency</label>
                    <select
                      value={prescriptionForm.frequency}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                    >
                      <option value="1x daily">1x daily</option>
                      <option value="2x daily">2x daily</option>
                      <option value="3x daily">3x daily</option>
                      <option value="Every other day">Every other day</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Resistance Type</label>
                    <select
                      value={prescriptionForm.resistanceType}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, resistanceType: e.target.value as any})}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                    >
                      <option value="bodyweight">Body Weight</option>
                      <option value="weight">Weight (kg)</option>
                      <option value="band">Resistance Band</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {prescriptionForm.resistanceType === 'weight' ? 'Weight (kg)' : 
                       prescriptionForm.resistanceType === 'band' ? 'Band Color' : 'Resistance'}
                    </label>
                    <input
                      type="text"
                      value={prescriptionForm.resistance}
                      onChange={(e) => setPrescriptionForm({...prescriptionForm, resistance: e.target.value})}
                      placeholder={prescriptionForm.resistanceType === 'weight' ? '5' : 
                                 prescriptionForm.resistanceType === 'band' ? 'Yellow' : 'N/A'}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">Modifications (optional)</label>
                  <textarea
                    value={prescriptionForm.modifications}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, modifications: e.target.value})}
                    placeholder="Any modifications or special instructions..."
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground h-20 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExercise}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors"
                  >
                    Add to Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePrescription;