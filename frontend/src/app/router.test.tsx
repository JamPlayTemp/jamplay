import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { UserAccess } from '@/app/providers/auth-context';
import { createAppRouter } from '@/app/router';

const createRouterForTest = (initialPath: string, user: UserAccess) => {
  const router = createAppRouter();
  router.update({
    history: createMemoryHistory({
      initialEntries: [initialPath],
    }),
    context: { user },
  });

  return router;
};

describe('앱 라우터', () => {
  it('루트 경로에서 MyBands 페이지를 렌더링한다', async () => {
    const router = createRouterForTest('/', {
      isLoggedIn: true,
      isAdmin: false,
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('MyBandsPage')).toBeInTheDocument();
  });

  it('로그아웃 사용자가 프로필 경로로 접근하면 루트로 리다이렉트된다', async () => {
    const router = createRouterForTest('/profile', {
      isLoggedIn: false,
      isAdmin: false,
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('MyBandsPage')).toBeInTheDocument();
  });

  it('로그인 사용자가 프로필 경로로 접근하면 프로필 페이지를 렌더링한다', async () => {
    const router = createRouterForTest('/profile', {
      isLoggedIn: true,
      isAdmin: false,
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('ProfilePage')).toBeInTheDocument();
  });

  it('일반 사용자가 관리자 경로로 접근하면 루트로 리다이렉트된다', async () => {
    const router = createRouterForTest('/admin', {
      isLoggedIn: true,
      isAdmin: false,
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('MyBandsPage')).toBeInTheDocument();
  });

  it('관리자 사용자가 관리자 경로로 접근하면 관리자 페이지를 렌더링한다', async () => {
    const router = createRouterForTest('/admin', {
      isLoggedIn: true,
      isAdmin: true,
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('AdminPage')).toBeInTheDocument();
  });

  it('performance 하위 songs 경로에서는 곡 라이브러리 탭이 active 상태다', async () => {
    const router = createRouterForTest('/band/1/performance/1/songs', {
      isLoggedIn: true,
      isAdmin: false,
    });

    render(<RouterProvider router={router} />);

    await screen.findByText('SongsPage');

    expect(screen.getByRole('button', { name: '곡 라이브러리' })).toHaveAttribute(
      'data-variant',
      'default',
    );
    expect(screen.getByRole('button', { name: '캘린더' })).toHaveAttribute(
      'data-variant',
      'outline',
    );
  });

  it('공연 상세 경로에서는 캘린더 탭이 active 상태다', async () => {
    const router = createRouterForTest('/band/1/performance/1', {
      isLoggedIn: true,
      isAdmin: false,
    });

    render(<RouterProvider router={router} />);

    await screen.findByText('BandPerformancePage');

    expect(screen.getByRole('button', { name: '캘린더' })).toHaveAttribute(
      'data-variant',
      'default',
    );
    expect(screen.getByRole('button', { name: '곡 라이브러리' })).toHaveAttribute(
      'data-variant',
      'outline',
    );
  });

  it('루트에서 검색바가 노출된다', async () => {
    const rootRouter = createRouterForTest('/', {
      isLoggedIn: true,
      isAdmin: false,
    });

    const { unmount } = render(<RouterProvider router={rootRouter} />);
    expect(await screen.findByText('MyBandsPage')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('밴드/사용자를 찾아보세요')).toBeInTheDocument();
    unmount();

    const songsRouter = createRouterForTest('/band/1/performance/1/songs', {
      isLoggedIn: true,
      isAdmin: false,
    });

    render(<RouterProvider router={songsRouter} />);
    expect(await screen.findByText('SongsPage')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('밴드/사용자를 찾아보세요')).not.toBeInTheDocument();
  });

  it('프로필/초대수락 페이지에서는 우측 프로필 아바타를 렌더링하지 않는다', async () => {
    const profileRouter = createRouterForTest('/profile', {
      isLoggedIn: true,
      isAdmin: false,
    });
    const { unmount } = render(<RouterProvider router={profileRouter} />);

    expect(await screen.findByText('ProfilePage')).toBeInTheDocument();
    expect(screen.queryByLabelText('프로필 열기')).not.toBeInTheDocument();
    unmount();

    const inviteAcceptRouter = createRouterForTest('/invite/accept', {
      isLoggedIn: true,
      isAdmin: false,
    });
    render(<RouterProvider router={inviteAcceptRouter} />);

    expect(await screen.findByText('InviteAcceptPage')).toBeInTheDocument();
    expect(screen.queryByLabelText('프로필 열기')).not.toBeInTheDocument();
  });
});
