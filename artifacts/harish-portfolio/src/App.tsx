import CustomCursor from './components/CustomCursor';
import ObjectZoomPortfolio from './components/ObjectZoomPortfolio';
import AIAvatar from './components/AIAvatar';
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <>
      {/* Precision custom glowing cursor for desktop */}
      <CustomCursor />

      {/* Primary: Real 3D WebGL Camera Zoom & Orbit Portfolio */}
      <ObjectZoomPortfolio />

      {/* Saha AI Assistant */}
      <AIAvatar />
      <Toaster />
    </>
  );
}
