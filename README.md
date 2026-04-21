<<<<<<< HEAD
# Rede Mário Gatti — Design System

## Overview

**Rede Mário Gatti (RMG)** is a public hospital network managed by the municipality of Campinas, São Paulo, Brazil. The network operates 3 hospitals (including the flagship Hospital Mário Gatti and the pediatric Mário Gattinho) and 4 UPAs (Unidades de Pronto Atendimento — urgent care centers).

This design system covers the **dash-rmg** product: an operational monitoring dashboard built for healthcare staff and administrators. The interface is entirely in **Portuguese (pt-BR)** and is designed for 1440px-wide desktop displays.

### Products

| Product | Description |
|---|---|
| **Mapa Assistencial** | Interactive Leaflet map showing hospital and UPA locations across Campinas/SP, with unit-level stats sidebar |
| **Emergência UPCG** | Emergency department live dashboard: KPI strips, Recharts charts, Manchester Triage System patient table |

### Sources

- **Codebase:** `https://github.com/brunofreitasspe/dash-rmg` (branch: `main`)
- No Figma link was provided.

---

## CONTENT FUNDAMENTALS

- **Language:** Brazilian Portuguese (pt-BR) throughout. No English UI copy.
- **Tone:** Clinical, factual, dense. Data-forward. No warmth or marketing language.
- **Casing:** Section labels use `UPPERCASE` with `tracking-wider`. Card titles use title-case sentence fragments. No sentence-end punctuation in labels.
- **Numbers:** Brazilian locale formatting — `18.000` (dot as thousands separator), `1h 20m` for durations.
- **I vs You:** Neither — the UI is impersonal and operational. Uses noun phrases: *"Fichas abertas hoje"*, *"Aguardando classificação"*.
- **Emoji:** None used anywhere.
- **Units & dates:** Always pt-BR locale. Times: `HH:MM:SS`. Dates: `dd/MM/yyyy`. Weekday capitalized in full: *"segunda-feira, 21 de abril de 2025"*.
- **Privacy:** Patient data shown without names — *"sem nome (privacidade)"*. Sex shown as ♂/♀ symbols.
- **Section framing:** Sections always state total count in the title, e.g. *"Aguardando classificação de risco — 46 pacientes"*.
- **Labels:** Metadata labels use `text-[11px] uppercase tracking-wide text-muted-foreground` — small and demure above large bold values.

**Example copy patterns:**
- KPI label: `Fichas abertas hoje`
- Section title: `Aguardando atendimento médico — 47 pacientes`
- Map subtitle: `Unidades hospitalares e UPAs da rede em Campinas/SP`
- Empty state: `Clique em uma unidade no mapa para visualizar os detalhes assistenciais.`

---

## VISUAL FOUNDATIONS

### Colors
- **Background:** `hsl(220 25% 95%)` — cool light blue-gray page background
- **Panel/Card:** `hsl(0 0% 100%)` — pure white surfaces
- **Foreground:** `hsl(222 25% 16%)` — dark navy text
- **Primary (Brand Blue):** `hsl(200 65% 50%)` — used for active nav, primary values, ring
- **Brand Yellow:** `hsl(47 91% 49%)` — Manchester AMARELO; "awaiting triage" KPI accent
- **Brand Lime:** `hsl(122 47% 42%)` — Hospital marker color; Manchester VERDE; observation KPI accent
- **Brand Orange:** `hsl(17 80% 54%)` — UPA marker color; Manchester LARANJA; "awaiting care" KPI accent
- **Muted background:** `hsl(220 20% 96%)` — secondary/accent areas, table rows, stat rows
- **Muted foreground:** `hsl(220 10% 45%)` — labels, timestamps, secondary text
- **Border:** `hsl(220 18% 89%)` — card and input borders
- **Destructive:** `hsl(0 84.2% 60.2%)` — error/alert red

### Typography
- **Font family:** `"Segoe UI", system-ui, sans-serif` — no custom web fonts; relies on OS fonts
- **Display numbers:** `text-3xl font-extrabold` or `text-4xl font-black` — bold stats
- **Section titles:** `text-[11px] font-bold uppercase tracking-wider text-muted-foreground` with a colored `1px × 14px` accent bar
- **Card headers:** `text-sm font-bold` with `border-b bg-secondary` separator band
- **Metadata labels:** `text-[11px] uppercase tracking-wide text-muted-foreground`
- **Body/table text:** `text-xs` or `text-sm text-foreground`
- **Mono:** `font-mono text-[11px]` for ID codes (ficha IDs)
- **Letter spacing:** `0` for headings; `tracking-wide`/`tracking-wider` only for uppercase labels

### Spacing & Layout
- **Max width:** `1440px` centered with `px-4 py-5 lg:px-7`
- **Gap rhythm:** `gap-4` within sections; `gap-5`/`gap-6` between sections
- **Card padding:** `p-4` for card content; `px-4 py-3` for card headers
- **Border radius:** `0.625rem` (`rounded-md`) — consistent across all cards, badges, icons

### Cards & Surfaces
- Background: `bg-panel` (white)
- Border: `1px solid hsl(220 18% 89%)`
- Shadow: `0 1px 4px hsl(222 25% 16% / 0.08), 0 12px 30px hsl(222 25% 16% / 0.06)` — subtle, two-layer
- Header band: `bg-secondary` (`hsl(210 28% 97%)`) separated by `border-b`
- KPI cards have a **1px colored bottom strip** (`h-1`) as accent

### KPI Cards
- Icon in a `2.25rem × 2.25rem` rounded box colored `{accent}1f` (8% opacity tint)
- Value: `text-3xl font-extrabold text-foreground`
- Sub-label: `text-[11px] text-muted-foreground`
- Bottom strip: `h-1 inset-x-0 bottom-0 absolute` in the accent color

### Section Titles
- Pattern: `<span h-3.5 w-1 rounded style="bg: accent" /> LABEL TEXT`
- Style: `text-[11px] font-bold uppercase tracking-wider text-muted-foreground`

### Triage Badges (Manchester Protocol)
- `AMARELO`: yellow bg/border/text (`brand-yellow`)
- `LARANJA`: orange bg/border/text (`brand-orange`)
- `VERDE`: lime bg/border/text (`brand-lime`)
- `AZUL`: blue bg/border/text (`brand-blue`)
- Format: `rounded-full border px-2 py-0.5 text-[11px] font-bold` with colored dot

### Charts
- Library: **Recharts** — `BarChart`, `PieChart` (donut with `innerRadius="55%"`)
- Bar radius: `[6, 6, 0, 0]` (rounded tops)
- Colors: rotates through `[brand-blue, brand-orange, brand-lime, brand-yellow, purple]`
- Axis text: `fontSize: 11, fill: hsl(var(--muted-foreground))`
- Donut charts have a legend with colored dots below

### Map (Leaflet)
- Tile: CartoDB Light (`light_all`) — clean, minimal basemap
- Hospitals: lime circle markers (`hsl(122 47% 42%)`)
- UPAs: orange circle markers (`hsl(17 80% 54%)`)
- Labels: permanent colored tooltips (`network-tooltip`) — pill shape, white text
- Popups: `rounded-[12px]` with branded icon + badge

### Backgrounds & Texture
- **Panel grid:** `repeating-linear-gradient(90deg, ...)` — faint vertical lines used in the clock widget
- **No full-bleed images**, no gradients on pages, no illustration backgrounds
- Page bg is a flat cool gray

### Animation
- Accordion: `0.2s ease-out`
- Float: `6s ease-in-out infinite` (`translateY(0 → -4px)`)
- No page transitions; no hover scale effects
- Nav link hover: `text-muted-foreground → text-foreground` color only
- Active nav: `bg-primary text-primary-foreground`

### Hover / Press States
- Table rows: `hover:bg-secondary/60`
- Nav links: color shift only (no background on hover unless active)
- No scale or lift effects

### Borders & Dividers
- `1px solid hsl(220 18% 89%)` everywhere — borders on cards, inputs, table rows
- `border-b border-border` as card header divider
- `border-b-2` on table `<th>` for emphasis

### Corner Radii
- Cards, stat rows, icons: `0.625rem` (`rounded-md`)
- Badges: `rounded-full`
- Bars in charts: `[6, 6, 0, 0]`
- Map tooltips: `border-radius: 10px`

### Iconography
See ICONOGRAPHY section below.

---

## ICONOGRAPHY

- **Icon set:** [Lucide React](https://lucide.dev/) v0.462.0 — consistent `stroke-width: 2`, line style
- **Usage via CDN:** `https://unpkg.com/lucide-react` (or from npm in production)
- **No custom icon font, no SVG sprites, no PNG icons**
- **Emoji:** Not used as icons
- **Size conventions:**
  - Nav icons: `h-3.5 w-3.5`
  - KPI icons: `h-4 w-4`
  - Info/card icons: `h-4 w-4` or `h-5 w-5`
  - Legend icons: `h-3.5 w-3.5`

**Icons used in the codebase:**
| Icon | Usage |
|---|---|
| `Activity` | Emergência UPCG nav item |
| `MapPinned` | Mapa Assistencial nav item; UPA legend badge |
| `Clock3` | Live clock widget in header |
| `ClipboardList` | KPI: fichas abertas |
| `Hourglass` | KPI: aguardando classificação |
| `Hospital` | KPI: aguardando atendimento |
| `Users` | KPI: em observação; map highlight card |
| `Cross` | Hospital legend badge |
| `CalendarDays` | Map "last updated" note |
| `Info` | Unit detail card header |

**Logo:** `assets/logo.png` — Rede Mário Gatti institutional logo. Used in the AppHeader at `80×80px` with `object-contain` inside a white border box.

---

## Files

| File | Description |
|---|---|
| `README.md` | This file — full design system documentation |
| `colors_and_type.css` | CSS custom properties for all colors, typography, and tokens |
| `assets/logo.png` | RMG institutional logo |
| `ui_kits/dashboard/index.html` | Interactive dashboard UI kit — main product view |
| `ui_kits/dashboard/AppHeader.jsx` | Header component with nav and clock |
| `ui_kits/dashboard/KpiCard.jsx` | KPI stat card component |
| `ui_kits/dashboard/PanelCard.jsx` | Section panel card component |
| `ui_kits/dashboard/EmergencyTable.jsx` | Patient triage table component |
| `ui_kits/dashboard/MapView.jsx` | Map page stub component |
| `preview/` | Design system card previews (registered in asset review) |
| `SKILL.md` | Agent skill definition |
=======
# Welcome to your Lovable project

TODO: Document your project here
>>>>>>> 98c44c0ced35763ead5019285f037c66ba179efc
