import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  FileSpreadsheet,
  Filter,
  Globe2,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Menu,
  Plus,
  Pause,
  Play,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import './ygrassil.css';
import { Autonomy, SystemState } from './YgrassilRootScene';
import { YgrassilRootScene } from './YgrassilRootScene';

type View = 'dashboard' | 'campaigns' | 'leads' | 'approval' | 'inbox' | 'followups' | 'opportunities' | 'analytics' | 'suppression' | 'settings' | 'activity';
type LeadStatus = 'discovered' | 'analysed' | 'qualified' | 'awaiting_approval' | 'approved' | 'sent' | 'replied' | 'interested' | 'meeting' | 'won' | 'lost' | 'do_not_contact';
type Lead = {
  id: string;
  companyName: string;
  domain: string;
  websiteUrl: string;
  country: string;
  city: string;
  industry: string;
  contactName: string;
  email: string;
  source: string;
  status: LeadStatus;
  leadScore: number;
  opportunity: string;
  createdAt: string;
};
type Campaign = { id: string; name: string; country: string; location: string; industry: string; opportunity: string; createdAt: string };

const LEADS_STORE = 'ygrassil-leads-v2';
const CAMPAIGNS_STORE = 'ygrassil-campaigns-v2';

const nav: Array<{ id: View; label: string; icon: typeof LayoutDashboard; group: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Ygrassil' },
  { id: 'campaigns', label: 'Campaigns', icon: Target, group: 'Hunt' },
  { id: 'leads', label: 'Leads', icon: Users, group: 'Hunt' },
  { id: 'approval', label: 'Approval Queue', icon: Check, group: 'Hunt' },
  { id: 'inbox', label: 'Inbox', icon: Inbox, group: 'Communication' },
  { id: 'followups', label: 'Follow-ups', icon: Clock3, group: 'Communication' },
  { id: 'opportunities', label: 'Opportunities', icon: Sparkles, group: 'Intelligence' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Intelligence' },
  { id: 'suppression', label: 'Suppression', icon: ShieldCheck, group: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
  { id: 'activity', label: 'Activity', icon: Activity, group: 'System' },
];

const initialLeadForm = { companyName: '', websiteUrl: '', country: 'United Kingdom', city: '', industry: '', contactName: '', email: '', opportunity: 'Website redesign' };
const initialCampaign = { name: '', country: 'United Kingdom', location: '', industry: '', opportunity: 'Website redesign' };

function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; }
}

function domainFromUrl(value: string) {
  const raw = value.trim();
  if (!raw) return '';
  try { return new URL(raw.match(/^https?:\/\//i) ? raw : `https://${raw}`).hostname.replace(/^www\./i, '').toLowerCase(); } catch { return raw.toLowerCase().replace(/^https?:\/\//i, '').split('/')[0].replace(/^www\./i, ''); }
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let cell = ''; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { cells.push(cell.trim()); cell = ''; }
    else cell += char;
  }
  cells.push(cell.trim());
  return cells;
}

function makeLead(values: typeof initialLeadForm, source = 'manual'): Lead {
  const domain = domainFromUrl(values.websiteUrl);
  return { id: crypto.randomUUID(), companyName: values.companyName.trim() || domain || 'Unnamed business', domain, websiteUrl: values.websiteUrl.trim(), country: values.country, city: values.city.trim(), industry: values.industry.trim(), contactName: values.contactName.trim(), email: values.email.trim().toLowerCase(), source, status: 'discovered', leadScore: 0, opportunity: values.opportunity, createdAt: new Date().toISOString() };
}

function scoreLabel(score: number) { return score >= 75 ? 'Priority' : score >= 60 ? 'Good' : score >= 40 ? 'Medium' : 'Low'; }

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return <div className="yg-metric"><div className="yg-metric-icon"><Icon /></div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function EmptyState({ icon: Icon, title, copy, action }: { icon: typeof Inbox; title: string; copy: string; action?: React.ReactNode }) {
  return <div className="yg-empty"><div className="yg-empty-icon"><Icon /></div><h3>{title}</h3><p>{copy}</p>{action}</div>;
}

function AppSidebar({ view, onNavigate, open, onClose }: { view: View; onNavigate: (view: View) => void; open: boolean; onClose: () => void }) {
  const groups = [...new Set(nav.map((item) => item.group))];
  return <aside className={`yg-sidebar ${open ? 'is-open' : ''}`}>
    <div className="yg-brand"><span className="yg-brand-mark"><LeafMark /></span><span><b>Ygrassil</b><small>BonsAI Studio</small></span><button className="yg-mobile-close" onClick={onClose} aria-label="Close navigation"><X /></button></div>
    <div className="yg-sidebar-scroll">
      {groups.map((group) => <div className="yg-nav-group" key={group}><small>{group}</small>{nav.filter((item) => item.group === group).map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'is-active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => { onNavigate(id); onClose(); }}><Icon /><span>{label}</span>{view === id ? <ChevronRight className="yg-nav-arrow" /> : null}</button>)}</div>)}
    </div>
    <div className="yg-sidebar-footer"><div className="yg-lock"><LockKeyhole /><div><b>Outbound locked</b><span>Server safety control</span></div></div><div className="yg-profile"><span>KB</span><div><b>Kuba</b><small>Administrator</small></div></div></div>
  </aside>;
}

function Header({ view, onMenu, onCreate }: { view: View; onMenu: () => void; onCreate: () => void }) {
  return <header className="yg-header"><button className="yg-menu" onClick={onMenu} aria-label="Open navigation"><Menu /></button><div><p>{view === 'dashboard' ? 'Ygrassil / live organism' : `Ygrassil / ${nav.find((item) => item.id === view)?.label}`}</p><h1>{view === 'dashboard' ? 'Autonomous sales, made visible.' : nav.find((item) => item.id === view)?.label}</h1></div><div className="yg-header-actions"><div className="yg-status"><i /> outbound locked</div><button className="yg-button yg-button-primary" onClick={onCreate}><Plus /> Create campaign</button></div></header>;
}

function LiveHeader({ paused, onMenu, onPause }: { paused: boolean; onMenu: () => void; onPause: () => void }) {
  return <header className="yg-live-header"><button className="yg-live-menu" onClick={onMenu} aria-label="Open navigation"><Menu /></button><div className="yg-live-brand"><span className="yg-brand-mark"><LeafMark /></span><div><b>Ygrassil</b><small>Autonomous Sales Engine</small></div></div><div className="yg-live-status"><span><i /> {paused ? 'PAUSED' : 'ACTIVE'}</span><button className="yg-live-pause" onClick={onPause} aria-label={paused ? 'Resume system' : 'Pause system'}>{paused ? <Play /> : <Pause />}</button></div></header>;
}

const SYSTEM_STATES: SystemState[] = ['IDLE', 'WORKING', 'PROCESSING', 'WAITING', 'BLOCKED', 'SUCCESSFUL'];
const AUTONOMY_MODES: Autonomy[] = ['ROOT', 'BRANCH', 'LEAF'];

function StateSwitch({ value, onChange }: { value: SystemState; onChange: (value: SystemState) => void }) {
  return <div className="yg-state-switch" aria-label="System state">
    {SYSTEM_STATES.map((state) => <button type="button" key={state} className={value === state ? 'is-active' : ''} aria-pressed={value === state} onClick={() => onChange(state)}>{state}</button>)}
  </div>;
}

function AutonomyControl({ value, onChange }: { value: Autonomy; onChange: (value: Autonomy) => void }) {
  const description = value === 'ROOT' ? 'Human approves external actions' : value === 'BRANCH' ? 'Safe operations may run automatically' : 'Standard pipeline runs automatically';
  return <div className="yg-autonomy"><span>Autonomy</span><div>{AUTONOMY_MODES.map((mode) => <button type="button" key={mode} className={value === mode ? 'is-active' : ''} aria-pressed={value === mode} onClick={() => onChange(mode)}><i />{mode}</button>)}</div><small>{description}</small></div>;
}

function LiveReadout({ state }: { state: SystemState }) {
  const message = state === 'BLOCKED' ? 'Flow held at ANALYZE' : state === 'SUCCESSFUL' ? 'Route completed' : state === 'PROCESSING' ? 'Analysis in progress' : 'Continuous system heartbeat';
  return <div className="yg-live-readout"><span><i /> {state === 'IDLE' ? 'YGRASSIL IDLE' : 'YGRASSIL ACTIVE'}</span><b>{message}</b><small>Local interface state · provider sync not configured</small></div>;
}

function SignalStats({ leads, state }: { leads: Lead[]; state: SystemState }) {
  const approvals = leads.filter((lead) => lead.status === 'awaiting_approval').length;
  return <div className="yg-live-bottom"><div className="yg-signal-row"><span><b>{leads.length}</b> live leads</span><span><b>{approvals}</b> human decisions</span><span><b>{state === 'BLOCKED' ? '0' : '—'}</b> messages sent</span></div></div>;
}

function LeadSignal({ lead, onNavigate, onSelectLead }: { lead?: Lead; onNavigate: (view: View) => void; onSelectLead: (id: string) => void }) {
  if (lead) return <button className="yg-live-lead" onClick={() => onSelectLead(lead.id)}><span className="yg-kicker">Live lead signal</span><strong>{lead.companyName}</strong><small>{lead.opportunity} · {lead.country}</small><i>Open lead <ArrowRight /></i></button>;
  return <div className="yg-live-lead yg-no-lead"><span className="yg-kicker">Lead signal</span><strong>Waiting for a real lead.</strong><small>Import a business to let it travel through the root system.</small><button type="button" className="yg-text-button" onClick={() => onNavigate('leads')}>Import business <ArrowRight /></button></div>;
}

function Dashboard({ paused }: { paused: boolean }) {
  const visibleState: SystemState = paused ? 'IDLE' : 'WORKING';
  return <div className="yg-live-page">
    <section className={`yg-live-instrument state-${visibleState.toLowerCase()}`}>
      <div className="yg-organism-wrap"><YgrassilRootScene state={visibleState} autonomy="BRANCH" onSelect={() => undefined} /></div>
    </section>
  </div>;
}

function CampaignModal({ onClose, onSave }: { onClose: () => void; onSave: (campaign: Campaign) => void }) {
  const [form, setForm] = useState(initialCampaign);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name.trim()) return; onSave({ ...form, id: crypto.randomUUID(), name: form.name.trim(), location: form.location.trim(), industry: form.industry.trim(), createdAt: new Date().toISOString() }); };
  return <div className="yg-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="yg-modal" onSubmit={submit}><div className="yg-modal-header"><div><span className="yg-kicker">New branch</span><h2>Create campaign</h2></div><button type="button" className="yg-icon-button" onClick={onClose} aria-label="Close"><X /></button></div><p>Give Ygrassil a precise market and opportunity to investigate.</p><label>Campaign name<input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Manchester dentists — redesign" /></label><div className="yg-form-row"><label>Country<select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}><option>United Kingdom</option><option>United States</option><option>Japan</option></select></label><label>Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Manchester" /></label></div><div className="yg-form-row"><label>Industry<input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Dentists" /></label><label>Opportunity<select value={form.opportunity} onChange={(e) => setForm({ ...form, opportunity: e.target.value })}><option>Website redesign</option><option>Conversion improvements</option><option>Booking system</option><option>Business automation</option><option>AI customer service</option><option>SEO improvements</option></select></label></div><div className="yg-modal-actions"><button type="button" className="yg-button yg-button-quiet" onClick={onClose}>Cancel</button><button className="yg-button yg-button-primary">Create campaign <ArrowRight /></button></div></form></div>;
}

function LeadDetail({ lead, onUpdate, onClose }: { lead: Lead; onUpdate: (lead: Lead) => void; onClose: () => void }) {
  const [notice, setNotice] = useState('');
  const action = (label: string, status?: LeadStatus) => { if (status) onUpdate({ ...lead, status }); setNotice(label); window.setTimeout(() => setNotice(''), 2600); };
  return <aside className="yg-detail"><div className="yg-detail-top"><div><span className="yg-kicker">Lead workspace</span><h2>{lead.companyName}</h2><span className="yg-muted">{lead.domain || 'No domain'} · {lead.country}{lead.city ? `, ${lead.city}` : ''}</span></div><button className="yg-icon-button" onClick={onClose} aria-label="Close lead"><X /></button></div><div className="yg-detail-score"><div><span>Lead score</span><strong>{lead.leadScore || '—'}</strong></div><span className="yg-score-label">{scoreLabel(lead.leadScore)}</span></div><div className="yg-detail-section"><span className="yg-kicker">Observed opportunity</span><h3>{lead.opportunity}</h3><p>{lead.websiteUrl ? 'Website supplied for audit. Research evidence will be added once the server-side analysis layer is configured.' : 'Add a website URL to give Ygrassil something concrete to inspect.'}</p></div><div className="yg-detail-section"><span className="yg-kicker">Contact</span><div className="yg-detail-facts"><span><Users /> {lead.contactName || 'Contact name unknown'}</span><span><Mail /> {lead.email || 'No email supplied'}</span><span><Globe2 /> {lead.websiteUrl || 'No website supplied'}</span></div></div><div className="yg-detail-section"><span className="yg-kicker">Next actions</span><div className="yg-action-stack"><button onClick={() => action('Lead marked ready for research.', 'analysed')}><Bot /> Analyse lead</button><button onClick={() => action('Draft placeholder created for review.', 'awaiting_approval')}><Mail /> Generate email draft</button><button onClick={() => action('Outbound is locked until server configuration is complete.')}><Send /> Send test</button><button className="is-danger" onClick={() => action('Lead suppressed. It will not be eligible for automated outbound.', 'do_not_contact')}><ShieldCheck /> Do not contact</button></div></div>{notice ? <div className="yg-toast"><Check /> {notice}</div> : null}</aside>;
}

function LeadsView({ leads, onAdd, onImport, onTemplate, onSelect }: { leads: Lead[]; onAdd: () => void; onImport: (event: ChangeEvent<HTMLInputElement>) => void; onTemplate: () => void; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const visible = leads.filter((lead) => `${lead.companyName} ${lead.domain} ${lead.city} ${lead.industry}`.toLowerCase().includes(query.toLowerCase()));
  const selectWithKeyboard = (leadId: string, event: React.KeyboardEvent<HTMLTableRowElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(leadId); } };
  return <div className="yg-page yg-leads-view"><section className="yg-page-intro"><div><span className="yg-kicker">Lead database</span><h2>Businesses, not rows.</h2><p>Every lead should carry a reason, an evidence trail and a clear next action.</p></div><div className="yg-page-actions"><button className="yg-button yg-button-quiet" onClick={onTemplate}><Download /> CSV template</button><label className="yg-button yg-button-outline"><FileSpreadsheet /> Import CSV<input type="file" accept=".csv,text/csv" onChange={onImport} hidden /></label><button className="yg-button yg-button-primary" onClick={onAdd}><Plus /> Add business</button></div></section><section className="yg-panel yg-lead-list-panel"><div className="yg-list-toolbar"><label className="yg-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, domain or city" /></label><button className="yg-filter-button"><Filter /> Filters <span>{leads.length}</span></button></div>{visible.length ? <div className="yg-table-wrap"><table className="yg-leads-table"><thead><tr><th>Company</th><th>Market</th><th>Contact</th><th>Opportunity</th><th>Score</th><th>Status</th><th /></tr></thead><tbody>{visible.map((lead) => <tr key={lead.id} tabIndex={0} onClick={() => onSelect(lead.id)} onKeyDown={(event) => selectWithKeyboard(lead.id, event)}><td><b>{lead.companyName}</b><small>{lead.domain || 'No website'}</small></td><td><span className="yg-country-dot" />{lead.country}<small>{lead.city || 'City unknown'}</small></td><td>{lead.email || <span className="yg-muted">Missing email</span>}<small>{lead.contactName || 'Contact unknown'}</small></td><td>{lead.opportunity}</td><td><strong className="yg-score">{lead.leadScore || '—'}</strong></td><td><span className={`yg-status-tag status-${lead.status}`}>{lead.status.replace('_', ' ')}</span></td><td><ChevronRight /></td></tr>)}</tbody></table></div> : <EmptyState icon={Building2} title={leads.length ? 'No leads match that search' : 'No businesses yet'} copy={leads.length ? 'Try a different company, domain or city.' : 'Add one business manually or import a CSV to begin.'} action={!leads.length ? <button className="yg-button yg-button-primary" onClick={onAdd}><Plus /> Add first business</button> : undefined} />}</section></div>;
}

function AddLeadModal({ onClose, onSave }: { onClose: () => void; onSave: (lead: Lead) => void }) {
  const [form, setForm] = useState(initialLeadForm);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.companyName.trim() && !form.websiteUrl.trim()) return; onSave(makeLead(form)); };
  return <div className="yg-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="yg-modal" onSubmit={submit}><div className="yg-modal-header"><div><span className="yg-kicker">Manual ingestion</span><h2>Add business</h2></div><button type="button" className="yg-icon-button" onClick={onClose} aria-label="Close"><X /></button></div><p>Keep the source visible. Ygrassil will not fabricate what the site does not reveal.</p><div className="yg-form-row"><label>Company name<input autoFocus value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Northstar Dental" /></label><label>Website URL<input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://example.com" /></label></div><div className="yg-form-row"><label>Country<select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}><option>United Kingdom</option><option>United States</option><option>Japan</option></select></label><label>City<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Bristol" /></label></div><div className="yg-form-row"><label>Industry<input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Dental clinic" /></label><label>Opportunity<select value={form.opportunity} onChange={(e) => setForm({ ...form, opportunity: e.target.value })}><option>Website redesign</option><option>Conversion improvements</option><option>Booking system</option><option>Business automation</option><option>AI customer service</option><option>SEO improvements</option></select></label></div><div className="yg-form-row"><label>Contact name<input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="Optional" /></label><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Optional" /></label></div><div className="yg-modal-actions"><button type="button" className="yg-button yg-button-quiet" onClick={onClose}>Cancel</button><button className="yg-button yg-button-primary">Add business <ArrowRight /></button></div></form></div>;
}

function PlaceholderView({ view, leads, onNavigate }: { view: View; leads: Lead[]; onNavigate: (view: View) => void }) {
  const content: Record<Exclude<View, 'dashboard' | 'campaigns' | 'leads'>, { icon: typeof Inbox; title: string; copy: string }> = { approval: { icon: Check, title: 'The approval queue is empty.', copy: 'Generated outreach will appear here only after a lead has evidence and a draft worth reviewing.' }, inbox: { icon: Inbox, title: 'No replies synced.', copy: 'IMAP sync will surface replies here once SpaceMail is configured server-side.' }, followups: { icon: Clock3, title: 'No follow-ups scheduled.', copy: 'Replies and suppression events will cancel follow-ups automatically.' }, opportunities: { icon: Sparkles, title: 'No opportunities yet.', copy: 'Analyse a lead to turn concrete website evidence into an offer BonsAI Studio can stand behind.' }, analytics: { icon: BarChart3, title: 'Analytics will follow the work.', copy: 'Ygrassil will show reply rate and country distribution after real activity exists.' }, suppression: { icon: ShieldCheck, title: 'Suppression list is clear.', copy: 'Unsubscribes and manually blocked contacts will be protected here.' }, settings: { icon: Settings, title: 'System settings.', copy: 'Configure AI, SpaceMail, sender identity and compliance before enabling outbound.' }, activity: { icon: Activity, title: 'No activity recorded.', copy: 'Lead imports and research actions will create a durable timeline here.' } };
  const data = content[view as Exclude<View, 'dashboard' | 'campaigns' | 'leads'>];
  return <div className="yg-page yg-placeholder-page"><section className="yg-page-intro"><div><span className="yg-kicker">{view === 'settings' ? 'Configuration' : 'Ygrassil intelligence'}</span><h2>{data.title}</h2><p>{data.copy}</p></div>{view === 'settings' ? <button className="yg-button yg-button-primary" onClick={() => onNavigate('dashboard')}><LockKeyhole /> Outbound locked</button> : null}</section><section className="yg-panel yg-placeholder-panel"><EmptyState icon={data.icon} title={leads.length ? 'This branch is ready for the next signal' : 'No live data yet'} copy="The interface is wired for persisted local data; provider-backed work starts after server configuration." action={view === 'leads' ? <button className="yg-button yg-button-primary" onClick={() => onNavigate('leads')}>Open leads <ArrowRight /></button> : undefined} /></section></div>;
}

function LeafMark() { return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 25c8-1 14-5 18-15-8 1-14 5-18 15Z" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M7 25C12 19 17 14 24 10M11 20l-4-1M15 16l-4-3M19 13l-3-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>; }

export function YgrassilApp() {
  useEffect(() => {
    document.title = 'Ygrassil — Autonomous Sales Engine';
  }, []);

  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(() => load(LEADS_STORE, []));
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => load(CAMPAIGNS_STORE, []));
  const [modal, setModal] = useState<'campaign' | 'lead' | null>(null);
  const [livePaused, setLivePaused] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;
  const duplicateDomains = useMemo(() => new Set(leads.map((lead) => lead.domain).filter(Boolean)), [leads]);
  const persistLeads = (next: Lead[]) => { setLeads(next); localStorage.setItem(LEADS_STORE, JSON.stringify(next)); };
  const persistCampaigns = (next: Campaign[]) => { setCampaigns(next); localStorage.setItem(CAMPAIGNS_STORE, JSON.stringify(next)); };
  const addLead = (lead: Lead) => { if (lead.domain && duplicateDomains.has(lead.domain)) { setModal(null); setSelectedLeadId(leads.find((item) => item.domain === lead.domain)?.id || null); return; } persistLeads([lead, ...leads]); setModal(null); setSelectedLeadId(lead.id); setView('leads'); };
  const importCsv = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const text = await file.text(); const lines = text.split(/\r?\n/).filter(Boolean); if (lines.length < 2) return; const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase()); const imported = lines.slice(1).map((line) => { const values = parseCsvLine(line); const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])); return makeLead({ companyName: row.company_name || '', websiteUrl: row.website || '', country: row.country || 'United Kingdom', city: row.city || '', industry: row.industry || '', contactName: row.contact_name || '', email: row.email || '', opportunity: row.opportunity || 'Website redesign' }, 'csv'); }).filter((lead) => lead.companyName !== 'Unnamed business' || lead.domain).filter((lead) => !lead.domain || !duplicateDomains.has(lead.domain)); if (imported.length) persistLeads([...imported, ...leads]); event.target.value = ''; };
  const downloadTemplate = () => { const blob = new Blob(['company_name,website,country,city,industry,contact_name,email,source_url\nNorthstar Dental,https://example.com,United Kingdom,Bristol,Dental clinic,,,https://source.example\n'], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ygrassil-leads-template.csv'; anchor.click(); URL.revokeObjectURL(url); };
  const updateLead = (next: Lead) => persistLeads(leads.map((lead) => lead.id === next.id ? next : lead));
  const isLive = view === 'dashboard';
  return <div className={`ygrassil-app ${isLive ? 'yg-live-shell' : ''}`}>{!isLive ? <AppSidebar view={view} onNavigate={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> : null}{isLive && sidebarOpen ? <AppSidebar view={view} onNavigate={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> : null}{sidebarOpen ? <button className="yg-mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" /> : null}<div className="yg-main">{isLive ? <LiveHeader paused={livePaused} onMenu={() => setSidebarOpen(true)} onPause={() => setLivePaused((value) => !value)} /> : <Header view={view} onMenu={() => setSidebarOpen(true)} onCreate={() => setModal('campaign')} />}<main>{view === 'dashboard' ? <Dashboard paused={livePaused} /> : view === 'leads' ? <LeadsView leads={leads} onAdd={() => setModal('lead')} onImport={importCsv} onTemplate={downloadTemplate} onSelect={(id) => setSelectedLeadId(id)} /> : view === 'campaigns' ? <div className="yg-page"><section className="yg-page-intro"><div><span className="yg-kicker">Hunt</span><h2>Campaigns with a point of view.</h2><p>Each branch keeps country, location, industry and opportunity together.</p></div><button className="yg-button yg-button-primary" onClick={() => setModal('campaign')}><Plus /> Create campaign</button></section><section className="yg-panel yg-campaigns-grid">{campaigns.length ? campaigns.map((campaign) => <article key={campaign.id}><div className="yg-campaign-card-top"><span className="yg-kicker">Campaign</span><Target /></div><h3>{campaign.name}</h3><p>{campaign.country}{campaign.location ? ` · ${campaign.location}` : ''}</p><div><span>{campaign.industry || 'Industry open'}</span><span>{campaign.opportunity}</span></div><button className="yg-text-button" onClick={() => setView('leads')}>View leads <ArrowRight /></button></article>) : <EmptyState icon={Target} title="No campaigns" copy="Start with one market, one industry and one concrete opportunity." action={<button className="yg-button yg-button-primary" onClick={() => setModal('campaign')}><Plus /> Create campaign</button>} />}</section></div> : <PlaceholderView view={view} leads={leads} onNavigate={setView} />}</main></div>{selectedLead ? <LeadDetail lead={selectedLead} onUpdate={updateLead} onClose={() => setSelectedLeadId(null)} /> : null}{modal === 'campaign' ? <CampaignModal onClose={() => setModal(null)} onSave={(campaign) => { persistCampaigns([campaign, ...campaigns]); setModal(null); setView('campaigns'); }} /> : null}{modal === 'lead' ? <AddLeadModal onClose={() => setModal(null)} onSave={addLead} /> : null}</div>;
}
