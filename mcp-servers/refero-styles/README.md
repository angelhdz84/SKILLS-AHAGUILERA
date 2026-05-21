# refero-styles-mcp-server

An MCP server that searches [styles.refero.design](https://styles.refero.design) for design systems that match your project's idea, needs, and style — returning ready-to-use `design.md` documentation.

## Tools

| Tool | Description |
|------|-------------|
| `refero_list_styles` | Browse the curated catalog with pagination |
| `refero_search_styles` | Search by keyword, mood, brand, or color |
| `refero_get_design_md` | Fetch the full design.md for a specific style |
| `refero_match_style` | **Primary tool** — match styles to your project description |

## Quick Start

```bash
npm install
npm run build
node dist/index.js
```

## Usage with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "refero-styles": {
      "command": "node",
      "args": ["/path/to/refero-styles-mcp-server/dist/index.js"]
    }
  }
}
```

## Example Prompts

```
Find a design style for my dark SaaS dashboard targeting developers.
```

```
Match a design.md for a clean fintech mobile app, light theme.
```

```
Get the full design.md for Linear's design system.
```

## How It Works

1. **`refero_match_style`** fetches all styles from the Refero API (~60 styles across 3 pages)
2. Scores each style against your description using mood detection, keyword matching, and color scheme alignment
3. Returns the top N matches ranked by score with their reasons
4. Fetches and returns the full design.md for the top match — ready to paste into your AI coding prompt

## Project Structure

```
src/
├── index.ts              # Server entry point
├── constants.ts          # API URLs and limits
├── types.ts              # TypeScript interfaces
├── services/
│   └── referoApi.ts      # API client for styles.refero.design
├── tools/
│   ├── listStyles.ts     # refero_list_styles
│   ├── searchStyles.ts   # refero_search_styles
│   ├── getDesignMd.ts    # refero_get_design_md
│   └── matchStyle.ts     # refero_match_style
└── utils/
    ├── designMd.ts       # Generates design.md from JSON data
    └── errors.ts         # API error handling
```
