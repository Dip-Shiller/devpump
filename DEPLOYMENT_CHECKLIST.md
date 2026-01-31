# Pre-Deployment Checklist

## Database Setup (CRITICAL)

- [ ] **Schema Deployment**
  - [ ] Copy entire `lib/schema.sql` to Supabase SQL Editor
  - [ ] Verify all tables created without errors
  - [ ] Check RLS policies are enabled
  - [ ] Verify indexes are created
  - [ ] Test with sample data insertion

- [ ] **Data Migration** (if upgrading existing database)
  - [ ] Backup existing database
  - [ ] Run schema incrementally (new tables only)
  - [ ] Verify existing data integrity
  - [ ] Test foreign key relationships

## Backend Verification

- [ ] **API Routes**
  - [ ] Test `/api/collabs` (GET/POST)
  - [ ] Test `/api/group-chats` (GET/POST)
  - [ ] Test `/api/profile-photos` (GET/POST)
  - [ ] Test `/api/profile-updates` (GET/POST)
  - [ ] Verify error responses
  - [ ] Check rate limiting (if implemented)

- [ ] **Database Functions**
  - [ ] All CRUD functions in `lib/db.ts` work
  - [ ] Error handling working correctly
  - [ ] No console errors in API responses

- [ ] **Environment Variables**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` set
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` set (server-side only)

## Frontend Verification

- [ ] **No Build Errors**
  - [ ] `npm run build` completes successfully
  - [ ] No TypeScript errors
  - [ ] No warnings about imports

- [ ] **Components Render**
  - [ ] Navigate to `/collabs`
  - [ ] Navigate to `/group-chats`
  - [ ] Navigate to `/feed/daily-updates`
  - [ ] Open `/profile` → Photos tab
  - [ ] Open `/profile` → Daily Updates tab
  - [ ] Verify no blank screens

- [ ] **Navigation Works**
  - [ ] Sidebar shows new items
  - [ ] All sidebar links work
  - [ ] Back/forward navigation works
  - [ ] Mobile menu works

## Feature Testing

### Collabs
- [ ] Can add collab request from builder card
- [ ] Collab request appears in `/collabs` → Requests tab
- [ ] Can accept/decline request
- [ ] Accepted collabs appear in Active tab
- [ ] Cannot add duplicate collab

### Group Chats
- [ ] Can create new group
- [ ] Group appears in list
- [ ] Can add members to group
- [ ] Can send message in group
- [ ] Messages persist after refresh

### Photos
- [ ] Can upload photo by URL
- [ ] Photo appears in gallery
- [ ] Can set primary photo
- [ ] Can delete photo
- [ ] Gallery displays correctly on mobile

### Daily Updates
- [ ] Can post update from profile
- [ ] Update appears in personal list
- [ ] Update appears in public feed
- [ ] Can delete own update
- [ ] Can like/unlike updates
- [ ] Visibility settings work
- [ ] Pagination works on feed

## Mobile Testing

- [ ] **Responsive Design**
  - [ ] All pages display correctly on mobile
  - [ ] No horizontal scrolling
  - [ ] Buttons are touch-friendly
  - [ ] Images scale properly
  - [ ] Navigation is accessible

- [ ] **Performance**
  - [ ] Pages load quickly
  - [ ] No lag when scrolling
  - [ ] No memory leaks
  - [ ] Battery drain is acceptable

## Security Testing

- [ ] **Authentication**
  - [ ] Logged out users redirected appropriately
  - [ ] Cannot access features without login
  - [ ] Session tokens are secure

- [ ] **Authorization**
  - [ ] Users can only see their own collabs
  - [ ] Users can only see groups they're in
  - [ ] Users can only delete their own updates
  - [ ] Cannot modify other users' data

- [ ] **Data Privacy**
  - [ ] Private updates aren't visible publicly
  - [ ] Collab-only updates work correctly
  - [ ] RLS policies enforced in database

## Performance Testing

- [ ] **Load Times**
  - [ ] Pages load in < 2 seconds
  - [ ] API responses < 500ms
  - [ ] Feed pagination responsive

- [ ] **Resource Usage**
  - [ ] No memory leaks
  - [ ] Reasonable bundle size
  - [ ] Efficient database queries

## Error Handling

- [ ] **Network Errors**
  - [ ] Offline mode handled gracefully
  - [ ] Retry logic works
  - [ ] Error messages are helpful

- [ ] **Validation Errors**
  - [ ] Empty inputs handled
  - [ ] Invalid URLs handled
  - [ ] Long content truncated appropriately

- [ ] **Edge Cases**
  - [ ] Concurrent operations work
  - [ ] Rapid clicking doesn't cause issues
  - [ ] Fast network/slow network both work

## Browser Compatibility

- [ ] **Chrome** - Latest version
- [ ] **Firefox** - Latest version
- [ ] **Safari** - Latest version
- [ ] **Edge** - Latest version
- [ ] **Mobile Chrome** - Latest version
- [ ] **Mobile Safari** - Latest version

## Accessibility

- [ ] **Keyboard Navigation**
  - [ ] Can navigate with Tab key
  - [ ] Can submit forms with Enter
  - [ ] Can access all buttons

- [ ] **Screen Readers**
  - [ ] ARIA labels present
  - [ ] Images have alt text
  - [ ] Semantic HTML used

- [ ] **Color Contrast**
  - [ ] Text meets WCAG AA standards
  - [ ] Not dependent on color alone

## Documentation

- [ ] **Code Comments**
  - [ ] Complex functions documented
  - [ ] Props documented in components
  - [ ] API endpoints documented

- [ ] **User Guides**
  - [ ] NEW_FEATURES_IMPLEMENTATION.md exists
  - [ ] SETUP_NEW_FEATURES.md exists
  - [ ] FEATURE_INTEGRATION_MAP.md exists
  - [ ] EXTENSION_GUIDE.md exists

- [ ] **Deployment**
  - [ ] SETUP_NEW_FEATURES.md has clear steps
  - [ ] Troubleshooting section complete
  - [ ] Next steps documented

## Monitoring & Analytics

- [ ] **Error Tracking**
  - [ ] Error logging configured
  - [ ] Critical errors alerted

- [ ] **Performance Monitoring**
  - [ ] Page load times tracked
  - [ ] API performance monitored
  - [ ] Database queries logged

- [ ] **User Analytics**
  - [ ] Feature usage tracked
  - [ ] User funnels defined
  - [ ] Important events logged

## Team Communication

- [ ] **Notify Team**
  - [ ] Alert other developers
  - [ ] Update internal docs
  - [ ] Share release notes

- [ ] **Support Readiness**
  - [ ] Support team briefed
  - [ ] FAQ prepared
  - [ ] Known issues documented

## Staging Environment

- [ ] **Full Testing in Staging**
  - [ ] Run all tests
  - [ ] Have team test
  - [ ] Load test if applicable
  - [ ] Verify monitoring works

- [ ] **Staging Approval**
  - [ ] Product team approves
  - [ ] QA approves
  - [ ] Security approves
  - [ ] Performance approves

## Production Deployment

- [ ] **Pre-Deployment**
  - [ ] Database backed up
  - [ ] Current version tagged in git
  - [ ] Rollback plan documented
  - [ ] On-call person identified

- [ ] **During Deployment**
  - [ ] Monitor error rates
  - [ ] Monitor performance
  - [ ] Check user reports
  - [ ] Have rollback ready

- [ ] **Post-Deployment**
  - [ ] Verify all features work
  - [ ] Check error logs
  - [ ] Check performance metrics
  - [ ] Announce to users

## Post-Launch

- [ ] **Day 1-3**
  - [ ] Daily monitoring
  - [ ] Quick-fix any issues
  - [ ] Gather user feedback

- [ ] **Week 1**
  - [ ] Feature usage analysis
  - [ ] Performance analysis
  - [ ] Plan any improvements

- [ ] **Month 1**
  - [ ] Full retrospective
  - [ ] Lessons learned
  - [ ] Plan next features

---

## Deployment Commands

```bash
# Build for production
npm run build

# Run tests
npm run test

# Deploy to staging
git push staging main

# Deploy to production
git push production main
```

## Rollback Procedure

```bash
# If something goes wrong:
git revert [commit-hash]
npm run build
# Redeploy from previous version
```

## Quick Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Permission denied" | Check RLS policies, verify auth |
| "Column not found" | Run schema SQL again |
| "User can't see data" | Verify RLS policy |
| "API 500 error" | Check console logs, verify route exists |
| "Component blank" | Check useWallet() context, verify auth |

---

## Sign Off

- [ ] Product Manager Approval: _______________
- [ ] Tech Lead Approval: _______________
- [ ] QA Lead Approval: _______________
- [ ] DevOps Approval: _______________
- [ ] Security Approval: _______________

---

## Go/No-Go Decision

**Status:** ☐ GO ☐ NO-GO

**Decision made by:** _______________

**Date:** _______________

**Notes:** _______________________________________________________________

---

**All items must be checked before proceeding to production.**
