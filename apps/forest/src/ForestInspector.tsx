import { Activity, ArrowRight, CircleAlert, RotateCcw } from 'lucide-react';
import type { ForestAutomation, ForestConnection, ForestSelection, ForestSystem } from './forest.types';

type Props = {
  selection: ForestSelection;
  systems: ForestSystem[];
  connections: ForestConnection[];
  automations: ForestAutomation[];
  onSelect: (selection: ForestSelection) => void;
  onReset: () => void;
};

const labelFor = (systems: ForestSystem[], id: string) => systems.find((item) => item.id === id)?.name ?? id;

export function ForestInspector({ selection, systems, connections, automations, onSelect, onReset }: Props) {
  const system = selection.kind === 'system' ? systems.find((item) => item.id === selection.id) : null;
  const connection = selection.kind === 'connection' ? connections.find((item) => item.id === selection.id) : null;
  const automation = selection.kind === 'automation' ? automations.find((item) => item.id === selection.id) : null;

  if (system) {
    const linked = connections.filter((item) => item.sourceSystemId === system.id || item.destinationSystemId === system.id);
    const activeAutomations = automations.filter((item) => item.connectionIds.some((id) => linked.some((connectionItem) => connectionItem.id === id)));
    return (
      <aside className="forest-inspector" aria-live="polite">
        <InspectorTop title="SYSTEM" onReset={onReset} />
        <h2>{system.name}</h2>
        <p>{system.description}</p>
        <div className="forest-facts">
          <span><b>Type</b>{system.type}</span>
          <span><b>Status</b>{system.status}</span>
          <span><b>Health</b>{system.health}%</span>
          <span><b>Category</b>{system.category}</span>
        </div>
        <h3>Connected systems</h3>
        <div className="forest-link-list">
          {linked.map((item) => {
            const other = item.sourceSystemId === system.id ? item.destinationSystemId : item.sourceSystemId;
            return <button key={item.id} onClick={() => onSelect({ kind: 'connection', id: item.id })}>{labelFor(systems, other)}<ArrowRight size={13} /></button>;
          })}
        </div>
        <h3>Active automations</h3>
        <div className="forest-link-list">
          {activeAutomations.map((item) => <button key={item.id} onClick={() => onSelect({ kind: 'automation', id: item.id })}>{item.name}<Activity size={13} /></button>)}
        </div>
      </aside>
    );
  }

  if (connection) {
    return (
      <aside className="forest-inspector" aria-live="polite">
        <InspectorTop title="CONNECTION" onReset={onReset} />
        <h2>{labelFor(systems, connection.sourceSystemId)} to {labelFor(systems, connection.destinationSystemId)}</h2>
        <p>{connection.action}</p>
        <div className="forest-facts">
          <span><b>Source</b>{labelFor(systems, connection.sourceSystemId)}</span>
          <span><b>Destination</b>{labelFor(systems, connection.destinationSystemId)}</span>
          <span><b>Status</b>{connection.status}</span>
          <span><b>Permission</b>{connection.permissionMode}</span>
          <span><b>Trigger</b>{connection.trigger}</span>
          <span><b>Last run</b>{connection.lastRun}</span>
          <span><b>Result</b>{connection.result}</span>
          <span><b>Next run</b>{connection.nextRun}</span>
        </div>
        {connection.error ? <p className="forest-error"><CircleAlert size={14} />{connection.error}</p> : null}
      </aside>
    );
  }

  if (automation) {
    const route = automation.connectionIds.map((id) => connections.find((item) => item.id === id)).filter(Boolean) as ForestConnection[];
    return (
      <aside className="forest-inspector" aria-live="polite">
        <InspectorTop title="AUTOMATION" onReset={onReset} />
        <h2>{automation.name}</h2>
        <p>{automation.description}</p>
        <div className="forest-facts">
          <span><b>Trigger</b>{automation.trigger}</span>
          <span><b>Status</b>{automation.status}</span>
          <span><b>Permission</b>{automation.permissionMode}</span>
          <span><b>Last run</b>{automation.lastRun}</span>
          <span><b>Next run</b>{automation.nextRun}</span>
          <span><b>Result</b>{automation.successCount} ok / {automation.failureCount} failed</span>
        </div>
        <h3>Execution path</h3>
        <ol className="forest-steps">
          {automation.steps.map((step, index) => <li key={step} className={automation.status === 'FAILED' && index === 1 ? 'is-failed' : ''}><span>{index + 1}</span>{step}</li>)}
        </ol>
        <div className="forest-link-list">
          {route.map((item) => <button key={item.id} onClick={() => onSelect({ kind: 'connection', id: item.id })}>{labelFor(systems, item.sourceSystemId)} to {labelFor(systems, item.destinationSystemId)}<ArrowRight size={13} /></button>)}
        </div>
      </aside>
    );
  }

  return null;
}

function InspectorTop({ title, onReset }: { title: string; onReset: () => void }) {
  return <div className="forest-inspector-top"><span>{title}</span><button onClick={onReset} aria-label="Reset Forest selection"><RotateCcw size={15} /></button></div>;
}
