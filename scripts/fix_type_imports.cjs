const fs = require('fs');

const files = [
  'src/mobile/components/RoleSwitcherModal.tsx',
  'src/mobile/resident/ResidentApp.tsx',
  'src/mobile/resident/ResidentCollectedSuccess.tsx',
  'src/mobile/resident/ResidentDashboard.tsx',
  'src/mobile/resident/ResidentHistoryTab.tsx',
  'src/mobile/resident/ResidentParcelDetails.tsx',
  'src/mobile/resident/ResidentParcelsTab.tsx',
  'src/mobile/resident/ResidentPickupCode.tsx',
  'src/mobile/resident/ResidentSchedulePickup.tsx',
  'src/mobile/staff/StaffApp.tsx',
  'src/mobile/staff/StaffAssignResident.tsx',
  'src/mobile/staff/StaffFindResidentTab.tsx',
  'src/mobile/staff/StaffHandoverComplete.tsx',
  'src/mobile/staff/StaffHandoverVerification.tsx',
  'src/mobile/staff/StaffParcelsTab.tsx',
  'src/mobile/staff/StaffStorageLocation.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+(['"]\.\.?\/types['"])/g, 'import type { $1 } from $2');
    fs.writeFileSync(f, content);
    console.log('Fixed', f);
  }
});
