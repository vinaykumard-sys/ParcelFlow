import 'package:flutter/material.dart';
import '../models/parcel_model.dart';
import '../theme/app_colors.dart';

class StatusPill extends StatelessWidget {
  final ParcelStatus status;

  const StatusPill({super.key, required this.status});

  Color _getBackgroundColor() {
    switch (status) {
      case ParcelStatus.created:
        return AppColors.slate100;
      case ParcelStatus.received:
        return AppColors.orangeLight;
      case ParcelStatus.stored:
        return const Color(0xFFEFF6FF);
      case ParcelStatus.notified:
        return const Color(0xFFFDF4FF);
      case ParcelStatus.scheduled:
        return const Color(0xFFFEF3C7);
      case ParcelStatus.readyForPickup:
        return AppColors.mintLight;
      case ParcelStatus.verified:
        return const Color(0xFFE0E7FF);
      case ParcelStatus.handedOver:
      case ParcelStatus.completed:
        return const Color(0xFFDCFCE7);
      case ParcelStatus.cancelled:
        return AppColors.warningLight;
      case ParcelStatus.expired:
        return const Color(0xFFFEE2E2);
    }
  }

  Color _getTextColor() {
    switch (status) {
      case ParcelStatus.created:
        return AppColors.slate600;
      case ParcelStatus.received:
        return AppColors.vibrantOrange;
      case ParcelStatus.stored:
        return AppColors.royalBlue;
      case ParcelStatus.notified:
        return AppColors.purple;
      case ParcelStatus.scheduled:
        return const Color(0xFFB45309);
      case ParcelStatus.readyForPickup:
        return const Color(0xFF047857);
      case ParcelStatus.verified:
        return const Color(0xFF4338CA);
      case ParcelStatus.handedOver:
      case ParcelStatus.completed:
        return const Color(0xFF15803D);
      case ParcelStatus.cancelled:
      case ParcelStatus.expired:
        return AppColors.warningRed;
    }
  }

  IconData _getIcon() {
    switch (status) {
      case ParcelStatus.created:
        return Icons.hourglass_top_rounded;
      case ParcelStatus.received:
        return Icons.inventory_2_outlined;
      case ParcelStatus.stored:
        return Icons.shelves;
      case ParcelStatus.notified:
        return Icons.notifications_active_outlined;
      case ParcelStatus.scheduled:
        return Icons.access_time_rounded;
      case ParcelStatus.readyForPickup:
        return Icons.check_circle_outline_rounded;
      case ParcelStatus.verified:
        return Icons.verified_outlined;
      case ParcelStatus.handedOver:
      case ParcelStatus.completed:
        return Icons.task_alt_rounded;
      case ParcelStatus.cancelled:
        return Icons.cancel_outlined;
      case ParcelStatus.expired:
        return Icons.warning_amber_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final bg = _getBackgroundColor();
    final fg = _getTextColor();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.borderDark,
          width: 1.5,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(_getIcon(), size: 14, color: fg),
          const SizedBox(width: 4),
          Text(
            status.label,
            style: TextStyle(
              color: fg,
              fontSize: 12,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }
}
