# Software Engineering Principles (Mandatory)

The generated code must strictly follow modern software engineering principles.

## SOLID Principles

### S - Single Responsibility Principle (SRP)

Every:

- Component
- Hook
- Service
- Utility

must have only one reason to change.

Bad:

- Component fetches data
- Handles business logic
- Performs validation
- Renders UI

Good:

- Service handles API
- Hook handles state
- Component handles UI

---

### O - Open Closed Principle (OCP)

Code should be:

- Open for extension
- Closed for modification

Prefer:

```js
const strategyMap = {
  admin: AdminDashboard,
  user: UserDashboard,
};
```

instead of large switch statements.

Avoid modifying existing code whenever a new feature is added.

---

### L - Liskov Substitution Principle (LSP)

Reusable components must behave consistently.

Example:

```jsx
<Button />
<PrimaryButton />
<SecondaryButton />
```

All should support the same core contract.

---

### I - Interface Segregation Principle (ISP)

Do not force components or hooks to consume unnecessary props.

Bad:

```js
<UserCard name email age address city country permissions settings />
```

Good:

```js
<UserCard name email />
```

Pass only what is needed.

---

### D - Dependency Inversion Principle (DIP)

Depend on abstractions.

Bad:

```js
import axios from "axios";
```

everywhere.

Good:

```js
import apiClient from "@/services/apiClient";
```

All requests go through a centralized abstraction.

---

# DRY (Don't Repeat Yourself)

Eliminate duplicated:

- Logic
- Validation
- API Calls
- Constants
- Styles

Create reusable:

- Hooks
- Components
- Utilities
- Service Layers

Never copy-paste logic.

---

# KISS (Keep It Simple Stupid)

Choose the simplest solution that:

- Solves the problem
- Is maintainable
- Is scalable

Avoid:

- Over-engineering
- Premature abstractions
- Unnecessary patterns

---

# YAGNI (You Aren't Gonna Need It)

Do not build features that are not currently required.

Avoid:

- Unused abstractions
- Unused APIs
- Future-proofing without justification

Build only what is needed now.

---

# Separation of Concerns

Separate:

## UI Layer

Responsible for:

- Rendering
- User interactions

## Business Layer

Responsible for:

- Business rules
- Data transformations

## Data Layer

Responsible for:

- API communication
- Caching
- Storage

No mixing responsibilities.

---

# Clean Architecture

Follow:

```text
UI
↓
Hooks
↓
Services
↓
API Layer
↓
Backend
```

Never:

```text
UI
↓
Backend
```

directly.

---

# Clean Code Rules

Code must be:

- Readable
- Predictable
- Self-documenting

Prefer:

```js
calculateTotalPrice();
```

instead of:

```js
calc();
```

Use meaningful names.

---

# Naming Conventions

Components:

```js
UserProfileCard;
```

Hooks:

```js
useUserProfile;
```

Functions:

```js
fetchUserData;
```

Constants:

```js
MAX_RETRY_ATTEMPTS;
```

Booleans:

```js
isLoading;
hasError;
canEdit;
```

---

# Functional Programming Principles

Prefer:

- Pure functions
- Immutable updates
- Declarative code

Avoid:

```js
array.push();
```

Prefer:

```js
[...array, item];
```

when updating React state.

---

# Error Handling Principles

Every operation must handle:

- Success
- Failure
- Loading
- Empty states

Never silently fail.

Use centralized error handling.

---

# Testing Principles

Code must be designed for:

- Unit testing
- Integration testing
- E2E testing

Avoid tightly coupled code.

Use dependency injection where practical.

---

# Scalability Principles

Design code assuming:

- 10x more users
- 10x more API requests
- 10x more data

Avoid solutions that only work at small scale.

---

# Code Review Standards

Before outputting code, verify:

✓ SOLID compliant

✓ DRY compliant

✓ KISS compliant

✓ YAGNI compliant

✓ Separation of Concerns maintained

✓ No duplicated logic

✓ No dead code

✓ No unnecessary dependencies

✓ Testable architecture

✓ Scalable architecture

✓ Performance optimized

✓ Accessible

✓ Secure

✓ Production ready

---

# Senior Engineer Requirement

Write code as if it will:

- Be maintained for 5+ years
- Be reviewed by senior engineers
- Handle production traffic
- Run in enterprise environments

Never generate tutorial-level code.

Always generate production-grade code.
