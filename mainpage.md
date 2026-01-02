# Project: Smart Page Analyzer - Landing Page Implementation

## 1. Project Overview
Create a high-end, professional landing page for a SaaS that evaluates e-commerce detail pages.
**Design Reference:** [Phantom](https://phantom.com/) (Focus on scroll-linked animations, layering, and high-quality motion).
**Core Vibe:** Modern, Tech-focused, Trustworthy, Analytical (NOT cute or childish).

## 2. Tech Stack
- **Framework:** Next.js 14 (App Router) or React (Vite)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (Critical for scroll interactions)
- **Icons:** Lucide React
- **Fonts:** Inter or Pretendard (Clean Sans-serif)

## 3. Design System & Global Styles

* **Color Palette:**
    * **Background:** Clean Light Theme (Pure White `#FFFFFF` or Off-White `#FAFAFA`) to keep it fresh and spacious.
    * **Primary Text:** Matte Black (`#171717`) for maximum readability and contrast.
    * **Accent:**
        * **Neon Lime:** (`#CCFF00` or `#B4F400`) Used for primary buttons, active states, and highlights.
        * **Solid Black:** (`#000000`) Used for borders, bold interaction elements, and layout dividers.

* **UI Language:**
    * **Style:** **High Contrast & Pop.** Use solid black borders (1px~2px) combined with lime shadows or backgrounds to create a 'sticker' or 'brutalist' aesthetic.
    * **Shape:** Mix of sharp edges and `rounded-xl`. Buttons should feel tactile and punchy.
    * **Typography:** Modern Sans-serif (e.g., Pretendard, Inter). Headings should be heavy/bold to convey energy, with dynamic sizing.
    * **Interaction:** Fast and snappy micro-interactions (e.g., buttons shifting position slightly on hover) to emphasize the "young" vibe.
---

## 4. Section Implementation Guide

### Section A: Hero Section (The Hook)
**Goal:** Direct the user to the input field immediately with a premium feel.

* **Layout:**
    * **Headline (H1):** Large, centered. Example: "Optimize Your Detail Page with human insights."
    * **Subtext:** "Data-driven insights to boost your conversion rate."
    * **Main Component:** A large, high-quality URL Input Field + "Analyze" Button.
* **Animation (Framer Motion):**
    * **On Load:** Text staggers in (Fade up).
    * **Input Field:** Should have a subtle glowing border.
    * **Scroll Behavior:** As the user scrolls down, the hero content slightly fades out and scales down to give focus to the next section.

### Section B: The "Importance" (Problem vs. Solution)
**Goal:** Visualize "Chaos vs. Order" using scroll triggers.

* **Structure:**
    * Use a `sticky` container (height: `200vh` or more) to pin the section while scrolling.
* **Visuals:**
    * Use abstract "UI Blocks" (rectangles representing images/text).
* **Animation Sequence:**
    1.  **Start:** UI Blocks are scattered randomly, slightly rotated, and dim (representing a bad detail page).
    2.  **Scroll Action:** As the user scrolls, the blocks smoothly move to specific coordinates to form a perfect, aligned Grid. Colors become vivid.
    3.  **Text Change:** Headline transitions from "Messy Layout loses customers" to "Structured Design drives sales."

### Section C: The "Process & Result" (The Scanner)
**Goal:** Show the analysis process and the resulting score cards.

* **Structure:**
    * Use a `sticky` container.
* **Visuals:**
    * A central "Browser Mockup" image/div.
    * "Score Cards" (e.g., Readability: A, Trust: 98).
* **Animation Sequence:**
    1.  **Scanning:** A horizontal "Laser Line" moves down the Browser Mockup.
    2.  **Result Reveal:** After the scan passes, "Score Cards" float in from behind the mockup (using `z-index` and `scale`).
    3.  **Layering:** The cards settle around the mockup.
    4.  **Parallax:** (Optional) Mouse movement slightly tilts the cards (3D effect).

---

## 5. Development Prompt for Agent

> "Act as a Senior Frontend Developer. Build the main landing page based on the specifications above.
>
> **Key Requirements:**
> 1. Use **Next.js, Tailwind CSS, and Framer Motion**.
> 2. Create a dark-themed, premium design.
> 3. Implement the **Scroll-linked animations** described in Section 4. Use `useScroll` and `useTransform` hooks effectively.
> 4. Do not use external images; use CSS shapes or Lucide icons for the UI representations.
> 5. Make the code modular (separate components for Hero, ImportanceSection, AnalysisSection).
>
> Start by setting up the basic layout and the Hero section."