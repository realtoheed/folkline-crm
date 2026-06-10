"use client";

import {
  Activity, ArrowUpRight, BarChart3, Bell, CalendarDays, Check,
  ChevronDown, CircleDollarSign, Clock3, Filter, Handshake, HelpCircle,
  Inbox, LayoutDashboard, ListFilter, LogOut, Menu,
  MoreHorizontal, Plus, Search, Settings, Sparkles, Target, Trash2, Users, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Deal = {
  id: string; company: string; contact: string; value: number; stage: string;
  avatar: string; color: string; due: string; activity: string;
};

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("Pipeline");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/deals")
      .then((r) => r.json())
      .then((data) => { setDeals(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3000);
  }

  async function addDeal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = { company: form.get("company"), contact: form.get("contact"), value: form.get("value") };
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return;
    const deal = await res.json();
    setDeals((current) => [...current, deal]);
    setModalOpen(false);
    showToast(`${deal.company} added to Qualified`);
  }

  async function advanceDeal(id: string) {
    const deal = deals.find((d) => d.id === id);
    if (!deal) return;
    const index = stages.findIndex((s) => s.name === deal.stage);
    const nextStage = stages[Math.min(index + 1, stages.length - 1)].name;
    const res = await fetch(`/api/deals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: nextStage }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setDeals((current) => current.map((d) => (d.id === id ? updated : d)));
  }

  async function deleteDeal(id: string) {
    const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setDeals((current) => current.filter((d) => d.id !== id));
    showToast("Deal deleted");
  }

  const filtered = useMemo(() => deals.filter((deal) =>
    `${deal.company} ${deal.contact}`.toLowerCase().includes(query.toLowerCase())
  ), [deals, query]);

  const total = deals.reduce((sum, deal) => sum + deal.value, 0);

  if (status === "loading" || loading) {
    return <div className="app-shell"><div className="loading-screen"><Sparkles size={32} /><p>Loading your pipeline…</p></div></div>;
  }

  if (status === "unauthenticated") return null;

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
          <div className="trial-card"><div><Sparkles size={17} /><strong>Free forever</strong></div><p>All your data, on your server.</p></div>
          <button><Settings size={19} /><span>Settings</span></button>
          <button><HelpCircle size={19} /><span>Help center</span></button>
          <div className="profile">
            <span className="avatar dark">{session?.user?.name?.slice(0, 2).toUpperCase() || "JD"}</span>
            <div><strong>{session?.user?.name || "Jamie Davis"}</strong><small>{session?.user?.email || "jamie@folkline.io"}</small></div>
            <button onClick={() => signOut()} title="Sign out"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button>
          <div className="global-search"><Search size={18} /><input aria-label="Search all records" placeholder="Search contacts, deals…" /><kbd>⌘ K</kbd></div>
          <div className="top-actions"><button aria-label="Notifications" className="icon-button"><Bell size={19} /><i /></button><span className="avatar">{session?.user?.name?.slice(0, 2).toUpperCase() || "JD"}</span></div>
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
                          <div className="deal-top">
                            <span className={`company-icon ${deal.color}`}>{deal.company.slice(0, 1)}</span>
                            <div className="deal-actions">
                              <button onClick={() => deleteDeal(deal.id)} title="Delete deal"><Trash2 size={16} /></button>
                              <button title="More options"><MoreHorizontal size={18} /></button>
                            </div>
                          </div>
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
