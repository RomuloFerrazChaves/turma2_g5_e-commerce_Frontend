import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Development Content Security Policy (CSP) string.
// Allows the frontend dev server / DevTools to connect (XHR, WebSocket) from localhost:4200.
// Adjust or remove in production. If you prefer helmet, replace this with helmet.contentSecurityPolicy().
// const devCsp = [
//   "default-src 'self'",
//   "connect-src 'self' http://localhost:4200 ws://localhost:4200",
//   "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
//   "style-src 'self' 'unsafe-inline'",
//   "img-src 'self' data:",
//   "font-src 'self' data:",
// ].join('; ');
const devCsp = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;";

// Apply CSP header for requests served directly by Express (static files, errors, etc.).
// Note: Angular SSR's writeResponseToNodeResponse may overwrite response headers when used,
// so we also ensure the CSP is set on the server-side rendered Response below.
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', devCsp);
  next();
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (!response) return next();

      // Ensure our CSP is present on the web `Response`'s headers so
      // `writeResponseToNodeResponse` doesn't write the default "default-src 'none'" header.
      // The Response.headers object implements the Web Headers API.
      try {
        response.headers.set('Content-Security-Policy', devCsp);
      } catch (e) {
        // If for any reason headers cannot be modified, fall back to letting
        // the existing header through (we've already set it on the raw res earlier).
      }

      return writeResponseToNodeResponse(response, res);
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
