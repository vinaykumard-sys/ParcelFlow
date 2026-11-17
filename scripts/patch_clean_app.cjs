const fs = require('fs');
const path = require('path');

// 1. StaffHandoverComplete.tsx
{
  const file = 'src/mobile/staff/StaffHandoverComplete.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('<span>Verified By: Ramesh K (Security)</span>', '<span>Verified By: On-Duty Hub Staff</span>');
  fs.writeFileSync(file, c, 'utf8');
  console.log('1. Updated StaffHandoverComplete.tsx');
}

// 2. StaffProfileTab.tsx
{
  const file = 'src/mobile/staff/StaffProfileTab.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('Ramesh K', 'Hub Staff Operator');
  c = c.replace('+91 98450 12345', '+91 98000 00000');
  fs.writeFileSync(file, c, 'utf8');
  console.log('2. Updated StaffProfileTab.tsx');
}

// 3. StaffSplashAndLogin.tsx
{
  const file = 'src/mobile/staff/StaffSplashAndLogin.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace("const [email, setEmail] = useState('staff@parcelflow.in');", "const [email, setEmail] = useState('');");
  c = c.replace("const [password, setPassword] = useState('••••••••');", "const [password, setPassword] = useState('');");
  
  // Remove Quick Demo Staff Card
  const demoCardStart = c.indexOf('{/* Quick Demo Staff Card */}');
  if (demoCardStart !== -1) {
    const demoCardEnd = c.indexOf('</div>', c.indexOf('</button>', demoCardStart)) + 6;
    c = c.substring(0, demoCardStart) + c.substring(demoCardEnd);
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log('3. Updated StaffSplashAndLogin.tsx');
}

// 4. StaffDashboard.tsx
{
  const file = 'src/mobile/staff/StaffDashboard.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('Good Morning, Ramesh 👋', 'Good Day, Hub Staff 👋');
  c = c.replace(
    '<div className="text-2xl font-black text-[#060D1E]">24</div>',
    '<div className="text-2xl font-black text-[#060D1E]">{parcels.length}</div>'
  );
  c = c.replace(
    '<div className="text-2xl font-black text-[#060D1E]">12</div>',
    '<div className="text-2xl font-black text-[#060D1E]">{parcels.filter(p => p.status === \'WAITING\').length}</div>'
  );
  c = c.replace(
    '<div className="text-2xl font-black text-[#060D1E]">8</div>',
    '<div className="text-2xl font-black text-[#060D1E]">{parcels.filter(p => p.status === \'SCHEDULED\').length}</div>'
  );
  c = c.replace(
    '<div className="text-2xl font-black text-[#060D1E]">4</div>',
    '<div className="text-2xl font-black text-[#060D1E]">{parcels.filter(p => p.status === \'COLLECTED\').length}</div>'
  );
  c = c.replace('24 in inventory', "{parcels.length} in inventory");
  fs.writeFileSync(file, c, 'utf8');
  console.log('4. Updated StaffDashboard.tsx');
}

// 5. StaffAssignResident.tsx
{
  const file = 'src/mobile/staff/StaffAssignResident.tsx';
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('No matching residents in directory')) {
    const marker = '{filtered.map((resident) => {';
    const idx = c.indexOf(marker);
    if (idx !== -1) {
      const endMarker = '          </div>\n      </div>\n\n      {/* Sticky Bottom Next Button */}';
      const beforeList = c.substring(0, idx);
      const afterList = c.substring(c.indexOf('          })', idx) + 12);
      const listContent = c.substring(idx, c.indexOf('          })', idx) + 12);
      
      const newContent = `{filtered.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center">
              <User className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No matching residents in directory</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Add residents via Admin Portal or ask resident to sign up.
              </p>
            </div>
          ) : (
            ${listContent}
          )}`;
      
      c = beforeList + newContent + afterList;
      fs.writeFileSync(file, c, 'utf8');
      console.log('5. Updated StaffAssignResident.tsx');
    }
  }
}

// 6. ResidentLogin.tsx
{
  const file = 'src/mobile/resident/ResidentLogin.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace("const [phone, setPhone] = useState('+91 98765 00000');", "const [phone, setPhone] = useState('');");
  c = c.replace("const [email, setEmail] = useState('vinaykumard45678@gmail.com');", "const [email, setEmail] = useState('');");
  c = c.replace("const [password, setPassword] = useState('••••••••');", "const [password, setPassword] = useState('');");
  
  // Remove Quick Demo Switcher Card
  const demoCardStart = c.indexOf('{/* Quick Demo Switcher Card */}');
  if (demoCardStart !== -1) {
    const demoCardEnd = c.indexOf('</div>', c.indexOf('</button>', demoCardStart)) + 6;
    c = c.substring(0, demoCardStart) + c.substring(demoCardEnd);
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log('6. Updated ResidentLogin.tsx');
}

// 7. ResidentDashboard.tsx
{
  const file = 'src/mobile/resident/ResidentDashboard.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('Good Evening, Vinay 👋', 'Good Day 👋');
  c = c.replace('const collectedCount = 12; // Matches prompt requirement "12 Collected"', 'const collectedCount = residentParcels.filter((p) => p.status === \'COLLECTED\').length;');
  
  // If residentParcels is empty, show empty state instead of empty list
  const listMarker = '<div className="space-y-3">\n            {residentParcels';
  if (c.includes(listMarker)) {
    c = c.replace(
      listMarker,
      `<div className="space-y-3">
            {residentParcels.filter((p) => p.status !== 'COLLECTED').length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-300 text-center">
                <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-black text-[#060D1E]">No Parcels Waiting</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  You are all caught up! When courier deliveries arrive at the society hub, they will appear here.
                </p>
              </div>
            ) : null}
            {residentParcels`
    );
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log('7. Updated ResidentDashboard.tsx');
}

// 8. ResidentHistoryTab.tsx
{
  const file = 'src/mobile/resident/ResidentHistoryTab.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('12 successfully collected parcels', '{collected.length} successfully collected parcels');
  
  // Remove older hardcoded historical sample
  const olderStart = c.indexOf('{/* Older Historical Items Sample */}');
  if (olderStart !== -1) {
    const olderEnd = c.indexOf('</div>', c.indexOf('ChevronRight', olderStart)) + 6;
    c = c.substring(0, olderStart) + c.substring(olderEnd);
  }
  
  // Wrap list with empty check
  if (!c.includes('No collection history yet')) {
    c = c.replace(
      '<div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">\n        {collected.map((p) => (',
      `<div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {collected.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-300 text-center">
            <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-black text-[#060D1E]">No Pickup History Yet</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Parcels collected from the hub will be logged in this secure audit timeline.
            </p>
          </div>
        ) : null}
        {collected.map((p) => (`
    );
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log('8. Updated ResidentHistoryTab.tsx');
}

// 9. AdminDashboard.tsx
{
  const file = 'src/mobile/admin/AdminDashboard.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('<div className="text-2xl font-black text-[#060D1E]">112</div>', '<div className="text-2xl font-black text-[#060D1E]">{report.totalParcels}</div>');
  c = c.replace('<div className="text-2xl font-black text-[#060D1E]">61</div>', '<div className="text-2xl font-black text-[#060D1E]">{report.collected}</div>');
  c = c.replace('<div className="text-2xl font-black text-[#060D1E]">18</div>', '<div className="text-2xl font-black text-[#060D1E]">{report.scheduled}</div>');
  c = c.replace('<div className="text-2xl font-black text-[#060D1E]">33</div>', '<div className="text-2xl font-black text-[#060D1E]">{report.pending}</div>');
  fs.writeFileSync(file, c, 'utf8');
  console.log('9. Updated AdminDashboard.tsx');
}

// 10. AdminManageTab.tsx
{
  const file = 'src/mobile/admin/AdminManageTab.tsx';
  let c = fs.readFileSync(file, 'utf8');
  
  // Empty state for residents
  if (!c.includes('No registered residents found')) {
    c = c.replace(
      '<div className="space-y-2.5">\n              {residents.map((r) => (',
      `<div className="space-y-2.5">
              {residents.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No registered residents found</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click "+ Add Resident" above to create a resident record.
                  </p>
                </div>
              ) : null}
              {residents.map((r) => (`
    );
  }
  
  // Empty state for staff
  if (!c.includes('No staff members assigned yet')) {
    c = c.replace(
      '<div className="space-y-2.5">\n              {staff.map((s) => (',
      `<div className="space-y-2.5">
              {staff.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center">
                  <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No staff members assigned yet</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click "+ Add Staff" above to authorize hub and security personnel.
                  </p>
                </div>
              ) : null}
              {staff.map((s) => (`
    );
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log('10. Updated AdminManageTab.tsx');
}

console.log('ALL COMPONENT PATCHES COMPLETED CLEANLY!');
