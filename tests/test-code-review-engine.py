"""
Test de code-review-engine: estructura de la skill, subagentes y comandos.
Valida:
1. SKILL.md tiene frontmatter con name/description + secciones clave.
2. Subagentes registrados en opencode.json con permisos read-only.
3. Archivos {file:} referenciados existen y son consistentes.
4. Comando /review registrado y coherente con la skill.
Requiere: pytest
"""
import json
import re
import sys
from pathlib import Path

TESTS_DIR = Path(__file__).parent
ROOT_DIR = TESTS_DIR.parent
SKILL_DIR = ROOT_DIR / "code-review-engine"
SKILL_FILE = SKILL_DIR / "SKILL.md"
AGENTS_DIR = SKILL_DIR / "agents"
REFS_DIR = SKILL_DIR / "references"
OPENCODE_JSON = ROOT_DIR / "opencode.json"
REVIEW_CMD = ROOT_DIR / ".opencode" / "commands" / "review.md"

# ─── Tests estáticos (sin browser) ────────────────────────────────


def _load_opencode():
    with open(OPENCODE_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


def test_skill_structure():
    """Valida que SKILL.md tenga frontmatter y secciones obligatorias"""
    assert SKILL_FILE.exists(), f"SKILL.md not found at {SKILL_FILE}"
    content = SKILL_FILE.read_text(encoding="utf-8")
    assert content.startswith("---"), "SKILL.md debe empezar con frontmatter ---"
    m = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    assert m, "Frontmatter no cerrado"
    fm = m.group(1)
    assert re.search(r"^name:\s*code-review-engine", fm, re.M), "Falta name: code-review-engine"
    assert "description:" in fm, "Falta description:"
    required_sections = ["LOS 4 EJES", "PROCESO", "OUTPUT", "REGLAS", "INTEGRACIÓN"]
    headings = re.findall(r"^## .*$", content, re.M)
    for s in required_sections:
        assert any(s in h for h in headings), f"Falta sección: {s}"
    # Referencia a subagentes (nombre final registrado)
    assert "review-agent" in content and "spec-reviewer" in content
    return True, "SKILL.md estructura OK"


def test_reviewer_agent_files():
    """Valida existencia y contenido mínimo de los agentes"""
    for fname in ["standards-reviewer.md", "spec-reviewer.md"]:
        f = AGENTS_DIR / fname
        assert f.exists(), f"Falta {fname}"
        content = f.read_text(encoding="utf-8")
        assert "## Salida" in content, f"{fname} debe tener sección Salida"
        assert "BLOCK" in content and "WARN" in content and "FYI" in content, \
            f"{fname} debe usar severidades BLOCK/WARN/FYI"
    return True, "Agentes presentes y con severidades"


def test_fowler_smells_reference():
    """Valida el baseline de smells y reglas R-A"""
    f = REFS_DIR / "fowler-smells.md"
    assert f.exists(), f"Falta {f.name}"
    content = f.read_text(encoding="utf-8")
    # 12 smells clásicos numerados
    smells = re.findall(r"^## \d+\. ", content, re.M)
    assert len(smells) >= 12, f"Faltan smells clásicos (encontrados {len(smells)})"
    # Reglas R-A1..R-A14
    rules = re.findall(r"^## R-A\d+", content, re.M)
    assert len(rules) >= 10, f"Faltan reglas R-A (encontradas {len(rules)})"
    return True, f"{len(smells)} smells + {len(rules)} reglas R-A"


def test_opencode_registers_reviewers():
    """Valida subagentes registrados con permisos read-only"""
    cfg = _load_opencode()
    agents = cfg.get("agent", {})
    for name in ["review-agent", "spec-reviewer"]:
        assert name in agents, f"Falta agente {name} en opencode.json"
        a = agents[name]
        assert a.get("mode") == "subagent", f"{name} debe ser subagent"
        perm = a.get("permission", {})
        assert perm.get("edit") == "deny", f"{name} debe tener edit: deny"
        assert perm.get("bash") == "read-only", f"{name} debe tener bash: read-only"
        # El prompt {file:} debe resolver
        prompt = a["prompt"]
        m = re.search(r"\{file:(.*?)\}", prompt)
        assert m, f"{name} prompt sin {{file:}}"
        target = ROOT_DIR / m.group(1)
        assert target.exists(), f"{name} referencia archivo inexistente: {m.group(1)}"
    return True, "review-agent y spec-reviewer registrados con edit: deny, bash: read-only"


def test_review_command():
    """Valida el comando /review y su coherencia con la skill"""
    assert REVIEW_CMD.exists(), f"Falta {REVIEW_CMD}"
    content = REVIEW_CMD.read_text(encoding="utf-8")
    assert content.startswith("---"), "review.md debe tener frontmatter"
    assert re.search(r"^name:\s*review", content, re.M), "Falta name: review"
    assert "git diff" in content, "Debe usar git diff"
    assert "code-review-engine" in content, "Debe referenciar la skill"
    assert "review-agent" in content and "spec-reviewer" in content, \
        "Debe despachar ambos subagentes"
    return True, "review.md registrado con diff git + 2 subagentes"


CHECKS = [
    ("Skill Structure", test_skill_structure),
    ("Reviewer Agents", test_reviewer_agent_files),
    ("Fowler Smells Reference", test_fowler_smells_reference),
    ("opencode.json Reviewers", test_opencode_registers_reviewers),
    ("Review Command", test_review_command),
]


def main():
    print("=" * 60)
    print("  TEST ESTRUCTURAL - code-review-engine")
    print("=" * 60)
    all_pass = True
    for name, fn in CHECKS:
        try:
            ok, msg = fn()
            status = "PASS" if ok else "FAIL"
            print(f"  [{status}] {name}: {msg}")
            if not ok:
                all_pass = False
        except AssertionError as e:
            print(f"  [FAIL] {name}: {e}")
            all_pass = False
        except Exception as e:
            print(f"  [ERROR] {name}: {e}")
            all_pass = False
    print("=" * 60)
    if all_pass:
        print("  [PASS] TODOS LOS CHECKS PASARON")
    else:
        print("  [FAIL] ALGUNOS CHECKS FALLARON")
    print("=" * 60)
    return 0 if all_pass else 1


if __name__ == "__main__":
    sys.exit(main())
