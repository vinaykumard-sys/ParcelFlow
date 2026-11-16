import { execSync } from 'child_process';
try {
  const out = execSync('where /r C:\\Users\\Vinay android.jar 2>nul').toString();
  console.log('Found:', out);
} catch (e) {
  console.log('No android.jar in C:\\Users\\Vinay');
}
try {
  const out2 = execSync('where /r C:\\Users\\Vinay aapt2.exe 2>nul').toString();
  console.log('Found aapt2:', out2);
} catch (e) {
  console.log('No aapt2 in C:\\Users\\Vinay');
}
