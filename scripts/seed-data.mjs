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

const categories = [
  { id: 'arduino', name: 'Arduino', slug: 'arduino', color: '#00979D', icon: '🔵', sort_order: 1 },
  { id: 'raspberry-pi', name: 'Raspberry Pi', slug: 'raspberry-pi', color: '#A22846', icon: '🍓', sort_order: 2 },
  { id: 'sensors', name: 'Sensors & Modules', slug: 'sensors', color: '#6B21A8', icon: '📡', sort_order: 3 },
  { id: 'tools', name: 'Tools & Equipment', slug: 'tools', color: '#D97706', icon: '🔧', sort_order: 4 },
  { id: 'components', name: 'Components', slug: 'components', color: '#059669', icon: '⚡', sort_order: 5 },
  { id: 'robotics', name: 'Robotics', slug: 'robotics', color: '#DC2626', icon: '🤖', sort_order: 6 },
  { id: 'iot', name: 'IoT & Wireless', slug: 'iot', color: '#2563EB', icon: '📶', sort_order: 7 },
  { id: 'power', name: 'Power & Batteries', slug: 'power', color: '#D97706', icon: '🔋', sort_order: 8 },
];

const products = [
  { id: 'p1', name: 'Arduino Uno R3', cat_id: 'arduino', price: 129.99, was: 149.99, sku: 'VC-ARDUINO-001', brand: 'Arduino', badge: 'Bestseller', description: 'The classic Arduino Uno R3 development board. Perfect for beginners and professionals alike. Features ATmega328P microcontroller, 14 digital I/O pins, 6 analog inputs, USB connection, and ICSP header.', glyph: 'chip', stock: 45, sold: 320, rating: 4.8, reviews: 156, status: 'published' },
  { id: 'p2', name: 'Arduino Nano', cat_id: 'arduino', price: 79.99, was: null, sku: 'VC-ARDUINO-002', brand: 'Arduino', badge: 'Popular', description: 'Compact breadboard-friendly version of the Arduino Uno. Based on the ATmega328P, it offers the same connectivity in a smaller footprint.', glyph: 'chip', stock: 78, sold: 210, rating: 4.7, reviews: 98, status: 'published' },
  { id: 'p3', name: 'Arduino Mega 2560', cat_id: 'arduino', price: 199.99, was: 229.99, sku: 'VC-ARDUINO-003', brand: 'Arduino', badge: null, description: 'High-end Arduino board with 54 digital I/O pins, 16 analog inputs, and 256KB flash memory. Ideal for complex projects like 3D printers and robotics.', glyph: 'chip', stock: 23, sold: 87, rating: 4.9, reviews: 64, status: 'published' },
  { id: 'p4', name: 'Raspberry Pi 5 — 4GB', cat_id: 'raspberry-pi', price: 349.99, was: 399.99, sku: 'VC-RPI-005', brand: 'Raspberry Pi', badge: 'New', description: 'Latest Raspberry Pi 5 single-board computer with 4GB RAM. Features 2.4GHz quad-core processor, dual 4K HDMI output, USB 3.0, and PCIe 2.0.', glyph: 'board', stock: 15, sold: 45, rating: 4.9, reviews: 32, status: 'published' },
  { id: 'p5', name: 'Raspberry Pi 5 — 8GB', cat_id: 'raspberry-pi', price: 449.99, was: null, sku: 'VC-RPI-006', brand: 'Raspberry Pi', badge: 'New', description: 'High-memory variant of the Raspberry Pi 5 with 8GB RAM for memory-intensive applications like AI/ML inference and data processing.', glyph: 'board', stock: 10, sold: 28, rating: 5.0, reviews: 18, status: 'published' },
  { id: 'p6', name: 'Raspberry Pi Pico W', cat_id: 'raspberry-pi', price: 49.99, was: null, sku: 'VC-RPI-007', brand: 'Raspberry Pi', badge: 'Popular', description: 'Microcontroller board with built-in WiFi. Powered by RP2040 chip, perfect for IoT projects and embedded applications.', glyph: 'chip', stock: 120, sold: 180, rating: 4.6, reviews: 73, status: 'published' },
  { id: 'p7', name: 'HC-SR04 Ultrasonic Sensor', cat_id: 'sensors', price: 12.99, was: null, sku: 'VC-SENS-001', brand: 'VoltCore', badge: null, description: 'Popular ultrasonic distance sensor module. Measures distances from 2cm to 400cm with 3mm accuracy. Ideal for obstacle avoidance and distance measurement.', glyph: 'sensor', stock: 200, sold: 450, rating: 4.5, reviews: 210, status: 'published' },
  { id: 'p8', name: 'DHT22 Temperature & Humidity Sensor', cat_id: 'sensors', price: 18.99, was: 22.99, sku: 'VC-SENS-002', brand: 'Aosong', badge: null, description: 'High-precision digital temperature and humidity sensor. Range: -40°C to 80°C, 0-100% RH with ±0.5°C and ±2% RH accuracy.', glyph: 'sensor', stock: 85, sold: 190, rating: 4.6, reviews: 88, status: 'published' },
  { id: 'p9', name: 'MPU6050 Accelerometer + Gyroscope', cat_id: 'sensors', price: 24.99, was: null, sku: 'VC-SENS-003', brand: 'InvenSense', badge: 'Popular', description: '6-axis motion tracking module combining 3-axis accelerometer and 3-axis gyroscope. I2C interface, ideal for robotics and motion sensing.', glyph: 'sensor', stock: 60, sold: 145, rating: 4.7, reviews: 67, status: 'published' },
  { id: 'p10', name: 'Soldering Station — 60W Adjustable', cat_id: 'tools', price: 159.99, was: 189.99, sku: 'VC-TOOL-001', brand: 'VoltCore', badge: 'Bestseller', description: 'Professional 60W soldering station with adjustable temperature control (200°C–480°C). Includes stand, sponge, and 5 replacement tips.', glyph: 'tool', stock: 30, sold: 95, rating: 4.7, reviews: 42, status: 'published' },
  { id: 'p11', name: 'Digital Multimeter — Auto-Ranging', cat_id: 'tools', price: 89.99, was: null, sku: 'VC-TOOL-002', brand: 'VoltCore', badge: null, description: 'Auto-ranging digital multimeter with AC/DC voltage, current, resistance, capacitance, and continuity testing. Backlit LCD display.', glyph: 'tool', stock: 40, sold: 78, rating: 4.5, reviews: 34, status: 'published' },
  { id: 'p12', name: 'Precision Screwdriver Kit — 30-Piece', cat_id: 'tools', price: 45.99, was: 55.99, sku: 'VC-TOOL-003', brand: 'VoltCore', badge: null, description: 'Precision screwdriver set with 30 magnetic bits. Includes Phillips, flathead, Torx, hex, and specialty bits for electronics repair.', glyph: 'tool', stock: 55, sold: 112, rating: 4.4, reviews: 29, status: 'published' },
  { id: 'p13', name: 'Resistor Kit — 1/4W (500 pcs)', cat_id: 'components', price: 19.99, was: null, sku: 'VC-COMP-001', brand: 'VoltCore', badge: null, description: 'Assorted 1/4W carbon film resistor kit with 50 values from 10Ω to 1MΩ. 10 pieces per value, total 500 pieces. Includes storage box.', glyph: 'chip', stock: 100, sold: 280, rating: 4.8, reviews: 95, status: 'published' },
  { id: 'p14', name: 'Capacitor Kit — Electrolytic (200 pcs)', cat_id: 'components', price: 24.99, was: null, sku: 'VC-COMP-002', brand: 'VoltCore', badge: null, description: 'Assorted electrolytic capacitor kit with 20 values from 1µF to 1000µF. 10 pieces per value, total 200 pieces. Ideal for prototyping.', glyph: 'chip', stock: 75, sold: 165, rating: 4.6, reviews: 52, status: 'published' },
  { id: 'p15', name: 'Jumper Wire Kit — M/M M/F F/F (120 pcs)', cat_id: 'components', price: 14.99, was: null, sku: 'VC-COMP-003', brand: 'VoltCore', badge: null, description: 'Premium silicone jumper wire kit with 40 pieces each of male-to-male, male-to-female, and female-to-female wires. 20cm length, assorted colors.', glyph: 'chip', stock: 150, sold: 380, rating: 4.5, reviews: 134, status: 'published' },
  { id: 'p16', name: 'Servo Motor SG90 — 9g Micro', cat_id: 'robotics', price: 15.99, was: null, sku: 'VC-ROBO-001', brand: 'Tower Pro', badge: 'Popular', description: 'Popular 9g micro servo motor for robotics and RC projects. Operating voltage 4.8-6V, stall torque 1.8kg·cm at 4.8V.', glyph: 'bot', stock: 90, sold: 220, rating: 4.6, reviews: 78, status: 'published' },
  { id: 'p17', name: 'L298N Motor Driver Module', cat_id: 'robotics', price: 22.99, was: null, sku: 'VC-ROBO-002', brand: 'VoltCore', badge: null, description: 'Dual H-bridge motor driver module capable of driving 2 DC motors or 1 stepper motor. 5-35V operating voltage, 2A per channel.', glyph: 'bot', stock: 65, sold: 140, rating: 4.5, reviews: 56, status: 'published' },
  { id: 'p18', name: 'ESP32 Development Board — WiFi + BLE', cat_id: 'iot', price: 39.99, was: 49.99, sku: 'VC-IOT-001', brand: 'Espressif', badge: 'Bestseller', description: 'Dual-core ESP32 development board with integrated WiFi and Bluetooth BLE. 240MHz CPU, 520KB SRAM, 4MB flash. Ideal for IoT applications.', glyph: 'wifi', stock: 50, sold: 175, rating: 4.8, reviews: 92, status: 'published' },
  { id: 'p19', name: 'LoRa SX1278 Module — 868MHz', cat_id: 'iot', price: 28.99, was: null, sku: 'VC-IOT-002', brand: 'Semtech', badge: null, description: 'Long-range LoRa transceiver module operating at 868MHz. Range up to 5km line-of-sight. SPI interface, ideal for long-range IoT sensor networks.', glyph: 'wifi', stock: 35, sold: 68, rating: 4.7, reviews: 31, status: 'published' },
  { id: 'p20', name: 'ESP32-CAM Camera Module', cat_id: 'iot', price: 34.99, was: null, sku: 'VC-IOT-003', brand: 'Espressif', badge: 'New', description: 'ESP32-based camera development board with OV2640 camera. Supports WiFi, Bluetooth, and microSD card. Perfect for surveillance and computer vision.', glyph: 'wifi', stock: 25, sold: 55, rating: 4.4, reviews: 23, status: 'published' },
  { id: 'p21', name: 'Lithium Battery 18650 — 3000mAh', cat_id: 'power', price: 29.99, was: null, sku: 'VC-PWR-001', brand: 'Samsung', badge: null, description: 'High-capacity 18650 lithium-ion rechargeable battery. 3000mAh, 3.7V nominal voltage. Protected circuit, over 500 charge cycles.', glyph: 'zap', stock: 80, sold: 200, rating: 4.7, reviews: 88, status: 'published' },
  { id: 'p22', name: 'TP4056 Lithium Battery Charger Module', cat_id: 'power', price: 8.99, was: null, sku: 'VC-PWR-002', brand: 'VoltCore', badge: null, description: 'Micro USB 5V 1A lithium battery charging module with protection. Charges single-cell 18650 batteries with constant current/constant voltage.', glyph: 'zap', stock: 200, sold: 420, rating: 4.5, reviews: 156, status: 'published' },
  { id: 'p23', name: 'Breadboard — 830 Points', cat_id: 'components', price: 16.99, was: null, sku: 'VC-COMP-004', brand: 'VoltCore', badge: null, description: 'Large solderless breadboard with 830 tie points. ABS plastic body with self-adhesive backing. Perfect for prototyping circuits.', glyph: 'chip', stock: 110, sold: 290, rating: 4.6, reviews: 103, status: 'published' },
  { id: 'p24', name: 'Raspberry Pi 4 Model B — 4GB', cat_id: 'raspberry-pi', price: 249.99, was: 299.99, sku: 'VC-RPI-004', brand: 'Raspberry Pi', badge: null, description: 'Previous generation Raspberry Pi 4 with 4GB RAM. Still a powerful choice for desktop applications, media centers, and servers.', glyph: 'board', stock: 8, sold: 320, rating: 4.8, reviews: 210, status: 'published' },
];


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
  console.log('📂 Seeding categories...');
  for (const cat of categories) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO categories (id, name, slug, color, icon, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [cat.id, cat.name, cat.slug, cat.color, cat.icon, cat.sort_order],
    });
  }
  console.log(`   ${categories.length} categories seeded`);

  console.log('📦 Seeding products...');
  for (const p of products) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO products (id, name, cat_id, price, was, sku, brand, badge, description, glyph, stock, sold, rating, reviews, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.id, p.name, p.cat_id, p.price, p.was, p.sku, p.brand, p.badge, p.description, p.glyph, p.stock, p.sold, p.rating, p.reviews, p.status],
    });
  }
  console.log(`   ${products.length} products seeded`);

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
