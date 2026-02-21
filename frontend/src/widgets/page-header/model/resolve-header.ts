import type { HeaderResolveContext, HeaderStaticConfig, RouteStaticData } from './types';

/**
 * Resolves static route header config merged with dynamic resolve result.
 */
export const resolveHeader = (
  staticData: RouteStaticData | undefined,
  context: HeaderResolveContext,
): HeaderStaticConfig | null => {
  const header = staticData?.header;
  if (!header) return null;

  const resolved = header.resolve?.(context);
  return {
    ...header,
    ...resolved,
  };
};
