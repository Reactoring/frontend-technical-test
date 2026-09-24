# Frontend technical test

## Getting started

Requirements: Node.js 22 (see `.nvmrc`).

```bash
npm install
npm run start-server   # API on http://localhost:3005
npm run dev            # app on http://localhost:3000
```

The API URL can be changed with `NEXT_PUBLIC_API_URL` (see `.env.example`).

| Script              | Description                       |
| ------------------- | --------------------------------- |
| `npm test`          | Unit and integration tests        |
| `npm run lint`      | ESLint                            |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |

The CI runs lint, typecheck and tests on every push and pull request.

## Technical choices

### Tooling

- **Type checking in CI**: `next build` ignores ESLint and tests don't check types, so a dedicated `typecheck` step catches type errors before they reach `main`.

### Data layer

All HTTP calls go through `src/services/apiClient.ts` (timeout and a typed `ApiError`). The API is not trusted: every response is validated with zod, and the types in `src/types` are inferred from these schemas.

### Security

`next@15.2.2` had known vulnerabilities, including a critical one ([CVE-2025-29927](https://github.com/advisories/GHSA-f82v-jwr5-mffw)). Upgraded to the latest 15.x, removed the redundant `sharp` dependency and overrode the `postcss` version bundled by Next: `npm audit` goes from 26 vulnerabilities to 0. Next 16 is a major version and would need its own validated migration.

