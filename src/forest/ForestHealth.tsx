import { Activity, CircleAlert, Clock3, TreePine, Zap } from 'lucide-react';
import type { ForestAutomation, ForestConnection, ForestSystem } from './forest.types';

type Props = {
  systems: ForestSystem[];
  connections: ForestConnection[];
  automations: ForestAutomation[];
};

export function ForestHealth({ systems, connections, automations }: Props) {
  const activeAutomations = automations.filter((item) => item.status === 'ACTIVE').length;
  const waiting = [...connections, ...automations].filter((item) => item.status === 'WAITING').length;
  const failed = [...connections, ...automations].filter((item) => item.status === 'FAILED').length;
  const disconnected = systems.filter((item) => item.status === 'DISCONNECTED').length;

  return (
    <section className="forest-health" aria-label="BonsAI Forest health summary">
      <span><TreePine size={15} />{systems.length} systems connected</span>
      <span><Activity size={15} />{activeAutomations} automations active</span>
      <span><Clock3 size={15} />{waiting} waiting</span>
      <span><CircleAlert size={15} />{failed} failed</span>
      <span><Zap size={15} />{disconnected} disconnected</span>
    </section>
  );
}
