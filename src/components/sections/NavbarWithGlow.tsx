"use client";

import React from "react";
import Navbar from "./Navbar";
import { AnimatedBorder } from "../ui/animated-border";

function NavbarWithGlow() {
  return (
    <AnimatedBorder 
      className="w-fit mx-auto"
      borderRadius="rounded-full"
      glowIntensity="high"
    >
      <Navbar />
    </AnimatedBorder>
  );
}

export default NavbarWithGlow;