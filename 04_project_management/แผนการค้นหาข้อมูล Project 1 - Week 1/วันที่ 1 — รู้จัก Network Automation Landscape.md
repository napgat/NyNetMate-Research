
### ดู Tool ที่มีอยู่แล้ว (ลึกแค่ไหน: รู้จัก + เข้าใจว่าทำอะไร)**
[[What is Network Automationa]]

เพื่อให้เห็นภาพของเครื่องมือ (Tools) ที่ต้องนำมาพัฒนาและใช้งานจริง ควรเจาะลึกไปที่ 5 กลุ่มหลักซึ่งเป็นแกนกลางของระบบ Network Management และ Configuration Automation ดังนี้

1. **Script-Driven & Multi-Vendor Automation** (การสั่งการอุปกรณ์หลายค่าย)
	* **Tools:** Python libraries เช่น 
		* `Netmiko` (สำหรับดึงและส่งค่าผ่าน SSH), 
		* `NAPALM` (สำหรับการจัดการคอนฟิกข้ามผู้ผลิตด้วยโครงสร้างข้อมูลเดียวกัน), หรือ 
		* `Nornir` (สำหรับการรันคำสั่งพร้อมกันหลายอุปกรณ์เพื่อลดเวลาประมวลผล)
		* `Ansible` agentless เครื่องมือทางเหลือ ทดแทน การเขียนโค้ด Python ดิบด้วย Nornir และ Netmiko ทั้งระบบ
	* [[อ่านเนื้อหาเชิงลึกเพิ่มเติม SD& MVA]]
	
2. Network Discovery (การค้นหาและสร้างแผนผังเครือข่าย)
	* **Tools:** การเขียนสคริปต์เพื่อประมวลผลข้อมูลจากการทำงานของ OSPF, ARP, และ MAC address tables รวมถึงการใช้งาน SNMP หรือ RESTCONF API สำหรับดึงข้อมูลโครงสร้างพื้นฐาน
	* [[อ่านเนื้อหาเชิงลึกเพิ่มเติม ND]]

3. AI Integration & Configuration Generation (การประยุกต์ใช้ AI)
	เจาะลึกวิธีการนำ Large Language Models (LLMs) เข้ามาช่วยสร้างการตั้งค่าและตรวจสอบความถูกต้องของระบบ
	* ***Tools:** เฟรมเวิร์กสำหรับการทำ Retrieval-Augmented Generation (RAG) อย่าง 
		* `LangChain` หรือ `LlamaIndex` เพื่อดึงคลังข้อมูล (Rule libraries) มาสังเคราะห์เป็นชุดคำสั่ง และใช้ในการตรวจจับข้อมูลที่ละเอียดอ่อน (Sensitive information) ก่อนนำไปใช้งานจริง
	*[[อ่านเนื้อหาเชิงลึกเพิมเติม AII&CG]]
	
4. Security Automation & Policy Validation (การตรวจสอบความปลอดภัย)
	* ***Tools:** ตัววิเคราะห์ข้อมูล (Parsers) ที่เขียนขึ้นเพื่อดึงคอนฟิกออกมาเทียบกับมาตรฐานความปลอดภัย เช่น การตรวจสอบ CIS Benchmarks ให้ผ่านเกณฑ์ขั้นต่ำ (เช่น จำนวน 24 กฎ) แบบอัตโนมัติ
	* [[อ่านเนื้อหาเชิงลึกเพิ่มเติม SA & PV]]
	
5. Software Layer (โครงสร้างสถาปัตยกรรมซอฟต์แวร์)** เจาะลึกแพลตฟอร์มที่ใช้เป็นตัวกลางระหว่างผู้ใช้งาน ผู้ดูแลระบบ และโครงสร้างเครือข่าย
	* ***Tools:** `FastAPI` และ `SQLAlchemy` สำหรับจัดการระบบ Backend และฐานข้อมูล ทำงานควบคู่กับเทคโนโลยีฝั่ง Frontend เช่น `React`, `Next.js`, และ `Tailwind CSS` เพื่อแสดงผล UI/UX Dashboard
	* [[อ่านเนื้อหาเชิงลึกเพิ่มเติม SL]]


###  4 องค์ความรู้พื้นฐาน (Prerequisites) 
1. Data Serialization Formats (ภาษาโครงสร้างข้อมูล)

	นี่คือสิ่งที่สำคัญที่สุดในการทำ Automation เพราะคอมพิวเตอร์ไม่ได้สื่อสารกันด้วยข้อความดิบ (Raw Text) คุณจำเป็นต้องอ่านและเขียน 3 ฟอร์แมตนี้ให้คล่อง:
	
	- **JSON (JavaScript Object Notation):** โครงสร้างหลักที่ต้องใช้ตลอดเวลา ไม่ว่าจะเป็นการรับข้อมูลจาก RESTCONF API, การส่งข้อมูลระหว่าง Backend (เช่น FastAPI) ไปยัง Frontend (เช่น React/Next.js) หรือการดึงข้อมูลไปทำ RAG Pipeline
	    
	- **YAML (YAML Ain't Markup Language):** โครงสร้างที่บังคับใช้ในการเขียน Playbook ของ Ansible และไฟล์จัดการ Inventory ของ Nornir (ข้อควรระวัง: YAML อ่อนไหวต่อการเว้นวรรคและอักขระพิเศษมาก หากมีแท็กแปลกปลอมหลุดเข้าไป สคริปต์จะพังทันที)
	    
	- **XML (eXtensible Markup Language):** ต้องใช้เมื่อคุณเชื่อมต่อกับอุปกรณ์ผ่านโปรโตคอล NETCONF โครงสร้างจะคล้าย HTML ที่มีแท็กเปิดปิด
	    
 2. Version Control (ระบบจัดการเวอร์ชันโค้ด)
	เมื่อการตั้งค่าเครือข่ายเปลี่ยนมาอยู่ในรูปแบบไฟล์โค้ด (Infrastructure as Code) การเก็บสคริปต์ไว้ในโฟลเดอร์เฉยๆ จะทำให้ทำงานร่วมกับผู้อื่นได้ยาก
	- **Git:** ต้องเข้าใจคำสั่งพื้นฐาน (commit, push, pull, branch) เพื่อใช้จัดเก็บไฟล์สคริปต์ Nornir/Netmiko หรือ YAML Playbook อย่างเป็นระบบ และสามารถย้อนกลับ (Rollback) ได้เมื่อโค้ดมีปัญหา
	
 3. Python Environment & Dependency Management
	การรันสคริปต์ Automation ที่มีไลบรารีหลากหลาย (Netmiko, NAPALM, Nornir, SQLAlchemy) มักจะเกิดปัญหาเวอร์ชันชนกัน (Dependency conflicts)
	
	- **Virtual Environments (เช่น `venv` หรือ `poetry`):** ต้องรู้วิธีสร้างสภาพแวดล้อมจำลองเพื่อแยกไลบรารีของโปรเจกต์นี้ออกจากระบบหลักของเครื่องคอมพิวเตอร์ เพื่อให้โค้ดทำงานได้อย่างเสถียร
 4. Basic Linux & SSH Key Management

	ระบบ Network Automation ส่วนใหญ่มักถูกนำไปรันบนเซิร์ฟเวอร์ Linux และใช้ SSH เป็นแกนหลัก
	- **SSH Keys:** ต้องเข้าใจวิธีการสร้างและจัดการ Public/Private Key เพื่อให้ระบบ (เช่น Ansible หรือ Nornir) สามารถล็อกอินเข้าอุปกรณ์เครือข่ายต่างๆ หรือดึงข้อมูลได้อัตโนมัติโดยไม่ต้องคอยพิมพ์รหัสผ่านทุกครั้ง
    

### ตำแหน่งของโปรโตคอล (Protocols)

โปรโตคอลคือช่องทางขนส่ง (Transport) คำสั่งและข้อมูลระหว่างซอฟต์แวร์กับฮาร์ดแวร์ จะอยู่ในส่วนของการเชื่อมต่อระบบ:

- **กลุ่ม 1 (Script-Driven Automation):** การส่งคำสั่งไปจัดการอุปกรณ์ที่มาจากหลากหลายผู้ผลิต (เช่น Cisco, MikroTik, Huawei) ต้องอาศัยโปรโตคอลเป็นสื่อกลาง เช่น 
	- การใช้ **SSH** เป็นช่องทางหลักเมื่อเขียนสคริปต์ด้วย Netmiko หรือ
	- การใช้ **NETCONF** และ **RESTCONF** สำหรับการจัดการการตั้งค่าในระดับโครงสร้าง
    
- **กลุ่ม 2 (Network Discovery):** การดึงพารามิเตอร์เครือข่าย เช่น ตารางเส้นทาง OSPF, ข้อมูล ARP หรือตาราง MAC address เพื่อนำมาวิเคราะห์และวาด Topology ระบบจะต้องใช้โปรโตคอลอย่าง 
	- **SNMP** หรือ **REST API** เพื่อส่งคำขอและรับข้อมูลสถานะจากอุปกรณ์กลับมายังส่วนกลาง

###[[ Ansible Vs Nornir]]

### **YANG Model และ Data Model อื่นๆ** 
คือ "ระดับโครงสร้างอ้างอิง (Schema)" ที่ครอบหัวข้อ Data Serialization (JSON/XML) ไว้อีกชั้นหนึ่ง
ลิงค์ : https://www.claise.be/yang-opensource-tools-for-data-modeling-driven-management/

![[Pasted image 20260705163342.png]]
การทำ Network Automation จะต้องแยกความแตกต่างระหว่าง "แบบแปลน" และ "สิ่งที่ใช้ส่งข้อมูลจริง" ให้ออก ดังนี้:

ความสัมพันธ์ระหว่าง Data Model และ Data Format

- **Data Model (แบบแปลน/พิมพ์เขียว):** ตัวกำหนดโครงสร้าง ข้อบังคับ และชนิดของตัวแปร (เช่น YANG Model บังคับว่า IP Address ต้องเป็นชุดตัวเลขเท่านั้น)
    
- **Data Format (วัสดุที่ใช้สื่อสาร):** รูปแบบข้อความจริงที่วิ่งผ่านสายแลน (เช่น JSON หรือ XML) ซึ่งต้องเขียนออกมาให้ถูกต้องตามที่ Data Model กำหนดไว้
    
**Data Model อื่นๆ ที่ต้องใช้งานในระบบ Network Automation**

ในสถาปัตยกรรมเครือข่าย คุณจะพบ Data Model 3 กลุ่มหลักที่ใช้งานตามความเก่า-ใหม่ของอุปกรณ์และบริบทของระบบ:

#### 1. YANG Models (สำหรับโครงสร้าง API สมัยใหม่)

นี่คือโมเดลหลักในยุคปัจจุบัน ใช้ร่วมกับโปรโตคอล NETCONF และ RESTCONF โดยแบ่งย่อยออกเป็น 3 สาย:

- **OpenConfig:** โมเดลมาตรฐานที่ผลักดันโดยบริษัทระดับโลก (เช่น Google, Microsoft) เป้าหมายคือบังคับให้อุปกรณ์ทุกค่าย (Cisco, Juniper, Huawei) ใช้ Data Model หน้าตาเดียวกัน เป็นหัวใจสำคัญของการทำ Multi-Vendor Automation
    
- **IETF YANG:** โมเดลมาตรฐานสากลจากองค์กร IETF ครอบคลุมการตั้งค่าเครือข่ายพื้นฐาน
    
- **Vendor-Specific YANG:** โมเดลที่ผู้ผลิตแต่ละยี่ห้อเขียนขึ้นมาเอง ใช้สำหรับตั้งค่าฟีเจอร์พิเศษเชิงลึกที่ไม่มีในมาตรฐานกลาง
    

#### 2. MIBs (Management Information Base) (สำหรับอุปกรณ์ยุคเก่า)

- เป็น Data Model ยุคดั้งเดิมที่ใช้คู่กับโปรโตคอล **SNMP**
    
- แทนที่จะใช้ชื่อตัวแปรที่อ่านเข้าใจง่ายแบบ YANG โครงสร้าง MIBs จะจัดเก็บข้อมูลในรูปแบบตัวเลข OID (Object Identifier) เช่น `1.3.6.1.2.1.2.2.1.2` เพื่อชี้ไปยังคำอธิบายของอินเตอร์เฟส
    
- ยังจำเป็นต้องศึกษาหากในเครือข่ายมีสวิตช์รุ่นเก่า หรือต้องทำระบบ Network Monitoring เชิงลึก
    

#### 3. OpenAPI / JSON Schema (สำหรับ Software Layer)

- เมื่อคุณดึงข้อมูลจากอุปกรณ์เครือข่ายได้แล้ว และต้องการนำไปสร้างระบบ Backend (กลุ่มที่ 5) ด้วยแพลตฟอร์มอย่าง `FastAPI`
    
- คุณต้องเปลี่ยนจาก YANG Model มาใช้ Data Model ฝั่งซอฟต์แวร์ เช่น **Pydantic Models** หรือ **OpenAPI (Swagger)** เพื่อกำหนดขอบเขตว่า API ของคุณจะอนุญาตให้ Dashboard หรือระบบ AI ส่งข้อมูลเข้ามาในรูปแบบใด
    


**สรุปการทำงานร่วมกัน:**

คุณเปิดอ่าน **YANG Model (OpenConfig)** เพื่อดูโครงสร้าง $\rightarrow$ จากนั้นยิง API ไปที่อุปกรณ์ $\rightarrow$ อุปกรณ์ตอบกลับมาเป็น **JSON Format** $\rightarrow$ คุณนำ JSON นั้นไปป้อนให้ **Pydantic Model** ใน `FastAPI` เพื่อบันทึกลงฐานข้อมูล

ต้องการให้เจาะลึกโครงสร้างการทำงานของโมเดลกลางอย่าง OpenConfig เพื่อให้เห็นภาพการสั่งงานข้ามค่าย หรือต้องการขยับไปหัวข้อการประยุกต์ใช้ AI (AI Integration & Configuration Generation) ในกลุ่มที่ 3 เป็นลำดับต่อไปครับ?



### เว็บไซต์ที่เกี่ยวข้องโดยตรง

**[[Netdisco]] กับ - [[SolarWinds Hybrid Cloud Observability]]


[[จากภาพพี่ออม]]
### ขั้นตอนที่บังคับให้ตัดสินใจก่อนว่าจะรองรับ Use Case อะไรบ้าง
 เช่น:
- IP Interface
- VLAN
- Dynamic Routing (OSPF/BGP)
- ACL
- SSH/Telnet
ถ้าไม่ Define ก่อน → ดู Pattern ไปก็ไม่รู้ว่าพอหรือยัง
### ✅ ตอบ "Config Use Cases อะไรบ้าง?" ได้แล้ว

| Use Case           | Template ที่ต้องสร้าง                  |
| ------------------ | -------------------------------------- |
| Basic device setup | hostname, banner, no ip domain-lookup  |
| Interface config   | ip address / switchport mode           |
| VLAN + SVI         | vlan X / interface vlan X / ip address |
| Static route       | ip route X X X                         |
| OSPF               | router ospf / network X                |
| SSH & Security     | crypto key / ip ssh version 2          |
| Syslog             | logging host X                         |
| SNMP               | snmp-server community                  |

### วิเคราะห์ว่า Inventory ควรเก็บข้อมูลอะไรบ้าง

อาจารย์ถามตรงๆ ว่า:

> _"อยากจะให้เราไปว่าใน Inventory เราจะเก็บรูปแบบใด เก็บอะไรบ้าง เพื่อให้ทำส่วนอื่นเช่น Suggest Config เราจะได้รู้ว่าจะเอามาเชื่อมต่อกับ Inventory อย่างไร"_

Day 1 ไม่มีขั้นตอนนี้เลย ทั้งที่อาจารย์บอกว่า Inventory เป็น **หัวใจสำคัญที่ต้องแน่นก่อน**
Mockup นี้ **= Database Schema แบบ Draft** เลยครับ แต่ละ Tab = แต่ละ Table หรือ Sub-schema:

```
Device Table:
  - hostname, domain, vendor, role, site_location
  - mgmt_ip, subnet_mask, gateway
  - enable_password (encrypted), ssh_username, ssh_password (encrypted)
  - ntp_server_1, ntp_server_2
  - dns_server_1, dns_server_2
  - snmp_community_ro (encrypted), snmp_community_rw (encrypted)
  - snmp_trap_host

Interface Table (FK → Device):
  - name, ip_address, description, mode, status

VLAN Table (FK → Device):
  - vlan_id, name, svi_ip

Route Table (FK → Device):
  - type (static/dynamic), destination, mask, next_hop
  - protocol, process_id, router_id, networks
    
Service Table (FK → Device):
  - ssh_v2, telnet, http, https, cdp, lldp, stp, poe
  - motd_banner, syslog_server, log_level
```



###  ตอบ "PII Fields ที่ต้อง Mask ก่อนส่ง AI"
```python
CRITICAL_FIELDS = [

"enable_password", # -> [MASKED_PASSWORD]

"ssh_password", # -> [MASKED_PASSWORD]

"snmp_community_ro", # -> [MASKED_SNMP]

"snmp_community_rw", # -> [MASKED_SNMP]

]

SENSITIVE_FIELDS = [

"mgmt_ip", # -> [MASKED_IP]

"snmp_trap_host", # -> [MASKED_IP]

"syslog_server", # -> [MASKED_IP]

]
```

|จุดที่เกินจริง|ปัญหาจริง|
|---|---|
|Vendor รองรับ 4 เจ้า (Cisco, Juniper, MikroTik, Arista)|อาจารย์แนะนำแค่ Cisco ก่อน|
|Dynamic Routing รองรับ OSPF/BGP/EIGRP/RIP พร้อมกัน|แต่ละ Protocol Syntax ต่างกันมาก ต้องเขียน Template แยก|
|"Ask Claude to review" ปุ่มเดียวจบ|จริงๆ ต้องมี Validation layer แยก + PII Masking ก่อนส่งทุกครั้ง|
### [[Microsoft Presidio]] คืออะไร
### [[Restore Strategy]]

อาจารย์ถามตรงๆ ว่าจะเลือกแบบไหน:

- **Save Game** (กด manual แล้วดึง Config มาเก็บ)
- **Time-based** (Backup ทุก 1-2 ชั่วโมง)
- **Schedule** (ถ้า diff ไม่เปลี่ยนก็ไม่เก็บ)

ทีมยังไม่ได้ตัดสินใจเรื่องนี้ และมันกระทบการออกแบบ DB Schema โดยตรง ควรอยู่ใน Day 1 เพราะเป็น fundamental decision


ชื่อโปรเจค : MyNetMate
## [[การตัดสินใจ ใช้ AI vs ไม่ใช้ AI ในโปรเจกต์]]


### VLAN Pattern / Jinja Template
รุ่น IOS ที่สนใจ
Router : **Cisco IOS XE**  **17.03.04a** : (ISR4000)
Switch : C2960 Software : [[Config C2960 VLAN]] 
