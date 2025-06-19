import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const { scene, error } = useGLTF("./desktop_pc/scene.gltf", true);

  if (error) {
    console.error("Error loading GLTF model:", error);
    return null;
  }

  return (
    <mesh>
      <hemisphereLight intensity={isMobile ? 0.1 : 0.15} groundColor="black" />
      {isMobile ? null : (
        <spotLight
          position={[-20, 50, 10]}
          angle={0.12}
          penumbra={1}
          intensity={0.8}
          castShadow={false} // Disable shadows on mobile
          shadow-mapSize={512} // Reduced shadow map size
        />
      )}
      <pointLight intensity={isMobile ? 0.5 : 1} />
      <primitive
        object={scene}
        scale={isMobile ? 0.6 : 0.75} // Slightly smaller scale on mobile
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="always" // Use 'always' for smoother mobile rendering
      shadows={!isMobile} // Disable shadows on mobile
      dpr={isMobile ? [1, 1] : [1, 1.5]} // Lower DPR on mobile
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, antialias: !isMobile }} // Disable antialiasing on mobile
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;