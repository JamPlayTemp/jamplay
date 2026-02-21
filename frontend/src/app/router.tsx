import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';

import type { UserAccess } from '@/app/providers/auth-context';
import { RootError } from '@/app/error/RootError';
import { RootLayout } from '@/app/layouts/RootLayout';
import { RootLoading } from '@/app/loading/RootLoading';
import { HEADER_CONFIG, withHeader } from '@/widgets/page-header';
import { AdminPage } from '@/pages/admin/AdminPage';
import { BandCreatePage } from '@/pages/band/BandCreatePage';
import { BandDetailPage } from '@/pages/band/BandDetailPage';
import { BandInvitePage } from '@/pages/band/BandInvitePage';
import { BandPerformancePage } from '@/pages/band/BandPerformancePage';
import { BandSettingsPage } from '@/pages/band/BandSettingsPage';
import { MyBandsPage } from '@/pages/band/MyBandsPage';
import { InviteAcceptPage } from '@/pages/invite/InviteAcceptPage';
import { InviteRequestPage } from '@/pages/invite/InviteRequestPage';
import { PerformanceCreatePage } from '@/pages/performance/PerformanceCreatePage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SongTeamsPage } from '@/pages/song/SongTeamsPage';
import { SongsPage } from '@/pages/song/SongsPage';
import { TeamDetailPage } from '@/pages/team/TeamDetailPage';

export type RouterContext = {
  user: UserAccess;
};

type UserGuardPredicate = (user: UserAccess) => boolean;

const syncAuthenticatedUser = async (user: UserAccess): Promise<UserAccess> => {
  return user;
};

const createUserGuard = (predicate: UserGuardPredicate) => {
  return ({ context }: { context: RouterContext }) => {
    if (!predicate(context.user)) throw redirect({ to: '/' });
  };
};

const requireLogin = createUserGuard((user) => user.isLoggedIn);
const requireAdmin = createUserGuard((user) => user.isAdmin);
//TODO: 밴드 접근 권한 체크 로직 추가 필요
const allowBandAccess = createUserGuard(() => true);

/* ------------------------------------------------------------------ */
/*  Root Route
/*  전역 로딩, 에러 상태 관리                                             */
/* ------------------------------------------------------------------ */

const rootRoute = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    context.user = await syncAuthenticatedUser(context.user);
  },
  component: RootLayout,
  pendingComponent: RootLoading,
  errorComponent: RootError,
});

/* ------------------------------------------------------------------ */
/*  App Routes (Top Level)                                             */
/* ------------------------------------------------------------------ */

const myBandsRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/',
      component: MyBandsPage,
    },
    HEADER_CONFIG.home,
  ),
});

const profileRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/profile',
      beforeLoad: requireLogin,
      component: ProfilePage,
    },
    HEADER_CONFIG.profile,
  ),
});

const songTeamsRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/song/$songId/teams',
      component: SongTeamsPage,
    },
    HEADER_CONFIG.songTeams,
  ),
});

const teamDetailRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/song/$songId/team/$teamId',
      component: TeamDetailPage,
    },
    HEADER_CONFIG.teamDetail,
  ),
});

/* ------------------------------------------------------------------ */
/*  Band Routes (Grouped)                                              */
/* ------------------------------------------------------------------ */

const bandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/band/$bandId',
  beforeLoad: allowBandAccess,
});

const bandDetailRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => bandRoute,
      path: '/',
      component: BandDetailPage,
    },
    HEADER_CONFIG.bandDetail,
  ),
});

const bandSettingsRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => bandRoute,
      path: 'settings',
      component: BandSettingsPage,
    },
    HEADER_CONFIG.bandSettings,
  ),
});

const bandInviteRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => bandRoute,
      path: 'invite',
      component: BandInvitePage,
    },
    HEADER_CONFIG.bandInvite,
  ),
});

const bandPerformanceRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => bandRoute,
      path: 'performance/$performanceId',
      component: BandPerformancePage,
    },
    HEADER_CONFIG.bandPerformance,
  ),
});

const bandPerformanceSongsRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => bandRoute,
      path: 'performance/$performanceId/songs',
      component: SongsPage,
    },
    HEADER_CONFIG.songs,
  ),
});

const bandCreateRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/band/create',
      component: BandCreatePage,
    },
    HEADER_CONFIG.bandCreate,
  ),
});

/* ------------------------------------------------------------------ */
/*  Performance / Invite                                               */
/* ------------------------------------------------------------------ */

const performanceCreateRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/performance/create',
      component: PerformanceCreatePage,
    },
    HEADER_CONFIG.performanceCreate,
  ),
});

const inviteAcceptRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/invite/accept',
      component: InviteAcceptPage,
    },
    HEADER_CONFIG.inviteAccept,
  ),
});

const inviteRequestRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/invite/request',
      component: InviteRequestPage,
    },
    HEADER_CONFIG.inviteRequest,
  ),
});

/* ------------------------------------------------------------------ */
/*  Admin                                                             */
/* ------------------------------------------------------------------ */

const adminRoute = createRoute({
  ...withHeader(
    {
      getParentRoute: () => rootRoute,
      path: '/admin',
      beforeLoad: requireAdmin,
      component: AdminPage,
    },
    HEADER_CONFIG.admin,
  ),
});

/* ------------------------------------------------------------------ */
/*  Route Tree                                                         */
/* ------------------------------------------------------------------ */

export const routeTree = rootRoute.addChildren([
  myBandsRoute,
  profileRoute,
  songTeamsRoute,
  teamDetailRoute,

  bandRoute.addChildren([
    bandDetailRoute,
    bandSettingsRoute,
    bandInviteRoute,
    bandPerformanceRoute,
    bandPerformanceSongsRoute,
  ]),

  bandCreateRoute,
  performanceCreateRoute,
  inviteAcceptRoute,
  inviteRequestRoute,
  adminRoute,
]);

/* ------------------------------------------------------------------ */
/*  Router Instance                                                    */
/* ------------------------------------------------------------------ */

export const createAppRouter = () => {
  return createRouter({
    routeTree,
    context: {} as RouterContext,
    defaultPendingMinMs: 150,
  });
};

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
