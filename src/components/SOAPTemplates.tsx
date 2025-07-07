import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

interface SOAPTemplate {
  id: string;
  name: string;
  condition: string;
  sections: {
    subjective: {
      chiefComplaint: string[];
      currentSymptoms: string[];
      functionalLimitations: string[];
      patientGoals: string[];
      medicalHistory: string[];
      previousTreatmentResponse: string[];
    };
    objective: {
      observation: string[];
      palpation: string[];
      rangeOfMotion: {
        arom: string[];
        prom: string[];
      };
      strength: string[];
      specialTests: string[];
      neurologicalScreen: {
        dermatomes: string[];
        myotomes: string[];
        reflexes: string[];
        neurovascular: string[];
      };
      functionalOutcomeMeasures: string[];
      interventionsPerformed: string[];
    };
    assessment: {
      problemList: string[];
      summaryOfFindings: string[];
      prognosis: string[];
      rehabilitationPotential: string[];
      justificationForTherapy: string[];
    };
    plan: {
      shortTermGoals: string[];
      longTermGoals: string[];
      interventionsPlanned: string[];
      homeExerciseProgram: string[];
      referrals: string[];
      frequencyDuration: string[];
      patientEducation: string[];
      dischargePlanning: string[];
    };
  };
}

const soapTemplates: SOAPTemplate[] = [
  {
    id: '1',
    name: 'Post-Surgical Knee',
    condition: 'Knee Surgery Recovery',
    sections: {
      subjective: {
        chiefComplaint: [
          'Chief complaint: [Post-operative knee pain/stiffness/functional limitations]',
          'Primary reason for PT: [ROM deficits/strength deficits/gait abnormalities]',
          'Onset: [Post-surgical - X weeks/months ago]'
        ],
        currentSymptoms: [
          'Pain level: [score]/10 at rest, [score]/10 with activity',
          'Pain quality: [sharp/dull/aching/burning/throbbing]',
          'Pain location: [surgical site/anterior knee/posterior knee/diffuse]',
          'Aggravating factors: [weight bearing/stairs/prolonged sitting/movement]',
          'Alleviating factors: [rest/ice/elevation/medications]',
          'Swelling: [present/absent] - [mild/moderate/severe]',
          'Stiffness: [morning/after sitting/constant] lasting [duration]'
        ],
        functionalLimitations: [
          'ADL limitations: [stair climbing/getting up from chair/walking/dressing]',
          'IADL limitations: [shopping/housework/driving/work duties]',
          'Recreational limitations: [sports/exercise/gardening/hobbies]',
          'Mobility: [assistive device use - crutches/walker/cane]',
          'Work status: [full duty/modified duty/unable to work]'
        ],
        patientGoals: [
          'Short-term goals: [pain reduction/improved ROM/safer mobility]',
          'Long-term goals: [return to work/sports/normal activities]',
          'Patient priorities: [specific activities most important to patient]'
        ],
        medicalHistory: [
          'Surgical procedure: [TKA/ACL repair/meniscectomy] on [date]',
          'PMH: [diabetes/arthritis/previous knee injuries]',
          'Current medications: [pain meds/anti-inflammatories/blood thinners]',
          'Allergies: [medications/latex/other]',
          'Social history: [occupation/living situation/support system]'
        ],
        previousTreatmentResponse: [
          'Changes since last visit: [improved/declined/no change]',
          'HEP compliance: [excellent/good/fair/poor] - [frequency performed]',
          'Response to interventions: [manual therapy/exercises/modalities]',
          'Setbacks or concerns: [increased pain/new symptoms/barriers]'
        ]
      },
      objective: {
        observation: [
          'General appearance: [NAD/guarded/antalgic gait]',
          'Surgical site: [well-healed/erythema/drainage/swelling]',
          'Posture: [normal/forward head/pelvic tilt/leg length discrepancy]',
          'Gait: [antalgic/Trendelenburg/normal] with [assistive device]',
          'Muscle atrophy: [quadriceps/calf] - [mild/moderate/severe]'
        ],
        palpation: [
          'TTP: [present/absent] over [surgical site/patella/joint line/IT band]',
          'Swelling: [pitting/non-pitting] in [suprapatellar pouch/joint]',
          'Temperature: [normal/warm/hot] compared to unaffected side',
          'Muscle tension: [quadriceps/hamstrings/calf] - [normal/increased]'
        ],
        rangeOfMotion: {
          arom: [
            'Knee flexion AROM: [measurement]° (Normal: 0-135°)',
            'Knee extension AROM: [measurement]° (Normal: 0°)',
            'Hip flexion AROM: [measurement]° (Normal: 0-120°)',
            'Ankle DF/PF AROM: [measurement]°/[measurement]° (Normal: 20°/50°)',
            'Pain with AROM: [present/absent] at [specific ranges]',
            'Compensatory patterns: [hip hiking/trunk lean/circumduction]'
          ],
          prom: [
            'Knee flexion PROM: [measurement]° with [firm/soft/empty] end-feel',
            'Knee extension PROM: [measurement]° with [firm/hard] end-feel',
            'Patellar mobility: [normal/restricted] in [superior/inferior/medial/lateral]',
            'Pain with PROM: [present/absent] - [location and intensity]'
          ]
        },
        strength: [
          'Quadriceps MMT: [grade]/5 - [VMO/VL/RF/VI specific findings]',
          'Hamstring MMT: [grade]/5 bilateral',
          'Hip abductor MMT: [grade]/5 bilateral',
          'Calf MMT: [grade]/5 bilateral',
          'Core strength: [grade]/5 assessed via [specific test]'
        ],
        specialTests: [
          'Lachman test: [negative/positive/grade] - [ACL integrity]',
          'McMurray test: [negative/positive] - [meniscal pathology]',
          'Patellar apprehension: [negative/positive] - [patellar stability]',
          'Thessaly test: [negative/positive] - [meniscal tears]'
        ],
        neurologicalScreen: {
          dermatomes: [
            'L3 dermatome: [intact/diminished] - [anterior thigh]',
            'L4 dermatome: [intact/diminished] - [medial leg]',
            'L5 dermatome: [intact/diminished] - [lateral leg/dorsal foot]',
            'S1 dermatome: [intact/diminished] - [lateral foot]'
          ],
          myotomes: [
            'L3 myotome (hip flexion): [5/5] bilateral',
            'L4 myotome (ankle DF): [5/5] bilateral', 
            'L5 myotome (great toe extension): [5/5] bilateral',
            'S1 myotome (ankle PF): [5/5] bilateral'
          ],
          reflexes: [
            'Patellar reflex (L4): [2+] bilateral',
            'Achilles reflex (S1): [2+] bilateral',
            'Reflex grading: 0=absent, 1+=diminished, 2+=normal, 3+=brisk, 4+=clonus'
          ],
          neurovascular: [
            'Dorsalis pedis pulse: [2+] - [strong/weak/absent]',
            'Posterior tibial pulse: [2+] bilaterally',
            'Capillary refill: [<2 seconds] in toes bilaterally',
            'Skin color/temperature: [normal/pale/cyanotic/warm/cool]'
          ]
        },
        functionalOutcomeMeasures: [
          'KOOS (Knee Injury and Osteoarthritis Outcome Score): [score]/100',
          'LEFS (Lower Extremity Functional Scale): [score]/80',
          'WOMAC (Western Ontario McMaster): [score]/96',
          'Lysholm Knee Scale: [score]/100'
        ],
        interventionsPerformed: [
          'Manual therapy: [patellar mobilization/soft tissue massage/joint mobilization]',
          'Therapeutic exercise: [quad sets/SLR/heel slides/mini squats] - [sets/reps]',
          'Gait training: [weight bearing progression/assistive device training]',
          'Modalities: [ice/heat/e-stim] for [duration] to [area]',
          'Patient education: [HEP review/precautions/activity modification]'
        ]
      },
      assessment: {
        problemList: [
          'Primary diagnosis: [Post-operative knee pain/stiffness] s/p [procedure]',
          'Secondary diagnoses: [muscle weakness/ROM limitations/gait dysfunction]',
          'ICD-10 codes: [M25.561 - Pain in right knee/Z98.89 - Other specified postprocedural states]'
        ],
        summaryOfFindings: [
          'Subjective findings consistent with [expected post-surgical recovery/complications]',
          'Objective findings reveal [ROM deficits/strength deficits/functional limitations]',
          'Correlation between [symptom severity and functional limitations strong/weak]',
          'Patient demonstrates [good/fair/poor] understanding of condition'
        ],
        prognosis: [
          'Prognosis: [excellent/good/fair/guarded] for return to prior level of function',
          'Favorable factors: [young age/good surgical result/motivated patient/good support]',
          'Limiting factors: [medical comorbidities/poor compliance/surgical complications]',
          'Expected timeline: [6-12 weeks/3-6 months] for significant improvement'
        ],
        rehabilitationPotential: [
          'Patient demonstrates [excellent/good/fair/poor] rehabilitation potential',
          'Cognitive ability: [intact] for learning HEP and self-management',
          'Motivation level: [high/moderate/low] for participating in therapy',
          'Support system: [excellent/adequate/limited] for assistance with recovery'
        ],
        justificationForTherapy: [
          'Skilled PT services needed for [progressive exercise prescription/gait training]',
          'Manual therapy techniques require skilled intervention',
          'Patient education and safety training with assistive devices needed',
          'Monitoring for complications and adjustment of treatment plan required'
        ]
      },
      plan: {
        shortTermGoals: [
          'Patient will achieve knee flexion AROM to 90° within 2 weeks',
          'Patient will demonstrate 4/5 quadriceps strength within 2 weeks',
          'Patient will ambulate 100 feet with [assistive device] independently within 1 week',
          'Patient will report pain level ≤ 3/10 with ADLs within 2 weeks'
        ],
        longTermGoals: [
          'Patient will achieve full knee ROM (0-135°) within 6 weeks',
          'Patient will demonstrate 5/5 strength in all LE muscle groups within 8 weeks',
          'Patient will return to [work/recreational activities] without limitations within 12 weeks',
          'Patient will demonstrate independent HEP management by discharge'
        ],
        interventionsPlanned: [
          'Continue progressive therapeutic exercise program',
          'Advance weight-bearing status per physician protocol',
          'Manual therapy for [joint mobilization/scar tissue management]',
          'Functional training for [stairs/squatting/sporting activities]',
          'Aquatic therapy once wound healed (if available)'
        ],
        homeExerciseProgram: [
          'Quad sets: 10 reps x 3 sets, 3x daily',
          'Heel slides: 10 reps x 3 sets, 2x daily',
          'SLR (all planes): 10 reps x 2 sets, 2x daily',
          'Ankle pumps: 20 reps every hour while awake',
          'Ice for 15-20 minutes after exercises'
        ],
        referrals: [
          'MD follow-up scheduled for [date] for wound check',
          'Consider referral to [orthotist] for functional bracing if needed',
          'Nutritionist referral for wound healing optimization (if applicable)',
          'OT referral for ADL training if fine motor deficits present'
        ],
        frequencyDuration: [
          'Frequency: 2-3x per week for 6-8 weeks',
          'Duration: 45-60 minutes per session',
          'Total anticipated visits: 12-18 sessions',
          'Re-evaluation every 2 weeks to assess progress'
        ],
        patientEducation: [
          'Post-surgical precautions and activity restrictions reviewed',
          'Signs and symptoms of complications (infection, DVT) discussed',
          'Importance of HEP compliance emphasized',
          'Activity pacing and energy conservation techniques taught',
          'Return to activity guidelines per surgeon recommendations'
        ],
        dischargePlanning: [
          'Criteria for discharge: Independent with HEP, functional mobility, RTW/activity',
          'Anticipated discharge environment: Home with/without services',
          'Equipment needs: [none/assistive device/home safety equipment]',
          'Follow-up plan: [independent management/maintenance program/MD follow-up]'
        ]
      }
    }
  }
];

interface SOAPTemplatesProps {
  onTemplateSelect: (template: SOAPTemplate) => void;
  selectedCondition: string;
  onConditionChange: (condition: string) => void;
}

const SOAPTemplates: React.FC<SOAPTemplatesProps> = ({ 
  onTemplateSelect, 
  selectedCondition, 
  onConditionChange 
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SOAPTemplate | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleTemplateSelect = (template: SOAPTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
  };

  const conditions = [...new Set(soapTemplates.map(t => t.condition))];

  const filteredTemplates = selectedCondition 
    ? soapTemplates.filter(t => t.condition === selectedCondition)
    : soapTemplates;

  return (
    <div className="space-y-6">
      {/* Condition Filter */}
      <div className="emr-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Select Condition</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onConditionChange('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedCondition
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All Conditions
          </button>
          {conditions.map(condition => (
            <button
              key={condition}
              onClick={() => onConditionChange(condition)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCondition === condition
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      {/* Template Selection */}
      <div className="emr-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Available Templates</h3>
        <div className="grid gap-4">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-foreground">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.condition}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(template.id);
                    }}
                    className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {expandedSections.includes(template.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Template Preview */}
              {expandedSections.includes(template.id) && (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-muted-foreground mb-2">SUBJECTIVE</h5>
                      <ul className="text-sm space-y-1">
                        {template.sections.subjective.chiefComplaint.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="text-muted-foreground">• {item}</li>
                        ))}
                        {template.sections.subjective.currentSymptoms.slice(0, 1).map((item, idx) => (
                          <li key={idx} className="text-muted-foreground">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-muted-foreground mb-2">ASSESSMENT</h5>
                      <ul className="text-sm space-y-1">
                        {template.sections.assessment.problemList.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="text-muted-foreground">• {item}</li>
                        ))}
                        {template.sections.assessment.prognosis.slice(0, 1).map((item, idx) => (
                          <li key={idx} className="text-muted-foreground">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SOAPTemplates;