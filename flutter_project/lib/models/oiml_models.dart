enum AccuracyClass {
  classI,
  classII,
  classIII,
  classIIII,
}

extension AccuracyClassExtension on AccuracyClass {
  String get label {
    switch (this) {
      case AccuracyClass.classI:
        return 'Class I';
      case AccuracyClass.classII:
        return 'Class II';
      case AccuracyClass.classIII:
        return 'Class III';
      case AccuracyClass.classIIII:
        return 'Class IIII';
    }
  }

  static AccuracyClass fromString(String str) {
    switch (str) {
      case 'Class I':
        return AccuracyClass.classI;
      case 'Class II':
        return AccuracyClass.classII;
      case 'Class IIII':
        return AccuracyClass.classIIII;
      case 'Class III':
      default:
        return AccuracyClass.classIII;
    }
  }
}

class Instrument {
  final String manufacturer;
  final String model;
  final String serialNumber;
  final String instrumentType;
  final AccuracyClass accuracyClass;
  final double maxCapacity;
  final double minCapacity;
  final double verificationScaleInterval; // e
  final String unit;
  final double n; // Max / e

  Instrument({
    required this.manufacturer,
    required this.model,
    required this.serialNumber,
    required this.instrumentType,
    required this.accuracyClass,
    required this.maxCapacity,
    required this.minCapacity,
    required this.verificationScaleInterval,
    this.unit = 'kg',
    required this.n,
  });
}

class LaboratoryConditions {
  final String laboratory;
  final String testLocation;
  final double ambientTemperature;
  final double relativeHumidity;
  final double atmosphericPressure;
  final String date;
  final String operator;
  final String equipmentUsed;

  LaboratoryConditions({
    required this.laboratory,
    required this.testLocation,
    required this.ambientTemperature,
    required this.relativeHumidity,
    required this.atmosphericPressure,
    required this.date,
    required this.operator,
    required this.equipmentUsed,
  });
}

enum TestStatus {
  pass,
  fail,
  pending,
}

extension TestStatusExtension on TestStatus {
  String get label {
    switch (this) {
      case TestStatus.pass:
        return 'PASS';
      case TestStatus.fail:
        return 'FAIL';
      case TestStatus.pending:
        return 'PENDING';
    }
  }
}

class TestObservation {
  final String id;
  final String testType;
  final String testName;
  final String loadStage;
  final double appliedLoad; // L
  final double indicatedValue; // I
  final double deltaLoad; // ΔL
  final double calculatedError; // E
  final double mpe; // MPE ±
  final TestStatus status;

  TestObservation({
    required this.id,
    required this.testType,
    required this.testName,
    required this.loadStage,
    required this.appliedLoad,
    required this.indicatedValue,
    required this.deltaLoad,
    required this.calculatedError,
    required this.mpe,
    required this.status,
  });
}

class Evaluation {
  final String id;
  final Instrument instrument;
  final LaboratoryConditions laboratoryConditions;
  final List<TestObservation> tests;
  final String status; // 'IN PROGRESS' | 'COMPLETED' | 'REPORTS READY' | 'FAILED'
  final String createdAt;
  final String updatedAt;
  final String conclusion; // 'COMPLIANT' | 'NON-COMPLIANT'
  final String? officerNotes;

  Evaluation({
    required this.id,
    required this.instrument,
    required this.laboratoryConditions,
    required this.tests,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    required this.conclusion,
    this.officerNotes,
  });
}
