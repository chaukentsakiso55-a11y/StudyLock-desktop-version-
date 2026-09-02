const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('desktop shell contains focus-lock protections', () => {
  const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  assert.match(main, /setKiosk\(focusActive\)/);
  assert.match(main, /if \(focusActive && !allowClose\)/);
  assert.match(main, /desktop:exit-blocked/);
});

test('renderer preserves every StudyLock view', () => {
  const html = fs.readFileSync(path.join(root, 'renderer', 'index.html'), 'utf8');
  for (const view of ['Focus', 'Planner', 'Tutor', 'Quiz', 'Notes', 'Progress', 'Learn', 'Rewards']) {
    assert.match(html, new RegExp('view' + view));
  }
  assert.match(html, /studyLockDesktop\.setFocusActive\(true\)/);
  assert.match(html, /studyLockDesktop\.setFocusActive\(false\)/);
});
