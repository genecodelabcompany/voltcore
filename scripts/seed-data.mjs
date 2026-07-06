/**
 * Seed sample data for courses, services, and enrollments.
 * Run after migration: node scripts/seed-data.mjs
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');

const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

const courses = [
  { id: 'c1', title: 'Embedded Systems with Arduino', level: 'Beginner', lessons: 12, hours: 24, price: 299, instructor: 'Eng. Kwame Asante', glyph: 'board', cert: 1, description: 'Learn Arduino programming, sensors, and actuators from scratch.', status: 'published' },
  { id: 'c2', title: 'PCB Design Masterclass', level: 'Intermediate', lessons: 18, hours: 36, price: 499, instructor: 'Dr. Akosua Mensah', glyph: 'board', cert: 1, description: 'Design professional PCBs using KiCad and Altium.', status: 'published' },
  { id: 'c3', title: 'IoT & Wireless Communications', level: 'Advanced', lessons: 15, hours: 30, price: 599, instructor: 'Eng. Yaw Boateng', glyph: 'wifi', cert: 1, description: 'Build IoT systems with ESP32, LoRa, and MQTT.', status: 'published' },
  { id: 'c4', title: 'Power Electronics Fundamentals', level: 'Intermediate', lessons: 10, hours: 20, price: 349, instructor: 'Dr. Esi Nyarko', glyph: 'zap', cert: 1, description: 'Understand converters, inverters, and power supplies.', status: 'published' },
  { id: 'c5', title: 'Robotics & Automation', level: 'Advanced', lessons: 20, hours: 40, price: 799, instructor: 'Eng. Nana Osei', glyph: 'bot', cert: 1, description: 'Build and program autonomous robots.', status: 'draft' },
];

const services = [
  { id: 's1', name: 'pcb-design', title: 'PCB Design & Layout', from_price: 500, eta: '3-5 days', glyph: 'tool', icon: '🔧', description: 'Professional PCB design using industry-standard tools.', status: 'active', sort_order: 1 },
  { id: 's2', name: 'prototyping', title: 'Rapid Prototyping', from_price: 200, eta: '1-2 days', glyph: 'tool', icon: '⚡', description: 'Fast turnaround prototyping for your electronic projects.', status: 'active', sort_order: 2 },
  { id: 's3', name: 'iot-development', title: 'IoT System Development', from_price: 1500, eta: '2-4 weeks', glyph: 'tool', icon: '📡', description: 'End-to-end IoT solutions from sensor to cloud.', status: 'active', sort_order: 3 },
  { id: 's4', name: 'automation', title: 'Industrial Automation', from_price: 3000, eta: '4-8 weeks', glyph: 'tool', icon: '🏭', description: 'PLC programming, SCADA systems, and process automation.', status: 'active', sort_order: 4 },
  { id: 's5', name: 'consulting', title: 'Engineering Consulting', from_price: 100, eta: '1 hour', glyph: 'tool', icon: '💡', description: 'Expert advice on electronics and embedded systems.', status: 'active', sort_order: 5 },
];

const enrollments = [
  { id: 'e1', course_id: 'c1', student_name: 'Kwame Mensah', student_email: 'kwame@example.com', amount: 299, progress: 75 },
  { id: 'e2', course_id: 'c1', student_name: 'Akosua Boateng', student_email: 'akosua@example.com', amount: 299, progress: 40 },
  { id: 'e3', course_id: 'c2', student_name: 'Yaw Asante', student_email: 'yaw@example.com', amount: 499, progress: 20 },
  { id: 'e4', course_id: 'c2', student_name: 'Esi Nyarko', student_email: 'esi@example.com', amount: 499, progress: 100 },
  { id: 'e5', course_id: 'c3', student_name: 'Nana Osei', student_email: 'nana@example.com', amount: 599, progress: 10 },
  { id: 'e6', course_id: 'c3', student_name: 'Adwoa Sarpong', student_email: 'adwoa@example.com', amount: 599, progress: 60 },
  { id: 'e7', course_id: 'c4', student_name: 'Kofi Annan', student_email: 'kofi@example.com', amount: 349, progress: 100 },
  { id: 'e8', course_id: 'c4', student_name: 'Ama Serwaa', student_email: 'ama@example.com', amount: 349, progress: 30 },
];

async function seed() {
  console.log('📚 Seeding courses...');
  for (const c of courses) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO courses (id, title, level, lessons, hours, price, enrolled, rating, instructor, glyph, cert, description, status)
            VALUES (?, ?, ?, ?, ?, ?, 0, 4.5, ?, ?, ?, ?, ?)`,
      args: [c.id, c.title, c.level, c.lessons, c.hours, c.price, c.instructor, c.glyph, c.cert, c.description, c.status],
    });
  }
  console.log(`   ${courses.length} courses seeded`);

  console.log('🔧 Seeding services...');
  for (const s of services) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO services (id, name, title, from_price, eta, glyph, icon, description, status, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [s.id, s.name, s.title, s.from_price, s.eta, s.glyph, s.icon, s.description, s.status, s.sort_order],
    });
  }
  console.log(`   ${services.length} services seeded`);

  console.log('📝 Seeding enrollments...');
  for (const e of enrollments) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO enrollments (id, course_id, student_name, student_email, amount, progress)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [e.id, e.course_id, e.student_name, e.student_email, e.amount, e.progress],
    });
    // Update enrolled count on course
    await db.execute({
      sql: `UPDATE courses SET enrolled = enrolled + 1 WHERE id = ?`,
      args: [e.course_id],
    });
  }
  console.log(`   ${enrollments.length} enrollments seeded`);

  console.log('\n✅ Seed complete!');
}

seed().catch(e => { console.error(e); process.exit(1); });
