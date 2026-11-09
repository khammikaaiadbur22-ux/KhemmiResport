// Shared Hierarchical Navigation & Dropdown Sub-menus (Website Information Architecture)
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .nav-dropdown-group {
            position: relative;
        }
        .nav-dropdown-menu {
            position: absolute;
            top: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(6px);
            min-width: 250px;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1.5px solid rgba(226, 232, 240, 0.95);
            border-radius: 1.25rem;
            padding: 0.5rem;
            box-shadow: 0 20px 45px rgba(15, 23, 42, 0.14);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 100;
        }
        .nav-dropdown-group::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            height: 14px;
        }
        .nav-dropdown-group:hover .nav-dropdown-menu,
        .nav-dropdown-group:focus-within .nav-dropdown-menu,
        .nav-dropdown-group.open .nav-dropdown-menu {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateX(-50%) translateY(0);
        }
        @media (max-width: 640px) {
            .nav-dropdown-menu {
                left: 0;
                transform: translateX(0) translateY(6px);
                min-width: 225px;
            }
            .nav-dropdown-group:hover .nav-dropdown-menu,
            .nav-dropdown-group:focus-within .nav-dropdown-menu,
            .nav-dropdown-group.open .nav-dropdown-menu {
                transform: translateX(0) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    function enhanceNavbar() {
        const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

        const dropdownConfigs = {
            'report.html': {
                matchFiles: ['report.html', 'report-term1.html', 'report-term2.html'],
                label: 'รายงานการสอน',
                icon: 'book-open',
                activeClass: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-md',
                inactiveIconColor: 'text-pink-500',
                hoverText: 'hover:text-pink-600',
                items: [
                    { href: 'report.html', badge: 'ภาพรวม', title: 'หน้าหลักรายงานการสอน & บุคลากร', desc: 'ข้อมูลสถานศึกษา ครูพี่เลี้ยง และเลือกภาคเรียน', color: 'text-slate-700 hover:bg-slate-100' },
                    { href: 'report-term1.html', badge: 'เทอม 1/2569', title: 'แผนการสอน ภาคเรียนที่ 1/2569', desc: 'ตารางสอนและแผนการสอน 2 รายวิชา (เทอม 1)', color: 'text-pink-700 hover:bg-pink-50' },
                    { href: 'report-term2.html', badge: 'เทอม 2/2569', title: 'แผนการสอน ภาคเรียนที่ 2/2569', desc: 'ตารางสอนและแผนการเรียนรู้ 3 รายวิชา (เทอม 2)', color: 'text-indigo-700 hover:bg-indigo-50' }
                ]
            },
            'log.html': {
                matchFiles: ['log.html', 'log-term1.html', 'log-term2.html'],
                label: 'บันทึกผลการสอน',
                icon: 'clipboard-list',
                activeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md',
                inactiveIconColor: 'text-amber-500',
                hoverText: 'hover:text-amber-600',
                items: [
                    { href: 'log.html', badge: 'ภาพรวม', title: 'หน้าหลักบันทึกผลการสอน', desc: 'สรุปชั่วโมงฝึกสอนและเลือกภาคเรียน', color: 'text-slate-700 hover:bg-slate-100' },
                    { href: 'log-term1.html', badge: 'เทอม 1/2569', title: 'บันทึกการสอน ภาคเรียนที่ 1/2569', desc: 'สมุดบันทึก 18 สัปดาห์ & ภาพกิจกรรมเทอม 1', color: 'text-amber-700 hover:bg-amber-50' },
                    { href: 'log-term2.html', badge: 'เทอม 2/2569', title: 'บันทึกการสอน ภาคเรียนที่ 2/2569', desc: 'Google Sheets เทอม 2 & แผน 18 สัปดาห์', color: 'text-indigo-700 hover:bg-indigo-50' }
                ]
            },
            'research.html': {
                matchFiles: ['research.html', 'research-term1.html', 'research-term2.html'],
                label: 'Research',
                icon: 'flask-conical',
                activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md',
                inactiveIconColor: 'text-emerald-500',
                hoverText: 'hover:text-emerald-600',
                items: [
                    { href: 'research.html', badge: 'ภาพรวม', title: 'หน้าหลักงานวิจัยในชั้นเรียน', desc: 'สรุปงานวิจัยและนวัตกรรมทั้ง 2 ภาคเรียน', color: 'text-slate-700 hover:bg-slate-100' },
                    { href: 'research-term1.html', badge: 'เทอม 1/2569', title: 'งานวิจัยในชั้นเรียน 1/2569', desc: 'วิจัยฉบับสมบูรณ์ 2 เรื่อง (CBL+AI & Motion)', color: 'text-emerald-700 hover:bg-emerald-50' },
                    { href: 'research-term2.html', badge: 'เทอม 2/2569', title: 'งานวิจัยในชั้นเรียน 2/2569', desc: 'แผนการดำเนินงานวิจัยและนวัตกรรมเทอม 2', color: 'text-indigo-700 hover:bg-indigo-50' }
                ]
            },
            'evaluation.html': {
                matchFiles: ['evaluation.html', 'evaluation-term1.html', 'evaluation-term2.html'],
                label: 'นิเทศการสอน',
                icon: 'star',
                activeClass: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold shadow-md',
                inactiveIconColor: 'text-violet-500',
                hoverText: 'hover:text-violet-600',
                items: [
                    { href: 'evaluation.html', badge: 'ภาพรวม', title: 'หน้าหลักการนิเทศและประเมินผล', desc: 'ภาพรวมการนิเทศการสอนทั้ง 2 ภาคเรียน', color: 'text-slate-700 hover:bg-slate-100' },
                    { href: 'evaluation-term1.html', badge: 'เทอม 1/2569', title: 'นิเทศและประเมินผล 1/2569', desc: 'ประมวลภาพ คลิปการสอน และเล่มประเมินเทอม 1', color: 'text-violet-700 hover:bg-violet-50' },
                    { href: 'evaluation-term2.html', badge: 'เทอม 2/2569', title: 'นิเทศและประเมินผล 2/2569', desc: 'แผนการรับการนิเทศ 3 ครั้ง ภาคเรียนที่ 2', color: 'text-indigo-700 hover:bg-indigo-50' }
                ]
            }
        };

        const navContainer = document.querySelector('header nav > div:last-child');
        if (!navContainer) return;

        const links = Array.from(navContainer.querySelectorAll('a'));
        links.forEach(link => {
            const rawHref = (link.getAttribute('href') || '').split('#')[0];
            const config = dropdownConfigs[rawHref];
            if (!config) return;

            const isActiveGroup = config.matchFiles.includes(currentFile);
            const wrapper = document.createElement('div');
            wrapper.className = 'nav-dropdown-group';

            const btnClass = isActiveGroup
                ? `px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${config.activeClass} font-mali text-xs sm:text-sm flex items-center gap-1.5 transition-all`
                : `px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/80 hover:bg-white text-slate-700 font-mali font-semibold text-xs sm:text-sm border border-slate-200/90 shadow-sm flex items-center gap-1.5 transition-all ${config.hoverText} active:scale-95`;

            const iconColor = isActiveGroup ? '' : config.inactiveIconColor;

            const menuItemsHtml = config.items.map(item => {
                const isCurrentSub = currentFile === item.href;
                return `
                    <a href="${item.href}" class="block px-3 py-2.5 rounded-xl transition-all ${item.color} ${isCurrentSub ? 'bg-slate-100/90 ring-1 ring-slate-300' : ''} mb-1 last:mb-0">
                        <div class="flex items-center justify-between gap-2 mb-0.5">
                            <span class="font-mali font-bold text-xs">${item.title}</span>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-mali font-bold bg-white border border-slate-200 shadow-xs shrink-0">${item.badge}</span>
                        </div>
                        <p class="text-[11px] text-slate-500 font-mali leading-snug">${item.desc}</p>
                    </a>
                `;
            }).join('');

            wrapper.innerHTML = `
                <a href="${rawHref}" class="${btnClass}">
                    <i data-lucide="${config.icon}" class="w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColor} shrink-0"></i>
                    <span class="hidden lg:inline">${config.label}</span>
                    <i data-lucide="chevron-down" class="w-3 h-3 opacity-75"></i>
                </a>
                <div class="nav-dropdown-menu text-left">
                    <div class="px-3 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
                        <span class="text-[11px] font-mali font-bold text-slate-400">เลือกหน้าย่อย (${config.label})</span>
                        <span class="text-[10px] font-mali text-slate-400">2 ภาคเรียน</span>
                    </div>
                    ${menuItemsHtml}
                </div>
            `;

            link.replaceWith(wrapper);
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceNavbar);
    } else {
        enhanceNavbar();
    }
})();
