import { useEffect, useState } from 'react';
import { Activity, Brain, Check, ChevronRight, CircleAlert, Database, LockKeyhole, Mail, Pause, Play, Send, Server, Settings, Sparkles, Users } from 'lucide-react';
import { YgrassilRootScene } from './YgrassilPremiumScene';
import type { Autonomy, SystemState } from './YgrassilPremiumScene';
import './ygrassil.css';

const nav = ['Dashboard', 'Leads', 'Outreach', 'Analytics', 'System'] as const;
const metrics = [
  { label: 'Leads in pipeline', value: '2,843', icon: Users },
  { label: 'Emails sent', value: '987', icon: Mail },
  { label: 'Replies received', value: '143', icon: Send },
  { label: 'Meetings booked', value: '12', icon: Check },
] as const;
const autonomyModes: Autonomy[] = ['ROOT', 'BRANCH', 'LEAF'];
type ServiceName = 'DATABASE' | 'AI' | 'SMTP' | 'IMAP' | 'OUTBOUND';
type ServiceInfo = { status: string; detail: string };
type SystemStatus = {
  services: Record<ServiceName, ServiceInfo>;
  safety: { emailTestMode: boolean; outboundEnabled: boolean; dailySendLimit: number };
  missing: string[];
};

const fallbackStatus: SystemStatus = {
  services: {
    DATABASE: { status: 'needs_configuration', detail: 'Waiting for Supabase project keys' },
    AI: { status: 'needs_configuration', detail: 'Waiting for AI provider key' },
    SMTP: { status: 'needs_configuration', detail: 'Waiting for SMTP password and admin test email' },
    IMAP: { status: 'needs_configuration', detail: 'Waiting for IMAP password' },
    OUTBOUND: { status: 'locked', detail: 'Real prospect sending is locked' },
  },
  safety: { emailTestMode: true, outboundEnabled: false, dailySendLimit: 10 },
  missing: [],
};

const serviceIcons: Record<ServiceName, typeof Database> = { DATABASE: Database, AI: Brain, SMTP: Mail, IMAP: Server, OUTBOUND: LockKeyhole };

function SystemPanel() {
  const [status, setStatus] = useState<SystemStatus>(fallbackStatus);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState<'smtp' | 'imap' | null>(null);

  useEffect(() => {
    fetch('/api/ygrassil/status')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Status API unavailable')))
      .then((payload) => setStatus(payload as SystemStatus))
      .catch(() => setResult('Local status API is waiting for the dev server bridge or deployment.'));
  }, []);

  const runTest = async (kind: 'smtp' | 'imap') => {
    setLoading(kind);
    setResult('');
    try {
      const response = await fetch(`/api/ygrassil/test-${kind}`, { method: 'POST' });
      const payload = await response.json();
      setResult(response.ok ? `${kind.toUpperCase()} test passed.` : payload.error || `${kind.toUpperCase()} test needs configuration.`);
    } catch {
      setResult(`${kind.toUpperCase()} test endpoint unavailable in this runtime.`);
    } finally {
      setLoading(null);
    }
  };

  return <section className="yg-system-screen" aria-label="Ygrassil system status">
    <div className="yg-system-card">
      <div className="yg-system-card-head">
        <div><span>Infrastructure</span><h2>System Status</h2></div>
        <b><i /> OUTBOUND LOCKED</b>
      </div>
      <div className="yg-service-grid">
        {(Object.entries(status.services) as Array<[ServiceName, ServiceInfo]>).map(([name, info]) => {
          const Icon = serviceIcons[name];
          return <div className={`yg-service-tile status-${info.status}`} key={name}><Icon /><span>{name}</span><b>{info.status.replaceAll('_', ' ')}</b><small>{info.detail}</small></div>;
        })}
      </div>
      <div className="yg-safety-row">
        <span>EMAIL_TEST_MODE <b>{String(status.safety.emailTestMode)}</b></span>
        <span>OUTBOUND_ENABLED <b>{String(status.safety.outboundEnabled)}</b></span>
        <span>DAILY_SEND_LIMIT <b>{status.safety.dailySendLimit}</b></span>
      </div>
      <div className="yg-test-row">
        <button type="button" onClick={() => runTest('smtp')} disabled={loading !== null}>{loading === 'smtp' ? 'TESTING SMTP' : 'TEST SMTP'}</button>
        <button type="button" onClick={() => runTest('imap')} disabled={loading !== null}>{loading === 'imap' ? 'TESTING IMAP' : 'TEST IMAP'}</button>
      </div>
      {result ? <p className="yg-test-result">{result}</p> : null}
      {status.missing.length ? <p className="yg-missing-env">Missing: {status.missing.join(', ')}</p> : null}
    </div>
  </section>;
}

function LeafMark() {
  return <svg viewBox="0 0 32 40" aria-hidden="true"><path d="M16 37V5M16 12C8 11 4 16 4 24c8 0 12-4 12-12ZM16 15c8-1 12 4 12 12-8 0-12-4-12-12ZM8 37h16" /></svg>;
}

export function YgrassilPremiumHost() {
  const [paused, setPaused] = useState(false);
  const [activeNav, setActiveNav] = useState<(typeof nav)[number]>('Dashboard');
  const [focusedStage, setFocusedStage] = useState('QUALIFY');
  const [autonomy, setAutonomy] = useState<Autonomy>('BRANCH');
  const state: SystemState = paused ? 'IDLE' : activeNav === 'Analytics' ? 'PROCESSING' : activeNav === 'Outreach' ? 'WAITING' : 'WORKING';
  const modeIndex = autonomyModes.indexOf(autonomy);
  const cycleAutonomy = () => setAutonomy(autonomyModes[(modeIndex + 1) % autonomyModes.length]);

  return <div className="ygrassil-app yg-site">
    <header className="yg-topbar">
      <div className="yg-brand"><span><LeafMark /></span><div><b>YGRASSIL</b><small>Autonomous Sales Engine</small></div></div>
      <nav aria-label="Primary navigation">{nav.map((item) => <button key={item} type="button" className={activeNav === item ? 'is-active' : ''} onClick={() => setActiveNav(item)}>{item}</button>)}</nav>
      <div className="yg-system-pill"><i /> {paused ? 'Paused' : 'Online'} <button type="button" aria-label="Notifications"><CircleAlert /></button></div>
    </header>

    <main className="yg-hero">
      <YgrassilRootScene state={state} autonomy={autonomy} onSelect={setFocusedStage} />
      {activeNav === 'System' ? <SystemPanel /> : null}
      <aside className="yg-overview" aria-label="System overview">
        <div className="yg-overview-head"><span>System overview</span><b><i /> Online</b></div>
        <div className="yg-metric-grid">{metrics.map(({ label, value, icon: Icon }) => <div key={label}><Icon /><small>{label}</small><strong>{value}</strong></div>)}</div>
        <div className="yg-overview-foot"><span>Pipeline health <b>92%</b></span><div><i /></div><span>Active campaign <b>Japan - IT Services</b></span></div>
      </aside>
    </main>

    <footer className="yg-commandbar" aria-label="Automation controls">
      <button type="button" className="yg-mode" onClick={cycleAutonomy}>Autopilot <b>{autonomy}</b><ChevronRight /></button>
      <div className="yg-tools"><button type="button" aria-label="Automation map" onClick={() => setActiveNav('Dashboard')}><LeafMark /></button><button type="button" aria-label="Signal monitor" onClick={() => setActiveNav('Analytics')}><Activity /></button><button type="button" aria-label="Routing settings" onClick={() => setActiveNav('System')}><Settings /></button></div>
      <div className="yg-legend"><span className="is-complete"><i />Completed</span><span className="is-progress"><i />In progress</span><span className="is-waiting"><i />Waiting</span><span className="is-blocked"><i />Blocked</span></div>
      <div className="yg-focus"><Sparkles /> Focus: <b>{focusedStage}</b></div>
      <button type="button" className="yg-play" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume automation' : 'Pause automation'}>{paused ? <Play /> : <Pause />}<span>{paused ? 'Resume' : 'Pause'}</span></button>
    </footer>
  </div>;
}
