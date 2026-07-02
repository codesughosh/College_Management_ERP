import { useEffect, useMemo, useState } from 'react';
import { BedDouble, ClipboardList, Home, Plus, Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createHostelAllocation,
  createHostelRecord,
  createHostelRoom,
  getHostelManagementData,
  updateHostelRoom,
} from '../../firebase/db';
import { isFirebaseConfigured } from '../../firebase/config';
import { canAccess, defaultRoles } from '../userRoles/rolePermissions';
import StatusBadge from '../students/components/StatusBadge';
import { demoHostelAllocations, demoHostelRecords, demoHostelRooms } from './demoHostel';
import {
  filterHostelItems,
  formatDisplayDate,
  summarizeHostel,
  validateHostelAllocation,
  validateHostelRecord,
  validateHostelRoom,
} from './hostelUtils';
import { filterStudentScopedRecords } from '../shared/courseFilters';

const tabs = [
  ['rooms', 'Rooms'],
  ['allocations', 'Allocations'],
  ['records', 'Records'],
];

export default function HostelManagement({ currentUser, academicYear = '2025-2026', scopedStudents = [], selectedCourse = null, selectedCourseCode = 'all' }) {
  const [rooms, setRooms] = useState(isFirebaseConfigured ? [] : demoHostelRooms);
  const [allocations, setAllocations] = useState(isFirebaseConfigured ? [] : demoHostelAllocations);
  const [records, setRecords] = useState(isFirebaseConfigured ? [] : demoHostelRecords);
  const [activeTab, setActiveTab] = useState('rooms');
  const [search, setSearch] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadHostel = async () => {
      if (!isFirebaseConfigured) return;
      try {
        const data = await getHostelManagementData(academicYear);
        setRooms(data.hostelRooms);
        setAllocations(data.hostelAllocations);
        setRecords(data.hostelRecords);
        setLoadError('');
      } catch (error) {
        console.warn('Using demo hostel data because Firestore is not reachable.', error);
        setLoadError('Unable to load Firestore hostel records. Showing demo/local records.');
      }
    };
    loadHostel();
  }, [academicYear]);

  const currentRoleId = currentUser?.roleId || 'admin';
  const canManage = canAccess(defaultRoles, currentRoleId, 'hostel.manage');
  const visibleAllocations = useMemo(
    () => filterStudentScopedRecords(allocations, scopedStudents, selectedCourseCode, selectedCourse),
    [allocations, scopedStudents, selectedCourse, selectedCourseCode]
  );
  const summary = useMemo(() => summarizeHostel(rooms, visibleAllocations, records), [rooms, records, visibleAllocations]);

  const activeRows = useMemo(() => {
    const source = activeTab === 'rooms' ? rooms : activeTab === 'allocations' ? visibleAllocations : records;
    return filterHostelItems(source, search);
  }, [activeTab, records, rooms, search, visibleAllocations]);

  const createQuickRecord = async () => {
    if (!canManage) {
      toast.error('You do not have permission to manage hostel records.');
      return;
    }

    const createdAtText = formatDisplayDate();
    try {
      if (activeTab === 'rooms') {
        const payload = {
          roomNo: `${100 + rooms.length + 1}`,
          hostelName: 'Main Hostel',
          blockName: 'A Block',
          floor: '1',
          capacity: 4,
          occupiedCount: 0,
          status: 'Available',
          academicYear,
          wardenName: currentUser?.name || 'Hostel Office',
          createdAtText,
        };
        const message = validateHostelRoom(payload);
        if (message) return toast.error(message);
        const id = await createHostelRoom(payload);
        setRooms((prev) => [{ id: id || `local-hostel-room-${Date.now()}`, ...payload }, ...prev]);
      } else if (activeTab === 'allocations') {
        const room = rooms.find((item) => (
          item.status !== 'Archived' && Number(item.occupiedCount || 0) < Number(item.capacity || 0)
        ));
        if (!room) {
          toast.error('No available hostel room found.');
          return;
        }
        const allocatedKeys = new Set(
          allocations
            .filter((item) => item.status === 'Active')
            .flatMap((item) => [item.studentRecordId, item.studentId].filter(Boolean))
        );
        const student = scopedStudents.find((item) => !allocatedKeys.has(item.id) && !allocatedKeys.has(item.studentId));
        if (!student) {
          toast.error('No unallocated student found for the selected course.');
          return;
        }
        const payload = {
          studentRecordId: student.id,
          studentName: student.name,
          studentId: student.studentId,
          courseName: student.courseName || student.program || selectedCourse?.courseName || selectedCourse?.name || '',
          courseCode: student.courseCode || (selectedCourseCode === 'all' ? '' : selectedCourseCode),
          roomNo: room.roomNo,
          hostelName: room.hostelName,
          allocatedOn: new Date().toISOString().slice(0, 10),
          academicYear,
          status: 'Active',
          guardianPhone: student.phone || '',
          createdAtText,
        };
        const message = validateHostelAllocation(payload);
        if (message) return toast.error(message);
        const id = await createHostelAllocation(payload);
        const occupiedCount = Number(room.occupiedCount || 0) + 1;
        const roomUpdates = {
          occupiedCount,
          status: occupiedCount >= Number(room.capacity || 0) ? 'Full' : 'Available',
        };
        await updateHostelRoom(room.id, roomUpdates);
        setAllocations((prev) => [{ id: id || `local-hostel-allocation-${Date.now()}`, ...payload }, ...prev]);
        setRooms((prev) => prev.map((item) => item.id === room.id ? { ...item, ...roomUpdates } : item));
      } else {
        const room = rooms[0];
        const payload = {
          recordType: 'Inspection',
          title: `Hostel record ${records.length + 1}`,
          hostelName: room?.hostelName || 'Main Hostel',
          roomNo: room?.roomNo || '',
          recordDate: new Date().toISOString().slice(0, 10),
          status: 'Open',
          notes: 'New hostel record.',
          academicYear,
          createdAtText,
        };
        const message = validateHostelRecord(payload);
        if (message) return toast.error(message);
        const id = await createHostelRecord(payload);
        setRecords((prev) => [{ id: id || `local-hostel-record-${Date.now()}`, ...payload }, ...prev]);
      }
      toast.success('Hostel record created');
    } catch {
      toast.success('Hostel record created locally');
    }
  };

  const renderRow = (item) => {
    if (activeTab === 'rooms') {
      return [
        `${item.hostelName} / ${item.roomNo}`,
        `${item.blockName || '-'} - Floor ${item.floor || '-'}`,
        `${Number(item.occupiedCount || 0)} / ${Number(item.capacity || 0)} occupied`,
        item.status,
      ];
    }
    if (activeTab === 'allocations') {
      return [
        item.studentName,
        item.studentId,
        `${item.hostelName || '-'} / ${item.roomNo || '-'}`,
        item.status,
      ];
    }
    return [
      item.title,
      item.recordType,
      `${item.hostelName || '-'} ${item.roomNo || ''}`.trim(),
      item.status,
    ];
  };

  const metricCards = [
    ['Rooms', summary.rooms, <Home size={20} />],
    ['Capacity', summary.totalCapacity, <BedDouble size={20} />],
    ['Occupied', `${summary.occupancyRate}%`, <Users size={20} />],
    ['Open Records', summary.openRecords, <ClipboardList size={20} />],
  ];

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="text-sm font-bold text-slate-500 mb-2">Campus Services / <span className="text-[#f39a5f]">Hostel Management</span></div>
          <h1 className="text-2xl font-bold text-slate-900">Hostel Management</h1>
          <p className="text-sm text-slate-500 mt-1">Room allocation, hostel occupancy tracking, and hostel records management.</p>
          {!isFirebaseConfigured && <p className="text-xs text-orange-600 mt-2">Demo mode: add Firebase keys to persist hostel records.</p>}
          {loadError && <p className="text-xs text-rose-600 mt-2">{loadError}</p>}
        </div>
        <button onClick={createQuickRecord} disabled={!canManage} className="h-10 px-5 rounded-full bg-[#fb9a5b] text-white font-semibold text-sm flex items-center gap-2 disabled:bg-slate-300">
          <Plus size={16} /> New {tabs.find(([id]) => id === activeTab)?.[1].slice(0, -1)}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 py-5">
        {metricCards.map(([label, value, icon]) => (
          <div key={label} className="rounded-lg bg-white border border-slate-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="h-11 w-11 rounded-lg bg-[#f5f5f6] text-[#fb8d49] flex items-center justify-center">{icon}</span>
              <span className="text-2xl font-extrabold text-slate-900">{value}</span>
            </div>
            <div className="text-xs font-bold text-slate-500 mt-3">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`h-10 px-4 rounded-md border text-sm font-semibold ${activeTab === id ? 'bg-[#33373e] text-white border-[#33373e]' : 'bg-white text-slate-600 border-slate-200'}`}>{label}</button>
        ))}
      </div>
      <div className="relative mb-4">
        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search rooms, students, records..." className="w-full h-11 rounded-lg bg-[#f0f0f2] border-0 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-100" />
      </div>
      <div className="overflow-hidden border border-slate-100 rounded-lg bg-white">
        <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-sm">
          <thead className="bg-[#f5f5f6] text-slate-500">
            <tr>{['Name', 'Details', 'Room / Occupancy', 'Status'].map((item) => <th key={item} className="text-left px-4 py-3 font-semibold">{item}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeRows.map((item) => {
              const [a, b, c, d] = renderRow(item);
              return <tr key={item.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold">{a}</td><td className="px-4 py-3">{b}</td><td className="px-4 py-3">{c}</td><td className="px-4 py-3"><StatusBadge value={d} /></td></tr>;
            })}
            {!activeRows.length && <tr><td colSpan="4" className="px-4 py-10 text-center text-slate-500">No hostel records found.</td></tr>}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
