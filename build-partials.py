#!/usr/bin/env python3
"""
build-partials.py
Single-source partial builder & content bug fixer for KhemmiReport (GitHub Pages static site).
Reads /partials/*.html and compiles standardized header/nav, breadcrumb, term-switcher,
bottom pager, footer, and unique <title> into all HTML pages while fixing Part A & Part B issues.
"""

import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
PARTIALS_DIR = os.path.join(ROOT, "partials")


def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


# Page metadata configuration
PAGES = {
    "index.html": {
        "cat_key": "home",
        "cat_name": "หน้าหลัก",
        "cat_href": "index.html",
        "term": None,
        "title": "หน้าหลัก - เขมมิกา สุทธิชาติ",
        "has_switcher": False,
        "has_pager": False,
    },
    "report.html": {
        "cat_key": "report",
        "cat_name": "แผนการสอน",
        "cat_href": "report.html",
        "term": "overview",
        "title": "แผนการสอน (ภาพรวม) - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "report.html",
        "term1_href": "report-term1.html",
        "term2_href": "report-term2.html",
        "has_pager": False,
    },
    "report-term1.html": {
        "cat_key": "report",
        "cat_name": "แผนการสอน",
        "cat_href": "report.html",
        "term": "term1",
        "term_label": "ภาคเรียนที่ 1/2569",
        "title": "แผนการสอน ภาคเรียนที่ 1/2569 - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "report.html",
        "term1_href": "report-term1.html",
        "term2_href": "report-term2.html",
        "has_pager": True,
    },
    "report-term2.html": {
        "cat_key": "report",
        "cat_name": "แผนการสอน",
        "cat_href": "report.html",
        "term": "term2",
        "term_label": "ภาคเรียนที่ 2/2569",
        "title": "แผนการสอน ภาคเรียนที่ 2/2569 - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "report.html",
        "term1_href": "report-term1.html",
        "term2_href": "report-term2.html",
        "has_pager": True,
    },
    "log.html": {
        "cat_key": "log",
        "cat_name": "บันทึกผลการสอน",
        "cat_href": "log.html",
        "term": "overview",
        "title": "บันทึกผลการสอน (ภาพรวม) - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "log.html",
        "term1_href": "log-term1.html",
        "term2_href": "log-term2.html",
        "has_pager": False,
    },
    "log-term1.html": {
        "cat_key": "log",
        "cat_name": "บันทึกผลการสอน",
        "cat_href": "log.html",
        "term": "term1",
        "term_label": "ภาคเรียนที่ 1/2569",
        "title": "บันทึกผลการสอน ภาคเรียนที่ 1/2569 - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "log.html",
        "term1_href": "log-term1.html",
        "term2_href": "log-term2.html",
        "has_pager": True,
    },
    "log-term2.html": {
        "cat_key": "log",
        "cat_name": "บันทึกผลการสอน",
        "cat_href": "log.html",
        "term": "term2",
        "term_label": "ภาคเรียนที่ 2/2569",
        "title": "บันทึกผลการสอน ภาคเรียนที่ 2/2569 - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "log.html",
        "term1_href": "log-term1.html",
        "term2_href": "log-term2.html",
        "has_pager": True,
    },
    "research.html": {
        "cat_key": "research",
        "cat_name": "งานวิจัยในชั้นเรียน",
        "cat_href": "research.html",
        "term": "overview",
        "title": "งานวิจัยในชั้นเรียน (ภาพรวม) - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "research.html",
        "term1_href": "research-term1.html",
        "term2_href": "research-term2.html",
        "has_pager": False,
    },
    "research-term1.html": {
        "cat_key": "research",
        "cat_name": "งานวิจัยในชั้นเรียน",
        "cat_href": "research.html",
        "term": "term1",
        "term_label": "ภาคเรียนที่ 1/2569",
        "title": "งานวิจัยในชั้นเรียน ภาคเรียนที่ 1/2569 - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "research.html",
        "term1_href": "research-term1.html",
        "term2_href": "research-term2.html",
        "has_pager": True,
    },
    "research-term2.html": {
        "cat_key": "research",
        "cat_name": "งานวิจัยในชั้นเรียน",
        "cat_href": "research.html",
        "term": "term2",
        "term_label": "ภาคเรียนที่ 2/2569",
        "title": "งานวิจัยในชั้นเรียน ภาคเรียนที่ 2/2569 - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "research.html",
        "term1_href": "research-term1.html",
        "term2_href": "research-term2.html",
        "has_pager": True,
    },
    "evaluation.html": {
        "cat_key": "evaluation",
        "cat_name": "การนิเทศการสอน",
        "cat_href": "evaluation.html",
        "term": "overview",
        "title": "การนิเทศการสอน (ภาพรวม) - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "evaluation.html",
        "term1_href": "evaluation-term1.html",
        "term2_href": "evaluation-term2.html",
        "has_pager": False,
    },
    "evaluation-term1.html": {
        "cat_key": "evaluation",
        "cat_name": "การนิเทศการสอน",
        "cat_href": "evaluation.html",
        "term": "term1",
        "term_label": "ภาคเรียนที่ 1/2569",
        "title": "การนิเทศการสอน ภาคเรียนที่ 1/2569 - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "evaluation.html",
        "term1_href": "evaluation-term1.html",
        "term2_href": "evaluation-term2.html",
        "has_pager": True,
    },
    "evaluation-term2.html": {
        "cat_key": "evaluation",
        "cat_name": "การนิเทศการสอน",
        "cat_href": "evaluation.html",
        "term": "term2",
        "term_label": "ภาคเรียนที่ 2/2569",
        "title": "การนิเทศการสอน ภาคเรียนที่ 2/2569 - เขมมิกา สุทธิชาติ",
        "has_switcher": True,
        "overview_href": "evaluation.html",
        "term1_href": "evaluation-term1.html",
        "term2_href": "evaluation-term2.html",
        "has_pager": True,
    },
    "school.html": {
        "cat_key": "school",
        "cat_name": "ข้อมูลวิทยาลัย",
        "cat_href": "school.html",
        "term": None,
        "title": "ข้อมูลวิทยาลัย - เขมมิกา สุทธิชาติ",
        "has_switcher": False,
        "has_pager": False,
    },
    "profile.html": {
        "cat_key": "profile",
        "cat_name": "ผู้จัดทำ",
        "cat_href": "profile.html",
        "term": None,
        "title": "ผู้จัดทำ - เขมมิกา สุทธิชาติ",
        "has_switcher": False,
        "has_pager": False,
    },
}


def render_header_nav(filename, meta):
    tpl = read_file(os.path.join(PARTIALS_DIR, "header-nav.html"))
    cat_key = meta["cat_key"]

    keys = ["home", "report", "log", "research", "evaluation", "school", "profile"]
    active_sb_cls = "active bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold shadow-md"
    inactive_sb_cls = "text-slate-700 hover:bg-slate-100/90 font-semibold"

    active_top_cls = "active bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold shadow-md"
    inactive_top_cls = "bg-white/85 hover:bg-white text-slate-700 font-semibold border border-slate-200/90 shadow-xs"

    for k in keys:
        is_act = (k == cat_key)
        tpl = tpl.replace(f"{{{{NAV_{k.upper()}_CLASS}}}}", active_sb_cls if is_act else inactive_sb_cls)
        tpl = tpl.replace(f"{{{{TOP_{k.upper()}_CLASS}}}}", active_top_cls if is_act else inactive_top_cls)
        tpl = tpl.replace(f"{{{{NAV_{k.upper()}_ARIA}}}}", 'aria-current="page"' if is_act else "")

    sub_active = "active bg-indigo-50 text-indigo-700 font-bold border border-indigo-200"
    sub_inactive = "text-slate-600 hover:bg-slate-100/80"

    for group_k, prefix in [("report", "report"), ("log", "log"), ("research", "research"), ("evaluation", "evaluation")]:
        tpl = tpl.replace(
            f"{{{{SUB_{group_k.upper()}_OVERVIEW_CLASS}}}}",
            sub_active if filename == f"{prefix}.html" else sub_inactive,
        )
        tpl = tpl.replace(
            f"{{{{SUB_{group_k.upper()}_TERM1_CLASS}}}}",
            sub_active if filename == f"{prefix}-term1.html" else sub_inactive,
        )
        tpl = tpl.replace(
            f"{{{{SUB_{group_k.upper()}_TERM2_CLASS}}}}",
            sub_active if filename == f"{prefix}-term2.html" else sub_inactive,
        )

    return tpl


def render_breadcrumb_switcher(filename, meta):
    if filename == "index.html":
        return """<!-- Partial: Breadcrumb (Home) -->
<div id="site-breadcrumb-switcher" class="glass-card rounded-3xl p-4 sm:p-5 mb-8 border-2 border-slate-200/90 shadow-lg">
    <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs sm:text-sm font-mali flex-wrap">
        <span class="text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 active" aria-current="page">หน้าหลัก</span>
    </nav>
</div>"""

    if not meta.get("has_switcher"):
        return f"""<!-- Partial: Breadcrumb -->
<div id="site-breadcrumb-switcher" class="glass-card rounded-3xl p-4 sm:p-5 mb-8 border-2 border-slate-200/90 shadow-lg">
    <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs sm:text-sm font-mali flex-wrap">
        <a href="index.html" class="text-slate-500 hover:text-indigo-600 transition-colors">หน้าหลัก</a>
        <span class="text-slate-400 select-none">›</span>
        <span class="text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 active" aria-current="page">{meta["cat_name"]}</span>
    </nav>
</div>"""

    tpl = read_file(os.path.join(PARTIALS_DIR, "breadcrumb-switcher.html"))
    term = meta["term"]
    level3 = meta.get("term_label", "ภาพรวม")

    tpl = tpl.replace("{{CATEGORY_HREF}}", meta["cat_href"])
    tpl = tpl.replace("{{CATEGORY_NAME}}", meta["cat_name"])
    tpl = tpl.replace("{{CURRENT_LEVEL_3}}", level3)
    tpl = tpl.replace("{{OVERVIEW_HREF}}", meta["overview_href"])
    tpl = tpl.replace("{{TERM1_HREF}}", meta["term1_href"])
    tpl = tpl.replace("{{TERM2_HREF}}", meta["term2_href"])

    active_btn = "active px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mali font-bold text-xs shadow-md transition-all"
    inactive_btn = "px-4 py-2 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 font-mali font-bold text-xs shadow-xs transition-all"

    tpl = tpl.replace("{{OVERVIEW_CLASS}}", active_btn if term == "overview" else inactive_btn)
    tpl = tpl.replace("{{OVERVIEW_ARIA}}", 'aria-current="page"' if term == "overview" else "")

    tpl = tpl.replace("{{TERM1_CLASS}}", active_btn if term == "term1" else inactive_btn)
    tpl = tpl.replace("{{TERM1_ARIA}}", 'aria-current="page"' if term == "term1" else "")

    tpl = tpl.replace("{{TERM2_CLASS}}", active_btn if term == "term2" else inactive_btn)
    tpl = tpl.replace("{{TERM2_ARIA}}", 'aria-current="page"' if term == "term2" else "")

    return tpl


def render_pager(filename, meta):
    if not meta.get("has_pager"):
        return ""

    tpl = read_file(os.path.join(PARTIALS_DIR, "pager.html"))
    term = meta["term"]
    tpl = tpl.replace("{{OVERVIEW_HREF}}", meta["overview_href"])

    if term == "term1":
        prev_html = '<span class="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 font-bold cursor-not-allowed select-none" aria-disabled="true">← เทอมก่อน</span>'
        next_html = f'<a href="{meta["term2_href"]}" class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-md transition-all">เทอมถัดไป →</a>'
    else:
        prev_html = f'<a href="{meta["term1_href"]}" class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-md transition-all">← เทอมก่อน</a>'
        next_html = '<span class="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 font-bold cursor-not-allowed select-none" aria-disabled="true">เทอมถัดไป →</span>'

    tpl = tpl.replace("{{PREV_TERM_HTML}}", prev_html)
    tpl = tpl.replace("{{NEXT_TERM_HTML}}", next_html)
    return tpl


def render_footer():
    return read_file(os.path.join(PARTIALS_DIR, "footer.html"))


def fix_research_alt_tags(html):
    # Replace alt="T1" (4 photos)
    t1_idx = [0]
    def repl_t1(m):
        t1_idx[0] += 1
        return f'alt="ภาพการประเมินความพึงพอใจของผู้เรียนที่มีต่อรูปแบบการเรียนรู้ ภาคเรียนที่ 1/2569 ภาพที่ {t1_idx[0]}"'
    html = re.sub(r'alt="T1"', repl_t1, html)

    # Replace alt="T2" (10 photos)
    t2_idx = [0]
    def repl_t2(m):
        t2_idx[0] += 1
        return f'alt="ภาพการประเมินทักษะความคิดสร้างสรรค์หลังการใช้รูปแบบการเรียนรู้ ภาคเรียนที่ 1/2569 ภาพที่ {t2_idx[0]}"'
    html = re.sub(r'alt="T2"', repl_t2, html)

    # Replace alt="T3" (13 photos)
    t3_idx = [0]
    def repl_t3(m):
        t3_idx[0] += 1
        return f'alt="ภาพบรรยากาศการจัดการเรียนรู้โดยใช้รูปแบบการเรียนรู้ในชั้นเรียน ภาคเรียนที่ 1/2569 ภาพที่ {t3_idx[0]}"'
    html = re.sub(r'alt="T3"', repl_t3, html)

    return html


def fix_buddhist_era_dates_in_log(html):
    # Convert display dates 2026 -> 2569 and /26 -> /2569 while preserving 'instc 2026-08-07 0842264EF77002CE5F.JPG'
    placeholder = "__INSTC_FILENAME_PLACEHOLDER__"
    html = html.replace("instc 2026-08-07 0842264EF77002CE5F.JPG", placeholder)

    html = html.replace("05 พ.ค. - 08 พ.ค. 2026", "05 พ.ค. - 08 พ.ค. 2569")
    html = html.replace("11 พ.ค. - 15 พ.ค. 2026", "11 พ.ค. - 15 พ.ค. 2569")
    html = html.replace("05/05/2026 5/5/26", "05/05/2569 5/5/2569")
    html = html.replace("06/05/2026 6/5/26", "06/05/2569 6/5/2569")
    html = html.replace("07/05/2026 7/5/26", "07/05/2569 7/5/2569")
    html = html.replace("08/05/2026 8/5/26", "08/05/2569 8/5/2569")
    html = html.replace("วันอังคาร 5/5/26", "วันอังคาร 5/5/2569")
    html = html.replace("วันพุธ 6/5/26", "วันพุธ 6/5/2569")
    html = html.replace("วันพฤหัสบดี 7/5/26", "วันพฤหัสบดี 7/5/2569")
    html = html.replace("วันศุกร์ 8/5/26", "วันศุกร์ 8/5/2569")

    # Normalize any 2026 or /26 coming live from Google Sheets in fetchWeekData
    old_extract = 'dateRange = table.cols[2].label.replace("หมายเหตุ", "").trim();'
    new_extract = 'dateRange = table.cols[2].label.replace("หมายเหตุ", "").replace(/2026/g, "2569").trim();'
    if old_extract in html:
        html = html.replace(old_extract, new_extract)

    old_datestr = 'const dateStr = dateObj ? (dateObj.f || dateObj.v || "") : "";'
    new_datestr = 'const rawDateStr = dateObj ? (dateObj.f || dateObj.v || "") : ""; const dateStr = String(rawDateStr).replace(/2026/g, "2569").replace(/\\/26\\b/g, "/2569");'
    if old_datestr in html:
        html = html.replace(old_datestr, new_datestr)

    html = html.replace(placeholder, "instc 2026-08-07 0842264EF77002CE5F.JPG")
    return html


def strip_opposite_semester_sections(filename, html):
    # Fix #term1 / #term2 anchor links and forbidden "หน้าย่อย:" / "ไปหน้า" button labels across all pages
    html = html.replace('href="report.html#term2"', 'href="report-term2.html"')
    html = html.replace('href="report.html#term1"', 'href="report-term1.html"')
    html = html.replace('href="log.html#term2"', 'href="log-term2.html"')
    html = html.replace('href="log.html#term1"', 'href="log-term1.html"')
    html = html.replace('href="research.html#term2"', 'href="research-term2.html"')
    html = html.replace('href="research.html#term1"', 'href="research-term1.html"')
    html = html.replace('href="evaluation.html#term2"', 'href="evaluation-term2.html"')
    html = html.replace('href="evaluation.html#term1"', 'href="evaluation-term1.html"')
    html = html.replace("เลือกเข้าชมหน้าย่อย: ", "เลือกเข้าชม: ")
    html = html.replace("เข้าสู่หน้าย่อย: ", "เปิดดูข้อมูล: ")

    if filename in ("log.html", "log-term1.html", "log-term2.html"):
        html = fix_buddhist_era_dates_in_log(html)

    if filename in ("research.html", "research-term1.html", "research-term2.html"):
        html = fix_research_alt_tags(html)

    # 1. log-term1.html: keep only Term 1
    if filename == "log-term1.html":
        # Remove #log-term2-section HTML block
        html = re.sub(
            r'<!-- ═+\s*-->\s*<!-- TERM 2 WRAPPER:.*?-->\s*<!-- ═+\s*-->\s*<div id="log-term2-section"[\s\S]*?</div>\s*(?=<!-- Footer -->|<!-- Partial:)',
            "",
            html,
        )
        # Remove Term 2 JS block
        html = re.sub(
            r'// ─────────────────────────────────────────────────────────\s*// Data: Term 2 Weekly Plan[\s\S]*?function handleLogHash\(\) \{[\s\S]*?\}\s*',
            "",
            html,
        )
        html = html.replace("renderTerm2Weeks();\n", "")
        html = html.replace("fetchTerm2SheetData();\n", "")
        html = html.replace("handleLogHash();\n", "")
        html = html.replace("window.addEventListener('hashchange', handleLogHash);\n", "")

    # 2. log-term2.html: keep only Term 2 (completely remove #log-term1-section including "ตารางบันทึกผลการสอน 1/2569")
    elif filename == "log-term2.html":
        html = re.sub(
            r'<div id="log-term1-section"[^>]*>[\s\S]*?<!-- TERM 2 WRAPPER: แผนและบันทึกผลการปฏิบัติงาน ภาคเรียนที่ 2/2569 -->\s*<!-- ═+\s*-->\s*<div id="log-term2-section"[^>]*>',
            '<div id="log-term2-section">',
            html,
        )
        # Remove Term 1 JS functions and arrays
        html = re.sub(
            r'const kmImages = \[[\s\S]*?function initWeekSwipers\(\) \{[\s\S]*?\}\s*',
            "lucide.createIcons();\n",
            html,
        )
        html = re.sub(
            r'function switchLogTerm\(mode\) \{[\s\S]*?function handleLogHash\(\) \{[\s\S]*?\}\s*',
            "",
            html,
        )
        html = re.sub(
            r'document\.addEventListener\(\'DOMContentLoaded\', \(\) => \{[\s\S]*?\}\);\s*</script>',
            """document.addEventListener('DOMContentLoaded', () => {
            renderTerm2Weeks();
            fetchTerm2SheetData();
        });
    </script>""",
            html,
        )

    # 3. research-term1.html: keep only Term 1
    elif filename == "research-term1.html":
        html = re.sub(
            r'<!-- ═+\s*-->\s*<!-- TERM 2 WRAPPER:[\s\S]*?</div>\s*</div>\s*</div>\s*(?=<!-- Advisors Section)',
            "",
            html,
        )
        html = re.sub(
            r'function switchResearchTerm\(mode\) \{[\s\S]*?window\.addEventListener\(\'hashchange\', handleResearchHash\);',
            "",
            html,
        )

    # 4. research-term2.html: keep only Term 2
    elif filename == "research-term2.html":
        html = re.sub(
            r'<div id="research-term1-section"[^>]*>[\s\S]*?<!-- TERM 2 WRAPPER: การดำเนินงานและแผนการวิจัยในชั้นเรียน ภาคเรียนที่ 2/2569 -->\s*<!-- ═+\s*-->\s*<div id="research-term2-section"[^>]*>',
            '<div id="research-term2-section">',
            html,
        )
        html = re.sub(
            r'function switchResearchTerm\(mode\) \{[\s\S]*?window\.addEventListener\(\'hashchange\', handleResearchHash\);',
            "",
            html,
        )

    # 5. evaluation-term1.html: keep only Term 1
    elif filename == "evaluation-term1.html":
        html = re.sub(
            r'<!-- ═+\s*-->\s*<!-- TERM 2 WRAPPER:[\s\S]*?</div>\s*</div>\s*(?=<!-- Footer -->|<!-- Partial:)',
            "",
            html,
        )
        html = html.replace(
            "<strong>นางสาวเขมมิกา สุทธิชาติ</strong> — ภาคเรียนที่ 1 และ ภาคเรียนที่ 2 ปีการศึกษา 2569",
            "<strong>นางสาวเขมมิกา สุทธิชาติ</strong> — ภาคเรียนที่ 1 ปีการศึกษา 2569",
        )
        html = re.sub(
            r'<span[^>]*><i data-lucide="sparkles"[^>]*></i>เทอม 2: แผนนิเทศ 3 ครั้ง</span>\s*',
            "",
            html,
        )
        html = re.sub(
            r'function switchEvalTerm\(mode\) \{[\s\S]*?function handleEvalHash\(\) \{[\s\S]*?\}\s*',
            "",
            html,
        )
        html = html.replace("handleEvalHash();\n", "")
        html = html.replace("window.addEventListener('hashchange', handleEvalHash);\n", "")

    # 6. evaluation-term2.html: keep only Term 2
    elif filename == "evaluation-term2.html":
        html = re.sub(
            r'<div id="eval-term1-section"[^>]*>[\s\S]*?<!-- TERM 2 WRAPPER: แผนและการดำเนินงานนิเทศการสอน ภาคเรียนที่ 2/2569 -->\s*<!-- ═+\s*-->\s*<div id="eval-term2-section"[^>]*>',
            '<div id="eval-term2-section">',
            html,
        )
        html = html.replace(
            "<strong>นางสาวเขมมิกา สุทธิชาติ</strong> — ภาคเรียนที่ 1 และ ภาคเรียนที่ 2 ปีการศึกษา 2569",
            "<strong>นางสาวเขมมิกา สุทธิชาติ</strong> — ภาคเรียนที่ 2 ปีการศึกษา 2569",
        )
        html = re.sub(
            r'<span[^>]*><i data-lucide="check-circle-2"[^>]*></i>เทอม 1: นิเทศครบ 3 ครั้ง</span>\s*',
            "",
            html,
        )
        html = re.sub(
            r'<script>\s*lucide\.createIcons\(\);[\s\S]*?</script>',
            "<script>\n    lucide.createIcons();\n</script>",
            html,
        )

    # 7. report-term1.html: add Hero Banner (_Banner/3.png) if not present
    elif filename == "report-term1.html":
        if '_Banner/3.png' not in html:
            banner_html = """        <!-- Hero Banner Section (_Banner/3.png) -->
        <section class="w-full mb-10 relative">
            <div class="w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 sm:border-4 border-white/90 bg-white/40 relative">
                <img src="_Banner/3.png" alt="แบนเนอร์แผนการสอนและตารางสอน ภาคเรียนที่ 1/2569" class="w-full h-auto object-cover max-h-[420px]">
            </div>
        </section>

"""
            html = html.replace(
                "<!-- Course Registration Banner for Term 1 -->",
                banner_html + "        <!-- Course Registration Banner for Term 1 -->",
            )

    return html


def inject_partials(filename, meta, html):
    # 1. Update <title>
    html = re.sub(
        r"<title>.*?</title>",
        f"<title>{meta['title']}</title>",
        html,
        count=1,
        flags=re.DOTALL,
    )

    # Ensure nav.js?v=5 is loaded
    html = re.sub(r'src="nav\.js(?:\?v=\d+)?"', 'src="nav.js?v=5"', html)

    # 2. Replace or insert rendered header-nav partial (idempotent)
    header_nav_html = render_header_nav(filename, meta)
    if "<!-- Partial: Unified Header & Collapsible Left Sidebar Navigation -->" in html:
        html = re.sub(
            r"<!-- Partial: Unified Header & Collapsible Left Sidebar Navigation -->[\s\S]*?</header>",
            header_nav_html.strip(),
            html,
            count=1,
        )
    elif "<header" in html:
        html = re.sub(r"<aside id=\"khemmi-sidebar\"[\s\S]*?</aside>\s*", "", html)
        html = re.sub(
            r"(?:<!--[^>]*(?:Sticky|Unified|Navigation)[^>]*-->\s*)?<header[\s\S]*?</header>",
            header_nav_html.strip(),
            html,
            count=1,
        )
    else:
        # Insert right before <main or MAIN BANNER
        if "<main" in html:
            html = re.sub(r"(<main[^>]*>)", header_nav_html.strip() + "\n\n    \\1", html, count=1)
        elif "<!-- ====== MAIN BANNER (RESPONSIVE) ====== -->" in html:
            html = html.replace(
                "<!-- ====== MAIN BANNER (RESPONSIVE) ====== -->",
                header_nav_html.strip() + "\n\n<!-- ====== MAIN BANNER (RESPONSIVE) ====== -->",
                1,
            )

    # 3. Replace or insert Breadcrumb + Term Switcher partial inside <main> (idempotent)
    bc_html = render_breadcrumb_switcher(filename, meta)
    if 'id="site-breadcrumb-switcher"' in html:
        html = re.sub(
            r"<!-- Partial: (?:3-Level )?Breadcrumb[^>]*-->\s*<div id=\"site-breadcrumb-switcher\"[\s\S]*?</div>\s*(?:</div>\s*)?(?=\n\s*<!--|\n\s*<section|\n\s*<div)",
            bc_html.strip() + "\n",
            html,
            count=1,
        )
    else:
        html = re.sub(
            r"<!-- Breadcrumb & Sub-page (?:Navigation Bar|Quick Switcher) -->\s*<div class=\"glass-card[^>]*>\s*<nav aria-label=\"Breadcrumb\"[\s\S]*?</div>\s*</div>",
            "",
            html,
        )
        if "<main" in html:
            html = re.sub(
                r"(<main[^>]*>)",
                r"\1\n        " + bc_html.strip() + "\n",
                html,
                count=1,
            )
        elif filename == "school.html":
            html = html.replace(
                "<!-- ====== MAIN BANNER (RESPONSIVE) ====== -->",
                f'<div class="max-w-6xl mx-auto px-4 pt-6">{bc_html.strip()}</div>\n<!-- ====== MAIN BANNER (RESPONSIVE) ====== -->',
                1,
            )

    # 4. Replace or insert Bottom Pager + Standardized Footer
    pager_html = render_pager(filename, meta)
    footer_html = render_footer()
    combined_bottom = (pager_html + "\n\n        " + footer_html) if pager_html else footer_html

    # Remove old Bottom Sub-page Pager if present
    html = re.sub(
        r"<!-- Bottom Sub-page Pager -->\s*<div class=\"glass-card[\s\S]*?</div>\s*",
        "",
        html,
    )
    html = re.sub(
        r"<!-- Partial: Bottom Sub-page Pager[\s\S]*?</nav>\s*",
        "",
        html,
    )

    if "<footer" in html:
        html = re.sub(
            r"(?:<!-- Footer -->|<!-- Partial: Standardized Unified Footer -->)?\s*<footer[\s\S]*?</footer>",
            combined_bottom,
            html,
            count=1,
        )
    elif filename == "school.html":
        html = re.sub(
            r"<!-- ====== CUSTOM STUDENT FOOTER ====== -->[\s\S]*?<div class=\"student-footer-wrap fu\">[\s\S]*?</div>\s*</div>\s*</div>",
            f'<div class="max-w-6xl mx-auto px-4">{combined_bottom}</div>',
            html,
            count=1,
        )

    return html


def main():
    for filename, meta in PAGES.items():
        filepath = os.path.join(ROOT, filename)
        if not os.path.exists(filepath):
            print(f"[WARN] Missing {filename}")
            continue
        raw = read_file(filepath)
        step1 = strip_opposite_semester_sections(filename, raw)
        step2 = inject_partials(filename, meta, step1)
        write_file(filepath, step2)
        print(f"[OK] Built {filename} (title: {meta['title']})")


if __name__ == "__main__":
    main()
