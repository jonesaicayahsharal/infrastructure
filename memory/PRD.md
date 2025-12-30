# Jonesaica Infrastructure Solutions - PRD

## Original Problem Statement
Build a functional e-commerce and service website for Jonesaica Infrastructure Solutions (solar/infrastructure company in Jamaica). Key requirements:
- Royal blue, purple, gold color scheme only
- Popup shows IMMEDIATELY on site open
- NO "licensed/insured/certified" language
- NO images of white people
- Carpentry = roof prep, slab work, ceiling beams, animal pens, door jams (NOT patios/gazebos)
- Snipcart e-commerce with JMD currency
- GitHub/Netlify compatible

## User Personas
1. **Homeowners** - Looking for solar installation, electrical, plumbing, carpentry
2. **Farmers/Rural Residents** - Animal pens, shelters, solar solutions
3. **Business Owners** - Commercial solar and electrical solutions

## Core Requirements (Static)
- Lead capture popup on first visit (immediate)
- Product catalog with Snipcart integration
- Contact/Quote forms with parish/district selection
- Service pages: Solar, Electrical, Carpentry, Plumbing
- Phone: +1-876-842-2916
- Location: Greenwood/Lilliput, St. James

## What's Been Implemented (December 30, 2025)

### Backend (FastAPI)
- ✅ Products API with 15 products (4 inverters, 9 batteries, 2 panels)
- ✅ Leads collection API (popup + contact forms)
- ✅ Quote requests API
- ✅ Product seeding with competitive JMD pricing

### Frontend (React)
- ✅ Immediate lead capture popup on first visit
- ✅ Royal blue/gold color scheme
- ✅ Products page with category filters
- ✅ Snipcart e-commerce integration (JMD currency)
- ✅ All service pages with corrected content
- ✅ Carpentry page: roof prep, ceiling beams, animal pens, door jams
- ✅ NO "licensed/insured/certified" language
- ✅ GitHub/Netlify compatible structure

### Products (15 items)
- 4 Inverters: Deye 6kW, 8kW, 10kW, 12kW
- 9 Batteries: BSL 5kWh, 10kWh, Li-Pro 10.24kWh; Deye 5.12kWh, 10.24kWh, 12kWh, 16kWh
- 2 Panels: SunPower Maxeon 450W, 545W Bifacial

## Prioritized Backlog

### P0 (Critical - Complete)
- ✅ All MVP features implemented

### P1 (Next Phase)
- Email notifications for leads/quotes (requires email setup)
- Admin dashboard
- Custom product images (currently using stock photos)

### P2 (Medium Priority)
- Logo design
- WhatsApp chat integration
- Google Maps integration

## File Structure for Editing

See /app/README.md for complete editing guide including:
- How to change colors
- How to change products/prices
- How to change contact info
- How to deploy to GitHub/Netlify
