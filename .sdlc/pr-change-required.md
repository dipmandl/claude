# PR Change Required — CS-50

**PR:** https://github.com/dipmandl/claude/pull/3  
**Generated:** 2026-08-19

---

## NEEDS_CODE_CHANGE

### PR-COMMENT-001 — No delete confirmation
**File:** `product_release_dashboard/script.js` line 81  
**Issue:** `deleteRelease` calls `releases.filter` immediately on click. Because `saveReleases` overwrites localStorage right after, an accidental tap is unrecoverable. There is no `window.confirm()` or any other guard.  
**Fix:**
```js
function deleteRelease(id) {
  if (!window.confirm('Delete this release note? This cannot be undone.')) return;
  if (editingId === id) cancelEdit();
  releases = releases.filter(r => r.id !== id);
  saveReleases(releases);
  renderReleaseList();
}
```

---

### PR-COMMENT-002 — No visual indicator on card being edited
**File:** `product_release_dashboard/script.js` line 154  
**Issue:** When `editingId` is set, the form switches to Edit mode but the corresponding release card in the list has no visual distinction. Users who scroll down lose track of which card is open.  
**Fix — in `renderReleaseList`:**
```js
const editBtn = card.querySelector('.btn-edit');
const deleteBtn = card.querySelector('.btn-delete');
if (release.id === editingId) {
  card.classList.add('editing');
  editBtn.disabled = true;
}
```
**Fix — in `styles.css`:**
```css
.release-card.editing {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

## COMMENT_ONLY_RESOLUTION

### PR-COMMENT-003 — scrollIntoView / focus() ordering
**File:** `product_release_dashboard/script.js` lines 103–104  
**Issue:** `focus()` triggers its own instant scroll, which races with the smooth animation started by `scrollIntoView` in Firefox.  
**Resolution:** Reply on the inline comment confirming the `requestAnimationFrame` fix is deferred (or apply it in IMPLEMENTATION).

---

### PR-COMMENT-004 — .btn-cancel:hover CSS comment
**File:** `product_release_dashboard/styles.css` line 294  
**Issue:** `filter: none; transform: none` silently overrides base `button:hover` effects. Future maintainers may not realise these overrides exist.  
**Resolution:** Reply on the inline comment confirming a code comment will be added (or apply it in IMPLEMENTATION).

---

## How to respond

Reply with your resolution selection in this exact format:

```
resolve-with-dev: PR-COMMENT-001,PR-COMMENT-002
resolve-comments-only: PR-COMMENT-003,PR-COMMENT-004
```

- `resolve-with-dev` IDs → handled by the IMPLEMENTATION agent (code changes)
- `resolve-comments-only` IDs → PR comment replies only, no code change needed
