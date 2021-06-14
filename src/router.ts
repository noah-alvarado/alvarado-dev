import createRouter from 'router5';
import browserPluginFactory from 'router5-plugin-browser';
import createSolidRouter from 'solid-typefu-router5';

const routes = [
    { name: 'home', path: '/' },
    // {
    //     name: 'noah',
    //     path: '/noah?page',
    //     children: [
    //         { name: 'profile', path: '/:id<\\d+>' },
    //         { name: 'edit', path: '/edit' },
    //     ],
    // },
    // {
    //     name: 'abram',
    //     path: '/abram?page',
    //     children: [
    //         { name: 'profile', path: '/:id<\\d+>' },
    //         { name: 'edit', path: '/edit' },
    //     ],
    // },
] as const;

const router = createSolidRouter({
    routes,
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    createRouter5: (routes) => {
        const router = createRouter(routes, { allowNotFound: true });
        router.usePlugin(browserPluginFactory({ useHash: false }));
        return router;
    },
});

export default router;
export const { Link, Router, Provider } = router;
