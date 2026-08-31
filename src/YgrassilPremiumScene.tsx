import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export type Autonomy = 'ROOT' | 'BRANCH' | 'LEAF';
export type SystemState = 'IDLE' | 'WORKING' | 'PROCESSING' | 'WAITING' | 'BLOCKED' | 'SUCCESSFUL';

const stages = [
  ['DISCOVER', '2,843', 'Completed', 'discover'],
  ['ANALYZE', '643', 'Completed', 'analyze'],
  ['QUALIFY', '452', 'In progress', 'qualify'],
  ['STRATEGY', '312', 'In progress', 'strategy'],
  ['PROPOSAL', '287', 'Waiting', 'proposal'],
  ['OUTREACH', '337', 'Waiting', 'outreach'],
  ['FOLLOW-UP', '61', 'Waiting', 'followup'],
  ['REPLY', '101', 'Waiting', 'reply'],
] as const;

const paths = [
  [[5, 70], [21, 62], [35, 52], [50, 46], [66, 51], [86, 57], [97, 67]],
  [[13, 45], [30, 40], [48, 31], [63, 38], [75, 53], [88, 70]],
  [[18, 79], [31, 72], [43, 68], [58, 70], [72, 78], [91, 82]],
  [[38, 57], [45, 72], [53, 83], [61, 70], [66, 55], [59, 41]],
] as const;

const flowStage = (state: SystemState) =>
  ({ IDLE: '', WORKING: 'DISCOVER', PROCESSING: 'ANALYZE', WAITING: 'QUALIFY', BLOCKED: 'PROPOSAL', SUCCESSFUL: 'REPLY' })[state];

const pointOnPath = (route: readonly (readonly [number, number])[], t: number) => {
  const scaled = t * (route.length - 1);
  const index = Math.min(route.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const [x1, y1] = route[index];
  const [x2, y2] = route[index + 1];
  return [x1 + (x2 - x1) * local, y1 + (y2 - y1) * local] as const;
};

const flowKeyframes = (route: readonly (readonly [number, number])[], phase: number) => {
  const positions = Array.from({ length: 13 }, (_, step) => pointOnPath(route, (phase + step / 12) % 1));
  return { left: positions.map(([x]) => `${x}%`), top: positions.map(([, y]) => `${y}%`) };
};

const fireflies = Array.from({ length: 44 }, (_, index) => {
  const route = paths[index % paths.length];
  const phase = ((index * 37) % 100) / 100;
  const flow = flowKeyframes(route, phase);
  return {
    id: index,
    flow,
    delay: -(index % 23) * 0.55,
    duration: 42 + (index % 9) * 3.2,
    size: 2 + (index % 5) * 0.7,
    tone: index % 4 === 0 ? 'green' : index % 6 === 0 ? 'blue' : 'gold',
    streak: index % 10 === 0,
  };
});

export function YgrassilRootScene({ state, autonomy, onSelect }: { state: SystemState; autonomy: Autonomy; onSelect: (stage: string) => void }) {
  const [selected, setSelected] = useState('QUALIFY');
  const activeStage = flowStage(state);
  const [liveStage, setLiveStage] = useState(activeStage || 'QUALIFY');

  useEffect(() => {
    if (state === 'IDLE') return undefined;
    const start = Math.max(0, stages.findIndex(([label]) => label === (activeStage || 'QUALIFY')));
    setLiveStage(stages[start][0]);
    const timer = window.setInterval(() => {
      setLiveStage((current) => {
        const index = stages.findIndex(([label]) => label === current);
        return stages[(index + 1) % stages.length][0];
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [activeStage, state]);

  const select = (stage: string) => {
    setSelected(stage);
    setLiveStage(stage);
    onSelect(stage);
  };

  return <section className={`yg-root-scene yg-premium-scene state-${state.toLowerCase()} mode-${autonomy.toLowerCase()}`} aria-label="Ygrassil automation garden">
    <div className="yg-premium-plate" aria-hidden="true" />
    <motion.div className="yg-premium-haze" aria-hidden="true" animate={{ opacity: state === 'IDLE' ? 0.34 : [0.42, 0.78, 0.46] }} transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }} />
    <svg className="yg-premium-flow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 70 C20 64 32 55 48 48 C66 41 82 55 98 67" />
      <path d="M12 45 C28 42 40 30 56 32 C70 35 78 51 90 70" />
      <path d="M18 80 C35 69 50 66 64 72 C77 78 86 82 96 79" />
      <path className="yg-flow-current" d="M4 70 C20 64 32 55 48 48 C66 41 82 55 98 67" />
      <path className="yg-flow-current is-second" d="M12 45 C28 42 40 30 56 32 C70 35 78 51 90 70" />
    </svg>
    <div className="yg-firefly-field" aria-hidden="true">
      {fireflies.map((fly) => <motion.span
        key={fly.id}
        className={`yg-firefly is-${fly.tone} ${fly.streak ? 'is-streak' : ''}`}
        style={{ left: fly.flow.left[0], top: fly.flow.top[0], width: fly.streak ? fly.size * 3.4 : fly.size, height: fly.streak ? 2 : fly.size }}
        animate={state === 'IDLE' ? { opacity: [0.08, 0.18, 0.08], scale: [0.7, 0.94, 0.7] } : { left: fly.flow.left, top: fly.flow.top, opacity: [0.2, 0.56, 0.3, 0.7, 0.2], scale: [0.68, 1.06, 0.78, 0.98, 0.68] }}
        transition={{ duration: fly.duration, delay: fly.delay, repeat: Infinity, ease: 'easeInOut' }}
      />)}
    </div>
    <div className="yg-premium-stage-grid">
      {stages.map(([label, value, status, id]) => {
        const active = state !== 'IDLE' && (label === activeStage || label === liveStage || label === selected);
        return <button key={label} type="button" className={`yg-premium-stage yg-premium-stage-${id} ${active ? 'is-flowing' : ''}`} aria-pressed={selected === label} onClick={() => select(label)}>
          <span className="yg-premium-stage-dot" />
          <strong>{label}</strong>
          <b>{value}</b>
          <small>{label === liveStage && state !== 'IDLE' ? 'Routing now' : status}</small>
        </button>;
      })}
    </div>
  </section>;
}
