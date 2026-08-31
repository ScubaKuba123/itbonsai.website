export type BranchId = 'work' | 'health' | 'home' | 'growth';
export type ViewId = 'tree' | 'today' | 'garden' | 'stats';
export type TreeSpecies = 'pine' | 'maple' | 'cherry';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type BonsaiTask = {
  id: string;
  title: string;
  branch: BranchId;
  note: string;
  createdAt: string;
  completedAt: string | null;
};

export const branches: Record<BranchId, { label: string; description: string; color: string }> = {
  work: { label: 'Praca', description: 'Projekty i obowiązki', color: '#d9b86c' },
  health: { label: 'Zdrowie', description: 'Ciało i równowaga', color: '#9fcb76' },
  home: { label: 'Dom', description: 'Spokojna codzienność', color: '#c8a77b' },
  growth: { label: 'Rozwój', description: 'Nauka i ciekawość', color: '#b6c984' },
};

export const treeSpecies: Record<TreeSpecies, { label: string; latin: string; description: string }> = {
  pine: { label: 'Sosna', latin: 'Pinus', description: 'Wytrwała i spokojna' },
  maple: { label: 'Klon', latin: 'Acer', description: 'Zmienia się z porami roku' },
  cherry: { label: 'Wiśnia', latin: 'Sakura', description: 'Delikatna i uważna' },
};

export const seasons: Record<Season, { label: string; description: string }> = {
  spring: { label: 'Wiosna', description: 'Nowe pąki i jasna zieleń' },
  summer: { label: 'Lato', description: 'Pełna, spokojna korona' },
  autumn: { label: 'Jesień', description: 'Ciepłe kolory i opadające liście' },
  winter: { label: 'Zima', description: 'Cisza, odpoczynek i mniej liści' },
};

export function currentSeason(date = new Date()): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export function treeLevel(completedCount: number) {
  const level = Math.floor(completedCount / 5) + 1;
  const titles = ['Sadzonka', 'Młode drzewko', 'Spokojny pień', 'Rozłożysta korona', 'Strażnik ogrodu'];
  return {
    level,
    title: titles[Math.min(level - 1, titles.length - 1)],
    current: completedCount % 5,
    needed: 5,
    progress: (completedCount % 5) * 20,
  };
}

const today = new Date();
const isoToday = today.toISOString();
const daysAgo = (days: number) => new Date(today.getTime() - days * 86_400_000).toISOString();

export const seedTasks: BonsaiTask[] = [
  { id: 'task-1', title: 'Dokończ prezentację', branch: 'work', note: 'Najpierw trzy najważniejsze slajdy.', createdAt: daysAgo(2), completedAt: null },
  { id: 'task-2', title: 'Przygotuj raport', branch: 'work', note: '', createdAt: daysAgo(1), completedAt: null },
  { id: 'task-3', title: '20 minut spaceru', branch: 'health', note: 'Bez telefonu. Tylko oddech i ruch.', createdAt: isoToday, completedAt: null },
  { id: 'task-4', title: 'Podlej rośliny', branch: 'home', note: '', createdAt: isoToday, completedAt: null },
  { id: 'task-5', title: 'Uporządkuj biurko', branch: 'home', note: 'Zostaw tylko rzeczy potrzebne jutro.', createdAt: daysAgo(1), completedAt: null },
  { id: 'task-6', title: 'Przeczytaj 10 stron', branch: 'growth', note: '', createdAt: isoToday, completedAt: null },
  { id: 'task-7', title: 'Zapisz jedną refleksję', branch: 'growth', note: '', createdAt: isoToday, completedAt: null },
  { id: 'done-1', title: 'Odpowiedz na e-maile', branch: 'work', note: '', createdAt: daysAgo(1), completedAt: isoToday },
  { id: 'done-2', title: 'Zrób zakupy', branch: 'home', note: '', createdAt: daysAgo(1), completedAt: isoToday },
  { id: 'done-3', title: 'Wypij szklankę wody', branch: 'health', note: '', createdAt: isoToday, completedAt: isoToday },
];
