# Palstala

**Palstala** is a simple discussion forum, built as a result of learning React, Next.js and related technologies.

## Development

Requirements:

* Docker
* Docker Compose
* Node and NPM

For authentication, `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` must be added in `.env.local`:

```dotenv
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=yyy
```

Start the development server with:

```bash
npm i
npm run initdb
npm run dev
```

## License

MIT
