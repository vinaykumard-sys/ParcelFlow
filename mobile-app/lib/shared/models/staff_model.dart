class StaffModel {
  final String id;
  final String userId;
  final String fullName;
  final String phone;
  final String staffIdCode;
  final String shift; // Morning, Evening, Night
  final String department; // Security, Hub Operator, Facility
  final String societyId;
  final bool isActive;
  final int totalHandedOverToday;

  StaffModel({
    required this.id,
    required this.userId,
    required this.fullName,
    required this.phone,
    required this.staffIdCode,
    required this.shift,
    required this.department,
    required this.societyId,
    this.isActive = true,
    this.totalHandedOverToday = 0,
  });

  factory StaffModel.fromJson(Map<String, dynamic> json) {
    return StaffModel(
      id: json['id'] as String? ?? '',
      userId: json['user_id'] as String? ?? '',
      fullName: json['full_name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      staffIdCode: json['staff_id_code'] as String? ?? 'STF-01',
      shift: json['shift'] as String? ?? 'Morning',
      department: json['department'] as String? ?? 'Hub Operator',
      societyId: json['society_id'] as String? ?? '',
      isActive: json['is_active'] as bool? ?? true,
      totalHandedOverToday: (json['total_handed_over_today'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'full_name': fullName,
      'phone': phone,
      'staff_id_code': staffIdCode,
      'shift': shift,
      'department': department,
      'society_id': societyId,
      'is_active': isActive,
      'total_handed_over_today': totalHandedOverToday,
    };
  }
}
