Netmiko>
ลิงค์ : https://github.com/ktbyers/netmiko
Document : https://ktbyers.github.io/netmiko/docs/netmiko/index.html
**ประเภท:** ไลบรารีระดับล่าง (Low-level Library) สำหรับภาษา Python

**หน้าที่หลัก:** พัฒนาต่อยอดมาจาก Paramiko เพื่อทำหน้าที่จัดการการเชื่อมต่อผ่านโปรโตคอล SSH เข้าสู่อุปกรณ์เครือข่ายโดยเฉพาะ

**จุดเด่น:** รองรับอุปกรณ์หลากหลายผู้ผลิตในตลาดอย่างครอบคลุม (เช่น Cisco IOS/NX-OS, Junos, Huawei VRP, MikroTik RouterOS) มีความสามารถในการจัดการ Prompt ระดับ CLI และจังหวะการรับส่งข้อมูล (Timing) ได้อย่างแม่นยำ

**ข้อจำกัด:** ผลลัพธ์ที่ดึงออกมาจากอุปกรณ์ยังคงเป็นข้อความดิบ (String) ผู้พัฒนาจำเป็นต้องเขียน Regular Expression หรือใช้งานระบบ Parser ภายนอก (เช่น TextFSM หรือ Genie) เพิ่มเติมเพื่อแปลงข้อมูลให้เป็นรูปแบบที่ระบบอ่านเข้าใจ


## แนวคิดพื้นฐานและการเริ่มต้นใช้งาน Netmiko
การเริ่มต้นใช้งาน Netmiko ไม่จำเป็นต้องท่องจำคำสั่งทั้งหมด แต่ให้ทำความเข้าใจ **แนวคิดหลัก (Core Concepts)** ในการเชื่อมต่อและการส่งคำสั่งผ่านระบบสคริปต์ ซึ่งสามารถสรุปส่วนสำคัญได้ดังนี้

### 1. แนวคิดหลัก: ConnectHandler และ Dictionary ข้อมูล

Netmiko ทำงานโดยใช้ฟังก์ชันหลักที่ชื่อว่า `ConnectHandler` ในการสร้างเซสชัน SSH ไปยังอุปกรณ์เครือข่าย สิ่งที่คุณต้องทำคือการสร้างตัวแปรชนิด Dictionary เพื่อเก็บข้อมูลของอุปกรณ์ปลายทาง ซึ่งมีตัวแปรสำคัญที่ระบบต้องการดังนี้:
### Getting Started:
Create a dictionary representing the device.

Supported device_types can be found in [ssh_dispatcher.py](https://github.com/ktbyers/netmiko/blob/master/netmiko/ssh_dispatcher.py), see CLASS_MAPPER keys.

```python
from netmiko import ConnectHandler

cisco_881 = {
    'device_type': 'cisco_ios',
    'host':   '10.10.10.10',
    'username': 'test',
    'password': 'password',
    'port' : 8022,          # optional, defaults to 22
    'secret': 'secret',     # optional, defaults to ''
}
```

#### Establish an SSH connection to the device by passing in the device dictionary.


```python
net_connect = ConnectHandler(**cisco_881)
```

- **`device_type`**: ส่วนที่สำคัญที่สุด ทำหน้าที่บอก Netmiko ว่าอุปกรณ์ปลายทางใช้ระบบปฏิบัติการอะไร เพื่อให้ไลบรารีเลือกวิธีจัดการ Prompt และจังหวะเวลา (Timing) ได้ถูกต้อง ตัวอย่างเช่น `cisco_ios`, `huawei`, หรือ `mikrotik_routeros`
    
- **`host`**: หมายเลข IP Address หรือชื่อโดเมนของอุปกรณ์
    
- **`username`** และ **`password`**: ข้อมูลประจำตัวในการเข้าสู่ระบบ

### 2. 3 คำสั่งหลักที่ใช้ควบคุมอุปกรณ์

เมื่อเชื่อมต่อสำเร็จ มีเพียง 3 เมธอด (Methods) หลักที่คุณต้องใช้งานในการควบคุมอุปกรณ์ผ่านสคริปต์:

- **`send_command(command_string)`** ใช้สำหรับส่งคำสั่งประเภทตรวจสอบสถานะหรือแสดงผล (เช่น คำสั่งตระกูล `show` หรือ `display`) ผลลัพธ์ที่ส่งกลับมาจะเป็นข้อความดิบ (String) เสมือนหน้าจอ CLI
    
- **`send_config_set(config_commands)`** ใช้สำหรับส่งคำสั่งตั้งค่า (Configuration) จุดเด่นคือระบบจะสั่งเข้าโหมดคอนฟิก (เช่น `configure terminal`) ให้โดยอัตโนมัติ โดยคุณสามารถส่งคำสั่งเข้าไปในรูปแบบรายการคำสั่ง (List) พร้อมกันได้หลายคำสั่ง
    
- **`disconnect()`** ใช้สำหรับสั่งตัดการเชื่อมต่อ SSH เมื่อสคริปต์ทำงานเสร็จสิ้น เพื่อคืนทรัพยากรให้แก่อุปกรณ์ปลายทางและระบบส่วนกลาง
#### Execute show commands.

```python
output = net_connect.send_command('show ip int brief')
print(output)
```

```
Interface                  IP-Address      OK? Method Status                Protocol
FastEthernet0              unassigned      YES unset  down                  down
FastEthernet1              unassigned      YES unset  down                  down
FastEthernet2              unassigned      YES unset  down                  down
FastEthernet3              unassigned      YES unset  down                  down
FastEthernet4              10.10.10.10     YES manual up                    up
Vlan1                      unassigned      YES unset  down                  down
```

#### Execute configuration change commands (will automatically enter into config mode)


```python
config_commands = [ 'logging buffered 20000',
                    'logging buffered 20010',
                    'no logging console' ]
output = net_connect.send_config_set(config_commands)
print(output)
```

```
pynet-rtr1#config term
Enter configuration commands, one per line.  End with CNTL/Z.
pynet-rtr1(config)#logging buffered 20000
pynet-rtr1(config)#logging buffered 20010
pynet-rtr1(config)#no logging console
pynet-rtr1(config)#end
pynet-rtr1#
```

### 3. ตัวแปรโครงสร้างโค้ดพื้นฐาน (Template)

นี่คือรูปแบบโค้ดขั้นต่ำที่ทำงานได้จริงตามแนวคิดข้างต้น:

```python
from netmiko import ConnectHandler

# 1. กำหนดโครงสร้างข้อมูลอุปกรณ์ (รองรับการจัดการแบบหลายผู้ผลิตผ่าน device_type)
target_device = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'password123',
}

# 2. เริ่มต้นการเปิดการเชื่อมต่อ
net_connect = ConnectHandler(**target_device)

# 3. การดึงข้อมูลสถานะ (ได้ผลลัพธ์เป็นข้อความดิบ)
show_output = net_connect.send_command("show ip interface brief")
print("--- Show Command Result ---")
print(show_output)

# 4. การเปลี่ยนแปลงการตั้งค่า
config_lines = [
    'interface GigabitEthernet0/1',
    'description Configured via Python Netmiko Script'
]
config_output = net_connect.send_config_set(config_lines)
print("--- Config Command Result ---")
print(config_output)

# 5. ปิดเซสชันการทำงาน
net_connect.disconnect()
```

### 4. ข้อจำกัดสำคัญที่ต้องตระหนัก (Concept)

ข้อมูลที่ได้กลับมาจากเมธอด `send_command` จะเป็นเพียง **ข้อความดิบ (Unstructured Text)** เท่านั้น หากต้องการนำผลลัพธ์ไปประมวลผลต่อในตรรกะคอมพิวเตอร์ (เช่น การเช็คว่าสถานะอินเตอร์เฟสเป็น Up หรือ Down) จะต้องส่งข้อมูลนั้นเข้าสู่ระบบวิเคราะห์คำ (Parser) เช่น 
* `TextFSM` เพื่อแปลงให้กลายเป็นข้อมูลแบบมีโครงสร้าง (Structured Data) เช่น JSON หรือ Dictionary ต่อไป

คุณต้องการดูตัวอย่างการเขียนสคริปต์เพื่อแยกแยะค่าผลลัพธ์ (Parsing) ของอุปกรณ์ยี่ห้ออื่นเพิ่มเติม หรือต้องการลงลึกในส่วนการตั้งค่าความปลอดภัยก่อนครับ?

### 5. ข้อดีและข้อเสียของ Netmiko ในงาน Network Operations
การนำ Netmiko มาใช้ในงานปฏิบัติการเครือข่าย (Operations) มีจุดเด่นและจุดด้อยที่ต้องพิจารณาสำหรับการวางโครงสร้างระบบอัตโนมัติ **ดังนี้ครับ**

**ข้อดี (Advantages)**

- **ครอบคลุมอุปกรณ์หลากหลาย (Broad Multi-vendor Support):** รองรับการเชื่อมต่อกับอุปกรณ์เครือข่ายแทบทุกยี่ห้อในตลาด โดยระบบจะจัดการเรื่องจังหวะเวลา (Timing), การจัดการ Prompt, และการเลื่อนหน้าจอ (Paging) ให้โดยอัตโนมัติ
    
- **เรียนรู้และปรับใช้ได้ทันที:** ผู้ดูแลเครือข่ายสามารถใช้ความรู้เดิมที่มีอยู่ได้เลย เพราะเป็นการส่งชุดคำสั่ง CLI (เช่น `show ip route` หรือ `configure terminal`) ผ่านโค้ด
    
- **ความยืดหยุ่นสูง:** สามารถส่งคำสั่งใดๆ ก็ได้ที่สามารถพิมพ์บนหน้าจอ CLI ได้ ทำให้เหมาะสำหรับการแก้ไขปัญหาเฉพาะหน้า (Troubleshooting) หรือดึงข้อมูลเชิงลึกที่ไม่มีใน API มาตรฐาน
    

**ข้อเสีย (Disadvantages)**

- **ผลลัพธ์เป็นข้อความดิบ (Unstructured Data):** ข้อมูลที่ส่งกลับมาเป็นเพียง String ยาวๆ ผู้ดูแลระบบต้องนำไปเขียนตัวกรองคำ (Regular Expression) หรือใช้เครื่องมืออย่าง TextFSM เพื่อสกัดเฉพาะข้อมูลที่ต้องการ ซึ่งใช้เวลามากและซับซ้อน
    
- **สคริปต์พังได้ง่าย (Fragile Scripts):** หากอุปกรณ์มีการอัปเกรด Firmware หรือ OS แล้วรูปแบบการแสดงผลของหน้า CLI เปลี่ยนไปเพียงเล็กน้อย (เช่น เว้นวรรคเปลี่ยนไป) โค้ดที่เขียนไว้เพื่อตัดคำจะทำงานผิดพลาดทันที
    
- **ต้องเขียนลอจิกแยกตามยี่ห้อ (Vendor-Specific Scripting):** หากในเครือข่ายมีทั้ง Cisco, MikroTik และ Huawei ผู้เขียนสคริปต์ต้องเขียนชุดคำสั่งและตัววิเคราะห์ข้อมูลแยกกันถึง 3 ชุด ทำให้สคริปต์มีความยาวและดูแลรักษา (Maintain) ได้ยากในระยะยาว

### 6.**ความเพียงพอของเนื้อหาในการเปลี่ยนไป NAPALM**

จากข้อเสียของ Netmiko ในเรื่อง **"ข้อมูลที่เป็นข้อความดิบ"** และ **"ความแตกต่างของชุดคำสั่งแต่ละยี่ห้อ"** ทำให้การสเกลระบบเครือข่ายอัตโนมัติในสภาวะที่มีอุปกรณ์หลายค่าย (Multi-vendor) ทำได้ยากและมีค่าใช้จ่ายในการดูแลรักษาโค้ดสูง
### แนวคิดของ Netmiko ที่นำไปใช้ใน NAPALM ได้ทันที

- **การจัดการข้อมูลประจำตัวของอุปกรณ์ (Device Credentials):** การเตรียมข้อมูลในรูปแบบ คีย์-ค่า (Dictionary) เช่น Host, Username, Password เพื่อส่งให้ฟังก์ชันเชื่อมต่อ ใช้หลักการเดียวกันทั้งหมด
    
- **การระบุระบบปฏิบัติการ (OS Identification):** ใน Netmiko ต้องระบุ `device_type` (เช่น `cisco_ios`) ส่วนใน NAPALM จะเปลี่ยนเป็นการเรียกใช้ชื่อ Driver (เช่น `ios`, `eos`, `junos`) ผ่านฟังก์ชัน `get_network_driver` ซึ่งเป็นการระบุค่ายอุปกรณ์เพื่อเลือกวิธีคุยเหมือนกัน

### 7. จุดเปลี่ยนสำคัญที่ต้องเรียนรู้เพิ่มเมื่อเข้าสู่ NAPALM (Conceptual Shift)

การขยับจาก Netmiko ไป NAPALM คือการเปลี่ยนวิธีคิดจากการควบคุมระดับเซสชันดิบ (Low-level) ไปสู่ชั้นข้อมูลจำลอง (Abstraction Layer) ซึ่งมีกระบวนการทำงานที่ต่างออกไปดังนี้:

- **เปลี่ยนจากข้อความดิบ (Raw Text) เป็นข้อมูลมีโครงสร้าง (Structured Data):**
    
    - **Netmiko:** ต้องใช้คำสั่ง `send_command()` ส่งคำสั่ง CLI ตรงๆ แล้วได้ผลลัพธ์เป็นข้อความดิบ (String) ที่ต้องนำไปกรองคำเอง
        
    - **NAPALM:** มีฟังก์ชันสำเร็จรูปที่เรียกว่า **Getters** เช่น `get_facts()` หรือ `get_interfaces()` ซึ่งจะส่งคืนค่ากลับมาเป็น Python Dictionary หรือ JSON ทันทีโดยไม่ต้องเขียนสคริปต์วิเคราะห์คำ (Parser)
        
- **การใช้ภาษากลางข้ามผู้ผลิต (Unified API):**
    
    - ใน NAPALM ไม่ต้องเปลี่ยนคำสั่งตามยี่ห้ออุปกรณ์อีกต่อไป คำสั่ง `get_interfaces()` คำสั่งเดียว สามารถใช้ดึงข้อมูลอินเตอร์เฟสได้ทั้งจาก Cisco, Juniper หรือยี่ห้ออื่นๆ ที่รองรับ โดยระบบจะแปลงคำสั่งเบื้องหลังให้เอง
        
- **ระบบจัดการไฟล์คอนฟิกขั้นสูง (Advanced Config Management):**
    
    - NAPALM จะนำเสนอแนวคิดการควบคุมสถานะคอนฟิกที่ปลอดภัยกว่า Netmiko ผ่าน 4 ขั้นตอนหลัก:
        
        1. **Load:** การโหลดไฟล์คอนฟิกเข้าไปพักไว้ในหน่วยความจำอุปกรณ์ (รองรับทั้งแบบเปลี่ยนทั้งหมด - Replace หรือรวมบางส่วน - Merge)
            
        2. **Compare:** สั่งเปรียบเทียบความต่าง (Diff) ระหว่างคอนฟิกที่รันอยู่ปัจจุบันกับคอนฟิกใหม่ก่อนจะเริ่มบันทึกจริง
            
        3. **Commit:** ยืนยันการสั่งเปลี่ยนค่าคอนฟิกให้มีผลใช้งาน
            
        4. **Rollback:** สั่งดึงเอาคอนฟิกเดิมกลับคืนมาทันทีหากพบว่าระบบทำงานผิดพลาดหลังเปลี่ยนค่า

### 8. สรุปแนวทางการศึกษาต่อ

โครงสร้างสคริปต์ของ Netmiko (ตั้งค่า Dictionary $\rightarrow$ เชื่อมต่อ $\rightarrow$ สั่งงาน $\rightarrow$ ตัดการเชื่อมต่อ) คือโครงสร้างเดียวกันกับ NAPALM สิ่งที่ต้องโฟกัสถัดไปในการอ่านคู่มือหรือชุดโค้ดของ NAPALM จึงมีเพียงแค่ **วิธีการเรียกใช้งานฟังก์ชัน Getters ต่างๆ** และ **วิธีการเขียนโค้ดเพื่อเปรียบเทียบและย้อนคืนคอนฟิก (Compare & Rollback)** เท่านั้นครับ

