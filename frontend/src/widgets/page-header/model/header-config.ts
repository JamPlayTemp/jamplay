import type {
  HeaderResolveContext,
  HeaderStaticConfig,
  HeaderTab,
  RouteStaticData,
} from '@/widgets/page-header/model/types';

/**
 * Adds header static data to route definitions.
 */
export const withHeader = <T extends object>(
  options: T,
  header: HeaderStaticConfig,
): T & { staticData: RouteStaticData } => {
  return {
    ...options,
    staticData: { header },
  };
};

const performanceTabs: HeaderTab[] = [
  {
    key: 'calendar',
    label: '캘린더',
    to: '/band/$bandId/performance/$performanceId',
    getParams: (params: Record<string, string>) => ({
      bandId: params.bandId,
      performanceId: params.performanceId,
    }),
    isActive: ({ pathname, params }) =>
      pathname === `/band/${params.bandId}/performance/${params.performanceId}`,
  },
  {
    key: 'songs',
    label: '곡 라이브러리',
    to: '/band/$bandId/performance/$performanceId/songs',
    getParams: (params: Record<string, string>) => ({
      bandId: params.bandId,
      performanceId: params.performanceId,
    }),
    isActive: ({ pathname, params }) =>
      pathname ===
      `/band/${params.bandId}/performance/${params.performanceId}/songs`,
  },
];

const HEADER_DEFAULTS: Pick<
  HeaderStaticConfig,
  'showBack' | 'showUtilities' | 'showSearchBar' | 'showProfileAvatar'
> = {
  showBack: true,
  showUtilities: true,
  showSearchBar: false,
  showProfileAvatar: true,
};

const createHeaderConfig = (config: HeaderStaticConfig): HeaderStaticConfig => {
  return {
    ...HEADER_DEFAULTS,
    ...config,
  };
};

/**
 * Header presets used by application routes.
 */
export const HEADER_CONFIG = {
  home: createHeaderConfig({
    title: '서비스명',
    showBack: false,
    showSearchBar: true,
  }),
  profile: createHeaderConfig({
    title: '마이페이지',
    subtitle: '내 프로필 정보를 관리하세요',
    rightActionLabel: '수정',
    showProfileAvatar: false,
  }),
  songs: createHeaderConfig({
    title: '공연 상세',
    tabs: performanceTabs,
    rightActionLabel: '설정',
    rightActionTo: '/band/$bandId/settings',
    getRightActionParams: (params: Record<string, string>) => ({
      bandId: params.bandId,
    }),
    resolve: ({ loaderData }: HeaderResolveContext) => {
      const performance = loaderData as
        | {
            title?: string;
            subtitle?: string;
          }
        | undefined;

      return {
        title: performance?.title,
        subtitle: performance?.subtitle,
      };
    },
  }),
  songTeams: createHeaderConfig({
    title: '팀 목록',
  }),
  teamDetail: createHeaderConfig({
    title: '팀 상세',
  }),
  bandCreate: createHeaderConfig({
    title: '밴드 생성',
  }),
  bandDetail: createHeaderConfig({
    title: '밴드',
    brandLabel: '밴드',
    rightActionLabel: '밴드 설정',
    rightActionTo: '/band/$bandId/settings',
    getRightActionParams: (params: Record<string, string>) => ({
      bandId: params.bandId,
    }),
    resolve: ({ loaderData }: HeaderResolveContext) => {
      const band = loaderData as
        | {
            name?: string;
            memberCount?: number;
            performanceCount?: number;
          }
        | undefined;

      return {
        title: band?.name,
        meta:
          typeof band?.memberCount === 'number' &&
          typeof band?.performanceCount === 'number'
            ? [`멤버 ${band.memberCount}명`, `공연 ${band.performanceCount}회`]
            : undefined,
      };
    },
  }),
  bandSettings: createHeaderConfig({
    title: '밴드 설정',
  }),
  bandInvite: createHeaderConfig({
    title: '밴드 초대',
  }),
  bandPerformance: createHeaderConfig({
    title: '공연 상세',
    tabs: performanceTabs,
    rightActionLabel: '설정',
    rightActionTo: '/band/$bandId/settings',
    getRightActionParams: (params: Record<string, string>) => ({
      bandId: params.bandId,
    }),
    resolve: ({ loaderData }: HeaderResolveContext) => {
      const performance = loaderData as
        | {
            title?: string;
            subtitle?: string;
          }
        | undefined;

      return {
        title: performance?.title,
        subtitle: performance?.subtitle,
      };
    },
  }),
  performanceCreate: createHeaderConfig({
    title: '공연 생성',
  }),
  inviteAccept: createHeaderConfig({
    title: '초대 수락',
    showProfileAvatar: false,
  }),
  inviteRequest: createHeaderConfig({
    title: '초대 요청',
  }),
  admin: createHeaderConfig({
    title: '관리자',
  }),
} satisfies Record<string, HeaderStaticConfig>;
