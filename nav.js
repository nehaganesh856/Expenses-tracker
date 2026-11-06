// nav.js — Right-side navigation drawer for all pages

const NAV_ITEMS = [
  { id: "dashboard",       label: "Dashboard",        icon: "📊", href: "dashboard.html" },
  { id: "expenses",        label: "Expenses",          icon: "💸", href: "expenses.html" },
  { id: "income",          label: "Income",            icon: "💰", href: "income.html" },
  { id: "budgets",         label: "Budgets",           icon: "🎯", href: "budgets.html" },
  { id: "semesters",       label: "Semesters",         icon: "📅", href: "semesters.html" },
  { id: "college-fees",    label: "College Fees",      icon: "🏫", href: "college-fees.html" },
  { id: "savings-goals",   label: "Savings Goals",     icon: "🏦", href: "savings-goals.html" },
  { id: "scholarships",    label: "Scholarships",      icon: "🎓", href: "scholarships.html" },
  { id: "reports",         label: "Reports",           icon: "📈", href: "reports.html" },
  { id: "reminders",       label: "Reminders",         icon: "🔔", href: "reminders.html", badge: true },
  { id: "profile-settings",label: "Profile & Settings",icon: "⚙️", href: "profile-settings.html" },
  // Coming soon items
  { id: "split-expenses",  label: "Split Expenses",    icon: "🤝", href: "split-expenses.html",  soon: true },
  { id: "ai-assistant",    label: "AI Assistant",      icon: "🤖", href: "ai-assistant.html",    soon: true },
  { id: "receipt-scanner", label: "Receipt Scanner",   icon: "📷", href: "receipt-scanner.html", soon: true },
];

function buildNav(currentPageId, user) {
  // Inject nav HTML into page
  const existing = document.getElementById("appNav");
  if (!existing) return;

  // Build the nav items HTML
  const itemsHtml = NAV_ITEMS.map(item => {
    const isActive = item.id === currentPageId;
    const badgeHtml = item.badge
      ? `<span class="nav-badge reminder-badge" hidden>0</span>` : "";
    const soonHtml = item.soon
      ? `<span class="nav-soon">Soon</span>` : "";
    return `
      <a href="${item.href}" class="nav-item${isActive ? " active" : ""}${item.soon ? " nav-disabled" : ""}"
         ${item.soon ? 'onclick="return false;"' : ""} data-page="${item.id}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
        ${badgeHtml}${soonHtml}
      </a>`;
  }).join("");

  existing.innerHTML = `
    <div class="nav-overlay" id="navOverlay"></div>
    <aside class="nav-drawer" id="navDrawer" aria-label="Main navigation">
      <div class="nav-header">
        <div class="nav-brand">
          <span class="nav-brand-icon">🎓</span>
          <div>
            <div class="nav-brand-name">EduFinance</div>
            <div class="nav-brand-sub">Student Tracker</div>
          </div>
        </div>
        <button class="nav-close-btn" id="navCloseBtn" aria-label="Close menu">✕</button>
      </div>

      <div class="nav-user">
        <div class="nav-avatar">${user ? user.name.charAt(0).toUpperCase() : "?"}</div>
        <div class="nav-user-info">
          <div class="nav-user-name">${escapeHtml(user ? user.name : "Student")}</div>
          <div class="nav-user-email">${escapeHtml(user ? user.email : "")}</div>
        </div>
      </div>

      <nav class="nav-links" role="navigation">
        ${itemsHtml}
      </nav>

      <div class="nav-footer">
        <button class="nav-logout-btn" id="navLogoutBtn">
          <span>🚪</span> Log out
        </button>
        <div class="nav-version">Smart Student Expense Tracker</div>
      </div>
    </aside>`;

  // Wire up events
  document.getElementById("navOverlay").addEventListener("click", closeNav);
  document.getElementById("navCloseBtn").addEventListener("click", closeNav);
  document.getElementById("navLogoutBtn").addEventListener("click", async () => {
    try { await API_CLIENT.post("/auth/logout", {}); } catch {}
    location.replace("login.html");
  });

  // Load reminder badge
  loadReminderBadge();
}

function openNav() {
  const drawer = document.getElementById("navDrawer");
  const overlay = document.getElementById("navOverlay");
  if (drawer) { drawer.classList.add("open"); overlay.classList.add("active"); }
  document.body.style.overflow = "hidden";
}

function closeNav() {
  const drawer = document.getElementById("navDrawer");
  const overlay = document.getElementById("navOverlay");
  if (drawer) { drawer.classList.remove("open"); overlay.classList.remove("active"); }
  document.body.style.overflow = "";
}

// Wire hamburger button
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("navOpenBtn");
  if (btn) btn.addEventListener("click", openNav);
});

// Close on ESC
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeNav();
});
