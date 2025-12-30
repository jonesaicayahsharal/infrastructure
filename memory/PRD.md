# Jonesaica Infrastructure Solutions - PRD

## Original Problem Statement
Build a functional website like enersavesolutions.com and rezyntech.com for Jonesaica Infrastructure Solutions - a solar energy and building services company in Jamaica. Company located in Greenwood/Lilliput District, St. James, serving Trelawny, St. James borders, and island-wide.

## User Personas
1. **Homeowners** - Looking for solar installation to reduce electricity costs
2. **Business Owners** - Seeking commercial solar and electrical solutions
3. **Property Developers** - Need comprehensive building services (electrical, plumbing, carpentry)
4. **Farmers/Rural Residents** - Looking for animal shelters, pens, and solar solutions

## Core Requirements (Static)
- Solar products e-commerce (Snipcart integration)
- Customer lead capture popup on first visit
- Contact form with Jamaica parish/district selection
- Quote request system for products and services
- Service pages: Solar, Electrical, Carpentry, Plumbing
- Competitive pricing (slightly under Enersave)
- Colors: Royal blues, purples, gold

## What's Been Implemented (December 30, 2025)

### Backend (FastAPI)
- ✅ Products API with categories (inverters, batteries, panels)
- ✅ Leads collection API
- ✅ Quote requests API
- ✅ Product seeding with 15 products

### Frontend (React)
- ✅ Homepage with hero, services overview, featured products
- ✅ Products page with category filtering
- ✅ Product detail page with Snipcart integration
- ✅ Contact page with form
- ✅ Quote request page
- ✅ About page
- ✅ Service pages (Solar, Electrical, Carpentry, Plumbing)
- ✅ Customer capture modal (5-second delay on first visit)
- ✅ Responsive design with royal blue/gold color scheme
- ✅ Snipcart e-commerce integration (JMD currency)

### Products Seeded (15 items)
- 4 Inverters (Deye 6kW, 8kW, 10kW, 12kW)
- 9 Batteries (BSL and Deye variants, 5kWh - 16kWh)
- 2 Solar Panels (450W and 545W SunPower Maxeon)

## Prioritized Backlog

### P0 (Critical - Not Yet Done)
- None - MVP is complete

### P1 (High Priority - Next Phase)
- Email notifications for leads/quotes (requires Proton email setup)
- Admin dashboard for managing products, leads, quotes
- Product images - currently using Pexels placeholders

### P2 (Medium Priority)
- Logo design and integration
- WhatsApp chat integration
- Customer testimonials/reviews system
- Google Maps integration for service area
- SEO optimization

### P3 (Nice to Have)
- Blog/news section
- Solar calculator tool
- Customer portal for order tracking
- Email marketing integration

## Next Tasks
1. Set up Proton email and configure email notifications
2. Upload actual product images
3. Create company logo
4. Add admin authentication and dashboard
5. Configure custom domain (solar.yasharal)
