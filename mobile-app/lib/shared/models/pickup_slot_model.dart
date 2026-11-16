class PickupSlotModel {
  final String id;
  final String societyId;
  final String startTime; // e.g. "17:00" or "5:00 PM"
  final String endTime;   // e.g. "17:30" or "5:30 PM"
  final String displayLabel; // e.g. "Early Evening Slot"
  final int capacity;
  final int bookedCount;
  final bool isAvailable;

  PickupSlotModel({
    required this.id,
    required this.societyId,
    required this.startTime,
    required this.endTime,
    required this.displayLabel,
    this.capacity = 15,
    this.bookedCount = 0,
    this.isAvailable = true,
  });

  int get spotsRemaining => (capacity - bookedCount).clamp(0, capacity);

  factory PickupSlotModel.fromJson(Map<String, dynamic> json) {
    return PickupSlotModel(
      id: json['id'] as String? ?? '',
      societyId: json['society_id'] as String? ?? '',
      startTime: json['start_time'] as String? ?? '18:00',
      endTime: json['end_time'] as String? ?? '18:30',
      displayLabel: json['display_label'] as String? ?? 'Standard Slot',
      capacity: (json['capacity'] as num?)?.toInt() ?? 15,
      bookedCount: (json['booked_count'] as num?)?.toInt() ?? 0,
      isAvailable: json['is_available'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'society_id': societyId,
      'start_time': startTime,
      'end_time': endTime,
      'display_label': displayLabel,
      'capacity': capacity,
      'booked_count': bookedCount,
      'is_available': isAvailable,
    };
  }
}
