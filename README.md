# CSOAI v2 - Open-Source AI Safety Training Platform

The open-source FAA for AI. Free AI safety training, certification, and governance for everyone.

**100% Free | No Login Required | No Barriers to Entry**

## What Is This?

CSOAI provides 7 comprehensive AI safety framework courses covering every major global AI regulation. Anyone can learn AI compliance and safety at no cost.

### Available Courses

| Course | Framework | Modules | Questions |
|--------|-----------|---------|-----------|
| EU AI Act Fundamentals | EU AI Act | 7 | 70 |
| NIST AI RMF Fundamentals | NIST AI RMF | 7 | 70 |
| UK AI Safety Institute Framework | UK AI Safety | 7 | 70 |
| Canada AIDA Compliance | Canada AIDA | 7 | 70 |
| Australia AI Ethics Framework | Australia AI Ethics | 7 | 70 |
| ISO/IEC 42001 International Standard | ISO 42001 | 7 | 70 |
| China TC260 AI Framework | China TC260 | 7 | 70 |

**Total: 49 modules, 490 quiz questions, 7 global frameworks**

## Embeddable Widget

Drop the training platform into any website with one line of HTML:

```html
<iframe
  src="https://your-deployment-url/widget"
  width="100%"
  height="800"
  frameborder="0"
  style="border: none; border-radius: 12px;"
  title="AI Safety Training Courses"
></iframe>
```

The widget is white-label (no branding), tracks progress in the user's browser via localStorage, and requires zero backend configuration on the host site.

## Technology Stack

- React 19 + TypeScript 5.9
- Vite 7 for build tooling
- TailwindCSS + Radix UI for styling
- tRPC + Drizzle ORM for type-safe API
- Express backend
- Playwright for E2E testing
- Vitest for unit testing

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
components/        React UI components organized by feature
  training/        Course catalog, player, quiz components
  widget/          Embeddable white-label widget components
  certification/   Exam and certificate components
  core/            App shell, header, footer, layout
data/
  modules/         49 quiz module files (10 questions each)
  quizzes/         Quiz data loader
  courses/         Course population scripts
api/               Backend services, routes, schemas
config/            Configuration files
tests/             E2E and unit test specs
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/widget` | Embeddable course catalog (no auth, white-label) |
| `/widget/course/:id` | Embeddable course player |
| `/courses` | Full course catalog |
| `/courses/:id/learn` | Course player with quiz |

## Contributing

This is an open-source project. Contributions are welcome.

## License

Open Source - Free for everyone.

## Links

- Website: [csoai.org](https://csoai.org)
- Charter & White Papers: Available on the platform

---

*The open-source FAA for AI - because AI safety education should be accessible to all.*
