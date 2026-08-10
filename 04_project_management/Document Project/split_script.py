import os
import hashlib

source_file = "CEPP68-33 Proposal.md"
split_dir = "split"
os.makedirs(split_dir, exist_ok=True)

sections = [
    {
        "filename": "01_cover-and-project-info.md",
        "title": "Cover and Project Information",
        "start": 1,
        "end": 30,
        "parent": "",
        "keywords": ["Project Title", "Members", "Advisor", "Metadata"],
        "summary": "ปกและข้อมูลเบื้องต้นของโครงงานวิศวกรรมคอมพิวเตอร์"
    },
    {
        "filename": "02_stakeholders.md",
        "title": "1. ผู้สนับสนุน/ผู้มีส่วนได้ส่วนเสีย (Stakeholders)",
        "start": 31,
        "end": 168,
        "parent": "",
        "keywords": ["Stakeholders", "IT Administrator", "Network Maintenance", "Data Center Manager"],
        "summary": "รายละเอียดกลุ่มผู้ใช้งานหลักและผู้มีส่วนได้ส่วนเสียในโครงงาน พร้อมวิเคราะห์ปัญหาและความคาดหวัง"
    },
    {
        "filename": "03_background-and-significance.md",
        "title": "2. ที่มาและความสำคัญ",
        "start": 169,
        "end": 256,
        "parent": "",
        "keywords": ["Background", "Problem Context", "Missing Aspect", "Hybrid Architecture"],
        "summary": "บริบทของปัญหาการจัดการเครือข่าย ช่องว่างของเครื่องมือในปัจจุบัน และแนวทางแก้ไขด้วยระบบอัตโนมัติผสมผสาน"
    },
    {
        "filename": "04_problem-definition-and-voc.md",
        "title": "3. การนิยามปัญหาและความต้องการ (Problem Definition & VoC)",
        "start": 257,
        "end": 376,
        "parent": "",
        "keywords": ["Voice of Customer", "Stakeholder Analysis", "Quantifiable Requirements", "Pain Points"],
        "summary": "การวิเคราะห์ผู้มีส่วนได้ส่วนเสีย เสียงของลูกค้าจากปัญหาจริง และข้อกำหนดที่วัดผลได้ (QRs) ของระบบ"
    },
    {
        "filename": "05_technical-design.md",
        "title": "4. การออกแบบทางเทคนิค (Technical Design)",
        "start": 377,
        "end": 613,
        "parent": "",
        "keywords": ["Technical Specs", "System Architecture", "Sequence Diagram", "UI Wireframes"],
        "summary": "ข้อกำหนดด้านฮาร์ดแวร์/ซอฟต์แวร์ สถาปัตยกรรมระบบ การออกแบบ UI และแผนภาพการทำงานเชิงเทคนิค"
    },
    {
        "filename": "06_feasibility-and-constraints.md",
        "title": "5. ความเป็นไปได้และข้อจำกัด (Feasibility & Constraints)",
        "start": 614,
        "end": 703,
        "parent": "",
        "keywords": ["Alternatives", "Decision Matrix", "Constraints", "Business Model Canvas"],
        "summary": "การวิเคราะห์ทางเลือกในการแก้ปัญหา ข้อจำกัดในการใช้งานจริง และโมเดลการสร้างคุณค่าของระบบ (BMC)"
    },
    {
        "filename": "07_project-plan.md",
        "title": "6. แผนการดำเนินงาน",
        "start": 704,
        "end": 728,
        "parent": "",
        "keywords": ["Project Plan", "Work Packages", "Development Phases", "Timeline"],
        "summary": "แผนการพัฒนาแบ่งเป็น 4 ระยะและ 8 กลุ่มงานหลัก ตั้งแต่การวางรากฐานจนถึงการทดสอบระบบ"
    },
    {
        "filename": "08_success-criteria.md",
        "title": "7. เกณฑ์การประเมินความสำเร็จ (Success Criteria)",
        "start": 729,
        "end": 800,
        "parent": "",
        "keywords": ["Success Criteria", "Statistical Validation", "Performance Metrics", "Robustness"],
        "summary": "เกณฑ์ความสำเร็จเชิงวิศวกรรม รวมถึงความแม่นยำ ประสิทธิภาพการตอบสนอง และผลสำเร็จจากการใช้งานจริง"
    },
    {
        "filename": "09_references.md",
        "title": "8. เอกสารอ้างอิง (Reference)",
        "start": 801,
        "end": 825,
        "parent": "",
        "keywords": ["References", "Citations", "Bibliography", "Sources"],
        "summary": "รายการเอกสารอ้างอิงทั้งหมดที่ใช้ประกอบการจัดทำข้อเสนอโครงงาน"
    },
    {
        "filename": "10_appendix-empathize-define.md",
        "title": "9. ภาคผนวก: Empathize & Define และ QRs",
        "start": 826,
        "end": 1089,
        "parent": "9. ภาคผนวก",
        "keywords": ["Root Cause Analysis", "POV", "HMW", "Engineering Characteristics"],
        "summary": "การวิเคราะห์รากเหง้าปัญหา (5 Whys), ตารางแปลง VOC เป็น QRs, เงื่อนไขการทดสอบ และตาราง EC"
    },
    {
        "filename": "11_appendix-wbs-and-risk.md",
        "title": "9. ภาคผนวก: Work Breakdown Structure และความเสี่ยง",
        "start": 1090,
        "end": 1369,
        "parent": "9. ภาคผนวก",
        "keywords": ["Work Breakdown Structure", "Gantt Chart", "Risk Management", "Effort Estimation"],
        "summary": "รายละเอียดงานย่อย (WBS), การประมาณการเวลา, แผนภาพ Gantt Chart และตารางการบริหารจัดการความเสี่ยง"
    },
    {
        "filename": "12_appendix-analysis-and-rationale.md",
        "title": "9. ภาคผนวก: การวิเคราะห์และเหตุผลทางวิศวกรรม",
        "start": 1370,
        "end": 1534,
        "parent": "9. ภาคผนวก",
        "keywords": ["Equivalent Value", "ROI", "Tier Differentiation", "Design Rationale"],
        "summary": "การวิเคราะห์ความคุ้มค่า (ROI), ความแตกต่างของระดับบริการ และเหตุผลการออกแบบทางวิศวกรรมด้านต่างๆ"
    }
]

with open(source_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

def get_word_count(text):
    return len(text.split())

orig_content = "".join(lines)
orig_word_count = get_word_count(orig_content)

total_split_word_count = 0
total_split_lines = 0

print("Split Report:")
for i, sec in enumerate(sections):
    start_idx = sec["start"] - 1
    end_idx = sec["end"]
    chunk_lines = lines[start_idx:end_idx]
    chunk_content = "".join(chunk_lines)
    
    total_split_lines += len(chunk_lines)
    total_split_word_count += get_word_count(chunk_content)
    
    order = i + 1
    frontmatter = f"""---
title: "{sec['title']}"
source_file: "{source_file}"
section_order: {order}
parent_section: "{sec['parent']}"
keywords: {str(sec['keywords']).replace("'", '"')}
summary: "{sec['summary']}"
---
"""
    file_content = frontmatter + "\n" + chunk_content
    filepath = os.path.join(split_dir, sec["filename"])
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(file_content)
        
    print(f"- {sec['filename']}: lines {sec['start']}-{sec['end']} ({len(chunk_lines)} lines)")

# Create 00_index.md
index_content = f"""---
title: "CEPP68-33 Proposal - Index"
source_file: "{source_file}"
summary: "สารบัญและแผนผังโครงสร้างของเอกสารข้อเสนอโครงงาน CEPP68-33"
---

# สารบัญและแผนผังโครงสร้าง (Index & Table of Contents)

เอกสารนี้คือรายงานข้อเสนอโครงงานวิศวกรรมคอมพิวเตอร์ เรื่อง "แอปพลิเคชันสำหรับการบริหารเครือข่ายและการกำหนดค่าเครือข่ายอัตโนมัติ" 
ซึ่งถูกแตกออกเป็นไฟล์ย่อยเพื่อความสะดวกในการค้นคืนข้อมูล โดยรักษาเนื้อหาต้นฉบับไว้ทั้งหมด 100%

## แผนผังลำดับชั้นหัวข้อและลิงก์ไปยังไฟล์ย่อย

"""

for sec in sections:
    index_content += f"- [{sec['title']}](./{sec['filename']})\n"
    if sec['filename'] == '05_technical-design.md':
        index_content += "  - [4.1. ข้อกำหนดเชิงเทคนิค](./05_technical-design.md#41-ข้อกำหนดเชิงเทคนิค)\n"
        index_content += "  - [4.2. การออกแบบเชิงภาพและสถาปัตยกรรม](./05_technical-design.md#42-การออกแบบเชิงภาพและสถาปัตยกรรม-visual-design--architecture)\n"
        index_content += "  - [4.3. การวิเคราะห์เชิงวิศวกรรม](./05_technical-design.md#43-การวิเคราะห์เชิงวิศวกรรม-engineering-analysis)\n"
    if sec['filename'] == '10_appendix-empathize-define.md':
        index_content += "  - [9.1. Empathize & Define](./10_appendix-empathize-define.md#91-empathize--define-การหารากเหง้าของปัญหา-และ-การกำหนดปัญหาที่ชัดเจน)\n"
        index_content += "  - [9.2. การแปลงความต้องการเป็นข้อกำหนดทางเทคนิค](./10_appendix-empathize-define.md#92-การแปลงความต้องการเป็นข้อกำหนดทางเทคนิค-voc-translation-matrix--qrs)\n"
        index_content += "  - [9.3. ตารางข้อกำหนดเชิงวิศวกรรม](./10_appendix-empathize-define.md#93-ตารางข้อกำหนดเชิงวิศวกรรม-engineering-characteristic---ec-table)\n"
    if sec['filename'] == '11_appendix-wbs-and-risk.md':
        index_content += "  - [9.4. โครงสร้างงานในแต่ละระดับ (WBS) และ Gantt Chart](./11_appendix-wbs-and-risk.md#94-โครงสร้างงานในแต่ละระดับ-work-breakdown-structure)\n"
        index_content += "  - [9.4.5. การประเมินและบริหารจัดการความเสี่ยง](./11_appendix-wbs-and-risk.md#945-การประเมินและบริหารจัดการความเสี่ยง-risk-management)\n"
    if sec['filename'] == '12_appendix-analysis-and-rationale.md':
        index_content += "  - [9.5. การวิเคราะห์มูลค่าเทียบเท่าที่ประหยัดได้](./12_appendix-analysis-and-rationale.md#95-การวิเคราะห์มูลค่าเทียบเท่าที่ประหยัดได้-equivalent-value-analysis)\n"
        index_content += "  - [9.6. ผลการวิเคราะห์ความแตกต่างระหว่างระดับการให้บริการ](./12_appendix-analysis-and-rationale.md#96-ผลการวิเคราะห์ความแตกต่างระหว่างระดับการให้บริการ-tier-differentiation-analysis)\n"
        index_content += "  - [9.7. การออกแบบและการให้เหตุผลทางวิศวกรรม](./12_appendix-analysis-and-rationale.md#97-การออกแบบและการให้เหตุผลทางวิศวกรรม-design-methodology--rationale)\n"

index_filepath = os.path.join(split_dir, "00_index.md")
with open(index_filepath, "w", encoding="utf-8") as f:
    f.write(index_content)

print(f"\nOriginal lines: {len(lines)}, Split lines: {total_split_lines}")
print(f"Original word count: {orig_word_count}, Split word count: {total_split_word_count}")
if orig_word_count == total_split_word_count and len(lines) == total_split_lines:
    print("Verification Passed: 100% Match.")
else:
    print("Verification Failed: Mismatch in lines or words.")
