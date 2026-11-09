// Unified Responsive Left Sidebar + Top Sub-navigation Bar across ALL pages
(function () {
    const STORAGE_KEY = 'khemmi_sidebar_collapsed_v2';
    const rawFile = window.location.pathname.split('/').pop() || 'index.html';
    const currentFile = (rawFile === '' ? 'index.html' : rawFile).toLowerCase();

    const style = document.createElement('style');
    style.textContent = `
        /* Hide old legacy header and old inline breadcrumb bars so every page uses the exact same unified navigation */
        body > header {
            display: none !important;
        }
        main > div > nav[aria-label="Breadcrumb"] {
            display: none !important;
        }

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
            background: rgba(255, 255, 255, 0.94);
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
        body.sidebar-collapsed .sb-group-btn,
        body.sidebar-collapsed .sb-header-inner {
            justify-content: center !important;
            padding-left: 0.4rem !important;
            padding-right: 0.4rem !important;
        }

        /* Scrollable Nav Area */
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

        /* Submenu Tree Line */
        .sb-submenu {
            position: relative;
            margin-left: 1.25rem;
            padding-left: 0.75rem;
            border-left: 2px solid #cbd5e1;
            margin-top: 0.25rem;
            margin-bottom: 0.35rem;
            display: none;
        }
        .sb-group.open .sb-submenu {
            display: block;
            animation: sbSlideDown 0.18s ease-out;
        }
        .sb-group.open .sb-chevron {
            transform: rotate(180deg);
        }

        @keyframes sbSlideDown {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Flyout Submenu when Sidebar is Collapsed */
        .sb-flyout {
            display: none;
        }
        body.sidebar-collapsed .sb-group,
        body.sidebar-collapsed .sb-single-wrap {
            position: relative;
        }
        body.sidebar-collapsed .sb-group:hover .sb-flyout,
        body.sidebar-collapsed .sb-single-wrap:hover .sb-flyout {
            display: block;
            position: fixed;
            left: calc(var(--sidebar-collapsed-width) + 6px);
            min-width: 245px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border: 1.5px solid #cbd5e1;
            border-radius: 1rem;
            padding: 0.6rem;
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
            z-index: 1050;
        }

        /* Floating Edge Toggle Handle on Sidebar Border */
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

        /* Responsive Main Container */
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
    document.head.appendChild(style);

    const navGroups = [
        {
            type: 'single',
            id: 'nav-home',
            href: 'index.html',
            matchFiles: ['index.html'],
            label: 'หน้าหลัก (Home)',
            shortLabel: 'หน้าหลัก',
            shortDesc: 'ภาพรวมระบบ 2 ภาคเรียน',
            icon: 'home',
            activeBg: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md',
            pillActive: 'bg-blue-600 text-white shadow-sm',
            iconBg: 'bg-blue-100 text-blue-600'
        },
        {
            type: 'group',
            id: 'group-report',
            href: 'report.html',
            matchFiles: ['report.html', 'report-term1.html', 'report-term2.html'],
            label: 'แผนการสอน & ตารางสอน',
            shortLabel: 'แผนการสอน',
            shortDesc: 'แยก 2 หน้าย่อยตามภาคเรียน',
            icon: 'book-open',
            activeBg: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md',
            pillActive: 'bg-pink-600 text-white shadow-sm',
            iconBg: 'bg-pink-100 text-pink-600',
            children: [
                { href: 'report.html', label: 'ภาพรวม & ครูพี่เลี้ยง', badge: 'หน้าหลัก', dot: 'bg-slate-400' },
                { href: 'report-term1.html', label: 'แผนการสอน ภาคเรียนที่ 1/2569', badge: 'เทอม 1', dot: 'bg-pink-500' },
                { href: 'report-term2.html', label: 'แผนการสอน ภาคเรียนที่ 2/2569', badge: 'เทอม 2', dot: 'bg-indigo-600' }
            ]
        },
        {
            type: 'group',
            id: 'group-log',
            href: 'log.html',
            matchFiles: ['log.html', 'log-term1.html', 'log-term2.html'],
            label: 'บันทึกผลการสอน',
            shortLabel: 'บันทึกการสอน',
            shortDesc: 'สมุดบันทึก & Google Sheets',
            icon: 'clipboard-list',
            activeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md',
            pillActive: 'bg-amber-500 text-white shadow-sm',
            iconBg: 'bg-amber-100 text-amber-600',
            children: [
                { href: 'log.html', label: 'ภาพรวมบันทึกผลการสอน', badge: 'หน้าหลัก', dot: 'bg-slate-400' },
                { href: 'log-term1.html', label: 'บันทึกการสอน ภาคเรียนที่ 1/2569', badge: 'เทอม 1', dot: 'bg-amber-500' },
                { href: 'log-term2.html', label: 'บันทึกการสอน ภาคเรียนที่ 2/2569', badge: 'เทอม 2', dot: 'bg-indigo-600' }
            ]
        },
        {
            type: 'group',
            id: 'group-research',
            href: 'research.html',
            matchFiles: ['research.html', 'research-term1.html', 'research-term2.html'],
            label: 'งานวิจัยในชั้นเรียน',
            shortLabel: 'งานวิจัย',
            shortDesc: 'วิจัยและนวัตกรรมการสอน',
            icon: 'flask-conical',
            activeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md',
            pillActive: 'bg-emerald-600 text-white shadow-sm',
            iconBg: 'bg-emerald-100 text-emerald-600',
            children: [
                { href: 'research.html', label: 'ภาพรวมงานวิจัยในชั้นเรียน', badge: 'หน้าหลัก', dot: 'bg-slate-400' },
                { href: 'research-term1.html', label: 'งานวิจัย ภาคเรียนที่ 1/2569', badge: 'เทอม 1', dot: 'bg-emerald-500' },
                { href: 'research-term2.html', label: 'งานวิจัย ภาคเรียนที่ 2/2569', badge: 'เทอม 2', dot: 'bg-indigo-600' }
            ]
        },
        {
            type: 'group',
            id: 'group-eval',
            href: 'evaluation.html',
            matchFiles: ['evaluation.html', 'evaluation-term1.html', 'evaluation-term2.html'],
            label: 'การนิเทศการสอน',
            shortLabel: 'นิเทศการสอน',
            shortDesc: 'ผลการนิเทศ & เล่มประเมิน',
            icon: 'star',
            activeBg: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md',
            pillActive: 'bg-violet-600 text-white shadow-sm',
            iconBg: 'bg-violet-100 text-violet-600',
            children: [
                { href: 'evaluation.html', label: 'ภาพรวมการนิเทศการสอน', badge: 'หน้าหลัก', dot: 'bg-slate-400' },
                { href: 'evaluation-term1.html', label: 'นิเทศการสอน ภาคเรียนที่ 1/2569', badge: 'เทอม 1', dot: 'bg-violet-500' },
                { href: 'evaluation-term2.html', label: 'นิเทศการสอน ภาคเรียนที่ 2/2569', badge: 'เทอม 2', dot: 'bg-indigo-600' }
            ]
        },
        {
            type: 'single',
            id: 'nav-school',
            href: 'school.html',
            matchFiles: ['school.html'],
            label: 'ข้อมูลวิทยาลัย',
            shortLabel: 'ข้อมูลวิทยาลัย',
            shortDesc: 'วอศ.สุราษฎร์ธานี',
            icon: 'building-2',
            activeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md',
            pillActive: 'bg-cyan-600 text-white shadow-sm',
            iconBg: 'bg-cyan-100 text-cyan-600'
        },
        {
            type: 'single',
            id: 'nav-profile',
            href: 'profile.html',
            matchFiles: ['profile.html'],
            label: 'ประวัติผู้จัดทำ (Profile)',
            shortLabel: 'ผู้จัดทำ',
            shortDesc: 'น.ส.เขมมิกา สุทธิชาติ',
            icon: 'user',
            activeBg: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md',
            pillActive: 'bg-purple-600 text-white shadow-sm',
            iconBg: 'bg-pink-100 text-pink-600'
        }
    ];

    function buildNavigation() {
        // Remove any older sidebar if re-initialized
        document.getElementById('khemmi-sidebar')?.remove();
        document.getElementById('khemmi-unified-topbar')?.remove();

        // Remove old inline breadcrumb card inside <main> so we replace it with the unified bar on every page
        const mainEl = document.querySelector('main');
        if (mainEl) {
            const oldBreadcrumb = mainEl.querySelector('nav[aria-label="Breadcrumb"]');
            if (oldBreadcrumb && oldBreadcrumb.parentElement && oldBreadcrumb.parentElement.parentElement === mainEl) {
                oldBreadcrumb.parentElement.remove();
            }
        }

        // Restore collapsed state
        const savedCollapsed = localStorage.getItem(STORAGE_KEY) === '1';
        if (savedCollapsed) {
            document.body.classList.add('sidebar-collapsed');
        }

        // Find active group
        let activeGroup = navGroups.find(g => g.matchFiles.includes(currentFile)) || navGroups[0];
        let activeChild = activeGroup.children ? activeGroup.children.find(c => c.href === currentFile) : null;

        // 1. Build Left Sidebar HTML
        const navItemsHtml = navGroups.map(item => {
            const isActive = item.matchFiles.includes(currentFile);

            if (item.type === 'single') {
                const btnCls = isActive ? item.activeBg : 'text-slate-700 hover:bg-slate-100/90';
                const iconWrapCls = isActive ? 'bg-white/20 text-white' : item.iconBg;

                return `
                    <div class="sb-single-wrap mb-1.5">
                        <a href="${item.href}" class="sb-nav-item flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${btnCls}">
                            <div class="w-9 h-9 rounded-xl ${iconWrapCls} flex items-center justify-center shrink-0 shadow-xs">
                                <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                            </div>
                            <div class="sb-hide-collapsed min-w-0 flex-1">
                                <p class="font-mali font-bold text-xs sm:text-[13px] truncate leading-tight">${item.label}</p>
                                <p class="text-[10px] ${isActive ? 'text-white/85' : 'text-slate-400'} font-mali truncate">${item.shortDesc}</p>
                            </div>
                        </a>
                        <div class="sb-flyout">
                            <a href="${item.href}" class="block px-3 py-2 rounded-xl hover:bg-slate-100 font-mali font-bold text-xs text-slate-800">
                                ${item.label}
                                <span class="block text-[10px] font-normal text-slate-500 mt-0.5">${item.shortDesc}</span>
                            </a>
                        </div>
                    </div>
                `;
            }

            const btnCls = isActive ? item.activeBg : 'text-slate-700 hover:bg-slate-100/90';
            const iconWrapCls = isActive ? 'bg-white/20 text-white' : item.iconBg;

            const childrenHtml = item.children.map(child => {
                const isSubActive = currentFile === child.href;
                return `
                    <a href="${child.href}" class="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-mali transition-all mb-1 last:mb-0 ${
                        isSubActive
                            ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }">
                        <span class="flex items-center gap-2 truncate">
                            <span class="w-2 h-2 rounded-full ${child.dot} shrink-0"></span>
                            <span class="truncate">${child.label}</span>
                        </span>
                        <span class="px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                            isSubActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                        } shrink-0">${child.badge}</span>
                    </a>
                `;
            }).join('');

            return `
                <div class="sb-group ${isActive ? 'open' : ''} mb-1.5" data-group-id="${item.id}">
                    <button type="button" class="sb-group-btn w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-2xl transition-all cursor-pointer ${btnCls}">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="w-9 h-9 rounded-xl ${iconWrapCls} flex items-center justify-center shrink-0 shadow-xs">
                                <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                            </div>
                            <div class="sb-hide-collapsed text-left min-w-0">
                                <p class="font-mali font-bold text-xs sm:text-[13px] truncate leading-tight">${item.label}</p>
                                <p class="text-[10px] ${isActive ? 'text-white/85' : 'text-slate-400'} font-mali truncate">${item.shortDesc}</p>
                            </div>
                        </div>
                        <i data-lucide="chevron-down" class="sb-chevron sb-hide-collapsed w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : 'text-slate-400'}"></i>
                    </button>

                    <div class="sb-submenu">
                        ${childrenHtml}
                    </div>

                    <div class="sb-flyout">
                        <div class="px-2.5 py-1.5 mb-1 border-b border-slate-100">
                            <p class="font-mali font-bold text-xs text-slate-800">${item.label}</p>
                            <p class="text-[10px] text-slate-400 font-mali">เลือกหน้าย่อยตามภาคเรียน</p>
                        </div>
                        ${childrenHtml}
                    </div>
                </div>
            `;
        }).join('');

        const sidebar = document.createElement('aside');
        sidebar.id = 'khemmi-sidebar';
        sidebar.setAttribute('aria-label', 'แถบเมนูหลักด้านซ้าย');
        sidebar.innerHTML = `
            <button id="khemmi-edge-toggle" type="button" title="ย่อ/ขยายแถบเมนูด้านซ้าย">
                <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>

            <div class="sb-header-inner p-3.5 border-b border-slate-200/80 flex items-center justify-between gap-2">
                <a href="index.html" class="flex items-center gap-2.5 min-w-0 group">
                    <img src="_Banner/701.jpeg" onerror="this.src='_Banner/701.png'; this.onerror=null;" alt="โลโก้" class="w-10 h-10 rounded-2xl object-cover shadow-md border-2 border-pink-200 group-hover:scale-105 transition-transform shrink-0">
                    <div class="sb-hide-collapsed min-w-0">
                        <span class="font-mali font-bold text-slate-800 text-sm block truncate group-hover:text-pink-600 transition-colors">KhemmiReport</span>
                        <span class="text-[11px] text-slate-500 font-mali block truncate">ระบบรายงานผลการฝึกสอน</span>
                    </div>
                </a>
            </div>

            <div class="sb-hide-collapsed px-3 pt-3 pb-1">
                <div class="p-2 rounded-2xl bg-gradient-to-r from-pink-50/90 via-purple-50/80 to-indigo-50/90 border border-indigo-100/80">
                    <p class="text-[10px] font-mali font-bold text-slate-500 text-center mb-1.5">ทางลัดแผนการสอนรายภาคเรียน</p>
                    <div class="grid grid-cols-2 gap-1.5">
                        <a href="report-term1.html" class="py-1.5 px-2 rounded-xl font-mali font-bold text-[11px] text-center transition-all ${
                            currentFile.includes('term1')
                                ? 'bg-pink-500 text-white shadow-xs'
                                : 'bg-white text-pink-700 border border-pink-200 hover:bg-pink-100'
                        }">📘 เทอม 1/2569</a>
                        <a href="report-term2.html" class="py-1.5 px-2 rounded-xl font-mali font-bold text-[11px] text-center transition-all ${
                            currentFile.includes('term2')
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                        }">🚀 เทอม 2/2569</a>
                    </div>
                </div>
            </div>

            <div class="sb-scroll">
                <p class="sb-hide-collapsed px-2.5 py-1 text-[10px] font-mali font-bold uppercase tracking-wider text-slate-400">เมนูหลักและหน้าย่อย</p>
                ${navItemsHtml}
            </div>

            <div class="p-2.5 border-t border-slate-200/80 bg-white/70">
                <button id="khemmi-bottom-toggle" type="button" class="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-mali font-bold text-xs border border-slate-200/80 transition-all cursor-pointer">
                    <i data-lucide="chevrons-left" class="w-4 h-4"></i>
                    <span class="sb-hide-collapsed">ย่อแถบเมนูด้านซ้าย</span>
                </button>
            </div>
        `;

        document.body.prepend(sidebar);

        // 2. Build Unified Top Navigation & Sub-page Bar inside <main> on EVERY page
        if (mainEl) {
            const topBar = document.createElement('div');
            topBar.id = 'khemmi-unified-topbar';
            topBar.className = 'glass-card rounded-3xl p-3.5 sm:p-4 mb-6 border-2 border-white/90 shadow-lg';

            // Main category pills row
            const categoryPillsHtml = navGroups.map(g => {
                const isAct = g.matchFiles.includes(currentFile);
                return `
                    <a href="${g.href}" class="px-3 py-1.5 rounded-full font-mali font-bold text-xs flex items-center gap-1.5 transition-all ${
                        isAct
                            ? g.pillActive
                            : 'bg-white/90 hover:bg-slate-100 text-slate-700 border border-slate-200/90'
                    }">
                        <i data-lucide="${g.icon}" class="w-3.5 h-3.5"></i>
                        <span>${g.shortLabel}</span>
                    </a>
                `;
            }).join('');

            // Sub-page pills row (if active category has Term 1 & Term 2 sub-pages, or on Home/School/Profile show quick semester links)
            let subRowHtml = '';
            if (activeGroup.children) {
                const subButtons = activeGroup.children.map(child => {
                    const isSubAct = currentFile === child.href;
                    return `
                        <a href="${child.href}" class="px-3.5 py-1.5 rounded-full font-mali font-bold text-xs flex items-center gap-1.5 transition-all ${
                            isSubAct
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                                : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
                        }">
                            <span class="w-2 h-2 rounded-full ${child.dot}"></span>
                            <span>${child.label}</span>
                        </a>
                    `;
                }).join('');

                subRowHtml = `
                    <div class="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 text-xs font-mali text-slate-500">
                            <i data-lucide="folder-git-2" class="w-3.5 h-3.5 text-indigo-500"></i>
                            <span>หน้าย่อยในหมวด <strong class="text-slate-800">${activeGroup.label}</strong>:</span>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap">
                            ${subButtons}
                        </div>
                    </div>
                `;
            } else {
                subRowHtml = `
                    <div class="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 text-xs font-mali text-slate-500">
                            <i data-lucide="compass" class="w-3.5 h-3.5 text-pink-500"></i>
                            <span>คุณกำลังอยู่ที่: <strong class="text-slate-800">${activeGroup.label}</strong></span>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <a href="report-term1.html" class="px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 font-mali font-bold text-xs flex items-center gap-1">
                                <span>📘 แผนการสอน 1/2569</span>
                            </a>
                            <a href="report-term2.html" class="px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-mali font-bold text-xs flex items-center gap-1">
                                <span>🚀 แผนการสอน 2/2569</span>
                            </a>
                            <a href="log-term2.html" class="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-mali font-bold text-xs flex items-center gap-1">
                                <span>📋 บันทึกการสอน 2/2569</span>
                            </a>
                        </div>
                    </div>
                `;
            }

            topBar.innerHTML = `
                <div class="flex items-center justify-between gap-2 flex-wrap">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <button id="khemmi-topbar-collapse-btn" type="button" class="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 font-mali font-bold text-xs flex items-center gap-1 cursor-pointer transition-all" title="ย่อ/ขยายแถบเมนูด้านซ้าย">
                            <i data-lucide="panel-left" class="w-3.5 h-3.5"></i>
                            <span class="hidden sm:inline">ย่อ/ขยายเมนูซ้าย</span>
                        </button>
                        ${categoryPillsHtml}
                    </div>
                </div>
                ${subRowHtml}
            `;

            mainEl.prepend(topBar);
        }

        // Bind Accordion Group clicks
        sidebar.querySelectorAll('.sb-group-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const group = btn.closest('.sb-group');
                if (!group) return;
                if (document.body.classList.contains('sidebar-collapsed')) {
                    toggleSidebar(false);
                    group.classList.add('open');
                    return;
                }
                group.classList.toggle('open');
            });
        });

        // Position Flyouts dynamically on hover when collapsed
        sidebar.querySelectorAll('.sb-group, .sb-single-wrap').forEach(wrap => {
            wrap.addEventListener('mouseenter', () => {
                if (!document.body.classList.contains('sidebar-collapsed')) return;
                const flyout = wrap.querySelector('.sb-flyout');
                if (!flyout) return;
                const rect = wrap.getBoundingClientRect();
                const topPos = Math.min(rect.top, window.innerHeight - 220);
                flyout.style.top = `${Math.max(12, topPos)}px`;
            });
        });

        function updateToggleButtons() {
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
            updateToggleButtons();
            setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
        }

        document.getElementById('khemmi-edge-toggle')?.addEventListener('click', () => toggleSidebar());
        document.getElementById('khemmi-bottom-toggle')?.addEventListener('click', () => toggleSidebar());
        document.getElementById('khemmi-topbar-collapse-btn')?.addEventListener('click', () => toggleSidebar());

        updateToggleButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildNavigation);
    } else {
        buildNavigation();
    }
})();
