import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipboardList, Hourglass, Hospital, Users } from "lucide-react";

import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Gravidade = "AMARELO" | "LARANJA" | "VERDE" | "AZUL";

type Paciente = {
  sexo: "M" | "F";
  idade: number;
  grav: Gravidade;
  loc: string;
  fa: string;
  entrada: string;
};

const q1Faixas = [
  { f: "0-17", n: 60 },
  { f: "18-39", n: 95 },
  { f: "40-59", n: 44 },
  { f: "60-74", n: 15 },
  { f: "75+", n: 9 },
];

const q3Faixas = [
  { f: "0-17", n: 13, esp: "1h 20m" },
  { f: "18-39", n: 24, esp: "1h 16m" },
  { f: "40-59", n: 6, esp: "1h 04m" },
  { f: "60-74", n: 1, esp: "1h 14m" },
  { f: "75+", n: 2, esp: "0h 25m" },
];

const q4Faixas = [
  { f: "0-17", n: 7, esp: "11h 30m" },
  { f: "18-39", n: 25, esp: "11h 30m" },
  { f: "40-59", n: 13, esp: "02h 24m" },
  { f: "60-74", n: 1, esp: "05h 41m" },
  { f: "75+", n: 1, esp: "11h 30m" },
];

const q4Grav: { g: Gravidade; n: number }[] = [
  { g: "VERDE", n: 43 },
  { g: "AMARELO", n: 2 },
  { g: "AZUL", n: 2 },
];

const PACS: Paciente[] = [
  { sexo: "M", idade: 72, grav: "AMARELO", loc: "OBSERVAÇÃO 2", fa: "UPCG-0206-15-04-26", entrada: "2026-04-15T11:31:18" },
  { sexo: "M", idade: 61, grav: "AMARELO", loc: "OBSERVAÇÃO 2", fa: "UPCG-0219-15-04-26", entrada: "2026-04-15T12:01:42" },
  { sexo: "M", idade: 72, grav: "AMARELO", loc: "OBSERVAÇÃO 2", fa: "UPCG-0271-15-04-26", entrada: "2026-04-15T13:54:59" },
  { sexo: "F", idade: 79, grav: "AMARELO", loc: "OBSERVAÇÃO 2", fa: "UPCG-0283-15-04-26", entrada: "2026-04-15T14:41:08" },
  { sexo: "M", idade: 71, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0206-17-04-26", entrada: "2026-04-17T11:31:21" },
  { sexo: "M", idade: 56, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0213-17-04-26", entrada: "2026-04-17T11:52:21" },
  { sexo: "M", idade: 40, grav: "AMARELO", loc: "OBSERVAÇÃO 2", fa: "UPCG-0299-17-04-26", entrada: "2026-04-17T16:17:03" },
  { sexo: "M", idade: 40, grav: "LARANJA", loc: "OBSERVAÇÃO 2", fa: "UPCG-0390-17-04-26", entrada: "2026-04-17T20:55:49" },
  { sexo: "M", idade: 38, grav: "LARANJA", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0409-17-04-26", entrada: "2026-04-17T22:19:02" },
  { sexo: "F", idade: 53, grav: "AMARELO", loc: "OBSERVAÇÃO 1", fa: "UPCG-0421-17-04-26", entrada: "2026-04-17T23:04:45" },
  { sexo: "F", idade: 77, grav: "LARANJA", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0018-18-04-26", entrada: "2026-04-18T02:25:18" },
  { sexo: "M", idade: 52, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0088-18-04-26", entrada: "2026-04-18T08:29:34" },
  { sexo: "F", idade: 33, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0123-18-04-26", entrada: "2026-04-18T09:34:08" },
  { sexo: "F", idade: 48, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0184-18-04-26", entrada: "2026-04-18T11:51:46" },
  { sexo: "M", idade: 43, grav: "AMARELO", loc: "OBSERVAÇÃO EMERGÊNCIA", fa: "UPCG-0197-18-04-26", entrada: "2026-04-18T12:17:45" },
  { sexo: "F", idade: 59, grav: "VERDE", loc: "OBSERVAÇÃO 2", fa: "UPCG-0220-18-04-26", entrada: "2026-04-18T13:25:18" },
  { sexo: "M", idade: 66, grav: "AMARELO", loc: "OBSERVAÇÃO 2", fa: "UPCG-0269-18-04-26", entrada: "2026-04-18T16:10:28" },
  { sexo: "M", idade: 10, grav: "VERDE", loc: "OBSERVAÇÃO PEDIÁTRICA", fa: "UPCG-0296-18-04-26", entrada: "2026-04-18T17:33:01" },
  { sexo: "M", idade: 2, grav: "AMARELO", loc: "OBSERVAÇÃO PEDIÁTRICA", fa: "UPCG-0300-18-04-26", entrada: "2026-04-18T17:48:44" },
  { sexo: "F", idade: 20, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0367-18-04-26", entrada: "2026-04-18T22:05:23" },
  { sexo: "M", idade: 50, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0002-19-04-26", entrada: "2026-04-19T00:00:00" },
  { sexo: "F", idade: 79, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0144-19-04-26", entrada: "2026-04-19T12:02:09" },
  { sexo: "M", idade: 44, grav: "AMARELO", loc: "OBSERVAÇÃO 2", fa: "UPCG-0252-19-04-26", entrada: "2026-04-19T18:59:17" },
  { sexo: "M", idade: 30, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0342-19-04-26", entrada: "2026-04-19T23:42:56" },
  { sexo: "M", idade: 40, grav: "AMARELO", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0010-20-04-26", entrada: "2026-04-20T02:03:13" },
  { sexo: "M", idade: 69, grav: "LARANJA", loc: "SALA DE EMERGÊNCIA", fa: "UPCG-0012-20-04-26", entrada: "2026-04-20T02:26:11" },
];

const GRAV_HSL: Record<Gravidade, string> = {
  AMARELO: "hsl(var(--brand-yellow))",
  LARANJA: "hsl(var(--brand-orange))",
  VERDE: "hsl(var(--brand-lime))",
  AZUL: "hsl(var(--brand-blue))",
};

const BRAND_PALETTE = [
  "hsl(var(--brand-blue))",
  "hsl(var(--brand-orange))",
  "hsl(var(--brand-lime))",
  "hsl(var(--brand-yellow))",
  "hsl(262 60% 55%)",
];

const SEV_ORDER: Record<Gravidade, number> = { LARANJA: 0, AMARELO: 1, VERDE: 2, AZUL: 3 };

function elapsed(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 864e5);
  const h = Math.floor((ms % 864e5) / 36e5);
  const m = Math.floor((ms % 36e5) / 6e4);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function elapsedClass(iso: string) {
  const h = (Date.now() - new Date(iso).getTime()) / 36e5;
  if (h > 48) return "text-destructive";
  if (h > 12) return "text-brand-orange";
  return "text-primary";
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

type KpiProps = {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: React.ReactNode;
  accent: string;
};

function Kpi({ icon: Icon, label, value, sub, accent }: KpiProps) {
  return (
    <Card className="relative overflow-hidden rounded-md border-border bg-panel shadow-panel">
      <CardContent className="p-4">
        <div
          className="mb-2 flex h-9 w-9 items-center justify-center rounded-md"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1 text-3xl font-extrabold leading-none text-foreground">{value}</div>
        <div className="mt-2 text-[11px] text-muted-foreground">{sub}</div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: accent }} />
    </Card>
  );
}

function SectionTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
      <span className="block h-3.5 w-1 rounded" style={{ backgroundColor: accent }} />
      {children}
    </div>
  );
}

function PanelCard({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-md border-border bg-panel shadow-panel">
      <CardHeader className="border-b border-border bg-secondary px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold">
          <span className="block h-3.5 w-1 rounded" style={{ backgroundColor: accent }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

function HBarList({ data, accent }: { data: { f: string; n: number; esp: string }[]; accent: string }) {
  const max = Math.max(...data.map((x) => x.n));
  return (
    <div className="flex flex-col gap-2.5">
      {data.map((x, i) => (
        <div key={x.f} className="flex items-center gap-3">
          <div className="w-16 shrink-0 text-xs text-muted-foreground">{x.f} anos</div>
          <div className="relative h-5 flex-1 overflow-hidden rounded border border-border bg-secondary">
            <div
              className="flex h-full items-center rounded px-2 text-[11px] font-bold text-primary-foreground transition-all"
              style={{
                width: `${(x.n / max) * 100}%`,
                backgroundColor: BRAND_PALETTE[i % BRAND_PALETTE.length] ?? accent,
              }}
            >
              {x.n}
            </div>
          </div>
          <div className="w-16 shrink-0 text-right text-[11px] text-muted-foreground">{x.esp}</div>
        </div>
      ))}
    </div>
  );
}

function StatRow({ label, total, esp, espAccent }: { label: string; total: number; esp: string; espAccent?: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-secondary px-3 py-2.5">
      <div className="text-sm font-medium text-foreground">{label}</div>
      <div className="flex items-center gap-3">
        <div className={cn("whitespace-nowrap text-[11px]", espAccent ?? "text-muted-foreground")}>↑ {esp}</div>
        <div className="text-lg font-extrabold text-foreground">{total}</div>
      </div>
    </div>
  );
}

function GravBadge({ g }: { g: Gravidade }) {
  const styles: Record<Gravidade, string> = {
    AMARELO: "bg-brand-yellow/15 text-brand-yellow border-brand-yellow/40",
    LARANJA: "bg-brand-orange/15 text-brand-orange border-brand-orange/40",
    VERDE: "bg-brand-lime/15 text-brand-lime border-brand-lime/40",
    AZUL: "bg-brand-blue/15 text-brand-blue border-brand-blue/40",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-bold",
        styles[g],
      )}
    >
      <span className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GRAV_HSL[g] }} />
      {g}
    </span>
  );
}

export default function EmergenciaUPCG() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setTick((v) => v + 1), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const sortedPacs = useMemo(
    () =>
      [...PACS].sort(
        (a, b) =>
          (SEV_ORDER[a.grav] ?? 9) - (SEV_ORDER[b.grav] ?? 9) ||
          new Date(a.entrada).getTime() - new Date(b.entrada).getTime(),
      ),
    [],
  );

  const locData = useMemo(() => {
    const counts: Record<string, number> = {};
    PACS.forEach((p) => (counts[p.loc] = (counts[p.loc] ?? 0) + 1));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, []);

  const gravObsData = useMemo(() => {
    const counts: Record<string, number> = {};
    PACS.forEach((p) => (counts[p.grav] = (counts[p.grav] ?? 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const sexoQ1 = [
    { name: "Feminino", value: 117 },
    { name: "Masculino", value: 106 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Painel de Emergência — UPCG"
        subtitle="Pacientes em atendimento · Dados exportados do AGHU"
      />

      <main className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-5 lg:px-7">
        {/* KPI Strip */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            icon={ClipboardList}
            label="Fichas abertas hoje"
            value={223}
            sub="117 feminino · 106 masculino"
            accent="hsl(var(--brand-blue))"
          />
          <Kpi
            icon={Hourglass}
            label="Aguardando classificação"
            value={46}
            sub={
              <>
                Maior espera: <strong className="text-foreground">1h 20m</strong>
              </>
            }
            accent="hsl(var(--brand-yellow))"
          />
          <Kpi
            icon={Hospital}
            label="Aguardando atendimento"
            value={47}
            sub={
              <>
                Maior espera: <strong className="text-foreground">17h 15m</strong>
              </>
            }
            accent="hsl(var(--brand-orange))"
          />
          <Kpi
            icon={Users}
            label="Em observação / emergência"
            value={26}
            sub="Pacientes no sistema"
            accent="hsl(var(--brand-lime))"
          />
        </section>

        {/* Q1 - Fichas abertas */}
        <section>
          <SectionTitle accent="hsl(var(--brand-blue))">Fichas abertas no dia — 223 total</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            <PanelCard title="Por sexo" accent="hsl(var(--brand-blue))">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sexoQ1}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="55%"
                      outerRadius="85%"
                      paddingAngle={2}
                    >
                      <Cell fill="hsl(var(--brand-orange))" />
                      <Cell fill="hsl(var(--brand-blue))" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-orange" /> Feminino 117
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" /> Masculino 106
                </span>
              </div>
            </PanelCard>

            <PanelCard title="Por faixa etária" accent="hsl(var(--brand-blue))">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={q1Faixas}>
                    <XAxis dataKey="f" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip />
                    <Bar dataKey="n" radius={[6, 6, 0, 0]}>
                      {q1Faixas.map((_, i) => (
                        <Cell key={i} fill={BRAND_PALETTE[i % BRAND_PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </PanelCard>
          </div>
        </section>

        {/* Q3 - Aguardando classificação */}
        <section>
          <SectionTitle accent="hsl(var(--brand-yellow))">
            Aguardando classificação de risco — 46 pacientes
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            <PanelCard title="Por sexo · maior espera" accent="hsl(var(--brand-yellow))">
              <div className="flex flex-col gap-2.5">
                <StatRow label="Masculino" total={19} esp="1h 20m" />
                <StatRow label="Feminino" total={27} esp="1h 14m" />
              </div>
            </PanelCard>
            <PanelCard title="Por faixa etária · maior espera" accent="hsl(var(--brand-yellow))">
              <HBarList data={q3Faixas} accent="hsl(var(--brand-yellow))" />
            </PanelCard>
          </div>
        </section>

        {/* Q4 - Aguardando atendimento */}
        <section>
          <SectionTitle accent="hsl(var(--brand-orange))">
            Aguardando atendimento médico — 47 pacientes
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-3">
            <PanelCard title="Por sexo · maior espera" accent="hsl(var(--brand-orange))">
              <div className="flex flex-col gap-2.5">
                <StatRow label="Masculino" total={27} esp="17h 15m" espAccent="text-brand-orange" />
                <StatRow label="Feminino" total={20} esp="11h 30m" espAccent="text-brand-orange" />
              </div>
            </PanelCard>
            <PanelCard title="Por faixa etária" accent="hsl(var(--brand-orange))">
              <HBarList data={q4Faixas} accent="hsl(var(--brand-orange))" />
            </PanelCard>
            <PanelCard title="Por gravidade (Manchester)" accent="hsl(var(--brand-orange))">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={q4Grav}
                      dataKey="n"
                      nameKey="g"
                      innerRadius="55%"
                      outerRadius="85%"
                      paddingAngle={2}
                    >
                      {q4Grav.map((entry) => (
                        <Cell key={entry.g} fill={GRAV_HSL[entry.g]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                {q4Grav.map((g) => (
                  <span key={g.g} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: GRAV_HSL[g.g] }} />
                    {g.g} {g.n}
                  </span>
                ))}
              </div>
            </PanelCard>
          </div>
        </section>

        {/* Pacientes em observação */}
        <section>
          <SectionTitle accent="hsl(var(--brand-lime))">
            Pacientes em observação / emergência — 26 registros
          </SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            <PanelCard title="Por localização" accent="hsl(var(--brand-lime))">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {locData.map((_, i) => (
                        <Cell key={i} fill={BRAND_PALETTE[i % BRAND_PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </PanelCard>

            <PanelCard title="Por gravidade" accent="hsl(var(--brand-lime))">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gravObsData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="55%"
                      outerRadius="85%"
                      paddingAngle={2}
                    >
                      {gravObsData.map((entry) => (
                        <Cell key={entry.name} fill={GRAV_HSL[entry.name as Gravidade] ?? "hsl(var(--muted))"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                {gravObsData.map((g) => (
                  <span key={g.name} className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: GRAV_HSL[g.name as Gravidade] ?? "hsl(var(--muted))" }}
                    />
                    {g.name} {g.value}
                  </span>
                ))}
              </div>
            </PanelCard>
          </div>

          <Card className="mt-4 rounded-md border-border bg-panel shadow-panel">
            <CardHeader className="border-b border-border bg-secondary px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <span className="block h-3.5 w-1 rounded bg-brand-lime" />
                Lista de pacientes — sem nome (privacidade)
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary">
                    {["Sexo", "Idade", "Gravidade", "Localização", "Ficha", "Entrada", "Tempo na unidade"].map((h) => (
                      <th
                        key={h}
                        className="border-b-2 border-border px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPacs.map((p) => (
                    <tr key={p.fa} className="border-b border-border transition-colors hover:bg-secondary/60">
                      <td className="px-3 py-2 text-center text-base">{p.sexo === "M" ? "♂" : "♀"}</td>
                      <td className="px-3 py-2 text-center text-sm">{p.idade}a</td>
                      <td className="px-3 py-2">
                        <GravBadge g={p.grav} />
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-block rounded border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                          {p.loc}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{p.fa}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{fmtDate(p.entrada)}</td>
                      <td className={cn("px-3 py-2 text-xs font-bold", elapsedClass(p.entrada))}>
                        {elapsed(p.entrada)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
