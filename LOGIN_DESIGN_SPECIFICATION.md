# Login Page Design Specification
## For Chat Subdomain - Matching Jam Social Media Hero Aesthetic

---

## 🎨 Visual Design Overview

### Core Visual Elements
The login page should replicate the hero section's sophisticated dark theme with these key elements:

#### 1. **Aurora Background (OGL WebGL)**
```javascript
// Aurora Configuration
{
  colorStops: ["#a855f7", "#ec4899", "#3b82f6"], // Purple → Pink → Blue
  blend: 0.9,
  amplitude: 1.5,
  speed: 0.35,
  alpha: true,
  premultipliedAlpha: true
}
```

**Alternative for Performance**: If Aurora causes performance issues, use static gradient fallback:
```css
/* Fallback Gradient Layers */
.background-gradient {
  /* Layer 1 */
  background: linear-gradient(to bottom right, 
    rgba(168, 85, 247, 0.4),  /* purple-900/40 */
    rgba(236, 72, 153, 0.3),  /* pink-900/30 */
    rgba(59, 130, 246, 0.4)   /* blue-900/40 */
  );
  
  /* Layer 2 (overlapping) */
  background: linear-gradient(to top right,
    rgba(59, 130, 246, 0.3),  /* blue-900/30 */
    rgba(168, 85, 247, 0.2),  /* purple-900/20 */
    rgba(236, 72, 153, 0.3)   /* pink-900/30 */
  );
}
```

#### 2. **Background Overlays**
```css
/* Gradient overlay for depth */
.overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),   /* from-black/10 */
    rgba(0, 0, 0, 0.3),   /* via-black/30 */
    rgba(0, 0, 0, 0.7)    /* to-black/70 */
  );
  z-index: 5;
}
```

---

## 📐 Layout Structure

### Container Hierarchy
```html
<section class="login-container">
  <!-- Aurora/Gradient Background -->
  <div class="aurora-background"></div>
  
  <!-- Overlay -->
  <div class="gradient-overlay"></div>
  
  <!-- Content Container -->
  <div class="content-wrapper">
    <!-- Logo/Title Section -->
    <div class="header-section">
      <!-- Animated Title -->
    </div>
    
    <!-- Login Form Card -->
    <div class="login-card">
      <!-- Form Content -->
    </div>
  </div>
</section>
```

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

---

## 🎭 Title Animation (WaveText Component)

### Implementation Details
```javascript
// WaveText Configuration for "Jam AI Chat"
{
  text: "Jam AI Chat",
  className: "text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6",
  delay: 0.2,
  gradientWords: ["Jam"], // Apply gradient to "Jam"
  repeatDelay: 4
}

// Animation Properties
const waveAnimation = {
  y: [0, -15, 0],        // Vertical wave motion
  scale: [1, 1.2, 1],    // Scaling effect
  duration: 0.6,
  ease: "easeInOut",
  repeat: Infinity,
  repeatDelay: 4,
  staggerChildren: 0.03  // Letter-by-letter animation
}

// Gradient for "Jam" word
.gradient-text {
  background: linear-gradient(to right, #ec4899, #a855f7, #ec4899);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}
```

---

## 🔐 Login Form Specifications

### Form Card Design
```css
.login-card {
  /* Glassmorphism effect */
  background: rgba(31, 41, 55, 0.5); /* gray-800 with 50% opacity */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(107, 114, 128, 0.2); /* gray-500 with 20% opacity */
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 400px;
  width: 100%;
}
```

### Form Elements

#### Input Fields
```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  background: rgba(17, 24, 39, 0.6); /* gray-900 with 60% opacity */
  border: 2px solid rgba(107, 114, 128, 0.3); /* gray-500 with 30% opacity */
  border-radius: 8px;
  color: #e5e7eb; /* gray-200 */
  font-size: 16px;
  transition: all 0.3s ease;
  
  /* Focus state */
  &:focus {
    outline: none;
    border-color: #a855f7; /* purple-500 */
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
    background: rgba(17, 24, 39, 0.8);
  }
  
  /* Chrome autofill styling */
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px rgba(17, 24, 39, 0.9) inset !important;
    -webkit-text-fill-color: #e5e7eb !important;
  }
}

/* Floating Labels */
.floating-label {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #9ca3af; /* gray-400 */
  transition: all 0.3s ease;
  pointer-events: none;
  
  /* Active state */
  &.active {
    top: -8px;
    left: 12px;
    font-size: 12px;
    background: rgba(31, 41, 55, 1);
    padding: 0 4px;
    color: #a855f7; /* purple-500 */
  }
}
```

#### Password Field Features
```html
<!-- Password field with toggle visibility -->
<div class="password-wrapper">
  <input 
    type="password" 
    id="password"
    autocomplete="current-password"
    aria-label="Password"
    required
  />
  <button type="button" class="toggle-password">
    <!-- Eye icon SVG -->
  </button>
</div>
```

#### Form Fields List
1. **Email Field**
   - Type: `email`
   - Autocomplete: `email`
   - Validation: Email format
   - Chrome password manager compatible

2. **Password Field**
   - Type: `password` (toggleable)
   - Autocomplete: `current-password`
   - Show/hide toggle button
   - Strength indicator (optional)

3. **Remember Me Checkbox**
   ```css
   .checkbox-wrapper {
     display: flex;
     align-items: center;
     gap: 8px;
     
     input[type="checkbox"] {
       width: 20px;
       height: 20px;
       accent-color: #a855f7;
     }
   }
   ```

---

## 🎯 Buttons Design

### Primary Login Button
```css
.btn-primary {
  width: 100%;
  padding: 12px 32px;
  background: linear-gradient(to right, #ec4899, #a855f7); /* pink-600 to purple-600 */
  color: white;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.3);
  
  &:hover {
    background: linear-gradient(to right, #db2777, #9333ea); /* pink-700 to purple-700 */
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(168, 85, 247, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

### Secondary Buttons
```css
.btn-secondary {
  padding: 10px 24px;
  background: transparent;
  color: #e5e7eb; /* gray-200 */
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  border: 2px solid rgba(107, 114, 128, 0.5); /* gray-500 */
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(55, 65, 81, 0.5); /* gray-700 with 50% opacity */
    border-color: rgba(156, 163, 175, 0.5);
  }
}
```

---

## 🔗 Additional UI Elements

### Social Login Options
```html
<div class="social-login-section">
  <div class="divider">
    <span>Or continue with</span>
  </div>
  
  <div class="social-buttons">
    <button class="social-btn google">
      <!-- Google Icon -->
      <span>Google</span>
    </button>
    <button class="social-btn github">
      <!-- GitHub Icon -->
      <span>GitHub</span>
    </button>
  </div>
</div>
```

### Links Section
```html
<div class="form-links">
  <a href="/forgot-password" class="link">Forgot password?</a>
  <span class="separator">•</span>
  <a href="/signup" class="link">Create account</a>
</div>
```

### Link Styles
```css
.link {
  color: #a78bfa; /* violet-400 */
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #c4b5fd; /* violet-300 */
    text-decoration: underline;
  }
}
```

---

## 🚀 Performance Optimizations

### Recommended Implementations
1. **Lazy load Aurora background** - Initialize after form renders
2. **Use CSS containment** for animation performance
3. **Implement request idle callback** for non-critical animations
4. **Preconnect to auth endpoints**
5. **Use passive event listeners** for scroll/touch events

### Fallback for Low-End Devices
```javascript
// Detect performance capabilities
const supportsWebGL = (() => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch(e) {
    return false;
  }
})();

// Use static gradient if WebGL not supported
if (!supportsWebGL || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Use static gradient background
} else {
  // Initialize Aurora
}
```

---

## 📱 Responsive Behavior

### Mobile Optimizations
- Remove Aurora on mobile for performance
- Simplify wave text animation
- Stack form elements vertically
- Increase touch target sizes to 44x44px minimum
- Add appropriate spacing for thumb reach

### Tablet Adjustments
- Reduce Aurora amplitude
- Center form with max-width
- Maintain horizontal button layout

### Desktop Enhancements
- Full Aurora effect
- Wave text with full animation
- Side-by-side layout options
- Hover states on all interactive elements

---

## ♿ Accessibility Requirements

### WCAG 2.1 AA Compliance
1. **Color Contrast**
   - Text on background: minimum 4.5:1
   - Large text: minimum 3:1
   - Interactive elements: minimum 3:1

2. **Keyboard Navigation**
   - All elements keyboard accessible
   - Visible focus indicators
   - Logical tab order
   - Skip links if needed

3. **Screen Reader Support**
   - Proper ARIA labels
   - Form field descriptions
   - Error announcements
   - Loading states

4. **Form Validation**
   - Clear error messages
   - Inline validation feedback
   - Success confirmations
   - Required field indicators

---

## 🔒 Security Considerations

### Best Practices
1. **HTTPS only** - Enforce SSL
2. **CSRF tokens** - Include in form submission
3. **Rate limiting** - Implement on backend
4. **Password requirements** - Clear visual indicators
5. **Secure cookie settings** - HttpOnly, Secure, SameSite
6. **Content Security Policy** - Restrict resource loading
7. **Autocomplete attributes** - Proper values for password managers

---

## 🎨 Color Palette

```css
:root {
  /* Primary Colors */
  --purple-500: #a855f7;
  --purple-600: #9333ea;
  --purple-700: #7e22ce;
  --purple-900: #581c87;
  
  --pink-500: #ec4899;
  --pink-600: #db2777;
  --pink-700: #be185d;
  --pink-900: #831843;
  
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-900: #1e3a8a;
  
  /* Neutral Colors */
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Semantic Colors */
  --error: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;
  --info: #3b82f6;
}
```

---

## 📦 Dependencies

### Required Libraries
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",  // For animations
    "ogl": "^1.0.0",              // For Aurora WebGL effect
    "react": "^19.0.0",           // UI framework
    "tailwindcss": "^4.0.0"       // Styling
  }
}
```

### Optional Enhancements
- `react-hook-form` - Form validation
- `zod` - Schema validation
- `react-hot-toast` - Notifications
- `@radix-ui/react-checkbox` - Accessible checkbox

---

## 🔄 State Management

### Form States
```typescript
interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  showPassword: boolean;
}
```

### Animation States
```typescript
interface AnimationState {
  titleAnimationComplete: boolean;
  formVisible: boolean;
  auroraIntensity: number;
}
```

---

## 📝 Implementation Checklist

- [ ] Set up base HTML structure
- [ ] Implement Aurora/gradient background
- [ ] Add gradient overlay layers
- [ ] Create login card with glassmorphism
- [ ] Implement WaveText animation for title
- [ ] Style form inputs with floating labels
- [ ] Add password visibility toggle
- [ ] Implement Chrome password manager compatibility
- [ ] Style primary and secondary buttons
- [ ] Add social login options
- [ ] Create forgot password/signup links
- [ ] Implement form validation
- [ ] Add loading states
- [ ] Test responsive design
- [ ] Verify accessibility compliance
- [ ] Optimize performance
- [ ] Test browser compatibility
- [ ] Implement security headers

---

## 🎯 Key Implementation Notes

1. **Maintain Brand Consistency**: The login page should feel like a natural extension of the main Jam Social Media site
2. **Performance First**: Aurora is beautiful but optional - always provide fallback
3. **Security Priority**: Never compromise security for aesthetics
4. **Accessibility Always**: Every user should be able to log in easily
5. **Progressive Enhancement**: Start with a functional form, then add enhancements

---

This specification provides a complete blueprint for implementing a login page that matches your Jam Social Media hero section's aesthetic while maintaining all the functionality expected from a modern, secure login interface.