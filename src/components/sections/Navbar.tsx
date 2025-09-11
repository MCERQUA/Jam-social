"use client";

import React, { useState } from "react";
import { Menu, MenuItem, HoveredLink } from "../ui/navbar-menu";

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