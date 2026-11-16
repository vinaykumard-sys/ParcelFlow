class HandoverTokenModel {
  final String id;
  final String parcelId;
  final String otpCode;
  final String qrToken;
  final DateTime expiresAt;
  final bool isUsed;
  final DateTime? verifiedAt;
  final String? verifiedByStaffId;

  HandoverTokenModel({
    required this.id,
    required this.parcelId,
    required this.otpCode,
    required this.qrToken,
    required this.expiresAt,
    this.isUsed = false,
    this.verifiedAt,
    this.verifiedByStaffId,
  });

  bool get isExpired => DateTime.now().isAfter(expiresAt);

  factory HandoverTokenModel.fromJson(Map<String, dynamic> json) {
    return HandoverTokenModel(
      id: json['id'] as String? ?? '',
      parcelId: json['parcel_id'] as String? ?? '',
      otpCode: json['otp_code'] as String? ?? '0000',
      qrToken: json['qr_token'] as String? ?? '',
      expiresAt: json['expires_at'] != null
          ? DateTime.tryParse(json['expires_at'].toString()) ?? DateTime.now().add(const Duration(minutes: 5))
          : DateTime.now().add(const Duration(minutes: 5)),
      isUsed: json['is_used'] as bool? ?? false,
      verifiedAt: json['verified_at'] != null ? DateTime.tryParse(json['verified_at'].toString()) : null,
      verifiedByStaffId: json['verified_by_staff_id'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'parcel_id': parcelId,
      'otp_code': otpCode,
      'qr_token': qrToken,
      'expires_at': expiresAt.toIso8601String(),
      'is_used': isUsed,
      'verified_at': verifiedAt?.toIso8601String(),
      'verified_by_staff_id': verifiedByStaffId,
    };
  }
}
