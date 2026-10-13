-- ==============================================================================
-- JUANET.cloud — Database Seed Script
-- File: supabase/seed.sql
-- Seeds the 12 verified service catalog items and public site settings.
-- No fake testimonials, fake client metrics, or fabricated projects are included.
-- ==============================================================================

-- 1. Seed Site Settings
INSERT INTO public.site_settings (setting_key, public_value)
VALUES 
(
    'business_profile',
    '{
        "brand_name": "JUANET.cloud",
        "primary_domain": "https://juanet.cloud",
        "tagline": "Know the Internet. Build What''s Next.",
        "brand_meaning": "From the Swahili concept of ''knowing'' (Kujua) the internet — understanding, navigating, and building modern digital infrastructure with confidence.",
        "operating_region": "Kenya & International Clients",
        "status": "active"
    }'::jsonb
),
(
    'services_config',
    '{
        "total_categories": 12,
        "consultations_enabled": true,
        "quotations_enabled": true
    }'::jsonb
)
ON CONFLICT (setting_key) DO UPDATE
SET public_value = EXCLUDED.public_value, updated_at = now();

-- 2. Seed 12 Canonical Services
INSERT INTO public.services (
    id, slug, name, headline, category, icon_key, short_description, full_description,
    problems_solved, deliverables, suitable_use_cases, process_steps, faqs, related_services,
    is_published, display_order
)
VALUES
(
    'srv-01',
    'web-development',
    'Web Development',
    'High-Performance Websites and Modern Web Applications Built for Growth',
    'Engineering & Development',
    'Globe',
    'Modern, responsive business websites, landing pages, and interactive web applications designed for speed, security, and measurable conversion.',
    'We architect and engineer modern web platforms tailored to your business objectives. From sleek corporate web presences and marketing landing pages to full-stack web applications, our engineering focuses on responsive performance, clean code, accessibility, and smooth search engine visibility across every device.',
    '["Outdated, slow-loading websites that drive prospective clients away", "Inflexible legacy templates that are difficult to update and maintain", "Poor mobile experiences that fail on smartphones and tablets", "Inadequate technical SEO causing low organic search discoverability", "Insecure platforms vulnerable to data breaches or regular downtime"]'::jsonb,
    '[{"title": "Custom Business Websites", "description": "Clean, brand-aligned websites crafted with modern semantic code and lightning-fast load times."}, {"title": "High-Converting Landing Pages", "description": "Targeted single-page funnels optimized for lead capture, marketing campaigns, and product announcements."}, {"title": "Custom Web Applications", "description": "Interactive client portals, internal tools, and database-driven web platforms."}, {"title": "Website Redesigns & Migrations", "description": "Modernizing outdated tech stacks with zero data loss and seamless SEO migration preservation."}, {"title": "API & 3rd-Party Integrations", "description": "Connecting payment gateways, CRM systems, analytics, and messaging channels."}]'::jsonb,
    '["Enterprises and SMEs establishing a professional online presence", "Startups needing a high-impact launch landing page or web MVP", "Organizations replacing insecure or difficult-to-maintain WordPress installations", "Professional services needing client acquisition and service portfolio hubs"]'::jsonb,
    '[{"title": "1. Architecture & Wireframing", "description": "Reviewing goals, user journeys, content structures, and site map."}, {"title": "2. UI Design & Prototype", "description": "Creating responsive visual layouts that embody brand standards."}, {"title": "3. Full-Stack Engineering", "description": "Building with modern component frameworks, TypeScript, and clean CSS."}, {"title": "4. QA, SEO & Production Launch", "description": "Testing cross-browser compatibility, accessibility, security, and zero-downtime deployment."}]'::jsonb,
    '[{"question": "How long does a typical website development project take?", "answer": "Timelines vary by scope. Focused landing pages typically take 2–3 weeks, while comprehensive corporate platforms and custom web applications range from 4–8 weeks."}, {"question": "Can I manage content after the website launches?", "answer": "Yes. We configure intuitive content management tools so your team can easily publish updates without technical expertise."}, {"question": "Are websites mobile-friendly and search-engine optimized?", "answer": "Every website we deliver is fully responsive across mobile, tablet, and desktop viewports, and built adhering to modern semantic HTML and Core Web Vitals benchmarks."}]'::jsonb,
    '["branding", "ecommerce", "hosting-domains-email", "digital-marketing-seo"]'::jsonb,
    true,
    1
),
(
    'srv-02',
    'graphic-design',
    'Graphic Design',
    'Visual Assets and Marketing Collateral That Make an Impact',
    'Design & Creative',
    'Palette',
    'High-resolution marketing graphics, digital campaign assets, print collateral, and social media creative tailored to your brand voice.',
    'Effective graphic design translates complex ideas into immediate visual clarity. We produce professional digital and print media assets that strengthen your communications across marketing campaigns, exhibitions, publications, and client presentations.',
    '["Inconsistent visual styling across marketing materials and social channels", "Low-resolution graphics that diminish professional credibility", "Difficulty conveying complex technical or product features visually", "Lack of ready-to-use print collateral for meetings, conferences, or retail"]'::jsonb,
    '[{"title": "Digital Marketing Assets", "description": "Ad banners, social media design systems, and digital display assets."}, {"title": "Print & Corporate Collateral", "description": "Brochures, company profiles, flyers, business cards, and event banners."}, {"title": "Presentations & Pitch Decks", "description": "Clear, compelling visual decks tailored for prospective investors and enterprise clients."}, {"title": "Infographics & Technical Diagrams", "description": "Visualizing data, workflows, and service architectures into digestible formats."}]'::jsonb,
    '["Companies preparing for product launches, conferences, or trade exhibitions", "Organizations publishing annual reports, whitepapers, or stakeholder brochures", "Brands executing multi-channel digital advertising campaigns"]'::jsonb,
    '[{"title": "1. Creative Brief", "description": "Clarifying the campaign objectives, visual specifications, and target audience."}, {"title": "2. Concept Exploration", "description": "Presenting distinct creative directions and layout compositions."}, {"title": "3. Production & Revisions", "description": "Refining typography, imagery, and visual balance based on client feedback."}, {"title": "4. Asset Delivery", "description": "Providing production-ready vector files, print PDFs, and web-optimized exports."}]'::jsonb,
    '[{"question": "What file formats do you deliver?", "answer": "We supply high-resolution source vector files (AI, EPS, SVG) as well as print-ready press PDFs and web-optimized raster formats."}, {"question": "Can you work within our existing brand guidelines?", "answer": "Yes. We strictly respect your existing color palettes, typography rules, and brand manuals, ensuring 100% cohesion."}]'::jsonb,
    '["branding", "digital-marketing-seo", "web-development"]'::jsonb,
    true,
    2
),
(
    'srv-03',
    'branding',
    'Branding & Logo Design',
    'Memorable Identity Systems and Strategic Visual Direction',
    'Design & Creative',
    'Sparkles',
    'Complete brand identity systems, logo design, color palettes, typography scales, and brand guidelines that set you apart.',
    'Your brand is the foundation of every client interaction. We craft cohesive visual identity systems that communicate your values with authority and clarity. From versatile logomarks to complete brand manuals, we provide the assets you need to present your business with confidence.',
    '["Generic or dated logos that fail to represent your current capabilities", "Inconsistent visual presentation across digital, physical, and team communications", "Difficulty differentiating from competitors in crowded markets", "Absence of unified brand guidelines for internal teams and external vendors"]'::jsonb,
    '[{"title": "Core Logomark & Wordmark System", "description": "Primary, secondary, and responsive mark variations for all contexts."}, {"title": "Color Palette & Typography Scale", "description": "Curated color specifications (HEX, RGB, CMYK, Pantone) and typography pairings."}, {"title": "Comprehensive Brand Guidelines", "description": "A detailed reference manual detailing clear usage rules, spacing, and application principles."}, {"title": "Brand Asset Kit", "description": "Iconography, favicon suites, social avatars, and digital stationery templates."}]'::jsonb,
    '["New startups and businesses establishing their initial market identity", "Growing organizations outgrowing their initial prototype branding", "Institutions undergoing strategic repositioning or international expansion"]'::jsonb,
    '[{"title": "1. Brand Discovery", "description": "Investigating core mission, target audience expectations, and competitive landscape."}, {"title": "2. Identity Concepts", "description": "Developing multiple distinct conceptual logo systems and visual directions."}, {"title": "3. Identity System Crafting", "description": "Expanding chosen concept into typography, colors, patterns, and applications."}, {"title": "4. Manual & Asset Package", "description": "Delivering comprehensive guideline document and complete file archives."}]'::jsonb,
    '[{"question": "Do I own the intellectual property rights to the final brand designs?", "answer": "Yes. Upon full project completion and final handover, all intellectual property rights and full copyright ownership are transferred to your organization."}, {"question": "What is included in the brand guidelines document?", "answer": "The manual outlines logo usage rules, minimum clear space, incorrect uses, primary and secondary color formulas, approved typography hierarchies, and stationery mockups."}]'::jsonb,
    '["graphic-design", "web-development", "digital-marketing-seo"]'::jsonb,
    true,
    3
),
(
    'srv-04',
    'business-software-automation',
    'Business Software & Automation',
    'Custom Internal Systems and Automated Workflows That Reduce Manual Friction',
    'Engineering & Development',
    'Cpu',
    'Tailored internal management tools, database solutions, automated pipeline workflows, and custom software that replace tedious manual processes.',
    'Off-the-shelf software often forces your operations into rigid boxes that create workarounds and inefficiencies. We engineer tailored business software and workflow automations built specifically around your operating procedures, eliminating repetitive manual work and centralizing business data.',
    '["Critical business operations scattered across fragile, unversioned spreadsheets", "Hours lost every week to manual data re-entry between disconnected software tools", "Lack of visibility into operational statuses, orders, inventory, or approvals", "Human error in invoicing, client onboarding, and record keeping"]'::jsonb,
    '[{"title": "Custom Internal Business Portals", "description": "Role-based dashboards for order processing, client records, and inventory tracking."}, {"title": "Automated Workflow Pipelines", "description": "Connecting web forms, email alerts, databases, and accounting without manual intervention."}, {"title": "API Integrations & Webhooks", "description": "Real-time synchronization between CRM, payment gateways, ERPs, and cloud storage."}, {"title": "Data Migration & Reporting Systems", "description": "Consolidating disparate data sources into clear, actionable operational summaries."}]'::jsonb,
    '["Companies spending hours manually synchronizing records across departments", "Businesses requiring specialized workflow rules not supported by generic SaaS tools", "Operations teams needing centralized internal management tools with audit logging"]'::jsonb,
    '[{"title": "1. Workflow Audit", "description": "Mapping current operational touchpoints, bottlenecks, and data flows."}, {"title": "2. System Architecture", "description": "Designing database schemas, role access policies, and integration blueprints."}, {"title": "3. Agile Development", "description": "Iterative module development with regular validation from operational staff."}, {"title": "4. Staff Training & Deployment", "description": "Secure production rollout, staff onboarding, and ongoing operational support."}]'::jsonb,
    '[{"question": "Can this software integrate with our existing accounting or payment tools?", "answer": "Yes. We regularly build integrations with standard accounting tools, local payment systems (including M-Pesa), banking APIs, and global payment processors via REST APIs and secure webhooks."}, {"question": "Who owns the software and data?", "answer": "Your organization retains complete ownership of your proprietary code, databases, and business data."}]'::jsonb,
    '["school-management-systems", "custom-solutions", "it-support", "ai-solutions"]'::jsonb,
    true,
    4
),
(
    'srv-05',
    'school-management-systems',
    'School Management Systems',
    'Integrated Education Platforms for Students, Parents, and Administrators',
    'Enterprise & Education',
    'GraduationCap',
    'Complete school administration systems featuring student records, fee tracking, parent portals, grading, and academic communication.',
    'Modern educational institutions require dependable digital infrastructure to handle admissions, fee tracking, academic reporting, and parent engagement. We develop and implement comprehensive school management systems adapted to institutional curricula, administrative requirements, and local payment channels.',
    '["Disorganized student academic records and slow manual report card compilation", "Difficulties tracking tuition fees, balances, receipts, and reconciliations", "Slow or costly communication with parents regarding performance and school events", "Attendance tracking errors and scattered teacher documentation"]'::jsonb,
    '[{"title": "Student Information & Admissions System", "description": "Centralized database managing student profiles, guardian information, and class allocations."}, {"title": "Fee Management & Receipting", "description": "Automated invoice generation, payment tracking, balance reminders, and receipt generation."}, {"title": "Grading & Academic Report Cards", "description": "Configurable exam assessment entry, automated ranking calculations, and PDF report generation."}, {"title": "Parent & Guardian Communication Portal", "description": "SMS and web notifications, timetable access, attendance logs, and event calendars."}, {"title": "Staff & Timetable Management", "description": "Teacher scheduling, subject allocations, and staff record administration."}]'::jsonb,
    '["Primary, secondary, and high schools modernizing administrative operations", "Colleges, training institutes, and vocational academies needing student lifecycle management", "Multi-campus educational groups seeking unified administrative governance"]'::jsonb,
    '[{"title": "1. Curriculum & Administrative Review", "description": "Aligning system settings with grading policies, fee structures, and calendar terms."}, {"title": "2. Database Setup & Data Migration", "description": "Importing historical student rosters, staff lists, and fee accounts securely."}, {"title": "3. Admin & Teacher Onboarding", "description": "Practical hands-on training for clerical staff, finance officers, and teachers."}, {"title": "4. Parent Rollout & Support", "description": "Launching parent communications with ongoing technical assistance."}]'::jsonb,
    '[{"question": "Can the system send automated fee balance reminders to parents via SMS?", "answer": "Yes. The system supports direct SMS gateway integration to dispatch payment reminders, term notices, and emergency school alerts directly to registered parent contact numbers."}, {"question": "Is student data kept secure and confidential?", "answer": "Absolutely. We enforce strict role-based access control, encrypted database storage, and regular automated backups to ensure data integrity and compliance with privacy regulations."}]'::jsonb,
    '["business-software-automation", "hosting-domains-email", "custom-solutions"]'::jsonb,
    true,
    5
),
(
    'srv-06',
    'ai-solutions',
    'AI Integrations & AI Solutions',
    'Practical Artificial Intelligence Integrations Focused on Real Business Value',
    'Innovation & AI',
    'BrainCircuit',
    'Pragmatic AI workflow integrations, intelligent knowledge assistants, document analysis, and smart automation designed to augment your team.',
    'We help businesses cut through the hype and implement practical artificial intelligence capabilities that deliver tangible productivity gains. From private internal knowledge assistants that query your business documentation to automated document classification and smart client support workflows, our solutions emphasize security, accuracy, and measurable return.',
    '["Staff spending excessive time searching through internal documents, SOPs, and archives", "Slow response times to repetitive client inquiries outside standard office hours", "Manual classification and data extraction from invoices, contracts, and receipts", "Desire to adopt modern AI without exposing sensitive company data to public training sets"]'::jsonb,
    '[{"title": "Private Enterprise Knowledge Assistants", "description": "Secure, retrieval-augmented chat assistants indexing your internal documentation, manuals, and policies."}, {"title": "Document Processing & Extraction", "description": "Automated data extraction from invoices, legal contracts, receipts, and structured forms."}, {"title": "Intelligent Client Inquiry Routing", "description": "Automated triage that categorizes inbound leads and drafts context-aware staff responses."}, {"title": "Workflow AI Pipelines", "description": "Connecting large language models into your existing databases and business software safely."}]'::jsonb,
    '["Professional firms managing large repositories of reference documents", "Support teams wanting 24/7 intelligent initial triage and FAQ resolution", "Businesses wanting to automate tedious document-heavy operational workflows"]'::jsonb,
    '[{"title": "1. Feasibility & Data Privacy Review", "description": "Identifying high-impact use cases and establishing strict data isolation boundaries."}, {"title": "2. Architecture & Model Selection", "description": "Selecting optimal foundation models and architecting private retrieval pipelines."}, {"title": "3. Prototype & Evaluation", "description": "Rigorous testing against real company queries to eliminate hallucinations."}, {"title": "4. Production Integration & Monitoring", "description": "Deploying with observability, feedback loops, and token usage controls."}]'::jsonb,
    '[{"question": "Will our proprietary business data be used to train public AI models?", "answer": "No. We utilize enterprise API agreements with strict zero-data-retention and zero-training policies. Your confidential documentation remains strictly private and protected."}, {"question": "How do you ensure the AI does not provide false answers (hallucinations)?", "answer": "We implement Retrieval-Augmented Generation (RAG) with strict source citation constraints, instruction guardrails, and deterministic fallbacks."}]'::jsonb,
    '["business-software-automation", "custom-solutions", "web-development"]'::jsonb,
    true,
    6
),
(
    'srv-07',
    'mobile-app-development',
    'Mobile App Development',
    'Cross-Platform Mobile Applications Built for Speed and Usability',
    'Engineering & Development',
    'Smartphone',
    'Native-feel mobile apps for iOS and Android, Progressive Web Apps (PWAs), and cross-platform mobile experiences that engage users everywhere.',
    'Reach your clients directly in their pockets. We build fast, reliable mobile applications utilizing modern cross-platform technologies and progressive web architectures. Our mobile solutions combine fluid interfaces, offline capabilities, secure authentication, and direct notification channels.',
    '["Inability to engage mobile users with push notifications and quick offline access", "High expense of maintaining two completely separate native iOS and Android codebases", "Sluggish hybrid web wrappers that frustrate users with poor touch responsiveness", "Complex app store submission and compliance hurdles"]'::jsonb,
    '[{"title": "Cross-Platform iOS & Android Apps", "description": "Single high-performance codebase delivering authentic native experiences on both platforms."}, {"title": "Progressive Web Apps (PWAs)", "description": "Installable, lightweight web apps that work offline and bypass app store download friction."}, {"title": "Backend API & Sync Architecture", "description": "Secure cloud endpoints handling user authentication, real-time data sync, and database queries."}, {"title": "App Store & Play Store Publishing", "description": "End-to-end management of app signing, store listings, screenshots, and review submissions."}]'::jsonb,
    '["Consumer products requiring on-the-go account access and push notifications", "Field teams and logistics operations recording data on handheld devices", "Membership communities and educational institutions providing mobile portals"]'::jsonb,
    '[{"title": "1. UX & Touch Flow Prototyping", "description": "Designing intuitive thumb-friendly screen layouts and gestures."}, {"title": "2. Mobile Architecture & Offline Strategy", "description": "Establishing local storage, authentication, and API synchronization models."}, {"title": "3. Development & Device Testing", "description": "Rigorous testing across a variety of screen sizes, OS versions, and network speeds."}, {"title": "4. Store Submission & Rollout", "description": "Navigating Apple App Store and Google Play guidelines for approved publication."}]'::jsonb,
    '[{"question": "Do we need separate apps for iPhone and Android?", "answer": "In most business use cases, modern cross-platform development allows a unified codebase that compiles to native iOS and Android applications, reducing initial development and maintenance costs significantly."}, {"question": "Can the app work without an active internet connection?", "answer": "Yes. We can architect local data caching and offline synchronization so users can continue recording or viewing critical data even when network connectivity drops."}]'::jsonb,
    '["web-development", "business-software-automation", "hosting-domains-email"]'::jsonb,
    true,
    7
),
(
    'srv-08',
    'it-support',
    'IT Support & Managed Services',
    'Dependable Technical Support and Managed Technology Operations',
    'Infrastructure & Support',
    'Headphones',
    'Proactive technical support, workstation management, office network setup, security hygiene, and ongoing IT assistance tailored to your team.',
    'Keep your daily operations running smoothly without the overhead of an in-house IT department. We provide structured IT support, device setup, troubleshooting, security maintenance, and technology vendor management to ensure your business remains productive and secure.',
    '["Frequent workstation downtime and software glitches stalling employee productivity", "Unsecured office networks, unpatched software, and absence of standardized antivirus protection", "Disorganized employee onboarding and offboarding for computers and email accounts", "Frustration managing multiple conflicting hardware and software vendor contracts"]'::jsonb,
    '[{"title": "Remote & Scheduled On-Site Support", "description": "Prompt troubleshooting for operating systems, hardware peripherals, and software tools."}, {"title": "Network & Connectivity Configuration", "description": "Secure office Wi-Fi, router firewalls, VPN configurations, and printer networking."}, {"title": "Workstation Setup & Endpoint Security", "description": "Standardized device provisioning, automated security patching, and managed malware defense."}, {"title": "Backup & Disaster Recovery Planning", "description": "Automated encrypted off-site backups safeguarding critical business records."}]'::jsonb,
    '["SMEs requiring structured technical support without full-time IT staff overhead", "Growing offices setting up dependable local networks and employee hardware", "Organizations wanting proactive maintenance to prevent sudden data loss"]'::jsonb,
    '[{"title": "1. IT Environment Audit", "description": "Inventorying existing hardware, operating systems, network gear, and software licenses."}, {"title": "2. Standardization & Hardening", "description": "Resolving security vulnerabilities, configuring firewalls, and setting up backups."}, {"title": "3. Support Channel Setup", "description": "Establishing clear communication channels for employees to log support tickets."}, {"title": "4. Ongoing Proactive Maintenance", "description": "Regular health checks, patch updates, and rapid incident resolution."}]'::jsonb,
    '[{"question": "Do you offer ad-hoc troubleshooting or ongoing retainer agreements?", "answer": "We provide both dedicated monthly managed IT retainer plans with guaranteed response windows and scoped project-based technical interventions."}, {"question": "How do staff members submit support requests?", "answer": "Support can be initiated via dedicated email ticketing, WhatsApp, or scheduled remote screen-share sessions."}]'::jsonb,
    '["hosting-domains-email", "custom-solutions"]'::jsonb,
    true,
    8
),
(
    'srv-09',
    'hosting-domains-email',
    'Hosting, Domains & Business Email',
    'Secure Cloud Infrastructure, Reliable Hosting, and Professional Business Email',
    'Infrastructure & Support',
    'Server',
    'Domain registration, fast cloud hosting, DNS management, SSL certificates, and professional branded email solutions (Google Workspace & custom mail).',
    'Your digital presence rests on your foundational infrastructure. We handle domain registration, DNS management, fast and secure cloud web hosting, SSL encryption, and professional business email setup. We ensure your emails land in client inboxes rather than spam folders.',
    '["Using free personal email addresses that undermine company credibility", "Business emails frequently landing in prospective clients’ spam or junk folders", "Unreliable cheap web hosting resulting in frequent website timeouts or downtime", "Misconfigured DNS records breaking website accessibility or email delivery"]'::jsonb,
    '[{"title": "Domain Registration & DNS Management", "description": "Assistance securing .cloud, .co.ke, .com, or other TLDs with secure DNS configuration."}, {"title": "High-Performance Cloud Web Hosting", "description": "Fast SSD-backed hosting with 99.9% uptime, HTTP/3, and daily automated backups."}, {"title": "Professional Business Email Setup", "description": "Configuring custom branded email accounts via Google Workspace, Microsoft 365, or private mail servers."}, {"title": "Email Deliverability Hardening (SPF, DKIM, DMARC)", "description": "Rigorous cryptographic authentication records ensuring your emails pass strict spam filters."}, {"title": "Automated SSL Certificates", "description": "Modern TLS encryption keeping visitor interactions secure and warnings away."}]'::jsonb,
    '["New businesses registering their domain and establishing professional email accounts", "Companies moving away from slow, shared hosting to fast dedicated cloud servers", "Organizations troubleshooting persistent email delivery or spam classification issues"]'::jsonb,
    '[{"title": "1. Domain & DNS Review", "description": "Securing required domain names and routing nameservers securely."}, {"title": "2. Email System Provisioning", "description": "Setting up mailboxes, aliases, and user groups with strong authentication."}, {"title": "3. Deliverability Verification", "description": "Configuring and testing SPF, DKIM, and DMARC alignment records."}, {"title": "4. Web Server Provisioning & SSL", "description": "Deploying site files to high-speed hosting and verifying HTTPS certificates."}]'::jsonb,
    '[{"question": "Why are our emails going into spam, and can you fix this?", "answer": "Modern mail providers require cryptographic DNS authentication (SPF, DKIM, and DMARC). Missing or conflicting records cause automatic spam tagging. We audit and calibrate these records to restore high sender reputation."}, {"question": "Can you help us migrate existing emails without losing old messages?", "answer": "Yes. We perform secure IMAP mail migrations that transfer your existing inbox histories, folder structures, and contacts with zero data loss."}]'::jsonb,
    '["web-development", "it-support", "custom-solutions"]'::jsonb,
    true,
    9
),
(
    'srv-10',
    'digital-marketing-seo',
    'Digital Marketing & SEO',
    'Technical Search Engine Optimization and Data-Driven Digital Visibility',
    'Marketing & Growth',
    'TrendingUp',
    'Search engine optimization (technical and on-page SEO), Google Business profile optimization, analytics tracking, and strategic digital campaigns.',
    'A great website creates value only when prospective clients can find it. We combine technical SEO architecture, structured content planning, local search optimization, and performance analytics to increase your organic discoverability and convert visitors into qualified inquiries.',
    '["Low ranking on Google for search terms relevant to your core services and location", "Absence of analytics insight into who visits your site, where they come from, or where they drop off", "Unclaimed or poorly optimized Google Business profile reducing local client calls", "Wasteful digital advertising campaigns lacking conversion tracking or clear attribution"]'::jsonb,
    '[{"title": "Technical SEO Audit & Remediation", "description": "Fixing crawl errors, indexing issues, canonical tags, sitemaps, and Core Web Vitals speed."}, {"title": "On-Page Content & Keyword Optimization", "description": "Optimizing titles, headings, meta descriptions, and structural semantic copy for target search intent."}, {"title": "Local SEO & Google Business Profile", "description": "Setting up and optimizing your local map pack presence for local client discovery."}, {"title": "Analytics & Conversion Tracking", "description": "Privacy-compliant setup of Google Analytics 4, Search Console, and event conversion tracking."}]'::jsonb,
    '["Businesses looking to acquire organic inbound client inquiries without continuous ad spend", "Local service providers wanting to dominate local geographic map searches", "Companies launching new websites who want to ensure proper search engine indexing"]'::jsonb,
    '[{"title": "1. SEO & Competitive Audit", "description": "Analyzing existing search presence, technical impediments, and keyword opportunities."}, {"title": "2. Technical Remediation", "description": "Correcting code-level issues, robots.txt, sitemaps, and metadata structures."}, {"title": "3. Content & On-Page Execution", "description": "Aligning page copy and internal linking structures with client search intent."}, {"title": "4. Analytics & Review", "description": "Monitoring crawl health, ranking trajectories, and form conversion events."}]'::jsonb,
    '[{"question": "Do you guarantee a #1 ranking on Google?", "answer": "No reputable digital partner can guarantee specific search rankings, as search algorithms remain proprietary. We do, however, guarantee strict adherence to industry best practices and proven technical SEO architectures."}, {"question": "How long does SEO take to produce measurable results?", "answer": "Technical fixes and indexing updates usually reflect within 2–4 weeks. Broader organic ranking gains typically build progressively over 3–6 months."}]'::jsonb,
    '["web-development", "graphic-design", "ecommerce"]'::jsonb,
    true,
    10
),
(
    'srv-11',
    'ecommerce',
    'E-commerce Development',
    'High-Converting Online Stores with Integrated Payment Gateways',
    'Engineering & Development',
    'ShoppingBag',
    'Custom online stores, product catalogs, seamless checkout experiences, automated inventory tracking, and secure payment integrations (M-Pesa, cards, etc.).',
    'Sell products and services securely online. We build e-commerce platforms focused on frictionless browsing, simple product management, and streamlined checkout flows. We integrate local and international payment systems so your clients can purchase effortlessly.',
    '["Relying solely on informal WhatsApp orders with manual payment confirmation and lost sales", "Clunky, slow checkout processes causing high cart abandonment rates", "Difficulty managing inventory levels, product variations, and shipping fees", "Lack of integrated payment gateways that support both local mobile money and credit cards"]'::jsonb,
    '[{"title": "Custom E-commerce Storefront", "description": "Responsive, fast-loading storefront designed for seamless mobile shopping."}, {"title": "Integrated Payment Gateways", "description": "Native checkout integrations for M-Pesa, card payments, Stripe, and regional payment providers."}, {"title": "Product & Inventory Management", "description": "Intuitive administrative dashboard for managing stock, variations, photos, and categories."}, {"title": "Order & Notification Pipelines", "description": "Automated email and SMS confirmations for customers and fulfillment alerts for store staff."}]'::jsonb,
    '["Retailers expanding from physical storefronts to national or international online commerce", "Direct-to-consumer brands launching a dedicated digital store", "B2B wholesalers providing digital catalog ordering for trade accounts"]'::jsonb,
    '[{"title": "1. Catalog & Checkout Strategy", "description": "Defining product structures, payment gateways, and delivery logic."}, {"title": "2. Storefront Design & Prototyping", "description": "Crafting intuitive mobile-first browsing, filter, and checkout interfaces."}, {"title": "3. Technical Build & Gateway Integration", "description": "Implementing secure checkout, SSL encryption, and automated webhooks."}, {"title": "4. Testing, Sandboxes & Launch", "description": "Executing end-to-end sandbox payments, staff training, and live deployment."}]'::jsonb,
    '[{"question": "Can customers pay using M-Pesa directly on the website?", "answer": "Yes. We integrate secure STK push and payment validation webhooks, allowing customers to enter their phone number and receive an instant PIN prompt on their mobile device."}, {"question": "Can we manage inventory and prices ourselves after launch?", "answer": "Yes. You receive a dedicated, secure management dashboard where you can add new products, adjust pricing, and track orders without writing code."}]'::jsonb,
    '["web-development", "digital-marketing-seo", "hosting-domains-email"]'::jsonb,
    true,
    11
),
(
    'srv-12',
    'custom-solutions',
    'Custom Digital Solutions',
    'Bespoke Digital Engineering for Unique Technical and Business Requirements',
    'Enterprise & Education',
    'Boxes',
    'Tailored technology consultations, specialized software architecture, API bridges, and custom digital systems designed around unique operational challenges.',
    'Not every technology project fits into a standard category. If your business faces a distinct operational challenge, requires specialized data workflows, or needs custom software engineering that bridges disparate legacy tools, we architect and deliver bespoke solutions tailored precisely to your requirements.',
    '["Unique business processes that no commercial off-the-shelf software can accommodate", "Legacy systems that need secure modern web interfaces or automated API bridges", "Specialized data collection, validation, or compliance monitoring requirements", "Need for an experienced technology partner to evaluate technical feasibility and architecture"]'::jsonb,
    '[{"title": "Technical Discovery & System Architecture", "description": "In-depth requirements analysis, feasibility assessment, and comprehensive technical blueprints."}, {"title": "Bespoke Application Development", "description": "Purpose-built software systems designed from first principles around your business logic."}, {"title": "Legacy System Modernization & Bridges", "description": "Creating modern APIs, microservices, or secure interfaces on top of existing databases."}, {"title": "Technology Consultation & Advisory", "description": "Objective guidance on cloud infrastructure, security choices, and technology vendor evaluation."}]'::jsonb,
    '["Organizations with complex proprietary business logic and specialized workflows", "Businesses wanting to connect two incompatible systems through a custom middleware bridge", "Innovators developing a proof-of-concept or custom digital platform"]'::jsonb,
    '[{"title": "1. In-Depth Technical Consultation", "description": "Discussing the exact challenge, constraints, security needs, and goals."}, {"title": "2. Solution Architecture Blueprint", "description": "Documenting recommended technical approach, stack, and milestone breakdown."}, {"title": "3. Phased Implementation", "description": "Executing development in controlled, transparent milestones with regular reviews."}, {"title": "4. Delivery, Documentation & Handover", "description": "Comprehensive code handover, deployment documentation, and post-launch support."}]'::jsonb,
    '[{"question": "How do we get started if our project scope is not fully defined yet?", "answer": "You can book an exploratory consultation with us. We will help you analyze your requirements, identify technical trade-offs, and define a clear, phased implementation roadmap before committing to development."}, {"question": "Do you work under non-disclosure agreements (NDAs)?", "answer": "Yes. We regularly execute mutual confidentiality and non-disclosure agreements prior to reviewing proprietary business workflows or sensitive systems."}]'::jsonb,
    '["business-software-automation", "ai-solutions", "web-development"]'::jsonb,
    true,
    12
)
ON CONFLICT (slug) DO UPDATE
SET 
    name = EXCLUDED.name,
    headline = EXCLUDED.headline,
    category = EXCLUDED.category,
    icon_key = EXCLUDED.icon_key,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    problems_solved = EXCLUDED.problems_solved,
    deliverables = EXCLUDED.deliverables,
    suitable_use_cases = EXCLUDED.suitable_use_cases,
    process_steps = EXCLUDED.process_steps,
    faqs = EXCLUDED.faqs,
    related_services = EXCLUDED.related_services,
    is_published = EXCLUDED.is_published,
    display_order = EXCLUDED.display_order,
    updated_at = now();
