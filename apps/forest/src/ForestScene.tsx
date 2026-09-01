import type { CSSProperties, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Activity, Building2, CalendarDays, Mail, Send, Sparkles, TreePine } from 'lucide-react';
import type { ForestAutomation, ForestConnection, ForestSelection, ForestStatus, ForestSystem } from './forest.types';

type Props = {
  systems: ForestSystem[];
  connections: ForestConnection[];
  automations: ForestAutomation[];
  selection: ForestSelection;
  onSelect: (selection: ForestSelection) => void;
};

const statusLabel: Record<ForestStatus, string> = {
  ACTIVE: 'Running',
  WAITING: 'Waiting',
  FAILED: 'Failed',
  DISCONNECTED: 'Dormant',
};

const IconMap = {
  root: Activity,
  office: Building2,
  garden: Sparkles,
  city: TreePine,
  mail: Mail,
  calendar: CalendarDays,
  agent: Send,
};

export function ForestScene({ systems, connections, automations, selection, onSelect }: Props) {
  const selectedConnectionIds = selection.kind === 'automation'
    ? automations.find((item) => item.id === selection.id)?.connectionIds ?? []
    : selection.kind === 'connection'
      ? [selection.id]
      : [];

  return (
    <section className="forest-scene" aria-label="BonsAI Forest system map">
      <div className="forest-depth forest-depth-one" aria-hidden="true" />
      <div className="forest-depth forest-depth-two" aria-hidden="true" />
      <svg className="forest-paths" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="false">
        <defs>
          <filter id="soft-path-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {connections.map((connection) => {
          const selected = selectedConnectionIds.includes(connection.id);
          return (
            <path
              key={connection.id}
              d={connection.path}
              className={`forest-path status-${connection.status.toLowerCase()} ${selected ? 'is-selected' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={`${connection.trigger}: ${connection.status}`}
              onClick={() => onSelect({ kind: 'connection', id: connection.id })}
              onKeyDown={(event: KeyboardEvent<SVGPathElement>) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect({ kind: 'connection', id: connection.id });
              }}
            />
          );
        })}
        {connections.map((connection) => <FlowLights key={`${connection.id}-flow`} connection={connection} selected={selectedConnectionIds.includes(connection.id)} />)}
      </svg>
      {connections.map((connection) => (
        <button
          key={`${connection.id}-marker`}
          className={`forest-connection-marker status-${connection.status.toLowerCase()} ${selectedConnectionIds.includes(connection.id) ? 'is-selected' : ''}`}
          style={{ '--x': `${connection.marker.x}%`, '--y': `${connection.marker.y}%` } as CSSProperties}
          onClick={() => onSelect({ kind: 'connection', id: connection.id })}
          aria-label={`${connection.trigger}: ${connection.status}`}
        >
          <span />
        </button>
      ))}
      {systems.map((system, index) => (
        <SystemTree
          key={system.id}
          system={system}
          index={index}
          selected={selection.kind === 'system' && selection.id === system.id}
          activePath={selection.kind !== 'system' && selectedConnectionIds.some((id) => {
            const connection = connections.find((item) => item.id === id);
            return connection?.sourceSystemId === system.id || connection?.destinationSystemId === system.id;
          })}
          onSelect={() => onSelect({ kind: 'system', id: system.id })}
        />
      ))}
    </section>
  );
}

function FlowLights({ connection, selected }: { connection: ForestConnection; selected: boolean }) {
  if (connection.status === 'DISCONNECTED') {
    return <circle r="5" className="forest-break"><animateMotion path={connection.path} dur=".01s" keyPoints="0.58;0.58" keyTimes="0;1" fill="freeze" /></circle>;
  }
  if (connection.status === 'FAILED') {
    return (
      <>
        <circle r="6" className="forest-failed-stop"><animateMotion path={connection.path} dur=".01s" keyPoints="0.53;0.53" keyTimes="0;1" fill="freeze" /></circle>
        <circle r="3.6" className={`forest-firefly status-failed ${selected ? 'is-selected' : ''}`}>
          <animateMotion path={connection.path} dur="5.2s" keyPoints="0;0.53" keyTimes="0;1" repeatCount="indefinite" />
        </circle>
      </>
    );
  }
  if (connection.status === 'WAITING') {
    return (
      <>
        <circle r="3.5" className="forest-paused-light"><animateMotion path={connection.path} dur=".01s" keyPoints="0.42;0.42" keyTimes="0;1" fill="freeze" /></circle>
        <circle r="3.5" className="forest-paused-light is-second"><animateMotion path={connection.path} dur=".01s" keyPoints="0.63;0.63" keyTimes="0;1" fill="freeze" /></circle>
      </>
    );
  }
  return (
    <>
      {[0, 1, 2].map((item) => (
        <circle
          key={item}
          r={selected ? 4 : 3}
          className={`forest-firefly status-active ${selected ? 'is-selected' : ''}`}
        >
          <animateMotion path={connection.path} dur={selected ? '4.8s' : '7.4s'} begin={`${item * 1.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function SystemTree({ system, index, selected, activePath, onSelect }: { system: ForestSystem; index: number; selected: boolean; activePath: boolean; onSelect: () => void }) {
  const Icon = IconMap[system.icon as keyof typeof IconMap] ?? Activity;
  const style = {
    '--x': `${system.position.x}%`,
    '--y': `${system.position.y}%`,
    '--scale': system.scale,
    '--delay': `${index * -.52}s`,
  } as CSSProperties;

  return (
    <motion.button
      className={`forest-tree tree-${system.visualVariant} status-${system.status.toLowerCase()} ${selected ? 'is-selected' : ''} ${activePath ? 'is-in-flow' : ''}`}
      style={style}
      onClick={onSelect}
      onPointerDown={onSelect}
      aria-pressed={selected}
      aria-label={`${system.name}, ${system.status}, health ${system.health} percent`}
      whileHover={{ y: -3 }}
      whileTap={{ scale: .98 }}
      transition={{ duration: .18 }}
    >
      <span className="tree-crown"><i /><i /><i /></span>
      <span className="tree-trunk"><i /></span>
      <span className="tree-roots"><i /><i /><i /></span>
      <span className="tree-marker"><Icon size={13} /><b>{system.name}</b><small>{statusLabel[system.status]} - {system.health}%</small></span>
    </motion.button>
  );
}
