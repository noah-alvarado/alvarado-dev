// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  env: {
    // API_URL: 'api.google.com',
  },
  mount: {
    public: '/',
    src: '/src',
  },
  plugins: [
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-babel',
    '@snowpack/plugin-postcss',
  ],
  packageOptions: {
    installTypes: true,
    NODE_ENV: true,
  },
  devOptions: {
    out: 'dist',
    open: 'none',
    bundle: true,
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    clean: true,
    out: 'dist',
  },
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2020',
    treeshake: true,
    splitting: true,
  },
  routes: [
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
    },
  ],
};
