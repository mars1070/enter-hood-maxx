import React from "react";
import Hero from "@/components/hood/Hero";
import WhatIs from "@/components/hood/WhatIs";
import Lore from "@/components/hood/Lore";
import CultArchive from "@/components/hood/CultArchive";
import Commandments from "@/components/hood/Commandments";
import HoodStockBanner from "@/components/hood/HoodStockBanner";
import HoodmaxxStudio from "@/components/hood/HoodmaxxStudio";
import WildGallery from "@/components/hood/WildGallery";
import Manifesto from "@/components/hood/Manifesto";
import FinalSection from "@/components/hood/FinalSection";
import ScanningLine from "@/components/hood/ScanningLine";
import FileFolderMenu from "@/components/hood/FileFolderMenu";
import ScrollProgress from "@/components/hood/ScrollProgress";

export default function Home() {
  return (
    <div className="relative bg-hood-black text-white selection:bg-hood-green selection:text-black">
      <ScrollProgress />
      <ScanningLine />
      <FileFolderMenu />
      <Hero />
      <WhatIs />
      <Lore />
      <CultArchive />
      <Commandments />
      <HoodStockBanner />
      <HoodmaxxStudio />
      <WildGallery />
      <Manifesto />
      <FinalSection />
    </div>
  );
}