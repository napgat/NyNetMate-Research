from pathlib import Path
import json, zipfile, os, re
root=Path(r"E:\CEPP Project\หลักศูตร\KMITL_Knowledge\Project\outputs\thesis\sequence-diagram\naphat")
mer=root/"mermaid"
name="fig-3-13-user-management"
spec=next(x for x in json.loads((root/"diagrams.json").read_text(encoding="utf-8")) if x["id"]==name)
assert spec["actor"]=="Admin" and spec["frontend"]=="Frontend"
assert spec["service"]=="User Management Service" and spec["separateService"] is True
mmd=(mer/(name+".mmd")).read_text(encoding="utf-8")
assert "font-size:17px!important" in mmd
assert "participant B as Backend" in mmd and "participant S as User Management Service" in mmd
assert "actor U as Admin" in mmd
assert "-->>" not in mmd
nreturns=len(re.findall(r"(?m)^\s+[UFBSD]--\)[UFBSD]:",mmd))
assert nreturns>=10,nreturns
for folder in (root,mer):
  results=json.loads((folder/"render-qa.json").read_text(encoding="utf-8"))
  row=next(q for q in results if q["id"]==name)
  assert row["errors"]==[],row["errors"]
  assert row["messageCount"]==26,row["messageCount"]
def repack(archive,folder,files):
  tmp=archive.with_name(archive.name+".tmp")
  with zipfile.ZipFile(archive,"r") as src,zipfile.ZipFile(tmp,"w") as dst:
    existing={m.filename for m in src.infolist()}
    assert set(files)<=existing,sorted(set(files)-existing)
    for info in src.infolist():
      dst.writestr(info,(folder/info.filename).read_bytes() if info.filename in files else src.read(info.filename))
  os.replace(tmp,archive)
  with zipfile.ZipFile(archive) as z:
    assert all(z.read(name)==(folder/name).read_bytes() for name in files)
  print("ZIP_UPDATED_AND_VERIFIED",archive.name,"entries",len(files))
repack(root/"naphat-sequence-diagrams.zip",root,[name+x for x in (".drawio",".png",".puml",".svg")]+["naphat-sequence-diagrams.drawio"])
repack(mer/"naphat-mermaid-sequences.zip",mer,[name+x for x in (".mmd",".png",".svg")]+["build-mermaid.cjs","naphat-sequence-diagrams.md","preview.html","render-qa.json"])
(root/"_edit_user_management_tmp.py").unlink(missing_ok=True)
print("SUCCESS fig-3-13-user-management returns",nreturns,"font 17px QA clean")
