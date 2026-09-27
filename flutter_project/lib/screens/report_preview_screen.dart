import 'package:flutter/material.dart';
import '../models/oiml_models.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_panel.dart';
import '../widgets/status_badge.dart';

class ReportPreviewScreen extends StatelessWidget {
  final Evaluation evaluation;
  final VoidCallback onBack;

  const ReportPreviewScreen({
    Key? key,
    required this.evaluation,
    required this.onBack,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final inst = evaluation.instrument;
    final lab = evaluation.laboratoryConditions;
    final bool isCompliant = evaluation.conclusion == 'COMPLIANT';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 860),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Back Button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton.icon(
                    onPressed: onBack,
                    icon: const Icon(Icons.arrow_back, size: 16),
                    label: const Text('Back to Console'),
                    style: TextButton.styleFrom(foregroundColor: AppTheme.silverSecondary),
                  ),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.steelBlue,
                      foregroundColor: AppTheme.bgPrimary,
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Report queued for official metrology export (PDF).'),
                        ),
                      );
                    },
                    icon: const Icon(Icons.print, size: 16),
                    label: const Text('Print / Export PDF'),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Official Document Card
              Container(
                padding: const EdgeInsets.all(32.0),
                decoration: BoxDecoration(
                  color: AppTheme.bgSecondary,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'METRISENSE',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 2.0,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'PRECISION EVALUATION PLATFORM · LEGAL METROLOGY',
                              style: TextStyle(
                                fontSize: 9,
                                letterSpacing: 1.2,
                                color: AppTheme.steelBlue,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              evaluation.id,
                              style: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Date: ${lab.date}',
                              style: const TextStyle(fontSize: 10, color: AppTheme.silverMuted),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const Divider(height: 32, color: AppTheme.glassBorder),

                    // Document Title
                    const Center(
                      child: Column(
                        children: [
                          Text(
                            'NON-AUTOMATIC WEIGHING INSTRUMENT (NAWI)',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.0,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'TYPE EVALUATION REPORT (OIML R 76-1:2006)',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1.5,
                              color: AppTheme.steelBlue,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // 1. Instrument Specs Table
                    const Text(
                      '1. INSTRUMENT METROLOGICAL IDENTIFICATION',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.silverPrimary),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: Colors.white.withOpacity(0.06)),
                      ),
                      child: Column(
                        children: [
                          _buildReportRow('Manufacturer', inst.manufacturer, 'Model', inst.model),
                          const SizedBox(height: 6),
                          _buildReportRow('Serial Number', inst.serialNumber, 'Instrument Type', inst.instrumentType),
                          const SizedBox(height: 6),
                          _buildReportRow('Accuracy Class', inst.accuracyClass.label, 'Intervals n', inst.n.toStringAsFixed(0)),
                          const SizedBox(height: 6),
                          _buildReportRow('Capacity Max / Min', '${inst.maxCapacity} / ${inst.minCapacity} ${inst.unit}', 'Scale Interval e', '${inst.verificationScaleInterval} ${inst.unit}'),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // 2. Laboratory Conditions
                    const Text(
                      '2. CONTROLLED LABORATORY CONDITIONS',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.silverPrimary),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: Colors.white.withOpacity(0.06)),
                      ),
                      child: Column(
                        children: [
                          _buildReportRow('Testing Lab', lab.laboratory, 'Location', lab.testLocation),
                          const SizedBox(height: 6),
                          _buildReportRow('Temperature', '${lab.ambientTemperature} °C', 'Relative Humidity', '${lab.relativeHumidity} % RH'),
                          const SizedBox(height: 6),
                          _buildReportRow('Barometric Pressure', '${lab.atmosphericPressure} hPa', 'Testing Officer', lab.operator),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // 3. Test Observations
                    const Text(
                      '3. ERROR VERIFICATION OBSERVATIONS (E = I + 0.5e - ΔL - L)',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.silverPrimary),
                    ),
                    const SizedBox(height: 8),
                    Table(
                      border: TableBorder.all(color: Colors.white.withOpacity(0.06)),
                      children: [
                        TableRow(
                          decoration: BoxDecoration(color: Colors.black.withOpacity(0.4)),
                          children: const [
                            Padding(padding: EdgeInsets.all(6), child: Text('Stage', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                            Padding(padding: EdgeInsets.all(6), child: Text('Applied L', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                            Padding(padding: EdgeInsets.all(6), child: Text('Indication I', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                            Padding(padding: EdgeInsets.all(6), child: Text('Error E', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                            Padding(padding: EdgeInsets.all(6), child: Text('MPE ±', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                            Padding(padding: EdgeInsets.all(6), child: Text('Result', style: TextStyle(fontSize: 10, color: AppTheme.silverMuted))),
                          ],
                        ),
                        ...evaluation.tests.map((t) {
                          return TableRow(
                            children: [
                              Padding(padding: const EdgeInsets.all(6), child: Text(t.loadStage, style: const TextStyle(fontSize: 11, color: Colors.white))),
                              Padding(padding: const EdgeInsets.all(6), child: Text('${t.appliedLoad}', style: const TextStyle(fontSize: 11, color: AppTheme.silverSecondary))),
                              Padding(padding: const EdgeInsets.all(6), child: Text('${t.indicatedValue}', style: const TextStyle(fontSize: 11, color: AppTheme.silverSecondary))),
                              Padding(padding: const EdgeInsets.all(6), child: Text('${t.calculatedError}', style: TextStyle(fontSize: 11, color: t.status == TestStatus.pass ? const Color(0xFF86EFAC) : const Color(0xFFFCA5A5)))),
                              Padding(padding: const EdgeInsets.all(6), child: Text('±${t.mpe}', style: const TextStyle(fontSize: 11, color: AppTheme.silverMuted))),
                              Padding(padding: const EdgeInsets.all(6), child: Text(t.status.label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: t.status == TestStatus.pass ? const Color(0xFF86EFAC) : const Color(0xFFFCA5A5)))),
                            ],
                          );
                        }).toList(),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Finding Box
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: (isCompliant ? AppTheme.success : AppTheme.failure).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: (isCompliant ? AppTheme.success : AppTheme.failure).withOpacity(0.35),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                isCompliant ? 'TYPE EVALUATION FINDING: COMPLIANT' : 'TYPE EVALUATION FINDING: REJECTED',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: isCompliant ? const Color(0xFF86EFAC) : const Color(0xFFFCA5A5),
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Evaluated according to OIML R 76-1 criteria.',
                                style: TextStyle(fontSize: 11, color: AppTheme.silverSecondary),
                              ),
                            ],
                          ),
                          StatusBadge(status: isCompliant ? 'APPROVED' : 'FAILED'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReportRow(String label1, String val1, String label2, String val2) {
    return Row(
      children: [
        Expanded(
          child: Row(
            children: [
              Text('$label1: ', style: const TextStyle(fontSize: 10, color: AppTheme.silverMuted)),
              Expanded(child: Text(val1, style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w500), overflow: TextOverflow.ellipsis)),
            ],
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Row(
            children: [
              Text('$label2: ', style: const TextStyle(fontSize: 10, color: AppTheme.silverMuted)),
              Expanded(child: Text(val2, style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w500), overflow: TextOverflow.ellipsis)),
            ],
          ),
        ),
      ],
    );
  }
}
