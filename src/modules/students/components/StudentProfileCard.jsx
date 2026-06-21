import { Edit3, UserRound } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function StudentProfileCard({ canEdit = true, student, onEdit }) {
  return (
    <div className="bg-[#f0f0f2] rounded-lg p-4 mb-5">
      <div className="bg-white rounded-lg p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">Student Profile</h2>
          <StatusBadge value={student.status} />
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div className="h-20 w-20 rounded-full bg-[#30343c] text-emerald-300 flex items-center justify-center">
            <UserRound size={38} />
          </div>
          <div>
            <div className="text-lg font-bold">{student.name}</div>
            <div className="text-sm text-slate-500">{student.className} - {student.section}</div>
            <div className="text-xs text-slate-500">{student.program}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-slate-500">Admission No</div>
            <div className="font-semibold">{student.admissionNo}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Student ID</div>
            <div className="font-semibold">{student.studentId}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500">Guardian</div>
            <div className="font-semibold">{student.guardianName}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500">ID Holder</div>
            <div className="font-semibold">{student.idHolder || '-'}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500">Contact</div>
            <div className="font-semibold">{student.phone}</div>
            <div className="text-slate-500">{student.email}</div>
          </div>
        </div>
        {canEdit && (
          <button
            onClick={() => onEdit(student)}
            className="mt-5 w-full h-10 rounded-full bg-[#33373e] text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Edit3 size={15} /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
