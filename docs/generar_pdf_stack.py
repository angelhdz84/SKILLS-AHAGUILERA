from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    ListFlowable, ListItem, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas as canvas_module
from reportlab.lib import colors
import os

# ── Paleta de colores ──
DARK_BG = HexColor("#1a1a2e")
ACCENT = HexColor("#e94560")
ACCENT2 = HexColor("#0f3460")
LIGHT_BG = HexColor("#f8f9fa")
MID_BG = HexColor("#e8e8e8")
GRID_LINE = HexColor("#cccccc")
GREEN = HexColor("#2ecc71")
ORANGE = HexColor("#f39c12")
BLUE = HexColor("#3498db")

W, H = A4
MARGIN = 2.0 * cm

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "Stack_Offline-First_Profesional.pdf")

# ── Estilos ──
styles = getSampleStyleSheet()

styles.add(ParagraphStyle(
    "CoverTitle", fontName="Helvetica-Bold", fontSize=28,
    textColor=white, alignment=TA_CENTER, leading=34
))
styles.add(ParagraphStyle(
    "CoverSub", fontName="Helvetica", fontSize=14,
    textColor=HexColor("#cccccc"), alignment=TA_CENTER, leading=20
))
styles.add(ParagraphStyle(
    "SectionTitle", fontName="Helvetica-Bold", fontSize=20,
    textColor=ACCENT, spaceBefore=12, spaceAfter=8, leading=24
))
styles.add(ParagraphStyle(
    "SubTitle", fontName="Helvetica-Bold", fontSize=14,
    textColor=ACCENT2, spaceBefore=10, spaceAfter=4, leading=17
))
styles.add(ParagraphStyle(
    "SubSubTitle", fontName="Helvetica-Bold", fontSize=12,
    textColor=DARK_BG, spaceBefore=8, spaceAfter=3, leading=15
))
styles.add(ParagraphStyle(
    "Body2", fontName="Helvetica", fontSize=10,
    textColor=DARK_BG, alignment=TA_JUSTIFY, leading=14, spaceAfter=4
))
styles.add(ParagraphStyle(
    "BulletCustom", fontName="Helvetica", fontSize=10,
    textColor=DARK_BG, leading=14, leftIndent=20, spaceAfter=2,
    bulletIndent=8, bulletFontSize=10
))
styles.add(ParagraphStyle(
    "CodeCustom", fontName="Courier", fontSize=8,
    textColor=DARK_BG, leading=10, leftIndent=12,
    backColor=LIGHT_BG, spaceAfter=3
))
styles.add(ParagraphStyle(
    "TableHeader", fontName="Helvetica-Bold", fontSize=9,
    textColor=white, alignment=TA_CENTER, leading=12
))
styles.add(ParagraphStyle(
    "TableCell", fontName="Helvetica", fontSize=8.5,
    textColor=DARK_BG, alignment=TA_CENTER, leading=11
))
styles.add(ParagraphStyle(
    "TableCellLeft", fontName="Helvetica", fontSize=8.5,
    textColor=DARK_BG, alignment=TA_LEFT, leading=11
))
styles.add(ParagraphStyle(
    "Footer", fontName="Helvetica", fontSize=8,
    textColor=HexColor("#999999"), alignment=TA_CENTER
))
styles.add(ParagraphStyle(
    "Star", fontName="Helvetica-Bold", fontSize=12,
    textColor=ORANGE, alignment=TA_LEFT, leading=15
))

def hr():
    return HRFlowable(width="100%", thickness=0.5, color=GRID_LINE, spaceAfter=6, spaceBefore=6)

def bullet_list(items, style_name="BulletCustom"):
    return [Paragraph(f"<bullet>&bull;</bullet> {t}", styles[style_name]) for t in items]

def info_box(title, text):
    tbl = Table(
        [[Paragraph(f"<b>{title}</b>", styles["SubSubTitle"]),
          Paragraph(text, styles["Body2"])]],
        colWidths=[3.5*cm, 12.5*cm]
    )
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HexColor("#fff3cd")),
        ("BOX", (0, 0), (-1, -1), 0.5, ORANGE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    return tbl

def make_cover(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setFillColor(DARK_BG)
    canvas_obj.rect(0, 0, W, H, fill=1, stroke=0)
    canvas_obj.setFillColor(ACCENT)
    canvas_obj.rect(0, H - 3.5*cm, W, 3.5*cm, fill=1, stroke=0)

    canvas_obj.setFillColor(white)
    canvas_obj.setFont("Helvetica-Bold", 32)
    canvas_obj.drawCentredString(W/2, H - 2.2*cm, "Stack Offline-First")
    canvas_obj.drawCentredString(W/2, H - 3.0*cm, "Profesional")

    canvas_obj.setFont("Helvetica", 14)
    canvas_obj.setFillColor(HexColor("#cccccc"))
    canvas_obj.drawCentredString(W/2, H - 5.0*cm, "Arquitectura, tecnologias e IA local")
    canvas_obj.drawCentredString(W/2, H - 5.7*cm, "para apps vendibles sin internet")

    canvas_obj.setFont("Helvetica", 10)
    canvas_obj.drawCentredString(W/2, H - 7.0*cm, "Basado en SKILLS-AHAGUILERA + ATEJE")

    # ── Cuadro de principios ──
    principios = [
        "100% local  —  Cero internet requerido",
        "Sin servidores  —  Sin CDNs  —  Sin builds",
        "Datos del cliente siempre en su maquina",
        "Codigo fuente portable  —  .html o .exe",
        "Espanol / Moneda LatAm  —  Soberania digital"
    ]
    y = H - 9.5*cm
    canvas_obj.setFillColor(HexColor("#16213e"))
    canvas_obj.roundRect(MARGIN-5, y-15, W-2*MARGIN+10, len(principios)*28+30, 8, fill=1, stroke=0)
    canvas_obj.setFont("Helvetica", 11)
    canvas_obj.setFillColor(HexColor("#e0e0e0"))
    for i, p in enumerate(principios):
        canvas_obj.drawString(MARGIN + 10, y + (len(principios)-1-i)*28 + 10, f"  \u2714  {p}")

    canvas_obj.setFont("Helvetica", 9)
    canvas_obj.setFillColor(HexColor("#888888"))
    canvas_obj.drawCentredString(W/2, 2*cm, "Documento teccnico generado para estudio  —  2025")
    canvas_obj.restoreState()

def make_footer(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setStrokeColor(GRID_LINE)
    canvas_obj.line(MARGIN, 1.5*cm, W-MARGIN, 1.5*cm)
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.setFillColor(HexColor("#999999"))
    canvas_obj.drawCentredString(W/2, 1.0*cm, f"Stack Offline-First Profesional  —  Pagina {doc.page}")
    canvas_obj.restoreState()

# ── Documento ──
doc = SimpleDocTemplate(
    OUTPUT_PATH, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=2.5*cm, bottomMargin=2.5*cm
)
story = []

# ═══════════════ PAG 1: PORTADA ═══════════════
story.append(PageBreak())

# ═══════════════ 1. FILOSOFIA ═══════════════
story.append(Paragraph("1. Filosofia del Stack", styles["SectionTitle"]))
story.append(hr())

story.append(Paragraph(
    "Este stack esta disenado para un tipo especifico de desarrollador: el profesional freelance "
    "que entrega apps de escritorio a clientes en Latinoamerica, donde el acceso a internet puede ser "
    "limitado y la privacidad de datos es critica. No es para SaaS, no es para la nube, "
    "no es para startups que buscan escalar a millones.",
    styles["Body2"]
))

story.append(Spacer(1, 6))
story.append(Paragraph("<b>Principios inquebrantables</b>", styles["SubTitle"]))

principios_data = [
    [Paragraph("<b>Principio</b>", styles["TableHeader"]),
     Paragraph("<b>Implicacion</b>", styles["TableHeader"]),
     Paragraph("<b>Que queda prohibido</b>", styles["TableHeader"])],
    [Paragraph("Cero Internet", styles["TableCell"]),
     Paragraph("La app funciona sin conectividad. Todas las dependencias son locales.", styles["TableCellLeft"]),
     Paragraph("CDNs, Google Fonts, fetch a URLs externas, telemetria", styles["TableCellLeft"])],
    [Paragraph("Sin servidor", styles["TableCell"]),
     Paragraph("El usuario abre la app con doble clic en index.html o ejecuta un .exe.", styles["TableCellLeft"]),
     Paragraph("Node.js, Express, bases de datos externas, Docker, APIs REST remotas", styles["TableCellLeft"])],
    [Paragraph("Sin build", styles["TableCell"]),
     Paragraph("Editas el codigo, refrescas el navegador o compilas solo para entrega final.", styles["TableCellLeft"]),
     Paragraph("Webpack, Vite, Babel, TypeScript compiler en dev loop", styles["TableCellLeft"])],
    [Paragraph("Localizacion LatAm", styles["TableCell"]),
     Paragraph("Todo en espanol, formato DD/MM/YYYY, moneda $1.234,56", styles["TableCellLeft"]),
     Paragraph("Mensajes en ingles, formato ISO, fecha MM/DD/YYYY", styles["TableCellLeft"])],
    [Paragraph("Privacidad", styles["TableCell"]),
     Paragraph("Cero analytics, cero telemetria, cero envio de datos", styles["TableCellLeft"]),
     Paragraph("Google Analytics, Sentry, cualquier servicio de terceros", styles["TableCellLeft"])],
]
pt = Table(principios_data, colWidths=[3.5*cm, 6.5*cm, 6*cm])
pt.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("BACKGROUND", (0, 1), (-1, -1), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
]))
story.append(pt)

story.append(Spacer(1, 8))
story.append(Paragraph(
    "<b>Audiencia objetivo:</b> Desarrolladores freelance que entregan software de gestion, facturacion, "
    "inventarios, CRM, ERPs o herramientas internas a clientes que valoran la autonomia y la privacidad "
    "de sus datos. El producto final es un archivo o ejecutable que el cliente guarda en su escritorio.",
    styles["Body2"]
))

# ═══════════════ 2. COMPARATIVA ═══════════════
story.append(PageBreak())
story.append(Paragraph("2. Analisis: Offline-First vs ATEJE", styles["SectionTitle"]))
story.append(hr())

story.append(Paragraph(
    "Ambos stacks comparten filosofia pero difieren en implementacion. "
    "ATEJE introduce servidor (Bun) y compilacion a cambio de SQLite y capacidades IA. "
    "La tabla muestra donde convergen y donde divergen.",
    styles["Body2"]
))
story.append(Spacer(1, 6))

comp_data = [
    [Paragraph("<b>Aspecto</b>", styles["TableHeader"]),
     Paragraph("<b>Offline-First</b>", styles["TableHeader"]),
     Paragraph("<b>ATEJE</b>", styles["TableHeader"]),
     Paragraph("<b>Unificado</b>", styles["TableHeader"])],
    [Paragraph("Runtime", styles["TableCellLeft"]),
     Paragraph("file:// (doble clic)", styles["TableCell"]),
     Paragraph("Bun (servidor)", styles["TableCell"]),
     Paragraph("file:// + Bun opcional", styles["TableCell"])],
    [Paragraph("BD Local", styles["TableCellLeft"]),
     Paragraph("Dexie (IndexedDB)", styles["TableCell"]),
     Paragraph("bun:sqlite (SQLite)", styles["TableCell"]),
     Paragraph("Dexie + bun:sqlite", styles["TableCell"])],
    [Paragraph("Crypto", styles["TableCellLeft"]),
     Paragraph("CryptoJS", styles["TableCell"]),
     Paragraph("Web Crypto API", styles["TableCell"]),
     Paragraph("Ambos (deteccion)", styles["TableCell"])],
    [Paragraph("CSS", styles["TableCellLeft"]),
     Paragraph("CDN play (sin build)", styles["TableCell"]),
     Paragraph("Tailwind CLI (compilado)", styles["TableCell"]),
     Paragraph("CDN play + CLI opcional", styles["TableCell"])],
    [Paragraph("Iconos", styles["TableCellLeft"]),
     Paragraph("Bootstrap Icons", styles["TableCell"]),
     Paragraph("Lucide", styles["TableCell"]),
     Paragraph("Lucide (default)", styles["TableCell"])],
    [Paragraph("Build", styles["TableCellLeft"]),
     Paragraph("Ninguno", styles["TableCell"]),
     Paragraph("bun build --compile", styles["TableCell"]),
     Paragraph("Opcional solo prod", styles["TableCell"])],
    [Paragraph("Peso .exe", styles["TableCellLeft"]),
     Paragraph("N/A (solo .html)", styles["TableCell"]),
     Paragraph("50-55 MB", styles["TableCell"]),
     Paragraph("50-55 MB (si se compila)", styles["TableCell"])],
    [Paragraph("IA Local", styles["TableCellLeft"]),
     Paragraph("No incluida", styles["TableCell"]),
     Paragraph("Transformers.js + ONNX", styles["TableCell"]),
     Paragraph("Opcional (skill IA)", styles["TableCell"])],
    [Paragraph("Librerias extra", styles["TableCellLeft"]),
     Paragraph("ApexCharts, jsPDF, SheetJS, Pako, Animate.css", styles["TableCell"]),
     Paragraph("No incluidas", styles["TableCell"]),
     Paragraph("Todas disponibles", styles["TableCell"])],
    [Paragraph("Proteccion IP", styles["TableCellLeft"]),
     Paragraph("Codigo visible", styles["TableCell"]),
     Paragraph("Binario ofuscado", styles["TableCell"]),
     Paragraph("Binario al compilar", styles["TableCell"])],
]
ct = Table(comp_data, colWidths=[2.8*cm, 3.8*cm, 3.8*cm, 5.6*cm])
ct.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
]))
story.append(ct)

story.append(Spacer(1, 6))
story.append(Paragraph(
    "<b>Conclusion:</b> El stack unificado toma lo mejor de ambos. Usa Dexie para portabilidad "
    "(funciona siempre, incluso en file://) y ofrece bun:sqlite como upgrade cuando se detecta "
    "Bun runtime. Esto permite que el mismo codigo base se ejecute en 3 modos.",
    styles["Body2"]
))

# ═══════════════ 3. STACK UNIFICADO ═══════════════
story.append(PageBreak())
story.append(Paragraph("3. Stack Unificado Recomendado", styles["SectionTitle"]))
story.append(hr())

story.append(Paragraph(
    "La propuesta de convergencia: un solo stack que funciona en 3 modos segun el contexto. "
    "El desarrollador escribe una vez, el runtime decide que capacidades activar.",
    styles["Body2"]
))
story.append(Spacer(1, 4))

# ── 3 modos ──
modos_data = [
    [Paragraph("<b>Modo</b>", styles["TableHeader"]),
     Paragraph("<b>Comando</b>", styles["TableHeader"]),
     Paragraph("<b>BD</b>", styles["TableHeader"]),
     Paragraph("<b>Crypto</b>", styles["TableHeader"]),
     Paragraph("<b>CSS</b>", styles["TableHeader"]),
     Paragraph("<b>Uso</b>", styles["TableHeader"])],
    [Paragraph("Lite", styles["TableCell"]),
     Paragraph("Doble clic index.html", styles["TableCell"]),
     Paragraph("Dexie (IndexedDB)", styles["TableCell"]),
     Paragraph("CryptoJS", styles["TableCell"]),
     Paragraph("Tailwind CDN play", styles["TableCell"]),
     Paragraph("Desarrollo rapido, demos", styles["TableCell"])],
    [Paragraph("Dev", styles["TableCell"]),
     Paragraph("bun --hot servidor.ts", styles["TableCell"]),
     Paragraph("Dexie + bun:sqlite", styles["TableCell"]),
     Paragraph("CryptoJS + Web Crypto", styles["TableCell"]),
     Paragraph("Tailwind CDN play", styles["TableCell"]),
     Paragraph("Desarrollo con backend local", styles["TableCell"])],
    [Paragraph("Prod", styles["TableCell"]),
     Paragraph("./app.exe", styles["TableCell"]),
     Paragraph("bun:sqlite (SQLite)", styles["TableCell"]),
     Paragraph("Web Crypto API", styles["TableCell"]),
     Paragraph("Tailwind CLI (minified)", styles["TableCell"]),
     Paragraph("Entrega a cliente final", styles["TableCell"])],
]
mt = Table(modos_data, colWidths=[1.8*cm, 3.5*cm, 3.2*cm, 3.2*cm, 3*cm, 3.3*cm])
mt.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG, HexColor("#eafaf1")]),
]))
story.append(mt)

story.append(Spacer(1, 10))
story.append(Paragraph("3.1 Layout del proyecto generado", styles["SubTitle"]))
story.append(hr())

code_lines = [
    "mi-app/",
    "  index.html                    # Entry point (Modo Lite: doble clic aqui)",
    "  servidor.ts                   # Servidor Bun (Modo Dev/Prod)",
    "  tailwind.config.js            # Config DaisyUI + custom colors",
    "  assets/                       # Librerias JS locales (sin CDN)",
    "    alpine.min.js",
    "    dexie.min.js",
    "    crypto-js.min.js",
    "    tailwind.min.css            # CDN play descargado local",
    "    lucide.umd.min.js",
    "    apexcharts.min.js           # Carga diferida bajo demanda",
    "    jspdf.umd.min.js            # Carga diferida bajo demanda",
    "    xlsx.full.min.js            # Carga diferida bajo demanda",
    "  src/",
    "    core/",
    "      app.js                    # Alpine store global, router",
    "      db.js                     # Capa de datos abstraida",
    "      crypto-helpers.js         # CryptoJS + Web Crypto wrapper",
    "      config.js                 # APP_CONFIG desde project.config.js",
    "    modules/",
    "      dashboard/",
    "      clientes/",
    "      productos/",
    "      ...                       # Un modulo por funcionalidad",
    "  models/                       # (Opcional) Modelos ONNX para IA local",
    "  project.config.js             # Config white-label",
]
for line in code_lines:
    story.append(Paragraph(line, styles["CodeCustom"]))

story.append(Spacer(1, 8))
story.append(Paragraph("3.2 Deteccion de runtime en codigo", styles["SubTitle"]))
story.append(hr())

story.append(Paragraph(
    "La capa de datos (db.js) y crypto (crypto-helpers.js) detectan el runtime automaticamente "
    "para usar Dexie o SQLite, CryptoJS o Web Crypto segun corresponda. "
    "Esto permite que el mismo modulo funcione en los 3 modos sin cambios.",
    styles["Body2"]
))

code_sample = (
    "// db.js  -  Capa de datos abstracta\\n"
    "const tieneBun = typeof Bun !== 'undefined';\\n"
    "\\n"
    "export const db = {\\n"
    "  async getAll(tabla) {\\n"
    "    if (tieneBun) return fetch(`/api/${tabla}`).then(r => r.json());\\n"
    "    return dbLocal[tabla].toArray();\\n"
    "  },\\n"
    "  async save(tabla, datos) {\\n"
    "    if (tieneBun) return fetch(`/api/${tabla}`, { method: 'POST', body: JSON.stringify(datos) });\\n"
    "    return dbLocal[tabla].put(datos);\\n"
    "  }\\n"
    "};"
)
story.append(Paragraph(code_sample, styles["CodeCustom"]))

# ═══════════════ 4. CATALOGO DE TECNOLOGIAS ═══════════════
story.append(PageBreak())
story.append(Paragraph("4. Catalogo de Tecnologias Compatibles", styles["SectionTitle"]))
story.append(hr())

story.append(Paragraph(
    "Tecnologias adicionales que mantienen la filosofia offline-first. "
    "Cada una evaluada por compatibilidad con file://, peso, licencia y caso de uso.",
    styles["Body2"]
))
story.append(Spacer(1, 4))

# ── Busqueda y texto ──
story.append(Paragraph("4.1 Busqueda y texto", styles["SubTitle"]))
story.append(hr())

search_data = [
    [Paragraph("<b>Tecnologia</b>", styles["TableHeader"]),
     Paragraph("<b>Proposito</b>", styles["TableHeader"]),
     Paragraph("<b>Peso</b>", styles["TableHeader"]),
     Paragraph("<b>file://</b>", styles["TableHeader"]),
     Paragraph("<b>Licencia</b>", styles["TableHeader"])],
    [Paragraph("FlexSearch", styles["TableCellLeft"]),
     Paragraph("Busqueda full-text ultra rapida con indexacion persistente. 1000x mas rapido que Fuse.js en datasets grandes.", styles["TableCellLeft"]),
     Paragraph("4-16 KB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"]),
     Paragraph("Apache-2.0", styles["TableCell"])],
    [Paragraph("MiniSearch", styles["TableCellLeft"]),
     Paragraph("TF-IDF + BM25, fuzzy, sugerencias. Soporta anadir/eliminar documentos en caliente.", styles["TableCellLeft"]),
     Paragraph("~7 KB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"]),
     Paragraph("MIT", styles["TableCell"])],
    [Paragraph("Fuse.js", styles["TableCellLeft"]),
     Paragraph("Fuzzy matching simple. Ideal para autocomplete y busqueda tolerante a errores.", styles["TableCellLeft"]),
     Paragraph("~8 KB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"]),
     Paragraph("Apache-2.0", styles["TableCell"])],
    [Paragraph("Lunr.js", styles["TableCellLeft"]),
     Paragraph("TF-IDF classico estilo Solr. No permite updates parciales.", styles["TableCellLeft"]),
     Paragraph("~8 KB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"]),
     Paragraph("MIT", styles["TableCell"])],
]
st = Table(search_data, colWidths=[2.5*cm, 7.5*cm, 1.8*cm, 1.5*cm, 2.2*cm])
st.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2), ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
]))
story.append(st)
story.append(Spacer(1, 10))

# ── Bases de datos locales ──
story.append(Paragraph("4.2 Bases de datos locales", styles["SubTitle"]))
story.append(hr())

db_data = [
    [Paragraph("<b>Tecnologia</b>", styles["TableHeader"]),
     Paragraph("<b>Proposito</b>", styles["TableHeader"]),
     Paragraph("<b>Peso</b>", styles["TableHeader"]),
     Paragraph("<b>file://</b>", styles["TableHeader"]),
     Paragraph("<b>Licencia</b>", styles["TableHeader"])],
    [Paragraph("LokiJS", styles["TableCellLeft"]),
     Paragraph("NoSQL en memoria. Persistencia via IndexedDB. 1.1M ops/s. Rapido pero sin mantenimiento desde 2021.", styles["TableCellLeft"]),
     Paragraph("262 KB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"]),
     Paragraph("MIT", styles["TableCell"])],
    [Paragraph("SQL.js", styles["TableCellLeft"]),
     Paragraph("SQLite completo via WASM. JOINs, subconsultas, indices. Requiere servidor para WASM.", styles["TableCellLeft"]),
     Paragraph("690 KB", styles["TableCell"]),
     Paragraph("Parcial", styles["TableCell"]),
     Paragraph("MIT", styles["TableCell"])],
    [Paragraph("DuckDB-WASM", styles["TableCellLeft"]),
     Paragraph("OLAP analitico. Procesa CSV, Parquet, JSON. Ideal para reportes y dashboard.", styles["TableCellLeft"]),
     Paragraph("3.2 MB", styles["TableCell"]),
     Paragraph("Parcial", styles["TableCell"]),
     Paragraph("MIT", styles["TableCell"])],
]
dt2 = Table(db_data, colWidths=[2.5*cm, 7.5*cm, 1.8*cm, 1.5*cm, 2.2*cm])
dt2.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2), ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
]))
story.append(dt2)
story.append(Spacer(1, 10))

# ── Desktop / Empaquetado ──
story.append(Paragraph("4.3 Empaquetado para escritorio", styles["SubTitle"]))
story.append(hr())

pack_data = [
    [Paragraph("<b>Opcion</b>", styles["TableHeader"]),
     Paragraph("<b>Peso .exe</b>", styles["TableHeader"]),
     Paragraph("<b>Runtime incluido</b>", styles["TableHeader"]),
     Paragraph("<b>Complejidad</b>", styles["TableHeader"]),
     Paragraph("<b>Ideal para</b>", styles["TableHeader"])],
    [Paragraph("Bun --compile", styles["TableCellLeft"]),
     Paragraph("50-55 MB", styles["TableCell"]),
     Paragraph("Bun (JS runtime completo)", styles["TableCell"]),
     Paragraph("Baja (JS puro)", styles["TableCell"]),
     Paragraph("Apps que necesitan backend local completo", styles["TableCell"])],
    [Paragraph("Neutralino.js", styles["TableCellLeft"]),
     Paragraph("1-2 MB", styles["TableCell"]),
     Paragraph("WebView del OS", styles["TableCell"]),
     Paragraph("Media (config)", styles["TableCell"]),
     Paragraph("Apps ligeras, wrappers de UI", styles["TableCell"])],
    [Paragraph("Tauri", styles["TableCellLeft"]),
     Paragraph("5-15 MB", styles["TableCell"]),
     Paragraph("WebView OS + Rust backend", styles["TableCell"]),
     Paragraph("Media-Alta (Rust basico)", styles["TableCell"]),
     Paragraph("Apps medianas con rendimiento", styles["TableCell"])],
    [Paragraph("Electron", styles["TableCellLeft"]),
     Paragraph("150-300 MB", styles["TableCell"]),
     Paragraph("Chromium completo", styles["TableCell"]),
     Paragraph("Baja (JS puro)", styles["TableCell"]),
     Paragraph("Apps legacy o que necesitan Chromium APIs", styles["TableCell"])],
]
pt2 = Table(pack_data, colWidths=[2.8*cm, 2.5*cm, 3.8*cm, 3*cm, 3.9*cm])
pt2.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2), ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
]))
story.append(pt2)
story.append(Spacer(1, 10))

# ── Otras utilidades ──
story.append(Paragraph("4.4 Otras utilidades offline-first", styles["SubTitle"]))
story.append(hr())

util_data = [
    [Paragraph("<b>Tecnologia</b>", styles["TableHeader"]),
     Paragraph("<b>Proposito</b>", styles["TableHeader"]),
     Paragraph("<b>Peso</b>", styles["TableHeader"]),
     Paragraph("<b>file://</b>", styles["TableHeader"])],
    [Paragraph("Tesseract.js", styles["TableCellLeft"]),
     Paragraph("OCR offline: extrae texto de imagenes escaneadas. Datos de idioma ~5-10 MB.", styles["TableCellLeft"]),
     Paragraph("~50 KB (core)", styles["TableCell"]),
     Paragraph("Parcial", styles["TableCell"])],
    [Paragraph("PDF.js", styles["TableCellLeft"]),
     Paragraph("Renderiza PDFs en el navegador sin plugins. Ideal para visores de documentos.", styles["TableCellLeft"]),
     Paragraph("~1.5 MB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"])],
    [Paragraph("jsPDF", styles["TableCellLeft"]),
     Paragraph("Genera PDFs desde JS. Facturas, reportes, certificados.", styles["TableCellLeft"]),
     Paragraph("~500 KB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"])],
    [Paragraph("SheetJS (XLSX)", styles["TableCellLeft"]),
     Paragraph("Lee y escribe Excel. Importacion/exportacion de datos tabulares.", styles["TableCellLeft"]),
     Paragraph("~350 KB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"])],
    [Paragraph("ApexCharts", styles["TableCellLeft"]),
     Paragraph("Graficos interactivos: barras, lineas, tortas, radar, heatmap.", styles["TableCellLeft"]),
     Paragraph("~250 KB", styles["TableCell"]),
     Paragraph("Si", styles["TableCell"])],
]
ut = Table(util_data, colWidths=[2.8*cm, 8.5*cm, 2.5*cm, 2.2*cm])
ut.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2), ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
]))
story.append(ut)

# ═══════════════ 5. MINI IA LOCAL ═══════════════
story.append(PageBreak())
story.append(Paragraph("5. Mini IA Local — Arquitectura", styles["SectionTitle"]))
story.append(hr())

story.append(Paragraph(
    "El componente mas diferencial del stack: un sistema de IA que corre 100% local, "
    "sin conexion a internet, capaz de leer la base de datos del usuario, buscar en "
    "su documentacion y responder preguntas en lenguaje natural.",
    styles["Body2"]
))
story.append(Spacer(1, 4))

story.append(Paragraph("5.1 Niveles de inteligencia", styles["SubTitle"]))
story.append(hr())

story.append(Paragraph("<b>Nivel 1: Busqueda inteligente (sin ML)</b>", styles["SubSubTitle"]))
story.append(Paragraph(
    "Usa FlexSearch o MiniSearch para busqueda full-text con scoring BM25/TF-IDF. "
    "Autocomplete, busqueda difusa tolerante a errores, sugerencias mientras escribes. "
    "Ideal para catalogos, historial de transacciones y documentacion tecnica. "
    "Cero descarga de modelos, instantaneo, peso ~7 KB.",
    styles["Body2"]
))

story.append(Paragraph("<b>Nivel 2: Busqueda semantica con embeddings</b>", styles["SubSubTitle"]))
story.append(Paragraph(
    "Usa Transformers.js con modelos multilinguees para convertir texto en vectores "
    "(embeddings) y buscar por significado, no por palabras exactas. "
    "Modelo recomendado: <i>Xenova/all-MiniLM-L6-v2</i> (80 MB cuantizado, soporta espanol). "
    "Los embeddings se almacenan en Dexie/SQLite y se comparan con similitud coseno. "
    "Primera descarga unica de ~80 MB, luego funciona 100% offline.",
    styles["Body2"]
))

story.append(Paragraph("<b>Nivel 3: Preguntas y respuestas (QA extractivo)</b>", styles["SubSubTitle"]))
story.append(Paragraph(
    "Usa Transformers.js con un modelo QA multilinguee (distilled BERT, ~70 MB) "
    "que extrae la respuesta directamente de un fragmento de texto. "
    "Combinado con los niveles 1 y 2 forma un pipeline RAG (Retrieval Augmented Generation) "
    "completo sin servidor.",
    styles["Body2"]
))

story.append(Spacer(1, 8))
story.append(Paragraph("5.2 Pipeline RAG local", styles["SubTitle"]))
story.append(hr())

story.append(Paragraph(
    "El usuario hace una pregunta -> el sistema busca fragmentos relevantes "
    "en la BD y documentacion -> extrae la respuesta del mejor fragmento. "
    "Todo corre en el navegador o en el .exe, sin enviar datos a ningun servidor.",
    styles["Body2"]
))

# Pipeline diagram as table
pipeline_data = [
    [Paragraph("<b>Paso</b>", styles["TableHeader"]),
     Paragraph("<b>Accion</b>", styles["TableHeader"]),
     Paragraph("<b>Tecnologia</b>", styles["TableHeader"]),
     Paragraph("<b>Tiempo</b>", styles["TableHeader"])],
    [Paragraph("1", styles["TableCell"]),
     Paragraph("El usuario escribe una pregunta en lenguaje natural", styles["TableCellLeft"]),
     Paragraph("Input field Alpine.js + FlexSearch autocomplete", styles["TableCellLeft"]),
     Paragraph("Instantaneo", styles["TableCell"])],
    [Paragraph("2", styles["TableCell"]),
     Paragraph("FlexSearch recupera top-10 fragmentos de BD y documentacion por keywords", styles["TableCellLeft"]),
     Paragraph("FlexSearch (indice en memoria + IndexedDB)", styles["TableCellLeft"]),
     Paragraph("< 5 ms", styles["TableCell"])],
    [Paragraph("3", styles["TableCell"]),
     Paragraph("Transformers.js genera embeddings de pregunta y fragmentos -> similitud coseno -> re-rank top-5", styles["TableCellLeft"]),
     Paragraph("Transformers.js (all-MiniLM-L6-v2)", styles["TableCellLeft"]),
     Paragraph("~200 ms", styles["TableCell"])],
    [Paragraph("4", styles["TableCell"]),
     Paragraph("Modelo QA extrae la respuesta del mejor fragmento", styles["TableCellLeft"]),
     Paragraph("Transformers.js (distilbert multilingual)", styles["TableCellLeft"]),
     Paragraph("~300-500 ms", styles["TableCell"])],
    [Paragraph("5", styles["TableCell"]),
     Paragraph("Muestra la respuesta con fragmento de referencia (citation)", styles["TableCellLeft"]),
     Paragraph("Alpine.js render en UI", styles["TableCellLeft"]),
     Paragraph("Instantaneo", styles["TableCell"])],
]
pl = Table(pipeline_data, colWidths=[1*cm, 5.5*cm, 6*cm, 3.5*cm])
pl.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2), ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG, HexColor("#eafaf1"), LIGHT_BG, white]),
]))
story.append(pl)

story.append(Spacer(1, 10))
story.append(Paragraph("5.3 Predicciones desde la BD", styles["SubTitle"]))
story.append(hr())

story.append(Paragraph(
    "No todo requiere redes neuronales. Para predicciones practicas desde datos locales:",
    styles["Body2"]
))

pred_items = bullet_list([
    "<b>Series temporales:</b> Promedio movil simple, suavizado exponencial, tendencia lineal. "
    "Implementacion en ~20 lineas de JS. Ideal para pronosticos de ventas, inventario, flujo de caja.",

    "<b>Clasificacion basica:</b> K-Nearest Neighbors (KNN) implementado en JS puro. "
    "Compara el caso actual con los N casos mas similares en BD. Ideal para diagnosticos, "
    "recomendaciones de productos, categorizacion automatica.",

    "<b>Reglas de negocio</b> via sistema experto simple: arboles de decision codificados "
    "desde la configuracion del usuario. Sin entrenamiento, sin modelos.",

    "<b>Clustering:</b> K-Means en JS puro para segmentacion de clientes o productos. "
    "Agrupa automaticamente por patrones de uso o compra.",

    "<b>Regresion lineal:</b> Minimimos cuadrados ordinarios en ~15 lineas de JS. "
    "Predice valores numericos a partir de datos historicos.",
])
for item in pred_items:
    story.append(item)

story.append(Spacer(1, 8))
story.append(Paragraph("5.4 Stack tecnologico de la Mini IA", styles["SubTitle"]))
story.append(hr())

ia_stack = [
    [Paragraph("<b>Componente</b>", styles["TableHeader"]),
     Paragraph("<b>Tecnologia</b>", styles["TableHeader"]),
     Paragraph("<b>Peso</b>", styles["TableHeader"]),
     Paragraph("<b>Notas</b>", styles["TableHeader"])],
    [Paragraph("Runtime ML", styles["TableCellLeft"]),
     Paragraph("Transformers.js v4", styles["TableCell"]),
     Paragraph("~9 MB", styles["TableCell"]),
     Paragraph("Apache-2.0. ONNX WASM backend.", styles["TableCellLeft"])],
    [Paragraph("Embeddings", styles["TableCellLeft"]),
     Paragraph("all-MiniLM-L6-v2", styles["TableCell"]),
     Paragraph("~80 MB", styles["TableCell"]),
     Paragraph("Soporta espanol. Cuantizado (Q8).", styles["TableCellLeft"])],
    [Paragraph("QA Extractivo", styles["TableCellLeft"]),
     Paragraph("distilbert multilingual", styles["TableCell"]),
     Paragraph("~70 MB", styles["TableCell"]),
     Paragraph("Modelo distilled BERT. Buen balance calidad/velocidad.", styles["TableCellLeft"])],
    [Paragraph("Busqueda", styles["TableCellLeft"]),
     Paragraph("FlexSearch o MiniSearch", styles["TableCell"]),
     Paragraph("~7-16 KB", styles["TableCell"]),
     Paragraph("Indice full-text persistente en IndexedDB.", styles["TableCellLeft"])],
    [Paragraph("Worker", styles["TableCellLeft"]),
     Paragraph("Web Worker (navegador) / Bun Worker (.exe)", styles["TableCell"]),
     Paragraph("—", styles["TableCell"]),
     Paragraph("Obligatorio: no bloquear UI con inferencia.", styles["TableCellLeft"])],
    [Paragraph("Almacenamiento", styles["TableCellLeft"]),
     Paragraph("Dexie + IndexedDB", styles["TableCell"]),
     Paragraph("—", styles["TableCell"]),
     Paragraph("Embeddings e indices guardados en DB local.", styles["TableCellLeft"])],
]
ist = Table(ia_stack, colWidths=[2.8*cm, 4*cm, 2*cm, 7.2*cm])
ist.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2), ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
]))
story.append(ist)

story.append(Spacer(1, 8))
story.append(info_box(
    "A tener en cuenta",
    "Los modelos ONNX se descargan UNA VEZ (primera ejecucion) y quedan cacheados. "
    "La descarga inicial requiere internet (~150 MB total). Despues funciona 100% offline. "
    "Alternativa: incluir modelos en el .exe (aumenta el peso final pero elimina la descarga inicial)."
))
story.append(Spacer(1, 6))

# ═══════════════ 6. ESTRATEGIA DE VENTA ═══════════════
story.append(PageBreak())
story.append(Paragraph("6. Estrategia de Venta y Entrega", styles["SectionTitle"]))
story.append(hr())

story.append(Paragraph(
    "El objetivo final es entregar un producto que el cliente perciba como un software "
    "profesional, no como una pagina web. La percepcion del formato de entrega impacta "
    "directamente en el precio que puedes cobrar.",
    styles["Body2"]
))
story.append(Spacer(1, 4))

story.append(Paragraph("6.1 Percepcion vs Realidad", styles["SubTitle"]))
story.append(hr())

story.append(Paragraph(
    "Un archivo .html que se abre en el navegador es funcionalmente identico a un .exe. "
    "Pero el cliente ve el .html como 'algo que me enviaron por correo' y el .exe como "
    "'un programa que instale'. La diferencia es psicologica, no tecnica.",
    styles["Body2"]
))
story.append(Spacer(1, 4))

percep_data = [
    [Paragraph("<b>Formato</b>", styles["TableHeader"]),
     Paragraph("<b>Percepcion del cliente</b>", styles["TableHeader"]),
     Paragraph("<b>Rango de precio tipico</b>", styles["TableHeader"]),
     Paragraph("<b>Proteccion</b>", styles["TableHeader"])],
    [Paragraph(".html suelto", styles["TableCellLeft"]),
     Paragraph("Es un archivo cualquiera", styles["TableCell"]),
     Paragraph("$ 50 - $ 200", styles["TableCell"]),
     Paragraph("Nula (codigo fuente visible)", styles["TableCell"])],
    [Paragraph(".exe (Bun)", styles["TableCellLeft"]),
     Paragraph("Es un programa instalado", styles["TableCell"]),
     Paragraph("$ 500 - $ 2.000", styles["TableCell"]),
     Paragraph("Media (binario ofuscado)", styles["TableCell"])],
    [Paragraph(".exe (Tauri)", styles["TableCellLeft"]),
     Paragraph("Es una app ligera profesional", styles["TableCell"]),
     Paragraph("$ 800 - $ 3.000", styles["TableCell"]),
     Paragraph("Alta (binario nativo)", styles["TableCell"])],
]
pc = Table(percep_data, colWidths=[3.5*cm, 5*cm, 4*cm, 3.5*cm])
pc.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2), ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG, HexColor("#eafaf1")]),
]))
story.append(pc)

story.append(Spacer(1, 8))
story.append(Paragraph("6.2 Personalizacion profesional", styles["SubTitle"]))
story.append(hr())

prof_items = bullet_list([
    "<b>Icono de aplicacion:</b> .ico (Windows) integrado en el .exe. El cliente ve tu logo en el escritorio, "
    "no el icono generico de Bun/node.",

    "<b>Ventana sin bordes de navegador:</b> Sin barra de direcciones, sin botones de navegador. "
    "Parece una app nativa. Tauri y Neutralino lo hacen por defecto. Con Bun --compile puedes "
    "usar un WebView personalizado.",

    "<b>Splash screen:</b> Pantalla de carga con logo de la empresa mientras se inicia la app. "
    "Pequeno detalle que marca la diferencia en percepcion profesional.",

    "<b>Nombre del proceso:</b> En el administrador de tareas aparece como 'MiApp.exe' no como 'node.exe' o 'bun.exe'.",

    "<b>Instalador opcional:</b> NSIS o Inno Setup para crear un setup.exe que instale en "
    "Program Files, cree acceso directo y se desinstale desde el Panel de Control.",
])
for item in prof_items:
    story.append(item)

story.append(Spacer(1, 8))
story.append(Paragraph("6.3 Canales de entrega", styles["SubTitle"]))
story.append(hr())

story.append(Paragraph(
    "<b>Entrega inicial:</b> Enlace de descarga cifrada (Mega, Google Drive con contrasena). "
    "El cliente recibe un ejecutable portable que funciona sin instalacion.",
    styles["Body2"]
))
story.append(Paragraph(
    "<b>Actualizaciones:</b> Mecanismo simple: la app verifica un archivo JSON local o "
    "usando el sistema de archivos para detectar version nueva. "
    "O descarga manual: 'descargue la nueva version desde el enlace que le envie'.",
    styles["Body2"]
))
story.append(Paragraph(
    "<b>Licenciamiento:</b> Sin DRM complejo. Opciones practicas: archivo de licencia "
    ".key generado con tu firma, o codigo de activacion offline validado con hash.",
    styles["Body2"]
))

# ═══════════════ 7. TABLA COMPARATIVA FINAL ═══════════════
story.append(PageBreak())
story.append(Paragraph("7. Tabla Comparativa Final", styles["SectionTitle"]))
story.append(hr())

story.append(Paragraph(
    "Las 5 opciones de empaquetado lado a lado para elegir segun el perfil del proyecto:",
    styles["Body2"]
))
story.append(Spacer(1, 4))

final_data = [
    [Paragraph("<b>Opcion</b>", styles["TableHeader"]),
     Paragraph("<b>Peso .exe</b>", styles["TableHeader"]),
     Paragraph("<b>Runtime</b>", styles["TableHeader"]),
     Paragraph("<b>Prot. IP</b>", styles["TableHeader"]),
     Paragraph("<b>Curva</b>", styles["TableHeader"]),
     Paragraph("<b>Ideal para</b>", styles["TableHeader"])],
    [Paragraph("<b>.html puro</b>", styles["TableCellLeft"]),
     Paragraph("0 MB + assets", styles["TableCell"]),
     Paragraph("Navegador", styles["TableCell"]),
     Paragraph("Nula", styles["TableCell"]),
     Paragraph("Nula", styles["TableCell"]),
     Paragraph("Demos rapidas, entregas internas, presupuesto minimo", styles["TableCellLeft"])],
    [Paragraph("<b>Bun --compile</b>", styles["TableCellLeft"]),
     Paragraph("50-55 MB", styles["TableCell"]),
     Paragraph("Bun incluido", styles["TableCell"]),
     Paragraph("Ofuscado", styles["TableCell"]),
     Paragraph("JS puro", styles["TableCell"]),
     Paragraph("Apps complejas con backend local, BD SQLite, API propia", styles["TableCellLeft"])],
    [Paragraph("<b>Neutralino.js</b>", styles["TableCellLeft"]),
     Paragraph("1-2 MB", styles["TableCell"]),
     Paragraph("WebView OS", styles["TableCell"]),
     Paragraph("Binario", styles["TableCell"]),
     Paragraph("Config basica", styles["TableCell"]),
     Paragraph("Apps ligeras, wrappers de UI, kioskos", styles["TableCellLeft"])],
    [Paragraph("<b>Tauri</b>", styles["TableCellLeft"]),
     Paragraph("5-15 MB", styles["TableCell"]),
     Paragraph("WebView + Rust", styles["TableCell"]),
     Paragraph("Binario++", styles["TableCell"]),
     Paragraph("Rust basico", styles["TableCell"]),
     Paragraph("Apps medianas, rendimiento critico, actualizaciones OTA", styles["TableCellLeft"])],
    [Paragraph("<b>Electron</b>", styles["TableCellLeft"]),
     Paragraph("150-300 MB", styles["TableCell"]),
     Paragraph("Chromium", styles["TableCell"]),
     Paragraph("Ofuscado", styles["TableCell"]),
     Paragraph("JS puro", styles["TableCell"]),
     Paragraph("Apps legacy, acceso completo a APIs nativas", styles["TableCellLeft"])],
]
ft = Table(final_data, colWidths=[2.5*cm, 2.2*cm, 2.8*cm, 1.8*cm, 1.8*cm, 4.9*cm])
ft.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT2), ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("GRID", (0, 0), (-1, -1), 0.4, GRID_LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG, HexColor("#eafaf1"), LIGHT_BG, white]),
]))
story.append(ft)

story.append(Spacer(1, 12))
story.append(Paragraph("<b>Recomendacion general:</b>", styles["SubSubTitle"]))
story.append(Paragraph(
    "Para el 80% de los proyectos freelance, la combinacion optima es: "
    "<b>desarrollo en modo Lite (file:// + Dexie)</b> con entrega final compilada via "
    "<b>Bun --compile</b>. Esto da el mejor balance entre simplicidad de desarrollo "
    "(sin build loop) y profesionalismo en la entrega (.exe con peso aceptable de ~55 MB). "
    "Si el peso es critico (menos de 10 MB), evaluar Neutralino.js o Tauri.",
    styles["Body2"]
))

# ═══════════════ 8. CONCLUSION ═══════════════
story.append(Spacer(1, 14))
story.append(Paragraph("8. Conclusion", styles["SectionTitle"]))
story.append(hr())

story.append(Paragraph(
    "El Stack Offline-First Profesional no es solo una coleccion de tecnologias: "
    "es una estrategia de negocio. Permite al desarrollador freelance LatAm:",
    styles["Body2"]
))

conc_items = bullet_list([
    "Crear software que funciona 100% sin internet, ideal para clientes con conectividad limitada.",
    "Entregar productos con percepcion profesional (.exe con logo, splash, nombre de proceso).",
    "Proteger el codigo fuente del cliente (binario compilado en lugar de HTML visible).",
    "Ofrecer IA local sin enviar datos del cliente a ningun servidor externo.",
    "Mantener la simplicidad del stack original (Alpine.js, Dexie, DaisyUI) "
    "con la opcion de compilar a ejecutable cuando el proyecto lo requiera.",
    "Cobrar precios acordes al valor percibido ($500-$3000 vs $50-$200).",
])
for item in conc_items:
    story.append(item)

story.append(Spacer(1, 8))
story.append(info_box(
    "Proximos pasos",
    "1. Definir spec del proyecto con spec-creator<br/>"
    "2. Generar codigo base con code-generator (modo Lite por defecto)<br/>"
    "3. Desarrollar modulos uno por uno<br/>"
    "4. Compilar a .exe para entrega al cliente<br/>"
    "5. Validar con Playwright + compliance guard"
))

# ── Generar PDF ──
doc.build(story, onFirstPage=make_cover, onLaterPages=make_footer)
print(f"PDF generado: {OUTPUT_PATH}")
