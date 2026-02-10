# CSGA Platform Source - File Index

## Quick Reference Guide

### Total Statistics
- **Total Files Organized:** 540
- **Directory Size:** 490 MB
- **Original Source:** 655 files (flat structure)
- **Organization Method:** Hierarchical, feature-based organization

---

## Directory Index

### Root Level
| File | Purpose |
|------|---------|
| `README.md` | Project overview and technology stack |
| `ORGANIZATION_NOTES.txt` | Detailed organization documentation |
| `FILE_INDEX.md` | This file - quick reference guide |

### /api (34 files)
Backend services and API definitions

**Subdirectories:**
- `routes/` - API endpoint routing
- `services/` - Business logic services
  - Certificate operations
  - Exam and quiz management
  - Course progress tracking
  - Lesson management
  - Module ratings
  - Email services
- `schema/` - Data validation schemas

### /components (167 files)
React UI components organized by feature

**Subdirectories:**

| Folder | Files | Purpose |
|--------|-------|---------|
| `core/` | 8 | Application shell (App, Header, Footer, Layout) |
| `pages/` | 20 | Full-page components (Home, About, Blog, etc.) |
| `auth/` | 7 | Authentication & login flows |
| `training/` | 18 | Course delivery & learning components |
| `certification/` | 17 | Exam & certificate management |
| `casa/` | 7 | CASA certification specific features |
| `council/` | 26 | Byzantine consensus & governance |
| `compliance/` | 4 | Regulatory compliance tools |
| `watchdog/` | 13 | AI safety incident tracking |
| `governance/` | 11 | PDCA cycles, risk assessment, charter |
| `ai-systems/` | 1 | AI systems management |
| `tools/` | 6 | Analytics, reporting, dashboards |
| `payments/` | 7 | Payment processing |
| `notifications/` | 6 | Notification system |
| `community/` | 7 | User interaction & feedback |
| `ui/` | 9 | Reusable UI utilities |
| `legal/` | 0 | Reserved for legal components |

### /data (32 files)
Content and configuration data

**Subdirectories:**
- `modules/` (29 files) - Training module content
  - `eu-ai-act-module-*.ts` - EU AI Act regulations
  - `uk-ai-safety-module-*.ts` - UK AI Safety Institute
  - `canada-aida-module-*.ts` - Canada AIDA regulations
  - `china-tc260-module-*.ts` - China TC260 standards
  - `australia-ai-ethics-module-*.ts` - Australia AI Ethics
  
- `courses/` (3 files) - Course definitions
  - Course structure and metadata
  - Course population scripts

### /docs (99 files)
Documentation files

Contains:
- API documentation
- Component documentation
- Architecture guides
- Setup instructions
- Feature guides

### /config (21 files)
Configuration files

Includes:
- JSON configuration files
- YAML configs
- Shell scripts
- MJS module configs

### /assets (114 files)
Static resources

Contains:
- Images (PNG, JPG)
- Stylesheets (CSS)
- Documents (HTML, PDF)
- Data files (CSV)

### /tests (68 files)
Test suites

Includes:
- Cypress E2E tests (*.spec.ts)
- Jest unit tests (*.test.ts)
- Test fixtures and mocks

Test coverage areas:
- Homepage & website audit
- Training journey
- Watchdog analyst flow
- Signup flow
- Certification flow
- Coupon validation
- Authentication
- API health
- Component visual regression

### /scripts (3 files)
Utility scripts

Contains:
- Python automation scripts
- Database population scripts
- Data processing utilities

---

## Component Organization Strategy

### By Feature Domain
Components are organized using a **feature-based structure** rather than a technical layer structure. This makes it easier to locate all related components for a feature.

### Example: Training Feature
```
components/training/
├── Training.tsx              # Main training hub
├── Training-v2.tsx           # Version 2 variant
├── Courses.tsx               # Course listing
├── CourseDetail.tsx          # Individual course view
├── CoursePlayer.tsx          # Lesson playback
├── CourseDiscussion.tsx      # Discussion threads
├── Quiz.tsx                  # Quiz component
├── ModuleCard.tsx            # Module display
├── ModuleProgressIndicator.tsx
├── ModuleRatingCard.tsx
├── ProgressDashboard.tsx
└── ...
```

### Scaling Recommendations
As the project grows:
1. Split large component folders into sub-features
2. Create shared utility components in `components/ui/`
3. Use absolute imports for cleaner code

---

## Key Features & Locations

### Training & Learning
- **Location:** `components/training/`
- **Files:** 18 components
- **Features:** Courses, lessons, quizzes, progress tracking

### Certification
- **Location:** `components/certification/`
- **Files:** 17 components
- **Features:** Exams, credentials, verification, QR codes

### Council & Governance
- **Location:** `components/council/`
- **Files:** 26 components
- **Features:** Byzantine consensus, voting, member management

### Watchdog Program
- **Location:** `components/watchdog/`
- **Files:** 13 components
- **Features:** Incident reporting, analysis, remediation

### CASA Certification
- **Location:** `components/casa/`
- **Files:** 7 components
- **Features:** CASA-specific content and dashboards

### Compliance Framework
- **Locations:** 
  - `components/compliance/` - Rules & compliance tools
  - `components/governance/` - PDCA framework & charter
  - `data/modules/` - Regional compliance content
- **Features:** Multi-jurisdiction compliance (EU, UK, Canada, China, Australia)

---

## File Type Summary

| Type | Count | Location |
|------|-------|----------|
| React Components (.tsx) | ~180 | components/ |
| TypeScript (.ts) | ~130 | api/, data/, scripts/ |
| Documentation (.md) | 99 | docs/ |
| Tests (.spec.ts, .test.ts) | 68 | tests/ |
| Assets (.png, .jpg, .css, etc.) | 114 | assets/ |
| Configuration | 21 | config/ |
| Python Scripts | 3 | scripts/ |

---

## Getting Started

1. **Understand the structure:** Review `ORGANIZATION_NOTES.txt`
2. **Read the README:** Start with `README.md`
3. **Explore documentation:** Browse `docs/` for guides
4. **Review specific features:** Navigate to the relevant `components/` subfolder
5. **Check tests:** Review test cases in `tests/` for usage examples

---

## Important Notes

- Original source files remain in `/sessions/exciting-optimistic-tesla/csoai_source/` (unchanged)
- All files in organized location are **copies** (not moves)
- Some files may be organized into `components/ui/` if naming doesn't fit other categories
- The `components/legal/` folder is reserved but currently empty
- 116 files from the original 655 may require manual review and re-categorization

---

*Last Updated: February 9, 2026*
