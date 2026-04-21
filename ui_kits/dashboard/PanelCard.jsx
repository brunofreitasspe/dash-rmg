// PanelCard.jsx — RMG Design System
// Reusable section panel: secondary header band + content area

Object.assign(window, { PanelCard, SectionTitle, StatRow });

function SectionTitle({ children, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.05em', color: 'hsl(220 10% 45%)',
      marginBottom: 12,
    }}>
      <span style={{ display: 'block', width: 4, height: 14, borderRadius: 2, background: accent, flexShrink: 0 }} />
      {children}
    </div>
  );
}

function PanelCard({ title, accent, children, style }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid hsl(220 18% 89%)',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 1px 4px hsl(222 25% 16%/0.08), 0 12px 30px hsl(222 25% 16%/0.06)',
      ...style,
    }}>
      <div style={{
        background: 'hsl(210 28% 97%)',
        borderBottom: '1px solid hsl(220 18% 89%)',
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ display: 'block', width: 4, height: 14, borderRadius: 2, background: accent, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'hsl(222 25% 16%)' }}>{title}</span>
      </div>
      <div style={{ padding: 14 }}>{children}</div>
    </div>
  );
}

function StatRow({ label, value, wait, waitColor }) {
  return (
    <div style={{
      background: 'hsl(210 28% 97%)',
      border: '1px solid hsl(220 18% 89%)',
      borderRadius: 8,
      padding: '10px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 8,
    }}>
      <span style={{ fontSize: 13, color: 'hsl(222 25% 16%)' }}>{label}</span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {wait && <span style={{ fontSize: 10, color: waitColor || 'hsl(220 10% 45%)' }}>↑ {wait}</span>}
        <span style={{ fontSize: 18, fontWeight: 800, color: 'hsl(222 25% 16%)' }}>{value}</span>
      </div>
    </div>
  );
}
