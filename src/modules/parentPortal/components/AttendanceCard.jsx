export default function AttendanceCard({ attendance }) {
  return (
    <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">Attendance Monitoring</h3>
        <div className="text-xl font-bold text-[#33373e]">{attendance.percentage}%</div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
        <div className="border-l-2 border-emerald-400 pl-3"><span className="block text-xs text-slate-500">Present</span><b>{attendance.present}</b></div>
        <div className="border-l-2 border-rose-400 pl-3"><span className="block text-xs text-slate-500">Absent</span><b>{attendance.absent}</b></div>
        <div className="border-l-2 border-slate-300 pl-3"><span className="block text-xs text-slate-500">Leave</span><b>{attendance.leave}</b></div>
      </div>
      <div className="divide-y divide-slate-100 border-t border-slate-100">
        {attendance.subjectRows.map((item) => (
          <div key={item.subject} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 truncate">{item.subject}</div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Present: {item.present}</span>
                <span>Absent: {item.absent}</span>
                <span>Leave: {item.leave}</span>
              </div>
            </div>
            <span className={`self-start rounded-md border px-2.5 py-1 text-[11px] font-semibold ${item.total ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              {item.status}
            </span>
          </div>
        ))}
        {!attendance.subjectRows.length && <div className="text-sm text-slate-500">No subjects found for this course.</div>}
      </div>
    </div>
  );
}
