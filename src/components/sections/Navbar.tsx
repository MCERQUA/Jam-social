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
            <HoveredLink href="#features">Features</HoveredLink>
            <HoveredLink href="#videos">Videos</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#services">All Services</HoveredLink>
            <HoveredLink href="#services">Content Strategy</HoveredLink>
            <HoveredLink href="#services">Social Media Management</HoveredLink>
            <HoveredLink href="#services">Analytics & Reporting</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Platforms">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/platforms">All Platforms</HoveredLink>
            <HoveredLink href="/platforms#instagram">Instagram</HoveredLink>
            <HoveredLink href="/platforms#linkedin">LinkedIn</HoveredLink>
            <HoveredLink href="/platforms#tiktok">TikTok</HoveredLink>
            <HoveredLink href="/platforms#facebook">Facebook</HoveredLink>
            <HoveredLink href="/platforms#youtube">YouTube</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="More">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#team">Our Team</HoveredLink>
            <HoveredLink href="#connect">Connect Accounts</HoveredLink>
            <HoveredLink href="#contact">Contact Us</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Navbar;
