import 'dart:math' as math;
import '../models/oiml_models.dart';

class EvaluationResult {
  final double calculatedError;
  final double mpe;
  final TestStatus status;

  EvaluationResult({
    required this.calculatedError,
    required this.mpe,
    required this.status,
  });
}

class OimlCalculationEngine {
  /// Calculate number of verification scale intervals: n = Max / e
  static double calculateVerificationIntervals(double maxCapacity, double e) {
    if (e <= 0 || maxCapacity <= 0) return 0.0;
    return (maxCapacity / e);
  }

  /// Maximum Permissible Error (MPE) pursuant to OIML R 76-1 Table 6
  static double getMpe(double appliedLoad, double e, AccuracyClass accuracyClass) {
    if (e <= 0 || appliedLoad < 0) return 0.0;

    final double m = appliedLoad / e;
    double mpeFactor;

    switch (accuracyClass) {
      case AccuracyClass.classI:
        if (m <= 50000) {
          mpeFactor = 0.5;
        } else if (m <= 200000) {
          mpeFactor = 1.0;
        } else {
          mpeFactor = 1.5;
        }
        break;

      case AccuracyClass.classII:
        if (m <= 5000) {
          mpeFactor = 0.5;
        } else if (m <= 20000) {
          mpeFactor = 1.0;
        } else {
          mpeFactor = 1.5;
        }
        break;

      case AccuracyClass.classIII:
        if (m <= 500) {
          mpeFactor = 0.5;
        } else if (m <= 2000) {
          mpeFactor = 1.0;
        } else {
          mpeFactor = 1.5;
        }
        break;

      case AccuracyClass.classIIII:
        if (m <= 50) {
          mpeFactor = 0.5;
        } else if (m <= 200) {
          mpeFactor = 1.0;
        } else {
          mpeFactor = 1.5;
        }
        break;
    }

    final double mpe = mpeFactor * e;
    return double.parse(mpe.toStringAsFixed(6));
  }

  /// OIML R 76 Error Calculation
  /// Formula: E = I + 0.5e - ΔL - L
  static double calculateError(
    double indicatedValue,
    double appliedLoad,
    double deltaLoad,
    double e,
  ) {
    double rawError;
    if (deltaLoad > 0) {
      rawError = indicatedValue + 0.5 * e - deltaLoad - appliedLoad;
    } else {
      rawError = indicatedValue - appliedLoad;
    }
    return double.parse(rawError.toStringAsFixed(6));
  }

  /// Real-time full test evaluation
  static EvaluationResult evaluateObservation({
    required double appliedLoad,
    required double indicatedValue,
    required double deltaLoad,
    required double e,
    required AccuracyClass accuracyClass,
  }) {
    final double err = calculateError(indicatedValue, appliedLoad, deltaLoad, e);
    final double mpe = getMpe(appliedLoad, e, accuracyClass);
    final bool passed = err.abs() <= (mpe + 1e-9);

    return EvaluationResult(
      calculatedError: err,
      mpe: mpe,
      status: passed ? TestStatus.pass : TestStatus.fail,
    );
  }
}
