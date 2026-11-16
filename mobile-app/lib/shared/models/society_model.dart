class SocietyModel {
  final String id;
  final String name;
  final String city;
  final String address;
  final int totalUnits;
  final int totalTowers;
  final String hubLocation;
  final bool isActive;

  SocietyModel({
    required this.id,
    required this.name,
    required this.city,
    required this.address,
    required this.totalUnits,
    required this.totalTowers,
    required this.hubLocation,
    this.isActive = true,
  });

  factory SocietyModel.fromJson(Map<String, dynamic> json) {
    return SocietyModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      city: json['city'] as String? ?? '',
      address: json['address'] as String? ?? '',
      totalUnits: (json['total_units'] as num?)?.toInt() ?? 0,
      totalTowers: (json['total_towers'] as num?)?.toInt() ?? 0,
      hubLocation: json['hub_location'] as String? ?? 'Gate 1 Hub',
      isActive: json['is_active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'city': city,
      'address': address,
      'total_units': totalUnits,
      'total_towers': totalTowers,
      'hub_location': hubLocation,
      'is_active': isActive,
    };
  }
}
