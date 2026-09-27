import 'package:flutter/material.dart';
import '../models/oiml_models.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_panel.dart';
import '../widgets/metric_card.dart';
import '../widgets/status_badge.dart';

class DashboardScreen extends StatelessWidget {
  final List<Evaluation> evaluations;
  final VoidCallback onNewEvaluation;
  final ValueChanged<Evaluation> onSelectEvaluation;
  final VoidCallback onViewArchive;

  const DashboardScreen({
    Key? key,
    required this.evaluations,
    required this.onNewEvaluation,
    required this.onSelectEvaluation,
    required this.onViewArchive,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final int total = evaluations.length;
    final int inProgress = evaluations.where((e) => e.status == 'IN PROGRESS').length;
    final int completed = evaluations.where((e) => e.status == 'COMPLETED').length;
    final int reportsReady = evaluations.where((e) => e.status == 'REPORTS READY').length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Evaluation Console',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Laboratory overview and active type-evaluation work',
                    style: TextStyle(fontSize: 12, color: AppTheme.silverSecondary),
                  ),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.steelBlue,
                  foregroundColor: AppTheme.bgPrimary,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: onNewEvaluation,
                icon: const Icon(Icons.add, size: 18),
                label: const Text(
                  'New Evaluation',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Metric Cards Row
          LayoutBuilder(
            builder: (context, constraints) {
              final double cardWidth = (constraints.maxWidth - 36) / 4;
              final isNarrow = constraints.maxWidth < 800;

              if (isNarrow) {
                return GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.8,
                  children: [
                    MetricCard(
                      label: 'Total Evaluations',
                      value: total.toString().padLeft(2, '0'),
                      subtext: 'In metrology repository',
                    ),
                    MetricCard(
                      label: 'In Progress',
                      value: inProgress.toString().padLeft(2, '0'),
                      subtext: 'Active testing',
                      accentColor: AppTheme.steelBlue,
                    ),
                    MetricCard(
                      label: 'Completed',
                      value: completed.toString().padLeft(2, '0'),
                      subtext: 'MPE verified',
                      accentColor: AppTheme.success,
                    ),
                    MetricCard(
                      label: 'Reports Ready',
                      value: reportsReady.toString().padLeft(2, '0'),
                      subtext: 'Awaiting issuance',
                      accentColor: AppTheme.warning,
                    ),
                  ],
                );
              }

              return Row(
                children: [
                  Expanded(
                    child: MetricCard(
                      label: 'Total Evaluations',
                      value: total.toString().padLeft(2, '0'),
                      subtext: 'In metrology repository',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: MetricCard(
                      label: 'In Progress',
                      value: inProgress.toString().padLeft(2, '0'),
                      subtext: 'Active load testing',
                      accentColor: AppTheme.steelBlue,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: MetricCard(
                      label: 'Completed',
                      value: completed.toString().padLeft(2, '0'),
                      subtext: 'MPE verified & signed',
                      accentColor: AppTheme.success,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: MetricCard(
                      label: 'Reports Ready',
                      value: reportsReady.toString().padLeft(2, '0'),
                      subtext: 'Awaiting issuance',
                      accentColor: AppTheme.warning,
                    ),
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: 24),

          // Active Evaluations Panel
          GlassPanel(
            padding: EdgeInsets.zero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'ACTIVE EVALUATIONS',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.0,
                          color: AppTheme.silverPrimary,
                        ),
                      ),
                      TextButton(
                        onPressed: onViewArchive,
                        child: const Text(
                          'View All Archive →',
                          style: TextStyle(color: AppTheme.steelBlue, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1, color: AppTheme.glassBorder),
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: evaluations.take(5).length,
                  separatorBuilder: (_, __) =>
                      const Divider(height: 1, color: AppTheme.glassBorder),
                  itemBuilder: (context, index) {
                    final item = evaluations[index];
                    return ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16.0,
                        vertical: 6.0,
                      ),
                      onTap: () => onSelectEvaluation(item),
                      title: Row(
                        children: [
                          Text(
                            item.id,
                            style: const TextStyle(
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                              color: AppTheme.steelBlue,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            '${item.instrument.manufacturer} · ${item.instrument.model}',
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4.0),
                        child: Text(
                          '${item.instrument.accuracyClass.label} · Max ${item.instrument.maxCapacity} ${item.instrument.unit} / e=${item.instrument.verificationScaleInterval} ${item.instrument.unit}',
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppTheme.silverMuted,
                          ),
                        ),
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          StatusBadge(status: item.status, isSmall: true),
                          const SizedBox(width: 12),
                          const Icon(
                            Icons.chevron_right,
                            color: AppTheme.silverMuted,
                            size: 18,
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
