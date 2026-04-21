# UI Kit — RMG Dashboard

Interactive click-through prototype of the two main dashboard views:
- **Mapa Assistencial** — hospital network map + stats sidebar
- **Emergência UPCG** — KPI strip, charts (Recharts), patient triage table

## Components

| File | Description |
|---|---|
| `index.html` | Main entry — full interactive prototype, page-switching nav |
| `AppHeader.jsx` | Header with logo, nav pill, live clock. Props: `title`, `subtitle`, `activePage`, `onNav` |
| `KpiCard.jsx` | KPI stat card. Props: `icon`, `label`, `value`, `sub`, `accent` |
| `PanelCard.jsx` | Section panel card + `SectionTitle` + `StatRow` helpers |
| `EmergencyTable.jsx` | Patient triage table. Props: `patients[]` |
| `MapView.jsx` | Map page (stub with unit selector buttons + sidebar) |

## Usage

Open `index.html` in a browser. Navigate between pages via the header nav. All components are exported to `window` for reuse in other files.

## Design tokens

See `../../colors_and_type.css` for the full token set.
See `../../README.md` for visual foundations and content guidelines.
