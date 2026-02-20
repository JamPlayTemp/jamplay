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
import { BandCreatePage } from '@/pages/band-create';
import { BandDetailPage } from '@/pages/band-detail';
import { BandInvitePage } from '@/pages/band-invite';
import { BandPerformancePage } from '@/pages/band-performance';
import { BandSettingsPage } from '@/pages/band-settings';
import { InviteAcceptPage } from '@/pages/invite-accept';
import { InviteRequestPage } from '@/pages/invite-request';
import { MyBandsPage } from '@/pages/my-bands';
import { PerformanceCreatePage } from '@/pages/performance-create';
import { ProfilePage } from '@/pages/profile';
import { SongTeamsPage } from '@/pages/song-teams';
import { SongsPage } from '@/pages/songs';
import { AdminPage } from '@/pages/admin';
import { TeamDetailPage } from '@/pages/team-detail';

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
  getParentRoute: () => rootRoute,
  path: '/',
  component: MyBandsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  beforeLoad: requireLogin,
  component: ProfilePage,
});

const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/songs',
  component: SongsPage,
});

const songTeamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/song/$songId/teams',
  component: SongTeamsPage,
});

const teamDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/team/$teamId',
  component: TeamDetailPage,
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
  getParentRoute: () => bandRoute,
  path: '/',
  component: BandDetailPage,
});

const bandSettingsRoute = createRoute({
  getParentRoute: () => bandRoute,
  path: 'settings',
  component: BandSettingsPage,
});

const bandInviteRoute = createRoute({
  getParentRoute: () => bandRoute,
  path: 'invite',
  component: BandInvitePage,
});

const bandPerformanceRoute = createRoute({
  getParentRoute: () => bandRoute,
  path: 'performance/$performanceId',
  component: BandPerformancePage,
});

const bandCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/band/create',
  component: BandCreatePage,
});

/* ------------------------------------------------------------------ */
/*  Performance / Invite                                               */
/* ------------------------------------------------------------------ */

const performanceCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/performance/create',
  component: PerformanceCreatePage,
});

const inviteAcceptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invite/accept',
  component: InviteAcceptPage,
});

const inviteRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invite/request',
  component: InviteRequestPage,
});

/* ------------------------------------------------------------------ */
/*  Admin                                                             */
/* ------------------------------------------------------------------ */

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: requireAdmin,
  component: AdminPage,
});

/* ------------------------------------------------------------------ */
/*  Route Tree                                                         */
/* ------------------------------------------------------------------ */

export const routeTree = rootRoute.addChildren([
  myBandsRoute,
  profileRoute,
  songsRoute,
  songTeamsRoute,
  teamDetailRoute,

  bandRoute.addChildren([
    bandDetailRoute,
    bandSettingsRoute,
    bandInviteRoute,
    bandPerformanceRoute,
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
