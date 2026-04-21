// MapView.jsx — RMG Design System
// Mapa Assistencial page — stat sidebar + map placeholder

Object.assign(window, { MapView });

const UNITS = [
  { nome: 'Hospital Mário Gatti', tipo: 'Hospital', atend: '18.000', adulto: 13200, pediatrico: 4800, retaguarda: 42, evasoes: 180 },
  { nome: 'Mário Gattinho', tipo: 'Hospital', atend: '9.500', adulto: 0, pediatrico: 9500, retaguarda: 18, evasoes: 95 },
  { nome: 'Hosp. Edivaldo Orsi', tipo: 'Hospital', atend: '12.000', adulto: 9000, pediatrico: 3000, retaguarda: 28, evasoes: 120 },
  { nome: 'UPA Anchieta', tipo: 'UPA', atend: '11.000', adulto: 7700, pediatrico: 3300, retaguarda: 12, evasoes: 220 },
  { nome: 'UPA Campo Grande', tipo: 'UPA', atend: '15.000', adulto: 10500, pediatrico: 4500, retaguarda: 16, evasoes: 310 },
  { nome: 'UPA São José', tipo: 'UPA', atend: '13.000', adulto: 9100, pediatrico: 3900, retaguarda: 14, evasoes: 260 },
  { nome: 'UPA Carlos Lourenço', tipo: 'UPA', atend: '12.500', adulto: 8800, pediatrico: 3700, retaguarda: 13, evasoes: 240 },
];

const BASE = { background: 'white', border: '1px solid hsl(220 18% 89%)', borderRadius: 10, boxShadow: '0 1px 4px hsl(222 25% 16%/0.08), 0 12px 30px hsl(222 25% 16%/0.06)', overflow: 'hidden' };
const SEC_HDR = { background: 'hsl(210 28% 97%)', borderBottom: '1px solid hsl(220 18% 89%)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 };
const STAT_ITEM = { background: 'hsl(210 28% 97%)', border: '1px solid hsl(220 18% 89%)', borderRadius: 8, padding: '10px 12px' };

function UnitDetail({ unit }) {
  if (!unit) return (
    <div style={{ background: 'hsl(210 28% 97%)', border: '1px dashed hsl(220 18% 89%)', borderRadius: 8, padding: '14px 12px', fontSize: 11, color: 'hsl(220 10% 45%)' }}>
      Clique em uma unidade no mapa para visualizar os detalhes assistenciais.
    </div>
  );
  const isHosp = unit.tipo === 'Hospital';
  const color = isHosp ? 'hsl(122 47% 42%)' : 'hsl(17 80% 54%)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ ...STAT_ITEM }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'hsl(222 25% 16%)' }}>{unit.nome}</div>
          <span style={{ borderRadius: 9999, padding: '2px 8px', fontSize: 10, fontWeight: 600, background: color, color: 'white' }}>{unit.tipo}</span>
        </div>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(220 10% 45%)', marginTop: 10 }}>Total / mês</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'hsl(200 65% 50%)' }}>{unit.atend}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[['Atend. Adulto', unit.adulto.toLocaleString('pt-BR')], ['Atend. Pediátrico', unit.pediatrico.toLocaleString('pt-BR')], ['Pac. em retaguarda', unit.retaguarda], ['Evasões/Desist.', unit.evasoes]].map(([l, v]) => (
          <div key={l} style={STAT_ITEM}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'hsl(220 10% 45%)' }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'hsl(222 25% 16%)', marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapView() {
  const [selected, setSelected] = React.useState(null);
  const hospitals = UNITS.filter(u => u.tipo === 'Hospital');
  const upas = UNITS.filter(u => u.tipo === 'UPA');
  const totalMonthly = UNITS.reduce((s, u) => s + Number(u.atend.replace(/\./g, '')), 0).toLocaleString('pt-BR');

  return (
    <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
      {/* Map area */}
      <div style={{ ...BASE, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 480 }}>
        <div style={SEC_HDR}>
          <span style={{ width: 4, height: 14, borderRadius: 2, background: 'hsl(200 65% 50%)', flexShrink: 0, display: 'block' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'hsl(222 25% 16%)' }}>Distribuição territorial das unidades</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ borderRadius: 9999, padding: '4px 12px', fontSize: 11, fontWeight: 700, background: 'hsl(122 47% 42%)', color: 'white' }}>✚ Hospital</span>
            <span style={{ borderRadius: 9999, padding: '4px 12px', fontSize: 11, fontWeight: 700, background: 'hsl(17 80% 54%)', color: 'white' }}>◉ UPA</span>
          </div>
        </div>
        {/* Map placeholder with unit buttons */}
        <div style={{ flex: 1, background: 'hsl(210 28% 97%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'hsl(220 10% 55%)', fontWeight: 600, marginBottom: 4 }}>Mapa Leaflet — Campinas/SP</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', padding: '0 20px' }}>
            {UNITS.map(u => {
              const isHosp = u.tipo === 'Hospital';
              const color = isHosp ? 'hsl(122 47% 42%)' : 'hsl(17 80% 54%)';
              const isSelected = selected?.nome === u.nome;
              return (
                <button key={u.nome} onClick={() => setSelected(u)} style={{
                  borderRadius: 9999, border: `2px solid ${color}`, padding: '5px 14px', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', background: isSelected ? color : 'white', color: isSelected ? 'white' : color,
                  transition: 'all 0.15s',
                }}>{isHosp ? '✚' : '◉'} {u.nome}</button>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: 'hsl(220 10% 60%)', marginTop: 8 }}>Clique numa unidade para ver detalhes →</div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
        <div style={BASE}>
          <div style={SEC_HDR}><span style={{ width: 4, height: 14, borderRadius: 2, background: 'hsl(200 65% 50%)', display: 'block' }} /><span style={{ fontSize: 13, fontWeight: 700 }}>Resumo da rede</span></div>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={STAT_ITEM}><div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(220 10% 45%)' }}>Unidades</div><div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{UNITS.length}</div></div>
              <div style={STAT_ITEM}><div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(220 10% 45%)' }}>Atend./mês</div><div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: 'hsl(200 65% 50%)' }}>{totalMonthly}</div></div>
            </div>
            <div style={{ ...STAT_ITEM, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'hsl(220 10% 45%)' }}>Hospitais</span><strong style={{ color: 'hsl(122 47% 42%)' }}>{hospitals.length}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'hsl(220 10% 45%)' }}>UPAs</span><strong style={{ color: 'hsl(17 80% 54%)' }}>{upas.length}</strong></div>
            </div>
          </div>
        </div>

        <div style={BASE}>
          <div style={SEC_HDR}><span style={{ width: 4, height: 14, borderRadius: 2, background: 'hsl(200 65% 50%)', display: 'block' }} /><span style={{ fontSize: 13, fontWeight: 700 }}>Detalhes da unidade</span></div>
          <div style={{ padding: 14 }}><UnitDetail unit={selected} /></div>
        </div>
      </div>
    </div>
  );
}
