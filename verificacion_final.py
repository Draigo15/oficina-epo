# -*- coding: utf-8 -*-
from docx import Document

doc = Document("INFORME_FINAL_SISTEMA_v2.docx")
paras = doc.paragraphs

print(f"Total parrafos: {len(paras)}")
print()

# Estructura completa de Cap IV solo headings
cap4 = None
for i, p in enumerate(paras):
    if "CAPÍTULO IV" in p.text and p.style.name == "Heading 1":
        cap4 = i
        break

print(f"=== ESTRUCTURA CAP IV HEADINGS desde [{cap4}] ===")
for i in range(cap4, len(paras)):
    p = paras[i]
    t = p.text.strip()
    if not t:
        continue
    if p.style.name == "Heading 1" and i > cap4:
        print(f"\n[{i}] [H1] *** {t[:70]} ***")
        break
    if p.style.name in ["Heading 1", "Heading 2", "Heading 3"]:
        print(f"[{i}] [{p.style.name}] {t[:80]}")
    elif t.startswith("Narrativa del Caso") or t.startswith("CS-") or t.startswith("RF-"):
        print(f"[{i}] [{p.style.name}]   -> {t[:80]}")

print()
print("=== ZONA NARRATIVAS (principales) ===")
for i, p in enumerate(paras):
    t = p.text.strip()
    if t.startswith("Narrativa del Caso de Uso"):
        print(f"[{i}] {t}")

print()
print("=== ZONA RF TAREASLIPO 5 primeras lineas ===")
for i, p in enumerate(paras):
    t = p.text.strip()
    if "Módulo de Gestión de Tareas" in t and p.style.name == "Heading 3":
        for j in range(i, min(i+20, len(paras))):
            t2 = paras[j].text.strip()
            if t2:
                print(f"[{j}] [{paras[j].style.name}] {t2[:90]}")
        break

print()
print("=== ZONA CRONOGRAMA/COSTOS ===")
for i, p in enumerate(paras):
    t = p.text.strip()
    if ("Cronograma" in t or "cronograma" in t or "VAN" in t or "TIR" in t or
        "Costo" in t or "Inversion" in t.replace("ó","o").replace("é","e")):
        if p.style.name in ["Heading 3", "Normal", "Body Text"]:
            print(f"[{i}] [{p.style.name}] {t[:90]}")
