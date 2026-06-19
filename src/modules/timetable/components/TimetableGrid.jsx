import { Archive, Edit3 } from 'lucide-react';
import StatusBadge from '../../students/components/StatusBadge';
import { timeSlots, weekDays } from '../timetableUtils';

export default function TimetableGrid({ canArchive, canEdit, entries, onArchive, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="bg-[#e7e7e9] text-left px-3 py-3 rounded-lg min-w-32">Time</th>
            {weekDays.map((day) => (
              <th key={day} className="bg-[#e7e7e9] text-left px-3 py-3 rounded-lg min-w-52">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot}>
              <td className="bg-white px-3 py-3 rounded-lg font-semibold text-slate-700 shadow-[0_0_0_1px_rgba(226,232,240,0.9)]">{slot}</td>
              {weekDays.map((day) => {
                const dayEntries = entries.filter((entry) => entry.day === day && entry.timeSlot === slot && entry.status !== 'Archived');
                return (
                  <td key={`${day}-${slot}`} className="bg-white align-top rounded-lg p-2 shadow-[0_0_0_1px_rgba(226,232,240,0.9)]">
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
                          <div className="flex gap-2 mt-3">
                            <button disabled={!canEdit} onClick={() => onEdit(entry)} className="h-8 px-3 rounded-md bg-white border border-slate-200 text-xs font-semibold flex items-center gap-1 disabled:opacity-40">
                              <Edit3 size={13} /> Edit
                            </button>
                            <button disabled={!canArchive} onClick={() => onArchive(entry)} className="h-8 px-3 rounded-md bg-white border border-slate-200 text-xs font-semibold flex items-center gap-1 disabled:opacity-40">
                              <Archive size={13} /> Archive
                            </button>
                          </div>
                        </div>
                      ))}
                      {!dayEntries.length && <div className="text-xs text-slate-400 p-2">No class</div>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
