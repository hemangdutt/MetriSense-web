import 'package:flutter/material.dart';

class AppTheme {
  // Primary Palette
  static const Color bgPrimary = Color(0xFF07090A);
  static const Color bgSecondary = Color(0xFF0B0D0F);
  static const Color bgTertiary = Color(0xFF121417);

  // Silvers & Monochromes
  static const Color textPrimary = Color(0xFFEEEEEE);
  static const Color textSecondary = Color(0xFFB0B2B4);
  static const Color textMuted = Color(0xFF74777A);

  // Status Indicators (Subdued Metrological Signals)
  static const Color success = Color(0xFF8EB89B);
  static const Color warning = Color(0xFFD4B483);
  static const Color failure = Color(0xFFB87C7C);

  // Glass Hierarchies
  static final Color glassL2Background = Colors.white.withOpacity(0.045);
  static final Color glassL3Background = Colors.white.withOpacity(0.075);
  static final Color glassL4Background = Colors.white.withOpacity(0.11);
  static final Color glassBorder = Colors.white.withOpacity(0.10);
  static final Color glassHighlight = Colors.white.withOpacity(0.12);

  static ThemeData get themeData {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgPrimary,
      primaryColor: textPrimary,
      canvasColor: bgSecondary,
      colorScheme: const ColorScheme.dark(
        primary: textPrimary,
        secondary: textSecondary,
        surface: bgSecondary,
        error: failure,
      ),
      fontFamily: 'Plus Jakarta Sans',
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          color: textPrimary,
          fontSize: 26,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.5,
        ),
        headlineMedium: TextStyle(
          color: textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
        titleMedium: TextStyle(
          color: textPrimary,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
        bodyLarge: TextStyle(
          color: textPrimary,
          fontSize: 14,
          fontWeight: FontWeight.w400,
        ),
        bodyMedium: TextStyle(
          color: textSecondary,
          fontSize: 12,
          fontWeight: FontWeight.w400,
        ),
        labelSmall: TextStyle(
          color: textMuted,
          fontSize: 11,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.5,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white.withOpacity(0.05),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: glassBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: glassBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.22), width: 1.2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: failure),
        ),
        labelStyle: const TextStyle(color: textSecondary, fontSize: 12),
        hintStyle: const TextStyle(color: textMuted, fontSize: 12),
      ),
    );
  }
}

