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

const devCsp = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;";

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', devCsp);
  next();
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (!response) return next();

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

if (isMainModule(import.meta.url)) {
  const port = 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
