from pathlib import Path
import json, zipfile, os, re
root=Path(r"E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\outputs\thesis\sequence-diagram\naphat")
mer=root/"mermaid"
name="fig-3-14-audit-history"
spec=next(x for x in json.loads((root/"diagrams.json").read_text(encoding="utf-8")) if x["id"]==name)
assert spec["actor"]=="Admin" and spec["frontend"]=="Frontend"
assert spec["service"]=="Audit Read Service" and spec["separateService"] is True
mmd=(mer/(name+".mmd")).read_text(encoding="utf-8")
assert "font-size:17px!important" in mmd
assert "participant B as Backend" in mmd and "participant S as Audit Read Service" in mmd
assert "actor U as Admin" in mmd and "-->>" not in mmd
count=len(re.findall(r"(?m)^\s+[UFBSD]--\)[UFBSD]:",mmd))
assert count>=9,count
for folder in (root,mer):
    qa=json.loads((folder/"render-qa.json").read_text(encoding="utf-8"))
    row=next(x for x in qa if x["id"]==name)
    assert row["errors"]==[],row["errors"]
    assert row["messageCount"]==26,row["messageCount"]
def repack(archive,folder,changed):
    tmp=archive.with_name(archive.name+".tmp")
    with zipfile.ZipFile(archive,"r") as inp,zipfile.ZipFile(tmp,"w") as out:
        original={i.filename for i in inp.infolist()}
        assert set(changed) <= original,sorted(set(changed)-original)
        for info in inp.infolist():
            content=(folder/info.filename).read_bytes() if info.filename in changed else inp.read(info.filename)
            out.writestr(info,content)
    os.replace(tmp,archive)
    with zipfile.ZipFile(archive) as z:
        assert all(z.read(f)==(folder/f).read_bytes() for f in changed)
    print("ZIP_VERIFIED",archive.name,len(changed))
repack(root/"naphat-sequence-diagrams.zip",root,[name+e for e in (".drawio",".puml",".png",".svg")]+["naphat-sequence-diagrams.drawio"])
repack(mer/"naphat-mermaid-sequences.zip",mer,[name+e for e in (".mmd",".png",".svg")]+["build-mermaid.cjs","naphat-sequence-diagrams.md","preview.html","render-qa.json"])
print("AUDIT_HISTORY VERIFIED",count,"return arrows; font 17px; 26 messages")
