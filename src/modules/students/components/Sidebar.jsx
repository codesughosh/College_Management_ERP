import { useMemo, useState } from 'react';
import {
  Banknote,
  BedDouble,
  BookOpenCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  FileText,
  GraduationCap,
  Menu,
  MessageCircle,
  Megaphone,
  Moon,
  Plus,
  Settings,
  Sun,
  UserCheck,
  UserRound,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { getEnabledModules, sortModulesByDisplayOrder } from '../../moduleRegistry';
import { canAccess, defaultRoles } from '../../userRoles/rolePermissions';
import devloftLogo from '../../../../assets/logo.png';

export default function Sidebar({ activePage, activeSubmenuId = '', collapsed = false, currentUser, onNavigate, onThemeToggle, onToggleCollapse, themeMode = 'dark' }) {
  const [expandedState, setExpandedState] = useState({ page: activePage, moduleId: activePage });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentRoleId = currentUser?.roleId || 'admin';
  const isSuperAdmin = currentRoleId === 'super-admin';
  const isAdmin = currentRoleId === 'admin';
  const navItems = useMemo(() => {
    const canShowHiddenModule = (module) => {
      if (module.id === 'dashboard') return isAdmin || isSuperAdmin;
      if (module.id === 'parent-portal') return currentRoleId === 'parent';
      return isSuperAdmin;
    };
    return sortModulesByDisplayOrder(getEnabledModules()
      .filter((module) => !module.permission || canAccess(defaultRoles, currentRoleId, module.permission))
      .filter((module) => !module.footer)
      .filter((module) => !module.hideFromSidebar || canShowHiddenModule(module)))
      .map((module) => {
        const Icon = module.icon;
        return {
          id: module.id,
          label: module.label,
          group: module.group,
          status: module.status,
          icon: <Icon className="erp-sidebar-icon" size={18} />,
        };
      });
  }, [currentRoleId, isAdmin, isSuperAdmin]);
  const footerItems = useMemo(() => getEnabledModules()
    .filter((module) => !module.permission || canAccess(defaultRoles, currentRoleId, module.permission))
    .filter((module) => !module.hideFromSidebar && module.footer)
    .map((module) => {
      const Icon = module.icon;
      return {
        id: module.id,
        label: module.label,
        icon: <Icon className="erp-sidebar-icon" size={18} />,
      };
    }), [currentRoleId]);

  const selectTheme = (nextTheme) => {
    if (nextTheme !== themeMode) onThemeToggle?.();
  };

  const submenuItemsByModule = useMemo(() => ({
    students: [
      {
        id: 'student-records',
        label: 'Student Records',
        icon: <GraduationCap size={16} />,
        moduleId: 'students',
        state: { moduleSubmenu: 'student-records', studentStatusFilter: 'active' },
        enabled: canAccess(defaultRoles, currentRoleId, 'students.view'),
      },
      {
        id: 'student-admissions',
        label: 'New Admissions',
        icon: <Plus size={16} />,
        moduleId: 'students',
        state: { moduleSubmenu: 'student-admissions', studentAction: 'new-admission' },
        enabled: canAccess(defaultRoles, currentRoleId, 'students.create'),
      },
      {
        id: 'archived-students',
        label: 'Archived Students',
        icon: <FileText size={16} />,
        moduleId: 'students',
        state: { moduleSubmenu: 'archived-students', studentStatusFilter: 'archived' },
        enabled: canAccess(defaultRoles, currentRoleId, 'students.archive'),
      },
    ],
    'faculty-staff': [
      {
        id: 'faculty-records',
        label: 'Faculty Records',
        icon: <Users size={16} />,
        moduleId: 'faculty-staff',
        state: { moduleSubmenu: 'faculty-records' },
        enabled: canAccess(defaultRoles, currentRoleId, 'staff.view'),
      },
      {
        id: 'staff-leave',
        label: 'Leave Records',
        icon: <CalendarDays size={16} />,
        moduleId: 'faculty-staff',
        state: { moduleSubmenu: 'staff-leave' },
        enabled: canAccess(defaultRoles, currentRoleId, 'staff.leave'),
      },
      {
        id: 'staff-documents',
        label: 'Staff Documents',
        icon: <FileCheck2 size={16} />,
        moduleId: 'document-management',
        state: { moduleSubmenu: 'staff-documents' },
        enabled: canAccess(defaultRoles, currentRoleId, 'documents.view'),
      },
    ],
    attendance: [
      {
        id: 'student-attendance',
        label: 'Student Attendance',
        icon: <Users size={16} />,
        moduleId: 'attendance',
        state: { moduleSubmenu: 'student-attendance', attendanceSubmenu: 'student-attendance', attendanceTask: 'students', attendanceBranch: 'mark-students', attendanceMode: 'students' },
        enabled: canAccess(defaultRoles, currentRoleId, 'attendance.view'),
      },
      {
        id: 'staff-attendance',
        label: 'Staff Attendance',
        icon: <UserCheck size={16} />,
        moduleId: 'attendance',
        state: { moduleSubmenu: 'staff-attendance', attendanceSubmenu: 'staff-attendance', attendanceTask: 'staff', attendanceBranch: 'mark-staff', attendanceMode: 'staff' },
        enabled: canAccess(defaultRoles, currentRoleId, 'attendance.markStaff') || canAccess(defaultRoles, currentRoleId, 'staff.attendance'),
      },
    ],
    timetable: [
      {
        id: 'class-timetable',
        label: 'Class Timetable',
        icon: <CalendarDays size={16} />,
        moduleId: 'timetable',
        state: { moduleSubmenu: 'class-timetable' },
        enabled: canAccess(defaultRoles, currentRoleId, 'timetable.view'),
      },
      {
        id: 'publish-timetable',
        label: 'Publishing',
        icon: <BookOpenCheck size={16} />,
        moduleId: 'timetable',
        state: { moduleSubmenu: 'publish-timetable' },
        enabled: canAccess(defaultRoles, currentRoleId, 'timetable.publish'),
      },
      {
        id: 'classrooms',
        label: 'Classrooms',
        icon: <ClipboardList size={16} />,
        moduleId: 'timetable',
        state: { moduleSubmenu: 'classrooms' },
        enabled: canAccess(defaultRoles, currentRoleId, 'timetable.classrooms'),
      },
    ],
    'examination-results': [
      {
        id: 'exam-schedules',
        label: 'Exam Schedules',
        icon: <ClipboardList size={16} />,
        moduleId: 'examination-results',
        state: { moduleSubmenu: 'exam-schedules', examTask: 'schedules', examBranch: 'review-schedules' },
        enabled: canAccess(defaultRoles, currentRoleId, 'exams.view'),
      },
      {
        id: 'exam-marks',
        label: 'Marks Entry',
        icon: <GraduationCap size={16} />,
        moduleId: 'examination-results',
        state: { moduleSubmenu: 'exam-marks', examTask: 'marks', examBranch: 'review-marks' },
        enabled: canAccess(defaultRoles, currentRoleId, 'exams.marks'),
      },
      {
        id: 'exam-results',
        label: 'Results',
        icon: <BookOpenCheck size={16} />,
        moduleId: 'examination-results',
        state: { moduleSubmenu: 'exam-results', examTask: 'results', examBranch: 'generate-results' },
        enabled: canAccess(defaultRoles, currentRoleId, 'exams.results'),
      },
      {
        id: 'exam-report-cards',
        label: 'Report Cards',
        icon: <FileText size={16} />,
        moduleId: 'examination-results',
        state: { moduleSubmenu: 'exam-report-cards', examTask: 'results', examBranch: 'report-cards' },
        enabled: canAccess(defaultRoles, currentRoleId, 'exams.reportCards'),
      },
    ],
    communication: [
      {
        id: 'communication-notices',
        label: 'Notices & Announcements',
        icon: <Megaphone size={16} />,
        moduleId: 'communication',
        state: { moduleSubmenu: 'communication-notices', communicationTask: 'notices' },
        enabled: canAccess(defaultRoles, currentRoleId, 'notices.view'),
      },
      {
        id: 'communication-alerts',
        label: 'SMS / WhatsApp Alerts',
        icon: <MessageCircle size={16} />,
        moduleId: 'communication',
        state: { moduleSubmenu: 'communication-alerts', communicationTask: 'alerts' },
        enabled: canAccess(defaultRoles, currentRoleId, 'notices.view'),
      },
      {
        id: 'communication-parents',
        label: 'Parent Communication',
        icon: <UserRound size={16} />,
        moduleId: 'communication',
        state: { moduleSubmenu: 'communication-parents', communicationTask: 'parents' },
        enabled: canAccess(defaultRoles, currentRoleId, 'notices.view'),
      },
    ],
    calendar: [
      {
        id: 'academic-calendar',
        label: 'Academic Calendar',
        icon: <CalendarDays size={16} />,
        moduleId: 'calendar',
        state: { moduleSubmenu: 'academic-calendar' },
        enabled: canAccess(defaultRoles, currentRoleId, 'academicCurriculum.view'),
      },
      {
        id: 'curriculum-plan',
        label: 'Curriculum Plan',
        icon: <BookOpenCheck size={16} />,
        moduleId: 'calendar',
        state: { moduleSubmenu: 'curriculum-plan' },
        enabled: canAccess(defaultRoles, currentRoleId, 'academicCurriculum.view'),
      },
    ],
    'hostel-management': [
      {
        id: 'hostel-rooms',
        label: 'Rooms',
        icon: <BedDouble size={16} />,
        moduleId: 'hostel-management',
        state: { moduleSubmenu: 'hostel-rooms' },
        enabled: canAccess(defaultRoles, currentRoleId, 'hostel.view'),
      },
      {
        id: 'hostel-allocation',
        label: 'Allocations',
        icon: <UserCheck size={16} />,
        moduleId: 'hostel-management',
        state: { moduleSubmenu: 'hostel-allocation' },
        enabled: canAccess(defaultRoles, currentRoleId, 'hostel.manage'),
      },
    ],
    'document-management': [
      {
        id: 'document-review',
        label: 'Review Queue',
        icon: <FileCheck2 size={16} />,
        moduleId: 'document-management',
        state: { moduleSubmenu: 'document-review' },
        enabled: canAccess(defaultRoles, currentRoleId, 'documents.verify') || canAccess(defaultRoles, currentRoleId, 'documents.view'),
      },
      {
        id: 'document-upload',
        label: 'Upload Documents',
        icon: <Plus size={16} />,
        moduleId: 'document-management',
        state: { moduleSubmenu: 'document-upload' },
        enabled: canAccess(defaultRoles, currentRoleId, 'documents.upload'),
      },
      {
        id: 'document-archive',
        label: 'Archive',
        icon: <FileText size={16} />,
        moduleId: 'document-management',
        state: { moduleSubmenu: 'document-archive' },
        enabled: canAccess(defaultRoles, currentRoleId, 'documents.archive'),
      },
    ],
    fees: [
      {
        id: 'payment-collections',
        label: 'Fee Collections',
        icon: <Banknote size={16} />,
        moduleId: 'fees',
        state: { moduleSubmenu: 'payment-collections', feeTask: 'collections', feeBranch: 'collect-fee' },
        enabled: canAccess(defaultRoles, currentRoleId, 'fees.view'),
      },
      {
        id: 'payment-settings',
        label: 'Payment Settings',
        icon: <Settings size={16} />,
        moduleId: 'fees',
        state: { moduleSubmenu: 'payment-settings', feeTask: 'structures', feeBranch: 'manage-structures' },
        enabled: canAccess(defaultRoles, currentRoleId, 'fees.setup') || canAccess(defaultRoles, currentRoleId, 'fees.assign'),
      },
      {
        id: 'due-fee-tracking',
        label: 'Due Fee Tracking',
        icon: <MessageCircle size={16} />,
        moduleId: 'fees',
        state: { moduleSubmenu: 'due-fee-tracking', feeTask: 'due-tracking', feeBranch: 'due-list' },
        enabled: canAccess(defaultRoles, currentRoleId, 'fees.view'),
      },
      {
        id: 'payment-adjustments',
        label: 'Adjustments',
        icon: <Wallet size={16} />,
        moduleId: 'fees',
        state: { moduleSubmenu: 'payment-adjustments', feeTask: 'adjustments', feeBranch: 'adjustment-history' },
        enabled: canAccess(defaultRoles, currentRoleId, 'fees.adjust'),
      },
    ],
    reports: [
      {
        id: 'students',
        label: 'Student',
        icon: <GraduationCap size={16} />,
        moduleId: 'reports',
        state: { reportCategory: 'students' },
        enabled: canAccess(defaultRoles, currentRoleId, 'students.view'),
      },
      {
        id: 'attendance',
        label: 'Attendance',
        icon: <ClipboardList size={16} />,
        moduleId: 'reports',
        state: { reportCategory: 'attendance' },
        enabled: canAccess(defaultRoles, currentRoleId, 'attendance.reports'),
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: <FileCheck2 size={16} />,
        moduleId: 'reports',
        state: { reportCategory: 'documents' },
        enabled: canAccess(defaultRoles, currentRoleId, 'documents.view') || canAccess(defaultRoles, currentRoleId, 'students.documents'),
      },
      {
        id: 'exams',
        label: 'Exams',
        icon: <BookOpenCheck size={16} />,
        moduleId: 'reports',
        state: { reportCategory: 'exams' },
        enabled: canAccess(defaultRoles, currentRoleId, 'exams.view') || canAccess(defaultRoles, currentRoleId, 'exams.results'),
      },
      {
        id: 'financial',
        label: 'Financial',
        icon: <Wallet size={16} />,
        moduleId: 'reports',
        state: { reportCategory: 'financial' },
        enabled: canAccess(defaultRoles, currentRoleId, 'financialReports.view'),
      },
    ],
    settings: [
      {
        id: 'institute-settings',
        label: 'Institute Profile',
        icon: <Settings size={16} />,
        moduleId: 'settings',
        state: { moduleSubmenu: 'institute-settings' },
        enabled: canAccess(defaultRoles, currentRoleId, 'settings.view'),
      },
      {
        id: 'academic-year-settings',
        label: 'Academic Year',
        icon: <CalendarDays size={16} />,
        moduleId: 'settings',
        state: { moduleSubmenu: 'academic-year-settings' },
        enabled: canAccess(defaultRoles, currentRoleId, 'settings.manage'),
      },
      {
        id: 'module-settings',
        label: 'Module Defaults',
        icon: <ClipboardList size={16} />,
        moduleId: 'settings',
        state: { moduleSubmenu: 'module-settings' },
        enabled: canAccess(defaultRoles, currentRoleId, 'settings.manage'),
      },
    ],
  }), [currentRoleId]);
  const visibleMobileItems = useMemo(() => [...navItems, ...footerItems], [footerItems, navItems]);
  const activeDefaultExpandedModuleId = submenuItemsByModule[activePage]?.some((item) => item.enabled) ? activePage : '';
  const expandedModuleId = expandedState.page === activePage ? expandedState.moduleId : activeDefaultExpandedModuleId;

  const renderNavButton = ({ id, label, icon, status }) => {
    const active = activePage === id;
    const submenuItems = (submenuItemsByModule[id] || []).filter((item) => item.enabled);
    const expanded = Boolean(!collapsed && submenuItems.length > 0 && expandedModuleId === id);
    const handleClick = () => {
      if (submenuItems.length && !collapsed) {
        setExpandedState({ page: activePage, moduleId: expandedModuleId === id ? '' : id });
        return;
      }
      setExpandedState({ page: activePage, moduleId: '' });
      onNavigate(id);
    };
    return (
      <div key={id} className="erp-sidebar-item-wrap">
        <button
          onClick={handleClick}
          className={`erp-sidebar-item ${active ? 'is-active' : ''}`}
          title={collapsed ? label : undefined}
          aria-expanded={submenuItems.length > 0 ? expanded : undefined}
        >
          <span className="erp-sidebar-item-icon">{icon}</span>
          {!collapsed && <span className="erp-sidebar-item-label">{label}</span>}
          {!collapsed && submenuItems.length > 0 && <ChevronRight className={`erp-sidebar-submenu-chevron ${expanded ? 'is-open' : ''}`} size={16} />}
          {!collapsed && status === 'planned' && <span className="erp-sidebar-item-badge">Soon</span>}
          {!collapsed && status === 'demo' && <span className="erp-sidebar-item-badge">Demo</span>}
        </button>
        {expanded && (
          <div className="erp-sidebar-submenu">
            {submenuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setExpandedState({ page: activePage, moduleId: item.moduleId });
                  onNavigate(item.moduleId, { state: item.state });
                }}
                className={`erp-sidebar-subitem ${activeSubmenuId === item.id || activeSubmenuId === item.state?.moduleSubmenu || activeSubmenuId === item.state?.reportCategory || activeSubmenuId === item.state?.attendanceSubmenu ? 'is-active' : ''}`}
              >
                <span className="erp-sidebar-subitem-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleMobileNavigate = (item) => {
    setExpandedState({ page: activePage, moduleId: '' });
    setMobileMenuOpen(false);
    onNavigate(item.id);
  };

  const handleMobileSubmenuNavigate = (item) => {
    setExpandedState({ page: activePage, moduleId: item.moduleId });
    setMobileMenuOpen(false);
    onNavigate(item.moduleId, { state: item.state });
  };

  const renderMobileDrawerItem = ({ id, label, icon, status }) => {
    const active = activePage === id;
    const submenuItems = (submenuItemsByModule[id] || []).filter((item) => item.enabled);
    const expanded = submenuItems.length > 0 && expandedModuleId === id;
    return (
      <div key={id} className="erp-mobile-drawer-item-wrap">
        <button
          type="button"
          onClick={() => {
            if (submenuItems.length > 0) {
              setExpandedState({ page: activePage, moduleId: expanded ? '' : id });
              return;
            }
            handleMobileNavigate({ id });
          }}
          className={`erp-mobile-drawer-item ${active ? 'is-active' : ''}`}
          aria-expanded={submenuItems.length > 0 ? expanded : undefined}
        >
          <span className="erp-mobile-drawer-item-icon">{icon}</span>
          <span>{label}</span>
          {status === 'planned' && <span className="erp-sidebar-item-badge">Soon</span>}
          {status === 'demo' && <span className="erp-sidebar-item-badge">Demo</span>}
          {submenuItems.length > 0 && <ChevronRight className={`erp-sidebar-submenu-chevron ${expanded ? 'is-open' : ''}`} size={16} />}
        </button>
        {expanded && (
          <div className="erp-mobile-drawer-submenu">
            {submenuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMobileSubmenuNavigate(item)}
                className={`erp-mobile-drawer-subitem ${activeSubmenuId === item.id || activeSubmenuId === item.state?.moduleSubmenu || activeSubmenuId === item.state?.reportCategory || activeSubmenuId === item.state?.attendanceSubmenu ? 'is-active' : ''}`}
              >
                <span className="erp-sidebar-subitem-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
    <aside className={`erp-sidebar ${collapsed ? 'is-collapsed' : ''} bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col transition-all duration-300`}>
      <div className="erp-sidebar-sticky">
        <div className="erp-sidebar-brand-card">
          {collapsed ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="erp-sidebar-logo erp-sidebar-expand-logo"
              title="Expand sidebar"
            >
              <img src={devloftLogo} alt="" className="h-full w-full object-contain rounded-lg" />
            </button>
          ) : (
            <div className="erp-sidebar-logo">
              <img src={devloftLogo} alt="" className="h-full w-full object-contain rounded-lg" />
            </div>
          )}
          {!collapsed && (
            <div className="erp-sidebar-brand-copy">
              <div className="erp-sidebar-brand-name">Devloft College Management</div>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="erp-sidebar-collapse-button"
              title="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        <div className="erp-sidebar-menu-card">
          <nav className="erp-sidebar-nav">
            {navItems.map(renderNavButton)}
            {footerItems.map(renderNavButton)}
          </nav>
        </div>

        <div className="erp-sidebar-theme-switch" aria-label="Theme mode">
          <button
            type="button"
            onClick={() => selectTheme('light')}
            className={themeMode === 'light' ? 'is-active' : ''}
            title="Light mode"
          >
            <Sun size={18} />
            {!collapsed && <span>Light</span>}
          </button>
          <button
            type="button"
            onClick={() => selectTheme('dark')}
            className={themeMode === 'dark' ? 'is-active' : ''}
            title="Dark mode"
          >
            <Moon size={18} />
            {!collapsed && <span>Dark</span>}
          </button>
        </div>
      </div>
    </aside>
    <button
      type="button"
      onClick={() => setMobileMenuOpen(true)}
      className="erp-mobile-menu-button md:hidden"
      aria-label="Open menu"
    >
      <Menu size={22} />
    </button>
    <div className={`erp-mobile-drawer-shell md:hidden ${mobileMenuOpen ? 'is-open' : ''}`} aria-hidden={!mobileMenuOpen}>
      <button
        type="button"
        className="erp-mobile-drawer-backdrop"
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close menu"
      />
      <aside className="erp-mobile-drawer" aria-label="Mobile modules">
        <div className="erp-mobile-drawer-header">
          <div className="erp-sidebar-logo">
            <img src={devloftLogo} alt="" className="h-full w-full object-contain rounded-lg" />
          </div>
          <div className="erp-mobile-drawer-title">Devloft College Management</div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="erp-mobile-drawer-close"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="erp-mobile-drawer-nav">
          {visibleMobileItems.map(renderMobileDrawerItem)}
        </nav>
        <div className="erp-mobile-drawer-theme" aria-label="Theme mode">
          <button
            type="button"
            onClick={() => selectTheme('light')}
            className={themeMode === 'light' ? 'is-active' : ''}
          >
            <Sun size={16} />
            Light
          </button>
          <button
            type="button"
            onClick={() => selectTheme('dark')}
            className={themeMode === 'dark' ? 'is-active' : ''}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>
      </aside>
    </div>
    </>
  );
}
