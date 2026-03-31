# Audit Iteration 1

## Test Results: 134 passed, 10 failed

## Failures Analysis

### 1. Heading text ambiguity (4 failures)
- `Dashboard`, `Subscriptions`, `Negotiations`, `Settings` headings resolve to multiple elements (sidebar nav + page heading)
- **Root cause:** Page objects use `getByText('Dashboard')` which matches both sidebar nav item and h1 heading
- **Fix:** Update page objects to use `getByRole('heading')` for page titles

### 2. Action Queue tab switching (2 failures)
- In Progress tab click doesn't show expected items
- **Root cause:** Tab content may not be rendering action items for in-progress state

### 3. Settings "Change" button ambiguity (1 failure)
- Multiple "Change" buttons on settings page
- **Fix:** Scope to savings destination section

### 4. Subscriptions filter (1 failure)
- Category filter doesn't reduce visible rows (using hardcoded data)
- **Fix:** Implement client-side filtering in subscriptions page

### 5. Mobile responsive (2 failures)
- Mobile viewport still shows sidebar + heading ambiguity
- **Fix:** Ensure sidebar is hidden on mobile and headings are unique selectors
