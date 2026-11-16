import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/notification_service.dart';

class ResidentNotificationsScreen extends StatelessWidget {
  const ResidentNotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final notifService = Provider.of<NotificationService>(context);
    final list = notifService.notifications;
    final timeFormat = DateFormat('h:mm a');

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Society Hub Alerts'),
        actions: [
          if (notifService.unreadCount > 0)
            TextButton(
              onPressed: () => notifService.markAllAsRead(),
              child: const Text('Mark all read', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.royalBlue)),
            ),
        ],
      ),
      body: list.isEmpty
          ? const Center(child: Text('No notifications at this time.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: list.length,
              itemBuilder: (context, index) {
                final notif = list[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: notif.isRead ? AppColors.pureWhite : const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: notif.isRead ? AppColors.borderDark : AppColors.royalBlue,
                      width: notif.isRead ? 1.5 : 2,
                    ),
                    boxShadow: AppColors.cartoonShadow(offset: 2.5),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.slate100,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderDark, width: 1.5),
                        ),
                        child: const Icon(Icons.notifications_active_rounded, size: 20, color: AppColors.royalBlue),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    notif.title,
                                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppColors.darkNavy),
                                  ),
                                ),
                                Text(
                                  timeFormat.format(notif.createdAt),
                                  style: const TextStyle(fontSize: 11, color: AppColors.slate400, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              notif.message,
                              style: const TextStyle(fontSize: 12, color: AppColors.slate600, height: 1.3),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
