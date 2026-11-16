import 'package:flutter/material.dart';
import '../models/issue_model.dart';

class NotificationService extends ChangeNotifier {
  List<NotificationModel> _notifications = [];

  List<NotificationModel> get notifications => _notifications;
  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  NotificationService() {
    _loadInitialNotifications();
  }

  void _loadInitialNotifications() {
    final now = DateTime.now();
    _notifications = [
      NotificationModel(
        id: 'notif-1',
        title: '📦 Parcel Ready for Pickup',
        message: 'Your Amazon package (PF-8921-IN) is stored in Rack A-12. Please schedule or collect during hub hours.',
        type: 'parcel_arrival',
        createdAt: now.subtract(const Duration(minutes: 25)),
        isRead: false,
        parcelId: 'pcl-8921',
      ),
      NotificationModel(
        id: 'notif-2',
        title: '⏰ Pickup Slot Confirmed',
        message: 'Your slot for tonight 8:00 PM – 8:30 PM is confirmed. Use OTP or QR code at Gate 1 hub.',
        type: 'pickup_reminder',
        createdAt: now.subtract(const Duration(hours: 1)),
        isRead: false,
        parcelId: 'pcl-8921',
      ),
      NotificationModel(
        id: 'notif-3',
        title: '✨ Handover Successful',
        message: 'Parcel PF-8924-IN was collected by Sneha Iyer. Verified by Hub Staff Ramesh K.',
        type: 'handover_success',
        createdAt: now.subtract(const Duration(hours: 2)),
        isRead: true,
        parcelId: 'pcl-8924',
      ),
      NotificationModel(
        id: 'notif-4',
        title: '📢 Society Hub Notice',
        message: 'Hub hours extended until 10:30 PM this festive week for smooth festival deliveries.',
        type: 'society_alert',
        createdAt: now.subtract(const Duration(days: 1)),
        isRead: true,
      ),
    ];
  }

  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      final notif = _notifications[index];
      _notifications[index] = NotificationModel(
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        createdAt: notif.createdAt,
        isRead: true,
        parcelId: notif.parcelId,
      );
      notifyListeners();
    }
  }

  void markAllAsRead() {
    _notifications = _notifications.map((n) {
      return NotificationModel(
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        createdAt: n.createdAt,
        isRead: true,
        parcelId: n.parcelId,
      );
    }).toList();
    notifyListeners();
  }

  void addNotification({
    required String title,
    required String message,
    required String type,
    String? parcelId,
  }) {
    _notifications.insert(
      0,
      NotificationModel(
        id: 'notif-${DateTime.now().millisecondsSinceEpoch}',
        title: title,
        message: message,
        type: type,
        createdAt: DateTime.now(),
        isRead: false,
        parcelId: parcelId,
      ),
    );
    notifyListeners();
  }
}
