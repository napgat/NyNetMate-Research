# หลักฐานการตรวจทุก branch — MyNetMate

วันที่ตรวจ: 22 ตุลาคม 2569 (2026-10-22)

ตรวจ repository ของระบบ 5 แห่ง รวม remote branches ที่ยังมีอยู่จริง 21 branches และ local/cached branch refs 42 refs โดยไม่รวม symbolic HEAD ตรวจ main ล่าสุดของ Oxian เพิ่มด้วย bare clone ในโฟลเดอร์ชั่วคราวนอกพื้นที่งานเพื่อน

## วิธีตรวจ

- ใช้ `git for-each-ref` ตรวจ local และ cached remote refs; ใช้ `git ls-remote --heads` ยืนยัน remote branches ที่มีอยู่ขณะตรวจ
- Fetch origin ของ mynetmate, backend, website และ docs ด้วย `--no-recurse-submodules --no-tags` โดยไม่ checkout, merge หรือ pull
- โฟลเดอร์ `mynetmate/network-discovery/` ใช้อ่านเท่านั้น; อ่าน remote main ล่าสุดผ่าน bare clone แยกต่างหาก ไม่ fetch ลงโฟลเดอร์ที่ป้องกันไว้
- ตรวจ tree ของทุก ref, เปรียบเทียบความแตกต่างของโค้ด และอ่าน entry points, routers, services, clients, dependency manifests และไฟล์ที่แสดงการเชื่อมจริง
- refs ที่มี SHA เดียวกันใช้หลักฐานจากโค้ดชุดเดียวกัน ส่วน branch เก่าที่ remote ลบแล้วแต่ยังมี cached ref ถูกเก็บไว้ในตารางและตรวจด้วย
- source code เป็นหลักฐานของโครงสร้าง ไม่ถือว่าเอกสารออกแบบหรือการมี tests เป็นหลักฐานว่ารันทดสอบผ่านแล้ว

## Repository และ checkout ที่คงไว้

| Repository | Checkout ขณะตรวจ | HEAD | Remote branches ปัจจุบัน | Local/cached refs |
|---|---|---|---:|---:|
| `mynetmate` | `codex/travel-checkpoint-20261003` | [`84e088b`](https://github.com/Mynetmate/mynetmate/commit/84e088bb8d5bb1a5540f2ae8116dddb44f57af39) | 4 | 7 |
| `mynetmate/backend` | `feature/11-audit-writer` | [`b862c60`](https://github.com/Mynetmate/backend/commit/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4) | 5 | 12 |
| `mynetmate/website` | `feature/00-auth-audit-ui` | [`3e4d85c`](https://github.com/Mynetmate/website/commit/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251) | 7 | 12 |
| `mynetmate/docs` | `feature/00-auth-schema-location` | [`3d48827`](https://github.com/Mynetmate/docs/commit/3d48827b5b99117cac71e4a043a0b09b894ad6e4) | 4 | 8 |
| `mynetmate/network-discovery` | `main` | [`04bf232`](https://github.com/Mynetmate/oxian/commit/04bf232cdcd10c356c334acce13c47d981aeb30f) | 1 | 3 |

Root repository ของ mynetmate ที่ checkout อยู่ pin submodules เป็น backend `b862c60`, website `3e4d85c` และ docs `3d48827` จึงไม่ใช่ชุดเดียวกับ backend origin/main ล่าสุด `166e2ee`

## mynetmate

| Ref ที่ตรวจ | SHA | วันที่ commit | สถานะ ref |
|---|---|---|---|
| `codex/travel-checkpoint-20261003` | [`84e088b`](https://github.com/Mynetmate/mynetmate/commit/84e088bb8d5bb1a5540f2ae8116dddb44f57af39) | 2026-10-03 | local branch |
| `main` | [`33e10d3`](https://github.com/Mynetmate/mynetmate/commit/33e10d32b9457139d1001d018e051d80557860f5) | 2026-09-02 | local branch |
| `origin/codex/root-compose` | [`6c260a1`](https://github.com/Mynetmate/mynetmate/commit/6c260a110ae4c828a3a4eb2bb7149e2dbc8d1fff) | 2026-09-24 | remote branch ยังมีอยู่ |
| `origin/codex/travel-checkpoint-20261003` | [`84e088b`](https://github.com/Mynetmate/mynetmate/commit/84e088bb8d5bb1a5540f2ae8116dddb44f57af39) | 2026-10-03 | remote branch ยังมีอยู่ |
| `origin/dependabot/submodules/backend-44b580f` | [`e79b6e5`](https://github.com/Mynetmate/mynetmate/commit/e79b6e55c681c59220800e44f5899a19890f94b8) | 2026-09-11 | cached ref; ไม่อยู่ใน remote heads ปัจจุบัน |
| `origin/fix/selinux-compose-mount` | [`4355c80`](https://github.com/Mynetmate/mynetmate/commit/4355c802e235648243ea8b2a5192ed97727d16ae) | 2026-10-16 | remote branch ยังมีอยู่ |
| `origin/main` | [`20809e4`](https://github.com/Mynetmate/mynetmate/commit/20809e49f8094987659323fdc60acce78120ad07) | 2026-09-24 | remote branch ยังมีอยู่ |

## mynetmate/backend

| Ref ที่ตรวจ | SHA | วันที่ commit | สถานะ ref |
|---|---|---|---|
| `chore/backend-docker-compose` | [`bf44118`](https://github.com/Mynetmate/backend/commit/bf441182912b6fac1df9e80e2f75d9cd07b76b7f) | 2026-09-24 | local branch |
| `feature/00-auth-runtime-wiring` | [`aa0a205`](https://github.com/Mynetmate/backend/commit/aa0a20570364a183fdfeb677838ab5d57899dacd) | 2026-10-01 | local branch |
| `feature/11-audit-writer` | [`b862c60`](https://github.com/Mynetmate/backend/commit/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4) | 2026-10-01 | local branch |
| `main` | [`97716df`](https://github.com/Mynetmate/backend/commit/97716df28f23aebecf4f4bb049a474df54ccac9a) | 2026-08-30 | local branch |
| `origin/chore/backend-docker-compose` | [`bf44118`](https://github.com/Mynetmate/backend/commit/bf441182912b6fac1df9e80e2f75d9cd07b76b7f) | 2026-09-24 | cached ref; ไม่อยู่ใน remote heads ปัจจุบัน |
| `origin/feat-inventory-discovery-backend` | [`38028de`](https://github.com/Mynetmate/backend/commit/38028de2112213eb655d3aaea7e302f0a1a4e01c) | 2026-09-18 | cached ref; ไม่อยู่ใน remote heads ปัจจุบัน |
| `origin/feature/00-auth-runtime-wiring` | [`aa0a205`](https://github.com/Mynetmate/backend/commit/aa0a20570364a183fdfeb677838ab5d57899dacd) | 2026-10-01 | remote branch ยังมีอยู่ |
| `origin/feature/05-config-generation` | [`964992a`](https://github.com/Mynetmate/backend/commit/964992a099ed774ec2288d6054ffe1a8b8e00180) | 2026-10-08 | remote branch ยังมีอยู่ |
| `origin/feature/08-cis-security-validation` | [`0f65dd8`](https://github.com/Mynetmate/backend/commit/0f65dd8c966cb350771f00ca3cc8503fc8235636) | 2026-10-17 | remote branch ยังมีอยู่ |
| `origin/feature/11-audit-writer` | [`b862c60`](https://github.com/Mynetmate/backend/commit/b862c60d01d4c4bd5a93a176bd3d97f1c97a4eb4) | 2026-10-01 | remote branch ยังมีอยู่ |
| `origin/fix/04-network-discovery` | [`b2387b6`](https://github.com/Mynetmate/backend/commit/b2387b6a50350745dde2c66334e0af1f9c819733) | 2026-09-30 | cached ref; ไม่อยู่ใน remote heads ปัจจุบัน |
| `origin/main` | [`166e2ee`](https://github.com/Mynetmate/backend/commit/166e2eeedbc80c783ffa98c327ef9365fbb68e50) | 2026-10-22 | remote branch ยังมีอยู่ |

### Feature folders ที่พบในแต่ละ SHA

| SHA | Feature folders |
|---|---|
| `bf44118` | `ai_assisted_config`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |
| `aa0a205` | `ai_assisted_config`, `authentication`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |
| `b862c60` | `ai_assisted_config`, `audit_trail`, `authentication`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |
| `97716df` | `ai_assisted_config`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |
| `38028de` | `ai_assisted_config`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |
| `964992a` | `ai_assisted_config`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |
| `0f65dd8` | `ai_assisted_config`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |
| `b2387b6` | `ai_assisted_config`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |
| `166e2ee` | `ai_assisted_config`, `cis_security_validation`, `config_generation`, `config_version_control`, `device_groups`, `devices`, `network_device_discovery` |

ชื่อโฟลเดอร์ในตารางนี้เป็นผลค้นหาเบื้องต้น ต้องอ่าน implementation ต่อเพื่อแยก stub ออกจากโค้ดที่มีพฤติกรรมจริง การจัดสถานะใน README ใช้ผลอ่านโค้ด ไม่ใช่ชื่อโฟลเดอร์เพียงอย่างเดียว

## mynetmate/website

| Ref ที่ตรวจ | SHA | วันที่ commit | สถานะ ref |
|---|---|---|---|
| `00-auth-foundation` | [`7760bcc`](https://github.com/Mynetmate/website/commit/7760bcc3c7e9e462f9c962fd546e11754293f6a1) | 2026-09-09 | local branch |
| `chore/frontend-docker` | [`c487bd1`](https://github.com/Mynetmate/website/commit/c487bd153a88b4dda2bf0c6af3269417777a31eb) | 2026-09-24 | local branch |
| `feature/00-auth-audit-ui` | [`3e4d85c`](https://github.com/Mynetmate/website/commit/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251) | 2026-10-01 | local branch |
| `main` | [`aa367a8`](https://github.com/Mynetmate/website/commit/aa367a897b6a3d1ff0261d04cdbde0c7d2f507b4) | 2026-08-31 | local branch |
| `origin/chore/frontend-docker` | [`c487bd1`](https://github.com/Mynetmate/website/commit/c487bd153a88b4dda2bf0c6af3269417777a31eb) | 2026-09-24 | cached ref; ไม่อยู่ใน remote heads ปัจจุบัน |
| `origin/codex/auth-foundation-checkpoint-20261003` | [`7760bcc`](https://github.com/Mynetmate/website/commit/7760bcc3c7e9e462f9c962fd546e11754293f6a1) | 2026-09-09 | remote branch ยังมีอยู่ |
| `origin/feat-inventory-discovery-frontend` | [`19d7d9b`](https://github.com/Mynetmate/website/commit/19d7d9b9fe55fe2ea5f7063d844295c3d2421c0e) | 2026-09-18 | remote branch ยังมีอยู่ |
| `origin/feature/00-auth-audit-ui` | [`3e4d85c`](https://github.com/Mynetmate/website/commit/3e4d85cbc94bcaab6fd6f4e1d9cd41ce56659251) | 2026-10-01 | remote branch ยังมีอยู่ |
| `origin/feature/02-device-inventory` | [`f3fe0a8`](https://github.com/Mynetmate/website/commit/f3fe0a899fd51472d7bb6302b3e7216959ae580c) | 2026-09-04 | remote branch ยังมีอยู่ |
| `origin/feature/05-config-generation-ui` | [`ad95634`](https://github.com/Mynetmate/website/commit/ad95634ca7c10f22591c4b8a7e8267da388d74ed) | 2026-10-08 | remote branch ยังมีอยู่ |
| `origin/fix/04-network-discovery` | [`167eb88`](https://github.com/Mynetmate/website/commit/167eb8809727af1680437b712000a733dee3cfa8) | 2026-09-30 | remote branch ยังมีอยู่ |
| `origin/main` | [`28ac37b`](https://github.com/Mynetmate/website/commit/28ac37ba3d878cdbd0bdc6209cfca95bfb5c964e) | 2026-10-01 | remote branch ยังมีอยู่ |

### Feature folders ที่พบในแต่ละ SHA

| SHA | Feature folders |
|---|---|
| `7760bcc` | `devices`, `home`, `topology` |
| `c487bd1` | `devices`, `home`, `topology` |
| `3e4d85c` | `audit`, `authentication`, `devices`, `home`, `topology`, `users` |
| `aa367a8` | `home`, `topology` |
| `19d7d9b` | `devices`, `home`, `topology` |
| `f3fe0a8` | `devices`, `home`, `topology` |
| `ad95634` | `config`, `devices`, `home`, `topology` |
| `167eb88` | `devices`, `home`, `topology` |
| `28ac37b` | `devices`, `home`, `topology` |

ชื่อโฟลเดอร์ในตารางนี้เป็นผลค้นหาเบื้องต้น ต้องอ่าน implementation ต่อเพื่อแยก stub ออกจากโค้ดที่มีพฤติกรรมจริง การจัดสถานะใน README ใช้ผลอ่านโค้ด ไม่ใช่ชื่อโฟลเดอร์เพียงอย่างเดียว

## mynetmate/docs

| Ref ที่ตรวจ | SHA | วันที่ commit | สถานะ ref |
|---|---|---|---|
| `codex/docs-naphat-feature-sync` | [`31b0ea2`](https://github.com/Mynetmate/docs/commit/31b0ea24f5af0aaca5423603ef60cac21012bf66) | 2026-09-04 | local branch |
| `feature/00-auth-schema-location` | [`3d48827`](https://github.com/Mynetmate/docs/commit/3d48827b5b99117cac71e4a043a0b09b894ad6e4) | 2026-10-01 | local branch |
| `main` | [`4840f38`](https://github.com/Mynetmate/docs/commit/4840f3812eb07efc38eb6f98af900f8224a1e553) | 2026-09-24 | local branch |
| `origin/docs-king` | [`ed86d05`](https://github.com/Mynetmate/docs/commit/ed86d05cc4f38d58914aaf620d52e9ac6a0427fb) | 2026-09-17 | remote branch ยังมีอยู่ |
| `origin/docs/uml-sequence-diagrams` | [`789c9b6`](https://github.com/Mynetmate/docs/commit/789c9b6849b850c95dc634b3cc094c67a403b836) | 2026-10-16 | remote branch ยังมีอยู่ |
| `origin/feat-inventory-discovery-schema` | [`d1d9a27`](https://github.com/Mynetmate/docs/commit/d1d9a27d2880747937acf8dfa6467241f134d7aa) | 2026-09-18 | remote branch ยังมีอยู่ |
| `origin/feature/00-auth-schema-location` | [`3d48827`](https://github.com/Mynetmate/docs/commit/3d48827b5b99117cac71e4a043a0b09b894ad6e4) | 2026-10-01 | cached ref; ไม่อยู่ใน remote heads ปัจจุบัน |
| `origin/main` | [`850d3a5`](https://github.com/Mynetmate/docs/commit/850d3a53e93f003b2801b7cf421192bf2ab07611) | 2026-10-08 | remote branch ยังมีอยู่ |

## mynetmate/network-discovery

| Ref ที่ตรวจ | SHA | วันที่ commit | สถานะ ref |
|---|---|---|---|
| `main` | [`04bf232`](https://github.com/Mynetmate/oxian/commit/04bf232cdcd10c356c334acce13c47d981aeb30f) | 2026-08-26 | local branch |
| `origin/main` | [`04bf232`](https://github.com/Mynetmate/oxian/commit/04bf232cdcd10c356c334acce13c47d981aeb30f) | 2026-08-26 | remote branch ยังมีอยู่ |
| `origin/python-core` | [`26f5a35`](https://github.com/Mynetmate/oxian/commit/26f5a35ab1481459f41f7858785096cc27b56ee2) | 2026-09-04 | cached ref; ไม่อยู่ใน remote heads ปัจจุบัน |

## Oxian remote main ล่าสุด

Remote มี main ที่ `59ee94f6f6bd59dfc18020929dad894f58ab5b62` ซึ่งอ่านจาก bare clone แยกต่างหาก ส่วน checkout/cached main ในโฟลเดอร์งานเพื่อนยังเป็น `04bf232`

backend origin/main บันทึก dependency ไว้ใน `uv.lock` ตรงกับ `59ee94f` จึงใช้อ้างอิง Python runtime ของ diagram ไม่อ้างว่า backend เรียก Rust CLI หรือ Rust binding เพียงเพราะ repository ยังมี Cargo workspace

หลักฐาน: [Oxian Python API](https://github.com/Mynetmate/oxian/blob/59ee94f6f6bd59dfc18020929dad894f58ab5b62/oxian_py/__init__.py), [Python SNMP client](https://github.com/Mynetmate/oxian/blob/59ee94f6f6bd59dfc18020929dad894f58ab5b62/oxian_py/snmp/client.py)

## ขอบเขตการตรวจสอบ

Diagram ผ่านการ render ด้วย PlantUML native 1.2026.9 แบบ local และตรวจภาพ PNG หลัง render แล้ว รอบนี้ไม่ได้รันชุดทดสอบของแอป ไม่เปิด API server ไม่เปิดการค้นหาเครือข่าย และไม่ส่งคำสั่ง SSH ไปยังอุปกรณ์ สถานะในเอกสารจึงหมายถึงโค้ดและการเชื่อมที่พบ ไม่ใช่ผลรับรองการทำงานกับอุปกรณ์จริง
