# CalTrack Progress

## Status Table

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Setup and navigation | ✅ Done |
| Phase 2 | Supabase auth and schema | ✅ Done |
| Phase 3 | Onboarding and calculations | ✅ Done |
| Phase 4 | Home dashboard | Pending |
| Phase 5 | Add, edit, delete food | Pending |
| Phase 6 | History | Pending |
| Phase 7 | Settings and polish | Pending |

## Work Log
- Initialized Expo project with TypeScript and Expo Router.
- Cleaned up default template files.
- Created root `_layout.tsx` with light/dark theme and green accent color.
- Created bottom tabs `(tabs)` with Home, History, and Settings placeholder screens.
- Installed requested dependencies: `@supabase/supabase-js`, `zustand`, `react-native-svg`, `expo-secure-store`, `@react-native-async-storage/async-storage`.
- Phase 1 confirmed working on a real phone through Expo Go.
- **Phase 2 Implementation**:
  - Added `.env` and `.eslintcache` to `.gitignore` to ensure credentials and cache are never committed.
  - Created `types/database.ts` with TypeScript interfaces matching the database schema and exact `activity_level` values (`sedentary`, `light`, `moderate`, `active`, `very_active`).
  - Implemented Supabase client in `lib/supabase.ts` with `@react-native-async-storage/async-storage` session persistence and `AppState` listener for token refresh.
  - Implemented Zustand auth store in `store/auth.ts` handling `signUp`, `signIn`, `signOut`, and `initialize`.
  - Created authentication stack and screens: `app/(auth)/_layout.tsx`, `app/(auth)/login.tsx`, and `app/(auth)/signup.tsx` with input validation, error handling, and matching green accent styling.
  - Updated root `app/_layout.tsx` with auth guard (`useProtectedRoute`) to redirect unauthenticated users to `/(auth)/login` and authenticated users to `/(tabs)`.
  - Updated `app/(tabs)/settings.tsx` with current user email display and confirmation-prompted logout.
  - Verified with TypeScript check (`tsc --noEmit`) and ESLint with 0 errors.
- **Phase 3 Implementation**:
  - Created `lib/nutrition.ts` with BMR, TDEE, and target calculation functions using evidence-based formulas.
  - Enhanced auth store in `store/auth.ts` to handle profile data synchronization with Supabase.
  - Created onboarding flow with three steps:
    - Step 1: Personal information (age, sex, height, weight)
    - Step 2: Activity level and goal selection
    - Step 3: Summary with calculated targets display and completion
  - Updated settings screen to display profile data and calculated daily targets.
  - Enhanced root layout auth guard to redirect to onboarding for incomplete profiles.
  - All components follow existing UI patterns with consistent styling and validation.

## Decisions
- Swapped Expo default `src/app` pattern to the requested `caltrack/app/` structure.
- Used simple emoji for tab icons initially to avoid missing asset issues.
- Used Zustand store to centralize auth state and sync with Supabase `onAuthStateChange`.

## Known Issues
- **Expo SDK 57 / expo-router**: `expo-router` no longer allows importing `@react-navigation/*` directly in app code. Always import theme/navigation APIs from `expo-router/react-navigation` (e.g., `DarkTheme`, `DefaultTheme`, `ThemeProvider`, `useTheme`). Never install `@react-navigation/*` packages directly.

## Manual Steps Completed
- Supabase project created.
- SQL schema applied (tables: `profiles`, `food_entries`, `favorite_foods` with RLS policies).
- `.env` file filled in with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## Next Steps
- User verification on real phone through Expo Go for Phase 3 (Test onboarding flow, profile persistence, calculated targets display).
- Upon confirmation, proceed to Phase 4: Home dashboard (Display daily targets, food logging interface, nutrition tracking).
