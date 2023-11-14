# Zoom Tracker 3

TODO:

Client:
1. Actual routing


Meeting:
1. collpase section when not using

Common:
1. filter & sort data


This Zoom App Sample uses Node.js + Express to build a simple Hello World Zoom App.

## Prerequisites

1. [Node JS](https://nodejs.org/en/)
2. [Ngrok](https://ngrok.com/docs/getting-started)
3. [Zoom Account](https://support.zoom.us/hc/en-us/articles/207278726-Plan-Types-)
4. [Zoom App Credentials](#config:-app-credentials) (Instructions below)
    1. Client ID
    2. Client Secret
    3. Redirect URI

## Getting started

Open your terminal:

```bash
# Clone down this repository
git clone git@github.com:zoom/zoomapps-sample-js.git

# navigate into the cloned project directory
cd zoomapps-sample-js

# run NPM to install the app dependencies
npm install

# initialize your ngrok session
ngrok http 3000
```

### Create your Zoom App

In your web browser, navigate to [Zoom Developer Portal](https://developers.zoom.us/) and register/log into your
developer account.

Click the "Build App" button at the top and choose to "Zoom Apps" application.

1. Name your app
2. Choose whether to list your app on the marketplace or not
3. Click "Create"

For more information, you can follow [this guide](https://dev.to/zoom/introducing-zoom-apps-33he)
check out [this video series](https://www.youtube.com/playlist?list=PLKpRxBfeD1kGN-0QgQ6XtSwtxI3GQM16R) on how to create and configure these sample Zoom Apps.

### Config: App Credentials

In your terminal where you launched `ngrok`, find the `Forwarding` value and copy/paste that into the "Home URL" and "
Redirect URL for OAuth" fields.

```
Home URL:               https://xxxxx.ngrok.io
Redirect URL for OAuth: https://xxxxx.ngrok.io/auth
```

> NOTE: ngrok URLs under ngrok's Free plan are ephemeral, meaning they will only live for up to a couple hours at most, and will change every time you reinitialize the application. This will require you to update these fields every time you restart your ngrok service.

#### OAuth allow list

- `https://example.ngrok.io`

#### Domain allow list

- `appssdk.zoom.us`
- `ngrok.io`

### Config: Information

The following information is required to activate your application:

- Basic Information
    - App name
    - Short description
    - Long description (entering a short message here is fine for now)
- Developer Contact Information
    - Name
    - Email address

> NOTE: if you intend to publish your application on the Zoom Apps Marketplace, more information will be required in this section before submitting.

### Config: App Features

Under the Zoom App SDK section, click the `+ Add APIs` button and enable the following options from their respective
sections:

#### APIs

- shareApp

### Scopes

Ensure that the following scope is selected on the Scopes tab:
- `zoomapp:inmeeting`

### Config `.env`

When building for Development, open the `.env` file in your text editor and enter the following information from the App Credentials section you just
configured:

```ini
# Client ID for your Zoom App
ZM_CLIENT_ID=[app_client_id]

# Client Secret for your Zoom app
ZM_CLIENT_SECRET=[app_client_secret]

# Redirect URI set for your app in the Zoom Marketplace
ZM_REDIRECT_URL=https://[xxxx-xx-xx-xxx-x].ngrok.io/auth
```

#### Zoom for Government

If you are a [Zoom for Government (ZfG)](https://www.zoomgov.com/) customer you can use the `ZM_HOST` variable to change
the base URL used for Zoom. This will allow you to adjust to the different Marketplace and API Base URLs used by ZfG
customers.

**Marketplace URL:** marketplace.*zoomgov.com*

**API Base URL:** api.*zoomgov.com*

## Start the App

### Development

Run the `dev` npm script to start in development mode using a Docker container.

```shell
npm run dev
```

The `dev` script will:

1. Watch JS files and built to the dist/ folder
1. Watch Server files and build to the dist/ folder
1. Start the application

### Production

When running your application in production no logs are sent to the console by default and the server is not restarted
on file changes.

We use the `NODE_ENV` environment variable here to tell the application to start in prodcution mode.

```shell
# Mac/Linux
NODE_ENV=production npm start

# Windows
set NODE_ENV=production && npm start
````

## Usage

To install the Zoom App, Navigate to the **Home URL** that you set in your browser and click the link to install.

After you authorize the app, Zoom will automatically open the app within the client.

### Keeping secrets secret

This application makes use of your Zoom App Client ID and Client Secret as well as a custom secret for signing session
cookies. During development, the application will read from the .env file. ;

In order to align with security best practices, this application does not read from the .env file in production mode.

This means you'll want to set environment variables on the hosting platform that you'
re using instead of within the .env file. This might include using a secret manager or a CI/CD pipeline.

> :warning: **Never commit your .env file to version control:** The file likely contains Zoom App Credentials and Session Secrets

### Code Style

This project uses [prettier](https://prettier.io/) and [eslint](https://eslint.org/) to enforce style and protect
against coding errors along with a pre-commit git hook(s) via [husky](https://typicode.github.io/husky/#/) to ensure
files pass checks prior to commit.

### Testing

At this time there are no e2e or unit tests.

## Need help?

If you're looking for help, try [Developer Support](https://devsupport.zoom.us) or
our [Developer Forum](https://devforum.zoom.us). Priority support is also available
with [Premier Developer Support](https://zoom.us/docs/en-us/developer-support-plans.html) plans.

### Documentation
Make sure to review [our documentation](https://marketplace.zoom.us/docs/zoom-apps/introduction/) as a reference when building your Zoom Apps.


# Svelte + TS + Vite

This template should help get you started developing with Svelte and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + TypeScript + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
