import { useEffect, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { BarChart3, Bot, Clock3, FileText, MessageCircle, Search, Send, Target } from 'lucide-react';
import { YgrassilGardenScene } from './YgrassilGardenScene';

export type Autonomy = 'ROOT' | 'BRANCH' | 'LEAF';
export type SystemState = 'IDLE' | 'WORKING' | 'PROCESSING' | 'WAITING' | 'BLOCKED' | 'SUCCESSFUL';

type StageStatus = 'Completed' | 'In progress' | 'Waiting';
type StageConfig = {
  label: string;
  value: string;
  status: StageStatus;
  id: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const stages: StageConfig[] = [
  { label: 'Discover', value: '2,843', status: 'Completed', id: 'discover', Icon: Search },
  { label: 'Analyze', value: '643', status: 'Completed', id: 'analyze', Icon: BarChart3 },
  { label: 'Qualify', value: '452', status: 'In progress', id: 'qualify', Icon: Target },
  { label: 'Strategy', value: '312', status: 'In progress', id: 'strategy', Icon: Bot },
  { label: 'Proposal', value: '287', status: 'Waiting', id: 'proposal', Icon: FileText },
  { label: 'Outreach', value: '337', status: 'Waiting', id: 'outreach', Icon: Send },
  { label: 'Follow-up', value: '61', status: 'Waiting', id: 'followup', Icon: Clock3 },
  { label: 'Reply', value: '101', status: 'Waiting', id: 'reply', Icon: MessageCircle },
];

const flowStage = (state: SystemState) =>
  ({ IDLE: '', WORKING: 'Discover', PROCESSING: 'Analyze', WAITING: 'Qualify', BLOCKED: 'Proposal', SUCCESSFUL: 'Reply' })[state];

export function YgrassilRootScene({ state, autonomy, onSelect }: { state: SystemState; autonomy: Autonomy; onSelect: (stage: string) => void }) {
  const [selected, setSelected] = useState('Qualify');
  const activeStage = flowStage(state);
  const [liveStage, setLiveStage] = useState(activeStage || 'Qualify');

  useEffect(() => {
    if (state === 'IDLE') return undefined;
    const start = Math.max(0, stages.findIndex(({ label }) => label === (activeStage || 'Qualify')));
    setLiveStage(stages[start].label);
    const timer = window.setInterval(() => {
      setLiveStage((current) => {
        const index = stages.findIndex(({ label }) => label === current);
        return stages[(index + 1) % stages.length].label;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [activeStage, state]);

  const select = (stage: string) => {
    setSelected(stage);
    setLiveStage(stage);
    onSelect(stage.toUpperCase());
  };

  return <section className={`yg-root-scene yg-premium-scene state-${state.toLowerCase()} mode-${autonomy.toLowerCase()}`} aria-label="Ygrassil automation garden">
    <YgrassilGardenScene state={state} autonomy={autonomy} />
    <div className="yg-premium-stage-grid" aria-label="Pipeline stages">
      {stages.map(({ label, value, status, id, Icon }) => {
        const active = state !== 'IDLE' && (label === activeStage || label === liveStage || label === selected);
        const statusText = label === liveStage && state !== 'IDLE' ? 'Routing now' : status;
        return <button
          key={label}
          type="button"
          className={`yg-premium-stage yg-premium-stage-${id} yg-stage-status-${status.toLowerCase().replaceAll(' ', '-')} ${active ? 'is-flowing' : ''}`}
          aria-pressed={selected === label}
          onClick={() => select(label)}
        >
          <span className="yg-premium-stage-icon"><Icon aria-hidden="true" /></span>
          <span className="yg-premium-stage-copy">
            <strong>{label}</strong>
            <small>{statusText}</small>
          </span>
          <b>{value}</b>
          <span className="yg-premium-stage-dot" aria-hidden="true" />
        </button>;
      })}
    </div>
  </section>;
}
