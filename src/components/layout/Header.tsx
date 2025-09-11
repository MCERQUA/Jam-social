"use client";

import React from "react";
import NavbarWithGlow from "../sections/NavbarWithGlow";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="px-4 py-4">
        <NavbarWithGlow />
      </div>
    </header>
  );
};

export default Header;