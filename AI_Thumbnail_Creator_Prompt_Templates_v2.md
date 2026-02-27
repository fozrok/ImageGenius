# AI Thumbnail Image Creator — Prompt Template System
### Version 2.0 | For use with Nano Banana AI Thumbnail Creator App

> **Purpose:** This document provides AI and the App Builder with a complete system of dynamic prompt templates, psychology frameworks, app feature logic, and quality rules for generating scroll-stopping YouTube thumbnails via Nano Banana.

---

## PART 1 — THE PSYCHOLOGY ENGINE
*These principles must be baked into the prompt refinement logic. When a user inputs their topic, AI uses this framework to select the right template, expression, and composition before building the prompt.*

---

### 1.1 — THE VIEWER PSYCHOLOGY FLOW (3-Step Decision Model)

Every thumbnail must pass all three steps. Ai's prompt assembly should check against each one.

**Step 1 — VISUAL STUN GUN**
The thumbnail must visually interrupt passive scrolling within 1–2 seconds. The viewer doesn't comprehend the full image yet — something just has to pop. This is triggered by: color contrast, a strong face/expression, a big number, unexpected imagery, or cinematic drama.

> **AI instruction:** When building a prompt, include at least one element that creates a visual stun gun effect. Choose from the Attention Triggers in Section 1.3.

**Step 2 — TITLE VALUE HUNT**
After being visually stunned, the viewer reads the title to decide if the video is worth their time. The thumbnail alone rarely gets the click — the title and thumbnail work as a package. The title triggers either a **desire loop** (educational) or an **interest loop** (entertainment).

> **AI instruction:** When the user provides their video title, AI should identify whether it's desire-based (pain point + solution) or interest-based (curiosity/question). This influences which thumbnail style and expression to use.

**Step 3 — VISUAL VALIDATION**
The viewer returns to the thumbnail to confirm the title's promise is credible. The thumbnail elements must support — not repeat — what the title says.

> **AI instruction:** Avoid prompting text in the image that repeats the title verbatim. Instead, prompt for visual elements that reinforce the feeling or transformation the title promises.

---

### 1.2 — THE DESIRE LOOP FRAMEWORK

Before generating a prompt, AI should identify which loop applies and use it to select expression, graphic elements, and text.

| Loop Type | When to Use | Core Psychology | Thumbnail Should Show |
|---|---|---|---|
| **Desire Loop** | Educational, how-to, results | Triggers a pain + offers a solution | End state or transformation visual |
| **Interest Loop** | Entertainment, story, reaction | Creates an unanswered question | Tension, curiosity gap, unresolved moment |
| **Aspiration Loop** | Motivational, mindset, coaching | I want that result | The after state — aspirational but believable |
| **Fear Loop** | Warning, mistakes, risk | Avoid a negative outcome | The "before" state showing the pain point |

---

### 1.3 — ATTENTION TRIGGERS (7 Types)

Use a **maximum of 3** in any single thumbnail. More than 3 creates visual overwhelm and reduces CTR.

| # | Trigger | How to Prompt for It | Best Loop Match |
|---|---|---|---|
| 1 | **Color Contrast** | Specify a dominant accent color that pops against the background. Use complementary contrast (orange on blue, white on black, cyan on dark). | Any |
| 2 | **Strong Face + Expression** | Include a close-up face with a specific emotion. The emotion must match what the viewer will FEEL watching the video. | Desire / Fear / Aspiration |
| 3 | **Famous / Recognizable Person** | Only include if that person features in the video. Adds instant authority and recognizability. | Interest / Desire |
| 4 | **Big Number or Dollar Figure** | Feature a large, round number in massive font. Works best for money, time, or transformation niches. | Desire / Aspiration |
| 5 | **Familiar Icon / Visual Shortcut** | Include a recognizable symbol (Bitcoin logo, platform icon, shield, brain, etc.) that triggers instant comprehension. | Desire / Interest |
| 6 | **Cinematic / Aesthetic Imagery** | Beautiful, balanced, symmetrical, or dramatic visuals. Creates a dopamine response. Requires clean composition. | Aspiration / Motivational |
| 7 | **Movement / Drama / Danger** | Show chaos, conflict, physical motion, or tension. Activates primal attention. | Fear / Interest |

---

### 1.4 — THE CURIOSITY GAP SYSTEM

The stronger the curiosity gap, the higher the click-through rate. AI should identify which gap type best fits the video topic and embed it into the visual prompt.

| Gap Type | What It Does | Visual Approach | Prompt Modifier |
|---|---|---|---|
| **Before & After** | Shows transformation story | Split screen — relatable before, aspirational after | `"Left side shows the relatable starting point. Right side shows the aspirational result. The gap between them is the story."` |
| **Challenge** | Creates tension around completion | Subject facing or overcoming an extreme situation | `"The subject faces a high-stakes challenge. The viewer wonders: did they do it?"` |
| **Contradiction** | Breaks expectations to create confusion | Visually mismatched elements that feel "wrong" | `"The image should feel slightly wrong or paradoxical — breaking the viewer's expectation to force a second look."` |
| **Novelty** | Shows something never seen before | One strange, out-of-place, or bizarre element | `"Include one bizarre or unexpected element that makes the viewer stop and ask: what am I looking at?"` |
| **Result** | Shows an end state without explaining how | The outcome is visible, the journey is hidden | `"Show the impressive end result clearly. Leave the 'how' completely out of the image."` |

---

### 1.5 — THE 3-ELEMENT RULE

**Never include more than 3 visual elements in a single thumbnail.** AI must enforce this rule in every prompt it generates.

The 3 elements are typically:
1. **Subject** (person, face, or hero object)
2. **Text** (headline — short, punchy, reinforces the title without repeating it)
3. **Graphic / Context Element** (icon, background scene, number, or device)

> **Composition tip for AI:** After assembling a prompt, count the visual elements. If more than 3 are described, remove the weakest one. Simplicity wins.

---

## PART 2 — COMPOSITION & LAYOUT SYSTEM

---

### 2.1 — THE 3 LAYOUT TYPES

| Layout | Description | Best For | Prompt Instruction |
|---|---|---|---|
| **Centered (Symmetrical)** | Main subject in the middle of frame | Big reveals, challenges, solo authority | `"Center the subject symmetrically in the frame. The composition is balanced and draws immediate focus to the center."` |
| **Offset (Asymmetrical / Rule of Thirds)** | Subject on left or right third, space for text/context on the other side | Most versatile — educational, coaching, reaction | `"Place the subject on the left (or right) third of the frame, leaving the opposite side open for context, text, or graphic elements."` |
| **Split Screen (A vs B)** | Screen divided into two contrasting halves | Comparison, before/after, transformation | `"Divide the image into two equal halves. Left side shows {{LEFT}}. Right side shows {{RIGHT}}. A visual divider separates them."` |

---

### 2.2 — COMPOSITION QUALITY RULES FOR PROMPTS

These rules must be appended to every generated prompt:

- **Rule of Thirds** — Main focal point sits on a thirds intersection, not dead center (unless Centered layout is chosen)
- **No bottom-right clutter** — Avoid placing key text or graphic elements in the bottom-right corner (covered by YouTube's timestamp overlay)
- **Mobile-first sizing** — All elements must be large enough to read on a small phone screen. No small details.
- **Shadow separation** — If a subject is placed against a busy background, prompt for shadows or shading to create visual separation
- **Color temperature** — Use green/red to signal good/bad. Use warm tones for aspiration, cool tones for tech/authority, dark backgrounds for premium

---

## PART 3 — VARIABLE SYSTEM (Updated)

---

### 3.1 — CORE INPUT VARIABLES

The app collects these from the user via AI's conversational intake:

| Variable | Description | Example |
|---|---|---|
| `{{HEADLINE}}` | Main bold text overlay | "CRYPTO BASICS" |
| `{{SUBTEXT}}` | Secondary supporting line | "Step 1 of 9" |
| `{{VIDEO_TITLE}}` | Full video title (used by AI to identify loop type) | "How I Made $10K With Bitcoin in 30 Days" |
| `{{TOPIC}}` | Subject matter of the video | "Bitcoin wallets" |
| `{{NICHE}}` | Broader industry | "Crypto education" |
| `{{DESIRE_LOOP}}` | Desire or Interest loop (AI identifies this) | "desire" |
| `{{CURIOSITY_GAP_TYPE}}` | Which gap type applies (AI selects) | "before_after" |
| `{{SUBJECT_TYPE}}` | Who appears | "woman", "couple", "man", "no people" |
| `{{SUBJECT_AGE}}` | Age range | "30–40-year-old" |
| `{{EXPRESSION}}` | Face emotion (AI selects from library) | "wide-eyed and surprised" |
| `{{DEVICE}}` | Device shown | "phone", "tablet", "laptop" |
| `{{ACCENT_COLOR}}` | Primary glow/accent | "magenta", "cyan (#219da0)", "gold" |
| `{{BACKGROUND_COLOR}}` | Background base | "deep black (#001213)" |
| `{{LAYOUT_TYPE}}` | Composition layout | "centered", "offset", "split_screen" |
| `{{ATTENTION_TRIGGERS}}` | Up to 3 selected triggers | "color contrast, strong face, big number" |
| `{{ELEMENT_1}}` | First visual element | "30-year-old woman with shocked expression" |
| `{{ELEMENT_2}}` | Second visual element | "glowing Bitcoin chart on phone" |
| `{{ELEMENT_3}}` | Third visual element | `"bold white text: TRADING OR GUESSING"` |
| `{{STYLE_TAG}}` | Render style | "Realistic", "3D", "Design" |
| `{{BRAND_COLOR_HEX}}` | Brand hex | "#219da0" |
| `{{ASPECT_RATIO}}` | Always 16:9 | "16:9" |

---

### 3.2 — AI'S INTAKE QUESTIONS (App Conversation Flow)

When a user starts a new thumbnail, AI asks these questions in sequence:

```
Q1: What is your video title?
Q2: What is the main topic or niche?
Q3: Who is the target audience — beginner, intermediate, or expert?
Q4: What do you want the viewer to FEEL when they see this thumbnail?
     Options: Curious / Shocked / Inspired / Concerned / Excited / Confident
Q5: Do you want a person in the image?
     Options: Yes — Woman / Yes — Man / Yes — Couple / No — Symbolic only
Q6: Do you have brand colors? (Optional — or choose a preset)
Q7: Any specific text you want on the thumbnail? (Headline + subtext)
```

AI then automatically selects: Loop type, Curiosity gap, Attention triggers (max 3), Expression, Layout, and Template — and assembles the full prompt.

---

## PART 4 — VISUAL STYLE LIBRARY (5 Core Templates)

---

### STYLE 1 — PERSON + GLOWING DEVICE
**Best for:** Education, how-to, tutorials, coaching, crypto
**Psychology triggers:** Strong face, familiar icon, color contrast
**Loops:** Desire, Aspiration

```
A digital art photographic-style promotional poster thumbnail featuring a confident {{SUBJECT_AGE}} {{SUBJECT_TYPE}} illuminated by the glow of a {{TOPIC}} app on their {{DEVICE}}. The back of the {{DEVICE}} faces the camera. They have a {{EXPRESSION}} expression, eyes directed toward the screen. Around them are subtle animated {{TOPIC_ICONS}} in {{ACCENT_COLOR}}. The background is {{BACKGROUND_COLOR}}, intensifying the vibrant {{ACCENT_COLOR}} accents and allowing the {{DEVICE}} glow to take center stage. Bold white headline "{{HEADLINE}}" is positioned above the subject using the Rule of Thirds, with {{ACCENT_COLOR}} subtext "{{SUBTEXT}}" displayed below. Soft, diffused cinematic lighting accentuates their face and the {{DEVICE}} screen. No key elements in the bottom-right corner. All text large enough to read on a mobile screen. {{STYLE_TAG}} style, 16:9 aspect ratio, 1920x1080 resolution.
```

---

### STYLE 2 — COUPLE + GLOWING DEVICE
**Best for:** Financial education, lifestyle, beginner audiences, relationship-led offers
**Psychology triggers:** Strong face (×2), color contrast, familiar icon
**Loops:** Desire, Aspiration

```
A digital art photographic-style promotional poster thumbnail featuring a {{SUBJECT_AGE}} couple sitting together, looking at a {{DEVICE}}, the screen glowing with a {{TOPIC}} app. The back of the {{DEVICE}} faces the camera. They appear engaged and collaborative, sharing a quiet, reassuring smile. {{BACKGROUND_COLOR}} background with {{ACCENT_COLOR}} accents. Bold white headline above says "{{HEADLINE}}," with {{ACCENT_COLOR}} subtext below reading "{{SUBTEXT}}." Composition places the couple left-of-center, leaving space for the headline on the right. Cinematic, soft lighting enhances their expressions. All text large enough to read at thumbnail size. {{STYLE_TAG}} style, 16:9 aspect ratio.
```

---

### STYLE 3 — SPLIT SCREEN / COMPARISON
**Best for:** Before/After, VS comparisons, transformation stories
**Psychology triggers:** Color contrast, curiosity gap (before/after or contradiction)
**Loops:** Desire (transformation), Fear (avoid the bad side)

```
A cinematic digital art photographic-style thumbnail with a dramatic split-screen design. On the left: {{LEFT_SIDE_DESCRIPTION}}, lit in {{LEFT_COLOR}} tones, representing {{LEFT_CONCEPT}} — the relatable starting point viewers recognise as their current situation. On the right: {{RIGHT_SIDE_DESCRIPTION}} glowing in {{RIGHT_COLOR}} and {{ACCENT_COLOR}}, representing {{RIGHT_CONCEPT}} — the aspirational result they desire. A bold glowing "{{CENTER_TEXT}}" sits in the center with subtle directional arrows. The {{BACKGROUND_COLOR}} background unifies the two halves. Bold white headline above: "{{HEADLINE}}." The left side should feel familiar and slightly uncomfortable. The right side should feel exciting and desirable. Cinematic lighting. 16:9 aspect ratio.
```

**CENTER_TEXT options:** `VS` / `OR` / `→` / `BEFORE / AFTER` / `OLD / NEW`

---

### STYLE 4 — BIG NUMBER / STAT REVEAL
**Best for:** Money, growth, results, transformation milestones
**Psychology triggers:** Big number, strong face, color contrast
**Loops:** Desire, Aspiration, Interest

```
A bold, high-contrast digital art photographic-style YouTube thumbnail. A massive "{{BIG_NUMBER}}" dominates the center of the image in {{ACCENT_COLOR}} typographic styling, large enough to immediately draw the eye. A {{SUBJECT_AGE}} {{SUBJECT_TYPE}} appears {{POSITION}} (pointing at / reacting to / standing beside) the number with a {{EXPRESSION}} expression. The background is {{BACKGROUND_COLOR}} with subtle contextual elements reinforcing {{TOPIC}}. Bold white headline "{{HEADLINE}}" above. The number is the hero element — everything else supports it. Cinematic lighting with strong color contrast. All elements large enough to read on mobile. 16:9 aspect ratio.
```

**POSITION options:** `to the left pointing right` / `below looking up` / `to the right with arms open`

---

### STYLE 5 — CINEMATIC ASPIRATIONAL CHARACTER
**Best for:** Summit promos, lead generation, empowerment, bold offers, coaching
**Psychology triggers:** Strong face, cinematic aesthetics, color contrast
**Loops:** Aspiration, Desire

```
A dynamic YouTube thumbnail showcasing a powerful, cinematic scene. A confident {{SUBJECT_AGE}} {{SUBJECT_TYPE}} stands center-frame in {{ATTIRE}}, bathed in dramatic {{ACCENT_COLOR}} lighting. Their expression conveys {{EXPRESSION}}. The background is {{BACKGROUND_COLOR}} with light sparks, energy lines, and subtle {{TOPIC}} symbolic elements in {{ACCENT_COLOR}} and gold. Bold white headline "{{HEADLINE}}" sits above in large font. "{{SUBTEXT}}" in smaller {{ACCENT_COLOR}} font below, styled like a premium event or blockbuster movie poster. The overall aesthetic is cinematic, inspiring, and designed to immediately communicate {{PROMISE}}. Three elements max. 16:9 aspect ratio.
```

---

### STYLE 6 — SYMBOLIC / CONCEPTUAL (No People)
**Best for:** Abstract topics, mindset, aviation, tech, motivational content
**Psychology triggers:** Cinematic aesthetics, novelty, color contrast
**Loops:** Interest, Aspiration

```
A {{ATMOSPHERE}} digital art thumbnail representing the concept of "{{CONCEPT}}". The composition is centered around {{PRIMARY_VISUAL}}, which symbolises {{MEANING}}. {{SECONDARY_VISUAL}} adds depth and reinforces the theme without cluttering the frame. The background is {{BACKGROUND_COLOR}} with {{ACCENT_COLOR}} accent lighting. No text or typography in the image — the visual tells the entire story. The composition is clean, with a maximum of 3 visual elements. Cinematic lighting creates a {{MOOD}} mood. The image must be immediately comprehensible within 2 seconds. 16:9 aspect ratio.
```

---

### STYLE 7 — CONTRADICTION / NOVELTY (Pattern Interrupt)
**Best for:** Opinions, controversial takes, pattern-break content, viral hooks
**Psychology triggers:** Contradiction, novelty, movement/drama
**Loops:** Interest, Fear

```
A striking digital art photographic-style thumbnail that breaks visual expectations. The image features {{SUBJECT}} in an unexpected context — something that immediately makes the viewer think "wait, what?" The visual contradiction is: {{CONTRADICTION_DESCRIPTION}}. This creates a mental puzzle the viewer must click to resolve. The scene uses {{BACKGROUND_COLOR}} background with {{ACCENT_COLOR}} accent elements. Bold white headline "{{HEADLINE}}" above — short, punchy, adds to the contradiction rather than explaining it. Maximum 3 elements. Cinematic lighting. 16:9 aspect ratio.
```

---

## PART 5 — NICHE PROMPT LIBRARIES

Pre-built prompts with psychology and variables baked in. The app uses these as starting points and AI refines based on user inputs.

---

### NICHE A — CRYPTO / ZIONIX GLOBAL
**Brand colors:** `#219da0` (cyan), `#001213` (dark), `#FFFFFF` (white)
**Primary loops:** Desire (beginner education), Aspiration (results/mindset)

#### A1 — Beginner Education
*Attention triggers: Strong face + Color contrast + Familiar icon*
```
A digital art photographic-style promotional poster thumbnail featuring a confident 30–40-year-old woman illuminated by the glow of a Bitcoin basics app on her phone. The back of the phone faces the camera. She has a curious and engaged expression — warm and approachable, suggesting this is more accessible than viewers expect. Subtle animated cryptocurrency symbols in cyan (#219da0) float around the device. Deep black (#001213) background intensifies the vibrant cyan accents. Bold white headline "{{HEADLINE}}" above using offset (Rule of Thirds) composition. Cyan subtext "{{SUBTEXT}}" below. Soft, diffused cinematic lighting. No elements in the bottom-right corner. Realistic style, 16:9 aspect ratio.
```

#### A2 — Crypto Couple (Relatability First)
*Attention triggers: Strong face (×2) + Color contrast + Familiar icon*
```
A digital art photographic-style promotional poster thumbnail featuring a 30–40-year-old couple sitting together, looking at a tablet, the screen glowing with a {{TOPIC}} app. The back of the tablet faces the camera. They appear engaged and collaborative, sharing a quiet, reassuring smile — conveying that crypto is for both of them, not just experts. Deep black background with cyan (#219da0) accents. Bold white headline above says "{{HEADLINE}}," with cyan subtext below reading "{{SUBTEXT}}." Centered composition. Cinematic, soft lighting. Realistic style, 16:9 aspect ratio.
```

#### A3 — Fiat vs Crypto (Comparison)
*Curiosity gap: Before/After | Attention triggers: Color contrast + Familiar icon*
```
A cinematic digital art photographic-style thumbnail with a split-screen design. On the left: glowing stacks of US dollar bills lit in traditional green tones — familiar, slightly tired, representing the old way. On the right: a radiant golden Bitcoin and digital network nodes glowing in cyan (#219da0) and orange — vibrant and forward-looking, representing the new way. A bold glowing "VS" sits in the center with subtle arrows. Deep black (#001213) background. Bold white headline above: "{{HEADLINE}}." Left side feels slightly uncomfortable (the familiar problem). Right side feels exciting (the desired solution). Cinematic lighting. Realistic style, 16:9 aspect ratio.
```

#### A4 — Jargon / Terms (Floating Text)
*Curiosity gap: Novelty | Attention triggers: Color contrast + Familiar icons + Big text*
```
A digital art photographic-style thumbnail featuring a confident 30–40-year-old woman holding a glowing smartphone. She has a slightly puzzled but curious expression — "I didn't know all this either." Around her, floating holographic text bubbles display bold crypto terms: "DeFi," "HODL," "Blockchain," "Staking," "Wallet" — each illuminated in cyan (#219da0) and gold. Deep black background. Offset composition — subject left, floating terms fill the right. Bold white headline above: "{{HEADLINE}}." Soft, diffused lighting. Realistic style, 16:9 aspect ratio.
```

#### A5 — Chart / Technical Analysis
*Attention triggers: Strong face + Cinematic aesthetics + Familiar icon*
```
A digital art photographic-style thumbnail featuring a focused 30–40-year-old woman studying her phone glowing with neon-green candlestick chart graphics. The back of the phone faces the viewer. She has an intent, analytical expression — confident and in control, not overwhelmed. Deep black background with vibrant green and cyan (#219da0) accents. Offset composition. Bold white headline above: "{{HEADLINE}}." Cyan subtext: "{{SUBTEXT}}." Soft, diffused cinematic lighting. Realistic style, 16:9 aspect ratio.
```

#### A6 — Risk / Protection
*Curiosity gap: Fear loop | Attention triggers: Strong face + Familiar icon (shield) + Color contrast*
```
A digital art photographic-style thumbnail featuring a 30–40-year-old woman with a slightly concerned but composed expression — she knows something the viewer doesn't. In front of her, a glowing shield icon in cyan (#219da0) and gold represents protection. Subtle warning triangle elements and percentage symbols float in the dark background. Offset composition — subject right, shield left. Deep black background. Bold white headline above: "{{HEADLINE}}." Cinematic lighting that emphasises seriousness and trust. Realistic style, 16:9 aspect ratio.
```

---

### NICHE B — HYPNOTHERAPY / COACHING
**Recommended colors:** Deep black, magenta `#d63384`, purple `#7b2fbe`, white, gold
**Primary loops:** Desire (transformation), Aspiration (the after state)

#### B1 — Professional Authority
*Attention triggers: Strong face + Color contrast + Cinematic aesthetics*
```
A digital art photographic-style promotional poster thumbnail featuring a confident 30–40-year-old woman projecting calm authority. Her expression is warm yet professional — the face of someone who has seen transformation happen many times. Subtle animated symbols representing {{TOPIC_ICONS}} glow in magenta (#d63384) around her. Deep black background with magenta and purple accents. Offset composition — subject right third, headline space left. Bold white headline "{{HEADLINE}}" above. Magenta subtext "{{SUBTEXT}}" below. Soft, cinematic lighting. Realistic style, 16:9 aspect ratio.
```

#### B2 — Transformation (Before & After)
*Curiosity gap: Before/After | Attention triggers: Strong face + Color contrast*
```
A cinematic digital art photographic-style thumbnail with a split-screen transformation design. On the left: a subdued, dimly lit figure looking uncertain — the relatable "before" state that represents {{LEFT_CONCEPT}}. Viewers should recognise themselves in this side. On the right: the same figure type glowing with vibrant energy, confidence, and clarity, illuminated by magenta (#d63384) and gold — the aspirational "after" representing {{RIGHT_CONCEPT}}. Deep black background. Bold white headline above: "{{HEADLINE}}." The left side must feel honest, not exaggerated. The right side should feel genuinely achievable. Cinematic lighting. Realistic style, 16:9 aspect ratio.
```

#### B3 — Mindset / Brain Concept
*Curiosity gap: Novelty | Attention triggers: Cinematic aesthetics + Familiar icon (brain) + Color contrast*
```
A cinematic digital art photographic-style thumbnail featuring a serene 30–40-year-old woman in profile. A radiant, glowing brain silhouette with neural connection lines in magenta (#d63384) and purple emanates from her head. Subtle {{TOPIC_ICONS}} float in the light — suggesting inner transformation. Deep black background with magenta and gold accents. Centered composition. Bold white headline "{{HEADLINE}}" above. Magenta subtext "{{SUBTEXT}}" below. Soft, diffused cinematic lighting — empowering and introspective. Realistic style, 16:9 aspect ratio.
```

#### B4 — Summit / Event Promo
*Attention triggers: Strong face + Cinematic aesthetics + Color contrast | Loop: Aspiration*
```
A dynamic cinematic YouTube thumbnail for a live event promotion. A confident 30–40-year-old woman in smart professional attire stands center-frame, arms open and welcoming, surrounded by glowing energy lines and subtle hypnotic spiral elements in magenta (#d63384) and gold. The background is deep black fading to dark purple with digital light sparks. Bold white headline "{{HEADLINE}}" above in large font. "{{SUBTEXT}}" in magenta below, styled like a premium event poster. The overall aesthetic communicates transformation, authority, and urgency. Centered composition. Cinematic, inspiring. Realistic style, 16:9 aspect ratio.
```

---

### NICHE C — MOTIVATIONAL / SOCIAL MEDIA CONTENT
**Recommended colors:** Warm amber, terracotta, deep navy, or brand-matched
**Primary loops:** Aspiration, Interest

#### C1 — Story-Based / Lesson
*Curiosity gap: Result | Attention triggers: Cinematic aesthetics + Color contrast*
```
A vibrant digital art photographic-style thumbnail representing the concept of "{{CONCEPT}}". The scene features {{PRIMARY_VISUAL}} set against a {{BACKGROUND_COLOR}} background with {{ACCENT_COLOR}} accents. Offset composition balances the visual with space for the headline. Bold white headline "{{HEADLINE}}" is prominently positioned. The image tells a story that creates a curiosity gap — the viewer can see the result but not the journey. Warm, uplifting cinematic lighting. All elements are large enough to read on mobile. {{STYLE_TAG}} style, 16:9 aspect ratio.
```

#### C2 — Big Number / Stat
*Attention triggers: Big number + Strong face + Color contrast | Loop: Desire/Aspiration*
```
A bold, high-contrast digital art photographic-style thumbnail. The number "{{BIG_NUMBER}}" dominates the frame in massive {{ACCENT_COLOR}} typography — immediately arresting. A {{SUBJECT_AGE}} {{SUBJECT_TYPE}} appears to the left with a {{EXPRESSION}} expression, pointing toward or reacting to the number. {{BACKGROUND_COLOR}} background with subtle contextual elements reinforcing {{TOPIC}}. Bold white headline "{{HEADLINE}}" above — short, punchy, and designed to deepen the curiosity gap created by the number. Maximum 3 elements. Cinematic lighting. 16:9 aspect ratio.
```

---

### NICHE D — AVIATION / PILOT APP (No People, No Uniforms)
**Recommended colors:** Deep navy, sky blue, instrument amber, white
**Primary loops:** Interest, Aspiration

#### D1 — Cockpit / Atmosphere
```
An inspiring cockpit interior view from inside a commercial airplane during {{TIME_OF_DAY}}. Instruments glow with warm amber light. The windshield frames a {{SKY_DESCRIPTION}} sky — {{MOOD_DESCRIPTION}}. No pilot or uniform visible. The scene communicates {{CONCEPT}} through atmosphere alone. Cinematic lighting, realistic detail. No text in the image. 16:9 aspect ratio.
```

**TIME_OF_DAY options:** `golden hour sunrise` / `clear midday` / `stormy night` / `dramatic sunset`
**SKY_DESCRIPTION options:** `serene blue with scattered clouds` / `turbulent storm-filled` / `vivid orange sunrise`

#### D2 — Brain + Aviation (Conceptual)
```
A conceptual digital art image of a glowing human brain with electric neural connections in {{ACCENT_COLOR}}, subtly shaped like a jet engine, floating above a cloudscape with an airliner flying below in perspective. Symbolises the fusion of {{LEFT_CONCEPT}} and {{RIGHT_CONCEPT}}. Deep navy background. No text. Cinematic and symbolic. Maximum 3 visual elements. {{STYLE_TAG}} style, 16:9 aspect ratio.
```

#### D3 — Dual State (Clear vs Turbulent)
```
A split-scene composition showing a commercial jet flying smoothly through a clear sky on one side, and navigating dark storm clouds with visible turbulence on the other. The contrast visually represents {{LEFT_CONCEPT}} (calm) versus {{RIGHT_CONCEPT}} (stress). No text. No uniform or pilot visible. Design style, 16:9 aspect ratio.
```

---

## PART 6 — STYLE SELECTOR MENU

The app presents this to users. Each option maps to a prompt modifier AI appends.

| # | Style Name | What It Does | Prompt Modifier |
|---|---|---|---|
| 1 | **Shocking / Unexpected** | Pattern interrupt — stops the scroll | `"The visual should be unexpected and slightly shocking, designed to trigger a double-take and force active attention from passive scrollers."` |
| 2 | **Big Number Reveal** | Creates instant comprehension of scale | `"Feature a large, bold number as the dominant visual hero — sized to immediately communicate scale and trigger curiosity about how."` |
| 3 | **Minimalist / Eye-Catching** | Clean, premium, high-contrast | `"The design is clean, minimal, and high-contrast. Every element earns its place. Nothing decorative. The simplicity IS the visual stun."` |
| 4 | **Big vs Small Comparison** | Size contrast tells a story instantly | `"Use dramatic size contrast as the primary storytelling device — one element towers over the other to imply scale, transformation, or power shift."` |
| 5 | **Before vs After** | Transformation story in one image | `"Split-screen: left shows the relatable, uncomfortable before state. Right shows the exciting, aspirational after state. The gap between them is the hook."` |
| 6 | **Blurred Background / Intrigue** | Creates curiosity via partial reveal | `"Keep the foreground subject sharp and vivid. Blur background elements just enough to create intrigue — visible but not fully readable."` |
| 7 | **Contradiction / Pattern Break** | Makes viewers stop and say "wait, what?" | `"Include a visual element that breaks expectations — something that feels slightly wrong or paradoxical, forcing the brain to seek resolution by clicking."` |

---

## PART 7 — REFERENCE LIBRARIES

---

### 7.1 — EXPRESSION LIBRARY

*AI selects the expression based on the viewer's intended emotional response.*

| Video Intent | Emotion Viewer Should Feel | Expression to Prompt |
|---|---|---|
| Educational / How-To | Curious, capable | `"curious and engaged — warm and approachable, suggesting the topic is more accessible than expected"` |
| Shocking Reveal / Stat | Surprised, compelled | `"wide-eyed and genuinely surprised — not theatrical, but authentically caught off-guard"` |
| Motivational | Inspired, energised | `"quietly confident and inspired — radiating the feeling of someone who has already made the transformation"` |
| Problem / Warning | Concerned, alert | `"slightly concerned but composed — the face of someone who knows something the viewer doesn't"` |
| Authority / Expert | Trusted, credible | `"calm, assured, and professional — projecting quiet competence rather than loud confidence"` |
| Relatable Beginner | Safe, approachable | `"friendly and approachable, with a hint of curiosity — conveying that if they can figure this out, so can the viewer"` |
| Transformation Result | Aspirational, joyful | `"radiating quiet, earned confidence — the expression of someone who has come out the other side"` |
| Challenge / Tension | Determined, intense | `"focused and determined, jaw set — the face of someone mid-challenge who has not given up"` |

---

### 7.2 — COLOR SCHEME PRESETS

| Preset | Background | Accent | Text | Emotional Register |
|---|---|---|---|---|
| Zionix Global | `#001213` deep black | `#219da0` cyan | White | Educational, modern, trustworthy |
| Hypno Magenta | `#0a0010` deep black-purple | `#d63384` magenta | White | Transformational, clinical, bold |
| Gold Authority | `#0d0d0d` near black | `#c9a84c` gold | White | Premium, high-value, expert |
| Power Red | `#0a0000` near black | `#e63946` red | White | Urgent, bold, pattern-breaking |
| Calm Purple | `#0f0020` dark purple | `#7b2fbe` purple | White | Mindful, therapeutic, introspective |
| Clean White | `#ffffff` white | `#1a1a2e` dark navy | Dark | Professional, minimal, trustworthy |
| Warm Amber | `#1a0f00` dark brown | `#f4a261` amber | White | Motivational, story-based, human |

**Color psychology rules AI must apply:**
- Use **green** to signal good / positive outcomes
- Use **red** to signal bad / warning / pain point
- Use **warm tones** (amber, gold) for aspiration and human connection
- Use **cool tones** (cyan, blue) for technology, authority, and trust
- Ensure **thumbnail contrast works on both dark mode and light mode** — dark backgrounds with bright accents perform on both

---

### 7.3 — TOPIC ICON LIBRARY

*Use in the {{TOPIC_ICONS}} variable to populate contextual floating elements.*

| Niche | Icon Set |
|---|---|
| Crypto / Bitcoin | `Bitcoin symbol, Ethereum logo, blockchain nodes, candlestick charts, wallet icons, padlock` |
| Coaching / Hypnotherapy | `brain silhouette, spiral, neural connections, light bulb, ascending stairs, puzzle pieces` |
| Marketing / Business | `email envelopes, funnel, magnifying glass, growth arrows, dollar signs, checklist` |
| Aviation | `cockpit instruments, clouds, horizon line, flight path arcs, compass` |
| Mindset / Motivation | `growth arrows, sunrise, mountain peak, stepping stones, open book, spark` |

---

## PART 8 — UNIVERSAL QUALITY MODIFIERS

Append to every generated prompt before sending to Nano Banana.

```
Soft, diffused cinematic lighting. {{LAYOUT_TYPE}} composition using the Rule of Thirds. No key visual elements in the bottom-right corner (reserved for YouTube timestamp overlay). All text and graphic elements large enough to read clearly on a mobile phone screen at thumbnail size. Maximum 3 visual elements in the frame. High detail, photorealistic quality. The overall aesthetic is eye-catching, modern, and designed to maximise click-through rate. 16:9 aspect ratio, 1920x1080 resolution.
```

---

## PART 9 — AI'S PROMPT ASSEMBLY LOGIC

*This is the decision tree AI follows internally before generating the final prompt to send to Nano Banana.*

```
STEP 1 — INTAKE
  Collect: Video title, topic, niche, desired viewer emotion, subject preference, brand colors, headline text

STEP 2 — PSYCHOLOGY CLASSIFICATION
  → Identify loop type: Desire / Interest / Aspiration / Fear
  → Select curiosity gap type: Before/After / Challenge / Contradiction / Novelty / Result
  → Select up to 3 attention triggers from the 7-trigger library

STEP 3 — TEMPLATE SELECTION
  → Route to Niche Library if niche matches (A/B/C/D)
  → Otherwise select from 7 core Style templates based on loop + gap type

STEP 4 — ELEMENT SELECTION (3-Element Rule)
  → Element 1: Subject (person/face/hero object)
  → Element 2: Context visual (device, icon, scene, number)
  → Element 3: Text overlay or graphic accent
  → VERIFY: Are there more than 3 elements? If yes — remove the weakest.

STEP 5 — EXPRESSION SELECTION
  → Map viewer's intended emotion to Expression Library
  → If no person: skip

STEP 6 — LAYOUT SELECTION
  → Centered: for big reveals, challenges, authority
  → Offset: for education, coaching, reaction (most common)
  → Split Screen: for comparison/transformation only

STEP 7 — COLOUR ASSIGNMENT
  → Apply brand preset or user-specified hex
  → Check: does contrast work on dark mode AND light mode?
  → Apply color psychology rules (green = good, red = bad)

STEP 8 — PROMPT ASSEMBLY
  → Fill all {{VARIABLES}} into selected template
  → Append Universal Quality Modifiers (Part 8)
  → Check: No bottom-right clutter, all elements mobile-readable

STEP 9 — PRE-SEND CHECK (2-Second Test)
  → Would the key message of this thumbnail be visible in 2 seconds?
  → If no — simplify. Remove one element. Increase size of hero element.

STEP 10 — GENERATE
  → Send final prompt to Nano Banana
  → Generate 3 variations (different layouts/expressions) for user to compare
```

---

## PART 10 — APP FEATURE RECOMMENDATIONS

*Features AI's analysis of the transcripts suggests building into the Nano Banana Thumbnail App.*

---

### FEATURE 1 — DESIRE LOOP DETECTOR
AI analyses the user's video title and automatically classifies it as Desire or Interest loop, then selects the matching psychological template. User sees the classification and can override it.

---

### FEATURE 2 — 3-VARIATION GENERATOR
Every prompt generation produces 3 variations automatically:
- **Variation A** — Offset composition (asymmetrical)
- **Variation B** — Centered composition (symmetrical)
- **Variation C** — Split screen (if applicable to the topic)

This mirrors how top creators test multiple thumbnails and let the market decide.

---

### FEATURE 3 — CURIOSITY GAP SELECTOR
The app presents the 5 curiosity gap types as a visual menu with examples. User selects one and AI builds the prompt architecture around it.

---

### FEATURE 4 — EXPRESSION PICKER
A visual grid of 8 face expressions mapped to emotional intent. User selects the feeling they want the viewer to experience. AI maps this to the correct expression prompt language.

---

### FEATURE 5 — 2-SECOND TEST PROMPT
Before finalising, AI runs an internal check: "Would the core message of this thumbnail be visible in under 2 seconds?" If not, the prompt is simplified automatically.

---

### FEATURE 6 — DARK MODE / LIGHT MODE CONTRAST CHECK
AI verifies that the selected color scheme creates adequate contrast on both dark and light backgrounds before sending to Nano Banana, since 75% of YouTube viewers use dark mode.

---

### FEATURE 7 — TEMPLATE MEMORY / SWIPE FILE
Users can save generated prompts as named templates (e.g., "Zionix Beginner Woman" or "Hypno Summit Promo"). Future thumbnails can be generated by modifying the saved template — changing only the headline, subtext, and topic while keeping the proven visual formula intact. This enables mass production of consistent, on-brand thumbnails.

---

### FEATURE 8 — REFERENCE IMAGE UPLOAD + STYLE MATCH
User uploads an existing thumbnail they love. AI analyses it (or takes a description) and reverse-engineers a prompt template that matches the visual style. This matches the "learn from what's already working" approach.

---

### FEATURE 9 — YOUTUBE TITLE + THUMBNAIL PACKAGE CHECKER
AI evaluates whether the thumbnail and title work as a package:
- Do they complement each other without repeating each other?
- Does the thumbnail support the title's promise visually?
- Would the combination pass the psychology 3-step flow?

Outputs a brief 3-point report with suggested improvements before generating.

---

## PART 11 — FULLY ASSEMBLED PROMPT EXAMPLES

Ready-to-generate prompts with all variables resolved and quality modifiers appended.

---

**EXAMPLE 1 — Crypto Basics (Zionix, Desire Loop, Offset)**
```
A digital art photographic-style promotional poster thumbnail featuring a confident 30–40-year-old woman illuminated by the glow of a Bitcoin basics app on her phone. The back of the phone faces the camera. She has a curious and engaged expression — warm and approachable, suggesting this is more accessible than viewers expect. Subtle animated cryptocurrency symbols in cyan (#219da0) float gently around the device. Deep black (#001213) background intensifies the vibrant cyan accents. Offset composition — subject on left third, headline space on right. Bold white headline "CRYPTO BASICS" above. Cyan subtext "Step 1 of 9" below. No elements in the bottom-right corner. All text large enough to read on mobile. Soft, diffused cinematic lighting. Realistic style, 16:9 aspect ratio, 1920x1080.
```

---

**EXAMPLE 2 — Fiat vs Crypto (Zionix, Before/After Gap, Split Screen)**
```
A cinematic digital art photographic-style thumbnail with a split-screen design. On the left: glowing stacks of US dollar bills lit in tired, traditional green — the familiar, slightly frustrating old way. On the right: a radiant golden Bitcoin and digital network nodes glowing in cyan (#219da0) and orange — vibrant and exciting, representing the new opportunity. A bold glowing "VS" sits dead center. Deep black (#001213) background. Bold white headline above: "FIAT VS CRYPTO." The left side feels slightly uncomfortable (the problem). The right side feels exciting (the solution). Maximum 3 elements. Cinematic lighting. Realistic style, 16:9 aspect ratio, 1920x1080.
```

---

**EXAMPLE 3 — AI Coaching Summit (Hypno, Aspiration Loop, Centered)**
```
A dynamic cinematic YouTube thumbnail for a live event. A confident 30–40-year-old woman in smart professional attire stands center-frame, arms open and welcoming, surrounded by glowing energy lines and subtle hypnotic spiral elements in magenta (#d63384) and gold. Deep black background fading to dark purple with digital light sparks. Bold white headline "AI COACHING & HYPNOSIS SUMMIT" above in large font. "MARCH 28–29" in magenta below, styled like a premium event poster. Centered composition. Cinematic, aspirational, communicates transformation and authority. Realistic style, 16:9 aspect ratio, 1920x1080.
```

---

**EXAMPLE 4 — Crypto Mindset (Zionix, Novelty Gap, Offset)**
```
A cinematic digital art photographic-style thumbnail featuring a serene 30–40-year-old woman in profile. A radiant, glowing brain silhouette with neural connection lines in cyan (#219da0) and gold emanates from her head. Inside the brain, Bitcoin symbols, growth arrows, and puzzle pieces float — suggesting inner transformation and strategic thinking. Deep black (#001213) background with cyan and gold accent lighting. Offset composition. Bold white headline "CRYPTO MINDSET" above. Cyan subtext "Think Like a Trader" below. Soft, diffused cinematic lighting — inspiring and forward-looking. No elements in bottom-right corner. Realistic style, 16:9 aspect ratio, 1920x1080.
```

---

**EXAMPLE 5 — Make More. Fail Forward. (Motivational, Before/After, Split Screen)**
```
A vibrant digital art photographic-style thumbnail with a split-screen design. On the left: one person hunched over a single clay pot under a harsh spotlight — the relatable tension of perfectionism, slightly uncomfortable to look at. On the right: several people joyfully working with many clay pots of different shapes and sizes — full of energy, warmth, and creative freedom. Warm amber and terracotta tones with deep brown background. Bold white headline "MAKE MORE. FAIL FORWARD." centered above both scenes. The left side should feel tense and familiar. The right side should feel liberating and aspirational. The gap between them is the story. Cinematic lighting. Realistic style, 16:9 aspect ratio, 1920x1080.
```

---

**EXAMPLE 6 — Aviation Mental Challenges (Symbolic, Interest Loop, Split Scene)**
```
A conceptual cinematic digital art thumbnail. Split composition: on the left, a commercial jet gliding smoothly through clear sky — serene, controlled, precise. On the right, the same jet navigating dark, churning storm clouds with visible turbulence and lightning — tense, uncertain, overwhelming. No pilot, no uniform, no text visible. The contrast represents the dual mental states of clarity versus psychological turbulence in aviation. Deep navy background with instrument-amber accent lighting. Maximum 3 visual elements. The image must communicate its story within 2 seconds. Realistic style, 16:9 aspect ratio, 1920x1080.
```

---

*Document Version: 2.0 | Developed for Nano Banana AI Thumbnail Creator App | AI Prompt Engine*
