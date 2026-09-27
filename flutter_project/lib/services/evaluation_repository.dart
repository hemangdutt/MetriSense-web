import '../models/oiml_models.dart';

class EvaluationRepository {
  static final List<Evaluation> _evaluations = [
    Evaluation(
      id: 'NAWI-2026-0042',
      instrument: Instrument(
        manufacturer: 'Apex Instruments Pvt Ltd',
        model: 'AX-300',
        serialNumber: 'AX-2026-90412',
        instrumentType: 'Electronic Weighing Instrument',
        accuracyClass: AccuracyClass.classIII,
        maxCapacity: 30.0,
        minCapacity: 0.2,
        verificationScaleInterval: 0.01,
        unit: 'kg',
        n: 3000.0,
      ),
      laboratoryConditions: LaboratoryConditions(
        laboratory: 'National Metrology Institute - Laboratory 03',
        testLocation: 'Mass & Load Calibration Bay B-12',
        ambientTemperature: 21.2,
        relativeHumidity: 48.5,
        atmosphericPressure: 1014.2,
        date: '2026-09-22',
        operator: 'Dr. V. Ramanathan, Metrology Lead',
        equipmentUsed: 'Class E2 Mass Standard Set (S/N NMI-E2-441)',
      ),
      status: 'IN PROGRESS',
      createdAt: '2026-09-22',
      updatedAt: '2026-09-23',
      conclusion: 'INCOMPLETE',
      officerNotes: 'Zero tracking verified. Increasing-load tests under execution.',
      tests: [
        TestObservation(
          id: 't-01',
          testType: 'zero_indication',
          testName: 'Zero-setting Test',
          loadStage: 'Zero (0 kg)',
          appliedLoad: 0.0,
          indicatedValue: 0.0,
          deltaLoad: 0.005,
          calculatedError: 0.0,
          mpe: 0.005,
          status: TestStatus.pass,
        ),
        TestObservation(
          id: 't-02',
          testType: 'increasing_load',
          testName: 'Increasing-Load Test',
          loadStage: 'Min (0.2 kg)',
          appliedLoad: 0.2,
          indicatedValue: 0.2,
          deltaLoad: 0.005,
          calculatedError: 0.0,
          mpe: 0.005,
          status: TestStatus.pass,
        ),
        TestObservation(
          id: 't-03',
          testType: 'increasing_load',
          testName: 'Increasing-Load Test',
          loadStage: '500e (5.0 kg)',
          appliedLoad: 5.0,
          indicatedValue: 5.0,
          deltaLoad: 0.004,
          calculatedError: 0.001,
          mpe: 0.005,
          status: TestStatus.pass,
        ),
      ],
    ),
    Evaluation(
      id: 'NAWI-2026-0041',
      instrument: Instrument(
        manufacturer: 'Precision Weightech Solutions',
        model: 'PW-500',
        serialNumber: 'PWS-2026-0087',
        instrumentType: 'Platform Scale',
        accuracyClass: AccuracyClass.classIII,
        maxCapacity: 60.0,
        minCapacity: 0.4,
        verificationScaleInterval: 0.02,
        unit: 'kg',
        n: 3000.0,
      ),
      laboratoryConditions: LaboratoryConditions(
        laboratory: 'Regional Legal Metrology Laboratory',
        testLocation: 'Chamber 2',
        ambientTemperature: 20.0,
        relativeHumidity: 50.0,
        atmosphericPressure: 1013.2,
        date: '2026-09-20',
        operator: 'A. K. Sharma',
        equipmentUsed: 'Class F1 Stainless Mass Array 100kg',
      ),
      status: 'IN REVIEW',
      createdAt: '2026-09-20',
      updatedAt: '2026-09-23',
      conclusion: 'COMPLIANT',
      officerNotes: 'Sequence completed. Within OIML R 76 MPE limits.',
      tests: [
        TestObservation(
          id: 'pw-01',
          testType: 'increasing_load',
          testName: 'Increasing-Load Test',
          loadStage: 'Min (0.4 kg)',
          appliedLoad: 0.4,
          indicatedValue: 0.4,
          deltaLoad: 0.01,
          calculatedError: 0.0,
          mpe: 0.01,
          status: TestStatus.pass,
        ),
        TestObservation(
          id: 'pw-02',
          testType: 'increasing_load',
          testName: 'Increasing-Load Test',
          loadStage: 'Max (60.0 kg)',
          appliedLoad: 60.0,
          indicatedValue: 60.02,
          deltaLoad: 0.01,
          calculatedError: 0.02,
          mpe: 0.03,
          status: TestStatus.pass,
        ),
      ],
    ),
    Evaluation(
      id: 'NAWI-2026-0039',
      instrument: Instrument(
        manufacturer: 'Metric Systems Instruments',
        model: 'MS-120',
        serialNumber: 'MS-9812-D',
        instrumentType: 'Bench Scale',
        accuracyClass: AccuracyClass.classII,
        maxCapacity: 12.0,
        minCapacity: 0.05,
        verificationScaleInterval: 0.001,
        unit: 'kg',
        n: 12000.0,
      ),
      laboratoryConditions: LaboratoryConditions(
        laboratory: 'National Metrology Institute',
        testLocation: 'Chamber A-04',
        ambientTemperature: 20.1,
        relativeHumidity: 45.0,
        atmosphericPressure: 1012.8,
        date: '2026-09-15',
        operator: 'Dr. Neha Sen',
        equipmentUsed: 'Mettler E1 Reference Weight Set',
      ),
      status: 'COMPLETED',
      createdAt: '2026-09-15',
      updatedAt: '2026-09-18',
      conclusion: 'COMPLIANT',
      officerNotes: 'Conforms to Class II limits.',
      tests: [],
    ),
  ];

  static List<Evaluation> getAll() {
    return List.unmodifiable(_evaluations);
  }

  static void addEvaluation(Evaluation evaluation) {
    _evaluations.insert(0, evaluation);
  }

  static Evaluation? getById(String id) {
    try {
      return _evaluations.firstWhere((e) => e.id == id);
    } catch (_) {
      return null;
    }
  }

  static String generateNextId() {
    final year = DateTime.now().year;
    final num = _evaluations.length + 43;
    final padded = num.toString().padLeft(4, '0');
    return 'NAWI-$year-$padded';
  }
}
