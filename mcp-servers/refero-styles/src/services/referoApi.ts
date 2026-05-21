import axios from "axios";
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "../constants.js";
import type { StyleDetail, StyleSummary, ListStylesResponse } from "../types.js";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    "Accept": "application/json",
    "User-Agent": "refero-styles-mcp-server/1.0.0"
  }
});

export async function listStyles(page: number = 1): Promise<ListStylesResponse> {
  const response = await client.get<ListStylesResponse>("/styles", {
    params: { page }
  });
  return response.data;
}

export async function getStyleById(id: string): Promise<StyleDetail> {
  const response = await client.get<{ style: StyleDetail; similar?: StyleSummary[] }>(`/styles/${id}`);
  const data = response.data;
  if (data.style) {
    return { ...data.style, similar: data.similar };
  }
  // Fallback: the response itself might be the style
  return data as unknown as StyleDetail;
}

export async function fetchAllStyleSummaries(maxPages: number = 3): Promise<StyleSummary[]> {
  const all: StyleSummary[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const result = await listStyles(page);
    if (result.styles) {
      all.push(...result.styles);
    }
    if (!result.nextPage || result.styles.length === 0) {
      break;
    }
  }
  return all;
}
