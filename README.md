# alvarado-dev

A modern React + Vite web application with Firebase Hosting and CI/CD deployment scripts.

## Features

- ⚡️ Fast development with [Vite](https://vitejs.dev/)
- ⚛️ React for UI development
- 🎨 Tailwind CSS for styling
- 🧹 Linting with ESLint
- 🔥 Firebase Hosting for production and preview deployments
- 🛠️ Automated deployment script (`deploy.sh`) for QA and Production
- 📦 Optimized images for performance

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22)
- [Yarn](https://yarnpkg.com/)

### Installation

```sh
yarn install
```

### Development

Start the dev server:

```bash
yarn dev
```

Local development is served over HTTPS at `https://localhost:2727` and `https://localhost.alvarado.dev:2727`.

`localhost.alvarado.dev` resolves to `127.0.0.1` via public DNS, so no local `/etc/hosts` setup is required.

Locally-trusted HTTPS certificates are generated automatically via
[vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert); the first
run may prompt for your password to install the local CA.

### Linting & Code Quality

```bash
yarn lint
# or to auto-fix
yarn lint:fix
```

### Building for Production

```bash
yarn build
```

### Deployment

#### **QA/Preview:**

```bash
yarn deploy:qa
```

Deploys to a Firebase preview channel and prints the preview URL.

#### **Production:**

```bash
yarn deploy:prod
```

Prompts for confirmation before deploying to production.

### Image Optimization

Optimized images are stored in `public/optimized/`. This process is automatic as a part of the build process. See [`optimize-images.mjs`](./optimize-images.mjs) for details.

## Project Structure

```
/ (root)
├── deploy.sh                # Deployment script
├── optimize-images.mjs      # Image optimization script
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── assets/              # Image assets
│   └── styles/              # CSS/JS styles
├── package.json             # Project metadata and scripts
├── tailwind.config.js       # Tailwind CSS config
├── vite.config.js           # Vite config
└── README.md                # This file
```

## License

This software and its source code are proprietary and confidential. No part of this codebase may be copied, reproduced, distributed, or transmitted in any form or by any means, electronic or mechanical, including photocopying, recording, or any information storage and retrieval system, without the express written permission of the copyright holder.

Unauthorized use, reproduction, or distribution of this code, or any portion of it, is strictly prohibited.
