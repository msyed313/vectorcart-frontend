# VectorCart — Design System

This is the single source of truth for visual design across the whole
frontend. Every page/component should pull from these tokens — no
one-off colors or fonts anywhere else in the app.

## Why these choices

VectorCart's identity is "AI-powered commerce" — the logo already
established an indigo → violet gradient with cyan "vector node"
accents (dots connected by thin lines, echoing embeddings/graph
structure). This design system extends that same idea into the whole
UI, so the brand feels like one deliberate decision, not a logo
bolted onto a generic admin theme.

## Color palette

| Token | Hex | Use |
|---|---|---|
| `primary` | `#6366F1` (Indigo 500) | Primary buttons, links, active states |
| `primary-dark` | `#4F46E5` (Indigo 600) | Hover/pressed states |
| `secondary` | `#8B5CF6` (Violet 500) | Gradient partner with primary, secondary accents |
| `accent` | `#22D3EE` (Cyan 400) | AI/vector-specific highlights only — badges like "AI Search", focus rings, node-graph decoration. Used sparingly, never as a large fill. |
| `ink` | `#1E1B4B` | Primary heading/text color (deep indigo-black, matches the logo wordmark) |
| `body-text` | `#475569` (Slate 600) | Paragraph/body text |
| `surface` | `#FFFFFF` | Card backgrounds |
| `surface-muted` | `#F8FAFC` (Slate 50) | Page background |
| `border` | `#E2E8F0` (Slate 200) | Dividers, input borders |
| `success` | `#10B981` (Emerald 500) | In-stock, success toasts |
| `danger` | `#EF4444` (Red 500) | Errors, out-of-stock, delete actions |
| `warning` | `#F59E0B` (Amber 500) | Low-stock warnings |

**Signature gradient** (used on primary CTAs, logo backdrop, hero accents only — not overused):
```
linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)
```

## Typography

- **Display / Headings:** `Space Grotesk` — geometric, slightly technical character, matches the "Vector" identity. Used for h1–h4, nav brand text, section titles.
- **Body / UI text:** `Inter` — highly legible at small sizes, standard for forms, tables, body copy.

Both loaded via Google Fonts (see `index.css`).

## Signature element — the "vector node" motif

The logo's connected-dots pattern is reused throughout the UI as a
quiet recurring signature:
- A thin dashed/dotted line + small filled circle appears as a section
  divider (instead of a plain `<hr>`).
- Card focus/hover states use a **gradient border** (primary → secondary)
  rather than a flat color, echoing the logo gradient.
- Loading states use a small pulsing "node" dot rather than a generic spinner.

This stays subtle — it's a signature, not decoration on every element.

## Spacing & shape

- Border radius: `rounded-xl` (12px) for cards, `rounded-full` for pills/badges/avatars.
- Shadows: soft, colored shadows on primary elements (`shadow-indigo-500/10`) instead of plain gray shadows — ties shadows back to the brand color.

## Tailwind config

See `tailwind.config.js` — all tokens above are registered as Tailwind
theme extensions (`primary`, `secondary`, `accent`, `ink`, etc.) so
components use `bg-primary`, `text-ink`, `border-accent` etc. directly,
never raw hex codes in component files.
