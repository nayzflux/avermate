# Avermate: The best average calculator known to man

## Tech Stack:

- bun
- next.js
- Hono
- Turso
- Drizzle ORM
- shadcn ui
- magic ui
- tailwind


# TODO List

## Bug Fixes
- [x] Fix "Worst subject" functionality (currently broken).
- [x] Ensure the back button is consistent across "Subjects" and "Grades".
- [x] Address the issue with the "Full Year" category in the notes tab (appears junky).
- [x] Verify and correct percentage calculations (e.g., x% lower/higher) and resolve "+infinity" issue.
- [ ] Resolve Next.js errors.
- [ ] Fix graphical bugs (paddings, inconsistencies, responsiveness, calendar, etc.).
- [x] Bug with graph animations when changing pages.
- [ ] Fix hardcoded "You received 3 new grades this week" message (recent grades section).
- [ ] Improve loading statuses, error statuses, and edge-case handling (e.g., "no items" display).
- [ ] Improve mobile responsive for grade table and modals

## Feature Enhancements
### Core Functionality
- [x] Implement a new system for "Subjects" that ignores coefficients.
- [ ] Support periods in grade management.
- [x] Allow adding grades to specific periods.
- [ ] Enable modification and deletion of grades, subjects, and periods.
- [ ] Add average calculation for specific categories (e.g., written/oral averages).
- [ ] Support category creation (update API, forms, and database accordingly).
- [ ] Display a streak score (core implementation + refer to Figma for ideas).

### User Settings & Personalization
- [ ] Allow users to change profile picture, name, first name, and email address.
- [ ] Add alternative design options (e.g., "Ferréol design"), dark/light/system mode, and ED link management in settings.

### User Experience
- [ ] Improve sign-up process:
  - [ ] Email sending on sign-up.
  - [ ] Onboarding for new users.
  - [ ] Better sign-in/sign-up experience (onboarding, email verification, 2FA).
- [ ] Add smooth transitions and animations across the app.
- [ ] Add a feedback button for user suggestions.

### Data Visualization
- [ ] Create a "Graphs" tab to visualize data across all subjects, modules, and streaks.
  - [ ] Include graphs for subjects, sub-subjects, modules, and overall averages.
- [ ] Add a table for viewing grade categories.
- [ ] Improve the display of modules, subjects, and sub-subjects on the table for better distinction.

### Insights & Objectives
- [ ] Add a dedicated tab for objectives and tips to achieve them.
- [ ] Display potential class averages.
- [ ] Explore a concept for a betting system on grades to earn points.

### Mobile App
- [ ] Develop a mobile app for the project.

### Miscellaneous
- [ ] Add an "About" section with open-source licenses, contributors, GitHub links, and support information.
- [ ] Improve display consistency with Figma designs (e.g., margins, interfaces).
- [ ] Allow users to select custom subjects for average calculation.
- [ ] Add insights, possibly leveraging AI.

## Integrations
- [ ] Improve OAuth handling (e.g., proper first name handling with Microsoft).
- [ ] Automatically detect CPE and sync grades with ED (apply default settings).
- [ ] Add ED-specific features (e.g., display comments and unique data).
- [ ] Fetch database from ED (plan the fetching strategy).

## Administrative Features
- [ ] Add an admin panel for teachers:
  - [ ] Input grades.
  - [ ] Manage school integrations (e.g., ED).
  - [ ] Display class averages and other parameters.

## Code Quality
- [ ] Refactor code:
  - [ ] Review and clean up all utility functions.
  - [ ] Ensure consistency in grade format (e.g., *100 or not).
- [ ] Begin implementing tests.

## Potential Features
- [ ] Explore adding insights with AI.
- [ ] Consider a system to display recent notifications ("You received x grades this week").
- [ ] Study feasibility of a note betting system for earning study points.

## Final Notes
- [ ] Ensure landing page consistency with the app's theme and user expectations.
- [ ] Improve error status displays and provide better handling for empty states.
