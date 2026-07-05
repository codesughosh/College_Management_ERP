import { useState } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, Moon, Sun } from 'lucide-react';
import { getEnabledModules, sortModulesByDisplayOrder } from '../../moduleRegistry';
import { canAccess, defaultRoles } from '../../userRoles/rolePermissions';

export default function Sidebar({ activePage, activeSubmenuId = '', collapsed = false, currentUser, institute, onNavigate, onThemeToggle, onToggleCollapse, themeMode = 'dark' }) {
  const [hoveredModuleId, setHoveredModuleId] = useState('');
  const currentRoleId = currentUser?.roleId || 'admin';
  const isSuperAdmin = currentRoleId === 'super-admin';
  const isAdmin = currentRoleId === 'admin';
  const canShowHiddenModule = (module) => {
    if (module.id === 'dashboard') return isAdmin || isSuperAdmin;
    if (module.id === 'parent-portal') return currentRoleId === 'parent';
    return isSuperAdmin;
  };
  const collegeName = institute?.name || '-';
  const navItems = sortModulesByDisplayOrder(getEnabledModules()
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
  const footerItems = getEnabledModules()
    .filter((module) => !module.permission || canAccess(defaultRoles, currentRoleId, module.permission))
    .filter((module) => !module.hideFromSidebar && module.footer)
    .map((module) => {
      const Icon = module.icon;
      return {
        id: module.id,
        label: module.label,
        icon: <Icon className="erp-sidebar-icon" size={18} />,
      };
    });

  const selectTheme = (nextTheme) => {
    if (nextTheme !== themeMode) onThemeToggle?.();
  };

  const submenuItemsByModule = {
    attendance: [
      {
        id: 'student-attendance',
        label: 'Student Attendance',
        moduleId: 'attendance',
        state: { attendanceSubmenu: 'student-attendance', attendanceTask: 'students', attendanceBranch: 'mark-students', attendanceMode: 'students' },
        enabled: canAccess(defaultRoles, currentRoleId, 'attendance.view'),
      },
      {
        id: 'staff-attendance',
        label: 'Staff Attendance',
        moduleId: 'attendance',
        state: { attendanceSubmenu: 'staff-attendance', attendanceTask: 'staff', attendanceBranch: 'mark-staff', attendanceMode: 'staff' },
        enabled: canAccess(defaultRoles, currentRoleId, 'attendance.markStaff') || canAccess(defaultRoles, currentRoleId, 'staff.attendance'),
      },
      {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        moduleId: 'reports',
        state: { reportCategory: 'attendance', sourceModule: 'attendance' },
        enabled: canAccess(defaultRoles, currentRoleId, 'reports.view') && canAccess(defaultRoles, currentRoleId, 'attendance.reports'),
      },
    ],
    reports: [
      {
        id: 'students',
        label: 'Student',
        moduleId: 'reports',
        state: { reportCategory: 'students' },
        enabled: canAccess(defaultRoles, currentRoleId, 'students.view'),
      },
      {
        id: 'attendance',
        label: 'Attendance',
        moduleId: 'reports',
        state: { reportCategory: 'attendance' },
        enabled: canAccess(defaultRoles, currentRoleId, 'attendance.reports'),
      },
      {
        id: 'documents',
        label: 'Documents',
        moduleId: 'reports',
        state: { reportCategory: 'documents' },
        enabled: canAccess(defaultRoles, currentRoleId, 'documents.view') || canAccess(defaultRoles, currentRoleId, 'students.documents'),
      },
      {
        id: 'exams',
        label: 'Exams',
        moduleId: 'reports',
        state: { reportCategory: 'exams' },
        enabled: canAccess(defaultRoles, currentRoleId, 'exams.view') || canAccess(defaultRoles, currentRoleId, 'exams.results'),
      },
      {
        id: 'financial',
        label: 'Financial',
        moduleId: 'reports',
        state: { reportCategory: 'financial' },
        enabled: canAccess(defaultRoles, currentRoleId, 'financialReports.view'),
      },
    ],
  };

  const renderNavButton = ({ id, label, icon, status }) => {
    const active = activePage === id;
    const submenuItems = (submenuItemsByModule[id] || []).filter((item) => item.enabled);
    const expanded = !collapsed && submenuItems.length && (active || hoveredModuleId === id);
    return (
      <div
        key={id}
        className="erp-sidebar-item-wrap"
        onMouseEnter={() => setHoveredModuleId(id)}
        onMouseLeave={() => setHoveredModuleId('')}
      >
        <button
          onClick={() => onNavigate(id)}
          className={`erp-sidebar-item ${active ? 'is-active' : ''}`}
          title={collapsed ? label : undefined}
        >
          <span className="erp-sidebar-item-icon">{icon}</span>
          {!collapsed && <span className="erp-sidebar-item-label">{label}</span>}
          {!collapsed && status === 'planned' && <span className="erp-sidebar-item-badge">Soon</span>}
          {!collapsed && status === 'demo' && <span className="erp-sidebar-item-badge">Demo</span>}
        </button>
        {expanded && (
          <div className="erp-sidebar-submenu">
            {submenuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.moduleId, { state: item.state })}
                className={`erp-sidebar-subitem ${activeSubmenuId === item.id || activeSubmenuId === item.state.reportCategory ? 'is-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`erp-sidebar ${collapsed ? 'is-collapsed' : ''} bg-white border-r border-slate-200 shrink-0 hidden lg:flex flex-col transition-all duration-300`}>
      <div className="erp-sidebar-sticky">
        <div className="erp-sidebar-brand-card">
          {collapsed ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="erp-sidebar-logo erp-sidebar-expand-logo"
              title="Expand sidebar"
            >
              {institute?.logoUrl ? (
                <img src={institute.logoUrl} alt="" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <ChevronRight className="erp-sidebar-logo-icon" size={26} />
              )}
            </button>
          ) : (
            <div className="erp-sidebar-logo">
              {institute?.logoUrl ? (
                <img src={institute.logoUrl} alt="" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <GraduationCap className="erp-sidebar-logo-icon" size={26} />
              )}
            </div>
          )}
          {!collapsed && (
            <div className="erp-sidebar-brand-copy">
              <div className="erp-sidebar-brand-name">{collegeName}</div>
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
  );
}
