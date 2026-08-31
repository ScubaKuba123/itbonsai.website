"use client";

import { FormEvent, useState } from "react";
import {
  Activity, BarChart3, Bell, BriefcaseBusiness, CalendarDays, Check, ChevronDown,
  ChevronRight, CircleDollarSign, FileText, FolderKanban, Gauge, Grid2X2,
  Inbox, LayoutDashboard, Menu, MessageCircle, Paperclip, Plus, Search, Send,
  Settings2, Sparkles, Target, Users, WandSparkles, X, Zap,
} from "lucide-react";

type NavItem = { id: string; label: string; icon: any; badge?: string };

const primaryNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "today", label: "Today", icon: CalendarDays },
  { id: "inbox", label: "Inbox", icon: Inbox, badge: "2" },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "tasks", label: "Tasks", icon: Check },
  { id: "notes", label: "Notes", icon: FileText },
];
const businessNav: NavItem[] = [
  { id: "leads", label: "Leads", icon: Target, badge: "23" },
  { id: "clients", label: "Clients", icon: Users, badge: "8" },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "work", label: "Zadania", icon: BriefcaseBusiness, badge: "12" },
  { id: "finance", label: "Finance", icon: CircleDollarSign },
  { id: "marketing", label: "Marketing", icon: WandSparkles },
  { id: "analytics", label: "Analityka", icon: BarChart3 },
];
const toolsNav: NavItem[] = [
  { id: "garden", label: "BonsAI Garden", icon: Sparkles },
  { id: "office", label: "BonsAI Office", icon: Grid2X2 },
  { id: "integrations", label: "Integrations", icon: Zap },
];

const metrics = [
  { value: "3", label: "Wymagają działania", note: "Zadania czekają na Ciebie", tone: "violet", icon: Check },
  { value: "2", label: "Odpowiedzi klientów", note: "Nowe wiadomości", tone: "amber", icon: Inbox },
  { value: "1", label: "Spotkanie dzisiaj", note: "16:00 — Montostal", tone: "blue", icon: CalendarDays },
  { value: "78%", label: "Postęp tygodnia", note: "12 z 16 zadań", tone: "pink", icon: Activity },
];
const projects = [
  { name: "Montostal Redesign", status: "W trakcie", progress: 70, image: "/style-grove.png" },
  { name: "Vanta Studio Website", status: "W trakcie", progress: 40, image: "/ygrassil-forest.png" },
  { name: "Mori Forest Retreat", status: "W trakcie", progress: 90, image: "/garden-central.png" },
  { name: "BonsAI Garden", status: "Planowanie", progress: 20, image: "/bonsai-tree-base.png" },
];
const pipeline = [
  { label: "Nowe", value: 46 }, { label: "Ocenione", value: 18 }, { label: "W kontakcie", value: 7 }, { label: "Oferta wysłana", value: 3 }, { label: "Klient", value: 2 },
];
const quickCommands = [
  { label: "Znajdź 20 firm w Australii", sub: "Potrzebna nowa strona", icon: Search },
  { label: "Przygotuj ofertę dla klienta", sub: "Montostal", icon: FileText },
  { label: "Analizuj rozmowę z klientem", sub: "Plik audio", icon: MessageCircle },
  { label: "Stwórz post na LinkedIn", sub: "O nowym projekcie", icon: WandSparkles },
];
const agents = [
  { name: "LUPUS", role: "Lead Hunter", color: "#a4d9c5", icon: "◈", text: "Znajduje i kwalifikuje leady, oszczędzając Twój czas." },
  { name: "NINJA", role: "Negotiation Coach", color: "#7fe7c4", icon: "◉", text: "Analizuje rozmowy i podpowiada najlepsze ruchy." },
  { name: "YGRASSIL", role: "Global Sales", color: "#e6c276", icon: "✣", text: "Prowadzi outbound na rynki międzynarodowe." },
];

function Brand() {
  return <div className="office-brand"><div className="office-mark"><Sparkles size={27} /></div><div><strong>BONSAI</strong><span>OFFICE</span></div></div>;
}

function NavGroup({ title, items, active, onSelect }: { title: string; items: NavItem[]; active: string; onSelect: (id: string) => void }) {
  return <section className="office-nav-group"><p>{title}</p>{items.map(({ id, label, icon: Icon, badge }) => <button key={id} className={`office-nav-item ${active === id ? "is-active" : ""}`} onClick={() => onSelect(id)}><Icon size={15} /><span>{label}</span>{badge && <b>{badge}</b>}</button>)}</section>;
}

function Sidebar({ active, onSelect, open, onClose }: { active: string; onSelect: (id: string) => void; open: boolean; onClose: () => void }) {
  return <aside className={`office-sidebar ${open ? "is-open" : ""}`}><div className="sidebar-header"><Brand /><button className="sidebar-close" onClick={onClose}><X size={18} /></button></div><div className="sidebar-scroll"><NavGroup title="DASHBOARD" items={primaryNav} active={active} onSelect={onSelect} /><NavGroup title="BIZNES" items={businessNav} active={active} onSelect={onSelect} /><NavGroup title="AGENTY AI" items={[{ id: "lupus", label: "Lupus", icon: Sparkles }, { id: "ninja", label: "Ninja", icon: Gauge }, { id: "ygrassil", label: "Ygrassil", icon: Activity }]} active={active} onSelect={onSelect} /><NavGroup title="PROJEKTY" items={toolsNav} active={active} onSelect={onSelect} /><NavGroup title="NARZĘDZIA" items={[{ id: "chat", label: "Chat z AI", icon: MessageCircle }, { id: "research", label: "Research", icon: Search }, { id: "files", label: "Pliki", icon: FolderKanban }, { id: "settings", label: "Ustawienia", icon: Settings2 }]} active={active} onSelect={onSelect} /></div><button className="studio-button" onClick={() => onSelect("studio")}><WandSparkles size={15} /><span>Bonsai Studio</span><ChevronRight size={14} /></button><div className="office-profile"><div className="profile-avatar">K</div><div><strong>Kuba</strong><span>Founder</span></div><ChevronDown size={15} /></div></aside>;
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return <header className="office-topbar"><button className="mobile-menu" onClick={onMenu}><Menu size={19} /></button><label className="office-search"><Search size={15} /><input placeholder="Szukaj w BonsAI Office..." /><kbd>Ctrl K</kbd></label><div className="top-actions"><button aria-label="Powiadomienia" className="notification"><Bell size={18} /><i>3</i></button><button aria-label="Tryb jasności"><Sparkles size={18} /></button><button aria-label="Pomoc"><span className="top-glyph">?</span></button><button aria-label="Widok"><Grid2X2 size={17} /></button><div className="top-user"><span>👨🏻‍💻</span><strong>Kuba</strong><ChevronDown size={14} /></div></div></header>;
}

function MetricCard({ metric }: { metric: typeof metrics[number] }) {
  const Icon = metric.icon;
  return <button className="metric-card"><div className={`metric-icon ${metric.tone}`}><Icon size={20} /></div><div className="metric-copy"><strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.note}</small></div><ChevronRight size={17} /></button>;
}

function PipelineCard({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return <section className="office-card pipeline-card"><div className="card-heading"><h2>LEAD PIPELINE</h2><button onClick={() => onSelect(0)}>Zobacz wszystkie leady <ChevronRight size={13} /></button></div><div className="funnel">{pipeline.map((item, index) => <button key={item.label} className={`funnel-row funnel-${index} ${selected === index ? "is-selected" : ""}`} onClick={() => onSelect(index)}><span>{item.label}</span><strong>{item.value}</strong></button>)}</div><button className="card-link" onClick={() => onSelect(0)}>Zobacz wszystkie leady <ChevronRight size={14} /></button></section>;
}

function ProjectsCard({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return <section className="office-card projects-card"><div className="card-heading"><h2>AKTYWNE PROJEKTY</h2><button onClick={() => onSelect(0)}>Zobacz wszystkie <ChevronRight size={13} /></button></div><div className="project-list">{projects.map((project, index) => <button className={`project-row ${selected === index ? "is-selected" : ""}`} key={project.name} onClick={() => onSelect(index)}><img src={project.image} alt="" /><div className="project-info"><strong>{project.name}</strong><span>{project.status}</span><div className="project-progress"><i style={{ width: `${project.progress}%` }} /><b>{project.progress}%</b></div></div></button>)}</div></section>;
}

function QuickCard({ onCommand }: { onCommand: (text: string) => void }) {
  return <section className="office-card quick-card"><div className="card-heading"><h2>SZYBKIE POLECENIA</h2></div><div className="quick-list">{quickCommands.map(({ label, sub, icon: Icon }) => <button key={label} onClick={() => onCommand(`${label} — ${sub}`)}><span className="quick-icon"><Icon size={15} /></span><span><strong>{label}</strong><small>({sub})</small></span></button>)}</div><button className="new-command" onClick={() => onCommand("")}><Plus size={14} /> Nowe polecenie</button></section>;
}

const growthBranches = [
  { id: "focus", path: "M130 165 C111 145 87 133 57 128", leaves: [[49, 120], [61, 113], [72, 123], [83, 111], [94, 126], [105, 119]] },
  { id: "delivery", path: "M133 152 C145 133 158 118 177 105", leaves: [[163, 99], [174, 88], [185, 101], [194, 88], [204, 96], [184, 112]] },
  { id: "sales", path: "M128 133 C111 112 103 91 104 67", leaves: [[92, 60], [104, 50], [116, 58], [96, 76], [111, 73], [122, 63], [128, 50]] },
  { id: "vision", path: "M135 113 C151 91 173 79 204 70", leaves: [[175, 63], [187, 53], [200, 60], [212, 49], [222, 61], [208, 75], [193, 78], [219, 80]] },
] as const;

const canopyClouds = [[76, 119, 31, 15], [184, 98, 32, 16], [106, 61, 29, 15], [204, 67, 34, 16]] as const;

function GrowthTree({ className = "" }: { className?: string }) {
  const totalLeaves = growthBranches.reduce((sum, branch) => sum + branch.leaves.length, 0);
  return <div className={`growth-tree ${className}`} role="img" aria-label={`Drzewko wzrostu biura: ${totalLeaves} liści na 4 gałęziach`}><svg viewBox="0 0 260 240" aria-hidden="true"><defs><radialGradient id="tree-core" cx="50%" cy="45%"><stop offset="0" stopColor="#d6fff1" stopOpacity=".95" /><stop offset=".45" stopColor="#7fe7c4" stopOpacity=".38" /><stop offset="1" stopColor="#183d34" stopOpacity="0" /></radialGradient><radialGradient id="tree-canopy" cx="50%" cy="38%"><stop offset="0" stopColor="#d9fff0" /><stop offset=".35" stopColor="#8de3d1" /><stop offset=".78" stopColor="#68bca5" /><stop offset="1" stopColor="#276b5c" stopOpacity=".22" /></radialGradient><linearGradient id="tree-trunk" x1="0" x2="1"><stop stopColor="#4b8b79" /><stop offset=".5" stopColor="#b9ffe8" /><stop offset="1" stopColor="#5fc5aa" /></linearGradient><linearGradient id="tree-pot" x1="0" x2="1"><stop stopColor="#183d34" /><stop offset=".5" stopColor="#0b1714" /><stop offset="1" stopColor="#275b4f" /></linearGradient></defs><circle cx="133" cy="111" r="74" fill="url(#tree-core)" opacity=".64" />{canopyClouds.map(([cx, cy, rx, ry]) => <ellipse className="canopy-cloud" key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />)}<path d="M130 183 C121 157 126 136 132 116 C138 96 138 76 132 53" fill="none" stroke="url(#tree-trunk)" strokeWidth="11" strokeLinecap="round" /><path d="M129 179 C146 158 150 137 150 119" fill="none" stroke="#9af5d5" strokeWidth="4" strokeLinecap="round" opacity=".78" />{growthBranches.map((branch) => <g className="growth-branch" key={branch.id}><path d={branch.path} fill="none" stroke="#7fe7c4" strokeWidth="5" strokeLinecap="round" /><path d={branch.path} fill="none" stroke="#d6fff1" strokeWidth="1.5" strokeLinecap="round" opacity=".92" />{branch.leaves.map(([cx, cy]) => <circle className="growth-leaf" key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" />)}</g>)}<path d="M115 178 Q132 171 150 178 L157 195 Q132 204 107 195 Z" fill="url(#tree-pot)" stroke="#9af5d5" strokeWidth="1.5" /><path d="M108 194 Q132 202 157 194" fill="none" stroke="#b9ffe8" strokeWidth="1.2" opacity=".8" /><ellipse cx="132" cy="207" rx="45" ry="7" fill="none" stroke="#7fe7c4" strokeWidth="1.2" opacity=".75" /></svg><div className="growth-tree-count"><strong>{totalLeaves} liści</strong><span>4 gałęzie wzrostu</span></div></div>;
}

function CyberBonsai() {
  const [expanded, setExpanded] = useState(false);
  const [activeNode, setActiveNode] = useState("Leads");
  const nodes = [
    ["node-leads", "Leads", Target], ["node-projects", "Projekty", BriefcaseBusiness], ["node-finance", "Finanse", CircleDollarSign],
    ["node-clients", "Klienci", Users], ["node-marketing", "Marketing", BarChart3], ["node-auto", "Automatyzacje", Settings2],
  ] as const;
  return <section className="visual-column"><div className="visual-card"><div className="visual-heading"><div><h2>WIZUALNA KONCEPCJA</h2><p>Małe drzewko wzrostu biura.<br />Każdy liść to kolejny krok naprzód.</p></div><button onClick={() => setExpanded(true)}>Otwórz pełny widok <ChevronRight size={13} /></button></div><div className="cyber-stage"><div className="neon-halo" aria-hidden="true" /><div className="orbit orbit-a" /><div className="orbit orbit-b" /><svg className="node-connectors" viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true"><path d="M300 205 C240 175 172 145 76 128" /><path d="M300 215 C235 210 170 203 76 198" /><path d="M300 228 C235 245 170 261 76 278" /><path d="M300 205 C362 172 432 140 524 118" /><path d="M300 218 C365 208 436 195 524 188" /><path d="M300 230 C365 246 438 264 524 272" /></svg><GrowthTree /><div className="ground-ring ring-one" aria-hidden="true" /><div className="ground-ring ring-two" aria-hidden="true" />{nodes.map(([className, label, Icon]) => <button className={`node ${activeNode === label ? "is-active" : ""} ${className.includes("node-clients") || className.includes("node-marketing") || className.includes("node-auto") ? "node-right" : "node-left"} ${className}`} key={label} onClick={() => setActiveNode(label)} aria-pressed={activeNode === label}><Icon size={14} /><span>{label}</span></button>)}</div></div><div className="mobile-preview"><h2>WERSJA MOBILNA</h2><p>Pełna kontrola nad biznesem w Twojej kieszeni.</p><div className="phone-row"><div className="phone"><b>Today</b><span>3</span><span>2</span><span>78%</span></div><div className="phone"><b>Leads</b><em>Nowe 46</em><em>Ocenione 18</em><em>Klient 2</em></div><div className="phone"><b>Projekty</b><em>Montostal</em><em>Vanta Studio</em></div><div className="phone"><b>Ninja</b><div className="wave">∿∿∿∿</div><em>Analizuj rozmowę</em></div></div></div>{expanded && <div className="visual-modal" role="dialog" aria-modal="true" aria-label="Pełny widok wizualizacji BonsAI"><div className="visual-modal-card"><button className="visual-modal-close" onClick={() => setExpanded(false)} aria-label="Zamknij pełny widok"><X size={19} /></button><span>WIZUALNA KONCEPCJA</span><h2>BonsAI Office — inteligentny ekosystem biznesu</h2><GrowthTree className="growth-tree-modal" /><p>Aktywna gałąź: <strong>{activeNode}</strong></p></div></div>}</section>;
}

function AiBar({ command, setCommand, response, onSend, onCommand }: { command: string; setCommand: (v: string) => void; response: string; onSend: (event: FormEvent) => void; onCommand: (v: string) => void }) {
  return <section className="ai-card"><div className="ai-lines" /><h2>Jak mogę Ci dzisiaj pomóc, <span>Kuba?</span></h2><div className="suggestions">{["Aktualizuj pipeline leads", "Przeanalizuj spotkanie", "Znajdź nowe zlecenia", "Raport finansowy"].map((item) => <button key={item} onClick={() => onCommand(item)}>{item}</button>)}</div><form onSubmit={onSend} className="ai-input-wrap"><input value={command} onChange={(e) => setCommand(e.target.value)} placeholder="Napisz polecenie..." aria-label="Polecenie dla AI" /><div className="input-tools"><Paperclip size={17} /><span>▧</span><span>⌘</span><span>♩</span></div><button className="ai-send" aria-label="Wyślij polecenie"><Send size={18} /></button></form>{response && <div className="ai-response"><Sparkles size={14} /><span>{response}</span></div>}</section>;
}

function BottomPanels({ agent, setAgent }: { agent: number; setAgent: (i: number) => void }) {
  return <div className="bottom-panels"><section className="office-card architecture"><div className="card-heading"><h2>ARCHITEKTURA SYSTEMU</h2></div><div className="architecture-map"><div className="map-user">Użytkownik<span>● ● ●</span></div><div className="map-layer">AI ORCHESTRATION LAYER<small>OpenAI API / Przepływy AI</small><div><span>Web Search</span><span>Files</span><span>Code Interpreter</span></div></div><div className="map-integrations">Integrations<div>✉　◈　◫<br />◌　◉　◍</div></div><div className="map-db">BAZA DANYCH <span>Projekty　Leads　Klienci　Zadania　Finanse</span></div></div></section><section className="office-card agents"><div className="card-heading"><h2>AGENTY AI — TWÓJ ZESPÓŁ 24/7</h2></div><div className="agent-list">{agents.map((item, index) => <button key={item.name} className={`agent-card ${agent === index ? "is-selected" : ""}`} onClick={() => setAgent(index)} style={{ "--agent": item.color } as React.CSSProperties}><div className="agent-avatar">{item.icon}</div><strong>{item.name}</strong><span>{item.role}</span><small>{item.text}</small></button>)}</div><button className="more-agents">+ Więcej agentów wkrótce...</button></section><section className="office-card benefits"><div className="card-heading"><h2>KLUCZOWE ZALETY</h2></div>{["Wszystko w jednym miejscu", "Struktura dopasowana do Twojego biznesu", "AI rozumie kontekst Twojej pracy", "Automatyzacja powtarzalnych zadań", "Oszczędność czasu i więcej klientów", "Pełna kontrola z dowolnego urządzenia", "Bezpieczeństwo i prywatność danych"].map((item) => <p key={item}><Check size={14} />{item}</p>)}</section><section className="office-card technology"><div className="card-heading"><h2>TECHNOLOGIE (PROPOZYCJA)</h2></div>{["Frontend: Next.js + Tailwind CSS + Framer Motion", "Backend: Node.js / Python (FastAPI)", "AI: OpenAI API (GPT-4o)", "Database: PostgreSQL / MongoDB", "Infra: Vercel / AWS", "Integracje: REST API / Webhooks", "Auth & Security: NextAuth / JWT / 2FA"].map((item, i) => <p key={item}><span>{["◈", "⌘", "✣", "▦", "△", "∞", "◉"][i]}</span>{item}</p>)}</section></div>;
}

function ContextView({ active, onBack }: { active: string; onBack: () => void }) {
  const labels: Record<string, [string, string]> = { today: ["Today", "Twój spokojny plan na dziś."], inbox: ["Inbox", "2 nowe wiadomości czekają na odpowiedź."], calendar: ["Calendar", "Najbliższe spotkanie: 16:00 — Montostal."], tasks: ["Tasks", "12 zadań ma aktywny kontekst."], notes: ["Notes", "Twoje notatki i pomysły w jednym miejscu."], leads: ["Leads", "46 nowych szans w pipeline."], clients: ["Clients", "8 aktywnych relacji z klientami."], projects: ["Projects", "4 projekty są obecnie w toku."], finance: ["Finance", "Finanse i przepływy Twojego biznesu."], marketing: ["Marketing", "Kampanie, treści i następne publikacje."], analytics: ["Analityka", "Postęp tygodnia wynosi 78%."], garden: ["BonsAI Garden", "Twoje wykonane zadania zakwitają tutaj."], integrations: ["Integrations", "Połącz narzędzia, których używasz codziennie."], chat: ["Chat z AI", "Porozmawiaj z kontekstem swojego biznesu."], research: ["Research", "Zebrane informacje i inspiracje."], files: ["Pliki", "Dokumenty projektów w jednym widoku."], settings: ["Ustawienia", "Dopasuj BonsAI Office do swojego rytmu."], lupus: ["Lupus", "Lead Hunter jest gotowy do pracy."], ninja: ["Ninja", "Negotiation Coach czeka na rozmowę."], ygrassil: ["Ygrassil", "Global Sales rozszerza zasięg."], work: ["Zadania", "Zadania Twojego zespołu."], office: ["BonsAI Office", "Centrum dowodzenia biznesem z AI."], studio: ["Bonsai Studio", "Kreatywne centrum wszystkich produktów BonsAI."] };
  const [title, body] = labels[active] ?? labels.dashboard ?? ["Dashboard", "Centrum dowodzenia biznesem z AI."];
  return <div className="context-view"><span className="context-kicker">BonsAI Office / widok</span><h1>{title}</h1><p>{body}</p><button onClick={onBack}>Wróć do dashboardu <ChevronRight size={15} /></button></div>;
}

export function OfficeShell() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pipelineSelected, setPipelineSelected] = useState(0);
  const [projectSelected, setProjectSelected] = useState(0);
  const [agentSelected, setAgentSelected] = useState(0);
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const handleCommand = (value: string) => { setCommand(value); setResponse(""); setActive("dashboard"); };
  const send = (event: FormEvent) => { event.preventDefault(); if (!command.trim()) return; setResponse(`Przyjęte. Przygotuję dla Ciebie: „${command.trim()}”.`); };
  const dashboard = active === "dashboard" || active === "office";
  return <div className="office-shell"><Sidebar active={active} onSelect={(id) => { setActive(id); setSidebarOpen(false); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="office-main"><Topbar onMenu={() => setSidebarOpen(true)} />{dashboard ? <main className="office-dashboard"><div className="dashboard-date">DZIŚ — ŚRODA, 30 SIERPNIA 2026</div><div className="dashboard-grid"><section className="main-column"><div className="metrics-grid">{metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</div><div className="work-grid"><PipelineCard selected={pipelineSelected} onSelect={setPipelineSelected} /><ProjectsCard selected={projectSelected} onSelect={setProjectSelected} /><QuickCard onCommand={handleCommand} /></div><AiBar command={command} setCommand={setCommand} response={response} onSend={send} onCommand={handleCommand} /><BottomPanels agent={agentSelected} setAgent={setAgentSelected} /></section><CyberBonsai /></div></main> : <ContextView active={active} onBack={() => setActive("dashboard")} />}</div><footer className="office-footer"><span>BonsAI Office — Twoje centrum dowodzenia biznesem z AI.</span><span>Skup się na tym, co ważne. Resztę zrobimy razem.</span><span>KONCEPCJA v1.0　 MAJ 2026</span></footer><nav className="mobile-bottom"><button className={active === "dashboard" ? "is-active" : ""} onClick={() => setActive("dashboard")}><LayoutDashboard size={17} /><span>Dashboard</span></button><button className={active === "today" ? "is-active" : ""} onClick={() => setActive("today")}><CalendarDays size={17} /><span>Today</span></button><button className={active === "leads" ? "is-active" : ""} onClick={() => setActive("leads")}><Target size={17} /><span>Leads</span></button><button className={active === "projects" ? "is-active" : ""} onClick={() => setActive("projects")}><FolderKanban size={17} /><span>Projekty</span></button></nav></div>;
}





