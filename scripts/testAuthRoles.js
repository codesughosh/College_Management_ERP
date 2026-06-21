import assert from 'node:assert/strict';
import { getFallbackRoleId } from '../src/firebase/demoRoles.js';

assert.equal(getFallbackRoleId('superadmin@college.edu'), 'super-admin');
assert.equal(getFallbackRoleId('admin@college.edu'), 'admin');
assert.equal(getFallbackRoleId('faculty@college.edu'), 'faculty');
assert.equal(getFallbackRoleId('parent.vivek@example.com'), 'parent');
assert.equal(getFallbackRoleId('unknown@example.com'), 'parent');

console.log('Auth role fallback tests passed.');
