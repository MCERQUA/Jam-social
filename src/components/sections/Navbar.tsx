"use client";

import React, { useState } from "react";
import { Menu, MenuItem, HoveredLink, ProductItem } from "../ui/navbar-menu";

function Navbar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative w-full flex items-center justify-center">
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#hero">Welcome</HoveredLink>
            <HoveredLink href="#about">About Us</HoveredLink>
            <HoveredLink href="#why-choose-us">Why Choose Us</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Features">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Content Creation"
              href="#features"
              src="/icons/content-creation.png"
              description="Professional content that drives engagement"
            />
            <ProductItem
              title="Smart Scheduling"
              href="#features"
              src="/icons/scheduling.png"
              description="AI-powered posting optimization"
            />
            <ProductItem
              title="Advanced Analytics"
              href="#features"
              src="/icons/analytics.png"
              description="Data-driven insights and reporting"
            />
            <ProductItem
              title="Multi-Platform Support"
              href="#features"
              src="/icons/platforms.png"
              description="Manage all your social networks"
            />
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#services">Content Strategy</HoveredLink>
            <HoveredLink href="#services">Social Media Management</HoveredLink>
            <HoveredLink href="#services">Influencer Partnerships</HoveredLink>
            <HoveredLink href="#services">Paid Advertising</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Platforms">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#platforms">Instagram</HoveredLink>
            <HoveredLink href="#platforms">LinkedIn</HoveredLink>
            <HoveredLink href="#platforms">TikTok</HoveredLink>
            <HoveredLink href="#platforms">Facebook</HoveredLink>
            <HoveredLink href="#platforms">YouTube</HoveredLink>
            <HoveredLink href="#platforms">X (Twitter)</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Team">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#team">Our Experts</HoveredLink>
            <HoveredLink href="#team">Leadership</HoveredLink>
            <HoveredLink href="#team">Careers</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Contact">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#contact">Get In Touch</HoveredLink>
            <HoveredLink href="#contact">Request Quote</HoveredLink>
            <HoveredLink href="#contact">Support</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Navbar;