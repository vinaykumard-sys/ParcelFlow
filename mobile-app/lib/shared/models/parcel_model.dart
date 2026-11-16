enum ParcelStatus {
  created,
  received,
  stored,
  notified,
  scheduled,
  readyForPickup,
  verified,
  handedOver,
  completed,
  cancelled,
  expired,
}

extension ParcelStatusExtension on ParcelStatus {
  String toDbString() {
    switch (this) {
      case ParcelStatus.created:
        return 'CREATED';
      case ParcelStatus.received:
        return 'RECEIVED';
      case ParcelStatus.stored:
        return 'STORED';
      case ParcelStatus.notified:
        return 'NOTIFIED';
      case ParcelStatus.scheduled:
        return 'SCHEDULED';
      case ParcelStatus.readyForPickup:
        return 'READY_FOR_PICKUP';
      case ParcelStatus.verified:
        return 'VERIFIED';
      case ParcelStatus.handedOver:
        return 'HANDED_OVER';
      case ParcelStatus.completed:
        return 'COMPLETED';
      case ParcelStatus.cancelled:
        return 'CANCELLED';
      case ParcelStatus.expired:
        return 'EXPIRED';
    }
  }

  static ParcelStatus fromString(String? val) {
    switch (val?.toUpperCase()) {
      case 'RECEIVED':
        return ParcelStatus.received;
      case 'STORED':
        return ParcelStatus.stored;
      case 'NOTIFIED':
        return ParcelStatus.notified;
      case 'SCHEDULED':
        return ParcelStatus.scheduled;
      case 'READY_FOR_PICKUP':
        return ParcelStatus.readyForPickup;
      case 'VERIFIED':
        return ParcelStatus.verified;
      case 'HANDED_OVER':
        return ParcelStatus.handedOver;
      case 'COMPLETED':
        return ParcelStatus.completed;
      case 'CANCELLED':
        return ParcelStatus.cancelled;
      case 'EXPIRED':
        return ParcelStatus.expired;
      case 'CREATED':
      default:
        return ParcelStatus.created;
    }
  }

  String get label {
    switch (this) {
      case ParcelStatus.created:
        return 'Incoming';
      case ParcelStatus.received:
        return 'Received';
      case ParcelStatus.stored:
        return 'In Storage';
      case ParcelStatus.notified:
        return 'Notified';
      case ParcelStatus.scheduled:
        return 'Scheduled';
      case ParcelStatus.readyForPickup:
        return 'Ready for Pickup';
      case ParcelStatus.verified:
        return 'OTP Verified';
      case ParcelStatus.handedOver:
      case ParcelStatus.completed:
        return 'Collected';
      case ParcelStatus.cancelled:
        return 'Cancelled';
      case ParcelStatus.expired:
        return 'Overdue';
    }
  }
}

class ParcelModel {
  final String id;
  final String trackingNumber;
  final String? awbBarcode;
  final String courierName;
  final String recipientName;
  final String recipientPhone;
  final String flatNumber;
  final String tower;
  final String? residentId;
  final String societyId;
  final String? storageRack;
  final ParcelStatus status;
  final DateTime receivedAt;
  final DateTime? scheduledAt;
  final String? pickupSlotTime;
  final String? otpCode;
  final String? qrPayload;
  final double? weightKg;
  final bool isPerishable;
  final String? notes;
  final DateTime? handedOverAt;
  final String? handedOverByStaff;

  ParcelModel({
    required this.id,
    required this.trackingNumber,
    this.awbBarcode,
    required this.courierName,
    required this.recipientName,
    required this.recipientPhone,
    required this.flatNumber,
    required this.tower,
    this.residentId,
    required this.societyId,
    this.storageRack,
    required this.status,
    required this.receivedAt,
    this.scheduledAt,
    this.pickupSlotTime,
    this.otpCode,
    this.qrPayload,
    this.weightKg,
    this.isPerishable = false,
    this.notes,
    this.handedOverAt,
    this.handedOverByStaff,
  });

  factory ParcelModel.fromJson(Map<String, dynamic> json) {
    return ParcelModel(
      id: json['id'] as String? ?? '',
      trackingNumber: json['tracking_number'] as String? ?? 'PF-0000',
      awbBarcode: json['awb_barcode'] as String?,
      courierName: json['courier_name'] as String? ?? 'Amazon',
      recipientName: json['recipient_name'] as String? ?? 'Resident',
      recipientPhone: json['recipient_phone'] as String? ?? '',
      flatNumber: json['flat_number'] as String? ?? '',
      tower: json['tower'] as String? ?? 'A',
      residentId: json['resident_id'] as String?,
      societyId: json['society_id'] as String? ?? '',
      storageRack: json['storage_rack'] as String?,
      status: ParcelStatusExtension.fromString(json['status'] as String?),
      receivedAt: json['received_at'] != null
          ? DateTime.tryParse(json['received_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      scheduledAt: json['scheduled_at'] != null
          ? DateTime.tryParse(json['scheduled_at'].toString())
          : null,
      pickupSlotTime: json['pickup_slot_time'] as String?,
      otpCode: json['otp_code'] as String?,
      qrPayload: json['qr_payload'] as String?,
      weightKg: (json['weight_kg'] as num?)?.toDouble(),
      isPerishable: json['is_perishable'] as bool? ?? false,
      notes: json['notes'] as String?,
      handedOverAt: json['handed_over_at'] != null
          ? DateTime.tryParse(json['handed_over_at'].toString())
          : null,
      handedOverByStaff: json['handed_over_by_staff'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tracking_number': trackingNumber,
      'awb_barcode': awbBarcode,
      'courier_name': courierName,
      'recipient_name': recipientName,
      'recipient_phone': recipientPhone,
      'flat_number': flatNumber,
      'tower': tower,
      'resident_id': residentId,
      'society_id': societyId,
      'storage_rack': storageRack,
      'status': status.toDbString(),
      'received_at': receivedAt.toIso8601String(),
      'scheduled_at': scheduledAt?.toIso8601String(),
      'pickup_slot_time': pickupSlotTime,
      'otp_code': otpCode,
      'qr_payload': qrPayload,
      'weight_kg': weightKg,
      'is_perishable': isPerishable,
      'notes': notes,
      'handed_over_at': handedOverAt?.toIso8601String(),
      'handed_over_by_staff': handedOverByStaff,
    };
  }

  ParcelModel copyWith({
    String? id,
    String? trackingNumber,
    String? awbBarcode,
    String? courierName,
    String? recipientName,
    String? recipientPhone,
    String? flatNumber,
    String? tower,
    String? residentId,
    String? societyId,
    String? storageRack,
    ParcelStatus? status,
    DateTime? receivedAt,
    DateTime? scheduledAt,
    String? pickupSlotTime,
    String? otpCode,
    String? qrPayload,
    double? weightKg,
    bool? isPerishable,
    String? notes,
    DateTime? handedOverAt,
    String? handedOverByStaff,
  }) {
    return ParcelModel(
      id: id ?? this.id,
      trackingNumber: trackingNumber ?? this.trackingNumber,
      awbBarcode: awbBarcode ?? this.awbBarcode,
      courierName: courierName ?? this.courierName,
      recipientName: recipientName ?? this.recipientName,
      recipientPhone: recipientPhone ?? this.recipientPhone,
      flatNumber: flatNumber ?? this.flatNumber,
      tower: tower ?? this.tower,
      residentId: residentId ?? this.residentId,
      societyId: societyId ?? this.societyId,
      storageRack: storageRack ?? this.storageRack,
      status: status ?? this.status,
      receivedAt: receivedAt ?? this.receivedAt,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      pickupSlotTime: pickupSlotTime ?? this.pickupSlotTime,
      otpCode: otpCode ?? this.otpCode,
      qrPayload: qrPayload ?? this.qrPayload,
      weightKg: weightKg ?? this.weightKg,
      isPerishable: isPerishable ?? this.isPerishable,
      notes: notes ?? this.notes,
      handedOverAt: handedOverAt ?? this.handedOverAt,
      handedOverByStaff: handedOverByStaff ?? this.handedOverByStaff,
    );
  }
}
