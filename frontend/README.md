# SAT Math Learning Platform - Frontend

A modern React web application for SAT Math practice and learning with gamification elements.

## Features

- 🎯 **Practice Problems**: Targeted SAT Math practice with instant feedback
- 🏘️ **Village Gamification**: Build your learning village with decorations and milestones
- 📊 **Analytics Dashboard**: Track progress and performance
- 👥 **Community**: Connect with other learners
- 📚 **Tutorials**: Step-by-step learning guides
- 🎨 **Modern UI**: Beautiful black and purple theme with Tailwind CSS

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Icons**: Heroicons (inline SVG)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Sidebar, etc.)
│   ├── ui/            # Base UI components
│   └── forms/         # Form components
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard
│   ├── practice/      # Practice area
│   ├── village/       # Village gamification
│   ├── analytics/     # Analytics dashboard
│   ├── community/     # Community features
│   ├── tutorials/     # Learning tutorials
│   └── profile/       # User profile
├── context/           # React Context for state management
├── hooks/             # Custom React hooks
├── services/          # API service layer
├── utils/             # Utility functions
├── assets/            # Static assets
├── styles/            # Global styles
└── App.jsx           # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Design System

### Color Palette

- **Primary Purple**: #7C3AED
- **Dark Purple**: #6D28D9
- **Dark Background**: #0F172A / #111827
- **Accent Light Purple**: #C4B5FD
- **Text**: #F3F4F6 (light) / #FFFFFF (white)

### Custom Components

- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outline button
- `.card` - Card container
- `.input-field` - Form input
- `.nav-link` - Navigation link

## API Integration

The frontend communicates with the backend API through a service layer located in `src/services/`. The API client automatically handles:

- Authentication tokens
- Token refresh
- Error handling
- Request/response interceptors

## Authentication

- JWT-based authentication
- Automatic token refresh
- Protected routes
- Login/logout functionality

## Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Contributing

1. Follow the existing code style
2. Use semantic HTML
3. Ensure accessibility
4. Test on multiple screen sizes
5. Comment complex logic

## Deployment

The app is ready to be deployed to any static hosting service:

1. Build the app: `npm run build`
2. Deploy the `dist` folder to your hosting provider

Popular options:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront