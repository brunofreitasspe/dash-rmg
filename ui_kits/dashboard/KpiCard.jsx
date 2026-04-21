// KpiCard.jsx — RMG Design System
// Stat card with icon tint, large value, colored bottom accent strip

Object.assign(window, { KpiCard });

function KpiCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid hsl(220 18% 89%)',
      borderRadius: '10px',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 1px 4px hsl(222 25% 16% / 0.08), 0 12px 30px hsl(222 25% 16% / 0.06)',
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: accent + '1f',
        color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8, fontSize: 18,
      }}>{icon}</div>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(220 10% 45%)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, marginTop: 4, color: 'hsl(222 25% 16%)' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'hsl(220 10% 45%)', marginTop: 6 }}>{sub}</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: accent }} />
    </div>
  );
}
