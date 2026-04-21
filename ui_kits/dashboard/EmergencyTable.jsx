// EmergencyTable.jsx — RMG Design System
// Patient triage list with Manchester badges, location tags, elapsed time

Object.assign(window, { EmergencyTable, GravBadge });

function GravBadge({ g }) {
  const c = window.GRAV_COLORS[g] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      borderRadius: 9999, border: `1px solid ${c.border}`,
      padding: '2px 8px', fontSize: 10, fontWeight: 700,
      background: c.light, color: c.text,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.bg }} />
      {g}
    </span>
  );
}

function elapsed(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 864e5);
  const h = Math.floor((ms % 864e5) / 36e5);
  const m = Math.floor((ms % 36e5) / 6e4);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function elapsedColor(iso) {
  const h = (Date.now() - new Date(iso).getTime()) / 36e5;
  if (h > 48) return 'hsl(0 84% 60%)';
  if (h > 12) return 'hsl(17 80% 54%)';
  return 'hsl(200 65% 50%)';
}

const SEV_ORDER = { LARANJA: 0, AMARELO: 1, VERDE: 2, AZUL: 3 };

function EmergencyTable({ patients }) {
  const sorted = React.useMemo(() =>
    [...patients].sort((a, b) =>
      (SEV_ORDER[a.grav] ?? 9) - (SEV_ORDER[b.grav] ?? 9) ||
      new Date(a.entrada) - new Date(b.entrada)
    ), [patients]);

  const th = { background: 'hsl(210 28% 97%)', padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(220 10% 45%)', borderBottom: '2px solid hsl(220 18% 89%)' };
  const td = { padding: '7px 12px', fontSize: 11, borderBottom: '1px solid hsl(220 18% 89%)', color: 'hsl(222 25% 16%)' };

  return (
    <div style={{ background: 'white', border: '1px solid hsl(220 18% 89%)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px hsl(222 25% 16%/0.08), 0 12px 30px hsl(222 25% 16%/0.06)' }}>
      <div style={{ background: 'hsl(210 28% 97%)', borderBottom: '1px solid hsl(220 18% 89%)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'block', width: 4, height: 14, borderRadius: 2, background: 'hsl(122 47% 42%)', flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'hsl(222 25% 16%)' }}>Lista de pacientes — sem nome (privacidade)</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Sexo','Idade','Gravidade','Localização','Ficha','Entrada','Tempo na unidade'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => (
              <tr key={p.fa} style={{ transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'hsl(210 28% 97%/60%)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ ...td, textAlign: 'center', fontSize: 14 }}>{p.sexo === 'M' ? '♂' : '♀'}</td>
                <td style={{ ...td, textAlign: 'center' }}>{p.idade}a</td>
                <td style={td}><GravBadge g={p.grav} /></td>
                <td style={td}>
                  <span style={{ background: 'hsl(210 28% 97%)', border: '1px solid hsl(220 18% 89%)', borderRadius: 6, padding: '1px 6px', fontSize: 10, color: 'hsl(220 10% 45%)' }}>{p.loc}</span>
                </td>
                <td style={td}><span style={{ fontFamily: 'monospace', fontSize: 10, color: 'hsl(220 10% 45%)' }}>{p.fa}</span></td>
                <td style={{ ...td, fontSize: 10, color: 'hsl(220 10% 45%)' }}>{new Date(p.entrada).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td style={{ ...td, fontWeight: 700, color: elapsedColor(p.entrada) }}>{elapsed(p.entrada)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
