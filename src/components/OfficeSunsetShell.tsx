import { FormEvent, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  FileText,
  FolderKanban,
  Grid2X2,
  HelpCircle,
  Mail,
  Menu,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import './office-sunset.css';

type IconType = React.ComponentType<{ size?: number; strokeWidth?: number }>;

type NavItem = {
  id: string;
  label: string;
  icon: IconType;
};

const primaryNavigation: NavItem[] = [
  { id: 'dashboard', label: 'Pulpit', icon: Grid2X2 },
  { id: 'clients', label: 'Klienci', icon: Users },
  { id: 'messages', label: 'Wiadomości', icon: Mail },
  { id: 'tasks', label: 'Zadania', icon: Check },
  { id: 'decisions', label: 'Decyzje', icon: Target },
  { id: 'calendar', label: 'Kalendarz', icon: CalendarDays },
];

const secondaryNavigation: NavItem[] = [
  { id: 'reports', label: 'Raporty', icon: BarChart3 },
  { id: 'notes', label: 'Notatki', icon: FileText },
  { id: 'files', label: 'Pliki', icon: FolderKanban },
];

const attentionItems = [
  {
    title: 'Montostal – przegląd redesignu',
    description: 'Klient czeka na Twoją opinię od 2 dni',
    due: 'Dziś',
    tone: 'danger',
    icon: CircleAlert,
  },
  {
    title: 'Nowy lead – zapytanie o stronę',
    description: 'Wartość szacunkowa: 3 900 PLN',
    due: 'Dziś',
    tone: 'warm',
    icon: MessageCircle,
  },
  {
    title: 'WhipSport – brakuje informacji',
    description: 'Przygotuj odpowiedź lub dopytaj o szczegóły',
    due: 'Jutro',
    tone: 'gold',
    icon: Mail,
  },
];

const schedule = [
  { time: '16:00', title: 'Spotkanie z klientem', project: 'Montostal' },
  { time: '17:00', title: 'Przegląd redesignu', project: 'Montostal' },
  { time: '18:00', title: 'Follow-up', project: 'WhipSport' },
];

const suggestions = [
  { label: 'Co wymaga mojej uwagi?', icon: CircleAlert },
  { label: 'Przygotuj odpowiedź dla klienta', icon: MessageCircle },
  { label: 'Co mnie dzisiaj blokuje?', icon: CalendarDays },
  { label: 'Kogo klienci potrzebują follow-upu?', icon: Users },
];

const contextCopy: Record<string, [string, string]> = {
  clients: ['Klienci', 'Relacje, kontakty i najważniejsze kolejne kroki.'],
  messages: ['Wiadomości', 'Cała komunikacja z klientami w jednym miejscu.'],
  tasks: ['Zadania', 'Spokojna lista rzeczy, które naprawdę trzeba zrobić.'],
  decisions: ['Decyzje', 'Tematy, które czekają na Twoją zgodę lub kierunek.'],
  calendar: ['Kalendarz', 'Spotkania i priorytety rozłożone w czasie.'],
  reports: ['Raporty', 'Najważniejsze liczby bez zbędnego szumu.'],
  notes: ['Notatki', 'Pomysły i ustalenia zawsze pod ręką.'],
  files: ['Pliki', 'Dokumenty powiązane z projektami i klientami.'],
  more: ['Więcej', 'Pozostałe narzędzia BonsAI Office.'],
};

function BonsaiGlyph() {
  return (
    <svg className="sunset-brand__glyph" viewBox="0 0 70 70" aria-hidden="true">
      <path d="M35 62c-8-11-6-20-1-29 5-8 6-15 2-24" />
      <path d="M34 46c-9-11-18-14-27-11M36 38c10-9 18-11 28-8M34 28c-6-8-13-10-20-8M38 20c6-6 12-8 19-5" />
      <path className="sunset-brand__leaf" d="M3 32c8-8 17-8 27-1-6 8-17 10-27 1ZM41 27c7-8 17-9 25-2-5 8-15 10-25 2ZM8 17c7-7 15-7 24-1-5 7-14 9-24 1ZM40 12c6-6 14-6 21-1-5 6-12 7-21 1Z" />
      <path d="M17 62h38M22 66h28" />
    </svg>
  );
}

function Sidebar({
  active,
  open,
  onClose,
  onSelect,
}: {
  active: string;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const renderNav = (items: NavItem[]) =>
    items.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        className={`sunset-nav__item ${active === id ? 'is-active' : ''}`}
        onClick={() => onSelect(id)}
        aria-current={active === id ? 'page' : undefined}
      >
        <Icon size={19} strokeWidth={1.8} />
        <span>{label}</span>
      </button>
    ));

  return (
    <aside className={`sunset-sidebar ${open ? 'is-open' : ''}`}>
      <div className="sunset-sidebar__top">
        <div className="sunset-brand" aria-label="BonsAI Office">
          <BonsaiGlyph />
          <div><strong>BONSAI</strong><span>OFFICE</span></div>
        </div>
        <button className="sunset-sidebar__close" onClick={onClose} aria-label="Zamknij menu"><X size={20} /></button>
      </div>

      <nav className="sunset-nav" aria-label="Główna nawigacja">
        <div className="sunset-nav__group">{renderNav(primaryNavigation)}</div>
        <div className="sunset-nav__group sunset-nav__group--secondary">{renderNav(secondaryNavigation)}</div>
        <div className="sunset-nav__group sunset-nav__group--more">
          <button className={`sunset-nav__item ${active === 'more' ? 'is-active' : ''}`} onClick={() => onSelect('more')}>
            <span className="sunset-nav__dots">•••</span><span>Więcej</span><ChevronRight size={17} />
          </button>
        </div>
      </nav>

      <button className="sunset-profile" type="button">
        <span className="sunset-profile__avatar">KS</span>
        <span className="sunset-profile__copy"><strong>Kuba Seba</strong><small>Owner</small></span>
        <i aria-label="Online" />
      </button>
    </aside>
  );
}

function Header({ onMenu, onNotify }: { onMenu: () => void; onNotify: () => void }) {
  return (
    <header className="sunset-header">
      <button className="sunset-mobile-menu" onClick={onMenu} aria-label="Otwórz menu"><Menu size={20} /></button>
      <div className="sunset-greeting">
        <h1>Dzień dobry, Kuba <span aria-hidden="true">👋</span></h1>
        <p>Niedziela, 31 sierpnia 2026</p>
      </div>
      <label className="sunset-search">
        <Search size={19} strokeWidth={1.8} />
        <input type="search" placeholder="Szukaj w BonsAI Office..." aria-label="Szukaj w BonsAI Office" />
        <kbd>⌘ K</kbd>
      </label>
      <div className="sunset-header__actions">
        <button className="sunset-icon-button sunset-notification" onClick={onNotify} aria-label="Powiadomienia">
          <Bell size={22} strokeWidth={1.7} /><span>3</span>
        </button>
        <button className="sunset-icon-button" aria-label="Aktywność"><Activity size={24} strokeWidth={1.6} /></button>
        <button className="sunset-icon-button" aria-label="Pomoc"><HelpCircle size={23} strokeWidth={1.6} /></button>
        <button className="sunset-header-profile" type="button">
          <span className="sunset-header-profile__avatar">KS</span><strong>Kuba</strong><ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

function AttentionCard({ onOpen }: { onOpen: (message: string) => void }) {
  const [selected, setSelected] = useState(0);
  return (
    <section className="sunset-panel sunset-attention">
      <div className="sunset-panel__heading"><h2>WYMAGA UWAGI</h2><span className="sunset-count">3</span></div>
      <div className="sunset-attention__list">
        {attentionItems.map(({ title, description, due, tone, icon: Icon }, index) => (
          <button
            key={title}
            className={`sunset-attention__row ${selected === index ? 'is-selected' : ''}`}
            onClick={() => { setSelected(index); onOpen(title); }}
          >
            <span className={`sunset-attention__icon sunset-attention__icon--${tone}`}><Icon size={24} strokeWidth={1.7} /></span>
            <span className="sunset-attention__copy"><strong>{title}</strong><small>{description}</small></span>
            <span className="sunset-attention__due">{due}</span><ChevronRight size={18} />
          </button>
        ))}
      </div>
      <button className="sunset-panel__link" onClick={() => onOpen('Wszystkie elementy wymagające uwagi')}>Zobacz wszystkie <ArrowRight size={18} /></button>
    </section>
  );
}

function TodayCard({ onOpen }: { onOpen: (message: string) => void }) {
  return (
    <section className="sunset-panel sunset-today">
      <div className="sunset-panel__heading sunset-panel__heading--stack"><h2>DZISIAJ</h2><p>3 spotkania • 6 zadań</p></div>
      <div className="sunset-timeline">
        {schedule.map((item) => (
          <button key={item.time} className="sunset-timeline__item" onClick={() => onOpen(`${item.time} — ${item.title}`)}>
            <time>{item.time}</time><span className="sunset-timeline__dot" />
            <span className="sunset-timeline__copy"><strong>{item.title}</strong><small>{item.project}</small></span>
          </button>
        ))}
      </div>
      <button className="sunset-panel__link" onClick={() => onOpen('Kalendarz na dziś')}>Zobacz kalendarz <ArrowRight size={18} /></button>
    </section>
  );
}

function HeroArtwork() {
  return (
    <section className="sunset-hero" aria-label="Bonsai symbolizujące skupienie i rozwój">
      <div className="sunset-hero__glow" aria-hidden="true" />
      <div className="sunset-hero__copy"><p>Skup się na tym, co ważne.</p><strong>Resztą zajmą się Agenci.</strong></div>
    </section>
  );
}

function NinjaCommand({ onMessage }: { onMessage: (message: string) => void }) {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = command.trim();
    if (!trimmed) return;
    const next = `Ninja analizuje: „${trimmed}”`;
    setResponse(next);
    onMessage(next);
  };

  return (
    <section className="sunset-ninja">
      <div className="sunset-ninja__orb" aria-hidden="true"><Sparkles size={34} strokeWidth={1.6} /></div>
      <form className="sunset-ninja__form" onSubmit={submit}>
        <label htmlFor="ninja-command">NINJA – AI Command</label>
        <div className="sunset-ninja__question">
          <input id="ninja-command" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="W czym mogę Ci dziś pomóc?" />
          <button className="sunset-ninja__send" type="submit" aria-label="Wyślij polecenie"><Send size={24} /></button>
        </div>
        <div className="sunset-ninja__suggestions">
          {suggestions.map(({ label, icon: Icon }) => (
            <button key={label} type="button" onClick={() => { setCommand(label); setResponse(''); }}>
              <Icon size={19} strokeWidth={1.7} /><span>{label}</span>
            </button>
          ))}
        </div>
        <p className={`sunset-ninja__response ${response ? 'is-visible' : ''}`} aria-live="polite">{response}</p>
      </form>
    </section>
  );
}

function ContextPanel({ active, onBack }: { active: string; onBack: () => void }) {
  const [title, description] = contextCopy[active] ?? ['BonsAI Office', 'Twoje centrum dowodzenia.'];
  return (
    <main className="sunset-context">
      <span>SECTION / {active.toUpperCase()}</span><h1>{title}</h1><p>{description}</p>
      <button onClick={onBack}>Wróć do pulpitu <ArrowRight size={18} /></button>
    </main>
  );
}

export function OfficeSunsetShell() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const dashboard = active === 'dashboard';

  const select = (id: string) => {
    setActive(id);
    setSidebarOpen(false);
    setToast('');
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  return (
    <div className="sunset-office">
      <Sidebar active={active} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelect={select} />
      {sidebarOpen && <button className="sunset-sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Zamknij menu" />}
      <div className="sunset-workspace">
        <Header onMenu={() => setSidebarOpen(true)} onNotify={() => notify('Masz 3 elementy wymagające uwagi.')} />
        {dashboard ? (
          <main className="sunset-dashboard">
            <div className="sunset-dashboard__top">
              <AttentionCard onOpen={notify} />
              <TodayCard onOpen={notify} />
              <HeroArtwork />
            </div>
            <NinjaCommand onMessage={notify} />
          </main>
        ) : <ContextPanel active={active} onBack={() => setActive('dashboard')} />}
        <footer className="sunset-footer"><span>BonsAI Office v1.0.0</span><span>Twój biznes. Twoje centrum dowodzenia.</span><span>© 2026 BonsAI Technology</span></footer>
      </div>
      <div className={`sunset-toast ${toast ? 'is-visible' : ''}`} role="status">{toast}</div>
    </div>
  );
}
