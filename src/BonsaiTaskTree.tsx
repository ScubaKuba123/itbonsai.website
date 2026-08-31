import { Check, Leaf } from 'lucide-react';
import { CSSProperties } from 'react';
import { BonsaiTask, BranchId, Season, TreeSpecies, branches } from './bonsai-data';

type Position = { left: number; top: number; rotate: number };

const positions: Record<BranchId, Position[]> = {
  work: [
    { left: 21, top: 21, rotate: -8 },
    { left: 35, top: 31, rotate: 8 },
    { left: 15, top: 37, rotate: -5 },
  ],
  health: [
    { left: 18, top: 49, rotate: 3 },
    { left: 31, top: 58, rotate: -8 },
    { left: 8, top: 62, rotate: 6 },
  ],
  home: [
    { left: 38, top: 70, rotate: -9 },
    { left: 22, top: 76, rotate: 6 },
    { left: 47, top: 82, rotate: -3 },
  ],
  growth: [
    { left: 67, top: 30, rotate: 7 },
    { left: 75, top: 43, rotate: -6 },
    { left: 62, top: 53, rotate: 8 },
  ],
};

const labelPositions: Record<BranchId, { left: string; top: string }> = {
  work: { left: '2%', top: '25%' },
  health: { left: '1%', top: '51%' },
  home: { left: '4%', top: '76%' },
  growth: { left: '80%', top: '32%' },
};

type Props = {
  tasks: BonsaiTask[];
  selectedBranch: BranchId | 'all';
  selectedTaskId: string | null;
  fallingTaskId: string | null;
  onSelectBranch: (branch: BranchId) => void;
  onSelectTask: (id: string) => void;
  onComplete: (id: string) => void;
  onFallFinished: (id: string) => void;
  species: TreeSpecies;
  season: Season;
  growth: number;
};

export function BonsaiTaskTree({
  tasks,
  selectedBranch,
  selectedTaskId,
  fallingTaskId,
  onSelectBranch,
  onSelectTask,
  onComplete,
  onFallFinished,
  species,
  season,
  growth,
}: Props) {
  const visibleTasks = (Object.keys(branches) as BranchId[]).flatMap((branch) => (
    tasks.filter((task) => task.branch === branch).slice(0, positions[branch].length).map((task, index) => ({
      task,
      position: positions[branch][index],
    }))
  ));

  return (
    <div className={`bonsai-canvas species-${species} season-${season} selected-${selectedBranch}`} style={{ '--tree-growth': growth } as CSSProperties} aria-label="Drzewo zadań BonsAI">
      <div className="sun-wash" />
      <img className="tree-render" src="/bonsai-tree-base.png" alt="" aria-hidden="true" />
      <svg className="tree-art" viewBox="0 0 900 740" role="img" aria-label="Bonsai z gałęziami zadań">
        <defs>
          <linearGradient id="trunkGradient" x1="0" x2="1">
            <stop offset="0" stopColor="#4a3525" />
            <stop offset="0.45" stopColor="#9a7550" />
            <stop offset="0.7" stopColor="#5b412b" />
            <stop offset="1" stopColor="#271d16" />
          </linearGradient>
          <linearGradient id="potGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#75624a" />
            <stop offset="1" stopColor="#2c241c" />
          </linearGradient>
          <filter id="treeShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity=".5" />
          </filter>
        </defs>
        <g className="branches" fill="none" stroke="url(#trunkGradient)" strokeLinecap="round" strokeLinejoin="round" filter="url(#treeShadow)">
          <path className="trunk-main" d="M520 630 C495 570 530 520 500 461 C471 403 493 354 522 306 C555 250 532 196 492 150" />
          <path className="branch branch-work" d="M515 330 C431 290 343 222 178 226" />
          <path className="branch branch-work twig" d="M450 285 C383 260 325 287 268 315" />
          <path className="branch branch-health" d="M504 430 C416 419 318 412 166 457" />
          <path className="branch branch-health twig" d="M430 421 C356 467 304 511 242 529" />
          <path className="branch branch-home" d="M500 512 C430 548 386 611 310 653" />
          <path className="branch branch-home twig" d="M466 550 C426 617 414 650 401 682" />
          <path className="branch branch-growth" d="M526 360 C611 334 660 270 755 260" />
          <path className="branch branch-growth twig" d="M574 342 C649 359 692 390 790 395" />
          <path className="branch branch-growth twig" d="M541 300 C607 244 638 191 683 164" />
          <path className="crown-twig" d="M493 151 C451 120 398 111 342 127 M494 151 C520 116 570 96 626 105" />
        </g>
        <g className="needle-clouds">
          <ellipse cx="344" cy="128" rx="82" ry="27" />
          <ellipse cx="429" cy="102" rx="89" ry="32" />
          <ellipse cx="552" cy="103" rx="98" ry="30" />
          <ellipse cx="637" cy="139" rx="75" ry="26" />
          <ellipse cx="245" cy="226" rx="83" ry="25" />
          <ellipse cx="701" cy="249" rx="94" ry="28" />
          <ellipse cx="758" cy="393" rx="69" ry="22" />
          <ellipse cx="211" cy="455" rx="62" ry="20" />
          <ellipse cx="310" cy="300" rx="54" ry="18" />
          <ellipse cx="181" cy="392" rx="46" ry="16" />
          <ellipse cx="359" cy="522" rx="52" ry="18" />
          <ellipse cx="407" cy="600" rx="45" ry="16" />
          <ellipse cx="625" cy="336" rx="48" ry="17" />
          <ellipse cx="650" cy="468" rx="56" ry="18" />
        </g>
        <g className="pot" filter="url(#treeShadow)">
          <path d="M330 630 L696 630 L664 700 Q650 720 624 720 L390 720 Q362 720 350 699 Z" fill="url(#potGradient)" />
          <path d="M314 621 Q314 610 328 610 H698 Q712 610 712 621 L704 642 H322 Z" fill="#90795b" />
          <path d="M355 625 Q512 594 674 625" stroke="#28351f" strokeWidth="14" strokeLinecap="round" />
          <path d="M382 720 V730 M642 720 V730" stroke="#33281f" strokeWidth="19" strokeLinecap="round" />
        </g>
      </svg>

      {(Object.keys(branches) as BranchId[]).map((branch) => {
        const count = tasks.filter((task) => task.branch === branch).length;
        return (
          <button
            className={`branch-label ${selectedBranch === branch ? 'is-active' : ''}`}
            style={labelPositions[branch]}
            onClick={() => onSelectBranch(branch)}
            key={branch}
          >
            <Leaf aria-hidden="true" />
            <span>{branches[branch].label}</span>
            <small>{count}</small>
          </button>
        );
      })}

      {visibleTasks.map(({ task, position }) => {
        const dimmed = selectedBranch !== 'all' && selectedBranch !== task.branch;
        return (
          <article
            className={`task-sprig sprig-${task.branch} ${selectedTaskId === task.id ? 'is-selected' : ''} ${dimmed ? 'is-dimmed' : ''} ${fallingTaskId === task.id ? 'is-falling' : ''}`}
            style={{ left: `${position.left}%`, top: `${position.top}%`, '--sprig-rotation': `${position.rotate * .28}deg` } as CSSProperties}
            key={task.id}
            onAnimationEnd={() => fallingTaskId === task.id && onFallFinished(task.id)}
          >
            <button className="sprig-label" onClick={() => onSelectTask(task.id)} aria-label={`Otwórz zadanie: ${task.title}`}>
              <span className="sprig-cluster" aria-hidden="true"><i /><i /><i /></span>
              <span className="sprig-copy"><b>{task.title}</b><small>{branches[task.branch].label}</small></span>
            </button>
            <button className="sprig-check" onClick={() => onComplete(task.id)} aria-label={`Ukończ zadanie: ${task.title}`}>
              <Check aria-hidden="true" />
            </button>
          </article>
        );
      })}
      <p className="tree-hint"><Leaf aria-hidden="true" /> Dotknij pąka, aby ukończyć. Gałązka spokojnie opadnie do ogrodu.</p>
    </div>
  );
}
