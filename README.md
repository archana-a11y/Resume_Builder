# AI Resume Builder

A modern, AI-powered resume builder built with Next.js, Supabase, and OpenAI.

## Features

### 💎 Premium Experience
- **Stunning UI**: Modern glassmorphism design with `framer-motion` animations and high-end aesthetic.
- **Dynamic Dashboard**: Manage your entire job hunt from a single, beautiful interface.

### 🤖 AI-Powered Suite
- **AI Resume Builder**: Generate professional content instantly using OpenAI.
- **AI Cover Letter Generator**: Craft tailored cover letters for specific job descriptions based on your resume.
- **ATS Match Engine**: Scan your resume against job postings to get a match score and optimization tips.
- **AI Interview Coach**: Practice with behavioral and technical questions + STAR method answer coaching.

### 🏹 Job Hunt Management
- **Job Tracker (CRM)**: A Kanban-style board to track applications from 'Wishlist' to 'Offer'.
- **Integrated Workflow**: Link specific resumes and letters to each application for perfect organization.

### 🛠️ Technical Excellence
- **Supabase Core**: Secure Auth and real-time database integration.
- **Next.js 15+**: Built with the latest server actions and App Router patterns.
- **Professional PDF Export**: High-quality resume downloads at the click of a button.

## Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/archana-a11y/Resume_Builder.git
    cd Resume_Builder
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file with the following:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    OPENAI_API_KEY=your_openai_api_key
    ```

4.  **Database Setup**:
    Setup your database tables and policies in the Supabase dashboard.

5.  **Run Locally**:
    ```bash
    npm run dev
    ```

## Deployment

This project is optimized for deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Add the environment variables listed above in the Vercel dashboard.
3. Vercel will automatically build and deploy the project.

> [!TIP]
> This project is fully compatible with standard Vercel deployments. Just connect and deploy!
> (Last build trigger: 2026-03-07)
