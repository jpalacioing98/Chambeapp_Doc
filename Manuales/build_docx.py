"""
Genera un DOCX ESTRUCTURADO (no una conversión plana) a partir del manual
extensivo en Markdown.

Incluye:
  · Portada
  · Página de control del documento + convenciones
  · Índice automático (campo TOC de Word)
  · Portadillas por PARTE
  · Jerarquía Heading 1/2/3
  · Tablas con cabecera repetida, filas que no se parten y cebreado
  · Bloques de código con fondo y borde
  · Callouts (nota / advertencia / éxito / peligro)
  · Listas con viñeta y listas numeradas reiniciadas manualmente
  · Encabezado y pie con numeración "Página X de Y"
  · Propiedades del documento

Uso:
    python tools/build_manual_docx.py
    python tools/build_manual_docx.py --input ruta.md --output ruta.docx
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

PRIMARY = RGBColor(0xB8, 0x27, 0x27)
PRIMARY_HEX = "B82727"
DARK = RGBColor(0x2D, 0x34, 0x36)
GRAY = RGBColor(0x63, 0x6E, 0x72)
MUTED = RGBColor(0x8A, 0x94, 0x9A)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

BORDER = "D0D7DE"
CODE_BG = "F6F8FA"
ZEBRA = "F8F9FA"
INFO_BG = "EAF2FB"
INFO_BORDER = "4A90E2"
WARN_BG = "FFF6E5"
WARN_BORDER = "E0A100"
OK_BG = "E8F7F1"
OK_BORDER = "00A37A"
DANGER_BG = "FDECEA"
DANGER_BORDER = "D93025"


# ---------------------------------------------------------------------------
# Helpers OOXML
# ---------------------------------------------------------------------------

def _el(tag: str, **attrs) -> OxmlElement:
    element = OxmlElement(tag)
    for key, value in attrs.items():
        element.set(qn(f"w:{key}"), str(value))
    return element


def shade_paragraph(paragraph, fill: str) -> None:
    p_pr = paragraph._p.get_or_add_pPr()
    p_pr.append(_el("w:shd", val="clear", color="auto", fill=fill))


def border_paragraph(paragraph, side="bottom", color=BORDER, size=8, space=2):
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = p_pr.find(qn("w:pBdr"))
    if p_bdr is None:
        p_bdr = OxmlElement("w:pBdr")
        p_pr.append(p_bdr)
    p_bdr.append(
        _el(f"w:{side}", val="single", sz=size, space=space, color=color)
    )


def shade_cell(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_pr.append(_el("w:shd", val="clear", color="auto", fill=fill))


def cell_margins(cell, top=90, bottom=90, left=110, right=110) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    mar = OxmlElement("w:tcMar")
    for side, value in (
        ("top", top),
        ("bottom", bottom),
        ("left", left),
        ("right", right),
    ):
        mar.append(_el(f"w:{side}", w=value, type="dxa"))
    tc_pr.append(mar)


def table_borders(table, color=BORDER, size=4) -> None:
    tbl = table._tbl
    tbl_pr = tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        borders.append(
            _el(f"w:{side}", val="single", sz=size, space=0, color=color)
        )
    tbl_pr.append(borders)


def repeat_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tr_pr.append(_el("w:tblHeader", val="true"))
    tr_pr.append(_el("w:cantSplit", val="true"))


def cant_split(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tr_pr.append(_el("w:cantSplit", val="true"))


def add_field(paragraph, instruction: str, placeholder: str = "1") -> None:
    run = paragraph.add_run()
    run._r.append(_el("w:fldChar", fldCharType="begin"))
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = f" {instruction} "
    run._r.append(instr)
    run._r.append(_el("w:fldChar", fldCharType="separate"))
    text = OxmlElement("w:t")
    text.text = placeholder
    run._r.append(text)
    run._r.append(_el("w:fldChar", fldCharType="end"))


# ---------------------------------------------------------------------------
# Estilos
# ---------------------------------------------------------------------------

def build_styles(doc: Document) -> None:
    styles = doc.styles

    normal = styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = DARK
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.14
    normal.paragraph_format.line_spacing_rule = WD_LINE_SPACING.MULTIPLE

    for name, size, color, before, after in (
        ("Heading 1", 17, PRIMARY, 20, 8),
        ("Heading 2", 13.5, DARK, 16, 6),
        ("Heading 3", 11.5, GRAY, 12, 4),
        ("Heading 4", 10.5, GRAY, 10, 4),
    ):
        style = styles[name]
        style.font.name = "Calibri"
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = color
        style.font.italic = False
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True

    # Código
    code = styles.add_style("Chambe Code", WD_STYLE_TYPE.PARAGRAPH)
    code.base_style = styles["Normal"]
    code.font.name = "Consolas"
    code.font.size = Pt(8.5)
    code.font.color.rgb = RGBColor(0x1E, 0x1E, 0x1E)
    code.paragraph_format.space_before = Pt(4)
    code.paragraph_format.space_after = Pt(8)
    code.paragraph_format.line_spacing = 1.0
    code.paragraph_format.left_indent = Cm(0.3)
    code.paragraph_format.right_indent = Cm(0.2)

    # Callout base
    callout = styles.add_style("Chambe Callout", WD_STYLE_TYPE.PARAGRAPH)
    callout.base_style = styles["Normal"]
    callout.font.size = Pt(9.8)
    callout.paragraph_format.left_indent = Cm(0.35)
    callout.paragraph_format.right_indent = Cm(0.2)
    callout.paragraph_format.space_before = Pt(8)
    callout.paragraph_format.space_after = Pt(10)

    # Celda de tabla
    cell = styles.add_style("Chambe Cell", WD_STYLE_TYPE.PARAGRAPH)
    cell.base_style = styles["Normal"]
    cell.font.size = Pt(8.7)
    cell.paragraph_format.space_before = Pt(0)
    cell.paragraph_format.space_after = Pt(0)
    cell.paragraph_format.line_spacing = 1.05

    caption = styles.add_style("Chambe Caption", WD_STYLE_TYPE.PARAGRAPH)
    caption.base_style = styles["Normal"]
    caption.font.size = Pt(8.5)
    caption.font.italic = True
    caption.font.color.rgb = MUTED
    caption.paragraph_format.space_before = Pt(2)
    caption.paragraph_format.space_after = Pt(10)


# ---------------------------------------------------------------------------
# Inline markdown
# ---------------------------------------------------------------------------

INLINE_RE = re.compile(
    r"(\*\*.+?\*\*|`[^`]+`|\*[^*\n]+?\*|~~.+?~~|\[[^\]]+\]\([^)]+\))"
)

SECTION_MAP: dict[int, int] = {}


def remap_refs(text: str) -> str:
    if not SECTION_MAP:
        return text

    def repl(match: re.Match) -> str:
        plural = match.group(1) or ""
        old = int(match.group(2))
        new = SECTION_MAP.get(old, old)
        return f"Sección{plural} {new}"

    return re.sub(r"\bSecci[oó]n(es)?\s+(\d+)\b", repl, text)


def strip_number(text: str) -> str:
    return re.sub(r"^\d+(?:\.\d+)*[.)]?\s+", "", text).strip()


def clean_html(text: str) -> str:
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</?[a-zA-Z][^>]*>", "", text)
    return text


def add_inline(paragraph, text: str, base_bold: bool = False) -> None:
    text = remap_refs(text)
    text = clean_html(text)
    parts = INLINE_RE.split(text)
    for part in parts:
        if not part:
            continue
        bold = base_bold
        italic = False
        mono = False
        strike = False
        value = part

        if part.startswith("**") and part.endswith("**") and len(part) > 4:
            bold = True
            value = part[2:-2]
        elif part.startswith("`") and part.endswith("`") and len(part) > 2:
            mono = True
            value = part[1:-1]
        elif part.startswith("~~") and part.endswith("~~") and len(part) > 4:
            strike = True
            value = part[2:-2]
        elif part.startswith("*") and part.endswith("*") and len(part) > 2:
            italic = True
            value = part[1:-1]
        elif part.startswith("[") and "](" in part:
            label, url = re.match(r"\[([^\]]+)\]\(([^)]+)\)", part).groups()
            value = f"{label} ({url})" if url not in label else label

        chunks = value.split("\n")
        for idx, chunk in enumerate(chunks):
            if idx > 0:
                paragraph.add_run().add_break()
            run = paragraph.add_run(chunk)
            run.bold = bold
            run.italic = italic
            run.font.strike = strike
            if mono:
                run.font.name = "Consolas"
                run.font.size = Pt(9)
                run.font.color.rgb = PRIMARY


# ---------------------------------------------------------------------------
# Bloques
# ---------------------------------------------------------------------------

def add_heading(doc: Document, text: str, level: int) -> None:
    text = clean_html(text).strip()
    text = re.sub(r"\s+-\s+", " — ", text)
    paragraph = doc.add_paragraph(style=f"Heading {level}")
    add_inline(paragraph, text, base_bold=True)
    if level == 1:
        border_paragraph(paragraph, "bottom", PRIMARY_HEX, size=10, space=4)
    elif level == 2:
        border_paragraph(paragraph, "bottom", BORDER, size=6, space=3)


def add_paragraph(doc: Document, text: str) -> None:
    paragraph = doc.add_paragraph()
    add_inline(paragraph, text)


def add_bullet(doc: Document, text: str, level: int) -> None:
    level = max(0, min(level, 2))
    style = "List Bullet" if level == 0 else f"List Bullet {level + 1}"
    try:
        paragraph = doc.add_paragraph(style=style)
    except KeyError:
        paragraph = doc.add_paragraph()
        paragraph.paragraph_format.left_indent = Cm(0.6 + 0.5 * level)
        paragraph.paragraph_format.first_line_indent = Cm(-0.4)
        paragraph.add_run("•  ").bold = True
    add_inline(paragraph, text)


def add_numbered(doc: Document, number: str, text: str, level: int) -> None:
    paragraph = doc.add_paragraph()
    paragraph.paragraph_format.left_indent = Cm(0.75 + 0.55 * level)
    paragraph.paragraph_format.first_line_indent = Cm(-0.55)
    paragraph.paragraph_format.space_after = Pt(4)
    run = paragraph.add_run(f"{number}.  ")
    run.bold = True
    run.font.color.rgb = PRIMARY
    add_inline(paragraph, text)


def add_code(doc: Document, code: str) -> None:
    paragraph = doc.add_paragraph(style="Chambe Code")
    shade_paragraph(paragraph, CODE_BG)
    border_paragraph(paragraph, "left", BORDER, size=18, space=6)
    border_paragraph(paragraph, "top", BORDER, size=4, space=2)
    border_paragraph(paragraph, "bottom", BORDER, size=4, space=2)
    border_paragraph(paragraph, "right", BORDER, size=4, space=2)
    lines = code.rstrip("\n").split("\n")
    for idx, line in enumerate(lines):
        if idx > 0:
            paragraph.add_run().add_break()
        run = paragraph.add_run(line if line else " ")
        run.font.name = "Consolas"
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(0x1E, 0x1E, 0x1E)


def callout_kind(lines: list[str]) -> tuple[str, str, str]:
    head = " ".join(lines[:2])
    if any(mark in head for mark in ("⚠️", "⚠", "🚩")):
        return WARN_BG, WARN_BORDER, "Advertencia"
    if any(mark in head for mark in ("✅", "✔")):
        return OK_BG, OK_BORDER, "Correcto"
    if any(mark in head for mark in ("🔥", "⛔", "❌")):
        return DANGER_BG, DANGER_BORDER, "Importante"
    return INFO_BG, INFO_BORDER, "Nota"


def add_callout(doc: Document, lines: list[str]) -> None:
    bg, border, label = callout_kind(lines)
    paragraph = doc.add_paragraph(style="Chambe Callout")
    shade_paragraph(paragraph, bg)
    border_paragraph(paragraph, "left", border, size=24, space=6)
    border_paragraph(paragraph, "top", border, size=4, space=2)
    border_paragraph(paragraph, "bottom", border, size=4, space=2)
    border_paragraph(paragraph, "right", border, size=4, space=2)
    for idx, line in enumerate(lines):
        if idx > 0:
            paragraph.add_run().add_break()
        add_inline(paragraph, line)


def split_row(line: str) -> list[str]:
    raw = line.strip()
    if raw.startswith("|"):
        raw = raw[1:]
    if raw.endswith("|"):
        raw = raw[:-1]
    return [cell.strip() for cell in raw.split("|")]


def is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{2,}:?", c.strip()) for c in cells if c)


def add_table(doc: Document, rows: list[list[str]]) -> None:
    if not rows:
        return
    header = rows[0]
    body = rows[1:]
    cols = max(len(r) for r in rows)
    for row in rows:
        row.extend([""] * (cols - len(row)))

    table = doc.add_table(rows=1, cols=cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    table_borders(table)

    head_row = table.rows[0]
    repeat_header(head_row)
    for idx, text in enumerate(header):
        cell = head_row.cells[idx]
        shade_cell(cell, PRIMARY_HEX)
        cell_margins(cell)
        paragraph = cell.paragraphs[0]
        paragraph.style = doc.styles["Chambe Cell"]
        add_inline(paragraph, text, base_bold=True)
        for run in paragraph.runs:
            run.font.color.rgb = WHITE
            run.font.bold = True
            run.font.size = Pt(8.7)

    for r_idx, row in enumerate(body):
        table_row = table.add_row()
        cant_split(table_row)
        for c_idx, text in enumerate(row):
            cell = table_row.cells[c_idx]
            cell_margins(cell)
            if r_idx % 2 == 1:
                shade_cell(cell, ZEBRA)
            paragraph = cell.paragraphs[0]
            paragraph.style = doc.styles["Chambe Cell"]
            add_inline(paragraph, text)

    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(2)


def add_part_page(doc: Document, heading: str, state: dict) -> None:
    match = re.match(r"^#\s+(PARTES?\s+[IVX]+)\s*:\s*(.+)$", heading.strip())
    label = match.group(1).upper() if match else "PARTE"
    title = match.group(2).strip() if match else heading.lstrip("# ").strip()
    title = re.sub(r"\s+-\s+", " — ", title)

    if not state["at_page_start"]:
        doc.add_page_break()

    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Cm(16.8)
    cell = table.cell(0, 0)
    cell.width = Cm(16.8)
    cant_split(table.rows[0])
    shade_cell(cell, PRIMARY_HEX)
    cell_margins(cell, top=700, bottom=700, left=360, right=360)

    p1 = cell.paragraphs[0]
    p1.paragraph_format.space_after = Pt(6)
    r1 = p1.add_run(label)
    r1.bold = True
    r1.font.size = Pt(11)
    r1.font.color.rgb = WHITE
    r1.font.name = "Calibri"

    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    r2 = p2.add_run(title)
    r2.bold = True
    r2.font.size = Pt(23)
    r2.font.color.rgb = WHITE
    r2.font.name = "Calibri"

    doc.add_page_break()
    state["at_page_start"] = True


# ---------------------------------------------------------------------------
# Portada y páginas iniciales
# ---------------------------------------------------------------------------

def add_cover(doc: Document, meta: dict) -> None:
    for _ in range(4):
        doc.add_paragraph()

    brand = doc.add_paragraph()
    brand.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = brand.add_run("C H A M B E A P P")
    run.bold = True
    run.font.size = Pt(13)
    run.font.color.rgb = PRIMARY

    doc.add_paragraph()

    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("Manual de Usuario\nExtensivo")
    run.bold = True
    run.font.size = Pt(34)
    run.font.color.rgb = DARK
    title.paragraph_format.space_after = Pt(10)

    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run(
        "Plataforma de orquestación de trabajo independiente"
    )
    run.font.size = Pt(14)
    run.font.color.rgb = GRAY
    subtitle.paragraph_format.space_after = Pt(24)

    rule = doc.add_paragraph()
    rule.alignment = WD_ALIGN_PARAGRAPH.CENTER
    border_paragraph(rule, "bottom", PRIMARY_HEX, size=18, space=1)
    rule.paragraph_format.space_after = Pt(24)

    info = doc.add_table(rows=4, cols=2)
    info.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_borders(info)
    values = [
        ("Versión", meta.get("version", "1.11.0")),
        ("Fecha", meta.get("date", "Noviembre 2026")),
        ("Audiencia", "Solicitantes · PDS · Merchants · Staff"),
        ("Clasificación", "Uso interno / documentación de producto"),
    ]
    for idx, (key, value) in enumerate(values):
        left, right = info.rows[idx].cells
        shade_cell(left, "F1F3F5")
        cell_margins(left, 120, 120, 160, 160)
        cell_margins(right, 120, 120, 160, 160)
        p_left = left.paragraphs[0]
        p_left.style = doc.styles["Chambe Cell"]
        r = p_left.add_run(key)
        r.bold = True
        r.font.size = Pt(9.5)
        p_right = right.paragraphs[0]
        p_right.style = doc.styles["Chambe Cell"]
        r2 = p_right.add_run(value)
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = GRAY

    for _ in range(4):
        doc.add_paragraph()

    note = doc.add_paragraph()
    note.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = note.add_run(
        "Documento vivo · Actualizado con cada release · © 2026 ChambeApp"
    )
    run.font.size = Pt(8.5)
    run.font.color.rgb = MUTED

    doc.add_page_break()


def add_control_page(doc: Document) -> None:
    paragraph = doc.add_paragraph(style="Heading 1")
    paragraph.add_run("Control del documento")

    intro = doc.add_paragraph()
    add_inline(
        intro,
        "Este manual describe el funcionamiento completo de ChambeApp v1.11.0. "
        "Está escrito para usuarios finales, equipos de soporte y perfiles técnicos "
        "que necesitan entender tanto el uso diario como las reglas de negocio.",
    )

    rows = [
        ["Campo", "Valor"],
        ["Título", "Manual de Usuario Extensivo — ChambeApp"],
        ["Versión", "1.11.0"],
        ["Estado", "Vigente"],
        ["Fecha", "20 de noviembre de 2026"],
        ["Idioma", "Español (Colombia)"],
        ["Alcance", "Aplicación móvil, PWA, paneles de staff y superadministración"],
    ]
    add_table(doc, rows)

    doc.add_paragraph()
    paragraph = doc.add_paragraph(style="Heading 1")
    paragraph.add_run("Historial de versiones")

    rows = [
        ["Versión", "Fecha", "Cambios principales"],
        ["1.11.0", "2026-11-20", "Manual extensivo reestructurado, IA, monedas y superadmin"],
        ["1.10.0", "2026-11-18", "Pasarela simulada ChambePay y recarga con reintento"],
        ["1.9.0", "2026-11-13", "Cobros en monedas y flujos completos de la app"],
    ]
    add_table(doc, rows)

    doc.add_paragraph()
    paragraph = doc.add_paragraph(style="Heading 1")
    paragraph.add_run("Cómo usar este manual")

    for text in (
        "Cada **PARTE** abre una portadilla y agrupa un bloque funcional del producto.",
        "Los números de sección (**1, 2, 3…**) son estables: úsalos al reportar incidencias o pedir soporte.",
        "Las tablas resumen reglas, estados, permisos y costos; los bloques de código muestran fórmulas y flujos exactos.",
        "Los recuadros de color señalan advertencias, notas, confirmaciones o riesgos. Léelos antes de ejecutar una acción irreversible.",
        "El índice es automático: en Word, haz clic derecho sobre él y elige **Actualizar campo** para refrescar páginas.",
    ):
        add_bullet(doc, text, 0)

    doc.add_paragraph()
    paragraph = doc.add_paragraph(style="Heading 1")
    paragraph.add_run("Convenciones visuales")

    rows = [
        ["Símbolo", "Significado"],
        ["✅", "Acción permitida, estado correcto o resultado exitoso"],
        ["❌", "Acción no permitida, estado inválido o error"],
        ["⚠️", "Advertencia: revisa antes de continuar"],
        ["ℹ️", "Nota informativa o aclaración"],
        ["🚩", "Bandera roja: señal de riesgo o mala práctica"],
        ["💡", "Recomendación o buena práctica"],
        ["🔒", "Regla de seguridad o privacidad"],
    ]
    add_table(doc, rows)

    doc.add_page_break()


def add_toc_page(doc: Document) -> None:
    paragraph = doc.add_paragraph(style="Heading 1")
    paragraph.add_run("Contenido")

    note = doc.add_paragraph(style="Chambe Caption")
    note.add_run(
        "Índice automático. En Word: clic derecho sobre el índice → «Actualizar campo» → "
        "«Actualizar toda la tabla» para calcular las páginas."
    )

    paragraph = doc.add_paragraph()
    add_field(paragraph, r'TOC \o "1-2" \h \z \u', "El índice se genera al actualizar el campo.")

    doc.add_page_break()


def add_final_page(doc: Document) -> None:
    doc.add_page_break()
    for _ in range(5):
        doc.add_paragraph()

    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("Fin del manual")
    run.bold = True
    run.font.size = Pt(24)
    run.font.color.rgb = PRIMARY

    text = doc.add_paragraph()
    text.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = text.add_run(
        "ChambeApp · Manual de Usuario Extensivo v1.11.0\n"
        "soporte@chambeapp.com · security@chambeapp.com\n"
        "© 2026 ChambeApp. Todos los derechos reservados."
    )
    run.font.size = Pt(10)
    run.font.color.rgb = GRAY
    text.paragraph_format.space_before = Pt(12)


# ---------------------------------------------------------------------------
# Encabezado / pie
# ---------------------------------------------------------------------------

def enable_update_fields(doc: Document) -> None:
    """Pide a Word que actualice TOC y numeración al abrir el documento."""
    settings = doc.settings.element
    if settings.find(qn("w:updateFields")) is None:
        settings.append(_el("w:updateFields", val="true"))


def configure_section(doc: Document) -> None:
    section = doc.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(2.1)
    section.bottom_margin = Cm(1.9)
    section.left_margin = Cm(2.2)
    section.right_margin = Cm(2.0)
    section.header_distance = Cm(1.0)
    section.footer_distance = Cm(0.9)
    section.different_first_page_header_footer = True

    header = section.header
    paragraph = header.paragraphs[0]
    paragraph.text = ""
    paragraph.paragraph_format.tab_stops.add_tab_stop(Cm(16.7), WD_ALIGN_PARAGRAPH.RIGHT)
    left = paragraph.add_run("ChambeApp · Manual de Usuario Extensivo")
    left.font.size = Pt(8.5)
    left.font.color.rgb = GRAY
    paragraph.add_run("\t")
    right = paragraph.add_run("v1.11.0")
    right.font.size = Pt(8.5)
    right.font.color.rgb = PRIMARY
    right.bold = True
    border_paragraph(paragraph, "bottom", BORDER, size=4, space=4)

    footer = section.footer
    paragraph = footer.paragraphs[0]
    paragraph.text = ""
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = paragraph.add_run("Página ")
    run.font.size = Pt(8.5)
    run.font.color.rgb = GRAY
    add_field(paragraph, "PAGE", "1")
    run = paragraph.add_run(" de ")
    run.font.size = Pt(8.5)
    run.font.color.rgb = GRAY
    add_field(paragraph, "NUMPAGES", "1")
    for run in paragraph.runs:
        run.font.size = Pt(8.5)
        run.font.color.rgb = GRAY

    # Primera página sin encabezado ni pie
    first_header = section.first_page_header
    first_header.paragraphs[0].text = ""
    first_footer = section.first_page_footer
    first_footer.paragraphs[0].text = ""


# ---------------------------------------------------------------------------
# Parser principal
# ---------------------------------------------------------------------------

BLOCK_RE = re.compile(
    r"^(#{1,6}\s|```|\||>\s?|\s*[-*+]\s|\s*\d+\.\s|---+\s*$)"
)


def parse_metadata(lines: list[str]) -> dict:
    version = "1.11.0"
    date = "Noviembre 2026"
    for line in lines:
        text = line.lstrip("> ").strip()
        match = re.search(r"Versi[oó]n:\*{0,2}\s*([0-9.]+)", text)
        if match:
            version = match.group(1)
        match = re.search(r"Fecha:\*{0,2}\s*([^|]+)", text)
        if match:
            date = match.group(1).strip()
    return {"version": version, "date": date}


def build(input_path: Path, output_path: Path) -> None:
    text = input_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    total = len(lines)

    doc = Document()
    build_styles(doc)
    configure_section(doc)

    core = doc.core_properties
    core.title = "Manual de Usuario Extensivo — ChambeApp"
    core.subject = "Documentación funcional de la plataforma ChambeApp"
    core.author = "Equipo ChambeApp"
    core.category = "Manual de usuario"
    core.comments = "Documento generado a partir del manual extensivo en Markdown."
    core.keywords = "ChambeApp, manual, usuario, PDS, solicitante, merchant, monedas, IA"

    # Saltar título y capturar metadatos
    index = 0
    if lines and lines[0].startswith("# "):
        index = 1
    meta_lines: list[str] = []
    while index < total and (
        not lines[index].strip() or lines[index].lstrip().startswith(">")
    ):
        if lines[index].lstrip().startswith(">"):
            meta_lines.append(lines[index])
        index += 1
    meta = parse_metadata(meta_lines)

    # Saltar el índice propio del Markdown hasta la primera PARTE real
    while index < total and not re.match(r"^#\s+PARTES?\s+[IVX]+", lines[index]):
        index += 1

    add_cover(doc, meta)
    add_control_page(doc)
    add_toc_page(doc)

    # Pre-paso: mapa de numeración antigua -> nueva (primera aparición)
    in_code = False
    counter = 0
    for raw in lines:
        if raw.strip().startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        match_num = re.match(r"^##\s+(\d+)\.\s+", raw)
        if match_num:
            counter += 1
            SECTION_MAP.setdefault(int(match_num.group(1)), counter)

    state = {"at_page_start": True, "sec": 0, "sub": 0, "subsub": 0}
    paragraph_buffer: list[str] = []

    def flush_paragraph() -> None:
        nonlocal paragraph_buffer
        if paragraph_buffer:
            add_paragraph(doc, " ".join(paragraph_buffer))
            paragraph_buffer = []
            state["at_page_start"] = False

    while index < total:
        line = lines[index]
        stripped = line.strip()

        # ------------------------------------------------------------ fences
        if stripped.startswith("```"):
            flush_paragraph()
            index += 1
            code_lines: list[str] = []
            while index < total and not lines[index].strip().startswith("```"):
                code_lines.append(lines[index])
                index += 1
            index += 1
            add_code(doc, "\n".join(code_lines))
            state["at_page_start"] = False
            continue

        # ------------------------------------------------------------ PARTE
        if re.match(r"^#\s+PARTES?\s+[IVX]+", line):
            flush_paragraph()
            add_part_page(doc, line, state)
            state["sub"] = 0
            state["subsub"] = 0
            index += 1
            continue

        # ------------------------------------------------------------ headings
        match = re.match(r"^(#{2,6})\s+(.*)$", line)
        if match:
            flush_paragraph()
            level = len(match.group(1)) - 1
            title = strip_number(match.group(2))
            if level == 1:
                state["sec"] += 1
                state["sub"] = 0
                state["subsub"] = 0
                text_out = f"{state['sec']}. {title}"
            elif level == 2:
                state["sub"] += 1
                state["subsub"] = 0
                text_out = (
                    f"{state['sec']}.{state['sub']} {title}"
                    if state["sec"]
                    else title
                )
            elif level == 3:
                state["subsub"] += 1
                if state["sec"] and state["sub"]:
                    text_out = (
                        f"{state['sec']}.{state['sub']}.{state['subsub']} {title}"
                    )
                elif state["sec"]:
                    text_out = f"{state['sec']}.{state['subsub']} {title}"
                else:
                    text_out = title
            else:
                text_out = title
            add_heading(doc, text_out, min(level, 4))
            state["at_page_start"] = False
            index += 1
            continue

        # ------------------------------------------------------------ table
        if stripped.startswith("|"):
            flush_paragraph()
            rows: list[list[str]] = []
            while index < total and lines[index].strip().startswith("|"):
                cells = split_row(lines[index])
                if not is_separator_row(cells):
                    rows.append(cells)
                index += 1
            add_table(doc, rows)
            state["at_page_start"] = False
            continue

        # ------------------------------------------------------------ callout
        if stripped.startswith(">"):
            flush_paragraph()
            callout: list[str] = []
            while index < total and lines[index].strip().startswith(">"):
                callout.append(lines[index].lstrip("> ").rstrip())
                index += 1
            add_callout(doc, callout)
            state["at_page_start"] = False
            continue

        # ------------------------------------------------------------ lists
        bullet = re.match(r"^(\s*)[-*+]\s+(.*)$", line)
        if bullet:
            flush_paragraph()
            indent = len(bullet.group(1).replace("\t", "  "))
            add_bullet(doc, bullet.group(2), indent // 2)
            state["at_page_start"] = False
            index += 1
            continue

        numbered = re.match(r"^(\s*)(\d+)[.)]\s+(.*)$", line)
        if numbered:
            flush_paragraph()
            indent = len(numbered.group(1).replace("\t", "  "))
            add_numbered(doc, numbered.group(2), numbered.group(3), indent // 2)
            state["at_page_start"] = False
            index += 1
            continue

        # ------------------------------------------------------------ rules
        if re.fullmatch(r"-{3,}\s*", stripped):
            index += 1
            continue

        # ------------------------------------------------------------ blank
        if not stripped:
            flush_paragraph()
            index += 1
            continue

        # ------------------------------------------------------------ parrafo
        paragraph_buffer.append(stripped)
        index += 1

    flush_paragraph()
    add_final_page(doc)
    enable_update_fields(doc)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description="Construye el manual DOCX estructurado")
    parser.add_argument(
        "--input",
        type=Path,
        default=root / "Manuales" / "MANUAL_USUARIO_CHAMBEAPP_EXTENSIVO.md",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=root / "Manuales" / "MANUAL_USUARIO_CHAMBEAPP_EXTENSIVO.docx",
    )
    args = parser.parse_args()

    if not args.input.exists():
        print(f"No existe el archivo de entrada: {args.input}")
        return 1

    build(args.input, args.output)
    size_kb = args.output.stat().st_size / 1024
    print(f"DOCX generado: {args.output}")
    print(f"Tamaño: {size_kb:.1f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
