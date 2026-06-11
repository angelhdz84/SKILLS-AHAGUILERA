from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, ListFlowable, ListItem,
    KeepTogether, HRFlowable
)
from reportlab.platypus.flowables import Flowable
import os

OUTPUT = os.path.join(os.path.dirname(__file__), "Guia_Perfiles_Lite_Full.pdf")

# ── Paleta de colores ──
C_PRIMARY   = HexColor("#1e3a5f")
C_SECONDARY = HexColor("#2d6a9f")
C_ACCENT    = HexColor("#38bdf8")
C_LITE      = HexColor("#059669")
C_FULL      = HexColor("#7c3aed")
C_COMBO     = HexColor("#d97706")
C_MIGRATE   = HexColor("#dc2626")
C_REWRITE   = HexColor("#0891b2")
C_BG_LIGHT  = HexColor("#f0f9ff")
C_BG_CODE   = HexColor("#f8fafc")
C_BORDER    = HexColor("#cbd5e1")
C_TEXT      = HexColor("#1e293b")
C_MUTED     = HexColor("#64748b")
C_TIP_BG    = HexColor("#fffbeb")
C_TIP_BORDER= HexColor("#f59e0b")

# ── Estilos ──
styles = getSampleStyleSheet()

sTitle = ParagraphStyle("CoverTitle", fontName="Helvetica-Bold", fontSize=28,
    textColor=white, alignment=TA_CENTER, spaceAfter=12)
sSubtitle = ParagraphStyle("CoverSub", fontName="Helvetica", fontSize=16,
    textColor=HexColor("#bfdbfe"), alignment=TA_CENTER, spaceAfter=6)
sVersion = ParagraphStyle("CoverVer", fontName="Helvetica", fontSize=10,
    textColor=HexColor("#94a3b8"), alignment=TA_CENTER)

sH1 = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=22,
    textColor=C_PRIMARY, spaceBefore=24, spaceAfter=12,
    borderWidth=0, borderPadding=0)
sH2 = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=16,
    textColor=C_SECONDARY, spaceBefore=18, spaceAfter=8)
sH3 = ParagraphStyle("H3", fontName="Helvetica-Bold", fontSize=13,
    textColor=C_PRIMARY, spaceBefore=12, spaceAfter=6)
sBody = ParagraphStyle("Body", fontName="Helvetica", fontSize=10,
    textColor=C_TEXT, leading=14, alignment=TA_JUSTIFY, spaceAfter=6)
sBodyBold = ParagraphStyle("BodyBold", parent=sBody, fontName="Helvetica-Bold")
sBullet = ParagraphStyle("Bullet", parent=sBody, leftIndent=20, bulletIndent=8,
    spaceBefore=2, spaceAfter=2)
sCode = ParagraphStyle("Code", fontName="Courier", fontSize=8.5,
    textColor=C_PRIMARY, leftIndent=12, spaceAfter=4, spaceBefore=4,
    backColor=C_BG_CODE, borderPadding=6)
sTip = ParagraphStyle("Tip", parent=sBody, leftIndent=16, rightIndent=16,
    backColor=C_TIP_BG, borderPadding=10, spaceBefore=8, spaceAfter=8)
sStep = ParagraphStyle("Step", fontName="Helvetica-Bold", fontSize=11,
    textColor=C_PRIMARY, spaceBefore=10, spaceAfter=4)

# ── Flowables ──

col_azul = HexColor("#1e3a5f")

class ColorBar(Flowable):
    def __init__(self, width, height=4, color=col_azul):
        super().__init__()
        self.width = width
        self.height = height
        self.color = color
    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)

def h1(text):
    return [ColorBar(460, 4, C_PRIMARY), Spacer(1, 4), Paragraph(text, sH1)]

def h2(text):
    return [Spacer(1, 2), Paragraph(text, sH2)]

def h3(text):
    return [Spacer(1, 1), Paragraph(text, sH3)]

def body(text):
    return Paragraph(text, sBody)

def bold(text):
    return Paragraph(f"<b>{text}</b>", sBodyBold)

def bullet(text, indent=0):
    return Paragraph(f"&bull; {text}", sBullet)

def code_block(text):
    lines = text.strip().split("\n")
    html = "<br/>".join(lines)
    return Paragraph(f"<font face='Courier' size='8.5' color='#1e3a5f'>{html}</font>", sCode)

def tip_box(text):
    return Paragraph(
        f"<img src='https://img.icons8.com/color/16/light-on.png' width='12' height='12'/> "
        f"<b>Consejo:</b> {text}",
        sTip
    )

def step(n, text):
    return Paragraph(f"<b>Paso {n}:</b> {text}", sStep)

def spacer(h=6):
    return Spacer(1, h)

def note_box(title, text, bg=HexColor("#eff6ff"), border=HexColor("#3b82f6")):
    t = Table(
        [[Paragraph(f"<b>{title}:</b> {text}", ParagraphStyle("Note", parent=sBody, leftIndent=4, spaceBefore=0, spaceAfter=0))]],
        colWidths=[430]
    )
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("BOX", (0,0), (-1,-1), 0.5, border),
        ("TOPPADDING", (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING", (0,0), (-1,-1), 12),
        ("RIGHTPADDING", (0,0), (-1,-1), 12),
    ]))
    return t

# ── Documento ──

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    topMargin=0.7*inch,
    bottomMargin=0.7*inch,
    leftMargin=0.8*inch,
    rightMargin=0.8*inch,
    title="Guia de Perfiles Lite y Full - SKILLS-AHAGUILERA",
    author="SKILLS-AHAGUILERA"
)

W = letter[0] - 1.6*inch

elems = []

# ════════════════════════════════════════════
# PORTADA
# ════════════════════════════════════════════

elems.append(Spacer(1, 1.5*inch))
elems.append(ColorBar(460, 6, C_PRIMARY))
elems.append(Spacer(1, 24))
elems.append(Paragraph("Guia de Perfiles", ParagraphStyle("PCover",
    fontName="Helvetica-Bold", fontSize=32, textColor=C_PRIMARY,
    alignment=TA_CENTER, spaceAfter=6)))
elems.append(Paragraph("Lite &amp; Full", ParagraphStyle("PCover2",
    fontName="Helvetica-Bold", fontSize=32, textColor=C_SECONDARY,
    alignment=TA_CENTER, spaceAfter=18)))
elems.append(ColorBar(200, 3, C_ACCENT))
elems.append(Spacer(1, 18))
elems.append(Paragraph(
    "Creacion, migracion y combinacion de aplicaciones<br/>offline-first con el stack SKILLS-AHAGUILERA",
    ParagraphStyle("PCover3", fontName="Helvetica", fontSize=13,
        textColor=C_MUTED, alignment=TA_CENTER, spaceAfter=24)))
elems.append(Spacer(1, 0.8*inch))

# Tabla resumen perfiles
summary_data = [
    [Paragraph("<b>Caracteristica</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white)),
     Paragraph("<b>Lite</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white)),
     Paragraph("<b>Full</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white))],
    [Paragraph("Apertura", sBody), Paragraph("Doble clic index.html", sBody), Paragraph("Bun --compile .exe", sBody)],
    [Paragraph("Runtime", sBody), Paragraph("Cualquier navegador", sBody), Paragraph("Windows (sin dependencias)", sBody)],
    [Paragraph("ES6 imports", sBody), Paragraph("No (file:// bloquea CORS)", sBody), Paragraph("Si (dentro de src/)", sBody)],
    [Paragraph("Base de datos", sBody), Paragraph("Dexie (IndexedDB)", sBody), Paragraph("Dexie + SQLite opcional", sBody)],
    [Paragraph("Cifrado", sBody), Paragraph("CryptoJS", sBody), Paragraph("CryptoJS", sBody)],
    [Paragraph("Librerias", sBody), Paragraph("assets/js/libs/ (curl/zip)", sBody), Paragraph("node_modules/ (bun add)", sBody)],
    [Paragraph("Tamano aprox.", sBody), Paragraph("~5 MB", sBody), Paragraph("~50 MB (.exe empaquetado)", sBody)],
    [Paragraph("Servicio IA", sBody), Paragraph("FlexSearch + estadisticas", sBody), Paragraph("+ PDF/DOCX/XLSX/CSV + QA", sBody)],
    [Paragraph("Distribucion", sBody), Paragraph("GitHub Pages + ZIP", sBody), Paragraph("GitHub Pages + Release .exe", sBody)],
]
t_summary = Table(summary_data, colWidths=[100, 170, 170])
t_summary.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), C_PRIMARY),
    ("BACKGROUND", (0,1), (0,-1), C_BG_LIGHT),
    ("BOX", (0,0), (-1,-1), 0.5, C_BORDER),
    ("INNERGRID", (0,0), (-1,-1), 0.25, C_BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
    ("RIGHTPADDING", (0,0), (-1,-1), 6),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
]))
elems.append(t_summary)
elems.append(Spacer(1, 24))
elems.append(Paragraph("Documento v1.0 — Junio 2026", sVersion))
elems.append(Spacer(1, 12))
elems.append(Paragraph("SKILLS-AHAGUILERA — Stack offline-first profesional", ParagraphStyle("footer",
    fontName="Helvetica", fontSize=9, textColor=C_MUTED, alignment=TA_CENTER)))

elems.append(PageBreak())

# ════════════════════════════════════════════
# TABLA DE CONTENIDO
# ════════════════════════════════════════════

elems.extend(h1("Tabla de Contenido"))
elems.append(Spacer(1, 8))
toc_items = [
    ("1.", "Perfil Lite: Crear una app desde cero"),
    ("2.", "Perfil Full: Crear una app desde cero"),
    ("3.", "Migrar de Lite a Full"),
    ("4.", "Combinar ambos perfiles"),
    ("5.", "Reescribir una app existente con SKILLS-AHAGUILERA"),
    ("Anexo A", "Comparativa de comandos"),
    ("Anexo B", "Solucion de problemas comunes"),
]
for num, title in toc_items:
    elems.append(Paragraph(
        f'<font color="#1e3a5f"><b>{num}</b></font>  {title}',
        ParagraphStyle("toc", fontName="Helvetica", fontSize=11,
            textColor=C_TEXT, spaceBefore=4, spaceAfter=4, leftIndent=12)
    ))
elems.append(PageBreak())

# ════════════════════════════════════════════
# SECCION 1: PERFIL LITE
# ════════════════════════════════════════════

elems.extend(h1("\u2699 1. Perfil Lite"))
elems.append(body(
    "El perfil <b>Lite</b> genera aplicaciones que se abren con doble clic en <b>index.html</b>, "
    "sin servidor, sin build step, sin dependencias de sistema. Ideal para prototipos, apps "
    "educativas, herramientas internas y despliegue inmediato via GitHub Pages."
))
elems.append(note_box("Requisitos",
    "Solo un navegador moderno (Chrome, Edge, Firefox). No requiere Node.js, Bun ni ningun runtime.",
    HexColor("#ecfdf5"), C_LITE))
elems.append(spacer(6))

# Paso a paso
elems.extend(h2("Paso a paso"))

steps_lite = [
    ("Iniciar el pipeline",
     "Ejecuta el comando <b>/new</b> en OpenCode. El prompt-inicial te preguntara: nombre de la app, "
     "tipo de app (ej: 'gestion de tareas', 'inventario'), descripcion y perfil. Responde <b>Lite</b>."),
    ("Setup automatico",
     "El skill <b>setup-init</b> descargara todas las librerias necesarias en <font face='Courier'>assets/js/libs/</font> "
     "usando curl y un script .bat. Librerias incluidas: Alpine.js, Dexie, CryptoJS, DaisyUI, "
     "Tailwind CSS, Bootstrap Icons, Animate.css, ApexCharts, jsPDF, SheetJS, pako."),
    ("Definir la especificacion",
     "El skill <b>spec-creator</b> guiara una sesion interactiva para definir funcionalidades, "
     "modelo de datos, user journeys y criterios de prueba. El resultado se guarda en "
     "<font face='Courier'>specs/[app].md</font>."),
    ("Generar codigo",
     "El skill <b>code-generator</b> genera los modulos uno por uno: core (db.js, crypto.js, ui.js, "
     "theme.js, app.js) y modulos funcionales en <font face='Courier'>modules/[modulo]/</font>. "
     "Todo en JavaScript plano, sin imports ES6, apto para file://."),
    ("Validar la app",
     "Ejecuta <b>/test</b>. El skill <b>validation-offline</b> corre 3 fases: validacion estatica "
     "(cumplimiento de reglas), guia DevTools (consola, storage, lighthouse) y tests E2E con Playwright. "
     "Genera reporte en <font face='Courier'>docs/validacion-[app].md</font>."),
    ("(Opcional) Anadir IA Jutia",
     "Responde <b>/ia</b> y elige perfil <b>Lite</b>. Se genera el modulo IA con busqueda "
     "FlexSearch en memoria, estadisticas y predicciones simples. Todo offline."),
    ("Publicar",
     "Ejecuta <b>/deploy</b>. <b>deployment-jigue</b> hace: commit con mensaje descriptivo, "
     "push a GitHub, empaquetado ZIP de toda la app en <font face='Courier'>dist/</font>, "
     "y activacion de GitHub Pages."),
]

for i, (title, desc) in enumerate(steps_lite, 1):
    elems.append(step(i, title))
    elems.append(body(desc))

elems.append(spacer(8))
elems.append(note_box("Tip: Despliegue rapido",
    "Si ya tienes el repo configurado con Pages, con solo <b>/deploy</b> la app queda "
    "publicada en minutos. El ZIP generado tambien sirve para distribucion manual "
    "(USB, intranet, email).", C_TIP_BG, C_TIP_BORDER))

# Esquema visual de archivos generados
elems.append(spacer(6))
elems.extend(h3("Estructura de archivos generada"))
elems.append(code_block("""
mi-app/
  index.html              ← Punto de entrada (doble clic)
  project.config.js       ← Configuracion del proyecto
  assets/
    js/
      libs/               ← Librerias descargadas (Alpine, Dexie, etc.)
      core/
        db.js             ← Capa de datos (Dexie)
        crypto.js         ← Cifrado (CryptoJS)
        ui.js             ← Componentes UI compartidos
        theme.js          ← Tema claro/oscuro
        app.js            ← Inicializador
    css/
      app.css             ← Estilos personalizados
  modules/
    [modulo1]/
      module.js
      module.html
    ...
  specs/
    mi-app.md             ← Especificacion tecnica
  docs/
    validacion-mi-app.md  ← Reporte de validacion
    test_results.json
  dist/
    mi-app.zip            ← App empaquetada para distribuir
"""))
elems.append(PageBreak())

# ════════════════════════════════════════════
# SECCION 2: PERFIL FULL
# ════════════════════════════════════════════

elems.extend(h1("\U0001f4bb 2. Perfil Full"))
elems.append(body(
    "El perfil <b>Full</b> genera aplicaciones compiladas con <b>Bun --compile</b>, produciendo "
    "un ejecutable .exe autocontenido (~50 MB) que no requiere runtime ni dependencias. "
    "Ideal para apps profesionales, distribucion a clientes, entornos sin navegador moderno "
    "y casos de uso que requieren SQLite, ingesta de documentos o modelos de IA locales."
))
elems.append(note_box("Requisitos",
    "Bun (https://bun.sh) instalado en el sistema de desarrollo. Windows 10+ para el .exe compilado.",
    HexColor("#f5f3ff"), C_FULL))
elems.append(spacer(6))

elems.extend(h2("Paso a paso"))

steps_full = [
    ("Iniciar el pipeline",
     "Ejecuta <b>/new</b>. Responde al prompt-inicial con el nombre, tipo, descripcion y "
     "perfil: <b>Full</b>. El orquestador detectara que todas las fases usaran la variante Full."),
    ("Setup automatico",
     "<b>setup-init</b> ejecutara <font face='Courier'>bun init</font> para crear "
     "<font face='Courier'>package.json</font> y luego <font face='Courier'>bun add</font> "
     "para instalar las dependencias (Dexie, CryptoJS, Alpine, DaisyUI, etc.) en "
     "<font face='Courier'>node_modules/</font>. Tambien crea la estructura "
     "<font face='Courier'>public/</font> para los archivos frontend y "
     "<font face='Courier'>src/index.js</font> como punto de entrada del backend Bun."),
    ("Definir especificacion",
     "Igual que en Lite: <b>spec-creator</b> guia la sesion interactiva. El modelo de datos "
     "puede incluir opcionalmente tablas SQLite para datos pesados, ademas de las tablas Dexie "
     "para el frontend."),
    ("Generar codigo",
     "<b>code-generator</b> genera ~95% del codigo identico a Lite en <font face='Courier'>public/</font> "
     "(los modulos Alpine + HTML). Adicionalmente genera <font face='Courier'>src/index.js</font> "
     "con el backend Bun: servidor HTTP estatico, manejo de archivos, SQLite (opcional) y "
     "sincronizacion."),
    ("(Opcional) Anadir IA Jutia",
     "Responde <b>/ia</b> y elige <b>Full</b>. Ademas de FlexSearch, se agregan: "
     "ingesta de PDF (<font face='Courier'>pdf.js</font>), DOCX (<font face='Courier'>mammoth.js</font>), "
     "XLSX (<font face='Courier'>SheetJS</font>), CSV y Markdown. Incluye Transformers.js "
     "con dos modelos: MiniLM-L6 (embeddings, ~80 MB) y BERT multilingual (QA, ~150 MB). "
     "Los modelos se descargan en <font face='Courier'>assets/models/</font> durante el setup."),
    ("Compilar y validar",
     "Ejecuta <b>/test</b>. La validacion incluye ademas verificacion de que los imports en "
     "<font face='Courier'>src/</font> son correctos y que <font face='Courier'>public/</font> "
     "no contiene imports (regla de compliance)."),
    ("Publicar",
     "Ejecuta <b>/deploy</b>. <b>deployment-jigue</b> hace: commit, push, compilacion "
     "con <font face='Courier'>bun build --compile ./src/index.js --outfile dist/app.exe</font>, "
     "subida del .exe como Release asset a GitHub, y activacion de GitHub Pages "
     "para la version web (public/)."),
]

for i, (title, desc) in enumerate(steps_full, 1):
    elems.append(step(i, title))
    elems.append(body(desc))

elems.append(spacer(8))
elems.append(note_box("Tip: .exe portable",
    "El .exe compilado con Bun incluye el runtime y todas las dependencias. "
    "El usuario final solo necesita descargar el archivo y ejecutarlo. "
    "No requiere Bun, Node.js ni ningun runtime instalado.", C_TIP_BG, C_TIP_BORDER))

elems.append(spacer(6))
elems.extend(h3("Estructura de archivos generada"))
elems.append(code_block("""
mi-app/
  public/
    index.html              ← Frontend (identico a Lite)
    project.config.js
    assets/
      js/
        core/               ← db.js, crypto.js, ui.js, theme.js, app.js (identicos a Lite)
    modules/                ← Modulos Alpine (identicos a Lite)
  src/
    index.js                ← Backend Bun: servidor HTTP + SQLite + sync
  package.json
  node_modules/             ← Dependencias npm
  assets/
    models/                 ← Modelos Transformers.js (Full IA)
  specs/
    mi-app.md
  docs/
    validacion-mi-app.md
  dist/
    app.exe                 ← Ejecutable compilado (~50 MB)
"""))
elems.append(PageBreak())

# ════════════════════════════════════════════
# SECCION 3: MIGRAR DE LITE A FULL
# ════════════════════════════════════════════

elems.extend(h1("\U0001f504 3. Migrar de Lite a Full"))
elems.append(body(
    "Ya tienes una app funcionando con perfil Lite (doble clic en index.html). Quieres "
    "migrarla a Full para obtener: ejecutable .exe, backend Bun, SQLite opcional e IA "
    "completa con ingesta de documentos. El proceso es sencillo porque ~95% del codigo "
    "frontend es identico."
))

elems.extend(h2("Proceso de migracion"))

migrate_steps = [
    ("Actualizar project.config.js",
     "Cambia <font face='Courier'>perfil: 'lite'</font> a <font face='Courier'>perfil: 'full'</font>. "
     "Esto le indica a todos los skills que trabajen en modo Full."),
    ("Ejecutar setup-init en modo Full",
     "Ejecuta <b>/setup</b>. <b>setup-init</b> detectara que ya existe la estructura Lite y "
     "anadira solo lo que falta: <font face='Courier'>src/index.js</font>, "
     "<font face='Courier'>package.json</font>, <font face='Courier'>node_modules/</font>. "
     "No modificara tus modulos existentes."),
    ("Reubicar assets si es necesario",
     "Si tu app Lite usa librerias en <font face='Courier'>assets/js/libs/</font>, el setup "
     "Full las duplicara via bun add. Puedes migrar las referencias en index.html "
     "de <font face='Courier'>assets/js/libs/alpine.js</font> a "
     "<font face='Courier'>node_modules/alpinejs/...</font>, o mantener ambas. "
     "El skill code-generator maneja esto automaticamente."),
    ("Compilar y probar",
     "Ejecuta <b>bun build --compile ./src/index.js --outfile dist/app.exe</b>. "
     "Prueba que el .exe funcione correctamente y que el frontend se sirva "
     "desde el servidor embebido de Bun."),
    ("Actualizar el deploy",
     "Ejecuta <b>/deploy</b>. Ahora deployment-jigue empaquetara el .exe y lo subira "
     "como Release asset, ademas de mantener GitHub Pages para la version web."),
]

for i, (title, desc) in enumerate(migrate_steps, 1):
    elems.append(step(i, title))
    elems.append(body(desc))

elems.append(spacer(8))
elems.append(note_box("Importante",
    "La migracion NO rompe la compatibilidad Lite. Tu index.html sigue funcionando "
    "con doble clic. La app Full simplemente anade capacidades nuevas sin eliminar "
    "las existentes. Puedes mantener ambos perfiles en paralelo.", HexColor("#fef2f2"), C_MIGRATE))

elems.append(spacer(6))
elems.extend(h3("Diagrama de migracion"))
diag_data = [
    [Paragraph("Lite", ParagraphStyle("diag", fontName="Helvetica-Bold", fontSize=11, textColor=white, alignment=TA_CENTER)),
     Paragraph("", sBody),
     Paragraph("Full", ParagraphStyle("diag", fontName="Helvetica-Bold", fontSize=11, textColor=white, alignment=TA_CENTER))],
    [Paragraph("index.html (doble clic)", sBody),
     Paragraph("\U0001f504", ParagraphStyle("arr", fontSize=20, alignment=TA_CENTER)),
     Paragraph("public/index.html <font color='#64748b'>(identico)</font>", sBody)],
    [Paragraph("assets/js/core/*.js", sBody),
     Paragraph("\U0001f504", ParagraphStyle("arr", fontSize=20, alignment=TA_CENTER)),
     Paragraph("public/assets/js/core/*.js <font color='#64748b'>(identico)</font>", sBody)],
    [Paragraph("modules/*/", sBody),
     Paragraph("\U0001f504", ParagraphStyle("arr", fontSize=20, alignment=TA_CENTER)),
     Paragraph("public/modules/*/ <font color='#64748b'>(identico)</font>", sBody)],
    [Paragraph("<font color='#94a3b8'>(no existe)</font>", sBody),
     Paragraph("+", ParagraphStyle("arr", fontSize=16, alignment=TA_CENTER)),
     Paragraph("src/index.js + package.json + node_modules/", sBody)],
    [Paragraph("<font color='#94a3b8'>(no existe)</font>", sBody),
     Paragraph("+", ParagraphStyle("arr", fontSize=16, alignment=TA_CENTER)),
     Paragraph("assets/models/ (modelos IA)", sBody)],
    [Paragraph("dist/app.zip", sBody),
     Paragraph("\u2192", ParagraphStyle("arr", fontSize=20, alignment=TA_CENTER)),
     Paragraph("dist/app.exe + Release GitHub", sBody)],
]
t_diag = Table(diag_data, colWidths=[120, 40, 200])
t_diag.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (0,0), C_LITE),
    ("BACKGROUND", (2,0), (2,0), C_FULL),
    ("BACKGROUND", (1,0), (1,0), HexColor("#f1f5f9")),
    ("BOX", (0,0), (-1,-1), 0.5, C_BORDER),
    ("INNERGRID", (0,0), (-1,-1), 0.25, C_BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
    ("RIGHTPADDING", (0,0), (-1,-1), 6),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("ALIGN", (1,0), (1,-1), "CENTER"),
]))
elems.append(t_diag)
elems.append(PageBreak())

# ════════════════════════════════════════════
# SECCION 4: COMBINAR AMBOS PERFILES
# ════════════════════════════════════════════

elems.extend(h1("\U0001f91d 4. Combinar ambos perfiles"))
elems.append(body(
    "El stack esta disenado para que ambos perfiles coexistan en el mismo proyecto. "
    "El 95% del codigo frontend es compartido, y puedes servir la misma app tanto "
    "como pagina web (Lite) como ejecutable de escritorio (Full)."
))

elems.extend(h2("Escenarios de combinacion"))

elems.extend(h3("4.1 Desarrollo hibrido"))
elems.append(body(
    "Usa <b>Lite</b> durante el desarrollo: abres index.html con doble clic, iteracion "
    "rapida, sin esperar compilacion. Cuando la funcionalidad esta lista, compilas con "
    "<b>Full</b> para distribucion. No necesitas cambiar nada en el codigo."
))
elems.append(code_block("""
# Flujo de trabajo recomendado:
1. Editas modulos en modules/ o public/
2. Pruebas al instante abriendo public/index.html (Lite)
3. Cuando esta listo: bun build --compile (Full)
4. Distribuyes el .exe
"""))

elems.extend(h3("4.2 App hibrida: web + escritorio"))
elems.append(body(
    "Tu app se despliega en <b>GitHub Pages</b> para acceso web inmediato (version Lite) "
    "y simultaneamente publicas un <b>.exe</b> en GitHub Releases para quienes prefieran "
    "una aplicacion de escritorio. deployment-jigue maneja ambos despliegues."
))
elems.append(note_box("Resultado",
    "<b>Mismo codigo, dos entregables:</b> tus usuarios pueden elegir entre abrir la app "
    "en el navegador (sin instalar nada) o descargar el ejecutable para uso offline "
    "completo con capacidades adicionales (SQLite, IA).", HexColor("#fffbeb"), C_COMBO))

elems.extend(h3("4.3 Diferenciacion por modulo"))
elems.append(body(
    "Puedes tener modulos que solo se activen en Full. "
    "Ejemplo: un modulo de ingesta de PDFs que no tiene sentido en el perfil Lite "
    "(porque requiere mammoth.js y Transformers.js). Usa project.config.js para "
    "controlar que modulos se generan segun el perfil."
))
elems.append(code_block("""
// project.config.js - Configuracion condicional
{
  "perfil": "full",
  "modulos": {
    "inventario": { "perfiles": ["lite", "full"] },
    "reportes":   { "perfiles": ["lite", "full"] },
    "ia-lectura": { "perfiles": ["full"] },  // Solo Full
    "sync-cloud": { "perfiles": ["full"] }   // Solo Full
  }
}
"""))

elems.extend(h3("4.4 Mantenimiento unificado"))
elems.append(body(
    "Al compartir ~95% del codigo, cualquier mejora en un modulo se refleja "
    "automaticamente en ambos perfiles. Las unicas diferencias estan en:"
))
elems.append(bullet("Metodo de carga de librerias (assets/js/libs/ vs node_modules/)"))
elems.append(bullet("Punto de entrada (index.html directo vs servido por Bun)"))
elems.append(bullet("Backend (no existe en Lite vs src/index.js en Full)"))
elems.append(bullet("IA (FlexSearch solo vs FlexSearch + Transformers)"))
elems.append(bullet("Empaquetado (ZIP vs .exe)"))
elems.append(bullet("Base de datos (Dexie solo vs Dexie + SQLite opcional)"))

elems.append(spacer(8))
elems.extend(h3("Matriz de compatibilidad"))
compat_data = [
    [Paragraph("<b>Componente</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white)),
     Paragraph("<b>Lite</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white, alignment=TA_CENTER)),
     Paragraph("<b>Full</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white, alignment=TA_CENTER)),
     Paragraph("<b>Compartido</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white, alignment=TA_CENTER))],
    [Paragraph("Modulos Alpine (UI)", sBody), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713 95%", ParagraphStyle("ok", fontSize=9, textColor=C_PRIMARY, alignment=TA_CENTER))],
    [Paragraph("core/db.js", sBody), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713 identico", ParagraphStyle("ok", fontSize=9, textColor=C_PRIMARY, alignment=TA_CENTER))],
    [Paragraph("core/crypto.js", sBody), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713 identico", ParagraphStyle("ok", fontSize=9, textColor=C_PRIMARY, alignment=TA_CENTER))],
    [Paragraph("core/ui.js", sBody), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713 identico", ParagraphStyle("ok", fontSize=9, textColor=C_PRIMARY, alignment=TA_CENTER))],
    [Paragraph("IA (FlexSearch)", sBody), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713 base identica", ParagraphStyle("ok", fontSize=9, textColor=C_PRIMARY, alignment=TA_CENTER))],
    [Paragraph("IA (Transformers)", sBody), Paragraph("\u2717", ParagraphStyle("ok", fontSize=11, color=C_MIGRATE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2717 solo Full", ParagraphStyle("ok", fontSize=9, color=C_MIGRATE, alignment=TA_CENTER))],
    [Paragraph("SQLite", sBody), Paragraph("\u2717", ParagraphStyle("ok", fontSize=11, color=C_MIGRATE, alignment=TA_CENTER)), Paragraph("\u2713 opcional", ParagraphStyle("ok", fontSize=9, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2717 solo Full", ParagraphStyle("ok", fontSize=9, color=C_MIGRATE, alignment=TA_CENTER))],
    [Paragraph("src/index.js (backend)", sBody), Paragraph("\u2717", ParagraphStyle("ok", fontSize=11, color=C_MIGRATE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2717 solo Full", ParagraphStyle("ok", fontSize=9, color=C_MIGRATE, alignment=TA_CENTER))],
    [Paragraph("Distribucion ZIP", sBody), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713 ambos", ParagraphStyle("ok", fontSize=9, textColor=C_PRIMARY, alignment=TA_CENTER))],
    [Paragraph("Distribucion .exe", sBody), Paragraph("\u2717", ParagraphStyle("ok", fontSize=11, color=C_MIGRATE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2717 solo Full", ParagraphStyle("ok", fontSize=9, color=C_MIGRATE, alignment=TA_CENTER))],
    [Paragraph("GitHub Pages", sBody), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713", ParagraphStyle("ok", fontSize=11, textColor=C_LITE, alignment=TA_CENTER)), Paragraph("\u2713 ambos", ParagraphStyle("ok", fontSize=9, textColor=C_PRIMARY, alignment=TA_CENTER))],
]
t_compat = Table(compat_data, colWidths=[120, 70, 90, 100])
t_compat.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), C_PRIMARY),
    ("BOX", (0,0), (-1,-1), 0.5, C_BORDER),
    ("INNERGRID", (0,0), (-1,-1), 0.25, C_BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 3),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ("LEFTPADDING", (0,0), (-1,-1), 4),
    ("RIGHTPADDING", (0,0), (-1,-1), 4),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("ALIGN", (1,0), (-1,-1), "CENTER"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [white, C_BG_LIGHT]),
]))
elems.append(t_compat)
elems.append(PageBreak())

# ════════════════════════════════════════════
# SECCION 5: REESCRIBIR APP EXISTENTE
# ════════════════════════════════════════════

elems.extend(h1("\U0001f4dd 5. Reescribir una app existente con SKILLS-AHAGUILERA"))
elems.append(body(
    "Tienes una aplicacion web funcionando (React, Vue, jQuery, HTML plano, etc.) y quieres "
    "reescribirla usando el stack offline-first de SKILLS-AHAGUILERA. El proceso transforma "
    "tu app existente en una aplicacion moderna, offline-first, sin CDNs, sin build step "
    "(o con Bun --compile si eliges Full), manteniendo las funcionalidades originales."
))
elems.append(note_box("Beneficios de la reescritura",
    "App offline-first (funciona sin internet), zero dependencias externas en runtime, "
    "cifrado local de datos sensibles, distribucion via doble clic o .exe, y un codigo "
    "base unificado mantenible con OpenCode.", HexColor("#ecfeff"), C_REWRITE))
elems.append(spacer(6))

elems.extend(h2("Fases de reescritura"))

elems.extend(h3("Fase A: Auditoria de la app existente"))
elems.append(body(
    "Antes de generar codigo nuevo, analiza la app actual para entender que funcionalidades "
    "preservar. No se trata de copiar codigo, sino de capturar el <b>comportamiento</b> y la "
    "<b>experiencia de usuario</b> existente."
))
elems.append(spacer(4))
rewrite_steps_a = [
    "Inventario de pantallas: lista cada vista/pagina/modulo que tiene la app actual.",
    "Identifica las <b>entidades de datos</b> que maneja (ej: usuarios, productos, pedidos). "
    "Esto alimentara el modelo de datos Dexie.",
    "Observa los <b>flujos de usuario</b>: que hace el usuario desde que abre la app hasta que "
    "completa cada tarea? Esto alimentara los User Journeys en spec-creator.",
    "Documenta <b>reglas de negocio</b> importantes: calculos, validaciones, permisos logicos.",
    "Toma capturas de pantalla de referencia para mantener la paridad visual.",
    "Identifica dependencias externas: APIs, CDNs, librerias que habria que reemplazar "
    "por equivalentes offline (Dexie en vez de fetch, CryptoJS en vez de Web Crypto, etc.).",
]
for s in rewrite_steps_a:
    elems.append(bullet(s))

elems.extend(h3("Fase B: Elegir perfil y configurar"))
elems.append(body(
    "Con la auditoria en mano, decide que perfil se adapta mejor:"
))
elems.append(bullet("<b>Lite</b> si la app original era HTML/JS plano sin backend, o si necesitas compatibilidad maxima (doble clic, GitHub Pages)."))
elems.append(bullet("<b>Full</b> si la app original tenia backend (Node, Python, PHP, etc.) y necesitas SQLite, ingesta de documentos o IA con Transformers."))
elems.append(bullet("<b>Lite + Full combinado</b> si quieres desarrollo rapido con doble clic y distribucion profesional con .exe."))
elems.append(spacer(4))
elems.append(body(
    "Ejecuta <b>/new</b> y responde con el perfil elegido. Luego <b>/setup</b> para preparar "
    "la estructura y librerias."
))

elems.extend(h3("Fase C: Especificacion desde el codigo existente"))
elems.append(body(
    "Ejecuta <b>/spec</b>. Usa los resultados de la auditoria para responder las preguntas "
    "de spec-creator. Cosas a tener en cuenta:"
))
elems.append(spacer(4))
rewrite_spec = [
    "Describe las funcionalidades en terminos de <b>lo que hace</b>, no de <b>como lo hace</b>. "
    "El spec-creator creara la implementacion optima para el stack offline-first.",
    "Proporciona el modelo de datos existente como referencia. spec-creator lo adaptara "
    "al modelo Dexie (con SQLite adicional si es Full).",
    "Si la app original usaba <b>fetch()</b> o <b>Axios</b> para datos, indicaselo a "
    "spec-creator: el reemplazo sera Dexie (lectura local) con sincronizacion diferida.",
    "Si la app original usaba <b>Web Crypto</b> o <b>bcrypt</b>, el reemplazo sera CryptoJS "
    "(compatible con file://).",
    "Si la app original tenia <b>autenticacion</b> (login, sesiones), describela: "
    "SKILLS-AHAGUILERA implementa checkSession() local con IndexedDB + verificacion "
    "en background si aplica.",
]
for s in rewrite_spec:
    elems.append(bullet(s))

elems.extend(h3("Fase D: Generacion de codigo modular"))
elems.append(body(
    "Ejecuta <b>/build</b>. code-generator generara los modulos uno por uno, en orden. "
    "Por cada modulo generado:"
))
elems.append(spacer(4))
rewrite_gen = [
    "Compara visualmente con la captura de pantalla de la app original.",
    "Ajusta detalles de UI en <font face='Courier'>module.html</font> si es necesario "
    "(colores, textos, disposicion de elementos).",
    "Verifica la logica de negocio en <font face='Courier'>module.js</font>.",
    "Confirma que pase la validacion de <b>stack-compliance-guard</b>.",
]
for s in rewrite_gen:
    elems.append(bullet(s))
elems.append(spacer(4))
elems.append(note_box("Tip: Reescritura progresiva",
    "No necesitas generar todos los modulos de golpe. Puedes empezar con los modulos "
    "criticos, validarlos, y luego anadir el resto. Cada modulo es independiente.", C_TIP_BG, C_TIP_BORDER))

elems.extend(h3("Fase E: Migracion de datos"))
elems.append(body(
    "Si la app existente tiene datos locales (LocalStorage, SQLite, archivos JSON), "
    "puedes migrarlos a Dexie:"
))
elems.append(spacer(4))
rewrite_data = [
    "Exporta los datos de la fuente original a JSON.",
    "Usa el helper de importacion en <font face='Courier'>core/db.js</font> para cargar "
    "los datos en IndexedDB con <font face='Courier'>bulkAdd()</font>.",
    "Si la migracion es grande, ejecutala en un solo bloque con Promise.all() "
    "para mantener la UI responsiva.",
    "Verifica que los datos migrados sean correctos abriendo la app y revisando "
    "cada modulo.",
]
for s in rewrite_data:
    elems.append(bullet(s))

elems.extend(h3("Fase F: Validacion y refinamiento"))
elems.append(body(
    "Ejecuta <b>/test</b> para la validacion completa. Ademas de las pruebas automaticas, "
    "realiza esta checklist manual:"
))
elems.append(spacer(4))
rewrite_check = [
    "<b>Paridad funcional:</b> cada funcionalidad de la app original existe en la nueva.",
    "<b>Paridad de datos:</b> los datos migrados son correctos y completos.",
    "<b>Rendimiento:</b> la app se siente igual o mas rapida que la original.",
    "<b>Offline-first:</b> desconecta internet y verifica que todo funcione.",
    "<b>Distribucion:</b> prueba el ZIP (Lite) o el .exe (Full) en un equipo limpio.",
]
for s in rewrite_check:
    elems.append(bullet(s))

elems.extend(h3("Fase G: Publicar"))
elems.append(body(
    "Ejecuta <b>/deploy</b> para commit, push, empaquetado y despliegue. "
    "La app reescrita queda publicada en GitHub Pages + ZIP (Lite) o .exe + Release (Full)."
))

elems.append(spacer(8))
elems.extend(h3("Ejemplo: Reescritura de una app jQuery a Lite"))

elems.append(body(
    "<b>App original:</b> Gestor de tareas hecho con jQuery + LocalStorage + Bootstrap 4 via CDN."
))
elems.append(spacer(4))
rewrite_example = [
    ("Auditoria", "3 pantallas (lista, detalle, formulario), entidad 'tarea', datos en LocalStorage, sin backend."),
    ("Perfil elegido", "Lite (compatible con doble clic, sin backend)."),
    ("Setup", "/new → 'gestor-tareas' → Lite → /setup. Librerias descargadas en assets/."),
    ("Spec", "/spec. Se definen: CRUD de tareas, busqueda, filtros por estado, exportacion CSV."),
    ("Generacion", "/build. Se generan modulos: tareas-lista, tareas-detalle, tareas-form. Cada uno se revisa contra la app original."),
    ("Migracion datos", "Script unico: leer localStorage → JSON → bulkAdd() a Dexie. ~50 tareas migradas en milisegundos."),
    ("Validacion", "/test. Se corrige un detalle de CSS. Todo pasa."),
    ("Publicacion", "/deploy. App en GitHub Pages + ZIP listo para compartir."),
]
ex_data = [[Paragraph(f"<b>{fase}</b>", ParagraphStyle("exh", fontName="Helvetica-Bold", fontSize=9, textColor=C_PRIMARY)),
            Paragraph(desc, ParagraphStyle("exd", fontName="Helvetica", fontSize=9, textColor=C_TEXT))]
           for fase, desc in rewrite_example]
ex_data.insert(0, [
    Paragraph("<b>Fase</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white)),
    Paragraph("<b>Que paso</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white)),
])
t_ex = Table(ex_data, colWidths=[90, 340])
t_ex.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), C_REWRITE),
    ("BOX", (0,0), (-1,-1), 0.5, C_BORDER),
    ("INNERGRID", (0,0), (-1,-1), 0.25, C_BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 3),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ("LEFTPADDING", (0,0), (-1,-1), 4),
    ("RIGHTPADDING", (0,0), (-1,-1), 4),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [white, HexColor("#ecfeff")]),
]))
elems.append(t_ex)

elems.append(spacer(10))
elems.append(note_box("Diferencia clave con 'Migrar de Lite a Full'",
    "La <b>Seccion 3</b> asume que YA tienes una app SKILLS-AHAGUILERA en perfil Lite y quieres "
    "cambiar a Full. Esta <b>Seccion 5</b> asume una app EXTERNA (React, jQuery, PHP, etc.) "
    "que quieres reescribir completa desde cero con el stack SKILLS-AHAGUILERA. "
    "Son procesos diferentes.", HexColor("#fef2f2"), C_MIGRATE))

elems.append(PageBreak())

# ════════════════════════════════════════════
# ANEXO A: COMPARATIVA DE COMANDOS
# ════════════════════════════════════════════

elems.extend(h1("Anexo A: Comparativa de comandos"))
elems.append(spacer(6))

cmd_data = [
    [Paragraph("<b>Comando</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white)),
     Paragraph("<b>Lite</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white, alignment=TA_CENTER)),
     Paragraph("<b>Full</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=9, textColor=white, alignment=TA_CENTER))],
    [Paragraph("/new", sBody), Paragraph("Pregunta perfil, crea estructura Lite", sBody), Paragraph("Pregunta perfil, crea estructura Full", sBody)],
    [Paragraph("/setup", sBody), Paragraph("curl + .bat descarga libs en assets/", sBody), Paragraph("bun init + bun add en node_modules/", sBody)],
    [Paragraph("/spec", sBody), Paragraph("spec-creator v4 con modelo datos Dexie", sBody), Paragraph("spec-creator v4 con modelo datos Dexie + SQLite opcional", sBody)],
    [Paragraph("/build", sBody), Paragraph("Genera modulos en modules/ + index.html", sBody), Paragraph("Genera modulos en public/ + src/index.js", sBody)],
    [Paragraph("/test", sBody), Paragraph("3 fases: estatico + DevTools + Playwright", sBody), Paragraph("4 fases: + verificacion imports src/", sBody)],
    [Paragraph("/ia", sBody), Paragraph("FlexSearch + stats + predicciones", sBody), Paragraph("+ pdf.js + mammoth.js + Transformers.js QA", sBody)],
    [Paragraph("/deploy", sBody), Paragraph("commit + push + Pages + ZIP dist/", sBody), Paragraph("commit + push + Pages + .exe + Release", sBody)],
]
t_cmd = Table(cmd_data, colWidths=[60, 190, 200])
t_cmd.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), C_PRIMARY),
    ("BOX", (0,0), (-1,-1), 0.5, C_BORDER),
    ("INNERGRID", (0,0), (-1,-1), 0.25, C_BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
    ("RIGHTPADDING", (0,0), (-1,-1), 6),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [white, C_BG_LIGHT]),
]))
elems.append(t_cmd)
elems.append(spacer(6))
elems.append(note_box("Nota",
    "Todos los comandos se ejecutan en OpenCode. El perfil se configura una vez "
    "al crear el proyecto en <font face='Courier'>project.config.js</font> y "
    "persiste para todas las fases.", HexColor("#f0f9ff"), C_SECONDARY))

elems.append(PageBreak())

# ════════════════════════════════════════════
# ANEXO B: SOLUCION DE PROBLEMAS
# ════════════════════════════════════════════

elems.extend(h1("Anexo B: Solucion de problemas comunes"))
elems.append(spacer(6))

problems = [
    ("El index.html no se abre en doble clic",
     "Lite",
     "Asegurate de que no haya imports ES6 (<font face='Courier'>&lt;script type=&quot;module&quot;&gt;</font>). "
     "En file://, los imports CORS bloquean la carga. stack-compliance-guard detecta esto automaticamente."),
    ("Bun --compile falla",
     "Full",
     "Verifica que Bun este instalado (<font face='Courier'>bun --version</font>). "
     "Asegurate de que <font face='Courier'>src/index.js</font> no importe archivos fuera de <font face='Courier'>src/</font> "
     "que no esten en node_modules."),
    ("Los modelos de IA no se descargan",
     "Full",
     "Los modelos Transformers.js (~233 MB total) se descargan durante el setup. "
     "Si falla la descarga, ejecuta manualmente el script de descarga en "
     "<font face='Courier'>assets/models/download-models.js</font>. "
     "Requiere conexion a internet la primera vez."),
    ("La migracion de Lite a Full duplica archivos",
     "Migracion",
     "Es normal. El setup Full no elimina archivos Lite. Puedes eliminar "
     "<font face='Courier'>assets/js/libs/</font> si ya no lo necesitas, "
     "pero asegurate de que las referencias en index.html apunten a "
     "<font face='Courier'>node_modules/</font>."),
    ("GitHub Pages no se actualiza",
     "Lite/Full",
     "Verifica que el Action workflow <font face='Courier'>deploy-pages.yml</font> este presente "
     "y que la rama configurada sea <b>main</b>. Ejecuta <b>/deploy</b> nuevamente."),
    ("El .exe generado no abre la UI",
     "Full",
     "Asegurate de que <font face='Courier'>src/index.js</font> sirva correctamente "
     "los archivos estaticos de <font face='Courier'>public/</font>. "
     "Verifica que la ruta sea relativa al .exe."),
    ("La app reescrita no tiene todas las funciones de la original",
     "Reescritura",
     "Revisa la auditoria de la Fase A. Compara modulo por modulo. "
     "Puedes generar modulos adicionales con <b>/build</b> sin afectar los existentes. "
     "Si falta logica de negocio, actualiza la spec y regenera."),
    ("Los datos migrados no aparecen en la app nueva",
     "Reescritura",
     "Verifica que el script de migracion uso <font face='Courier'>bulkAdd()</font> "
     "correctamente. Abre DevTools > Application > IndexedDB para inspeccionar "
     "que los datos esten en las tablas correctas."),
]

prob_data = [[Paragraph("<b>Problema</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=8, textColor=white)),
              Paragraph("<b>Perfil</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=8, textColor=white, alignment=TA_CENTER)),
              Paragraph("<b>Solucion</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=8, textColor=white))]]
for prob, perf, sol in problems:
    prob_data.append([
        Paragraph(prob, ParagraphStyle("prob", fontName="Helvetica-Bold", fontSize=8.5, textColor=C_PRIMARY)),
        Paragraph(perf, ParagraphStyle("perf", fontName="Helvetica", fontSize=8, textColor=C_MUTED, alignment=TA_CENTER)),
        Paragraph(sol, ParagraphStyle("sol", fontName="Helvetica", fontSize=8.5, textColor=C_TEXT)),
    ])
t_prob = Table(prob_data, colWidths=[120, 50, 260])
t_prob.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), C_PRIMARY),
    ("BOX", (0,0), (-1,-1), 0.5, C_BORDER),
    ("INNERGRID", (0,0), (-1,-1), 0.25, C_BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 3),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ("LEFTPADDING", (0,0), (-1,-1), 4),
    ("RIGHTPADDING", (0,0), (-1,-1), 4),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [white, C_BG_LIGHT]),
]))
elems.append(t_prob)
elems.append(spacer(24))

# Footer final
elems.append(ColorBar(460, 2, C_ACCENT))
elems.append(Spacer(1, 8))
elems.append(Paragraph(
    "Documento generado por SKILLS-AHAGUILERA — Stack offline-first profesional",
    ParagraphStyle("final", fontName="Helvetica", fontSize=8, textColor=C_MUTED, alignment=TA_CENTER)))

# ════════════════════════════════════════════
# BUILD
# ════════════════════════════════════════════

doc.build(elems)
print(f"PDF generado: {OUTPUT}")
print(f"Tamano: {os.path.getsize(OUTPUT):,} bytes")
