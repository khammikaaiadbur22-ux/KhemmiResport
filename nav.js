// Responsive Collapsible Left Sidebar Navigation (Website Information Architecture)
(function () {
    const STORAGE_KEY = 'khemmi_sidebar_collapsed';
    const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    // Inject Sidebar & Responsive Layout CSS immediately to avoid flash of old header
    const style = document.createElement('style');
    style.textContent = `
        /* Hide legacy top header bar */
        body > header {
            display: none !important;
        }

        :root {
            --sidebar-width: 288px;
            --sidebar-collapsed-width: 82px;
        }

        body {
            transition: padding-left 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (min-width: 1024px) {
            body {
                padding-left: var(--sidebar-width);
            }
            body.sidebar-collapsed {
                padding-left: var(--sidebar-collapsed-width);
            }
        }

        @media (max-width: 1023px) {
            body {
                padding-top: 68px;
            }
        }

        /* Sidebar Container */
        #khemmi-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: var(--sidebar-width);
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(24px) saturate(190%);
            -webkit-backdrop-filter: blur(24px) saturate(190%);
            border-right: 1.5px solid rgba(226, 232, 240, 0.9);
            box-shadow: 8px 0 32px rgba(15, 23, 42, 0.06);
            z-index: 60;
            display: flex;
            flex-direction: column;
            transition: width 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
        }

        @media (min-width: 1024px) {
            body.sidebar-collapsed #khemmi-sidebar {
                width: var(--sidebar-collapsed-width);
            }
            body.sidebar-collapsed .sb-hide-collapsed {
                opacity: 0;
                width: 0;
                overflow: hidden;
                white-space: nowrap;
                pointer-events: none;
                display: none !important;
            }
            body.sidebar-collapsed .sb-submenu {
                display: none !important;
            }
            body.sidebar-collapsed .sb-nav-item,
            body.sidebar-collapsed .sb-group-btn {
                justify-content: center;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
            }
            body.sidebar-collapsed .sb-header-inner {
                justify-content: center;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
            }
        }

        @media (max-width: 1023px) {
            #khemmi-sidebar {
                transform: translateX(-100%);
                width: 292px;
                box-shadow: 20px 0 50px rgba(15, 23, 42, 0.18);
            }
            body.sidebar-mobile-open #khemmi-sidebar {
                transform: translateX(0);
            }
        }

        /* Mobile Backdrop */
        #khemmi-sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.35);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 55;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.28s ease, visibility 0.28s ease;
        }
        body.sidebar-mobile-open #khemmi-sidebar-backdrop {
            opacity: 1;
            visibility: visible;
        }

        /* Mobile Top Bar */
        #khemmi-mobile-topbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 62px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(18px) saturate(180%);
            -webkit-backdrop-filter: blur(18px) saturate(180%);
            border-bottom: 1.5px solid rgba(226, 232, 240, 0.9);
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1rem;
        }
        @media (min-width: 1024px) {
            #khemmi-mobile-topbar {
                display: none !important;
            }
        }

        /* Scrollable Nav Area */
        .sb-scroll {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0.75rem 0.75rem;
        }
        .sb-scroll::-webkit-scrollbar {
            width: 4px;
        }
        .sb-scroll::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 9999px;
        }

        /* Submenu Tree Line */
        .sb-submenu {
            position: relative;
            margin-left: 1.35rem;
            padding-left: 0.85rem;
            border-left: 2px solid #e2e8f0;
            margin-top: 0.25rem;
            margin-bottom: 0.35rem;
            display: none;
        }
        .sb-group.open .sb-submenu {
            display: block;
            animation: sbSlideDown 0.2s ease-out;
        }
        .sb-group.open .sb-chevron {
            transform: rotate(180deg);
        }

        @keyframes sbSlideDown {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Flyout Tooltip/Submenu when Sidebar is Collapsed on Desktop */
        .sb-flyout {
            display: none;
        }
        @media (min-width: 1024px) {
            body.sidebar-collapsed .sb-group,
            body.sidebar-collapsed .sb-single-wrap {
                position: relative;
            }
            body.sidebar-collapsed .sb-group:hover .sb-flyout,
            body.sidebar-collapsed .sb-single-wrap:hover .sb-flyout {
                display: block;
                position: fixed;
                left: calc(var(--sidebar-collapsed-width) + 8px);
                min-width: 240px;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                border: 1.5px solid #e2e8f0;
                border-radius: 1rem;
                padding: 0.6rem;
                box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
                z-index: 100;
            }
        }

        /* Adjust main container max-width so it expands nicely with sidebar */
        main {
            max-width: 1280px !important;
            transition: max-width 0.3s ease;
        }
        body.sidebar-collapsed main {
            max-width: 1440px !important;
        }
    `;
    document.head.appendChild(style);

    const navGroups = [
        {
            type: 'single',
            href: 'index.html',
            matchFiles: ['index.html', ''],
            label: 'หน้าหลัก (Home)',
            shortDesc: 'ภาพรวมระบบทั้ง 2 ภาคเรียน',
            icon: 'home',
            activeBg: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md',
            iconBg: 'bg-blue-100 text-blue-600'
        },
        {
            type: 'group',
            id: 'group-report',
            href: 'report.html',
            matchFiles: ['report.html', 'report-term1.html', 'report-term2.html'],
            label: 'แผนการสอน & ตารางสอน',
            shortDesc: 'แยก 2 หน้าย่อยตามภาคเรียน',
            icon: 'book-open',
            activeBg: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md',
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
            shortDesc: 'สมุดบันทึก & Google Sheets',
            icon: 'clipboard-list',
            activeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md',
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
            shortDesc: 'วิจัยและนวัตกรรมการสอน',
            icon: 'flask-conical',
            activeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md',
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
            shortDesc: 'ผลการนิเทศ & เล่มประเมิน',
            icon: 'star',
            activeBg: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md',
            iconBg: 'bg-violet-100 text-violet-600',
            children: [
                { href: 'evaluation.html', label: 'ภาพรวมการนิเทศการสอน', badge: 'หน้าหลัก', dot: 'bg-slate-400' },
                { href: 'evaluation-term1.html', label: 'นิเทศการสอน ภาคเรียนที่ 1/2569', badge: 'เทอม 1', dot: 'bg-violet-500' },
                { href: 'evaluation-term2.html', label: 'นิเทศการสอน ภาคเรียนที่ 2/2569', badge: 'เทอม 2', dot: 'bg-indigo-600' }
            ]
        },
        {
            type: 'single',
            href: 'school.html',
            matchFiles: ['school.html'],
            label: 'ข้อมูลวิทยาลัย',
            shortDesc: 'วิทยาลัยอาชีวศึกษาสุราษฎร์ธานี',
            icon: 'building-2',
            activeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md',
            iconBg: 'bg-cyan-100 text-cyan-600'
        },
        {
            type: 'single',
            href: 'profile.html',
            matchFiles: ['profile.html'],
            label: 'ประวัติผู้จัดทำ (Profile)',
            shortDesc: 'นางสาวเขมมิกา สุทธิชาติ',
            icon: 'user',
            activeBg: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md',
            iconBg: 'bg-pink-100 text-pink-600'
        }
    ];

    function buildSidebar() {
        // Restore saved collapsed state on desktop
        const savedCollapsed = localStorage.getItem(STORAGE_KEY) === '1';
        if (savedCollapsed) {
            document.body.classList.add('sidebar-collapsed');
        }

        // Determine current page label for mobile topbar
        let currentPageLabel = 'รายงานฝึกประสบการณ์วิชาชีพครู';
        navGroups.forEach(g => {
            if (g.matchFiles.includes(currentFile)) {
                currentPageLabel = g.label;
                if (g.children) {
                    const sub = g.children.find(c => c.href === currentFile);
                    if (sub) currentPageLabel = sub.label;
                }
            }
        });

        // 1. Mobile Topbar
        const mobileTopbar = document.createElement('div');
        mobileTopbar.id = 'khemmi-mobile-topbar';
        mobileTopbar.innerHTML = `
            <div class="flex items-center gap-3 min-w-0">
                <button id="khemmi-mobile-open-btn" type="button" aria-label="เปิดเมนู" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-pink-600 flex items-center justify-center border border-slate-200/90 shadow-xs active:scale-95 transition-all shrink-0">
                    <i data-lucide="panel-left-open" class="w-5 h-5"></i>
                </button>
                <a href="index.html" class="flex items-center gap-2 min-w-0">
                    <img src="_Banner/701.jpeg" onerror="this.src='_Banner/701.png'; this.onerror=null;" alt="โลโก้" class="w-8 h-8 rounded-full object-cover border border-pink-200 shrink-0">
                    <div class="truncate">
                        <p class="font-mali font-bold text-slate-800 text-xs sm:text-sm truncate leading-tight">${currentPageLabel}</p>
                        <p class="text-[10px] text-slate-500 font-mali truncate">เขมมิกา สุทธิชาติ • 1/2569 & 2/2569</p>
                    </div>
                </a>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
                <a href="report-term1.html" class="px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 font-mali font-bold text-[11px]">เทอม 1</a>
                <a href="report-term2.html" class="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-mali font-bold text-[11px] shadow-xs">เทอม 2</a>
            </div>
        `;

        // 2. Mobile Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'khemmi-sidebar-backdrop';

        // 3. Sidebar Navigation HTML
        const navItemsHtml = navGroups.map(item => {
            const isActive = item.matchFiles.includes(currentFile);

            if (item.type === 'single') {
                const btnCls = isActive
                    ? `${item.activeBg}`
                    : `text-slate-700 hover:bg-slate-100/90`;
                const iconWrapCls = isActive
                    ? `bg-white/20 text-white`
                    : `${item.iconBg}`;

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

            // Accordion Group Item (with 2 Semester Sub-pages)
            const btnCls = isActive
                ? `${item.activeBg}`
                : `text-slate-700 hover:bg-slate-100/90`;
            const iconWrapCls = isActive
                ? `bg-white/20 text-white`
                : `${item.iconBg}`;

            const childrenHtml = item.children.map(child => {
                const isSubActive = currentFile === child.href;
                return `
                    <a href="${child.href}" class="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-mali transition-all mb-1 last:mb-0 ${
                        isSubActive
                            ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-2xs'
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
                    <button type="button" class="sb-group-btn w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl transition-all cursor-pointer ${btnCls}">
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

                    <!-- Tree Submenu (Expanded Sidebar) -->
                    <div class="sb-submenu">
                        ${childrenHtml}
                    </div>

                    <!-- Flyout Submenu (Collapsed Desktop Sidebar) -->
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
            <!-- Sidebar Top Brand Header -->
            <div class="sb-header-inner p-4 border-b border-slate-200/80 flex items-center justify-between gap-2">
                <a href="index.html" class="flex items-center gap-3 min-w-0 group">
                    <img src="_Banner/701.jpeg" onerror="this.src='_Banner/701.png'; this.onerror=null;" alt="โลโก้" class="w-10 h-10 rounded-2xl object-cover shadow-md border-2 border-pink-200 group-hover:scale-105 transition-transform shrink-0">
                    <div class="sb-hide-collapsed min-w-0">
                        <span class="font-mali font-bold text-slate-800 text-sm block truncate group-hover:text-pink-600 transition-colors">KhemmiReport</span>
                        <span class="text-[11px] text-slate-500 font-mali block truncate">แฟ้มสะสมงานฝึกสอน 1 & 2</span>
                    </div>
                </a>

                <!-- Desktop Collapse/Expand Button -->
                <button id="khemmi-desktop-toggle" type="button" title="ย่อ/ขยายแถบเมนูด้านซ้าย" class="hidden lg:flex w-8 h-8 rounded-xl bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600 items-center justify-center border border-slate-200/80 transition-all cursor-pointer shrink-0">
                    <i data-lucide="panel-left-close" class="w-4 h-4 sb-toggle-icon"></i>
                </button>

                <!-- Mobile Close Button -->
                <button id="khemmi-mobile-close-btn" type="button" aria-label="ปิดเมนู" class="lg:hidden w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center border border-slate-200/80">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>

            <!-- Quick Semester Pill Switcher inside Sidebar -->
            <div class="sb-hide-collapsed px-3.5 pt-3 pb-1">
                <div class="p-2 rounded-2xl bg-gradient-to-r from-pink-50/90 via-purple-50/80 to-indigo-50/90 border border-indigo-100/80">
                    <p class="text-[10px] font-mali font-bold text-slate-500 text-center mb-1.5">ทางลัดเลือกภาคเรียน (แผนการสอน)</p>
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

            <!-- Navigation Menu Items -->
            <div class="sb-scroll">
                <p class="sb-hide-collapsed px-3 py-1.5 text-[10px] font-mali font-bold uppercase tracking-wider text-slate-400">โครงสร้างเมนูเว็บไซต์</p>
                ${navItemsHtml}
            </div>

            <!-- Sidebar Bottom Collapse/Expand & Profile Footer -->
            <div class="p-3 border-t border-slate-200/80 bg-white/60">
                <button id="khemmi-bottom-toggle" type="button" class="hidden lg:flex w-full items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-mali font-bold text-xs border border-slate-200/80 transition-all cursor-pointer">
                    <i data-lucide="ChevronsLeft" class="w-4 h-4 sb-bottom-icon"></i>
                    <span class="sb-hide-collapsed sb-bottom-text">ย่อแถบเมนู (ขยายหน้าจอ)</span>
                </button>
                <div class="sb-hide-collapsed mt-2.5 flex items-center gap-2.5 px-2">
                    <img src="https://i.postimg.cc/RhspXpw8/r-p-por-fil.jpg" alt="เขมมิกา" class="w-8 h-8 rounded-full object-cover border border-pink-300 shrink-0">
                    <div class="min-w-0">
                        <p class="font-mali font-bold text-slate-800 text-xs truncate">น.ส.เขมมิกา สุทธิชาติ</p>
                        <p class="text-[10px] text-slate-500 font-mali truncate">รหัส 6602041620041 • มจพ.</p>
                    </div>
                </div>
            </div>
        `;

        document.body.prepend(backdrop);
        document.body.prepend(sidebar);
        document.body.prepend(mobileTopbar);

        // Bind Accordion Group clicks
        sidebar.querySelectorAll('.sb-group-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const group = btn.closest('.sb-group');
                if (!group) return;
                // If sidebar is collapsed on desktop, expand it first so user can see submenu
                if (document.body.classList.contains('sidebar-collapsed') && window.innerWidth >= 1024) {
                    toggleDesktopSidebar(false);
                    group.classList.add('open');
                    return;
                }
                group.classList.toggle('open');
            });
        });

        // Position Flyouts dynamically on hover when collapsed
        sidebar.querySelectorAll('.sb-group, .sb-single-wrap').forEach(wrap => {
            wrap.addEventListener('mouseenter', () => {
                if (!document.body.classList.contains('sidebar-collapsed') || window.innerWidth < 1024) return;
                const flyout = wrap.querySelector('.sb-flyout');
                if (!flyout) return;
                const rect = wrap.getBoundingClientRect();
                const topPos = Math.min(rect.top, window.innerHeight - 220);
                flyout.style.top = `${Math.max(12, topPos)}px`;
            });
        });

        // Desktop Collapse/Expand Handler
        function updateToggleIcons() {
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            const topBtn = document.getElementById('khemmi-desktop-toggle');
            const botBtn = document.getElementById('khemmi-bottom-toggle');
            if (topBtn) {
                topBtn.innerHTML = `<i data-lucide="${isCollapsed ? 'panel-left-open' : 'panel-left-close'}" class="w-4 h-4"></i>`;
            }
            if (botBtn) {
                botBtn.innerHTML = `
                    <i data-lucide="${isCollapsed ? 'chevrons-right' : 'chevrons-left'}" class="w-4 h-4"></i>
                    <span class="sb-hide-collapsed">${isCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู (ขยายหน้าจอ)'}</span>
                `;
            }
            if (window.lucide) window.lucide.createIcons();
        }

        function toggleDesktopSidebar(forceState) {
            const nextState = typeof forceState === 'boolean'
                ? forceState
                : !document.body.classList.contains('sidebar-collapsed');
            document.body.classList.toggle('sidebar-collapsed', nextState);
            localStorage.setItem(STORAGE_KEY, nextState ? '1' : '0');
            updateToggleIcons();
            setTimeout(() => window.dispatchEvent(new Event('resize')), 340);
        }

        document.getElementById('khemmi-desktop-toggle')?.addEventListener('click', () => toggleDesktopSidebar());
        document.getElementById('khemmi-bottom-toggle')?.addEventListener('click', () => toggleDesktopSidebar());

        // Mobile Open/Close Handlers
        function closeMobileSidebar() {
            document.body.classList.remove('sidebar-mobile-open');
        }
        document.getElementById('khemmi-mobile-open-btn')?.addEventListener('click', () => {
            document.body.classList.add('sidebar-mobile-open');
        });
        document.getElementById('khemmi-mobile-close-btn')?.addEventListener('click', closeMobileSidebar);
        backdrop.addEventListener('click', closeMobileSidebar);

        updateToggleIcons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildSidebar);
    } else {
        buildSidebar();
    }
})();
