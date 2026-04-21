import { useEffect, useMemo, useRef, useState } from "react";
import L, { divIcon, type Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { CalendarDays, Clock3, Cross, Info, MapPinned, Users } from "lucide-react";

import logo from "@/assets/logo.png";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UnitType = "Hospital" | "UPA";

type HealthUnit = {
  lat: number;
  lng: number;
  nome: string;
  tipo: UnitType;
  atend: string;
  adulto: number;
  pediatrico: number;
  retaguarda: number;
  evasoes: number;
  offsetLng?: number;
};

const units: HealthUnit[] = [
  { lat: -22.9155, lng: -47.068, nome: "Hospital Mário Gatti", tipo: "Hospital", atend: "18.000", adulto: 13200, pediatrico: 4800, retaguarda: 42, evasoes: 180, offsetLng: -0.022 },
  { lat: -22.9155, lng: -47.067, nome: "Mário Gattinho", tipo: "Hospital", atend: "9.500", adulto: 0, pediatrico: 9500, retaguarda: 18, evasoes: 95, offsetLng: 0.02 },
  { lat: -22.961, lng: -47.134, nome: "Hosp. Edivaldo Orsi", tipo: "Hospital", atend: "12.000", adulto: 9000, pediatrico: 3000, retaguarda: 28, evasoes: 120 },
  { lat: -22.877, lng: -47.11, nome: "UPA Anchieta", tipo: "UPA", atend: "11.000", adulto: 7700, pediatrico: 3300, retaguarda: 12, evasoes: 220 },
  { lat: -22.949, lng: -47.19, nome: "UPA Campo Grande", tipo: "UPA", atend: "15.000", adulto: 10500, pediatrico: 4500, retaguarda: 16, evasoes: 310 },
  { lat: -22.952, lng: -47.091, nome: "UPA São José", tipo: "UPA", atend: "13.000", adulto: 9100, pediatrico: 3900, retaguarda: 14, evasoes: 260 },
  { lat: -22.925, lng: -47.027, nome: "UPA Carlos Lourenço", tipo: "UPA", atend: "12.500", adulto: 8800, pediatrico: 3700, retaguarda: 13, evasoes: 240 },
];

const formatClock = (value: Date) => ({
  time: new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(value),
  date: new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value),
});

export function HealthNetworkMap() {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [now, setNow] = useState(() => formatClock(new Date()));
  const [selected, setSelected] = useState<HealthUnit | null>(null);

  const stats = useMemo(() => {
    const hospitals = units.filter((unit) => unit.tipo === "Hospital");
    const upas = units.filter((unit) => unit.tipo === "UPA");

    return {
      total: units.length,
      hospitals: hospitals.length,
      upas: upas.length,
      monthlyCare: units.reduce((total, unit) => total + Number(unit.atend.replace(/\./g, "")), 0).toLocaleString("pt-BR"),
      highlight: units.reduce((prev, current) =>
        Number(prev.atend.replace(/\./g, "")) > Number(current.atend.replace(/\./g, "")) ? prev : current,
      ),
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(formatClock(new Date()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: [-22.925, -47.09],
      zoom: 12,
      zoomControl: true,
      preferCanvas: false,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      minZoom: 0,
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      subdomains: "abcd",
    }).addTo(map);

    L.svg().addTo(map);

    const svgElement = map.getPanes().overlayPane.querySelector("svg");
    const connectors: Array<{ lat: number; lng: number; offsetLng: number; line: SVGLineElement }> = [];

    const updateConnectors = () => {
      connectors.forEach((connector) => {
        const start = map.latLngToLayerPoint([connector.lat, connector.lng]);
        const end = map.latLngToLayerPoint([connector.lat, connector.lng + connector.offsetLng]);

        connector.line.setAttribute("x1", String(start.x));
        connector.line.setAttribute("y1", String(start.y));
        connector.line.setAttribute("x2", String(end.x));
        connector.line.setAttribute("y2", String(end.y));
      });
    };

    units.forEach((unit) => {
      const variant = unit.tipo === "Hospital" ? "hospital" : "upa";
      const displayLng = unit.offsetLng ? unit.lng + unit.offsetLng : unit.lng;

      const pointMarker = L.circleMarker([unit.lat, unit.lng], {
        radius: 6,
        color: unit.tipo === "Hospital" ? "hsl(122 47% 42%)" : "hsl(17 80% 54%)",
        fillColor: "hsl(0 0% 100%)",
        fillOpacity: 1,
        weight: 3,
      }).addTo(map);

      const labelMarker = L.marker([unit.lat, displayLng], {
        icon: divIcon({ className: "network-label-anchor", html: "", iconSize: [1, 1], iconAnchor: [0, 0] }),
        interactive: true,
        keyboard: false,
      }).addTo(map);

      const labelColor = unit.tipo === "Hospital" ? "hsl(var(--brand-lime))" : "hsl(var(--brand-orange))";

      labelMarker.bindTooltip(`<span class="network-tooltip__label" style="background-color: ${labelColor}">${unit.nome}</span>`, {
        permanent: true,
        direction: "top",
        offset: [0, -10],
        opacity: 1,
        interactive: true,
        className: `network-tooltip network-tooltip--${variant}`,
      });

      if (unit.offsetLng && svgElement) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("stroke", unit.tipo === "Hospital" ? "hsl(122 47% 42%)" : "hsl(17 80% 54%)");
        line.setAttribute("stroke-width", "1.5");
        line.setAttribute("stroke-dasharray", "4 3");
        line.setAttribute("opacity", "0.75");
        svgElement.appendChild(line);
        connectors.push({ lat: unit.lat, lng: unit.lng, offsetLng: unit.offsetLng, line });
      }

      const popupHtml =
        `<div class="map-popup">
          <span class="map-popup__badge map-popup__badge--${variant}">${unit.tipo}</span>
          <div class="map-popup__title">${unit.nome}</div>
          <div class="map-popup__row">Atendimentos/mês <strong>${unit.atend}</strong></div>
          <div class="map-popup__row">Adulto <strong>${unit.adulto.toLocaleString("pt-BR")}</strong></div>
          <div class="map-popup__row">Pediátrico <strong>${unit.pediatrico.toLocaleString("pt-BR")}</strong></div>
          <div class="map-popup__row">Retaguarda <strong>${unit.retaguarda.toLocaleString("pt-BR")}</strong></div>
          <div class="map-popup__row">Evasões/Desistências <strong>${unit.evasoes.toLocaleString("pt-BR")}</strong></div>
          <div class="map-popup__row">Rede Mário Gatti · Campinas/SP</div>
        </div>`;

      pointMarker.bindPopup(popupHtml, { maxWidth: 260 });
      labelMarker.bindPopup(popupHtml, { maxWidth: 260 });

      pointMarker.on("click", () => setSelected(unit));
      labelMarker.on("click", () => setSelected(unit));

      const tooltipEl = labelMarker.getTooltip()?.getElement();
      if (tooltipEl) {
        tooltipEl.style.cursor = "pointer";
        tooltipEl.addEventListener("click", (e) => {
          e.stopPropagation();
          labelMarker.openPopup();
          setSelected(unit);
        });
      }
    });

    map.on("move zoom viewreset", updateConnectors);
    map.whenReady(() => window.setTimeout(updateConnectors, 100));

    return () => {
      map.off("move zoom viewreset", updateConnectors);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="panel-surface border-x-0 border-t-0 rounded-none">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-7">
          <div className="flex min-w-0 items-center gap-4 lg:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-panel p-2 sm:h-20 sm:w-20">
              <img src={logo} alt="Logo da Rede Mário Gatti" className="h-full w-full object-contain" />
            </div>

            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground sm:text-lg lg:text-[1.05rem]">
                Mapa Assistencial — Rede Mário Gatti
              </h1>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Unidades hospitalares e UPAs da rede em Campinas/SP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-auto">
            <div className="panel-surface relative overflow-hidden rounded-md px-4 py-3">
              <div className="absolute inset-0 bg-panel-grid opacity-70" aria-hidden="true" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold leading-none text-primary">{now.time}</div>
                  <div className="mt-1 text-[11px] capitalize text-muted-foreground">{now.date}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-5 lg:px-7">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="overflow-hidden rounded-md border-border bg-panel shadow-panel">
            <CardHeader className="border-b border-border bg-secondary px-4 py-3 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">Distribuição territorial das unidades</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Visualização operacional com destaque para hospitais e UPAs</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-full border-0 bg-brand-lime px-3 py-1 text-panel text-[11px] hover:bg-brand-lime">
                    <Cross className="h-3.5 w-3.5" /> Hospital
                  </Badge>
                  <Badge className="rounded-full border-0 bg-brand-orange px-3 py-1 text-primary-foreground hover:bg-brand-orange">
                    <MapPinned className="h-3.5 w-3.5" /> UPA
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[60vh] min-h-[420px] w-full sm:h-[68vh]" ref={mapElementRef} />
            </CardContent>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="rounded-md border-border bg-panel shadow-panel">
              <CardHeader className="border-b border-border bg-secondary px-4 py-3">
                <CardTitle className="text-sm font-bold">Resumo da rede</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-border bg-secondary p-3">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Unidades</div>
                    <div className="mt-1 text-3xl font-extrabold text-foreground">{stats.total}</div>
                  </div>
                  <div className="rounded-md border border-border bg-secondary p-3">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Atend./mês</div>
                    <div className="mt-1 text-3xl font-extrabold text-primary">{stats.monthlyCare}</div>
                  </div>
                </div>

                <div className="space-y-2 rounded-md border border-border bg-secondary p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hospitais</span>
                    <strong className="text-brand-lime">{stats.hospitals}</strong>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">UPAs</span>
                    <strong className="text-brand-orange">{stats.upas}</strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md border-border bg-panel shadow-panel">
              <CardHeader className="border-b border-border bg-secondary px-4 py-3">
                <CardTitle className="text-sm font-bold">Maior volume</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-4">
                <div className="rounded-md border border-border bg-secondary p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-foreground">{stats.highlight.nome}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Maior volume estimado de atendimentos mensais</div>
                    </div>
                    <Users className="mt-1 h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-4 text-4xl font-black leading-none text-primary">{stats.highlight.atend}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" /> Atualização contínua pela hora local do painel
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md border-border bg-panel shadow-panel sm:col-span-2 xl:col-span-1">
              <CardHeader className="border-b border-border bg-secondary px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                  <Info className="h-4 w-4 text-primary" /> Detalhes da unidade
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-4">
                {selected ? (
                  <div className="space-y-3">
                    <div className="rounded-md border border-border bg-secondary p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-foreground">{selected.nome}</div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            selected.tipo === "Hospital"
                              ? "bg-brand-lime text-panel"
                              : "bg-brand-orange text-primary-foreground"
                          }`}
                        >
                          {selected.tipo}
                        </span>
                      </div>
                      <div className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">Total / mês</div>
                      <div className="text-2xl font-extrabold text-primary">{selected.atend}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-md border border-border bg-secondary p-3">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Atend. Adulto</div>
                        <div className="mt-1 text-lg font-extrabold text-foreground">
                          {selected.adulto.toLocaleString("pt-BR")}
                        </div>
                      </div>
                      <div className="rounded-md border border-border bg-secondary p-3">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Atend. Pediátrico</div>
                        <div className="mt-1 text-lg font-extrabold text-foreground">
                          {selected.pediatrico.toLocaleString("pt-BR")}
                        </div>
                      </div>
                      <div className="rounded-md border border-border bg-secondary p-3">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Pac. em retaguarda</div>
                        <div className="mt-1 text-lg font-extrabold text-foreground">
                          {selected.retaguarda.toLocaleString("pt-BR")}
                        </div>
                      </div>
                      <div className="rounded-md border border-border bg-secondary p-3">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Evasões/Desist.</div>
                        <div className="mt-1 text-lg font-extrabold text-foreground">
                          {selected.evasoes.toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-border bg-secondary p-4 text-xs text-muted-foreground">
                    Clique em uma unidade no mapa para visualizar os detalhes assistenciais.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}