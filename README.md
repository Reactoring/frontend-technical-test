# Frontend technical test

## AI-assisted development

This test was developed with AI assistance, mainly to generate the code and the styling.

- **Code**: all the code was reviewed. The CSS a bit less, but I already caught style regressions and had them fixed.
- **Unit tests**: most generated tests were not reviewed in depth because of the time limit. In my opinion, a good AI-generated test is still better than no test.

What I did:

- Brainstormed the plan with the AI, then reordered the features following a natural progression and the requirements.
- Enforced the architecture: UI and layout separated from the business modules, components split out instead of piled into the pages.
- Made the technical choices: TanStack Query, a React context for the logged user id, Prettier, vulnerability checks.
- Worked step by step, with a review before coding and another before each commit, and a strict code review.
- Described the UI I wanted and asked for changes, checked the UX and requested corrections.
- Paid attention to UX and UI edge cases from the start, and ran targeted manual tests.

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
| `npm run format`    | Format the code with Prettier     |

The CI runs format check, lint, typecheck and tests on every push and pull request.

## Features

- Conversation list, most recent first
- Conversation messages, oldest first
- Send a message (Enter to send, Shift + Enter for a new line), the field is kept if sending fails

## Technical choices

### Rendering

Kept the Pages Router provided by the boilerplate. Messaging is private and highly interactive, so data is fetched client-side: pages are static, and TanStack Query caching makes navigation instant. The App Router's Server Components would bring little here; migrating would be a separate step.

### Tooling

- **Type checking in CI**: `next build` ignores ESLint and tests don't check types, so a dedicated `typecheck` step catches type errors before they reach `main`.
- **Prettier** formats the code (`npm run format`); ESLint only checks code quality (`eslint-config-prettier` disables the conflicting rules).

### Project structure

- `pages`: routing only.
- `components/ui`: generic components driven by props (no data, no business logic).
- `components/layout`: the app shell.
- `components/conversations`: business components; some fetch data and handle loading, error and empty states, the others only render props.
- `utils`: pure functions, grouped by data type.

### Data layer

All HTTP calls go through `src/services/apiClient.ts` (timeout and a typed `ApiError`). The API is not trusted: every response is validated with zod, and the types in `src/types` are inferred from these schemas. The endpoints the app may call are declared once in `src/services/endpoints.ts` (path, method, zod input and output). Components use them through `useTypedQuery` / `useTypedMutation` (TanStack Query), so params and results are typed and mutation inputs are validated before being sent. The swagger is outdated (wrong types, missing fields), so this contract is written by hand instead of being generated.

### Logged user

The logged user id is provided by a React context (`useLoggedUserId()`), so components and tests don't depend on a global constant. `getLoggedUserId()` stays the single source: plugging real authentication only means changing this function.

### Internationalisation

The interface is in French. Texts live in `src/i18n/fr.ts` and are read with a typed `t('key', params)` function (an unknown key is a compile error, `{name}` placeholders are replaced by params). Adding a language means adding a dictionary with the same keys.

### Security

`next@15.2.2` had known vulnerabilities, including a critical one ([CVE-2025-29927](https://github.com/advisories/GHSA-f82v-jwr5-mffw)). Upgraded to the latest 15.x, removed the redundant `sharp` dependency and overrode the `postcss` version bundled by Next: `npm audit` goes from 26 vulnerabilities to 0. Next 16 is a major version and would need its own validated migration.

`GET /conversation/:id` always returns `[]` (the json-server middleware intercepts it), so a conversation is read from the user's conversation list: an id outside this list shows "not found" and its messages are never loaded. This is only a client-side guard, the API must enforce it. Message bodies are rendered as text, never as HTML.

## Known limitations

- The json-server does not update `lastMessageTimestamp` when a message is sent, so the conversation date and order stay unchanged after sending.
