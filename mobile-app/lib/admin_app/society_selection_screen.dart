import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/theme/app_colors.dart';
import '../shared/services/auth_service.dart';
import '../shared/models/society_model.dart';

class SocietySelectionScreen extends StatelessWidget {
  final VoidCallback? onSocietySelected;

  const SocietySelectionScreen({super.key, this.onSocietySelected});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      backgroundColor: AppColors.creamBg,
      appBar: AppBar(
        title: const Text('Select Society Hub'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Managed Residential Complexes',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.darkNavy),
              ),
              const SizedBox(height: 6),
              const Text(
                'Switch between your deployed ParcelFlow gated communities:',
                style: TextStyle(fontSize: 13, color: AppColors.slate600),
              ),
              const SizedBox(height: 16),

              Expanded(
                child: ListView.builder(
                  itemCount: auth.availableSocieties.length,
                  itemBuilder: (context, index) {
                    final soc = auth.availableSocieties[index];
                    final isSelected = auth.currentSociety?.id == soc.id;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFEFF6FF) : AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected ? AppColors.royalBlue : AppColors.borderDark,
                          width: isSelected ? 2.5 : 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.borderDark,
                            offset: Offset(isSelected ? 2 : 3, isSelected ? 2 : 3),
                            blurRadius: 0,
                          ),
                        ],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        onTap: () {
                          auth.selectSociety(soc);
                          if (onSocietySelected != null) {
                            onSocietySelected!();
                          } else {
                            Navigator.pop(context);
                          }
                        },
                        leading: Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.royalBlue : AppColors.slate100,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.borderDark, width: 1.5),
                          ),
                          child: Center(
                            child: Icon(
                              Icons.location_city_rounded,
                              color: isSelected ? Colors.white : AppColors.darkNavy,
                              size: 24,
                            ),
                          ),
                        ),
                        title: Text(
                          soc.name,
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.darkNavy),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text('${soc.city} • ${soc.totalUnits} Units (${soc.totalTowers} Towers)', style: const TextStyle(fontSize: 12, color: AppColors.slate600, fontWeight: FontWeight.bold)),
                            Text(soc.hubLocation, style: const TextStyle(fontSize: 11, color: AppColors.royalBlue)),
                          ],
                        ),
                        trailing: isSelected
                            ? const Icon(Icons.check_circle, color: AppColors.royalBlue, size: 24)
                            : const Icon(Icons.chevron_right, color: AppColors.slate400),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
