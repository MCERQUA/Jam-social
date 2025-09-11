# Jam Social Media

Professional social media management platform built with Astro, React, and Tailwind CSS.

## Features

- **Multi-Platform Support**: Manage content across Instagram, LinkedIn, TikTok, X, Facebook, YouTube, Pinterest, Google Business, Threads, Snapchat, Bluesky, and Reddit
- **Content Creation**: AI-powered content creation and optimization
- **Smart Scheduling**: Automated posting at optimal times
- **Advanced Analytics**: Track performance across all platforms
- **Team Collaboration**: Work together with your team seamlessly

## Tech Stack

- **Framework**: [Astro](https://astro.build) v5.13
- **UI Framework**: React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Components**: Custom components inspired by 21st.dev

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jam-social.git
cd jam-social
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Deployment

### Netlify

This project includes a `netlify.toml` configuration file for easy deployment to Netlify.

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Deploy with these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

```bash
npm run build
vercel --prod
```

## Project Structure

```
jam-social/
├── src/
│   ├── components/
│   │   ├── sections/     # Page sections (Hero, Features, etc.)
│   │   └── ui/           # Reusable UI components
│   ├── layouts/          # Page layouts
│   ├── lib/             # Utility functions
│   ├── pages/           # Astro pages
│   └── styles/          # Global styles
├── public/              # Static assets
├── dist/                # Production build
└── package.json
```

## Components

The project uses modern React components with animations:

- **WavyBackground**: Animated hero background
- **SparklesText**: Text with sparkle effects
- **SpotlightCard**: Interactive feature cards
- **AnimatedTooltip**: Team member profiles
- **NavbarMenu**: Navigation with dropdowns
- And many more...

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Clean build artifacts

## License

MIT License

## Contact

For inquiries, please contact us through the website contact form or at hello@jamsocial.com