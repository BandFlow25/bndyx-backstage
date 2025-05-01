# Testing Strategy and Coverage

This document outlines the current state of test coverage for the `bndy-backstage` codebase, including what is tested, the tools and patterns used, and what remains outstanding.

---

## Test Infrastructure
- **Test Runner:** Jest (with TypeScript via ts-jest)
- **UI Testing:** React Testing Library
- **API/External Mocking:** MSW (Mock Service Worker)
- **Helpers:** Custom utilities in `testUtils/` for rendering providers and mocks

---

## Current Test Coverage

### 1. **Authentication**
- All authentication logic is centralized through the shared `AuthProvider` and `useAuth` from `bndy-ui`.
- **Test:** `src/lib/context/__tests__/auth-context.test.tsx`
  - Verifies authentication state (logged-in/logged-out) using mocked `useAuth`.

### 2. **Calendar Events**
- **User Events:** `src/lib/firebase/events/__tests__/user-events.test.ts`
  - Tests fetching user calendar events (present and empty cases).
- **Artist/Band Events:** `src/lib/firebase/events/__tests__/artist-events.test.ts`
  - Tests fetching artist/band events (present and empty cases).

### 3. **Band/Artist Membership**
- **Test:** `src/lib/services/artist/__tests__/members.test.ts`
  - Tests adding and removing members from an artist.
  - Uses type-safe mocks for `ArtistMember` objects.

### 4. **Test Utilities**
- **Mocks:** `testUtils/mocks.ts` provides reusable mock data for users, artists, and events.
- **Provider Rendering:** `testUtils/renderWithProviders.tsx` for rendering components with all required contexts.
- **MSW:** `testUtils/mswServer.ts` and `testUtils/mswHandlers.ts` for API mocking.

---

## Outstanding/Planned Test Coverage

- **UI Component Tests:**
  - Direct tests for UI components (forms, dialogs, etc.) using React Testing Library.
- **End-to-End Flows:**
  - Simulate user flows such as login, event creation, and band joining.
- **Error Handling:**
  - Tests for error states and edge cases (API failures, unauthorized access, etc.).
- **Integration with CI:**
  - Ensure all tests run in the CI pipeline and fail builds on test failures.
- **Test Coverage Reporting:**
  - Integrate coverage tools to track and enforce minimum coverage thresholds.
- **Mock Improvements:**
  - Expand and refine mocks as new features are added.
- **Accessibility Testing:**
  - Add checks for accessibility using jest-axe or similar tools.

---

## How to Run Tests

```bash
npm test
```

---

## Contributing to Tests
- Place unit and integration tests in `__tests__` folders colocated with the code under test.
- Use `testUtils/` for shared mocks and helpers.
- Follow the codebase's style and naming conventions.
- Refer to this document and `README.md` when adding new tests.

---

## References
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

---

_Last updated: 2025-04-28_
