import { CSSProperties, useState } from 'react';

export type SystemState = 'IDLE' | 'WORKING' | 'PROCESSING' | 'WAITING' | 'BLOCKED' | 'SUCCESSFUL';
export type Autonomy = 'ROOT' | 'BRANCH' | 'LEAF';

const stages = [
  { id: 'DISCOVER', x: 10.6, y: 39.2, count: 987, state: 'Completed' },
  { id: 'ANALYZE', x: 26.1, y: 18.2, count: 643, state: 'Completed' },
  { id: 'QUALIFY', x: 43.7, y: 4.7, count: 452, state: 'In progress' },
  { id: 'STRATEGY', x: 63.8, y: 18.5, count: 312, state: 'In progress' },
  { id: 'PROPOSAL', x: 79.3, y: 35.0, count: 287, state: 'Waiting' },
  { id: 'OUTREACH', x: 92.0, y: 47.6, count: 337, state: 'Waiting' },
  { id: 'FOLLOW-UP', x: 11.2, y: 84.1, count: 61, state: 'Waiting' },
  { id: 'REPLY', x: 86.9, y: 84.2, count: 101, state: 'Waiting' },
];

export function YgrassilRootScene({ state, autonomy, onSelect }: { state: SystemState; autonomy: Autonomy; onSelect: (stage: string) => void }) {
  const [selectedStage, setSelectedStage] = useState<typeof stages[number] | null>(null);

  const selectStage = (stage: typeof stages[number]) => {
    setSelectedStage(stage);
    onSelect(stage.id);
  };

  return <div className="yg-root-scene yg-bonsai-scene">
    <div className="yg-reference-frame">
      <img className="yg-forest-reference" src="/ygrassil-reference.png" alt="Ygrassil living forest interface with connected bonsai roots and workflow checkpoints" />
      <div className="yg-forest-grade" aria-hidden="true" />
      <div className="yg-stage-sensors" aria-label="Ygrassil workflow stages">
        {stages.map((stage) => <button
          type="button"
          key={stage.id}
          className={selectedStage?.id === stage.id ? 'is-selected' : ''}
          style={{ '--x': `${stage.x}%`, '--y': `${stage.y}%` } as CSSProperties}
          aria-pressed={selectedStage?.id === stage.id}
          aria-label={`${stage.id}: ${stage.count} ${stage.state.toLowerCase()}`}
          onClick={() => selectStage(stage)}
        >
          <span />
        </button>)}
      </div>
    </div>
    {selectedStage ? <div className="yg-reference-readout">
      <span>{state === 'IDLE' ? 'System resting' : 'Root signal active'} · Autopilot {autonomy}</span>
      <strong>{selectedStage.id}</strong>
      <small>{selectedStage.count} opportunities · {selectedStage.state}</small>
    </div> : null}
  </div>;
}
