# AI Resume Builder

A modern, AI-powered resume builder built with Next.js, Supabase, and OpenAI.

## Features

- **AI Generation**: Generate resume content using OpenAI.
- **Real-time Preview**: See your changes instantly with multiple premium templates.
- **PDF Export**: Download your resume as a professionally formatted PDF.
- **Supabase Integration**: Secure authentication and data storage.

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

> [!IMPORTANT]
> The build script is specifically configured to handle space-containing paths and static CSS generation for maximum compatibility.
