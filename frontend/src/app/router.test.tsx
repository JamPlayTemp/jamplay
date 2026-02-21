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
});
