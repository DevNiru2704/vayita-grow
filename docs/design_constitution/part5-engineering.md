# MASTER AWWWARDS WEBSITE PROMPT

## Part 5 - Technical Standards & Engineering Excellence

> An award-level website is judged not only by its appearance, but by the quality of its engineering. The implementation should be scalable, maintainable, performant, accessible, and production-ready. Beautiful code produces beautiful products.

---

# 1. Engineering Philosophy

Write code as if it will be maintained by a senior engineering team for the next five years.

Every implementation should prioritize:

- Readability
- Maintainability
- Scalability
- Performance
- Accessibility
- Reusability
- Predictability
- Testability

Avoid clever solutions that reduce clarity.

---

# 2. Project Architecture

The project should follow a clear, modular architecture.

Organize by **feature and responsibility**, not by convenience.

Example categories:

- App
- Components
- Features
- Layouts
- Sections
- Hooks
- Utilities
- Services
- Assets
- Animations
- Types
- Constants
- Config
- Providers
- Styles
- Public Assets

Avoid dumping unrelated files into a single directory.

---

# 3. Component Architecture

Components should follow a hierarchy.

### Base Components

Reusable UI primitives.

Examples:

- Button
- Input
- Card
- Badge
- Avatar
- Modal
- Tooltip
- Spinner

---

### Composite Components

Built from primitives.

Examples:

- Navigation
- Hero
- Pricing Section
- Timeline
- Testimonial Carousel

---

### Page Components

High-level composition only.

Pages should orchestrate components rather than contain business logic.

---

# 4. Single Responsibility Principle

Each file should have one primary purpose.

Examples:

A Hero component should not contain:

- API calls
- Global state
- Analytics
- Unrelated utilities

Keep concerns separated.

---

# 5. Reusability

Before writing new code, ask:

- Can this already be reused?
- Can it become configurable?
- Can it become composable?
- Can it become a shared component?

Prefer composition over duplication.

---

# 6. Styling Strategy

Choose one primary styling methodology.

Examples:

- Tailwind CSS
- CSS Modules
- Vanilla CSS
- Styled Components
- Emotion

Do not mix multiple styling paradigms unnecessarily.

Maintain consistency throughout the project.

---

# 7. Design Tokens

Use centralized design tokens for:

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Breakpoints
- Durations
- Easings
- Z-index
- Opacity

Avoid hardcoded values throughout the codebase.

---

# 8. Animation Architecture

Separate animation logic from UI where practical.

Organize:

- Shared animations
- Timelines
- Scroll interactions
- SVG utilities
- Motion presets
- Transition variants

Avoid scattering animation logic across unrelated components.

---

# 9. SVG Organization

Treat SVG assets as first-class components.

Organize:

- Icons
- Illustrations
- Background graphics
- Animated paths
- Masks
- Filters

Optimize SVGs before shipping.

Remove unnecessary metadata and hidden elements.

---

# 10. State Management

Choose the simplest solution that satisfies the requirements.

Possible options:

- Local state
- Context
- Zustand
- Redux
- React Query
- TanStack Query

Avoid introducing global state prematurely.

---

# 11. Data Fetching

Data fetching should be:

- Predictable
- Cached where appropriate
- Error-tolerant
- Lazy when beneficial
- Optimized for performance

Handle:

Loading

Success

Failure

Retry

Offline scenarios where applicable.

---

# 12. API Design

If consuming APIs:

- Centralize requests
- Use typed responses
- Validate data
- Handle errors gracefully
- Avoid duplicated logic

Separate networking from presentation.

---

# 13. Performance Philosophy

Performance is a feature.

Users perceive fast interfaces as more polished.

Optimize continuously rather than at the end of development.

---

# 14. Performance Budget

Aim for:

- Fast initial load
- Low JavaScript execution
- Minimal layout shifts
- Optimized rendering
- Efficient hydration
- Smooth scrolling
- Stable frame rate

Avoid unnecessary dependencies.

---

# 15. Image Optimization

Use modern formats when appropriate.

Optimize:

- Resolution
- Compression
- Lazy loading
- Responsive sizing
- Priority loading for hero media

Never serve oversized assets.

---

# 16. Font Optimization

Load only required font weights.

Use:

- Font subsetting
- Preloading where appropriate
- Font-display strategies
- Variable fonts when beneficial

Avoid blocking rendering with unnecessary font requests.

---

# 17. Lazy Loading

Lazy-load:

- Heavy components
- Videos
- 3D scenes
- Large SVG illustrations
- Below-the-fold images
- Non-critical scripts

Do not lazy-load essential UI.

---

# 18. Accessibility Engineering

Accessibility should be implemented from the start.

Support:

- Keyboard navigation
- Screen readers
- Semantic HTML
- Focus management
- Skip links
- Reduced motion
- High contrast
- Form labels
- Accessible error handling

Accessibility is part of engineering quality.

---

# 19. SEO

Structure pages for discoverability.

Include:

- Semantic headings
- Metadata
- Structured data where appropriate
- Descriptive titles
- Meaningful URLs
- Open Graph metadata
- Twitter cards
- Canonical URLs

SEO should emerge naturally from well-structured content.

---

# 20. Semantic HTML

Prefer semantic elements.

Examples:

header

nav

main

section

article

aside

footer

figure

figcaption

button

form

Avoid excessive `<div>` nesting.

Structure communicates meaning.

---

# 21. Responsive Engineering

Responsiveness is not simply CSS breakpoints.

Consider:

- Navigation changes
- Touch interactions
- Performance differences
- Reduced animations
- Image selection
- Typography scaling

Every device deserves a tailored experience.

---

# 22. Error Handling

Every asynchronous operation should handle:

Loading

Success

Failure

Unexpected responses

Timeouts

Offline conditions

Never allow silent failures.

---

# 23. Security

Implement reasonable frontend security practices.

Examples:

- Sanitize user-generated content
- Avoid exposing secrets
- Validate inputs
- Use secure API communication
- Respect Content Security Policy where applicable

Security contributes to trust.

---

# 24. Code Quality

Code should be:

Consistent

Typed where possible

Well-named

Modular

Predictable

Documented when necessary

Avoid cryptic abstractions.

Readable code is maintainable code.

---

# 25. Naming Conventions

Use descriptive names.

Prefer:

`ProductHero`

over

`Hero2`

Prefer:

`AnimatedTimeline`

over

`TimelineNew`

Names should describe intent rather than history.

---

# 26. Comments

Comments should explain **why**, not **what**.

Avoid:

```ts
// Increment counter
count++;
```

Prefer:

```ts
// Delay until the hero animation completes to prevent layout shift.
```

Write self-explanatory code whenever possible.

---

# 27. Dependency Philosophy

Every dependency increases maintenance cost.

Before installing a package, ask:

- Can this be implemented simply?
- Is the package actively maintained?
- Is it widely trusted?
- Does it justify its bundle size?
- Will it still be useful in one year?

Prefer fewer, high-quality dependencies.

---

# 28. Testing Considerations

Design components to be testable.

Encourage:

- Predictable outputs
- Stable selectors
- Isolated logic
- Pure functions where practical

Even if tests are not immediately written, the architecture should support them.

---

# 29. Progressive Enhancement

Core functionality should work before advanced enhancements.

Users with:

- slow devices
- limited bandwidth
- disabled JavaScript (where possible)
- assistive technologies

should still receive a usable experience.

Enhance rather than require advanced capabilities.

---

# 30. Browser Compatibility

Support modern browsers gracefully.

When using advanced APIs:

- Feature-detect
- Provide fallbacks where appropriate
- Avoid breaking core functionality

Progressive enhancement is preferred over strict degradation.

---

# 31. Deployment Readiness

The final project should be production-ready.

Verify:

- Optimized builds
- Environment variables
- Clean console output
- No debug code
- Error boundaries
- Metadata
- Favicon
- Robots configuration
- Sitemap generation
- Analytics hooks (if required)

---

# 32. Documentation

Document:

- Folder structure
- Design decisions
- Animation architecture
- Reusable utilities
- Configuration
- Environment setup

Documentation should help future contributors understand the project quickly.

---

# 33. Final Engineering Checklist

Before considering the project complete, verify:

- Is the architecture modular?
- Are components reusable?
- Is state appropriately managed?
- Are assets optimized?
- Is the design tokenized?
- Are animations performant?
- Is accessibility implemented?
- Is SEO addressed?
- Is the code readable?
- Is the project production-ready?

Only when all answers are affirmative should the implementation be considered complete.

---

# 34. Final Engineering Philosophy

Exceptional websites are built on invisible craftsmanship.

Users may never notice:

- semantic HTML,
- optimized assets,
- thoughtful architecture,
- accessible interactions,
- efficient rendering,
- or maintainable code.

But they will notice the confidence, speed, and reliability that result from these engineering decisions.

Engineering excellence is the foundation upon which award-worthy design is built.

---

# End of Part 5

The next section (**Part 6 - Creativity Engine & Premium Experience Design**) will explore:

- Creative direction
- Visual storytelling
- Signature interactions
- Experimental UI (when appropriate)
- Delightful micro-details
- Emotional design
- "Wow" moments
- Originality vs imitation
- Balancing innovation with usability
- Crafting memorable, award-level experiences
