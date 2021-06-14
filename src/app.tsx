import { constants } from 'router5';
import type { Component } from 'solid-js';
import { Page404 } from './pages/404';
import { Home } from './pages/home';
import { Provider, Router } from './router';

export const App: Component = () => {
    return (
        <Provider>
            {/* <Header /> */}
            <Router>
                {{
                    home: { render: Home },
                    notFound: { render: Page404 },
                }}
            </Router>
        </Provider>
    );
};
