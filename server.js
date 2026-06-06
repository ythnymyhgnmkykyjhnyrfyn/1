const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// เปิดระบบความปลอดภัยระดับสากล ป้องกัน Error การดึงข้อมูลข้ามโดเมน (CORS)
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 📊 ฐานข้อมูลจำลองและสถานะระบบของบอททั้ง 6 นาย (6 Nodes Central Database)
let runtimeDatabase = {
    system_status: "ACTIVE",
    automation_loops_completed: 254100,
    nodes: [
        { id: "NODE-01", name: "🤖 M1_AUTO_FARM_CORE", task: "ฟาร์มเลเวลสปีดรันความเร็วสูง", speed: "1.2s/loop", status: "STABLE", health: "100%" },
        { id: "NODE-02", name: "⚔️ BOUNTY_HUNTER_V2", task: "บอทล่าค่าหัวและล็อกเป้าหมายอัตโนมัติ", speed: "Dynamic", status: "STABLE", health: "98%" },
        { id: "NODE-03", name: "📡 PROXY_VPN_ROTATOR", task: "สลับสัญญาณไอพีสำรองกันโดนแบน", speed: "5.0s/check", status: "STABLE", health: "100%" },
        { id: "NODE-04", name: "🛒 DISCORD_ROOM_BOT", task: "สร้างห้องซื้อขายและส่งไอดีให้ลูกค้า", speed: "Instant", status: "STABLE", health: "100%" },
        { id: "NODE-05", name: "🛡️ ANTI_CHEAT_BYPASS", task: "ถอดรหัสและข้ามระบบตรวจจับบอท", speed: "0.5s/scan", status: "STABLE", health: "95%" },
        { id: "NODE-06", name: "📊 CLOUD_LEDGER_SYNC", task: "แบ็คอัปยอดเงินและข้อมูลบัญชีลงคลาวด์", speed: "10s/sync", status: "STABLE", health: "100%" }
    ],
    logs: [
        { timestamp: new Date().toLocaleTimeString('th-TH'), event: "🟢 [CORE] ระบบ Quantum Multi-Node 6/6 สตาร์ทตัวออนไลน์ถาวรแล้ว" }
    ]
};

// 🤖 BACKGROUND AUTOMATION ENGINE (ลูปรันหลังบ้านอัตโนมัติ 24 ชม. แม้ปิดคอมพิวเตอร์และหน้าเว็บ)
setInterval(() => {
    if (runtimeDatabase.system_status === "ACTIVE") {
        // บอททั้ง 6 นายช่วยกันประมวลผลเพิ่มจำนวนรอบการทำงานสำเร็จ
        runtimeDatabase.automation_loops_completed += Math.floor(Math.random() * 6) + 2;
        
        // สุ่มจำลองบันทึกเหตุการณ์กิจกรรมการทำงานของทั้ง 6 Nodes ป้อนเข้าสู่หน้ากระดานมอนิเตอร์
        if (Math.random() > 0.80) {
            const nodeLogs = [
                "🤖 [NODE-01] บอท M1 ทำการรีเซ็ตจุดฟาร์มและเก็บมอนสเตอร์สำเร็จ",
                "⚔️ [NODE-02] พบบล็อกเกอร์เป้าหมาย ย้ายเซิร์ฟเวอร์ไล่ล่าค่าหัว",
                "📡 [NODE-03] ทำความสะอาดไอพีเซกเตอร์ ตรวจสอบ Ping: 18ms",
                "🛒 [NODE-04] บอทดิสคอร์ดเคลียร์ห้องว่างรองรับสมาชิกระดับ VIP",
                "🛡️ [NODE-05] บายพาสสคริปต์ตรวจจับแพทช์ใหม่ล่าสุดสำเร็จ (Security Check OK)",
                "📊 [NODE-06] อัปโหลดข้อมูล Log ล่าสุดไปฝากไว้บนคลาวด์เซฟเวอร์สำรอง"
            ];
            
            runtimeDatabase.logs.unshift({
                timestamp: new Date().toLocaleTimeString('th-TH'),
                event: nodeLogs[Math.floor(Math.random() * nodeLogs.length)]
            });
            
            // ล้างล็อกเก่าออกเพื่อป้องกันหน่วยความจำของเซิร์ฟเวอร์เต็ม (Memory Leak Protection)
            if (runtimeDatabase.logs.length > 15) runtimeDatabase.logs.pop();
        }
    }
}, 2000);

// 🌐 REST API ENDPOINTS
// ส่งข้อมูลสถานะปัจจุบันทั้งหมดไปเรนเดอร์หน้าจอเว็บ (GET)
app.get('/api/v1/status', (req, res) => {
    res.status(200).json(runtimeDatabase);
});

// รับคำสั่งควบคุมเปิด/ปิดการทำงานของบอทจากปุ่มบนหน้าเว็บ (POST)
app.post('/api/v1/control', (req, res) => {
    const { command } = req.body;
    if (command === "TOGGLE_SYSTEM") {
        runtimeDatabase.system_status = runtimeDatabase.system_status === "ACTIVE" ? "PAUSED" : "ACTIVE";
        
        // สลับสถานะหลอดไฟของบอททั้ง 6 นายให้เปิด-ปิดตามระบบประธานหลัก
        runtimeDatabase.nodes.forEach(node => {
            node.status = runtimeDatabase.system_status === "ACTIVE" ? "STABLE" : "OFFLINE";
        });

        runtimeDatabase.logs.unshift({
            timestamp: new Date().toLocaleTimeString('th-TH'),
            event: `⚠️ [COMMAND] แอดมินสั่งเปลี่ยนสถานะระบบใหญ่เป็น: [${runtimeDatabase.system_status}]`
        });
        return res.status(200).json({ success: true, current_status: runtimeDatabase.system_status });
    }
    res.status(400).json({ success: false, error: "Invalid Command" });
});

// ดึงหน้ากาก HTML มาแสดงผลทันทีเมื่อเปิดลิงก์ URL หลัก
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// เปิดประตูท่าเรือฟังเสียงเรียกเข้าเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`🚀 [SUCCESS] 6-Node Core System Running on port ${PORT}`);
});
