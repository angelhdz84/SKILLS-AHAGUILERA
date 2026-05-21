import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { listStyles } from "../services/referoApi.js";
import { handleApiError } from "../utils/errors.js";
import { SITE_BASE_URL } from "../constants.js";

const ListStylesInputSchema = z.object({
  page: z.number()
    .int()
    .min(1)
    .max(50)
    .default(1)
    .describe("Page number for pagination (starts at 1, ~20 styles per page)"),
  response_format: z.enum(["markdown", "json"])
    .default("markdown")
    .describe("Output format: 'markdown' for human-readable or 'json' for structured data")
}).strict();

type ListStylesInput = z.infer<typeof ListStylesInputSchema>;

export function registerListStylesTool(server: McpServer): void {
  server.registerTool(
    "refero_list_styles",
    {
      title: "List Refero Design Styles",
      description: `List available design styles from styles.refero.design with pagination.

Returns a catalog of curated design systems extracted from real products. Each entry includes:
- Style ID (used with other tools like refero_get_design_md and refero_match_style)
- Brand name and URL
- North Star (design philosophy/mood descriptor, e.g. "Midnight Command Center")
- Color scheme (light or dark)
- Primary color palette
- Typography / font families

Args:
  - page (number): Page number, starting at 1. Each page contains ~20 styles. (default: 1)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns (markdown): Formatted list with style details and refero.design links.
Returns (json): {
  "page": number,
  "has_more": boolean,
  "next_page": number | null,
  "styles": [
    {
      "id": string,         // Style ID for use with other tools
      "siteName": string,
      "url": string,
      "northStar": string,
      "colorScheme": string,
      "colors": [{ "name": string, "hex": string }],
      "fonts": string[],
      "thumbnailUrl": string,
      "stylePageUrl": string
    }
  ]
}

Examples:
  - "Show me what design styles are available" → page=1
  - "Get the next page of styles" → page=2
  - Use response_format="json" when you need to process IDs programmatically`,
      inputSchema: ListStylesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: ListStylesInput) => {
      try {
        const data = await listStyles(params.page);
        const styles = data.styles ?? [];

        if (styles.length === 0) {
          return {
            content: [{ type: "text", text: `No styles found on page ${params.page}.` }]
          };
        }

        const mappedStyles = styles.map(s => ({
          id: s.id,
          siteName: s.siteName,
          url: s.url,
          northStar: s.northStar,
          colorScheme: s.colorScheme,
          colors: s.colors ?? [],
          fonts: s.fonts ?? [],
          thumbnailUrl: s.thumbnailUrl,
          stylePageUrl: `${SITE_BASE_URL}/style/${s.id}`
        }));

        const output = {
          page: params.page,
          has_more: !!data.nextPage,
          next_page: data.nextPage ?? null,
          count: styles.length,
          styles: mappedStyles
        };

        if (params.response_format === "json") {
          return {
            content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
            structuredContent: output
          };
        }

        const lines: string[] = [
          `# Refero Design Styles — Page ${params.page}`,
          "",
          `Found **${styles.length}** styles${output.has_more ? ` (more on page ${output.next_page})` : ""}`,
          ""
        ];

        for (const s of mappedStyles) {
          lines.push(`## ${s.siteName}`);
          lines.push(`- **ID**: \`${s.id}\``);
          lines.push(`- **URL**: ${s.url}`);
          lines.push(`- **North Star**: ${s.northStar}`);
          lines.push(`- **Theme**: ${s.colorScheme}`);
          if (s.fonts.length > 0) {
            lines.push(`- **Fonts**: ${s.fonts.join(", ")}`);
          }
          if (s.colors.length > 0) {
            const palette = s.colors.slice(0, 5).map(c => `${c.name} (${c.hex})`).join(", ");
            lines.push(`- **Colors**: ${palette}`);
          }
          lines.push(`- **View**: [${s.stylePageUrl}](${s.stylePageUrl})`);
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
