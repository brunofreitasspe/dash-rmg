import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Clock3, MapPinned } from "lucide-react";

import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

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

type AppHeaderProps = {
  title: string;
  subtitle: string;
};

const NAV = [
  { to: "/", label: "Mapa Assistencial", icon: MapPinned },
  { to: "/upcg", label: "Emergência UPCG", icon: Activity },
];

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const [now, setNow] = useState(() => formatClock(new Date()));
  const location = useLocation();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(formatClock(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="panel-surface border-x-0 border-t-0 rounded-none">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-7">
        <div className="flex min-w-0 items-center gap-4 lg:gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-panel p-2 sm:h-20 sm:w-20">
            <img src={logo} alt="Logo da Rede Mário Gatti" className="h-full w-full object-contain" />
          </div>

          <div className="min-w-0">
            <h1 className="text-base font-bold text-foreground sm:text-lg lg:text-[1.05rem]">{title}</h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-end lg:self-auto">
          <nav className="flex items-center gap-1 rounded-md border border-border bg-secondary p-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

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
  );
}
