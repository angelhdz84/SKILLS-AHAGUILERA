import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchAllStyleSummaries } from "../services/referoApi.js";
import { handleApiError } from "../utils/errors.js";
import { SITE_BASE_URL } from "../constants.js";
import type { StyleSummary } from "../types.js";

const SearchStylesInputSchema = z.object({
  query: z.string()
    .min(1)
    .max(200)
    .describe("Search query — can be a brand name, mood, color name, font, or descriptive keyword (e.g. 'dark', 'minimal', 'Inter', 'finance', 'Stripe')"),
  color_scheme: z.enum(["light", "dark", "any"])
    .default("any")
    .describe("Filter by color scheme (default: 'any')"),
  limit: z.number()
    .int()
    .min(1)
    .max(20)
    .default(10)
    .describe("Maximum number of results to return (default: 10, max: 20)"),
  response_format: z.enum(["markdown", "json"])
    .default("markdown")
    .describe("Output format: 'markdown' for human-readable or 'json' for structured data")
}).strict();

type SearchStylesInput = z.infer<typeof SearchStylesInputSchema>;

function scoreStyle(style: StyleSummary, query: string, terms: string[]): number {
  let score = 0;
  const searchText = [
    style.siteName,
    style.northStar,
    style.url,
    style.colorScheme,
    ...(style.fonts ?? []),
    ...(style.colors ?? []).map(c => `${c.name} ${c.hex}`)
  ].join(" ").toLowerCase();

  for (const term of terms) {
    if (searchText.includes(term)) {
      // Bonus for site name matches
      if (style.siteName.toLowerCase().includes(term)) score += 3;
      // Bonus for north star matches
      if (style.northStar?.toLowerCase().includes(term)) score += 2;
      score += 1;
    }
  }
  return score;
}

export function registerSearchStylesTool(server: McpServer): void {
  server.registerTool(
    "refero_search_styles",
    {
      title: "Search Refero Design Styles",
      description: `Search design styles from styles.refero.design by keyword, mood, brand, color, or typography.

Searches across brand names, north star descriptors, color names, and font families. Use this to quickly find styles matching a specific aesthetic, brand reference, or design attribute.

Args:
  - query (string): Search keyword or phrase. Examples: "dark minimal", "Stripe", "Inter font", "finance", "playful colorful"
  - color_scheme ('light' | 'dark' | 'any'): Filter by overall theme (default: 'any')
  - limit (number): Max results to return, 1-20 (default: 10)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns (markdown): Ranked list of matching styles with IDs and details.
Returns (json): {
  "query": string,
  "total_searched": number,
  "results": [
    {
      "id": string,
      "siteName": string,
      "northStar": string,
      "colorScheme": string,
      "fonts": string[],
      "colors": [{"name": string, "hex": string}],
      "stylePageUrl": string
    }
  ]
}

Examples:
  - "Find dark design systems" → query="dark", color_scheme="dark"
  - "Search for finance app designs" → query="finance banking"
  - "Find styles using Inter font" → query="Inter"
  - "Show me minimal clean designs" → query="minimal clean"

Note: Uses refero_match_style for deeper project-based matching with scoring.`,
      inputSchema: SearchStylesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: SearchStylesInput) => {
      try {
        const allStyles = await fetchAllStyleSummaries(3);
        const terms = params.query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

        let filtered = allStyles;
        if (params.color_scheme !== "any") {
          filtered = allStyles.filter(s =>
            s.colorScheme?.toLowerCase() === params.color_scheme
          );
        }

        const scored = filtered
          .map(s => ({ style: s, score: scoreStyle(s, params.query, terms) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, params.limit);

        if (scored.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No styles found matching "${params.query}"${params.color_scheme !== "any" ? ` with ${params.color_scheme} theme` : ""}. Try broader terms or use refero_list_styles to browse all styles.`
            }]
          };
        }

        const results = scored.map(({ style: s }) => ({
          id: s.id,
          siteName: s.siteName,
          url: s.url,
          northStar: s.northStar,
          colorScheme: s.colorScheme,
          fonts: s.fonts ?? [],
          colors: (s.colors ?? []).slice(0, 6),
          stylePageUrl: `${SITE_BASE_URL}/style/${s.id}`
        }));

        const output = {
          query: params.query,
          color_scheme_filter: params.color_scheme,
          total_searched: filtered.length,
          results
        };

        if (params.response_format === "json") {
          return {
            content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
            structuredContent: output
          };
        }

        const lines: string[] = [
          `# Search Results for "${params.query}"`,
          "",
          `Found **${scored.length}** matching styles (searched ${filtered.length} total)`,
          ""
        ];

        for (const r of results) {
          lines.push(`## ${r.siteName}`);
          lines.push(`- **ID**: \`${r.id}\``);
          lines.push(`- **North Star**: ${r.northStar}`);
          lines.push(`- **Theme**: ${r.colorScheme}`);
          if (r.fonts.length > 0) lines.push(`- **Fonts**: ${r.fonts.join(", ")}`);
          if (r.colors.length > 0) {
            lines.push(`- **Colors**: ${r.colors.map(c => `${c.name} (${c.hex})`).join(", ")}`);
          }
          lines.push(`- **View**: [${r.stylePageUrl}](${r.stylePageUrl})`);
          lines.push("");
        }

        return {
          content: [{ type: "text", text: lines.join("\n") }],
          structuredContent: output
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
