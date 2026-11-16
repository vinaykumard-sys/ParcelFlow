enum UserRole {
  resident,
  staff,
  admin,
}

extension UserRoleExtension on UserRole {
  String toDbString() {
    switch (this) {
      case UserRole.resident:
        return 'RESIDENT';
      case UserRole.staff:
        return 'STAFF';
      case UserRole.admin:
        return 'ADMIN';
    }
  }

  static UserRole fromString(String? role) {
    switch (role?.toUpperCase()) {
      case 'STAFF':
        return UserRole.staff;
      case 'ADMIN':
        return UserRole.admin;
      case 'RESIDENT':
      default:
        return UserRole.resident;
    }
  }

  String get displayName {
    switch (this) {
      case UserRole.resident:
        return 'Resident';
      case UserRole.staff:
        return 'Hub Staff';
      case UserRole.admin:
        return 'Society Admin';
    }
  }
}

class UserModel {
  final String id;
  final String email;
  final String fullName;
  final String phone;
  final UserRole role;
  final String societyId;
  final String? societyName;
  final String? flatNumber;
  final String? tower;
  final String? staffShift;
  final bool isVerified;

  UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    required this.phone,
    required this.role,
    required this.societyId,
    this.societyName,
    this.flatNumber,
    this.tower,
    this.staffShift,
    this.isVerified = true,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String? ?? '',
      email: json['email'] as String? ?? '',
      fullName: json['full_name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      role: UserRoleExtension.fromString(json['role'] as String?),
      societyId: json['society_id'] as String? ?? '',
      societyName: json['society_name'] as String?,
      flatNumber: json['flat_number'] as String?,
      tower: json['tower'] as String?,
      staffShift: json['staff_shift'] as String?,
      isVerified: json['is_verified'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'phone': phone,
      'role': role.toDbString(),
      'society_id': societyId,
      'society_name': societyName,
      'flat_number': flatNumber,
      'tower': tower,
      'staff_shift': staffShift,
      'is_verified': isVerified,
    };
  }

  UserModel copyWith({
    String? id,
    String? email,
    String? fullName,
    String? phone,
    UserRole? role,
    String? societyId,
    String? societyName,
    String? flatNumber,
    String? tower,
    String? staffShift,
    bool? isVerified,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      societyId: societyId ?? this.societyId,
      societyName: societyName ?? this.societyName,
      flatNumber: flatNumber ?? this.flatNumber,
      tower: tower ?? this.tower,
      staffShift: staffShift ?? this.staffShift,
      isVerified: isVerified ?? this.isVerified,
    );
  }
}
