/**
 * Header tab item definition.
 */
export type HeaderTab = {
  key: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  to?: string;
  getParams?: (params: Record<string, string>) => Record<string, string>;
  activePathPrefixes?: string[];
  isActive?: (context: { pathname: string; params: Record<string, string> }) => boolean;
};

/**
 * Route data used to resolve dynamic header fields.
 */
export type HeaderResolveContext = {
  params: Record<string, string>;
  loaderData: unknown;
};

export type HeaderResolveResult = {
  title?: string;
  subtitle?: string;
  brandLabel?: string;
  meta?: string[];
  tabs?: HeaderTab[];
  rightActionLabel?: string;
};

/**
 * Static header configuration attached to route static data.
 */
export type HeaderStaticConfig = {
  title?: string;
  subtitle?: string;
  brandLabel?: string;
  showBack?: boolean;
  backBehavior?: 'route' | 'browser';
  backTo?: string;
  getBackParams?: (params: Record<string, string>) => Record<string, string>;
  showUtilities?: boolean;
  showSearchBar?: boolean;
  showProfileAvatar?: boolean;
  meta?: string[];
  tabs?: HeaderTab[];
  rightActionLabel?: string;
  rightActionTo?: string;
  getRightActionParams?: (params: Record<string, string>) => Record<string, string>;
  resolve?: (ctx: HeaderResolveContext) => HeaderResolveResult;
};

/**
 * Route static data extension for TanStack Router.
 */
export type RouteStaticData = {
  header?: HeaderStaticConfig;
};
