import 'package:flutter/material.dart';

class AppColors {
  // Brand Foundation
  static const Color creamBg = Color(0xFFFEF9F3);
  static const Color darkNavy = Color(0xFF0A1128);
  static const Color royalBlue = Color(0xFF1D4ED8);
  static const Color blueLight = Color(0xFF2563EB);
  static const Color vibrantOrange = Color(0xFFF97316);
  static const Color orangeLight = Color(0xFFFFF7ED);
  static const Color mintGreen = Color(0xFF10B981);
  static const Color mintLight = Color(0xFFECFDF5);
  static const Color pureWhite = Color(0xFFFFFFFF);
  static const Color slate50 = Color(0xFFF8FAFC);
  static const Color slate100 = Color(0xFFF1F5F9);
  static const Color slate200 = Color(0xFFE2E8F0);
  static const Color slate400 = Color(0xFF94A3B8);
  static const Color slate600 = Color(0xFF475569);
  static const Color slate800 = Color(0xFF1E293B);
  static const Color warningRed = Color(0xFFEF4444);
  static const Color warningLight = Color(0xFFFEF2F2);
  static const Color amber = Color(0xFFF59E0B);
  static const Color purple = Color(0xFF8B5CF6);
  static const Color purpleLight = Color(0xFFF5F3FF);

  // Borders & Shadows
  static const Color borderDark = Color(0xFF0A1128);
  static const double borderWidth = 2.0;
  static const double thickBorderWidth = 2.5;

  // Box Shadows (Retro cartoon hard drop shadow)
  static List<BoxShadow> cartoonShadow({
    Color shadowColor = darkNavy,
    double offset = 4.0,
  }) {
    return [
      BoxShadow(
        color: shadowColor,
        offset: Offset(offset, offset),
        blurRadius: 0,
        spreadRadius: 0,
      ),
    ];
  }

  static List<BoxShadow> smallShadow = [
    const BoxShadow(
      color: darkNavy,
      offset: Offset(2, 2),
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];
}
