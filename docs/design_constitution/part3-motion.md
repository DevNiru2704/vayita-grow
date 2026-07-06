# MASTER AWWWARDS WEBSITE PROMPT

## Part 3 - Motion Design System

> Motion is not decoration. Motion is communication. Every transition, animation, transformation, and interaction should strengthen usability, storytelling, hierarchy, or brand identity. This section defines how to create award-level motion while remaining purposeful, performant, and accessible.

---

# 1. Motion Philosophy

Animation should never exist because it looks impressive.

Instead, motion should accomplish one or more of the following:

- Guide user attention
- Explain changes
- Reinforce hierarchy
- Improve navigation
- Strengthen storytelling
- Communicate interaction
- Reinforce brand personality
- Make the interface feel alive
- Create continuity between states

If an animation has no meaningful purpose, remove it.

---

# 2. Determine the Motion Language

Before implementing animations, determine the project's motion personality.

Possible motion languages include:

## Calm

Characteristics:

- Slow transitions
- Soft fades
- Gentle easing
- Minimal movement
- Relaxed pacing

Suitable for:

- Healthcare
- Wellness
- Luxury
- Editorial
- Finance

---

## Energetic

Characteristics:

- Dynamic movement
- Fast transitions
- Large transforms
- Bold reveals
- High interaction frequency

Suitable for:

- Gaming
- Sports
- Entertainment
- Creative agencies

---

## Technical

Characteristics:

- Precision
- Mechanical timing
- Structured choreography
- Grid alignment
- Controlled movement

Suitable for:

- SaaS
- Engineering
- AI
- Developer tools

---

## Cinematic

Characteristics:

- Story-driven
- Long transitions
- Layered reveals
- Depth
- Dramatic pacing

Suitable for:

- Portfolios
- Agencies
- Luxury brands
- Product launches

---

Never mix conflicting motion styles.

---

# 3. Motion Hierarchy

Different UI elements deserve different animation emphasis.

For example:

Highest emphasis:

- Hero
- Major transitions
- Key storytelling moments

Medium emphasis:

- Cards
- Navigation
- Section reveals

Low emphasis:

- Buttons
- Icons
- Hover states
- Form feedback

Everything should not animate equally.

---

# 4. Timing Principles

Animation timing communicates personality.

General guidance:

Tiny interactions

100-180ms

Standard UI

180-300ms

Section transitions

300-600ms

Large storytelling

600-1200ms

Cinematic reveals

1000-2000ms (only when appropriate)

Long animations should remain engaging.

---

# 5. Easing Philosophy

Avoid default easing curves.

Select easing based on project personality.

Examples:

Linear

Mechanical

Ease Out

Natural

Ease In Out

Balanced

Spring

Playful

Custom Cubic Bezier

Premium

Motion should feel physically believable.

---

# 6. Scroll Philosophy

Scrolling should feel intentional.

Avoid:

Every element fading independently.

Instead create:

Narrative progression.

Possible techniques:

- Progressive reveals
- Layer transitions
- Depth
- Pinned storytelling
- SVG drawing
- Content sequencing
- Controlled parallax

Scrolling should guide users naturally through the story.

---

# 7. Section Transitions

Sections should not simply appear.

Possible approaches:

Fade

Mask reveal

Clip-path

SVG transition

Shape morph

Scale

Perspective

Split panels

Typography reveal

Choose transitions that match the overall motion language.

---

# 8. SVG Motion

SVG should be meaningful.

Possible uses:

Animated logo

Path drawing

Morphing illustrations

Background geometry

Interactive diagrams

Flow visualization

Section separators

Icon transitions

Decorative accents

Do not animate every SVG.

---

## SVG Path Animation

Suitable for:

- Storytelling
- Maps
- Timelines
- Technical diagrams
- Product journeys
- Data visualization
- Brand graphics

Avoid path animation that exists only for decoration.

---

## SVG Morphing

Morphing should communicate transformation.

Examples:

Idea → Product

Seed → Tree

Wireframe → Product

Sketch → Finished Design

Loading → Success

Do not morph unrelated shapes simply because it is possible.

---

# 9. Hero Animation

The hero is the strongest visual moment.

Possible techniques:

- Layer reveals
- Text sequencing
- Mask animation
- SVG drawing
- Background transformation
- Depth movement
- Controlled particles
- Cursor interaction

Avoid overwhelming the user immediately.

Build anticipation rather than chaos.

---

# 10. Typography Animation

Typography is often the strongest storytelling tool.

Possible techniques:

Character reveal

Word reveal

Line reveal

Mask reveal

Clip-path

Opacity

Scale

Perspective

Variable font animation

Typography should remain readable throughout.

---

# 11. Image Motion

Images may animate through:

Scale

Parallax

Reveal masks

Perspective

Rotation

Depth

Crossfade

Clip paths

Do not animate images simply because they exist.

---

# 12. Cursor Design

Determine whether a custom cursor is appropriate.

Suitable for:

Creative portfolios

Studios

Luxury

Interactive storytelling

Not suitable for:

Banking

Healthcare

Government

Enterprise dashboards

If using a custom cursor:

Maintain accessibility.

Provide fallback behavior.

Avoid interfering with usability.

---

# 13. Hover Philosophy

Hover effects should communicate interactivity.

Examples:

Lift

Glow

Border transition

Background shift

Icon movement

Arrow translation

Text underline

Micro scale

Never rely on hover for essential information.

Touch devices must remain fully usable.

---

# 14. Parallax

Parallax should create depth-not dizziness.

Possible layers:

Background

Illustrations

Images

Typography

Shapes

SVG

Use subtle movement.

Excessive parallax reduces readability.

---

# 15. Mouse Interactions

Possible interactions:

Object attraction

Magnetic buttons

Pointer-following elements

Spotlight effects

Tilt cards

Interactive gradients

Cursor distortion

These should enhance-not distract.

---

# 16. Loading Experience

Loading should reinforce brand identity.

Possible approaches:

Animated logo

SVG path

Brand illustration

Progress storytelling

Minimal loader

Skeleton UI

Avoid fake loading delays.

Never slow down fast experiences.

---

# 17. Page Transitions

Page transitions should maintain continuity.

Possible techniques:

Shared elements

Mask expansion

Fade

Perspective

Layer movement

Morphing

Background continuity

Choose transitions that support navigation.

---

# 18. Storytelling Motion

Scrolling should feel like progressing through scenes.

Possible narrative techniques:

Chapter transitions

Scene changes

Pinned storytelling

Interactive diagrams

Timeline progression

Animated infographics

Reveal sequences

Use only where storytelling benefits.

---

# 19. 3D Motion

3D should serve the project.

Possible tools:

CSS transforms

Three.js

React Three Fiber

Spline

Model Viewer

WebGL

Appropriate for:

Product showcases

Architecture

Automotive

Technology

Luxury

Creative agencies

Do not force 3D into every project.

---

# 20. WebGL

Use WebGL only when it genuinely improves the experience.

Possible use cases:

Interactive backgrounds

Fluid simulations

Particle systems

Product visualization

Physics

Interactive art

Immersive storytelling

Avoid WebGL if:

- It hurts performance.
- It distracts from content.
- It increases bundle size unnecessarily.

---

# 21. GSAP Usage

GSAP is recommended for:

Complex timelines

Pinned sections

ScrollTrigger

SVG path animation

Morphing

Sequenced storytelling

Advanced timelines

Maintain clean, modular animation code.

---

# 22. Framer Motion Usage

Framer Motion is recommended for:

React UI animations

Shared layout transitions

Page transitions

Component interactions

Microinteractions

Gestures

Simple reveal animations

Avoid combining multiple animation libraries for the same purpose.

---

# 23. Animation Frequency

Not every element deserves animation.

Hierarchy example:

Hero
★★★★★

Major storytelling
★★★★★

Section transitions
★★★★☆

Cards
★★★☆☆

Buttons
★★☆☆☆

Icons
★☆☆☆☆

Forms
★☆☆☆☆

Over-animation reduces perceived quality.

---

# 24. Motion Accessibility

Always support:

`prefers-reduced-motion`

Provide alternatives for:

Parallax

Scroll animations

Auto-playing sequences

Continuous motion

Respect users who prefer reduced movement.

---

# 25. Performance Rules

Motion must remain smooth.

Maintain:

60 FPS whenever possible.

Avoid:

Layout thrashing

Expensive paint operations

Excessive DOM updates

Large GPU textures

Heavy JavaScript during scrolling

Optimize SVG complexity.

Lazy-load heavy animations.

---

# 26. Motion Consistency

Animations should feel like they belong to the same ecosystem.

Maintain consistency in:

Duration

Easing

Scale

Direction

Opacity

Transform origin

Timing

Rhythm

---

# 27. Motion Restraint

Do not animate:

Everything entering the viewport.

Instead decide:

"What deserves attention?"

Motion is most effective when used selectively.

---

# 28. Self-Review Checklist

Before implementing any animation, ask:

- Does this reinforce the brand?
- Does this improve understanding?
- Does this guide attention?
- Is it performant?
- Is it accessible?
- Is it reusable?
- Is it maintainable?
- Would removing it improve the experience?

If the answer to the last question is "yes," remove the animation.

---

# 29. Final Motion Philosophy

Award-winning motion is not measured by quantity.

It is measured by:

- Intentionality
- Craftsmanship
- Consistency
- Storytelling
- Performance
- Accessibility
- Emotional impact

The best animation is often the one users barely notice-but always appreciate.

---

# End of Part 3

The next section (**Part 4 - Component Architecture**) will cover:

- Hero section composition
- Navigation systems
- Scroll storytelling layouts
- Cards
- Forms
- Footers
- Section architecture
- Interactive components
- Reusable design patterns
- Modular UI composition
- Premium content layouts
- Information architecture
