# Floating Sidebar Navigation Menu - Recreation Guide

## Overview
This guide provides detailed instructions to recreate the floating sidebar navigation component from Jam Social's services page. This component features a smart, scroll-aware navigation menu that appears on the right side of the screen (desktop) and bottom of the screen (mobile).

---

## Component Features

### Visual Features
- **Desktop**: Floating pill-shaped container on the right side, vertically centered
- **Mobile**: Fixed bottom bar, horizontally centered
- **Active State**: Gradient background (violet to indigo) on active section
- **Hover Effects**: Scale animation, tooltip display, color transitions
- **Glassmorphism**: Semi-transparent black background with backdrop blur
- **Border Glow**: Violet border with subtle shadow effect

### Functional Features
- **Scroll Tracking**: Automatically highlights the current section based on scroll position
- **Smooth Scrolling**: Clicking an icon smoothly scrolls to the corresponding section
- **Tooltips**: Desktop version shows label on hover
- **Responsive**: Different layouts for desktop (vertical sidebar) and mobile (horizontal bar)
- **Animation**: Entrance animation with framer-motion

---

## Required Dependencies

Add these packages to your project:

```bash
npm install framer-motion lucide-react
```

### Package Versions (tested)
- `framer-motion`: ^12.23.12
- `lucide-react`: ^0.543.0

---

## File Structure

Create the component file:
```
src/
  components/
    ui/
      ServiceNavSidebar.tsx  (or your preferred name)
```

---

## Complete Component Code

Create a new file `ServiceNavSidebar.tsx` with this exact code:

```tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Video, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceNavItem {
  icon: React.ReactNode;
  targetId: string;
  label: string;
}

const ServiceNavSidebar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  const services: ServiceNavItem[] = [
    {
      icon: <Calendar className="w-6 h-6" />,
      targetId: 'social-scheduling',
      label: 'Social Media Scheduling'
    },
    {
      icon: <Users className="w-6 h-6" />,
      targetId: 'mascot-setup',
      label: 'Company Mascot Setup'
    },
    {
      icon: <Video className="w-6 h-6" />,
      targetId: 'video-creation',
      label: 'Video Creation'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      targetId: 'ai-websites',
      label: 'AI-Powered Websites'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = services.map(s => document.getElementById(s.targetId));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        if (section) {
          const { top, bottom } = section.getBoundingClientRect();
          const absoluteTop = window.scrollY + top;
          const absoluteBottom = window.scrollY + bottom;

          if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            setActiveSection(services[index].targetId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Desktop Version - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
      >
        <div className="bg-black/20 backdrop-blur-sm border border-violet-500/50 rounded-full p-3 shadow-lg shadow-violet-500/20">
          <nav className="flex flex-col gap-4">
            {services.map((service) => (
              <motion.button
                key={service.targetId}
                onClick={() => scrollToSection(service.targetId)}
                className={`
                  relative p-3 rounded-full transition-all duration-300
                  ${activeSection === service.targetId
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}
                  border border-white/10 hover:border-white/20
                  group
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={service.label}
              >
                {service.icon}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <div className="bg-black/90 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap border border-white/10">
                    {service.label}
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Mobile Version - Bottom Fixed Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden"
      >
        <div className="bg-black/80 backdrop-blur-sm border border-violet-500/50 rounded-full px-4 py-3 shadow-lg shadow-violet-500/20">
          <nav className="flex gap-3">
            {services.map((service) => (
              <motion.button
                key={service.targetId}
                onClick={() => scrollToSection(service.targetId)}
                className={`
                  p-2.5 rounded-full transition-all duration-300
                  ${activeSection === service.targetId
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}
                  border border-white/10 hover:border-white/20
                `}
                whileTap={{ scale: 0.95 }}
                title={service.label}
              >
                {React.cloneElement(service.icon as React.ReactElement, {
                  className: "w-5 h-5"
                })}
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default ServiceNavSidebar;
```

---

## Customization Guide

### 1. Change Navigation Items

Edit the `services` array (lines 14-35):

```tsx
const services: ServiceNavItem[] = [
  {
    icon: <YourIcon className="w-6 h-6" />,  // Change icon
    targetId: 'your-section-id',              // Change target section
    label: 'Your Section Name'                // Change label
  },
  // Add more items...
];
```

**Available Lucide Icons**: Import from `lucide-react`
- Calendar, Users, Video, Brain (currently used)
- Plus hundreds more: Home, Settings, Star, Heart, Check, etc.
- Browse all: https://lucide.dev/icons

### 2. Change Colors

**Primary Gradient** (active state):
```tsx
// Line 85 & 126
from-violet-600 to-indigo-600

// Replace with your colors:
from-blue-600 to-cyan-600      // Blue theme
from-pink-600 to-rose-600      // Pink theme
from-emerald-600 to-teal-600   // Green theme
```

**Border Color**:
```tsx
// Line 76 & 117
border-violet-500/50

// Replace with:
border-blue-500/50
border-pink-500/50
```

**Shadow Color**:
```tsx
// Line 76 & 117
shadow-violet-500/20

// Replace with:
shadow-blue-500/20
shadow-pink-500/20
```

### 3. Change Position

**Desktop (Right Side)**:
```tsx
// Line 74
className="fixed right-8 top-1/2 -translate-y-1/2"

// Move to left side:
className="fixed left-8 top-1/2 -translate-y-1/2"

// Adjust distance from edge:
right-4   // Closer
right-12  // Further
```

**Mobile (Bottom Bar)**:
```tsx
// Line 115
className="fixed bottom-4 left-1/2 -translate-x-1/2"

// Move to top:
className="fixed top-4 left-1/2 -translate-x-1/2"
```

### 4. Adjust Animation Timing

```tsx
// Line 73 (desktop) & 114 (mobile)
transition={{ delay: 0.5 }}

// Change delay:
transition={{ delay: 0 }}     // Instant
transition={{ delay: 1 }}     // Later
transition={{ delay: 0.5, duration: 0.8 }}  // Custom duration
```

### 5. Change Hover Scale Effect

```tsx
// Line 90
whileHover={{ scale: 1.1 }}

// Make it bigger:
whileHover={{ scale: 1.2 }}

// Smaller effect:
whileHover={{ scale: 1.05 }}
```

---

## Integration Instructions

### For Astro Projects

In your page file (e.g., `services.astro`):

```astro
---
import ServiceNavSidebar from '../components/ui/ServiceNavSidebar.tsx';
---

<Layout>
  <ServiceNavSidebar client:only="react" />
  <!-- Your page content -->
</Layout>
```

### For React/Next.js Projects

```tsx
import ServiceNavSidebar from '@/components/ui/ServiceNavSidebar';

export default function Page() {
  return (
    <>
      <ServiceNavSidebar />
      {/* Your page content */}
    </>
  );
}
```

### For Vue Projects

Create a React wrapper or convert the component to Vue 3 composition API.

---

## Required HTML Structure

Your page MUST have sections with matching IDs:

```html
<section id="social-scheduling">
  <!-- Content -->
</section>

<section id="mascot-setup">
  <!-- Content -->
</section>

<section id="video-creation">
  <!-- Content -->
</section>

<section id="ai-websites">
  <!-- Content -->
</section>
```

**CRITICAL**: The `targetId` in the component must match the `id` attribute in your HTML sections.

---

## CSS Requirements

This component uses **Tailwind CSS**. Ensure your project has:

### 1. Tailwind Installed
```bash
npm install -D tailwindcss
```

### 2. Required Tailwind Features Enabled

In `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Backdrop Blur Support

**Important**: Some browsers may need backdrop-filter support enabled. Add to your CSS if backdrop blur doesn't work:

```css
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
}
```

---

## Troubleshooting

### Icons Not Showing
**Problem**: Icons are invisible or showing as boxes
**Solution**:
```bash
npm install lucide-react
```
Verify import: `import { Calendar } from 'lucide-react';`

### Scroll Tracking Not Working
**Problem**: Active state doesn't change on scroll
**Solution**:
- Check that section IDs match `targetId` values exactly
- Ensure sections have enough height to trigger scroll detection
- Open browser console and check for JavaScript errors

### Sidebar Not Visible
**Problem**: Component renders but isn't visible
**Solutions**:
- Check z-index: Increase if needed (`z-50` → `z-[100]`)
- Verify parent doesn't have `overflow: hidden`
- Check if dark background is visible (try changing `bg-black/20` to `bg-red-500`)

### Smooth Scroll Not Working
**Problem**: Clicking jumps instead of smooth scroll
**Solution**: Add to your CSS:
```css
html {
  scroll-behavior: smooth;
}
```

### Mobile Version Overlaps Content
**Problem**: Bottom bar covers page content
**Solution**: Add padding to your page:
```css
/* Add to your page wrapper */
.page-content {
  padding-bottom: 80px; /* Adjust as needed */
}
```

### Animations Not Working
**Problem**: No entrance animation or hover effects
**Solution**:
- Verify `framer-motion` is installed: `npm list framer-motion`
- Check browser console for React errors
- Ensure component is client-side rendered (Astro: use `client:only="react"`)

---

## Performance Considerations

### Scroll Listener Optimization
The component uses a scroll event listener. For better performance on pages with many elements:

1. **Throttle Option** (Optional Enhancement):
```tsx
import { throttle } from 'lodash';

useEffect(() => {
  const handleScroll = throttle(() => {
    // ... scroll logic
  }, 100); // Run max once per 100ms

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

2. **IntersectionObserver Alternative** (Advanced):
For even better performance, consider using IntersectionObserver API instead of scroll listeners.

---

## Accessibility Enhancements

The current component is functional but can be improved:

### Add ARIA Labels
```tsx
<motion.button
  aria-label={service.label}
  aria-current={activeSection === service.targetId ? 'true' : 'false'}
  // ... other props
>
```

### Add Keyboard Navigation
```tsx
<motion.button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      scrollToSection(service.targetId);
    }
  }}
  // ... other props
>
```

### Skip Link (Optional)
Add a skip navigation link for screen readers:
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

## Browser Compatibility

### Tested Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Mobile 90+

### Known Issues
- **IE11**: Not supported (uses modern CSS features)
- **Opera Mini**: Backdrop blur may not work
- **Safari < 14**: May need `-webkit-backdrop-filter` prefix

---

## Advanced Customizations

### 1. Add Section Numbers
```tsx
{services.map((service, index) => (
  <motion.button>
    <div className="absolute top-0 right-0 text-xs">{index + 1}</div>
    {service.icon}
  </motion.button>
))}
```

### 2. Add Progress Indicator
```tsx
const [scrollProgress, setScrollProgress] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    setScrollProgress(progress);
  };
  // ... rest of scroll handler
}, []);

// In render:
<div className="h-1 bg-violet-600" style={{ width: `${scrollProgress}%` }} />
```

### 3. Hide on Scroll Down
```tsx
const [isVisible, setIsVisible] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
    setLastScrollY(currentScrollY);
  };
  // ... rest of scroll handler
}, [lastScrollY]);

// Update motion.div:
animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
```

---

## Color Scheme Reference

### Current Theme (Violet/Indigo)
```css
Primary Gradient: from-violet-600 to-indigo-600
Border: border-violet-500/50
Shadow: shadow-violet-500/20
Background: bg-black/20
```

### Alternative Color Schemes

**Ocean Blue**:
```css
Primary Gradient: from-blue-600 to-cyan-600
Border: border-blue-500/50
Shadow: shadow-blue-500/20
Background: bg-slate-900/20
```

**Sunset**:
```css
Primary Gradient: from-orange-600 to-pink-600
Border: border-orange-500/50
Shadow: shadow-orange-500/20
Background: bg-black/30
```

**Forest**:
```css
Primary Gradient: from-emerald-600 to-teal-600
Border: border-emerald-500/50
Shadow: shadow-emerald-500/20
Background: bg-green-950/20
```

**Monochrome**:
```css
Primary Gradient: from-gray-700 to-gray-900
Border: border-gray-500/50
Shadow: shadow-gray-500/20
Background: bg-black/40
```

---

## Testing Checklist

After implementing, verify:

- [ ] Component renders without console errors
- [ ] Desktop version appears on right side (screens > 1024px)
- [ ] Mobile version appears at bottom (screens < 1024px)
- [ ] Active state highlights correct section while scrolling
- [ ] Clicking icons scrolls to correct sections
- [ ] Tooltips appear on hover (desktop only)
- [ ] Hover animations work (scale effect)
- [ ] Entrance animation plays on page load
- [ ] Component works with all section IDs
- [ ] No layout shift when component appears
- [ ] Works on touch devices (tap events)

---

## Quick Start Checklist

1. [ ] Install dependencies: `npm install framer-motion lucide-react`
2. [ ] Create component file: `src/components/ui/ServiceNavSidebar.tsx`
3. [ ] Copy the complete component code
4. [ ] Customize the `services` array with your sections
5. [ ] Update icon imports if using different icons
6. [ ] Adjust colors to match your brand (optional)
7. [ ] Import component in your page
8. [ ] Add `id` attributes to your sections
9. [ ] Test on desktop and mobile
10. [ ] Deploy and enjoy!

---

## Example Section Structure

Here's how your page sections should be structured:

```tsx
<main>
  <section id="social-scheduling" className="min-h-screen py-20">
    <h2>Social Media Scheduling</h2>
    <p>Content here...</p>
  </section>

  <section id="mascot-setup" className="min-h-screen py-20">
    <h2>Company Mascot Setup</h2>
    <p>Content here...</p>
  </section>

  <section id="video-creation" className="min-h-screen py-20">
    <h2>Video Creation</h2>
    <p>Content here...</p>
  </section>

  <section id="ai-websites" className="min-h-screen py-20">
    <h2>AI-Powered Websites</h2>
    <p>Content here...</p>
  </section>
</main>
```

**Note**: `min-h-screen` ensures sections are tall enough for proper scroll detection.

---

## Support & Resources

### Documentation
- Framer Motion: https://www.framer.com/motion/
- Lucide Icons: https://lucide.dev/
- Tailwind CSS: https://tailwindcss.com/docs

### Common Issues
- If stuck, check browser console for errors
- Verify all dependencies are installed
- Ensure Tailwind CSS is properly configured
- Check that section IDs match exactly

---

## License & Attribution

This component was created for Jam Social Media. Feel free to use and modify for your projects.

**Original Source**: `/mnt/HC_Volume_103321268/isolated-projects/Jam-social/src/components/ui/ServiceNavSidebar.tsx`

---

**Last Updated**: October 26, 2025
**Component Version**: 1.0
**Tested With**: React 18+, Astro 4+, Next.js 14+
