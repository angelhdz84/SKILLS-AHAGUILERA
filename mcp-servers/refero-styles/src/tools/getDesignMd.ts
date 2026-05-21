import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getStyleById } from "../services/referoApi.js";
import { handleApiError } from "../utils/errors.js";
import { generateDesignMd } from "../utils/designMd.js";
import { CHARACTER_LIMIT, SITE_BASE_URL } from "../constants.js";

const GetDesignMdInputSchema = z.object({
  style_id: z.string()
    .min(1)
    .describe("The style ID from refero_list_styles, refero_search_styles, or refero_match_style (e.g. '90ce5883-bb24-4466-93f7-801cd617b0d1')"),
  sections: z.array(
    z.enum(["overview", "colors", "typography", "type_scale", "spacing", "surfaces", "imagery", "principles", "components", "similar", "custom"])
  ).optional()
    .describe("Optional: limit output to specific sections. Omit to get the full design.md. Options: 'overview', 'colors', 'typography', 'type_scale', 'spacing', 'surfaces', 'imagery', 'principles', 'components', 'similar', 'custom'"),
  include_components: z.boolean()
    .default(true)
    .describe("Whether to include component HTML/CSS examples (can be large). Default: true"),
  response_format: z.enum(["markdown", "json"])
    .default("markdown")
    .describe("Output format: 'markdown' returns the design.md content, 'json' returns the raw design system data")
}).strict();

type GetDesignMdInput = z.infer<typeof GetDesignMdInputSchema>;

export function registerGetDesignMdTool(server: McpServer): void {
  server.registerTool(
    "refero_get_design_md",
    {
      title: "Get Design.md for a Style",
      description: `Fetch the full design.md specification for a specific style from styles.refero.design.

Returns a complete, AI-agent-ready design system document including:
- North Star design philosophy
- Full color palette with hex values and semantic roles
- Typography specifications (font families, weights)
- Type scale (size hierarchy for headings, body, captions)
- Layout guidelines and spacing tokens
- Surface/elevation system
- Imagery guidelines
- Design principles (dos & don'ts)
- Component HTML/CSS examples
- Similar design systems

Use the style_id from refero_list_styles, refero_search_styles, or refero_match_style.

Args:
  - style_id (string): UUID of the style (e.g. '90ce5883-bb24-4466-93f7-801cd617b0d1')
  - sections (string[]): Optional array to return only specific sections. Omit for full document.
    Valid values: 'overview', 'colors', 'typography', 'type_scale', 'spacing', 'surfaces', 'imagery', 'principles', 'components', 'similar', 'custom'
  - include_components (boolean): Include component HTML/CSS code examples (default: true)
  - response_format ('markdown' | 'json'): 'markdown' for full design.md, 'json' for raw design data (default: 'markdown')

Returns (markdown): Complete design.md document ready to use as an AI prompt or design reference.
Returns (json): Raw JSON design system data including all design tokens, components, and metadata.

Examples:
  - Get full design.md for Linear: style_id="90ce5883-bb24-4466-93f7-801cd617b0d1"
  - Get only colors and typography: style_id="...", sections=["colors", "typography"]
  - Get raw data for programmatic use: response_format="json"

Error: Returns "Error: Style not found" if the style_id is invalid.`,
      inputSchema: GetDesignMdInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (params: GetDesignMdInput) => {
      try {
        const style = await getStyleById(params.style_id);

        if (params.response_format === "json") {
          const output = {
            id: style.id,
            siteName: style.siteName,
            url: style.url,
            northStar: style.northStar,
            colorScheme: style.colorScheme,
            stylePageUrl: `${SITE_BASE_URL}/style/${style.id}`,
            designSystem: style.fullResult?.designSystem ?? null,
            similar: style.similar?.map(s => ({ id: s.id, siteName: s.siteName, northStar: s.northStar })) ?? []
          };
          return {
            content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
            structuredContent: output
          };
        }

        // Filter components if requested
        if (!params.include_components && style.fullResult?.designSystem?.components) {
          style.fullResult.designSystem.components = [];
        }

        let markdown = generateDesignMd(style);

        // Truncate if needed
        if (markdown.length > CHARACTER_LIMIT) {
          markdown = markdown.slice(0, CHARACTER_LIMIT);
          markdown += `\n\n---\n*[Response truncated at ${CHARACTER_LIMIT} characters. Use sections parameter to retrieve specific parts.]*`;
        }

        return {
          content: [{ type: "text", text: markdown }]
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
