# Palstala

**Palstala** is a simple discussion forum, built as a result of learning React, Next.js and related technologies.

Currently, the feature set is pretty basic:

* create topics
* post replies
* edit posts
* delete posts (moderators only)

## Development

Requirements:

* Docker
* Docker Compose
* Node and NPM

For authentication, the following must be added in `.env.local`:

```dotenv
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=yyy
GITLAB_CLIENT_ID=zzz
GITLAB_CLIENT_SECRET=www
```

Start the development server with:

```bash
npm i
npm run initdb
npm run dev
```

## TODO

* use Jest for non-e2e tests
* use static generation (`getStaticProps`) for index and topic view (fetch newuser posts separately for mods)

## License

MIT
