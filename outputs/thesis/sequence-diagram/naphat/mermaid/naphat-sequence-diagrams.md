# Sequence Diagram ของนภัทร — Mermaid ขาวดำ

แปลงจากชุด Draw.io เดิมโดยคงข้อความ ลำดับ และเงื่อนไข ใช้พื้นขาว ตัวอักษรและเส้นสีดำ กล่องไม่มีสี และ Activation สีเทา ตามรูปแบบภาพของเพื่อน เหมาะสำหรับรายงานและการพิมพ์ขาวดำ

ประกอบด้วย Login, View Dashboard, View Topology, User Management และ Audit History

Dashboard และการตรวจสิทธิ์ของ Topology เป็นลำดับตามการออกแบบ ไม่ใช่การรับรองว่า Implementation เสร็จครบแล้ว เลขรูปคงตามชุดเดิม

## รูป 3.6 Login Sequence Diagram

```mermaid
%%{init: {"theme":"base","fontFamily":"Tahoma, Arial, sans-serif","themeVariables":{"background":"#ffffff","primaryColor":"#ffffff","primaryBorderColor":"#111111","primaryTextColor":"#111111","secondaryColor":"#ffffff","tertiaryColor":"#ffffff","lineColor":"#111111","textColor":"#111111","actorBkg":"#ffffff","actorBorder":"#111111","actorTextColor":"#111111","actorLineColor":"#111111","signalColor":"#111111","signalTextColor":"#111111","labelBoxBkgColor":"#ffffff","labelBoxBorderColor":"#111111","labelTextColor":"#111111","loopTextColor":"#111111","noteBkgColor":"#ffffff","noteBorderColor":"#111111","noteTextColor":"#111111","activationBkgColor":"#d9d9d9","activationBorderColor":"#666666","sequenceNumberColor":"#111111","fontSize":"17px"},"themeCSS":".actor-line{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:none!important}.actor{fill:#ffffff!important;stroke:#111111!important;filter:none!important}.actor-man circle,.actor-man line,.actor-man path{stroke:#111111!important;fill:#ffffff!important}.loopLine{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:2 2!important}.labelBox,.note{fill:#ffffff!important;stroke:#111111!important}text,tspan{fill:#111111!important}.messageLine0,.messageLine1{stroke:#111111!important;stroke-width:1.3px!important}.activation0,.activation1,.activation2{fill:#d9d9d9!important;stroke:#666666!important}text,tspan{font-size:17px!important}","sequence":{"useMaxWidth":false,"mirrorActors":true,"actorMargin":70,"messageMargin":35,"noteMargin":14,"actorFontSize":17,"messageFontSize":17,"noteFontSize":17}}}%%
sequenceDiagram
    actor U as Viewer / Operator / Admin
    participant F as Frontend
    participant B as Backend
    participant S as Authentication Service
    participant D as PostgreSQL
    U->>F: กรอก Username / Email<br/>และ Password แล้วกดเข้าสู่ระบบ
    activate F
    F->>B: POST /api/auth/login<br/>identifier + password
    activate B
    B->>B: ตรวจ Origin / CSRF / JSON<br/>และจำกัดคำขอต่อ IP
    alt คำขอได้รับอนุญาต
        B->>S: เรียก Authentication Service<br/>ตรวจสอบบัญชีและรหัสผ่าน
        activate S
        S->>D: ค้นหาบัญชีผู้ใช้งาน<br/>จากตาราง users
        activate D
        D--)S: ข้อมูลบัญชีและ Password Hash
        deactivate D
        S->>S: ตรวจ Password ด้วย Argon2id<br/>และสถานะบัญชี
        alt ข้อมูลถูกต้องและบัญชีใช้งานได้
            S->>S: ตรวจบัญชีซ้ำใน Transaction<br/>สร้าง Opaque Session Token
            S->>D: บันทึก Token Hash และ login_success<br/>ผ่าน Audit Writer แล้ว Commit
            activate D
            D--)S: Commit Session และ Audit สำเร็จ
            deactivate D
            S--)B: ยืนยันตัวตนสำเร็จ<br/>ส่ง Session Token ให้ Backend
            B--)F: 200 OK + Set-Cookie<br/>HttpOnly Session Cookie
            F->>B: GET /api/auth/me<br/>พร้อม Session Cookie
            B->>S: ตรวจสอบ Session<br/>และดึงข้อมูลผู้ใช้ปัจจุบัน
            S->>D: อ่าน Session และผู้ใช้งานปัจจุบัน
            activate D
            D--)S: ข้อมูลผู้ใช้และ Role
            deactivate D
            S--)B: ข้อมูลผู้ใช้ที่เข้าสู่ระบบ
            B--)F: ข้อมูลผู้ใช้ที่เข้าสู่ระบบ
            F--)U: แสดงหน้าหลักของระบบ
        else ข้อมูลไม่ถูกต้องหรือบัญชีไม่ใช้งาน
            S->>S: นับความล้มเหลวของ IP<br/>ใน Login Rate Limiter
            S->>D: บันทึก login_failed<br/>ผ่าน Audit Writer
            activate D
            D--)S: บันทึกเหตุการณ์สำเร็จ
            deactivate D
            S--)B: ผลการยืนยันตัวตนไม่สำเร็จ
            B--)F: 401 Unauthorized
            F--)U: แจ้งข้อมูลเข้าสู่ระบบไม่ถูกต้อง
        end
    else คำขอถูกปฏิเสธก่อนตรวจรหัสผ่าน
        B--)F: 403 / 422 / 429<br/>ตามสาเหตุที่ปฏิเสธ
        F--)U: แจ้งข้อผิดพลาด<br/>หรือให้ลองใหม่ภายหลัง
    end
    deactivate S
    deactivate B
    deactivate F
    Note over U,D: หากฐานข้อมูลหรือ Audit ล้มเหลว: ตอบ 503 และไม่ส่ง Session Cookie
```

## รูป 3.7 View Dashboard Sequence Diagram

```mermaid
%%{init: {"theme":"base","fontFamily":"Tahoma, Arial, sans-serif","themeVariables":{"background":"#ffffff","primaryColor":"#ffffff","primaryBorderColor":"#111111","primaryTextColor":"#111111","secondaryColor":"#ffffff","tertiaryColor":"#ffffff","lineColor":"#111111","textColor":"#111111","actorBkg":"#ffffff","actorBorder":"#111111","actorTextColor":"#111111","actorLineColor":"#111111","signalColor":"#111111","signalTextColor":"#111111","labelBoxBkgColor":"#ffffff","labelBoxBorderColor":"#111111","labelTextColor":"#111111","loopTextColor":"#111111","noteBkgColor":"#ffffff","noteBorderColor":"#111111","noteTextColor":"#111111","activationBkgColor":"#d9d9d9","activationBorderColor":"#666666","sequenceNumberColor":"#111111","fontSize":"17px"},"themeCSS":".actor-line{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:none!important}.actor{fill:#ffffff!important;stroke:#111111!important;filter:none!important}.actor-man circle,.actor-man line,.actor-man path{stroke:#111111!important;fill:#ffffff!important}.loopLine{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:2 2!important}.labelBox,.note{fill:#ffffff!important;stroke:#111111!important}text,tspan{fill:#111111!important}.messageLine0,.messageLine1{stroke:#111111!important;stroke-width:1.3px!important}.activation0,.activation1,.activation2{fill:#d9d9d9!important;stroke:#666666!important}text,tspan{font-size:17px!important}","sequence":{"useMaxWidth":false,"mirrorActors":true,"actorMargin":70,"messageMargin":35,"noteMargin":14,"actorFontSize":17,"messageFontSize":17,"noteFontSize":17}}}%%
sequenceDiagram
    actor U as Viewer / Operator / Admin
    participant F as Frontend
    participant B as Backend
    participant S as Dashboard Service
    participant D as PostgreSQL
    U->>F: เปิดหน้า Dashboard
    activate F
    F->>B: ขอข้อมูลสรุปและกิจกรรมล่าสุด<br/>พร้อม Session Cookie
    activate B
    B->>S: ตรวจ Session และสิทธิ์ในการเข้าถึง Dashboard
    activate S
    S->>D: ตรวจ Session และบัญชีผู้ใช้งาน
    activate D
    D--)S: ข้อมูลผู้ใช้และ Role ปัจจุบัน
    deactivate D
    S--)B: ผลการตรวจ Session และสิทธิ์
    alt Session ถูกต้องและมีสิทธิ์อ่าน
        B->>S: ขอข้อมูล Dashboard<br/>และกิจกรรมล่าสุดที่อนุญาต
        S->>D: อ่านข้อมูลอุปกรณ์และสถานะ<br/>เพื่อสรุปภาพรวม
        activate D
        D--)S: ข้อมูลสรุปเครือข่าย
        deactivate D
        S->>D: อ่านกิจกรรมล่าสุดจาก audit_logs<br/>เฉพาะรายการที่อนุญาต
        activate D
        D--)S: กิจกรรมล่าสุดที่เรียงตามเวลา
        deactivate D
        S->>S: จัดรูปแบบข้อมูลสรุป<br/>และตัดข้อมูลอ่อนไหว
        S--)B: ข้อมูลสรุปและ Recent Activity
        B--)F: ข้อมูลสรุปและ Recent Activity
        F--)U: แสดง Dashboard<br/>หรือข้อความเมื่อยังไม่มีข้อมูล
    else Session ไม่ถูกต้องหรือสิทธิ์ไม่เพียงพอ
        B--)F: 401 Unauthorized / 403 Forbidden
        F--)U: ให้เข้าสู่ระบบใหม่<br/>หรือแจ้งว่าไม่มีสิทธิ์
    end
    deactivate S
    deactivate B
    deactivate F
    Note over U,D: Recent Activity แสดงเฉพาะข้อมูลสรุปที่อนุญาต ไม่แสดง Audit เต็มหรือข้อมูลลับ
```

## รูป 3.12 View Topology Sequence Diagram

```mermaid
%%{init: {"theme":"base","fontFamily":"Tahoma, Arial, sans-serif","themeVariables":{"background":"#ffffff","primaryColor":"#ffffff","primaryBorderColor":"#111111","primaryTextColor":"#111111","secondaryColor":"#ffffff","tertiaryColor":"#ffffff","lineColor":"#111111","textColor":"#111111","actorBkg":"#ffffff","actorBorder":"#111111","actorTextColor":"#111111","actorLineColor":"#111111","signalColor":"#111111","signalTextColor":"#111111","labelBoxBkgColor":"#ffffff","labelBoxBorderColor":"#111111","labelTextColor":"#111111","loopTextColor":"#111111","noteBkgColor":"#ffffff","noteBorderColor":"#111111","noteTextColor":"#111111","activationBkgColor":"#d9d9d9","activationBorderColor":"#666666","sequenceNumberColor":"#111111","fontSize":"17px"},"themeCSS":".actor-line{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:none!important}.actor{fill:#ffffff!important;stroke:#111111!important;filter:none!important}.actor-man circle,.actor-man line,.actor-man path{stroke:#111111!important;fill:#ffffff!important}.loopLine{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:2 2!important}.labelBox,.note{fill:#ffffff!important;stroke:#111111!important}text,tspan{fill:#111111!important}.messageLine0,.messageLine1{stroke:#111111!important;stroke-width:1.3px!important}.activation0,.activation1,.activation2{fill:#d9d9d9!important;stroke:#666666!important}text,tspan{font-size:17px!important}","sequence":{"useMaxWidth":false,"mirrorActors":true,"actorMargin":70,"messageMargin":35,"noteMargin":14,"actorFontSize":17,"messageFontSize":17,"noteFontSize":17}}}%%
sequenceDiagram
    actor U as Viewer / Operator / Admin
    participant F as Frontend
    participant B as Backend
    participant S as Topology Service
    participant D as PostgreSQL
    U->>F: เปิดหน้า Topology<br/>หรือเลือก View Topology จาก Devices
    activate F
    F->>B: ขอข้อมูลแผนผังเครือข่าย<br/>พร้อม Session Cookie
    activate B
    B->>S: ตรวจ Session และสิทธิ์ในการดู Topology
    activate S
    S->>D: ตรวจ Session และบัญชีผู้ใช้งาน
    activate D
    D--)S: ข้อมูลผู้ใช้และ Role ปัจจุบัน
    deactivate D
    S--)B: ผลการตรวจ Session และสิทธิ์
    alt Session ถูกต้องและมีสิทธิ์อ่าน
        B->>S: ขอข้อมูล Physical Topology<br/>จากข้อมูลที่จัดเก็บไว้
        S->>D: อ่าน Device, Interface<br/>และหลักฐาน LLDP ที่จัดเก็บไว้
        activate D
        D--)S: ข้อมูลอุปกรณ์และเพื่อนบ้าน
        deactivate D
        S->>S: จับคู่ข้อมูลอุปกรณ์<br/>และสร้างความสัมพันธ์ของ Link
        S--)B: ข้อมูลอุปกรณ์และเส้นเชื่อม
        B--)F: ข้อมูลอุปกรณ์และเส้นเชื่อม
        F->>F: สร้าง Node / Link<br/>และจัดตำแหน่งแผนผัง
        F--)U: แสดง Physical Topology<br/>หรือข้อความเมื่อยังไม่มีข้อมูล
    else Session ไม่ถูกต้องหรือสิทธิ์ไม่เพียงพอ
        B--)F: 401 Unauthorized / 403 Forbidden
        F--)U: ให้เข้าสู่ระบบใหม่<br/>หรือแจ้งว่าไม่มีสิทธิ์
    end
    deactivate S
    deactivate B
    deactivate F
    Note over U,D: แสดงแผนผังจากข้อมูลที่จัดเก็บไว้ การเปิดหน้า Topology ไม่ได้สั่ง Discovery ใหม่
```

## รูป 3.13 User Management Sequence Diagram

```mermaid
%%{init: {"theme":"base","fontFamily":"Tahoma, Arial, sans-serif","themeVariables":{"background":"#ffffff","primaryColor":"#ffffff","primaryBorderColor":"#111111","primaryTextColor":"#111111","secondaryColor":"#ffffff","tertiaryColor":"#ffffff","lineColor":"#111111","textColor":"#111111","actorBkg":"#ffffff","actorBorder":"#111111","actorTextColor":"#111111","actorLineColor":"#111111","signalColor":"#111111","signalTextColor":"#111111","labelBoxBkgColor":"#ffffff","labelBoxBorderColor":"#111111","labelTextColor":"#111111","loopTextColor":"#111111","noteBkgColor":"#ffffff","noteBorderColor":"#111111","noteTextColor":"#111111","activationBkgColor":"#d9d9d9","activationBorderColor":"#666666","sequenceNumberColor":"#111111","fontSize":"17px"},"themeCSS":".actor-line{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:none!important}.actor{fill:#ffffff!important;stroke:#111111!important;filter:none!important}.actor-man circle,.actor-man line,.actor-man path{stroke:#111111!important;fill:#ffffff!important}.loopLine{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:2 2!important}.labelBox,.note{fill:#ffffff!important;stroke:#111111!important}text,tspan{fill:#111111!important}.messageLine0,.messageLine1{stroke:#111111!important;stroke-width:1.3px!important}.activation0,.activation1,.activation2{fill:#d9d9d9!important;stroke:#666666!important}text,tspan{font-size:17px!important}","sequence":{"useMaxWidth":false,"mirrorActors":true,"actorMargin":70,"messageMargin":35,"noteMargin":14,"actorFontSize":17,"messageFontSize":17,"noteFontSize":17}}}%%
sequenceDiagram
    actor U as Admin
    participant F as Frontend
    participant B as Backend
    participant S as User Management Service
    participant D as PostgreSQL
    U->>F: เปิดหน้า User Management
    activate F
    F->>B: ขอรายการผู้ใช้งาน<br/>พร้อม Session Cookie
    activate B
    B->>S: ตรวจ Session และสิทธิ์ user.manage<br/>และขอรายการผู้ใช้งาน
    activate S
    S->>D: อ่านบัญชีผู้ใช้ที่เปิดเผยได้<br/>หลังตรวจสอบ Session และสิทธิ์
    activate D
    D--)S: รายการผู้ใช้งานที่เปิดเผยได้
    deactivate D
    S--)B: รายการผู้ใช้งานและ Role
    B--)F: รายการผู้ใช้งานและ Role
    F--)U: แสดงรายการผู้ใช้งาน
    U->>F: เพิ่มบัญชี หรือแก้ไข Role<br/>หรือปิดใช้งานบัญชี
    F->>B: POST /api/admin/users<br/>หรือ PATCH /api/admin/users/{id}
    B->>B: ตรวจ Origin / CSRF / ข้อมูล<br/>และยืนยันสิทธิ์ Admin
    B->>S: ส่งคำขอจัดการผู้ใช้งาน<br/>พร้อมข้อมูลและสิทธิ์ที่ตรวจสอบ
    alt ข้อมูลและสิทธิ์ถูกต้อง
        alt เพิ่มบัญชี
            S->>S: Hash Password ด้วย Argon2id
            S->>D: ตรวจสิทธิ์ซ้ำใน Transaction<br/>สร้างผู้ใช้และตรวจข้อมูลซ้ำ
            activate D
            D--)S: สร้างบัญชีรอ Commit
            deactivate D
        else เปลี่ยน Role หรือสถานะบัญชี
            S->>D: ตรวจสิทธิ์ซ้ำและแก้ไขบัญชี<br/>ป้องกันการเสีย Admin คนสุดท้าย
            activate D
            opt Role เปลี่ยนหรือบัญชีถูกปิด
                S->>D: เพิกถอน Session ของบัญชีเป้าหมาย
            end
            D--)S: แก้ไขข้อมูลรอ Commit
            deactivate D
        end
        S->>D: บันทึกเหตุการณ์ผ่าน Audit Writer<br/>และ Commit Transaction
        activate D
        D--)S: Commit ข้อมูลและ Audit สำเร็จ
        deactivate D
        S--)B: ผลการจัดการผู้ใช้งาน
        B--)F: ผลการจัดการผู้ใช้งาน
        F--)U: แสดงผลสำเร็จและปรับรายการ
    else ไม่มีสิทธิ์ ข้อมูลผิด ซ้ำ หรือ Admin คนสุดท้าย
        S--)B: ปฏิเสธคำขอและไม่บันทึกการเปลี่ยนแปลง
        B--)F: ปฏิเสธคำขอและไม่บันทึกการเปลี่ยนแปลง
        F--)U: แสดงข้อความอธิบายข้อผิดพลาด
    end
    deactivate S
    deactivate B
    deactivate F
    Note over U,D: ปิดบัญชีโดยไม่ลบข้อมูลผู้ใช้#59; หาก Audit ล้มเหลว ต้อง Rollback และไม่ตอบสำเร็จ
```

## รูป 3.14 Audit History Sequence Diagram

```mermaid
%%{init: {"theme":"base","fontFamily":"Tahoma, Arial, sans-serif","themeVariables":{"background":"#ffffff","primaryColor":"#ffffff","primaryBorderColor":"#111111","primaryTextColor":"#111111","secondaryColor":"#ffffff","tertiaryColor":"#ffffff","lineColor":"#111111","textColor":"#111111","actorBkg":"#ffffff","actorBorder":"#111111","actorTextColor":"#111111","actorLineColor":"#111111","signalColor":"#111111","signalTextColor":"#111111","labelBoxBkgColor":"#ffffff","labelBoxBorderColor":"#111111","labelTextColor":"#111111","loopTextColor":"#111111","noteBkgColor":"#ffffff","noteBorderColor":"#111111","noteTextColor":"#111111","activationBkgColor":"#d9d9d9","activationBorderColor":"#666666","sequenceNumberColor":"#111111","fontSize":"17px"},"themeCSS":".actor-line{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:none!important}.actor{fill:#ffffff!important;stroke:#111111!important;filter:none!important}.actor-man circle,.actor-man line,.actor-man path{stroke:#111111!important;fill:#ffffff!important}.loopLine{stroke:#111111!important;stroke-width:1px!important;stroke-dasharray:2 2!important}.labelBox,.note{fill:#ffffff!important;stroke:#111111!important}text,tspan{fill:#111111!important}.messageLine0,.messageLine1{stroke:#111111!important;stroke-width:1.3px!important}.activation0,.activation1,.activation2{fill:#d9d9d9!important;stroke:#666666!important}text,tspan{font-size:17px!important}","sequence":{"useMaxWidth":false,"mirrorActors":true,"actorMargin":70,"messageMargin":35,"noteMargin":14,"actorFontSize":17,"messageFontSize":17,"noteFontSize":17}}}%%
sequenceDiagram
    actor U as Admin
    participant F as Frontend
    participant B as Backend
    participant S as Audit Read Service
    participant D as PostgreSQL
    U->>F: เปิดหน้า Audit History<br/>และกำหนดตัวกรองถ้าต้องการ
    activate F
    F->>B: GET /api/audit-logs<br/>ตัวกรอง + Cursor + Session Cookie
    activate B
    B->>S: ตรวจ Session และบัญชีผู้ใช้งาน
    activate S
    S->>D: อ่าน Session และบัญชีผู้ใช้งาน
    activate D
    D--)S: ข้อมูลผู้ใช้และ Role ปัจจุบัน
    deactivate D
    S--)B: ข้อมูลผู้ใช้และ Role ปัจจุบัน
    B->>B: ตรวจสิทธิ์ audit.read<br/>และตรวจรูปแบบตัวกรอง
    alt เป็น Admin และคำขอถูกต้อง
        B->>S: ขอรายการ Audit ตามตัวกรอง<br/>พร้อม Cursor ที่ตรวจสอบแล้ว
        S->>D: อ่าน audit_logs ตามตัวกรอง<br/>เรียงเวลาและ ID จากใหม่ไปเก่า
        activate D
        D--)S: รายการเหตุการณ์และข้อมูลผู้เกี่ยวข้อง
        deactivate D
        S->>S: ตรวจความปลอดภัยของข้อมูล<br/>จัดรูปแบบรายการและ Next Cursor
        S--)B: รายการ Audit และ Next Cursor
        B--)F: รายการ Audit และ Next Cursor
        F--)U: แสดงประวัติแบบอ่านอย่างเดียว<br/>หรือข้อความเมื่อไม่พบรายการ
        opt ผู้ใช้เลือกดูหน้าถัดไป
            U->>F: เลือกดูรายการถัดไป
            F->>B: ขอรายการต่อด้วย Next Cursor
            B->>B: ตรวจ Session, สิทธิ์ audit.read<br/>และรูปแบบ Cursor อีกครั้ง
            B->>S: ขอข้อมูล Audit หน้าถัดไป<br/>ด้วย Next Cursor ที่ตรวจสอบแล้ว
            S->>D: อ่าน audit_logs หน้าถัดไป<br/>เรียงเวลาและ ID
            activate D
            D--)S: รายการเหตุการณ์หน้าถัดไป
            deactivate D
            S->>S: ตรวจข้อมูลและจัด Next Cursor ใหม่
            S--)B: รายการหน้าถัดไปและ Next Cursor
            B--)F: รายการหน้าถัดไปและ Next Cursor
            F--)U: แสดงรายการหน้าถัดไป
        end
    else Session สิทธิ์ หรือตัวกรองไม่ถูกต้อง
        B--)F: 401 / 403 / 422<br/>ตามสาเหตุที่ปฏิเสธ
        F--)U: แจ้งข้อผิดพลาด<br/>โดยไม่เปิดเผยประวัติ
    end
    deactivate S
    deactivate B
    deactivate F
    Note over U,D: ไม่แก้ไขหรือลบ Audit จากหน้านี้ และไม่บันทึก Audit ใหม่จากการอ่านที่สำเร็จ
```
