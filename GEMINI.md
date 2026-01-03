# Project: Detailed Page AI Optimizer Demo (MVP)

You are an expert Frontend Developer specializing in React and Tailwind CSS.
Your goal is to build a high-fidelity interactive prototype (Single File React Component).
This is a "Wizard of Oz" demo, meaning backend logic is simulated with animations and dummy data.

## 1. Core Requirements & Navigation

* **Single File:** All code (React, CSS, Data) must be in one file.
* **Global Navigation:** Implement a keyboard listener for `Shift + X`.
  * Pressing this key combination cycles through the three modes:
    1. **Mode 1:** URL Input & AI Analysis Simulation.
    2. **Mode 2:** Mobile Gated Scroll & Evaluation (Consumer View).
    3. **Mode 3:** AI Report Dashboard (Seller View).
* **Default Mode:** Start at Mode 1.
* **UI Overlay:** Show a small, semi-transparent badge in the bottom-right corner indicating the current mode (e.g., "Mode: Analysis (Shift+X to switch)").

## 2. Design System (Theme: Toss UI)

* **Keywords:** Minimalist, Friendly, Trustworthy, "Super App" feel.
* **Color Palette:**
  * Background: Light Gray (#F2F4F6)
  * Cards: White (#FFFFFF) with soft shadows (`shadow-lg`, `shadow-black/5`)
  * Primary: Vivid Blue (#3182F6) - Use for buttons and key accents.
  * Text: Dark Gray (#191F28) for headings, Muted Gray (#8B95A1) for subtitles.
* **Typography:** San Francisco / Pretendard feel. Large, bold headings. Ample whitespace.
* **Components:** Rounded corners should be generous (`rounded-2xl` or `rounded-3xl`). Interactions should have `transition-all duration-300`.

## 3. Detailed Features by Mode

### Mode 1: Analysis Simulation (The Hook)

* **Layout:** Centered search bar interface (SaaS landing style).
* **Flow:**
  1. User inputs a URL (any text) and presses "Start Analysis".
  2. **Loading Phase:** Show a compelling loading animation (e.g., a progress ring or skeletal pulse). Display changing status text every 800ms:
     * "Crawling detailed page..." -> "Analyzing image structure..." -> "Segmenting by context..."
  3. **Result Phase:**
     * Display text: "Successfully separated into [N] sections!"
     * **Animation:** Show the "separated images" fading in one by one (Staggered Fade-in).
     * **Assets:** Use elegant placeholder `div`s with gradients or icons to represent the segmented images (Do not rely on external image URLs that might break).

### Mode 2: Mobile Gated Scroll (The Interaction)

* **Layout:** Limit the content width to max 400px (Mobile Simulator) centered on the screen with a phone frame border.
* **Logic (Gated Scroll):**
  * The content is divided into 4-5 dummy sections (represented by placeholder images/content).
  * **Constraint:** The user sees only the current Section (and previous ones). Future sections are hidden and unscrollable until unlocked.
  * **Action:** At the bottom of the screen, there is an evaluation block.
  * **Evaluation Flow:**
    1. **Binary Choice:** "How was this section?" (Like / Dislike buttons).
    2. **Interval Scale (Likert):** Upon selection, slide down a set of 3 specific criteria (e.g., "Information Clarity", "Visual Appeal", "Trustworthiness") with a 1-5 rating scale inputs.
    3. **Unlock:** Upon completing the feedback for Section N, Section N+1 unlocks (blur removed). The screen auto-scrolls smoothly to the next section.
  * **Final Step:** After evaluating the last section, ask: "Would you buy this product?" (Yes / No / Maybe) before showing a "Thank you" completion screen.

### Mode 3: AI Report Dashboard (The Value)

* **Layout:** Desktop Dashboard view. Grid layout.
* **Content (Dummy Data):**
  1. **Metric Cards:** Display key metrics like "Total Views", "Predicted Conversion Rate".
  2. **Charts (Use `recharts`):**
     * **Bounce Rate Graph:** A line chart showing bounce rate dropping significantly after the "Optimization" date.
     * **Dwell Time Bar Chart:** Compare "Before" vs "After" dwell time per section.
  3. **AI Feedback Summary:** A card summarizing user feedback (e.g., "Users felt Section 2 lacked trust details").
  4. **AI Improvement Suggestion:** A highlighted card proposing a fix (e.g., "Suggestion: Add a certification badge in Section 3 to boost trust score by 15%").

## 4. Technical Constraints

* **Libraries:** `lucide-react` (icons), `recharts` (charts), `framer-motion` (standard React transition is fine if framer is too heavy, but aim for smooth CSS transitions).
* **Data:** Hardcode all dummy data (User feedback stats, graph data points, image placeholders) inside the component. Do not fetch external data.

## 5. Output Format

* generate sementic classnames with tailwindcss
* Ensure the code is bug-free and runnable immediately.