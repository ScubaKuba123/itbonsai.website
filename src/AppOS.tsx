import { CSSProperties, FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  CirclePlus,
  Clock3,
  Edit3,
  Flower2,
  Focus,
  Leaf,
  Menu,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sprout,
  Trash2,
  TreePine,
  X,
} from 'lucide-react';
import { BonsaiTaskTree } from './BonsaiTaskTree';
import { BonsaiTask, BranchId, TreeSpecies, ViewId, branches, currentSeason, seasons, treeLevel, treeSpecies } from './bonsai-data';
import { useBonsaiTasks } from './useBonsaiTasks';

const navItems: Array<{ id: ViewId; label: string; icon: typeof TreePine }> = [
  { id: 'tree', label: 'Drzewo', icon: TreePine },
  { id: 'today', label: 'Dzisiaj', icon: CalendarDays },
  { id: 'garden', label: 'Ogród', icon: Flower2 },
  { id: 'stats', label: 'Statystyki', icon: BarChart3 },
];

const polishDate = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });

function AppLogo() {
  return <div className="brand" aria-label="BonsAI"><span><TreePine aria-hidden="true" /></span><b>Bons<span>AI</span></b></div>;
}

type SidebarProps = {
  view: ViewId;
  open: boolean;
  focusMode: boolean;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
  onToggleFocus: () => void;
};

function Sidebar({ view, open, focusMode, onClose, onNavigate, onToggleFocus }: SidebarProps) {
  return (
    <aside className={`app-sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar-top"><AppLogo /><button className="icon-button sidebar-close" onClick={onClose} aria-label="Zamknij menu"><X /></button></div>
      <nav aria-label="Główna nawigacja">
        {navItems.map(({ id, label, icon: Icon }) => <button className={view === id ? 'is-active' : ''} onClick={() => { onNavigate(id); onClose(); }} key={id}><Icon aria-hidden="true" /><span>{label}</span><ChevronRight aria-hidden="true" /></button>)}
      </nav>
      <div className="sidebar-breath"><span className="breath-orbit"><i /></span><p>Spokojny wdech</p><small>Zwolnij na chwilę. Drzewo poczeka.</small></div>
      <button className={`focus-toggle ${focusMode ? 'is-on' : ''}`} onClick={onToggleFocus} aria-pressed={focusMode}><Focus aria-hidden="true" /><span><b>Tryb skupienia</b><small>{focusMode ? 'Włączony' : 'Wycisz rozpraszacze'}</small></span><i /></button>
      <div className="profile"><span>AN</span><div><b>Anna Nowak</b><small>Twój ogród jest zapisany</small></div></div>
    </aside>
  );
}

type HeaderProps = {
  query: string;
  focusMode: boolean;
  onQueryChange: (value: string) => void;
  onOpenMenu: () => void;
  onToggleFocus: () => void;
  onAdd: () => void;
};

function Header({ query, focusMode, onQueryChange, onOpenMenu, onToggleFocus, onAdd }: HeaderProps) {
  return (
    <header className="app-header">
      <button className="icon-button menu-button" onClick={onOpenMenu} aria-label="Otwórz menu"><Menu /></button>
      <label className="search-field"><Search aria-hidden="true" /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Znajdź zadanie…" />{query ? <button onClick={() => onQueryChange('')} aria-label="Wyczyść wyszukiwanie"><X /></button> : null}</label>
      <button className={`quiet-button ${focusMode ? 'is-active' : ''}`} onClick={onToggleFocus}><Leaf aria-hidden="true" /><span>{focusMode ? 'Wyłącz skupienie' : 'Tryb skupienia'}</span></button>
      <button className="header-add" onClick={onAdd}><Plus aria-hidden="true" /> Dodaj zadanie</button>
    </header>
  );
}

type TaskEditorProps = {
  task: BonsaiTask | null;
  defaultBranch: BranchId;
  onClose: () => void;
  onSave: (values: { title: string; branch: BranchId; note: string }) => void;
};

function TaskEditor({ task, defaultBranch, onClose, onSave }: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [branch, setBranch] = useState<BranchId>(task?.branch ?? defaultBranch);
  const [note, setNote] = useState(task?.note ?? '');
  const submit = (event: FormEvent) => { event.preventDefault(); if (title.trim()) onSave({ title: title.trim(), branch, note: note.trim() }); };
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="task-editor" onSubmit={submit} aria-label={task ? 'Edytuj zadanie' : 'Dodaj zadanie'}>
        <header><div><Leaf aria-hidden="true" /><span><small>{task ? 'Pielęgnuj liść' : 'Nowy liść'}</small><h2>{task ? 'Edytuj zadanie' : 'Dodaj zadanie'}</h2></span></div><button type="button" className="icon-button" onClick={onClose} aria-label="Zamknij"><X /></button></header>
        <label>Nazwa zadania<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Co chcesz zrobić?" maxLength={70} /></label>
        <label>Gałąź<select value={branch} onChange={(event) => setBranch(event.target.value as BranchId)}>{(Object.keys(branches) as BranchId[]).map((id) => <option value={id} key={id}>{branches[id].label}</option>)}</select></label>
        <label>Spokojna notatka <small>(opcjonalnie)</small><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Dodaj kontekst, jeśli go potrzebujesz…" maxLength={220} /></label>
        <footer><button type="button" className="button-secondary" onClick={onClose}>Anuluj</button><button className="button-primary"><Leaf aria-hidden="true" /> {task ? 'Zapisz zmiany' : 'Dodaj liść'}</button></footer>
      </form>
    </div>
  );
}

type TreeViewProps = {
  tasks: BonsaiTask[];
  allTasks: BonsaiTask[];
  selectedBranch: BranchId | 'all';
  selectedTaskId: string | null;
  fallingTaskId: string | null;
  onSelectBranch: (branch: BranchId | 'all') => void;
  onSelectTask: (id: string) => void;
  onComplete: (id: string) => void;
  onFallFinished: (id: string) => void;
  onAdd: (branch?: BranchId) => void;
  onEdit: (task: BonsaiTask) => void;
  onDelete: (id: string) => void;
  species: TreeSpecies;
  onSpeciesChange: (species: TreeSpecies) => void;
};

function TreeView({ tasks, allTasks, selectedBranch, selectedTaskId, fallingTaskId, onSelectBranch, onSelectTask, onComplete, onFallFinished, onAdd, onEdit, onDelete, species, onSpeciesChange }: TreeViewProps) {
  const activeTasks = tasks.filter((task) => !task.completedAt);
  const allActive = allTasks.filter((task) => !task.completedAt);
  const completedToday = allTasks.filter((task) => task.completedAt && new Date(task.completedAt).toDateString() === new Date().toDateString());
  const selectedTask = allTasks.find((task) => task.id === selectedTaskId) ?? null;
  const inspectorTasks = activeTasks.filter((task) => selectedBranch === 'all' || task.branch === selectedBranch);
  const progressTotal = allActive.length + completedToday.length;
  const progress = progressTotal ? Math.round((completedToday.length / progressTotal) * 100) : 0;
  const completedTotal = allTasks.filter((task) => task.completedAt).length;
  const level = treeLevel(completedTotal);
  const season = currentSeason();
  const growth = Math.min(1, 0.78 + completedTotal * 0.025);
  return (
    <div className="tree-view">
      <section className="tree-intro"><div><p>{polishDate.format(new Date())}</p><h1>Dzień dobry, Aniu.</h1><span>Zadbaj dziś o jedną ważną rzecz.</span></div><div className="level-status"><span>Poziom {level.level} · {level.title}</span><small>{level.current}/{level.needed} liści do kolejnego poziomu</small><i><i style={{ width: `${level.progress}%` }} /></i></div><div className="daily-progress" aria-label={`${completedToday.length} ukończonych dzisiaj`}><span><b>{completedToday.length}</b> ukończone dzisiaj</span><i><i style={{ width: `${progress}%` }} /></i></div></section>
      <div className="tree-layout">
        <section className="tree-stage">
          <div className="tree-meta"><span><Leaf /> {treeSpecies[species].label} · {seasons[season].label}</span><small>{seasons[season].description}</small></div>
          <BonsaiTaskTree tasks={activeTasks} selectedBranch={selectedBranch} selectedTaskId={selectedTaskId} fallingTaskId={fallingTaskId} onSelectBranch={onSelectBranch} onSelectTask={onSelectTask} onComplete={onComplete} onFallFinished={onFallFinished} species={species} season={season} growth={growth} />
          <div className="fallen-tray"><header><span><Sprout aria-hidden="true" /> Ukończone dzisiaj</span><small>{completedToday.length} liście</small></header><div>{completedToday.length ? completedToday.slice(0, 4).map((task) => <span className={`fallen-leaf leaf-${task.branch}`} key={task.id}><Check aria-hidden="true" />{task.title}</span>) : <p>Gdy ukończysz zadanie, jego liść spocznie tutaj.</p>}</div></div>
        </section>
        <aside className="branch-inspector">
          <div className="species-picker"><small>Gatunek Twojego drzewka</small><div>{(Object.keys(treeSpecies) as TreeSpecies[]).map((id) => <button className={species === id ? 'is-active' : ''} onClick={() => onSpeciesChange(id)} key={id}><i className={`species-symbol species-${id}`} /><span><b>{treeSpecies[id].label}</b><small>{treeSpecies[id].latin}</small></span></button>)}</div></div>
          <header><div><small>Wybrana gałąź</small><h2>{selectedBranch === 'all' ? 'Całe drzewo' : branches[selectedBranch].label}</h2></div><button className="icon-button" onClick={() => onSelectBranch('all')} aria-label="Pokaż wszystkie gałęzie"><TreePine /></button></header>
          <div className="branch-tabs" role="tablist" aria-label="Wybierz gałąź">{(Object.keys(branches) as BranchId[]).map((id) => <button className={selectedBranch === id ? 'is-active' : ''} onClick={() => onSelectBranch(id)} key={id}>{branches[id].label}</button>)}</div>
          <div className="inspector-list">{inspectorTasks.length ? inspectorTasks.map((task) => <button className={selectedTaskId === task.id ? 'is-selected' : ''} onClick={() => onSelectTask(task.id)} key={task.id}><span className={`task-dot dot-${task.branch}`} /><span><b>{task.title}</b><small>{branches[task.branch].description}</small></span><ChevronRight aria-hidden="true" /></button>) : <div className="empty-branch"><Sprout /><b>Ta gałąź ma przestrzeń.</b><span>Dodaj zadanie, gdy pojawi się coś ważnego.</span></div>}</div>
          {selectedTask && !selectedTask.completedAt ? <div className="task-detail"><small>Szczegóły liścia</small><h3>{selectedTask.title}</h3><p>{selectedTask.note || 'Bez dodatkowej notatki. Jedna rzecz, spokojnie.'}</p><div><button onClick={() => onComplete(selectedTask.id)}><Check /> Ukończ</button><button onClick={() => onEdit(selectedTask)} aria-label="Edytuj zadanie"><Edit3 /></button><button className="danger" onClick={() => onDelete(selectedTask.id)} aria-label="Usuń zadanie"><Trash2 /></button></div></div> : null}
          <button className="inspector-add" onClick={() => onAdd(selectedBranch === 'all' ? 'work' : selectedBranch)}><Plus /> Dodaj zadanie do gałęzi</button>
        </aside>
      </div>
    </div>
  );
}

function FocusTimer({ task }: { task: BonsaiTask | null }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!running || seconds <= 0) return undefined; const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000); return () => window.clearInterval(timer); }, [running, seconds]);
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const rest = String(seconds % 60).padStart(2, '0');
  return <section className="focus-timer"><div className="timer-ring"><span>{minutes}:{rest}</span><small>spokojnego skupienia</small></div><h2>{task?.title ?? 'Wybierz jedno zadanie'}</h2><p>{task?.note || 'Przez najbliższą chwilę liczy się tylko ten jeden liść.'}</p><div><button className="timer-play" onClick={() => setRunning((value) => !value)} disabled={!task}>{running ? <Pause /> : <Play />}{running ? 'Pauza' : 'Rozpocznij'}</button><button onClick={() => { setRunning(false); setSeconds(25 * 60); }} aria-label="Zresetuj minutnik"><RotateCcw /></button></div></section>;
}

type SimpleTaskListProps = { tasks: BonsaiTask[]; selected: string | null; onSelect: (id: string) => void; onComplete: (id: string) => void };
function SimpleTaskList({ tasks, selected, onSelect, onComplete }: SimpleTaskListProps) {
  return <div className="simple-task-list">{tasks.map((task) => <article className={selected === task.id ? 'is-selected' : ''} key={task.id}><button onClick={() => onComplete(task.id)} aria-label={`Ukończ: ${task.title}`}><Check /></button><button onClick={() => onSelect(task.id)}><span><b>{task.title}</b><small>{branches[task.branch].label}</small></span><ChevronRight /></button></article>)}</div>;
}

function TodayView({ tasks, onComplete }: { tasks: BonsaiTask[]; onComplete: (id: string) => void }) {
  const active = tasks.filter((task) => !task.completedAt);
  const [selected, setSelected] = useState<string | null>(active[0]?.id ?? null);
  const selectedTask = active.find((task) => task.id === selected) ?? active[0] ?? null;
  return <div className="subpage today-view"><header><div><p>Twój spokojny plan</p><h1>Dzisiaj</h1><span>Nie musisz zrobić wszystkiego. Zacznij od jednego liścia.</span></div><Clock3 /></header><div className="today-grid"><FocusTimer task={selectedTask} /><section className="today-list"><div className="section-heading"><span><Leaf /> Zadania na dziś</span><small>{active.length} otwartych</small></div><SimpleTaskList tasks={active} selected={selectedTask?.id ?? null} onSelect={setSelected} onComplete={onComplete} /></section></div></div>;
}

type GardenProps = { tasks: BonsaiTask[]; onRestore: (id: string) => void; onDelete: (id: string) => void };
function GardenView({ tasks, onRestore, onDelete }: GardenProps) {
  const completed = tasks.filter((task) => task.completedAt).sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  const plots = Array.from({ length: Math.max(1, Math.ceil(completed.length / 5)) }, (_, index) => ({ index, tasks: completed.slice(index * 5, index * 5 + 5), species: (['pine', 'maple', 'cherry'] as TreeSpecies[])[index % 3] }));
  return <div className="subpage garden-view"><header><div><p>Historia wzrostu</p><h1>Twój własny ogród</h1><span>Każde pięć ukończonych zadań wyrasta w osobne drzewko wspomnień.</span></div><Flower2 /></header><section className="memory-garden"><div className="garden-mist" />{plots.map((plot) => <article className={`garden-tree plot-${plot.species}`} key={plot.index}><div className="mini-tree"><i className="mini-crown crown-one" /><i className="mini-crown crown-two" /><i className="mini-trunk" /><i className="mini-pot" /></div><div><small>Grządka {String(plot.index + 1).padStart(2, '0')}</small><h2>{plot.tasks.length === 5 ? treeSpecies[plot.species].label : 'Młoda sadzonka'}</h2><p>{plot.tasks.length}/5 ukończonych zadań</p><i className="plot-progress"><i style={{ width: `${plot.tasks.length * 20}%` }} /></i></div></article>)}</section><section className="zen-garden"><div className="sand-lines" /><div className="section-heading"><span><Leaf /> Opadłe liście</span><small>{completed.length} ukończonych</small></div>{completed.length ? completed.map((task, index) => <article className={`garden-leaf leaf-${task.branch}`} style={{ '--garden-rotate': `${(index % 2 ? 1 : -1) * (4 + index * 2)}deg` } as CSSProperties} key={task.id}><Check /><span><b>{task.title}</b><small>{branches[task.branch].label} · {task.completedAt ? new Date(task.completedAt).toLocaleDateString('pl-PL') : ''}</small></span><div><button onClick={() => onRestore(task.id)} title="Przywróć zadanie"><RotateCcw /></button><button onClick={() => onDelete(task.id)} title="Usuń na stałe"><Trash2 /></button></div></article>) : <div className="garden-empty"><Sprout /><h2>Ogród czeka na pierwszy liść.</h2><p>Ukończ zadanie na drzewie, a pojawi się tutaj.</p></div>}</section></div>;
}

function StatsView({ tasks }: { tasks: BonsaiTask[] }) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completedAt).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return <div className="subpage stats-view"><header><div><p>Bez presji, z perspektywą</p><h1>Twój rytm</h1><span>Statystyki mają pomagać zauważać postęp, nie go oceniać.</span></div><BarChart3 /></header><div className="stats-grid"><section className="growth-score"><div className="score-ring" style={{ '--score': `${percent * 3.6}deg` } as CSSProperties}><span>{percent}%</span></div><h2>Twoje bonsai rośnie</h2><p>{completed} z {total} liści znalazło już swoje miejsce w ogrodzie.</p></section><section className="branch-growth"><div className="section-heading"><span><TreePine /> Równowaga gałęzi</span></div>{(Object.keys(branches) as BranchId[]).map((id) => { const branchTasks = tasks.filter((task) => task.branch === id); const done = branchTasks.filter((task) => task.completedAt).length; const value = branchTasks.length ? Math.round((done / branchTasks.length) * 100) : 0; return <div className="branch-bar" key={id}><span><b>{branches[id].label}</b><small>{done}/{branchTasks.length}</small></span><i><i style={{ width: `${value}%`, background: branches[id].color }} /></i><strong>{value}%</strong></div>; })}</section><section className="gentle-note"><Leaf /><h2>Mała obserwacja</h2><p>Najwięcej spokoju daje Ci zamykanie krótkich zadań z gałęzi „Dom”. Zachowaj ten rytm.</p></section></div></div>;
}

export function AppOS() {
  const { tasks, addTask, updateTask, completeTask, restoreTask, deleteTask } = useBonsaiTasks();
  const [view, setView] = useState<ViewId>('tree');
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<BranchId | 'all'>('health');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>('task-3');
  const [fallingTaskId, setFallingTaskId] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ task: BonsaiTask | null; branch: BranchId } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [species, setSpecies] = useState<TreeSpecies>(() => (localStorage.getItem('bonsai-os-species') as TreeSpecies | null) ?? 'pine');
  const filteredTasks = useMemo(() => { const clean = query.trim().toLocaleLowerCase('pl-PL'); return clean ? tasks.filter((task) => task.title.toLocaleLowerCase('pl-PL').includes(clean)) : tasks; }, [query, tasks]);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(null), 2600); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { if (!fallingTaskId) return undefined; const id = fallingTaskId; const timer = window.setTimeout(() => { completeTask(id); setFallingTaskId((current) => current === id ? null : current); setSelectedTaskId((current) => current === id ? null : current); setToast('Liść spokojnie opadł do ogrodu.'); }, 1250); return () => window.clearTimeout(timer); }, [fallingTaskId]);
  useEffect(() => { localStorage.setItem('bonsai-os-species', species); }, [species]);
  const beginComplete = (id: string) => { if (!fallingTaskId) setFallingTaskId(id); };
  const finishFall = (id: string) => { completeTask(id); setFallingTaskId((current) => current === id ? null : current); setSelectedTaskId((current) => current === id ? null : current); setToast('Liść spokojnie opadł do ogrodu.'); };
  const removeTask = (id: string) => { deleteTask(id); setSelectedTaskId((current) => current === id ? null : current); setToast('Zadanie zostało usunięte.'); };
  const saveEditor = (values: { title: string; branch: BranchId; note: string }) => { if (editor?.task) { updateTask(editor.task.id, values); setSelectedTaskId(editor.task.id); setToast('Zmiany zostały zapisane.'); } else { const task = addTask(values); setSelectedTaskId(task.id); setSelectedBranch(task.branch); setToast('Nowy liść wyrósł na drzewie.'); } setEditor(null); setView('tree'); };
  return (
    <div className={`bonsai-app ${focusMode ? 'focus-mode' : ''}`}>
      <Sidebar view={view} open={menuOpen} focusMode={focusMode} onClose={() => setMenuOpen(false)} onNavigate={setView} onToggleFocus={() => setFocusMode((value) => !value)} />
      {menuOpen ? <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="Zamknij menu" /> : null}
      <div className="app-workspace"><Header query={query} focusMode={focusMode} onQueryChange={setQuery} onOpenMenu={() => setMenuOpen(true)} onToggleFocus={() => setFocusMode((value) => !value)} onAdd={() => setEditor({ task: null, branch: selectedBranch === 'all' ? 'work' : selectedBranch })} /><main>{view === 'tree' ? <TreeView tasks={filteredTasks} allTasks={tasks} selectedBranch={selectedBranch} selectedTaskId={selectedTaskId} fallingTaskId={fallingTaskId} onSelectBranch={setSelectedBranch} onSelectTask={setSelectedTaskId} onComplete={beginComplete} onFallFinished={finishFall} onAdd={(branch = 'work') => setEditor({ task: null, branch })} onEdit={(task) => setEditor({ task, branch: task.branch })} onDelete={removeTask} species={species} onSpeciesChange={(value) => { setSpecies(value); setToast(`Wybrano drzewko: ${treeSpecies[value].label}.`); }} /> : null}{view === 'today' ? <TodayView tasks={filteredTasks} onComplete={beginComplete} /> : null}{view === 'garden' ? <GardenView tasks={filteredTasks} onRestore={(id) => { restoreTask(id); setToast('Liść wrócił na drzewo.'); }} onDelete={removeTask} /> : null}{view === 'stats' ? <StatsView tasks={tasks} /> : null}</main></div>
      <nav className="mobile-nav" aria-label="Nawigacja mobilna">{navItems.map(({ id, label, icon: Icon }) => <button className={view === id ? 'is-active' : ''} onClick={() => setView(id)} key={id}><Icon /><span>{label}</span></button>)}</nav>
      <button className="mobile-add" onClick={() => setEditor({ task: null, branch: selectedBranch === 'all' ? 'work' : selectedBranch })} aria-label="Dodaj zadanie"><CirclePlus /></button>
      {editor ? <TaskEditor task={editor.task} defaultBranch={editor.branch} onClose={() => setEditor(null)} onSave={saveEditor} /> : null}
      {toast ? <div className="toast-message" role="status"><Leaf />{toast}</div> : null}
    </div>
  );
}
