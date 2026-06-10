"use client";

import {
  Activity, ArrowUpRight, BarChart3, Bell, CalendarDays, Check,
  ChevronDown, CircleDollarSign, Clock3, Filter, Handshake, HelpCircle,
  Inbox, LayoutDashboard, ListFilter, Menu,
  MoreHorizontal, Plus, Search, Settings, Sparkles, Target, Users, X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Deal = {
  id: number; company: string; contact: string; value: number; stage: string;
  avatar: string; color: string; due: string; activity: string;
};

const initialDeals: Deal[] = [
  { id: 1, company: "Northstar Labs", contact: "Maya Chen", value: 48000, stage: "Qualified", avatar: "MC", color: "violet", due: "Jun 12", activity: "Email opened 2h ago" },
  { id: 2, company: "Oak & Co.", contact: "Jon Bell", value: 18500, stage: "Qualified", avatar: "JB", color: "amber", due: "Jun 14", activity: "Call logged yesterday" },
  { id: 3, company: "Papertrail", contact: "Nina Shah", value: 32000, stage: "Proposal", avatar: "NS", color: "rose", due: "Jun 11", activity: "Quote viewed 38m ago" },
  { id: 4, company: "Mode Systems", contact: "Theo Grant", value: 76000, stage: "Proposal", avatar: "TG", color: "blue", due: "Jun 16", activity: "Meeting booked" },
  { id: 5, company: "Kanso Studio", contact: "Liv Morgan", value: 24500, stage: "Negotiation", avatar: "LM", color: "green", due: "Today", activity: "Replied 12m ago" },
  { id: 6, company: "Juniper Health", contact: "Omar Reed", value: 92000, stage: "Negotiation", avatar: "OR", color: "cyan", due: "Jun 13", activity: "Legal review pending" },
  { id: 7, company: "Arcworks", contact: "Sam Kim", value: 41000, stage: "Closing", avatar: "SK", color: "indigo", due: "Today", activity: "Contract sent 1h ago" },
];

const stages = [
  { name: "Qualified", tone: "lavender" },
  { name: "Proposal", tone: "blue" },
  { name: "Negotiation", tone: "amber" },
  { name: "Closing", tone: "green" },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Pipeline", icon: Target },
  { label: "Contacts", icon: Users },
  { label: "Activities", icon: Activity },
  { label: "Inbox", icon: Inbox, badge: "6" },
  { label: "Reports", icon: BarChart3 },
];

export default function Home() {
  const [deals, setDeals] = useState(initialDeals);
  const [activeNav, setActiveNav] = useState("Pipeline");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => deals.filter((deal) =>
    `${deal.company} ${deal.contact}`.toLowerCase().includes(query.toLowerCase())
  ), [deals, query]);

  const total = deals.reduce((sum, deal) => sum + deal.value, 0);

  function addDeal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const company = String(form.get("company"));
    const value = Number(form.get("value"));
    setDeals((current) => [...current, {
      id: Date.now(), company, contact: String(form.get("contact")), value,
      stage: "Qualified", avatar: company.slice(0, 2).toUpperCase(), color: "violet",
      due: "Jun 20", activity: "Deal created just now",
    }]);
    setModalOpen(false);
    setToast(`${company} added to Qualified`);
    window.setTimeout(() => setToast(""), 3000);
  }

  function advanceDeal(id: number) {
    setDeals((current) => current.map((deal) => {
      if (deal.id !== id) return deal;
      const index = stages.findIndex((stage) => stage.name === deal.stage);
      return { ...deal, stage: stages[Math.min(index + 1, stages.length - 1)].name };
    }));
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="brand"><span className="brand-mark"><Sparkles size={18} /></span><span>folkline</span></div>
        <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button>
        <div className="workspace">
          <span className="workspace-logo">F</span>
          <div><strong>Folkline HQ</strong><small>Starter workspace</small></div>
          <ChevronDown size={16} />
        </div>
        <nav aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(({ label, icon: Icon, badge }) => (
            <button key={label} className={activeNav === label ? "active" : ""} onClick={() => { setActiveNav(label); setMenuOpen(false); }}>
              <Icon size={19} /><span>{label}</span>{badge && <em>{badge}</em>}
            </button>
          ))}
          <p className="nav-label second">Tools</p>
          <button><CircleDollarSign size={19} /><span>Quotes & invoices</span></button>
          <button><CalendarDays size={19} /><span>Calendar</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="trial-card"><div><Sparkles size={17} /><strong>Free forever</strong></div><p>All your data, on your server.</p><button>View open-source repo <ArrowUpRight size={14} /></button></div>
          <button><Settings size={19} /><span>Settings</span></button>
          <button><HelpCircle size={19} /><span>Help center</span></button>
          <div className="profile"><span className="avatar dark">JD</span><div><strong>Jamie Davis</strong><small>jamie@folkline.io</small></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button>
          <div className="global-search"><Search size={18} /><input aria-label="Search all records" placeholder="Search contacts, deals..." /><kbd>⌘ K</kbd></div>
          <div className="top-actions"><button aria-label="Notifications" className="icon-button"><Bell size={19} /><i /></button><span className="avatar">JD</span></div>
        </header>

        <div className="content">
          <section className="heading-row">
            <div><p className="eyebrow">Sales workspace</p><h1>{activeNav}</h1><p className="subtitle">Track every opportunity from first conversation to closed won.</p></div>
            <button className="primary" onClick={() => setModalOpen(true)}><Plus size={18} /> New deal</button>
          </section>

          <section className="stats-grid" aria-label="Pipeline summary">
            <article><span className="stat-icon purple"><CircleDollarSign /></span><div><p>Pipeline value</p><strong>{money(total)}</strong><small className="up">↗ 12.4% <span>vs last month</span></small></div></article>
            <article><span className="stat-icon blue"><Handshake /></span><div><p>Open deals</p><strong>{deals.length}</strong><small>Across 4 stages</small></div></article>
            <article><span className="stat-icon green"><Target /></span><div><p>Win rate</p><strong>38.6%</strong><small className="up">↗ 4.2% <span>vs last month</span></small></div></article>
            <article><span className="stat-icon amber"><Clock3 /></span><div><p>Avg. sales cycle</p><strong>24 days</strong><small>3 days faster</small></div></article>
          </section>

          <section className="pipeline-panel">
            <div className="panel-toolbar">
              <div className="view-tabs"><button className="selected"><LayoutDashboard size={17} /> Board</button><button><ListFilter size={17} /> List</button></div>
              <div className="toolbar-actions">
                <label className="deal-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search deals" /></label>
                <button className="secondary"><Filter size={16} /> Filter</button>
                <button className="secondary">This quarter <ChevronDown size={15} /></button>
              </div>
            </div>

            <div className="board">
              {stages.map((stage) => {
                const stageDeals = filtered.filter((deal) => deal.stage === stage.name);
                const stageTotal = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
                return (
                  <div className="column" key={stage.name}>
                    <div className="column-header">
                      <div><span className={`dot ${stage.tone}`} /><strong>{stage.name}</strong><b>{stageDeals.length}</b></div>
                      <span>{money(stageTotal)}</span>
                    </div>
                    <div className="column-body">
                      {stageDeals.map((deal) => (
                        <article className="deal-card" key={deal.id}>
                          <div className="deal-top"><span className={`company-icon ${deal.color}`}>{deal.company.slice(0, 1)}</span><button aria-label={`More actions for ${deal.company}`}><MoreHorizontal size={18} /></button></div>
                          <h2>{deal.company}</h2>
                          <p className="deal-value">{money(deal.value)}</p>
                          <div className="contact"><span className={`avatar ${deal.color}`}>{deal.avatar}</span><span>{deal.contact}</span></div>
                          <div className="deal-meta"><span className={deal.due === "Today" ? "due-now" : ""}><CalendarDays size={14} /> {deal.due}</span><button onClick={() => advanceDeal(deal.id)} title="Move to next stage"><ArrowUpRight size={15} /></button></div>
                          <p className="activity-line"><span />{deal.activity}</p>
                        </article>
                      ))}
                      <button className="add-card" onClick={() => setModalOpen(true)}><Plus size={16} /> Add deal</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.slice(0, 4).map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => setActiveNav(label)}><Icon /><span>{label}</span></button>)}
      </nav>

      {modalOpen && <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}>
        <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-head"><div><p className="eyebrow">New opportunity</p><h2 id="modal-title">Add a deal</h2></div><button onClick={() => setModalOpen(false)} aria-label="Close"><X /></button></div>
          <form onSubmit={addDeal}>
            <label>Company name<input name="company" required placeholder="e.g. Acme Inc." /></label>
            <label>Primary contact<input name="contact" required placeholder="Full name" /></label>
            <label>Deal value<div className="money-input"><span>$</span><input name="value" type="number" min="1" required placeholder="25,000" /></div></label>
            <div className="modal-actions"><button type="button" className="secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary" type="submit"><Plus size={17} /> Add deal</button></div>
          </form>
        </div>
      </div>}
      {toast && <div className="toast"><Check size={17} /> {toast}</div>}
    </div>
  );
}
