import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchAllStyleSummaries, getStyleById } from "../services/referoApi.js";
import { handleApiError } from "../utils/errors.js";
import { generateDesignMd } from "../utils/designMd.js";
import { CHARACTER_LIMIT, SITE_BASE_URL } from "../constants.js";
import type { StyleSummary, MatchScore } from "../types.js";

const MatchStyleInputSchema = z.object({
  project_description: z.string()
    .min(10)
    .max(2000)
    .describe("Describe your project: what it does, who it's for, and the desired look & feel. E.g. 'A dark-themed developer productivity tool for engineers, minimal and focused, similar to Linear or Vercel'"),
  color_scheme: z.enum(["light", "dark", "any"])
    .default("any")
    .describe("Preferred color scheme. 'any' lets the algorithm decide based on your description (default: 'any')"),
  industry_keywords: z.array(z.string()).optional()
    .describe("Optional: list of industry/domain keywords to boost matching (e.g. ['fintech', 'SaaS', 'AI', 'gaming'])"),
  top_n: z.number()
    .int()
    .min(1)
    .max(5)
    .default(3)
    .describe("Number of top matching styles to return with their design.md (default: 3, max: 5)"),
  include_design_md: z.boolean()
    .default(true)
    .describe("Whether to include the full design.md for the top match (default: true)"),
  response_format: z.enum(["markdown", "json"])
    .default("markdown")
    .describe("Output format (default: 'markdown')")
}).strict();

type MatchStyleInput = z.infer<typeof MatchStyleInputSchema>;

// ---- Matching heuristics ----

// Mood / aesthetic keyword groups
const MOOD_GROUPS: Record<string, string[]> = {
  dark: ["dark", "midnight", "black", "night", "shadow", "contrast", "dim", "noir"],
  light: ["light", "bright", "white", "clean", "airy", "fresh", "paper", "sky"],
  minimal: ["minimal", "minimalist", "clean", "simple", "stripped", "focused", "utility"],
  bold: ["bold", "strong", "vibrant", "colorful", "expressive", "playful", "loud"],
  professional: ["professional", "enterprise", "corporate", "serious", "business", "formal"],
  developer: ["developer", "developer tool", "devtool", "engineering", "code", "terminal", "command", "cli"],
  finance: ["finance", "fintech", "banking", "payment", "money", "wallet", "trading"],
  creative: ["creative", "design", "art", "studio", "agency", "portfolio"],
  productivity: ["productivity", "task", "project", "workflow", "todo", "schedule", "management"],
  ai: ["ai", "artificial intelligence", "machine learning", "ml", "llm", "gpt", "assistant"],
  health: ["health", "medical", "wellness", "fitness", "mental"],
  social: ["social", "community", "network", "chat", "messaging"]
};

function extractMoods(text: string): Set<string> {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [mood, keywords] of Object.entries(MOOD_GROUPS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      found.add(mood);
    }
  }
  return found;
}

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function scoreStyleForProject(
  style: StyleSummary,
  descTokens: string[],
  descMoods: Set<string>,
  colorScheme: string,
  industryKeywords: string[]
): MatchScore {
  let score = 0;
  const reasons: string[] = [];

  const styleText = [
    style.siteName,
    style.northStar,
    style.url,
    ...(style.fonts ?? []),
    ...(style.colors ?? []).map(c => c.name)
  ].join(" ").toLowerCase();

  // Color scheme match
  if (colorScheme !== "any") {
    if (style.colorScheme?.toLowerCase() === colorScheme) {
      score += 5;
      reasons.push(`Matches requested ${colorScheme} theme`);
    } else {
      score -= 3;
    }
  } else {
    // Infer from description
    if (descMoods.has("dark") && style.colorScheme?.toLowerCase() === "dark") {
      score += 4;
      reasons.push("Dark theme matches your description");
    } else if (descMoods.has("light") && style.colorScheme?.toLowerCase() === "light") {
      score += 4;
      reasons.push("Light theme matches your description");
    }
  }

  // North star mood alignment
  const styleMoods = extractMoods(style.northStar ?? "");
  const sharedMoods = [...descMoods].filter(m => styleMoods.has(m));
  if (sharedMoods.length > 0) {
    score += sharedMoods.length * 3;
    reasons.push(`Shared aesthetic: ${sharedMoods.join(", ")}`);
  }

  // Token overlap between description and style metadata
  let tokenMatches = 0;
  for (const token of descTokens) {
    if (styleText.includes(token)) {
      tokenMatches++;
    }
  }
  if (tokenMatches > 0) {
    score += Math.min(tokenMatches * 2, 10);
    if (tokenMatches >= 2) {
      reasons.push(`${tokenMatches} keyword matches in style metadata`);
    }
  }

  // Industry keyword bonus
  for (const kw of industryKeywords) {
    if (styleText.includes(kw.toLowerCase())) {
      score += 4;
      reasons.push(`Industry match: "${kw}"`);
    }
  }

  // Font relevance: developer tools often use monospaced/Inter fonts
  if (descMoods.has("developer") && style.fonts?.some(f =>
    f.toLowerCase().includes("mono") || f.toLowerCase().includes("inter") || f.toLowerCase().includes("ibm")
  )) {
    score += 3;
    reasons.push("Developer-friendly typography");
  }

  return { style, score, reasons };
}

export function registerMatchStyleTool(server: McpServer): void {
  server.registerTool(
    "refero_match_style",
    {
      title: "Match Design Style to Project",
      description: `Find the best matching design styles from styles.refero.design for your project.

Analyzes your project description against the curated catalog of real-product design systems and ranks them by aesthetic fit. Returns the top matches with their full design.md documentation ready to use as an AI design prompt.

This is the primary tool to use when you want design inspiration or a design system that fits your project's needs.

Args:
  - project_description (string, 10-2000 chars): Describe your project — purpose, audience, desired vibe.
    Example: "A dark-themed SaaS dashboard for DevOps engineers. Should feel professional and technical, similar to Linear. Uses Inter font. Dark mode only."
  - color_scheme ('light' | 'dark' | 'any'): Preferred theme. 'any' infers from description (default: 'any')
  - industry_keywords (string[]): Optional domain keywords to boost matches (e.g. ['fintech', 'B2B', 'gaming'])
  - top_n (number): Number of top matches to return with full details, 1-5 (default: 3)
  - include_design_md (boolean): Include full design.md for the top match (default: true)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns (markdown):
  - Ranked list of best-matching styles with match scores and reasons
  - Full design.md for the #1 match (if include_design_md=true)
  - Style IDs to use with refero_get_design_md for other matches

Returns (json): {
  "matches": [
    {
      "rank": number,
      "score": number,
      "reasons": string[],
      "id": string,
      "siteName": string,
      "northStar": string,
      "colorScheme": string,
      "stylePageUrl": string,
      "designMd": string | null  // Only for top match when include_design_md=true
    }
  ]
}

Examples:
  - "Find a style for my dark minimal developer tool" →
    project_description="Dark minimal SaaS tool for developers, command-line feel", color_scheme="dark"
  - "Match a design for a finance app" →
    project_description="Mobile banking app, clean professional look", industry_keywords=["fintech"]
  - "Get top 5 matches for my creative portfolio" →
    project_description="Creative agency portfolio with bold typography", top_n=5`,
      inputSchema: MatchStyleInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: MatchStyleInput) => {
      try {
        // Fetch all available style summaries
        const allStyles = await fetchAllStyleSummaries(3);

        const descTokens = tokenize(params.project_description);
        const descMoods = extractMoods(params.project_description);
        const industryKeywords = params.industry_keywords ?? [];

        // Score and rank all styles
        const scored: MatchScore[] = allStyles
          .map(s => scoreStyleForProject(
            s,
            descTokens,
            descMoods,
            params.color_scheme,
            industryKeywords
          ))
          .sort((a, b) => b.score - a.score)
          .slice(0, params.top_n);

        // Fetch full design.md for the top match if requested
        let topDesignMd: string | null = null;
        if (params.include_design_md && scored.length > 0) {
          try {
            const topStyle = await getStyleById(scored[0].style.id);
            topDesignMd = generateDesignMd(topStyle);
            if (topDesignMd.length > CHARACTER_LIMIT * 0.7) {
              topDesignMd = topDesignMd.slice(0, Math.floor(CHARACTER_LIMIT * 0.7));
              topDesignMd += "\n\n---\n*[Truncated. Use refero_get_design_md for the full document.]*";
            }
          } catch {
            topDesignMd = null;
          }
        }

        const matches = scored.map((m, i) => ({
          rank: i + 1,
          score: m.score,
          reasons: m.reasons,
          id: m.style.id,
          siteName: m.style.siteName,
          url: m.style.url,
          northStar: m.style.northStar,
          colorScheme: m.style.colorScheme,
          fonts: m.style.fonts ?? [],
          colors: (m.style.colors ?? []).slice(0, 5),
          stylePageUrl: `${SITE_BASE_URL}/style/${m.style.id}`,
          designMd: i === 0 && params.include_design_md ? topDesignMd : null
        }));

        if (params.response_format === "json") {
          const output = {
            project_description: params.project_description,
            total_styles_analyzed: allStyles.length,
            detected_moods: [...descMoods],
            matches
          };
          return {
            content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
            structuredContent: output
          };
        }

        // Markdown output
        const lines: string[] = [
          "# Design Style Matches",
          "",
          `**Project**: ${params.project_description.slice(0, 150)}${params.project_description.length > 150 ? "…" : ""}`,
          `**Detected moods**: ${[...descMoods].join(", ") || "general"}`,
          `**Analyzed**: ${allStyles.length} styles`,
          ""
        ];

        for (const m of matches) {
          const badge = m.rank === 1 ? "🏆 Best Match" : `#${m.rank}`;
          lines.push(`## ${badge}: ${m.siteName}`);
          lines.push(`**Match Score**: ${m.score}`);
          lines.push(`**North Star**: ${m.northStar}`);
          lines.push(`**Theme**: ${m.colorScheme}`);
          if (m.fonts.length > 0) lines.push(`**Fonts**: ${m.fonts.join(", ")}`);
          if (m.reasons.length > 0) {
            lines.push(`**Why it matches**:`);
            for (const r of m.reasons) {
              lines.push(`  - ${r}`);
            }
          }
          lines.push(`**Style ID**: \`${m.id}\``);
          lines.push(`**View**: [${m.stylePageUrl}](${m.stylePageUrl})`);
          if (m.rank > 1) {
            lines.push(`*Use \`refero_get_design_md\` with ID \`${m.id}\` to get the full design.md*`);
          }
          lines.push("");
        }

        if (topDesignMd) {
          lines.push("---");
          lines.push("");
          lines.push(`# Design.md for Top Match: ${matches[0]?.siteName}`);
          lines.push("");
          lines.push(topDesignMd);
        }

        let result = lines.join("\n");
        if (result.length > CHARACTER_LIMIT) {
          result = result.slice(0, CHARACTER_LIMIT);
          result += "\n\n---\n*[Response truncated. Use refero_get_design_md with the style ID for other matches.]*";
        }

        return {
          content: [{ type: "text", text: result }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: "text", text: handleApiError(error) }]
        };
      }
    }
  );
}
