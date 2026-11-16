class NotificationModel {
  final String id;
  final String title;
  final String message;
  final String type; // parcel_arrival, pickup_reminder, handover_success, society_alert
  final DateTime createdAt;
  final bool isRead;
  final String? parcelId;

  NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.createdAt,
    this.isRead = false,
    this.parcelId,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? 'Notification',
      message: json['message'] as String? ?? '',
      type: json['type'] as String? ?? 'general',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      isRead: json['is_read'] as bool? ?? false,
      parcelId: json['parcel_id'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'created_at': createdAt.toIso8601String(),
      'is_read': isRead,
      'parcel_id': parcelId,
    };
  }
}

class IssueModel {
  final String id;
  final String parcelId;
  final String reportedByUserId;
  final String reporterName;
  final String flatNumber;
  final String issueType; // 'Damaged Box', 'Wrong Recipient', 'Missing Item', 'Staff Delayed'
  final String description;
  final String status; // 'OPEN', 'IN_PROGRESS', 'RESOLVED'
  final DateTime createdAt;
  final String? resolvedNotes;

  IssueModel({
    required this.id,
    required this.parcelId,
    required this.reportedByUserId,
    required this.reporterName,
    required this.flatNumber,
    required this.issueType,
    required this.description,
    this.status = 'OPEN',
    required this.createdAt,
    this.resolvedNotes,
  });

  factory IssueModel.fromJson(Map<String, dynamic> json) {
    return IssueModel(
      id: json['id'] as String? ?? '',
      parcelId: json['parcel_id'] as String? ?? '',
      reportedByUserId: json['reported_by_user_id'] as String? ?? '',
      reporterName: json['reporter_name'] as String? ?? 'Resident',
      flatNumber: json['flat_number'] as String? ?? '',
      issueType: json['issue_type'] as String? ?? 'General Query',
      description: json['description'] as String? ?? '',
      status: json['status'] as String? ?? 'OPEN',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      resolvedNotes: json['resolved_notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'parcel_id': parcelId,
      'reported_by_user_id': reportedByUserId,
      'reporter_name': reporterName,
      'flat_number': flatNumber,
      'issue_type': issueType,
      'description': description,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'resolved_notes': resolvedNotes,
    };
  }
}

class AuditLogModel {
  final String id;
  final String eventType;
  final String description;
  final String actorRole;
  final String actorName;
  final DateTime timestamp;
  final String? parcelTrackingNumber;

  AuditLogModel({
    required this.id,
    required this.eventType,
    required this.description,
    required this.actorRole,
    required this.actorName,
    required this.timestamp,
    this.parcelTrackingNumber,
  });

  factory AuditLogModel.fromJson(Map<String, dynamic> json) {
    return AuditLogModel(
      id: json['id'] as String? ?? '',
      eventType: json['event_type'] as String? ?? 'LOG',
      description: json['description'] as String? ?? '',
      actorRole: json['actor_role'] as String? ?? 'SYSTEM',
      actorName: json['actor_name'] as String? ?? 'Automated',
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'].toString()) ?? DateTime.now()
          : DateTime.now(),
      parcelTrackingNumber: json['parcel_tracking_number'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'event_type': eventType,
      'description': description,
      'actor_role': actorRole,
      'actor_name': actorName,
      'timestamp': timestamp.toIso8601String(),
      'parcel_tracking_number': parcelTrackingNumber,
    };
  }
}
