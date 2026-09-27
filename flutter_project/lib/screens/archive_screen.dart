import 'package:flutter/material.dart';
import '../models/oiml_models.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_panel.dart';
import '../widgets/status_badge.dart';

class ArchiveScreen extends StatefulWidget {
  final List<Evaluation> evaluations;
  final ValueChanged<Evaluation> onSelectEvaluation;

  const ArchiveScreen({
    Key? key,
    required this.evaluations,
    required this.onSelectEvaluation,
  }) : super(key: key);

  @override
  State<ArchiveScreen> createState() => _ArchiveScreenState();
}

class _ArchiveScreenState extends State<ArchiveScreen> {
  String _searchQuery = '';
  String _statusFilter = 'ALL';

  @override
  Widget build(BuildContext context) {
    final filtered = widget.evaluations.where((e) {
      final matchesSearch = e.id.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          e.instrument.manufacturer.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          e.instrument.model.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          e.instrument.serialNumber.toLowerCase().contains(_searchQuery.toLowerCase());

      if (_statusFilter == 'ALL') return matchesSearch;
      return matchesSearch && e.status == _statusFilter;
    }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Evaluation Archive',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Search and inspect historical type-evaluation records and compliance audits',
            style: TextStyle(fontSize: 12, color: AppTheme.silverSecondary),
          ),
          const SizedBox(height: 20),

          // Search & Filter Box
          GlassPanel(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: const InputDecoration(
                      hintText: 'Search by ID, manufacturer, model, or serial...',
                      prefixIcon: Icon(Icons.search, size: 18, color: AppTheme.silverMuted),
                      isDense: true,
                    ),
                    onChanged: (val) => setState(() => _searchQuery = val),
                  ),
                ),
                const SizedBox(width: 16),
                DropdownButton<String>(
                  value: _statusFilter,
                  dropdownColor: AppTheme.bgSecondary,
                  underline: const SizedBox(),
                  style: const TextStyle(fontSize: 12, color: Colors.white),
                  items: const [
                    DropdownMenuItem(value: 'ALL', child: Text('All Statuses')),
                    DropdownMenuItem(value: 'IN PROGRESS', child: Text('In Progress')),
                    DropdownMenuItem(value: 'COMPLETED', child: Text('Completed')),
                    DropdownMenuItem(value: 'REPORTS READY', child: Text('Reports Ready')),
                    DropdownMenuItem(value: 'FAILED', child: Text('Failed')),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _statusFilter = val);
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Archive List
          GlassPanel(
            padding: EdgeInsets.zero,
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const Divider(height: 1, color: AppTheme.glassBorder),
              itemBuilder: (context, index) {
                final item = filtered[index];
                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  onTap: () => widget.onSelectEvaluation(item),
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
                        style: const TextStyle(fontSize: 13, color: Colors.white),
                      ),
                    ],
                  ),
                  subtitle: Text(
                    'Class: ${item.instrument.accuracyClass.label} · S/N: ${item.instrument.serialNumber} · ${item.laboratoryConditions.date}',
                    style: const TextStyle(fontSize: 11, color: AppTheme.silverMuted),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      StatusBadge(status: item.status, isSmall: true),
                      const SizedBox(width: 8),
                      const Icon(Icons.chevron_right, color: AppTheme.silverMuted, size: 18),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
