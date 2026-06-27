import { Archive, Edit3 } from 'lucide-react';
import StatusBadge from '../../students/components/StatusBadge';
import { getTimeSlotLabel, getTimeSlotOptions, weekDays } from '../timetableUtils';

export default function TimetableGrid({ canArchive, canCreate, canEdit, entries, onArchive, onCreate, onEdit }) {
  const timeSlotOptions = getTimeSlotOptions(entries);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="bg-[#e7e7e9] text-left px-3 py-3 rounded-lg min-w-32">Days</th>
            {timeSlotOptions.map((slot) => (
              <th key={slot.label} className="bg-[#e7e7e9] text-left px-3 py-3 rounded-lg min-w-44">{slot.label}</th>
            ))}
          </tr>
        </thead>
        {timeSlotOptions.length ? (
          <tbody>
          {weekDays.map((day) => (
            <tr key={day}>
              <td className="bg-white px-3 py-3 rounded-lg font-semibold text-slate-700 shadow-[0_0_0_1px_rgba(226,232,240,0.9)]">{day}</td>
              {timeSlotOptions.map((slot) => {
                const dayEntries = entries.filter((entry) => entry.day === day && getTimeSlotLabel(entry) === slot.label && entry.status !== 'Archived');
                return (
                  <td key={`${day}-${slot.label}`} className="bg-white align-top rounded-lg p-2 shadow-[0_0_0_1px_rgba(226,232,240,0.9)]">
                    <div className="space-y-2">
                      {dayEntries.map((entry) => (
                        <div key={entry.id} className="rounded-md bg-[#f5f5f6] p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-slate-900">{entry.subject}</div>
                              <div className="text-xs text-slate-500 mt-1">{entry.classKey}</div>
                              <div className="text-xs text-slate-500">{entry.facultyName}</div>
                              <div className="text-xs text-slate-500">{entry.classroomName}</div>
                            </div>
                            <StatusBadge value={entry.status || 'Draft'} />
                          </div>
                          {(canEdit || canArchive) && (
                            <div className="flex gap-2 mt-3">
                              {canEdit && (
                                <button onClick={() => onEdit(entry)} className="h-8 px-3 rounded-md bg-white border border-slate-200 text-xs font-semibold flex items-center gap-1">
                                  <Edit3 size={13} /> Edit
                                </button>
                              )}
                              {canArchive && (
                                <button onClick={() => onArchive(entry)} className="h-8 px-3 rounded-md bg-white border border-slate-200 text-xs font-semibold flex items-center gap-1">
                                  <Archive size={13} /> Archive
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      {!dayEntries.length && canCreate && (
                        <button
                          type="button"
                          onClick={() => onCreate({ day, timeSlot: slot.label, startTime: slot.startTime, endTime: slot.endTime })}
                          className="w-full min-h-16 rounded-md border border-dashed border-slate-200 p-2 text-left text-xs text-slate-400 hover:border-emerald-300 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Add timetable entry"
                        >
                          + Add class
                        </button>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td className="bg-white text-center text-sm text-slate-500 px-5 py-10 shadow-[0_0_0_1px_rgba(226,232,240,0.9)] rounded-lg">
                No timetable entries found for the selected course.
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
