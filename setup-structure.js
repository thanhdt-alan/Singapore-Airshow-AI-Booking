const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();

// 1. Tạo Frontend bằng Vite (nếu chưa có)
if (!fs.existsSync(path.join(rootDir, 'frontend'))) {
  console.log('Creating Vite React App...');
  try {
    // Tạo vite app
    execSync('npm create vite@latest frontend -- --template react-ts', { stdio: 'inherit' });
  } catch (e) {
    console.error('Error creating vite app. Make sure you have npm installed.');
  }
}

// 2. Danh sách các thư mục cần tạo thêm trong frontend/src
const frontendDirs = [
  'frontend/src/assets',
  'frontend/src/components/auth',
  'frontend/src/components/chat',
  'frontend/src/components/booking',
  'frontend/src/components/profile',
  'frontend/src/components/matchmaking',
  'frontend/src/components/layout',
  'frontend/src/contexts',
  'frontend/src/hooks',
  'frontend/src/lib',
  'frontend/src/pages',
  'frontend/src/services',
  'frontend/src/types',
];

// 3. Danh sách các file rỗng cần tạo (placeholder)
const filesToCreate = [
  'frontend/.env.local',
  'frontend/src/contexts/AuthContext.tsx',
  'frontend/src/hooks/useRealtime.ts',
  'frontend/src/hooks/useProfile.ts',
  'frontend/src/lib/supabase.ts',
  'frontend/src/pages/LandingPage.tsx',
  'frontend/src/pages/Dashboard.tsx',
  'frontend/src/pages/MatchmakingPage.tsx',
  'frontend/src/pages/SchedulePage.tsx',
  'frontend/src/services/aiService.ts',
  'frontend/src/services/bookingService.ts',
  'frontend/src/services/profileService.ts',
  'frontend/src/types/index.ts',
  '.gitignore',
  'README.md'
];

// 4. Cấu trúc Backend Supabase
const supabaseDirs = [
  'supabase/functions/airshow-api',
  'supabase/migrations'
];

const supabaseFiles = [
  'supabase/config.toml',
  'supabase/seed.sql',
  'supabase/functions/airshow-api/index.ts',
  'supabase/functions/airshow-api/.env',
  'supabase/migrations/20250220_init_schema.sql'
];

// --- THỰC THI ---

console.log('Scaffolding directories...');

// Tạo folder frontend
frontendDirs.forEach(dir => {
  fs.mkdirSync(path.join(rootDir, dir), { recursive: true });
});

// Tạo folder backend
supabaseDirs.forEach(dir => {
  fs.mkdirSync(path.join(rootDir, dir), { recursive: true });
});

console.log('Creating placeholder files...');

// Tạo file frontend & root
filesToCreate.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '// Placeholder content');
  }
});

// Tạo file backend
supabaseFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '-- Placeholder content');
  }
});

console.log('✅ DONE! Directory structure created successfully.');
console.log('👉 Next step: cd frontend && npm install');