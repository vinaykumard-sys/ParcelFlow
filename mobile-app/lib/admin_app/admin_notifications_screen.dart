import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/notification_service.dart';
import '../shared/widgets/custom_button.dart';

class AdminNotificationsScreen extends StatefulWidget {
  const AdminNotificationsScreen({super.key});

  @override
  State<AdminNotificationsScreen> createState() => _AdminNotificationsScreenState();
}

class _AdminNotificationsScreenState extends State<AdminNotificationsScreen> {
  void _broadcastAlert() {
    final titleCtrl = TextEditingController(text: 'Hub Hours Notice');
    final msgCtrl = TextEditingController(text: 'Gate 1 hub will remain open until 10:30 PM today.');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.creamBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppColors.borderDark, width: 2)),
        title: const Text('Broadcast Society Alert', style: TextStyle(fontWeight: FontWeight.w900)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleCtrl, decoration: const InputDecoration(labelText: 'Alert Title')),
            const SizedBox(height: 10),
            TextField(controller: msgCtrl, maxLines: 3, decoration: const InputDecoration(labelText: 'Message Body')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Provider.of<NotificationService>(context, listen: false).addNotification(
                title: '📢 ${titleCtrl.text}',
                message: msgCtrl.text,
                type: 'society_alert',
              );
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Push broadcast sent to all residents!')),
              );
            },
            child: const Text('Send Broadcast'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final notifs = Provider.of<NotificationService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Notifications & Alerts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.campaign_rounded, color: AppColors.royalBlue),
            tooltip: 'Send Broadcast',
            onPressed: _broadcastAlert,
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: CustomButton(
                text: '📢 Broadcast Alert to All Residents',
                onPressed: _broadcastAlert,
                backgroundColor: AppColors.vibrantOrange,
                height: 48,
              ),
            ),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: notifs.notifications.length,
                itemBuilder: (context, index) {
                  final n = notifs.notifications[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.borderDark, width: 1.5),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(n.title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                        const SizedBox(height: 4),
                        Text(n.message, style: const TextStyle(fontSize: 12, color: AppColors.slate600)),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
