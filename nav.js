// Unified Navigation, Partials Loader & Responsive Left Sidebar System (GitHub Pages Compatible)
// Single source of truth for Header/Nav, Breadcrumb, Term-Switcher, Pager, and Footer across all pages.
(function () {
    const STORAGE_KEY = 'khemmi_sidebar_collapsed_v3';
    const rawFile = window.location.pathname.split('/').pop() || 'index.html';
    const currentFile = (rawFile === '' ? 'index.html' : rawFile).toLowerCase();

    // Inject unified responsive layout & sidebar styles
    const style = document.createElement('style');
    style.id = 'khemmi-unified-nav-styles';
    style.textContent = `
        :root {
            --sidebar-width: 272px;
            --sidebar-collapsed-width: 76px;
        }

        body {
            padding-left: var(--sidebar-width) !important;
            transition: padding-left 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        body.sidebar-collapsed {
            padding-left: var(--sidebar-collapsed-width) !important;
        }

        @media (max-width: 640px) {
            :root {
                --sidebar-width: 256px;
                --sidebar-collapsed-width: 64px;
            }
        }

        /* Persistent Left Sidebar — Always Visible on All Pages */
        #khemmi-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: var(--sidebar-width);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(24px) saturate(190%);
            -webkit-backdrop-filter: blur(24px) saturate(190%);
            border-right: 2px solid rgba(226, 232, 240, 0.95);
            box-shadow: 8px 0 32px rgba(15, 23, 42, 0.08);
            z-index: 999;
            display: flex;
            flex-direction: column;
            transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
        }

        body.sidebar-collapsed #khemmi-sidebar {
            width: var(--sidebar-collapsed-width);
        }

        body.sidebar-collapsed .sb-hide-collapsed {
            display: none !important;
        }

        body.sidebar-collapsed .sb-submenu {
            display: none !important;
        }

        body.sidebar-collapsed .sb-nav-item,
        body.sidebar-collapsed .sb-header-inner {
            justify-content: center !important;
            padding-left: 0.4rem !important;
            padding-right: 0.4rem !important;
        }

        .sb-scroll {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0.65rem 0.65rem;
        }
        .sb-scroll::-webkit-scrollbar {
            width: 4px;
        }
        .sb-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
        }

        .sb-submenu {
            position: relative;
            margin-left: 1.25rem;
            padding-left: 0.75rem;
            border-left: 2px solid #cbd5e1;
            margin-top: 0.25rem;
            margin-bottom: 0.35rem;
        }

        #khemmi-edge-toggle {
            position: absolute;
            top: 22px;
            right: -14px;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            background: linear-gradient(135deg, #ec4899, #6366f1);
            color: white;
            border: 2px solid white;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1005;
            transition: transform 0.2s ease;
        }
        #khemmi-edge-toggle:hover {
            transform: scale(1.1);
        }

        main {
            max-width: 1320px !important;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            transition: max-width 0.28s ease;
        }
        body.sidebar-collapsed main {
            max-width: 1480px !important;
        }
    `;
    if (!document.getElementById('khemmi-unified-nav-styles')) {
        document.head.appendChild(style);
    }

    // Standard 7 Main Menu Items (Fixed Order & Exact Names)
    const CATEGORIES = [
        {
            key: 'home',
            label: 'หน้าหลัก',
            href: 'index.html',
            icon: 'home',
            matchFiles: ['index.html'],
            hasTerms: false
        },
        {
            key: 'report',
            label: 'แผนการสอน',
            href: 'report.html',
            term1Href: 'report-term1.html',
            term2Href: 'report-term2.html',
            icon: 'book-open',
            matchFiles: ['report.html', 'report-term1.html', 'report-term2.html'],
            hasTerms: true
        },
        {
            key: 'log',
            label: 'บันทึกผลการสอน',
            href: 'log.html',
            term1Href: 'log-term1.html',
            term2Href: 'log-term2.html',
            icon: 'clipboard-list',
            matchFiles: ['log.html', 'log-term1.html', 'log-term2.html'],
            hasTerms: true
        },
        {
            key: 'research',
            label: 'งานวิจัยในชั้นเรียน',
            href: 'research.html',
            term1Href: 'research-term1.html',
            term2Href: 'research-term2.html',
            icon: 'flask-conical',
            matchFiles: ['research.html', 'research-term1.html', 'research-term2.html'],
            hasTerms: true
        },
        {
            key: 'evaluation',
            label: 'การนิเทศการสอน',
            href: 'evaluation.html',
            term1Href: 'evaluation-term1.html',
            term2Href: 'evaluation-term2.html',
            icon: 'star',
            matchFiles: ['evaluation.html', 'evaluation-term1.html', 'evaluation-term2.html'],
            hasTerms: true
        },
        {
            key: 'school',
            label: 'ข้อมูลวิทยาลัย',
            href: 'school.html',
            icon: 'building-2',
            matchFiles: ['school.html'],
            hasTerms: false
        },
        {
            key: 'profile',
            label: 'ผู้จัดทำ',
            href: 'profile.html',
            icon: 'user',
            matchFiles: ['profile.html'],
            hasTerms: false
        }
    ];

    function getActiveCategory() {
        return CATEGORIES.find(c => c.matchFiles.includes(currentFile)) || CATEGORIES[0];
    }

    function getTermType() {
        if (currentFile.endsWith('-term1.html')) return 'term1';
        if (currentFile.endsWith('-term2.html')) return 'term2';
        return 'overview';
    }

    // Bind Sidebar collapse/expand events
    function bindSidebarEvents() {
        const savedCollapsed = localStorage.getItem(STORAGE_KEY) === '1';
        if (savedCollapsed) {
            document.body.classList.add('sidebar-collapsed');
        }

        function updateToggleIcons() {
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            const edgeBtn = document.getElementById('khemmi-edge-toggle');
            const botBtn = document.getElementById('khemmi-bottom-toggle');
            if (edgeBtn) {
                edgeBtn.innerHTML = `<i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-left'}" class="w-4 h-4"></i>`;
            }
            if (botBtn) {
                botBtn.innerHTML = `
                    <i data-lucide="${isCollapsed ? 'chevrons-right' : 'chevrons-left'}" class="w-4 h-4"></i>
                    <span class="sb-hide-collapsed">${isCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนูด้านซ้าย'}</span>
                `;
            }
            if (window.lucide) window.lucide.createIcons();
        }

        function toggleSidebar(forceState) {
            const nextState = typeof forceState === 'boolean'
                ? forceState
                : !document.body.classList.contains('sidebar-collapsed');
            document.body.classList.toggle('sidebar-collapsed', nextState);
            localStorage.setItem(STORAGE_KEY, nextState ? '1' : '0');
            updateToggleIcons();
            setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
        }

        document.getElementById('khemmi-edge-toggle')?.addEventListener('click', () => toggleSidebar());
        document.getElementById('khemmi-bottom-toggle')?.addEventListener('click', () => toggleSidebar());
        document.getElementById('khemmi-topbar-collapse-btn')?.addEventListener('click', () => toggleSidebar());

        updateToggleIcons();
    }

    // Optional runtime partial sync from /partials/*.html when served over HTTP/HTTPS (GitHub Pages)
    async function syncPartialsIfNeeded() {
        bindSidebarEvents();
        if (window.lucide) window.lucide.createIcons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncPartialsIfNeeded);
    } else {
        syncPartialsIfNeeded();
    }
})();
