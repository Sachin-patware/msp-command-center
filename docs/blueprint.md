# **App Name**: MSP Command Center

## Core Features:

- User Authentication and Roles: Securely authenticate users with Firebase Auth and manage role-based access (owner/admin, finance, IT manager, sales, viewer).
- Organization and Client Management: Multi-tenant support per MSP organization. CRUD operations for clients, including client details, MRR, contract terms, and SLAs, stored in Firestore.
- Financial Dashboard and Reporting: Snapshot of key financial metrics (MRR, ARR, churn rate, gross margin, net profit).  Provide client profitability analysis and invoicing tracker in Firestore.
- Software License Management: Track software subscriptions, license counts, and renewal dates across clients. Generate alerts for upcoming renewals and over/under utilization, leveraging Firestore.
- Resource Utilization and Time Tracking: Log billable and non-billable hours per client and per engineer. Calculate utilization percentages and trends in Firestore.
- Sales and Marketing Tools: Manage leads, track funnel stages, and conversion rates. Includes proposal templates (using a tool that extracts data from firestore to generate PDF exports) and a quote generator. powered by generative AI.
- Notifications and Activity Logs: Configure email notifications for overdue invoices, renewals, and budget overruns using Cloud Functions.  Maintain an audit trail with Firestore-based activity logs.

## Style Guidelines:

- Primary color: Deep sky blue (#3399FF) to convey trust, stability, and a tech-forward approach.
- Background color: Light grayish-blue (#E5F0FF) for a clean, professional look with a slight tint of the primary hue.
- Accent color: Vivid blue-violet (#9966FF) to highlight key interactive elements, providing a dynamic and modern contrast.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look.
- Use consistent and clear icons to represent different modules and actions.
- Data-dense dashboards for admins with key performance indicators (KPIs) at the top and a left-side vertical navigation menu for easy access to different sections.
- Subtle transitions and animations to improve user experience.