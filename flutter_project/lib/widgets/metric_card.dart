import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'glass_panel.dart';

class MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final String? subtext;
  final Color? accentColor;
  final VoidCallback? onTap;

  const MetricCard({
    Key? key,
    required this.label,
    required this.value,
    this.subtext,
    this.accentColor,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12.0),
      child: GlassPanel(
        padding: const EdgeInsets.all(14.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label.toUpperCase(),
              style: const TextStyle(
                fontSize: 10.0,
                fontWeight: FontWeight.w600,
                color: AppTheme.silverMuted,
                letterSpacing: 0.8,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8.0),
            Text(
              value,
              style: TextStyle(
                fontSize: 22.0,
                fontWeight: FontWeight.w700,
                color: accentColor ?? Colors.white,
                fontFamily: 'monospace',
                letterSpacing: -0.5,
              ),
            ),
            if (subtext != null) ...[
              const SizedBox(height: 4.0),
              Text(
                subtext!,
                style: const TextStyle(
                  fontSize: 10.0,
                  color: AppTheme.silverSecondary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
