import type { StyleDetail, DesignSystem, DesignSystemColor } from "../types.js";

function colorSwatchLine(color: DesignSystemColor): string {
  const role = color.role ? ` — ${color.role}` : "";
  const group = color.group ? ` [${color.group}]` : "";
  return `- **${color.name}**: \`${color.hex}\`${role}${group}`;
}

export function generateDesignMd(style: StyleDetail): string {
  const ds: DesignSystem = style.fullResult?.designSystem ?? {};
  const lines: string[] = [];

  // Header
  lines.push(`# ${style.siteName} — Design System`);
  lines.push("");
  lines.push(`> **North Star**: ${style.northStar || ds.northStar || "N/A"}`);
  lines.push(`> **Theme**: ${ds.theme || style.colorScheme || "N/A"}`);
  lines.push(`> **Source**: ${style.url}`);
  lines.push(`> **Refero ID**: \`${style.id}\``);
  lines.push("");

  // Description
  if (ds.description) {
    lines.push("## Overview");
    lines.push("");
    lines.push(ds.description);
    lines.push("");
  }

  // Colors
  const colors = ds.colors ?? style.colors?.map(c => ({ name: c.name, hex: c.hex })) ?? [];
  if (colors.length > 0) {
    lines.push("## Color Palette");
    lines.push("");
    for (const color of colors) {
      lines.push(colorSwatchLine(color));
    }
    lines.push("");
  }

  // Typography
  if (ds.typography && ds.typography.length > 0) {
    lines.push("## Typography");
    lines.push("");
    for (const font of ds.typography) {
      const weights = font.weights ? ` (weights: ${font.weights.join(", ")})` : "";
      const fallback = font.fallback ? ` — fallback: ${font.fallback}` : "";
      lines.push(`- **${font.family}**${weights}${fallback}`);
    }
    lines.push("");
  } else if (style.fonts && style.fonts.length > 0) {
    lines.push("## Typography");
    lines.push("");
    for (const font of style.fonts) {
      lines.push(`- **${font}**`);
    }
    lines.push("");
  }

  // Type Scale
  if (ds.typeScale && ds.typeScale.length > 0) {
    lines.push("## Type Scale");
    lines.push("");
    lines.push("| Role | Size | Weight | Line Height |");
    lines.push("|------|------|--------|-------------|");
    for (const step of ds.typeScale) {
      lines.push(
        `| ${step.role} | ${step.size ?? "—"} | ${step.weight ?? "—"} | ${step.lineHeight ?? "—"} |`
      );
    }
    lines.push("");
  }

  // Spacing & Layout
  if (ds.spacing) {
    lines.push("## Spacing & Layout");
    lines.push("");
    const sp = ds.spacing;
    if (sp.pageMaxWidth) lines.push(`- **Max Width**: ${sp.pageMaxWidth}`);
    if (sp.cardPadding) lines.push(`- **Card Padding**: ${sp.cardPadding}`);
    if (sp.elementGap) lines.push(`- **Element Gap**: ${sp.elementGap}`);
    if (sp.sectionGap) lines.push(`- **Section Gap**: ${sp.sectionGap}`);
    if (sp.radius) lines.push(`- **Border Radius**: ${sp.radius}`);
    lines.push("");
  }

  if (ds.layout) {
    lines.push("## Layout");
    lines.push("");
    lines.push(ds.layout);
    lines.push("");
  }

  // Surfaces
  if (ds.surfaces && ds.surfaces.length > 0) {
    lines.push("## Surfaces / Elevation");
    lines.push("");
    for (const surface of ds.surfaces) {
      const color = surface.color ? ` (\`${surface.color}\`)` : "";
      const desc = surface.description ? ` — ${surface.description}` : "";
      lines.push(`- **${surface.name}**${color}${desc}`);
    }
    if (ds.elevation && ds.elevation.length > 0) {
      lines.push("");
      lines.push("**Shadow tokens:**");
      for (const el of ds.elevation) {
        const name = el.name ? `${el.name}: ` : "";
        if (el.shadow) lines.push(`- ${name}\`${el.shadow}\``);
      }
    }
    lines.push("");
  }

  // Imagery
  if (ds.imagery) {
    lines.push("## Imagery");
    lines.push("");
    lines.push(ds.imagery);
    lines.push("");
  }

  // Dos & Don'ts
  if ((ds.dos && ds.dos.length > 0) || (ds.donts && ds.donts.length > 0)) {
    lines.push("## Design Principles");
    lines.push("");
    if (ds.dos && ds.dos.length > 0) {
      lines.push("### Do");
      lines.push("");
      for (const item of ds.dos) {
        lines.push(`- ${item}`);
      }
      lines.push("");
    }
    if (ds.donts && ds.donts.length > 0) {
      lines.push("### Don't");
      lines.push("");
      for (const item of ds.donts) {
        lines.push(`- ${item}`);
      }
      lines.push("");
    }
  }

  // Components
  if (ds.components && ds.components.length > 0) {
    lines.push("## Components");
    lines.push("");
    for (const comp of ds.components) {
      lines.push(`### ${comp.name}`);
      lines.push("");
      if (comp.description) {
        lines.push(comp.description);
        lines.push("");
      }
      if (comp.html) {
        lines.push("```html");
        lines.push(comp.html);
        lines.push("```");
        lines.push("");
      }
      if (comp.css) {
        lines.push("```css");
        lines.push(comp.css);
        lines.push("```");
        lines.push("");
      }
    }
  }

  // Similar styles
  if (ds.similar && ds.similar.length > 0) {
    lines.push("## Similar Design Systems");
    lines.push("");
    for (const s of ds.similar) {
      lines.push(`- ${s}`);
    }
    lines.push("");
  }

  // Custom sections
  if (ds.customSections && ds.customSections.length > 0) {
    for (const section of ds.customSections) {
      lines.push(`## ${section.title}`);
      lines.push("");
      lines.push(section.content);
      lines.push("");
    }
  }

  return lines.join("\n");
}
