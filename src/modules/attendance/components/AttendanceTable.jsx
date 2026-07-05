import { memo, useMemo } from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';

function AttendanceStatusControl({ canMark, mode, record, entity, onMark, canNotify, onNotify }) {
  const currentStatus = record?.status || '';
  const statuses = [
    { label: 'Present', icon: <CheckCircle size={15} />, activeClass: 'is-present' },
    { label: 'Absent', icon: <XCircle size={15} />, activeClass: 'is-absent' },
  ];

  return (
    <div className="erp-attendance-status-wrap">
      <div className="erp-attendance-status-actions" aria-label="Attendance status">
        {statuses.map((status) => {
          const active = currentStatus === status.label;
          return (
            <button
              key={status.label}
              type="button"
              disabled={!canMark}
              onClick={(event) => {
                event.stopPropagation();
                onMark(entity, status.label);
              }}
              className={`erp-attendance-status-button ${active ? status.activeClass : ''}`}
              aria-pressed={active}
              title={`Mark ${status.label}`}
            >
              {status.icon}
              <span>{status.label}</span>
            </button>
          );
        })}
      </div>
      {!currentStatus && <div className="erp-attendance-status-hint">Not marked</div>}
      {mode === 'students' && record?.status === 'Absent' && (
        <button
          type="button"
          disabled={!canNotify || record.parentNotified}
          onClick={(event) => {
            event.stopPropagation();
            onNotify(entity, record);
          }}
          className="erp-attendance-notify-button"
          title="Notify parent"
        >
          <Bell size={14} />
          <span>{record.parentNotified ? 'Notified' : 'Notify'}</span>
        </button>
      )}
    </div>
  );
}

function AttendanceTable({
  canMark,
  canNotify,
  entities,
  mode,
  records,
  selectedDate,
  onMark,
  onNotify,
  onSelect,
  selectedId,
  showActions = true,
}) {
  const recordsByEntityId = useMemo(() => records.reduce((map, record) => {
    if (record.entityId && record.dateText === selectedDate) {
      map.set(record.entityId, record);
    }
    return map;
  }, new Map()), [records, selectedDate]);

  return (
    <div className="attendance-table-wrap overflow-x-auto">
      <table className="attendance-table w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-[#e7e7e9] text-left text-slate-900">
            <th className="px-5 py-3 rounded-l-lg">{mode === 'students' ? 'Student' : 'Faculty / Staff'}</th>
            <th className={`px-5 py-3 ${showActions ? '' : 'rounded-r-lg'}`}>Status</th>
            <th className="px-5 py-3">Details</th>
            {showActions && <th className="px-5 py-3 rounded-r-lg text-right">Action</th>}
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => {
            const entityId = entity.studentId || entity.employeeId;
            const record = recordsByEntityId.get(entityId);
            return (
              <tr
                key={entity.id}
                onClick={() => onSelect?.(entity.id)}
                className={`bg-white shadow-[0_0_0_1px_rgba(226,232,240,0.9)] rounded-lg cursor-pointer ${selectedId === entity.id ? 'erp-row-selected' : ''}`}
              >
                <td className="px-5 py-4 rounded-l-lg">
                  <div className="font-bold text-slate-900">{entity.name}</div>
                  <div className="text-xs text-slate-500">{entityId}</div>
                </td>
                <td className="px-5 py-4">
                  <AttendanceStatusControl
                    canMark={canMark}
                    canNotify={canNotify}
                    entity={entity}
                    mode={mode}
                    record={record}
                    onMark={onMark}
                    onNotify={onNotify}
                  />
                </td>
                <td className={`px-5 py-4 ${showActions ? '' : 'rounded-r-lg'}`}>
                  {mode === 'students' ? (
                    <>
                      <div>{entity.className} - {entity.section}</div>
                      <div className="text-xs text-slate-500">{entity.program}</div>
                    </>
                  ) : (
                    <>
                      <div>{entity.department}</div>
                      <div className="text-xs text-slate-500">{entity.designation}</div>
                    </>
                  )}
                </td>
                {showActions && (
                <td className="px-5 py-4 rounded-r-lg">
                  <div className="flex justify-end gap-2">
                    {mode === 'students' && record?.status === 'Absent' && (
                      <button
                        disabled={!canNotify || record.parentNotified}
                        onClick={(event) => {
                          event.stopPropagation();
                          onNotify(entity, record);
                        }}
                        className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-40"
                        title="Notify parent"
                      >
                        <Bell size={15} />
                      </button>
                    )}
                  </div>
                </td>
                )}
              </tr>
            );
          })}
          {!entities.length && (
            <tr>
              <td colSpan={showActions ? 4 : 3} className="bg-white text-center text-sm text-slate-500 px-5 py-10 shadow-[0_0_0_1px_rgba(226,232,240,0.9)] rounded-lg">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default memo(AttendanceTable);
