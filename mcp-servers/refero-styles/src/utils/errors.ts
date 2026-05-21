import axios from "axios";

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return "Error: Style not found. Please check that the ID is correct.";
        case 403:
          return "Error: Permission denied accessing this style.";
        case 429:
          return "Error: Rate limit exceeded. Please wait before making more requests.";
        default:
          return `Error: API request failed with status ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "Error: Request timed out. Please try again.";
    } else if (error.code === "ENOTFOUND") {
      return "Error: Cannot reach styles.refero.design. Check your internet connection.";
    }
  }
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
