import { useMemo, useState } from 'react';

function clampPercent(value) {
  return Math.min(100, Math.max(0, Number(value || 0)));
}

function AttendanceRing({ percentage, label }) {
  const safePercentage = clampPercent(percentage);
  return (
    <div
      className="h-40 w-40 rounded-full p-3 shadow-[inset_0_0_18px_rgba(15,23,42,0.08)]"
      style={{ background: `conic-gradient(#00c46f ${safePercentage * 3.6}deg, #e5e7eb 0deg)` }}
    >
      <div className="h-full w-full rounded-full bg-white flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold text-slate-900">{safePercentage}%</span>
        <span className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white/90 p-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>
    </div>
  );
}

export default function AttendanceCard({ attendance }) {
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  const subjectRows = useMemo(() => attendance.subjectRows || [], [attendance.subjectRows]);
  const selectedSubject = useMemo(
    () => subjectRows.find((item) => item.subject === selectedSubjectName) || subjectRows[0] || null,
    [selectedSubjectName, subjectRows]
  );
  const selectedTotal = selectedSubject?.total || 0;
  const selectedPresentPercent = selectedTotal ? Math.round((Number(selectedSubject.present || 0) / selectedTotal) * 100) : 0;
  const selectedAbsentPercent = selectedTotal ? Math.round((Number(selectedSubject.absent || 0) / selectedTotal) * 100) : 0;
  const selectedLeavePercent = selectedTotal ? Math.round((Number(selectedSubject.leave || 0) / selectedTotal) * 100) : 0;

  return (
    <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-5">
        <div>
          <h3 className="font-bold text-slate-900">Attendance Monitoring</h3>
          <p className="text-sm text-slate-500 mt-1">Subject-wise attendance overview and focused attendance graph.</p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          {attendance.total || 0} total records
        </span>
      </div>

      <div className="grid xl:grid-cols-[220px_1fr] gap-5">
        <div className="rounded-lg border border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 flex flex-col items-center justify-center">
          <AttendanceRing percentage={attendance.percentage} label="Overall" />
          <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center">
            <StatPill label="Present" value={attendance.present || 0} color="#00c46f" />
            <StatPill label="Absent" value={attendance.absent || 0} color="#ef4444" />
            <StatPill label="Leave" value={attendance.leave || 0} color="#64748b" />
          </div>
        </div>

        <div className="min-w-0">
          <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-3">
            {subjectRows.map((item) => {
              const isSelected = selectedSubject?.subject === item.subject;
              const percentage = clampPercent(item.percentage);
              return (
                <button
                  key={item.subject}
                  type="button"
                  onClick={() => setSelectedSubjectName(item.subject)}
                  className={`text-left rounded-lg border p-4 transition shadow-sm ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-50 shadow-[0_0_18px_rgba(16,185,129,0.18)]'
                      : 'border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 truncate">{item.subject}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">{item.total ? `${item.present}/${item.total} present` : 'Not marked yet'}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      item.total ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-[#00c46f]" style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-bold text-slate-500">
                    <span>P {item.present || 0}</span>
                    <span>A {item.absent || 0}</span>
                    <span>L {item.leave || 0}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {!subjectRows.length && <div className="rounded-lg border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">No subjects found for this course.</div>}

          {selectedSubject && (
            <div className="mt-5 rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase text-slate-500">Selected Subject</div>
                  <h4 className="mt-1 text-xl font-extrabold text-slate-900">{selectedSubject.subject}</h4>
                  <p className="text-sm text-slate-500 mt-1">{selectedTotal ? `${selectedTotal} attendance records analyzed.` : 'Attendance has not been marked for this subject.'}</p>
                </div>
                <AttendanceRing percentage={selectedSubject.percentage} label="Subject" />
              </div>

              <div className="mt-5 grid md:grid-cols-3 gap-3">
                {[
                  ['Present', selectedSubject.present || 0, selectedPresentPercent, '#00c46f'],
                  ['Absent', selectedSubject.absent || 0, selectedAbsentPercent, '#ef4444'],
                  ['Leave', selectedSubject.leave || 0, selectedLeavePercent, '#64748b'],
                ].map(([label, count, percent, color]) => (
                  <div key={label} className="rounded-lg bg-[#f5f5f6] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-slate-500">{label}</span>
                      <b className="text-slate-900">{count}</b>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-white overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
                    </div>
                    <div className="mt-2 text-right text-xs font-bold text-slate-500">{percent}%</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 h-4 rounded-full bg-slate-100 overflow-hidden flex">
                {[
                  ['Present', selectedPresentPercent, '#00c46f'],
                  ['Absent', selectedAbsentPercent, '#ef4444'],
                  ['Leave', selectedLeavePercent, '#64748b'],
                ].map(([label, percent, color]) => (
                  <div key={label} className="h-full" style={{ width: `${percent}%`, background: color }} title={`${label}: ${percent}%`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
