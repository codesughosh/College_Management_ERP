import assert from 'node:assert/strict';
import {
  canAccess,
  defaultRoles,
  getRoleById,
  hasPermission,
  togglePermission,
  validateUserForm,
  validateUserUpdate,
} from '../src/modules/userRoles/rolePermissions.js';

const admin = getRoleById(defaultRoles, 'admin');
const parent = getRoleById(defaultRoles, 'parent');

assert.equal(admin.name, 'Admin');
assert.equal(hasPermission(admin, 'users.create'), true);
assert.equal(hasPermission(admin, 'staff.create'), true);
assert.equal(hasPermission(parent, 'users.create'), false);
assert.equal(canAccess(defaultRoles, 'faculty', 'attendance.view'), true);
assert.equal(canAccess(defaultRoles, 'faculty', 'staff.attendance'), true);
assert.equal(canAccess(defaultRoles, 'faculty', 'attendance.markStudents'), true);
assert.equal(canAccess(defaultRoles, 'admin', 'attendance.notifyParents'), true);
assert.equal(canAccess(defaultRoles, 'admin', 'timetable.publish'), true);
assert.equal(canAccess(defaultRoles, 'faculty', 'timetable.create'), false);
assert.equal(canAccess(defaultRoles, 'admin', 'exams.reportCards'), true);
assert.equal(canAccess(defaultRoles, 'faculty', 'exams.marks'), true);
assert.equal(canAccess(defaultRoles, 'faculty', 'exams.results'), false);
assert.equal(canAccess(defaultRoles, 'parent', 'exams.view'), false);
assert.equal(canAccess(defaultRoles, 'parent', 'attendance.view'), false);
assert.equal(canAccess(defaultRoles, 'parent', 'fees.view'), false);

const withoutUsersCreate = togglePermission(admin, 'users.create');
assert.equal(withoutUsersCreate.includes('users.create'), false);
const withUsersCreate = togglePermission({ ...admin, permissions: withoutUsersCreate }, 'users.create');
assert.equal(withUsersCreate.includes('users.create'), true);

assert.equal(validateUserForm({}), 'Name is required.');
assert.equal(
  validateUserForm({
    name: 'Admin',
    email: 'bad',
    password: '123456',
    roleId: 'admin',
  }),
  'Valid email is required.'
);
assert.equal(
  validateUserForm({
    name: 'Admin',
    email: 'admin@college.edu',
    password: '123',
    roleId: 'admin',
  }),
  'Password must be at least 6 characters.'
);
assert.equal(
  validateUserForm({
    name: 'Admin',
    email: 'admin@college.edu',
    password: '123456',
    roleId: 'admin',
  }),
  ''
);

assert.equal(validateUserUpdate({ name: 'Admin', roleId: 'admin', status: 'Active' }), '');
assert.equal(validateUserUpdate({ name: 'Admin', roleId: '', status: 'Active' }), 'Role is required.');

console.log('User role tests passed.');

