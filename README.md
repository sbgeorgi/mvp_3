# Adrian's Gym — MVP 3

Keep `src/`, `public/`, `index.html`, the package files and build configuration in the repository. `node_modules/` and `dist/` are generated locally and excluded from Git.

## GitHub Pages preview

In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Commit and push the prepared changes to `main`; `.github/workflows/pages.yml` installs the locked dependencies, builds the site and publishes only `dist/`.

The published files are `index.html`, `images/` and `videos/`. The compiled HTML includes the application JavaScript and CSS. Relative asset paths support the `/mvp_3/` project URL. The source entry `index.html` requires Vite and should not be published directly.

For a manual static upload, run `npm run build` and upload the **contents** of `dist/` to the hosting root.

Workflow setup follows [GitHub's Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Local editing

```sh
npm ci
npm run dev
```

`npm run build` regenerates `dist/`. The optional `build-standalone.mjs`, `standalone-client.js` and `standalone.css` maintain the parent workspace's `index1.html` companion; Pages does not publish them. `scripts/` contains image preparation tools.

Generated folders previously tracked by Git are removed from the next commit's tree while remaining on disk. Their older versions remain in Git history.
