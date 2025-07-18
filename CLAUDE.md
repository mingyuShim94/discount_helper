# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

할인도우미 (Discount Helper) is a Korean web application that helps users find optimal discount methods for convenience stores and cafes. Built with Next.js 15, React 19, and TypeScript, it provides real-time discount calculations and store information.

Official domain: https://halindoumi.com

## Development Commands

**Development:**
```bash
npm run dev          # Start development server with Turbopack
```

**Build & Deploy:**
```bash
npm run build        # Production build for Cloudflare Pages
npm start           # Start production server
```

**Code Quality:**
```bash
npm run lint        # ESLint code checking
```

## Tech Stack & Architecture

**Frontend:**
- Next.js 15.1.7 with App Router
- React 19.0.0 
- TypeScript 5
- Tailwind CSS 4
- ShadCN UI + Radix UI components
- Lucide React icons

**Key Patterns:**
- Static data-driven architecture (no database)
- Real-time discount calculation logic
- SEO-optimized with auto-generated sitemap/robots.txt
- Mobile-first responsive design
- Google AdSense integration

## Critical Development Rules

**Package Management:**
- Always use `npm` (never yarn/pnpm)

**Next.js Development:**
- Use App Router exclusively (not Pages Router)
- Prefer Route Handlers for API endpoints over Server Actions
- Use Server Actions only for simple form submissions

**UI Components:**
- Always use ShadCN UI components first
- Check component existence in `/components/ui/` before installing
- Install with: `npx shadcn@latest add [component-name]` (NOT shadcn-ui@latest)
- Use Lucide React for all icons: `import { IconName } from "lucide-react"`

**TypeScript:**
- Use 'I' prefix for all interfaces (e.g., `IStore`, `IDiscount`)
- Maintain strict type safety throughout

**Documentation:**
- Update `docs/UI.md` with ASCII diagrams whenever UI structure changes
- Include clear component comments with purpose and functionality

## Project Structure

```
app/                    # Next.js App Router pages
├── store/[id]/         # Dynamic store detail pages
├── tips/              # Discount tips pages
├── contact/           # Contact page
├── sitemap.ts         # Auto-generated sitemap
└── robots.ts          # SEO robots.txt

components/
├── discount/          # Discount calculation components
├── store/             # Store-related components  
├── ui/                # ShadCN UI components
├── ads/               # AdSense components
└── analytics/         # Analytics components

lib/data/              # Static store and discount data
utils/                 # Discount calculation logic
types/                 # TypeScript type definitions
hooks/                 # React custom hooks
docs/                  # Project documentation with UI diagrams
```

## Core Domain Models

**Store Types:**
- Convenience stores: GS25, CU, 세븐일레븐, 이마트24
- Cafes: 메가커피, 컴포즈커피, etc.

**Discount Types:**
- Payment: 네이버페이, 카카오페이
- Membership: SKT, KT, LG carrier memberships
- Cards: Credit card discounts, point accumulation
- Cashback vs instant discount logic

## Key Features

1. **Store Information System** - Category-based store grid, search/filtering, favorites
2. **Discount Calculator** - Real-time calculation, optimal discount suggestions, time-based discounts
3. **SEO Optimization** - Auto-sitemap generation, OpenGraph metadata, mobile optimization
4. **Monetization** - Google AdSense with native grid placement

## Important Files

- `utils/discountCalculator.ts` - Core discount calculation logic
- `lib/data/` - Static store and discount policy data
- `app/sitemap.ts` - SEO sitemap auto-generation
- `docs/UI.md` - UI structure documentation (keep updated)
- `.cursorrules` - Detailed coding standards and project rules