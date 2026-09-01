import { useMemo, useState } from 'react';
import { Activity, Pause, TreePine, Zap } from 'lucide-react';
import { ForestHealth } from './ForestHealth';
import { ForestInspector } from './ForestInspector';
import { ForestScene } from './ForestScene';
import { forestAutomations, forestConnections, forestSystems } from './forest.mock';
import type { ForestSelection } from './forest.types';
import './forest.css';

export function ForestPage() {
  const [selection, setSelection] = useState<ForestSelection>({ kind: 'automation', id: 'morning-context' });
  const selectedAutomation = selection.kind === 'automation' ? forestAutomations.find((item) => item.id === selection.id) : null;

  const activeRoute = useMemo(() => {
    if (!selectedAutomation) return null;
    const route = selectedAutomation.connectionIds
      .map((id) => forestConnections.find((item) => item.id === id))
      .filter(Boolean);
    return route.map((item) => `${forestSystems.find((system) => system.id === item?.sourceSystemId)?.name} to ${forestSystems.find((system) => system.id === item?.destinationSystemId)?.name}`).join(' / ');
  }, [selectedAutomation]);

  return (
    <main className="forest-page">
      <header className="forest-topbar">
        <a href="/forest" className="forest-brand" aria-label="BonsAI Forest home"><TreePine size={24} /><span><b>BonsAI Forest</b><small>mock ecosystem prototype</small></span></a>
        <nav aria-label="Forest routes">
          <a href="/ygrassil/">Ygrassil Agent</a>
          <a href="/prototype">Garden</a>
          <a href="/">City</a>
        </nav>
      </header>

      <ForestScene systems={forestSystems} connections={forestConnections} automations={forestAutomations} selection={selection} onSelect={setSelection} />
      <ForestHealth systems={forestSystems} connections={forestConnections} automations={forestAutomations} />
      <ForestInspector selection={selection} systems={forestSystems} connections={forestConnections} automations={forestAutomations} onSelect={setSelection} onReset={() => setSelection({ kind: 'automation', id: 'morning-context' })} />

      <section className="forest-automation-bar" aria-label="Forest automations">
        {forestAutomations.map((automation) => (
          <button key={automation.id} className={`automation-chip status-${automation.status.toLowerCase()} ${selection.kind === 'automation' && selection.id === automation.id ? 'is-selected' : ''}`} onClick={() => setSelection({ kind: 'automation', id: automation.id })}>
            {automation.status === 'ACTIVE' ? <Activity size={15} /> : automation.status === 'WAITING' ? <Pause size={15} /> : <Zap size={15} />}
            <span><b>{automation.name}</b><small>{automation.status}</small></span>
          </button>
        ))}
      </section>

      <section className="forest-flow-readout" aria-live="polite">
        <span>Selected flow</span>
        <b>{selectedAutomation ? selectedAutomation.name : 'Inspecting connection'}</b>
        <small>{activeRoute ?? 'Click an automation to trace source, movement and destination.'}</small>
      </section>

      <div className="forest-legend" aria-label="Forest status legend">
        <span className="status-active">Active</span>
        <span className="status-waiting">Waiting</span>
        <span className="status-failed">Failed</span>
        <span className="status-disconnected">Disconnected</span>
      </div>
    </main>
  );
}
