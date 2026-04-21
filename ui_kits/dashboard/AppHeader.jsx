// AppHeader.jsx — RMG Design System (updated nav)
Object.assign(window, { AppHeader });

const GRAV_COLORS = {
  LARANJA: { bg: 'hsl(17 80% 54%)', light: 'hsl(17 80% 54%/15%)', text: 'hsl(17 80% 44%)', border: 'hsl(17 80% 54%/40%)' },
  AMARELO: { bg: 'hsl(47 91% 49%)', light: 'hsl(47 91% 49%/15%)', text: 'hsl(47 80% 38%)', border: 'hsl(47 91% 49%/40%)' },
  VERDE:   { bg: 'hsl(122 47% 42%)', light: 'hsl(122 47% 42%/15%)', text: 'hsl(122 47% 28%)', border: 'hsl(122 47% 42%/40%)' },
  AZUL:    { bg: 'hsl(200 65% 50%)', light: 'hsl(200 65% 50%/15%)', text: 'hsl(200 65% 35%)', border: 'hsl(200 65% 50%/40%)' },
};
Object.assign(window, { GRAV_COLORS });

const URGENCIA_UNITS = [
  { id:'upa-anchieta',    label:'UPA Anchieta',       type:'UPA',  color:'hsl(17 80% 54%)' },
  { id:'upa-campogrd',   label:'UPA Campo Grande',    type:'UPA',  color:'hsl(17 80% 54%)' },
  { id:'upa-saojose',    label:'UPA São José',         type:'UPA',  color:'hsl(17 80% 54%)' },
  { id:'upa-carlos',     label:'UPA Carlos Lourenço', type:'UPA',  color:'hsl(17 80% 54%)' },
  { id:'ps-chpeo',       label:'PS do CHPEO',          type:'PS',   color:'hsl(262 60% 55%)' },
  { id:'ps-hmmg',        label:'PS do HMMG',           type:'PS',   color:'hsl(262 60% 55%)' },
  { id:'ps-upmg',        label:'PS do UPMG',           type:'PS',   color:'hsl(262 60% 55%)' },
];

const HOSPITAL_UNITS = [
  { id:'hosp-mario',  label:'Hospital Mário Gatti',      color:'hsl(122 47% 42%)' },
  { id:'hosp-gattin', label:'Mário Gattinho',             color:'hsl(122 47% 42%)' },
  { id:'hosp-orsi',   label:'Hosp. Edivaldo Orsi',       color:'hsl(122 47% 42%)' },
];

function UnitBadge({ label, color }) {
  return (
    <span style={{ fontSize: 9, borderRadius: 9999, padding: '1px 6px', fontWeight: 700, color: 'white', background: color, flexShrink: 0 }}>
      {label}
    </span>
  );
}

function DropdownNav({ id, label, icon, units, unitGroupLabel, activePage, pageId, onSelect, openId, setOpenId }) {
  const isActive = activePage === pageId || (typeof activePage === 'string' && activePage.startsWith(pageId + ':'));
  const ref = React.useRef();

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenId(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Group by type
  const groups = units.reduce((acc, u) => {
    const key = u.type || 'Unidade';
    if (!acc[key]) acc[key] = [];
    acc[key].push(u);
    return acc;
  }, {});

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpenId(openId === id ? null : id)} style={{
        padding: '6px 10px 6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
        cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 5,
        background: isActive ? 'hsl(200 65% 50%)' : 'transparent',
        color: isActive ? 'white' : 'hsl(220 10% 45%)',
        transition: 'all 0.15s', whiteSpace: 'nowrap',
      }}>
        {icon} {label}
        <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 2 }}>▾</span>
      </button>

      {openId === id && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          background: 'white', border: '1px solid hsl(220 18% 89%)', borderRadius: 8,
          boxShadow: '0 4px 16px hsl(222 25% 16%/0.12)', minWidth: 210,
          padding: 4, zIndex: 100,
        }}>
          <div style={{ padding: '6px 12px 4px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(220 10% 45%)' }}>
            {unitGroupLabel || 'Selecionar unidade'}
          </div>
          <div style={{ height: 1, background: 'hsl(220 18% 89%)', margin: '3px 4px' }} />
          {Object.entries(groups).map(([type, items], gi) => (
            <div key={type}>
              {Object.keys(groups).length > 1 && (
                <div style={{ padding: '5px 12px 2px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(220 10% 55%)' }}>{type}s</div>
              )}
              {items.map(u => (
                <div key={u.id} onClick={() => { onSelect(pageId + ':' + u.id); setOpenId(null); }}
                  style={{ padding: '7px 12px', fontSize: 11, fontWeight: 600, borderRadius: 6, cursor: 'pointer', color: 'hsl(222 25% 16%)', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'hsl(210 28% 97%)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <UnitBadge label={u.type || 'Hosp.'} color={u.color} />
                  {u.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AppHeader({ title, subtitle, activePage, onNav }) {
  const [now, setNow] = React.useState(new Date());
  const [openId, setOpenId] = React.useState(null);

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString('pt-BR');
  const date = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const isMapActive = activePage === 'map';

  return (
    <header style={{ background: 'white', borderBottom: '1px solid hsl(220 18% 89%)', boxShadow: '0 1px 4px hsl(222 25% 16%/0.08)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 64, height: 64, border: '1px solid hsl(220 18% 89%)', borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            <img src="../../assets/logo.png" alt="RMG" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'hsl(222 25% 16%)' }}>{title}</div>
            <div style={{ fontSize: 11, color: 'hsl(220 10% 45%)', marginTop: 3 }}>{subtitle}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Nav pill */}
          <nav style={{ background: 'hsl(210 28% 97%)', border: '1px solid hsl(220 18% 89%)', borderRadius: 8, padding: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Item 1 — static */}
            <button onClick={() => { onNav && onNav('map'); setOpenId(null); }} style={{
              padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 5,
              background: isMapActive ? 'hsl(200 65% 50%)' : 'transparent',
              color: isMapActive ? 'white' : 'hsl(220 10% 45%)',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>⚕ Pronto Atendimentos e UPAs</button>

            {/* Item 2 — Detalhamento Urgência */}
            <DropdownNav id="urgencia" label="Detalhamento Urgência" icon="⚡"
              units={URGENCIA_UNITS} pageId="upcg"
              activePage={activePage} onSelect={onNav} openId={openId} setOpenId={setOpenId}
            />

            {/* Item 3 — Detalhamento Hospitais */}
            <DropdownNav id="hospitais" label="Detalhamento Hospitais" icon="🏥"
              units={HOSPITAL_UNITS} pageId="hospital"
              activePage={activePage} onSelect={onNav} openId={openId} setOpenId={setOpenId}
            />
          </nav>

          {/* Clock */}
          <div style={{ background: 'white', border: '1px solid hsl(220 18% 89%)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', overflow: 'hidden', boxShadow: '0 1px 4px hsl(222 25% 16%/0.06)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg,transparent,transparent 40px,hsl(0 0% 100%/0.06) 40px,hsl(0 0% 100%/0.06) 41px)' }} />
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'hsl(200 65% 50%/12%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(200 65% 50%)', fontSize: 18, position: 'relative' }}>🕐</div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'hsl(200 65% 50%)', lineHeight: 1 }}>{time}</div>
              <div style={{ fontSize: 10, color: 'hsl(220 10% 45%)', marginTop: 3, textTransform: 'capitalize' }}>{date}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
