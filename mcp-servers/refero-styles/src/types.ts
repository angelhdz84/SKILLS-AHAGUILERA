export interface StyleColor {
  name: string;
  hex: string;
}

export interface StyleSummary {
  id: string;
  url: string;
  siteName: string;
  screenshotUrl: string;
  thumbnailUrl: string;
  iconUrl: string;
  colorScheme: "light" | "dark" | string;
  colors: StyleColor[];
  fonts: string[];
  northStar: string;
  createdAt: string;
}

export interface DesignSystemColor {
  name: string;
  hex: string;
  role?: string;
  group?: string;
}

export interface DesignSystemTypography {
  family: string;
  weights?: (string | number)[];
  fallback?: string;
}

export interface DesignSystemTypeScale {
  role: string;
  size?: string;
  weight?: string | number;
  lineHeight?: string;
  letterSpacing?: string;
}

export interface DesignSystemSpacing {
  radius?: string;
  elementGap?: string;
  sectionGap?: string;
  cardPadding?: string;
  pageMaxWidth?: string;
}

export interface DesignSystemComponent {
  name: string;
  html?: string;
  css?: string;
  description?: string;
}

export interface DesignSystemSurface {
  name: string;
  color?: string;
  description?: string;
}

export interface DesignSystemElevation {
  name?: string;
  shadow?: string;
}

export interface CustomSection {
  title: string;
  content: string;
}

export interface DesignSystem {
  description?: string;
  theme?: string;
  northStar?: string;
  dos?: string[];
  donts?: string[];
  colors?: DesignSystemColor[];
  typography?: DesignSystemTypography[];
  typeScale?: DesignSystemTypeScale[];
  layout?: string;
  imagery?: string;
  spacing?: DesignSystemSpacing;
  surfaces?: DesignSystemSurface[];
  elevation?: DesignSystemElevation[];
  components?: DesignSystemComponent[];
  similar?: string[];
  customSections?: CustomSection[];
}

export interface StyleDetail extends StyleSummary {
  fullResult?: {
    designSystem?: DesignSystem;
  };
  similar?: StyleSummary[];
}

export interface ListStylesResponse {
  styles: StyleSummary[];
  nextPage: number | null;
  nextCursor: string | null;
}

export interface MatchScore {
  style: StyleSummary;
  score: number;
  reasons: string[];
}
