import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const pkgPath = resolve('package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const dateStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}`;
// 格式: 3.0.202605101420 (3.0.日期时间)
const newVersion = `3.0.${dateStr}${timeStr}`;

pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`🔖 version → ${newVersion}`);
