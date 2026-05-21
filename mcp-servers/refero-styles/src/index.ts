#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerListStylesTool } from "./tools/listStyles.js";
import { registerSearchStylesTool } from "./tools/searchStyles.js";
import { registerGetDesignMdTool } from "./tools/getDesignMd.js";
import { registerMatchStyleTool } from "./tools/matchStyle.js";

const server = new McpServer({
  name: "refero-styles-mcp-server",
  version: "1.0.0"
});

registerListStylesTool(server);
registerSearchStylesTool(server);
registerGetDesignMdTool(server);
registerMatchStyleTool(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Refero Styles MCP server running via stdio");
}

main().catch(error => {
  console.error("Server startup error:", error);
  process.exit(1);
});
