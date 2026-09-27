import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class StatusBadge extends StatelessWidget {
  final String status;
  final bool isSmall;

  const StatusBadge({
    Key? key,
    required this.status,
    this.isSmall = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final normalized = status.toUpperCase().trim();

    Color bgColor = Colors.white.withOpacity(0.05);
    Color borderColor = Colors.white.withOpacity(0.1);
    Color textColor = AppTheme.silverSecondary;
    Color indicatorColor = AppTheme.silverMuted;

    if (normalized == 'PASS' || normalized == 'COMPLIANT') {
      bgColor = AppTheme.success.withOpacity(0.15);
      borderColor = AppTheme.success.withOpacity(0.35);
      textColor = const Color(0xFF86EFAC);
      indicatorColor = AppTheme.success;
    } else if (normalized == 'FAIL' || normalized == 'NON-COMPLIANT' || normalized == 'FAILED') {
      bgColor = AppTheme.failure.withOpacity(0.15);
      borderColor = AppTheme.failure.withOpacity(0.35);
      textColor = const Color(0xFFFCA5A5);
      indicatorColor = AppTheme.failure;
    } else if (normalized == 'IN PROGRESS') {
      bgColor = AppTheme.steelBlue.withOpacity(0.15);
      borderColor = AppTheme.steelBlue.withOpacity(0.35);
      textColor = const Color(0xFFA5C7E6);
      indicatorColor = AppTheme.steelBlue;
    } else if (normalized == 'IN REVIEW' || normalized == 'PENDING') {
      bgColor = AppTheme.warning.withOpacity(0.15);
      borderColor = AppTheme.warning.withOpacity(0.35);
      textColor = const Color(0xFFFCD34D);
      indicatorColor = AppTheme.warning;
    } else if (normalized == 'REPORTS READY' || normalized == 'COMPLETED') {
      bgColor = AppTheme.steelBlue.withOpacity(0.2);
      borderColor = AppTheme.steelBlue.withOpacity(0.4);
      textColor = AppTheme.silverPrimary;
      indicatorColor = AppTheme.steelBlue;
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isSmall ? 8.0 : 10.0,
        vertical: isSmall ? 3.0 : 5.0,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6.0),
        border: Border.all(color: borderColor, width: 1.0),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6.0,
            height: 6.0,
            decoration: BoxDecoration(
              color: indicatorColor,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6.0),
          Text(
            normalized,
            style: TextStyle(
              color: textColor,
              fontSize: isSmall ? 10.0 : 11.0,
              fontWeight: FontWeight.w600,
              fontFamily: 'monospace',
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}
