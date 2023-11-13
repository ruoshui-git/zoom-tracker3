import express from 'express';
import { handleError, sanitize } from '../helpers/routing.js';
import { contextHeader, getAppContext } from '../helpers/cipher.js';
import { getInstallURL } from '../helpers/zoom-api.js';
import session from '../session.js';

const router = express.Router();

/*
 * Home Page - Zoom App Launch handler
 * this route is used when a user navigates to the deep link
 */
function isContextExpired(context) {
  const currentTime = Date.now();
  return context.exp && context.exp < currentTime;
}

router.get('/', async (req, res, next) => {
  try {
    sanitize(req);

    const header = req.header(contextHeader);
    const context = header && getAppContext(header);

    if (!context) {
      // return res.render('index', {
      //     isZoom: false,
      //     title: `Hello Browser`,
      // });
      return res.sendFile('dist/index.html');
      // next();
    }

    // Check if the context is valid and not expired
    if (isContextExpired(context)) {
      return res.status(401).json({ error: 'Invalid or expired context' });
    }

    // return res.render('index', {
    //     isZoom: true,
    //     title: `Hello Zoom`,
    // });
    return res.sendFile('dist/index.html');

    // const indexPath = findClosestIndexToRoot(req.path, config.root);
    // if (indexPath === undefined) return next();

    // const template = fs.readFileSync(indexPath, "utf8");
    // const html = await server.transformIndexHtml(req.originalUrl, template);
    // res.send(getTransformedHTML(html, req));
    // next();
  } catch (e) {
    next(handleError(e));
  }
});

/*
 * Install Route - Install the Zoom App from the Zoom Marketplace
 * this route is used when a user installs the app from the Zoom Client
 */
router.get('/install', session, async (req, res) => {
  const { url, state, verifier } = getInstallURL();
  req.session.state = state;
  req.session.verifier = verifier;
  res.redirect(url.href);
});

export default router;
