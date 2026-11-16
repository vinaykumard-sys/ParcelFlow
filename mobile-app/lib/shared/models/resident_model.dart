class ResidentModel {
  final String id;
  final String userId;
  final String fullName;
  final String phone;
  final String flatNumber;
  final String tower;
  final String societyId;
  final bool isOwner;
  final int activeParcelsCount;
  final List<AuthorizedCollector> authorizedCollectors;

  ResidentModel({
    required this.id,
    required this.userId,
    required this.fullName,
    required this.phone,
    required this.flatNumber,
    required this.tower,
    required this.societyId,
    this.isOwner = true,
    this.activeParcelsCount = 0,
    this.authorizedCollectors = const [],
  });

  factory ResidentModel.fromJson(Map<String, dynamic> json) {
    var rawCollectors = json['authorized_collectors'] as List<dynamic>? ?? [];
    List<AuthorizedCollector> collectors = rawCollectors
        .map((c) => AuthorizedCollector.fromJson(c as Map<String, dynamic>))
        .toList();

    return ResidentModel(
      id: json['id'] as String? ?? '',
      userId: json['user_id'] as String? ?? '',
      fullName: json['full_name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      flatNumber: json['flat_number'] as String? ?? '',
      tower: json['tower'] as String? ?? '',
      societyId: json['society_id'] as String? ?? '',
      isOwner: json['is_owner'] as bool? ?? true,
      activeParcelsCount: (json['active_parcels_count'] as num?)?.toInt() ?? 0,
      authorizedCollectors: collectors,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'full_name': fullName,
      'phone': phone,
      'flat_number': flatNumber,
      'tower': tower,
      'society_id': societyId,
      'is_owner': isOwner,
      'active_parcels_count': activeParcelsCount,
      'authorized_collectors': authorizedCollectors.map((c) => c.toJson()).toList(),
    };
  }
}

class AuthorizedCollector {
  final String id;
  final String name;
  final String relationship; // e.g. 'Spouse', 'House Help', 'Child', 'Friend'
  final String phone;
  final bool hasQrAccess;

  AuthorizedCollector({
    required this.id,
    required this.name,
    required this.relationship,
    required this.phone,
    this.hasQrAccess = true,
  });

  factory AuthorizedCollector.fromJson(Map<String, dynamic> json) {
    return AuthorizedCollector(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      relationship: json['relationship'] as String? ?? 'Family Member',
      phone: json['phone'] as String? ?? '',
      hasQrAccess: json['has_qr_access'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'relationship': relationship,
      'phone': phone,
      'has_qr_access': hasQrAccess,
    };
  }
}
