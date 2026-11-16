import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class CartoonBadge extends StatelessWidget {
  final String text;
  final Color backgroundColor;
  final Color textColor;
  final double rotationAngle;
  final IconData? icon;

  const CartoonBadge({
    super.key,
    required this.text,
    this.backgroundColor = AppColors.mintGreen,
    this.textColor = AppColors.darkNavy,
    this.rotationAngle = -0.04, // slight playful tilt
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Transform.rotate(
      angle: rotationAngle,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: AppColors.borderDark,
            width: 1.8,
          ),
          boxShadow: const [
            BoxShadow(
              color: AppColors.borderDark,
              offset: Offset(2, 2),
              blurRadius: 0,
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 14, color: textColor),
              const SizedBox(width: 4),
            ],
            Text(
              text,
              style: TextStyle(
                color: textColor,
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.3,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
