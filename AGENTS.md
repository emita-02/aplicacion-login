This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

# Task-do Project Instructions

## Project Overview

Task-do is a mobile task management application.
Its motto is: "Organiza. Prioriza. Cumple."
The visible application name is **Task-Do**.

The application uses:
- Expo SDK 58
- React Native
- TypeScript
- Expo Router
- Uniwind
- Tailwind CSS 4
- Supabase Authentication and PostgreSQL
- Google OAuth
- Lottie React Native

Use the existing project configuration. Do not recreate the project.

## Architecture

Use a modular feature-based architecture with separation by layers.

Expected organization:

- src/app/: Expo Router screens and layouts.
- src/features/auth/: authentication components, hooks, services and types.
- src/features/tasks/: task components, hooks, services and types.
- src/components/: reusable shared components.
- src/lib/: Supabase client and external service configurations.
- src/providers/: global context providers.
- src/types/: shared and database types.

Create directories and files only when they are needed.
Keep business logic outside screen components whenever appropriate.
Do not introduce unnecessary architectural layers or patterns.

## Design System

Use Uniwind and Tailwind CSS 4 for styling.
Do not install or configure NativeWind.

Official project color palette:

- Brown: #684f48
- Light blue: #d6e9ed
- Gray: #ccd6d6
- Cream: #f9e7c7

Reuse the existing global.css configuration and theme variables.
Use only the light theme. Dark mode is out of scope.
Maintain a consistent, clean, modern and mobile-first interface.

## Tasks Data Model

The tasks table already exists in Supabase.

Its current fields are:

- id: UUID
- user_id: UUID
- title: TEXT, required
- description: TEXT, optional
- task_date: DATE, NOT NULL
- task_time: TIME, NOT NULL
- is_completed: BOOLEAN
- updated_at: TIMESTAMPTZ

Do not add categories, priorities or created_at.
The task_date field represents the scheduled date of a task, not a deadline.

Implement task operations using the existing table and respect its Row Level Security policies.

## Supabase and Authentication

The Supabase project, client, environment variables and database are already configured.

The existing client is located at:
src/lib/supabase.ts

Authentication requirements:
- Email and password registration.
- Email and password login.
- Email confirmation.
- Password recovery.
- Google OAuth.
- Persistent authentication sessions.
- Logout.

Resend email delivery and Supabase email templates are already configured.
Google OAuth credentials are already configured in Supabase.

Never expose secrets or place private keys in application code.
Do not modify authentication provider settings or database policies without authorization.

Use the existing deep-link scheme and registered redirect URLs.
Implement the corresponding Expo Router callback routes when developing authentication.

OAuth uses the PKCE flow. The Supabase client must keep `flowType: 'pkce'`. React Native does not provide the Web Crypto API, so PKCE support is installed from `src/lib/crypto-polyfill.ts` using `expo-crypto` before the Supabase client is created.

## Animations

Use the already installed lottie-react-native package.

Local animation files belong in:
assets/animations/

Do not create empty or invalid animation JSON files.
Use valid animation assets when they are provided or approved.

## Dependencies and Existing Configuration

Before installing a package, inspect package.json and check whether it is already installed.

Use npx expo install for Expo-compatible dependencies.

Do not replace, remove or upgrade existing dependencies without explaining why and obtaining approval.

Preserve the existing Expo, Metro, Uniwind, Supabase and Expo Router configurations.

Do not overwrite existing files without reading and understanding their contents first.

## Development Workflow

Work incrementally and implement only the current approved stage.

Before making changes:
1. Inspect the relevant files and existing implementation.
2. Explain briefly what will be changed.
3. Avoid unrelated modifications.

After implementation:
1. Review the modified files.
2. Run relevant checks.
3. Fix errors introduced by the changes.
4. Summarize what was implemented and which files changed.

Run lint and TypeScript checks before declaring a development task complete.

Do not perform unnecessary configuration tests or create temporary test screens.
Test application functionality when the corresponding screens and features are implemented.

Wait for user approval before moving to the next development stage.

Do not make unrequested design, architecture, database or dependency decisions.
If a requirement is ambiguous, ask before making a significant decision.
