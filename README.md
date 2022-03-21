# Online Digital Shop

![Version](https://img.shields.io/github/package-json/v/mrkelder/online-digital-shop?color=green)
![Code-Size](https://img.shields.io/github/languages/code-size/mrkelder/online-digital-shop)

It's a pet-project to showcase my general skills in a web development.

This project is about my capability of developing modern e-commerce projects.

The project will be polished over time and will be receiving new updates as long as I get new valuable and profound skills.

If you're just looking for practice, feel free to copy and modify this code in any way.

## Quick Navigation

- [Setting Up](#Setting-Up)
- [Technology Stack](#Technology-Stack)
- [Environment Variables](#Environment-Variables)
- [Commits Naming](#Commits-Naming)
- [Workflow](#Workflow)

## Setting Up

To get started with the project:

1. Install Node.js following [this link](https://nodejs.org/).
2. Clone it via `git clone https://github.com/mrkelder/online-digital-shop.git`
3. Open up **online-digital-shop** folder (type `cd online-digital-shop` in bash)
4. Install the dependencies `npm i`
5. Start a local server `npm run dev`

You should be able to access [http://localhost:3000](http://localhost:3000) for now.

## Technology Stack

The tech stack I'm currently using in this project:

1. ReactJS
2. NextJS
3. Redux
4. Firebase
5. Google Maps API
6. Tailwindcss
7. Stripe

Please note that this stack **may change in the future**.

_In the nearest future, the stack above might also include:_

1. MongoDB (replacing firebase firestore)
2. Mongoose
3. Docker

## Environment Variables

To start the application properly you have to specify the following options in **.env.local** file in the root directory

- NEXT_PUBLIC_MAPS_API_KEY - Google Maps API key
- NEXT_PUBLIC_MAPS_ID - Google Maps Id (for styling purposes)
- NEXT_PUBLIC_HOSTNAME - the host name of the site

### Firebase Data

- NEXT_PUBLIC_API_KEY
- NEXT_PUBLIC_AUTH_DOMAIN
- NEXT_PUBLIC_PROJECT_ID
- NEXT_PUBLIC_STORAGE_BUCKET
- NEXT_PUBLIC_MESSAGING_SENDER_ID
- NEXT_PUBLIC_APP_ID
- NEXT_PUBLIC_MEASUREMENT_ID

### Stripe Data

- NEXT_PUBLIC_STRIPE_PUBLIC_KEY
- STRIPE_SECRET_KEY

## Commits Naming

Here are a few git commits naming conventions. Every commit has to start with one of these:

- **feat:** - a new functionality is added
- **dev:** - a new dependency is added, a new work flow is applied, the version is changed etc.
- **fix:** - bug fixes
- **test:** - writing tests
- **docs:** - modifying docs

## Workflow

This project is following **Git Flow** convention as shown below.

![Git Flow](/docs/gitflow.png)
