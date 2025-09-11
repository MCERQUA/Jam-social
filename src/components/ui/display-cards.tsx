"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
  className?: string;
}

const DisplayCard: React.FC<DisplayCardProps & { style?: React.CSSProperties }> = ({
  className,
  icon,
  title,
  description,
  date,
  iconClassName,
  titleClassName,
  style,
}) => {
  return (
    <div
      className={cn(
        "h-36 w-[22rem] select-none -skew-y-[8deg] rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm p-4 flex flex-col justify-between",
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {icon && (
            <div className={cn("flex-shrink-0", iconClassName)}>
              {icon}
            </div>
          )}
          {title && (
            <h3 className={cn("font-semibold text-sm", titleClassName)}>
              {title}
            </h3>
          )}
        </div>
        {date && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {date}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">
          {description}
        </p>
      )}
    </div>
  );
};

const defaultCards: DisplayCardProps[] = [
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: "Featured",
    description: "Discover amazing content and connect with like-minded creators",
    date: "Just now",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
  },
  {
    icon: <Sparkles className="size-4 text-green-300" />,
    title: "Popular",
    description: "Most viewed and shared content this week across all categories",
    date: "2 hours ago",
    iconClassName: "text-green-500",
    titleClassName: "text-green-500",
  },
  {
    icon: <Sparkles className="size-4 text-purple-300" />,
    title: "New",
    description: "Fresh content just added to the platform from top creators",
    date: "5 minutes ago",
    iconClassName: "text-purple-500",
    titleClassName: "text-purple-500",
  }
];

export const DisplayCards: React.FC<DisplayCardsProps> = ({
  cards = defaultCards,
  className
}) => {
  const displayCards = cards.length > 0 ? cards : defaultCards;
  
  return (
    <div className={cn("relative", className)}>
      {/* Grid container with stacked effect */}
      <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
        {displayCards.map((cardProps, index) => (
          <DisplayCard
            key={index}
            {...cardProps}
            style={{
              gridArea: 'stack',
              zIndex: displayCards.length - index,
              transform: `translateY(${index * -8}px) translateX(${index * 4}px) skewY(-8deg)`,
            }}
            className={cn(
              cardProps.className,
              "transition-transform duration-300 hover:scale-105 hover:z-50"
            )}
          />
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-2 -left-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60 animate-pulse" />
      <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-40 animate-pulse delay-700" />
      <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-50 animate-pulse delay-1000" />
    </div>
  );
};

export default DisplayCards;