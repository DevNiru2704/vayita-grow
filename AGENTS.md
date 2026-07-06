<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, file structure, caching behavior, and recommended patterns may differ significantly from your training data.

Before writing or modifying any code:

- Read the relevant documentation under `node_modules/next/dist/docs/`.
- Follow the latest APIs and conventions.
- Heed all deprecation notices.
- Never assume behavior from older versions of Next.js.
- Prefer the latest recommended implementation patterns.

---

# Project Agent Instructions

This project follows a **documentation-first** development workflow.

Before implementing, modifying, refactoring, or redesigning any feature, you **must** read the project documentation in the order specified below.

---

# Current Project State

The current repository represents an **early prototype**.

The prototype was primarily created to communicate ideas, demonstrate concepts, and validate business direction. It should **not** be considered the final architecture, design system, engineering standard, or user experience.

Treat the existing implementation as a collection of reusable assets rather than the source of truth.

The current codebase may contain:

- Temporary implementations
- Placeholder content
- Inconsistent layouts
- Outdated components
- Experimental UI
- Prototype-level engineering
- Missing accessibility
- Missing responsiveness
- Incomplete architecture
- Inconsistent naming
- Technical debt

Do **NOT** preserve existing implementations simply because they already exist.

Instead, evaluate every page, component, layout, interaction, animation, and architectural decision against the project documentation.

If something can be significantly improved, redesign or rewrite it.

The documentation—not the existing implementation—is the authoritative source of truth.

---

# Current Development Goal

The objective is to transform the prototype into a production-quality application.

The resulting application should be:

- Modern
- Maintainable
- Scalable
- Accessible
- Responsive
- Performance optimized
- Production ready

If necessary, entire pages, layouts, components, animations, or folder structures may be redesigned or rewritten.

Preserve existing code only when it aligns with:

- Project requirements
- Engineering guidelines
- Design Constitution
- Production-quality standards

---

# Documentation Reading Order (Mandatory)

## Phase 1 — Design Constitution

Read every document under:

```text
docs/design_constitution/
```

Read all files in logical order.

These documents define:

- Design philosophy
- Visual language
- Motion language
- Component architecture
- Engineering philosophy
- Creativity framework
- Decision framework
- Development workflow

Treat these documents as the project's Design Constitution.

### Important

The Design Constitution is **NOT** a checklist.

Do **NOT** blindly implement every:

- Animation
- SVG
- WebGL effect
- Motion technique
- Layout
- Interaction
- UI pattern
- Component pattern

Instead:

1. Understand the project.
2. Understand the business.
3. Understand the users.
4. Infer the project's design system.
5. Determine the project's motion language.
6. Select only the techniques that improve the final product.
7. Ignore everything that does not strengthen the overall experience.

The Design Constitution teaches **how to think**, not **what to build**.

---

## Phase 2 — Engineering Guidelines

Read every document under:

```text
docs/guidelines/
```

These documents define the mandatory engineering standards for this project.

Examples include:

- Software engineering principles
- Architecture
- Frontend standards
- Backend standards
- Database standards
- Security
- Accessibility
- Performance
- Testing
- DevOps
- Documentation

Every guideline is mandatory unless explicitly overridden by project requirements.

---

## Phase 3 — Project Details

Read every document under:

```text
docs/project_details/
```

Understand:

- Business goals
- Product vision
- Problem statement
- Value proposition
- Functional requirements
- Non-functional requirements
- Website or application structure
- Features
- User flows
- Content
- Technical constraints

Read every relevant document before implementation.

Never make assumptions that contradict the project documentation.

---

# Documentation Priority

When multiple sources provide guidance, always follow this priority.

1. Current user request
2. `docs/project_details/`
3. `docs/guidelines/`
4. `docs/design_constitution/`

Higher-priority documents always override lower-priority documents.

If documentation conflicts and the conflict cannot be resolved logically:

- Stop.
- Explain the conflict.
- Ask for clarification before proceeding.

Never silently choose one interpretation.

---

# Design System

If the project does not already contain a design system:

Create one.

Store it inside:

```text
docs/design_systems/
```

The design system should document all major visual decisions, including where applicable:

- Typography
- Colors
- Layout
- Grid
- Spacing
- Border radius
- Shadows
- Icons
- Components
- Motion language
- Responsive behavior
- Accessibility considerations
- Visual hierarchy

Whenever visual decisions change, immediately update the design system documentation.

Documentation must always reflect the current implementation.

---

# Documentation Policy

Documentation is part of the implementation.

Whenever changes affect:

- Architecture
- Components
- Features
- APIs
- Folder structure
- Design
- Motion
- Content
- User flows
- Configuration

Update the relevant documentation before considering the task complete.

Never leave documentation outdated.

---

# Content Policy

If multiple approved content sources exist:

1. Read every source.
2. Merge them into the most complete version where appropriate.
3. Save the merged document according to the project's documentation structure.

Rules:

- Never invent facts.
- Never invent company information.
- Never invent products or services.
- Never invent certifications.
- Never invent testimonials.
- Never invent statistics.
- Never invent legal claims.
- Never invent marketing claims.

Only reorganize, improve, and combine the information already provided unless explicitly instructed otherwise.

---

# Icons & Graphics

Do **NOT** use emojis.

Preferred icon libraries:

- React Icons
- Lucide React
- Heroicons
- Other actively maintained icon libraries

Only create custom SVG graphics when:

- No suitable icon exists.
- A project-specific illustration is required.
- The project explicitly requires original SVG artwork.

Do not create decorative SVGs without purpose.

---

# Development Workflow

Before writing code, always complete the following workflow mentally.

1. Read the Design Constitution.
2. Read the Engineering Guidelines.
3. Read the Project Details.
4. Understand the business.
5. Understand the users.
6. Determine the design system.
7. Determine the motion language.
8. Plan the information architecture.
9. Plan reusable components.
10. Plan the implementation.
11. Implement.
12. Review.
13. Update documentation.

Do not skip these steps.

---

# Development Principles

Every implementation should prioritize:

- Accessibility
- Performance
- Security
- Maintainability
- Scalability
- Reusability
- Consistency
- Responsive design
- Production readiness

Every component should belong to the same design system.

Every animation should have a purpose.

Every interaction should improve the user experience.

Every line of code should be maintainable.

Prefer:

- SOLID
- DRY
- KISS
- YAGNI
- Separation of Concerns
- Clean Architecture

---

# Refactoring Permission

You have explicit permission to improve the project whenever necessary.

This includes:

- Redesigning layouts
- Rewriting components
- Replacing temporary implementations
- Improving information architecture
- Improving user experience
- Modernizing animations
- Refactoring folder structures
- Improving naming conventions
- Removing dead code
- Eliminating technical debt
- Simplifying architecture
- Improving maintainability

Do **NOT** preserve existing code solely because it already exists.

Always prioritize:

- Better architecture
- Better maintainability
- Better accessibility
- Better scalability
- Better performance
- Better user experience
- Better engineering quality

---

# Definition of Done

A task is complete only when all of the following conditions are satisfied.

## Engineering

- Production-ready implementation
- Clean architecture
- Reusable components
- No duplicated logic
- Readable code
- Follows all project guidelines

## Design

- Consistent with the project design system
- Responsive
- Accessible
- Purposeful motion
- Visually cohesive

## Documentation

- Design system updated (if required)
- Project documentation updated
- Architecture documentation updated (if required)
- Technical documentation updated (if required)

## Quality

- No dead code
- No unnecessary complexity
- No outdated documentation
- No obvious accessibility issues
- No obvious performance regressions
- No unresolved TODOs without justification
- No deprecated code
- Refactor outdated implementations when beneficial

Only then should the implementation be considered complete.

---

# Project Structure

Unless explicitly instructed otherwise, follow the existing project structure.

```text
app/
components/
docs/
lib/
public/
```

## App Router

The application uses the Next.js App Router.

```
app/
├── page.tsx                 # Homepage
├── about/
├── contact/
├── feedback/
├── login/
├── products/
│   └── [slug]/
└── dashboard/
```

### Public Routes

Public pages belong under:

```
app/
```

Examples:

- Home
- About
- Products
- Product Details
- Feedback
- Contact
- Login

### Dashboard Routes

Authenticated business functionality belongs under:

```
app/dashboard/
```

Examples:

- Dashboard
- Clients
- Orders
- Statements
- Field Reports
- Settings

Use nested route segments when introducing new dashboard modules.

---

## Components

Reusable components belong under:

```
components/
```

Current organization:

```
components/
├── layout/
├── shared/
└── ui/
```

### layout/

Contains application layout components.

Examples:

- Header
- Footer
- Sidebar

### shared/

Contains reusable business-oriented components.

Examples:

- ProductCard
- TeamCard
- TestimonialCard
- StatCard
- SectionHeading

### ui/

Contains low-level reusable UI primitives.

Examples:

- Button
- Card
- Input
- Table
- Tabs
- Sheet

Prefer extending existing UI components rather than creating duplicates.

---

## Documentation

Project documentation belongs under:

```
docs/
```

Current structure:

```
docs/
├── design_constitution/
├── design_systems/
├── guidelines/
└── project_details/
```

Whenever implementation changes affect documentation, update the corresponding documents.

---

## Shared Utilities

Shared utilities belong under:

```
lib/
```

Examples:

- Utility functions
- Constants
- Mock data
- Shared helpers

Business logic should not be duplicated inside pages or components.

---

## Static Assets

Static assets belong under:

```
public/
```

Organize assets into logical folders.

Example:

```
public/
├── products/
├── images/
├── icons/
├── logos/
└── illustrations/
```

Do not place images inside the source code unless required by the framework.

---

## Folder Organization Principles

When introducing new files or folders:

- Follow the existing project organization.
- Keep related functionality together.
- Prefer extending the current structure instead of creating parallel structures.
- Avoid unnecessary nesting.
- Avoid duplicate components.
- Avoid duplicate utilities.
- Keep imports clean and predictable.

If a better project organization becomes necessary during refactoring, explain the proposed changes before making large structural modifications.

## Existing Codebase Awareness

Before creating any new:

- Component
- Hook
- Utility
- Layout
- Page
- Type
- Helper

first search the existing project to determine whether a suitable implementation already exists.

Reuse and extend existing code whenever appropriate.

Only create new files when existing implementations cannot reasonably be reused or extended.

Avoid duplicate implementations throughout the codebase.

<!-- END:nextjs-agent-rules -->
