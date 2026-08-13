---
name: Capy-Heritage Kitchen
colors:
  surface: '#f5fced'
  surface-dim: '#d5dcce'
  surface-bright: '#f5fced'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff6e7'
  surface-container: '#e9f0e1'
  surface-container-high: '#e3ebdc'
  surface-container-highest: '#dee5d6'
  on-surface: '#171d14'
  on-surface-variant: '#41493e'
  inverse-surface: '#2c3228'
  inverse-on-surface: '#ecf3e4'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#3e6a00'
  on-secondary: '#ffffff'
  secondary-container: '#b9f474'
  on-secondary-container: '#437000'
  tertiary: '#4c3700'
  on-tertiary: '#ffffff'
  tertiary-container: '#694d00'
  on-tertiary-container: '#f8bb00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#b9f474'
  secondary-fixed-dim: '#9ed75b'
  on-secondary-fixed: '#0f2000'
  on-secondary-fixed-variant: '#2e4f00'
  tertiary-fixed: '#ffdf9e'
  tertiary-fixed-dim: '#fabd00'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#f5fced'
  on-background: '#171d14'
  surface-variant: '#dee5d6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality is a harmonious blend of traditional Italian hospitality and the chill, sociable nature of the capybara mascot. The target audience includes local families, Gen Z foodies, and capybara enthusiasts who value high-quality, artisanal food served with a side of whimsy.

The design style is **Corporate Modern with a Playful Twist**. It utilizes the structural clarity and high legibility of modern SaaS design but softens the edges with a warm, organic color palette and rounded geometry. This approach ensures the brand feels professional and reliable (essential for food safety and e-commerce) while remaining deeply approachable and charming. The UI should evoke a sense of calm, freshness, and culinary delight.

## Colors

The palette is derived directly from the lush, earthy tones of the logo and Italian ingredients like basil and olive oil.

- **Primary (#1B5E20):** A deep forest green used for high-emphasis elements, primary buttons, and core typography. It provides the necessary "bite" and authority.
- **Secondary (#8BC34A):** A bright, herbaceous green for success states, secondary accents, and subtle highlighting.
- **Tertiary (#FFC107):** A warm honey-gold to represent the crust and cheese, used sparingly for call-to-actions (CTAs) that need to pop against the green.
- **Neutral (#F1F8E9):** A very light, creamy mint-green used for page backgrounds and large surface areas to reduce visual fatigue and maintain a "fresh" feel.

The color mode is strictly light to maintain the appetizing, clean aesthetic required for a food-based service.

## Typography

The typography strategy balances professionalism with friendliness. 

**Plus Jakarta Sans** is used for headlines. Its soft curves and modern geometry mirror the friendly character of the mascot while remaining highly legible and premium. 

**Be Vietnam Pro** is used for body copy and labels. It offers a contemporary, clean look that handles information-dense menus and ordering flows with ease. 

Hierarchy is established through weight and color (Primary Green for headers, dark grey for body). Avoid using pure black; instead, use the Primary Green at high-depth for text to maintain the brand’s organic warmth.

## Layout & Spacing

This design system uses a **Fluid Grid** with a 12-column structure for desktop and a 4-column structure for mobile.

- **Desktop:** 12 columns, 24px gutters, and 48px outer margins. Use "stack-lg" for separating distinct sections (e.g., Hero from Menu categories).
- **Mobile:** 4 columns, 16px gutters, and 16px outer margins.
- **Rhythm:** All spacing is based on an 8px base unit. Component internal padding should follow the "stack-md" (16px) rule to ensure a breathable, "clean" aesthetic that feels inviting rather than cluttered.

Avoid tight spacing; let the content breathe to reflect the relaxed, "capybara" vibe.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**.

- **Surface Levels:** The base background is the light neutral (#F1F8E9). Cards and interactive containers use white (#FFFFFF) to lift them off the background.
- **Shadows:** Use extremely soft, diffused shadows with a slight green tint (Primary Green at 4-8% opacity) rather than grey. This makes elements appear like they are floating gently on a surface rather than casting a harsh shadow.
- **Interactions:** On hover, cards should slightly lift (increase shadow blur) to provide tactile feedback without looking industrial.

## Shapes

The shape language is **Rounded**. Sharp corners are strictly avoided to maintain the friendly mascot-driven personality.

- **Standard Buttons & Inputs:** 0.5rem (8px) corner radius.
- **Cards & Modal Containers:** 1rem (16px) corner radius.
- **Images (Pizza & Mascot):** Use 1.5rem (24px) for featured imagery to create a soft, framed look.
- **Iconography:** Use rounded-cap icons with a medium stroke weight (2px) to match the line art style of the logo.

## Components

- **Buttons:** Primary buttons use the Primary Green with white text. Secondary buttons use a Primary Green outline with a light green background on hover. Use the "Pill" variant for special "Order Now" CTAs to draw attention.
- **Chips:** Used for dietary tags (e.g., "Vegan", "Spicy"). Use the Secondary Green with 10% opacity for the background and solid Secondary Green for text.
- **Input Fields:** Use white backgrounds with a subtle Primary Green border (1px). Focus states should thicken the border to 2px and add a soft green glow.
- **Cards:** Pizza item cards should feature a large image at the top, followed by a bold headline and a clear "Add to Cart" button. Use the 1rem roundedness and the soft ambient shadow.
- **Lists:** Menu lists should use "stack-md" vertical spacing with thin, low-opacity dividers to maintain organization without adding visual noise.
- **Mascot Integration:** Small illustrations of the capybara mascot should be used as "empty state" indicators or as small floating accents near the footer to reinforce brand identity.