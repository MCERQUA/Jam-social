import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Film } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

interface Package {
  name: string;
  price: string;
  tier: 'base' | 'advanced' | 'full';
  stripeBuyButtonId: string;
  features: {
    category: string;
    items: string[];
  }[];
  popular?: boolean;
}

const STRIPE_PUBLISHABLE_KEY = "pk_live_51HpgGeAsB00o6gkbydLQYxUZPk1qt5MNmS3RNySpwOSgj7N76qCJUqxGLuSauHw7TMVyRVnGBKqOf4FsBHsdRcGk00aIqek4Yr";

const packages: Package[] = [
  {
    name: "Company Base Character Setup",
    price: "$500",
    tier: 'base',
    stripeBuyButtonId: "buy_btn_1SC9EwAsB00o6gkbBN5Ik34n",
    features: [
      {
        category: "Character Creation",
        items: [
          "Company character creation image on greenscreen background"
        ]
      },
      {
        category: "Script/Line Suggestions",
        items: [
          "15x 8-second 2-line script suggestions",
          "10x 8-second holiday script suggestions"
        ]
      },
      {
        category: "Asset Creation",
        items: [
          "Both selected 2-liner scripts",
          "All selected holiday lines"
        ]
      },
      {
        category: "Content Creation",
        items: [
          "8 random logo animation attempts",
          "3 clips with 2-line script",
          "3 holiday video clips (Valentine's, July 4th, Christmas)"
        ]
      }
    ]
  },
  {
    name: "Advanced Setup",
    price: "$750",
    tier: 'advanced',
    popular: true,
    stripeBuyButtonId: "buy_btn_1SC9JAAsB00o6gkbWhss5fvX",
    features: [
      {
        category: "Everything in Basic Setup Plus",
        items: []
      },
      {
        category: "Vehicle Branding Assets",
        items: [
          "4 truck/vehicle images with branding",
          "All angles: side, front, back, angled"
        ]
      },
      {
        category: "Background Scenes",
        items: [
          "Office/reception desk scene",
          "Outside shop/business street view",
          "Outside home streetview",
          "Cartoon jobsite image"
        ]
      },
      {
        category: "Additional Content",
        items: [
          "Character popup animation",
          "4 additional logo animations",
          "Multiple location video clips",
          "Full combined video compilation"
        ]
      }
    ]
  },
  {
    name: "Full Setup Package",
    price: "$1,000",
    tier: 'full',
    stripeBuyButtonId: "buy_btn_1SC9NVAsB00o6gkbyXhPkmJJ",
    features: [
      {
        category: "Everything in Advanced Setup Plus",
        items: []
      },
      {
        category: "Premium Character Assets",
        items: [
          "Character peeking over ledge",
          "Waving & thumbs up animations",
          "Phone answering animation",
          "Call-to-action gestures",
          "Surprised expressions"
        ]
      },
      {
        category: "3D Branding",
        items: [
          "3D version of logo",
          "Character leaning on 3D logo"
        ]
      },
      {
        category: "Extended Content",
        items: [
          "8 additional logo animations",
          "4 additional scripted clips",
          "4 more holiday videos",
          "St. Patrick's, Memorial, Veterans, Halloween"
        ]
      }
    ]
  }
];

const VideoPackages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);

  useEffect(() => {
    const checkStripeLoaded = setInterval(() => {
      if (document.querySelector('script[src*="stripe.com"]')) {
        setIsStripeLoaded(true);
        clearInterval(checkStripeLoaded);
      }
    }, 100);

    return () => clearInterval(checkStripeLoaded);
  }, []);

  useEffect(() => {
    // Add styles to control Stripe button appearance
    const style = document.createElement('style');
    style.textContent = `
      .stripe-button-wrapper {
        margin-top: 1rem;
        min-height: 48px;
      }
      stripe-buy-button {
        display: block;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#1A0E2E] to-[#0A0A0A]" />

      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="w-8 h-8 text-purple-500" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Character Video Creation Packages
            </h2>
            <Film className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional character animation and video content creation for your brand
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
              onMouseEnter={() => setSelectedPackage(pkg.name)}
              onMouseLeave={() => setSelectedPackage(null)}
            >
              {pkg.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Star className="w-4 h-4" fill="currentColor" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className={`
                relative h-full rounded-2xl p-8
                bg-gradient-to-br from-[#1A0E2E]/50 to-[#2D1B69]/30
                backdrop-blur-xl border
                ${pkg.popular
                  ? 'border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.3)]'
                  : 'border-white/10'
                }
                transition-all duration-300
                ${selectedPackage === pkg.name ? 'scale-105 shadow-2xl' : ''}
              `}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {pkg.price}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx}>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">
                          {feature.category}
                        </h4>
                        {feature.items.length > 0 && (
                          <ul className="space-y-2">
                            {feature.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="stripe-button-wrapper">
                    <stripe-buy-button
                      buy-button-id={pkg.stripeBuyButtonId}
                      publishable-key={STRIPE_PUBLISHABLE_KEY}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoPackages;