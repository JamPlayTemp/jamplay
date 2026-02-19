import { RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Providers } from './providers';
import { createAppRouter } from './router';

const router = createAppRouter();
const shouldShowRouterDevtools = import.meta.env.MODE === 'development';

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      {shouldShowRouterDevtools ? (
        <TanStackRouterDevtools router={router} />
      ) : null}
    </Providers>
  );
}

export default App;
