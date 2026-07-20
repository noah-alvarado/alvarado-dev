import handleAuthoringRequest from './handlers.mjs';

// Dev-only Vite plugin that mounts the local authoring write API.
//
// It hooks `configureServer` and sets `apply: 'serve'`, so it runs ONLY during
// `vite` dev — never in `vite build` or `vite preview`. The production bundle
// deployed to Firebase therefore has no write endpoint at all.
export default function vlnAuthoringPlugin() {
    return {
        name: 'vln-authoring',
        apply: 'serve',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                handleAuthoringRequest(req, res, next).catch(next);
            });
        },
    };
}
