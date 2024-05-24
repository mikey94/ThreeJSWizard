
import { Suspense, useState } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
// import { CustomLoader } from './components/CustomLoader'
import CustomLoader from './components/CustomLoader'
import Bridge from './models/Bridge'
import { Html } from '@react-three/drei';
import React from 'react'

function App() {
  const [isRotating, setIsRotating] = useState(false);
  const [, setCurrentStage] = useState<number|null>(1);
  const adjustBridgeForScreenSize = () => {
    let screenScale
    const screenPosition = [0, 0, -35]
    const rotation = [2, 3.15, 11]
    if(window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9]  
    }else {
      screenScale = [1,1,1]
    }
    return [screenScale, screenPosition, rotation]
  }
  const [bridgeScale, bridgePosition, bridgeRotation] = adjustBridgeForScreenSize();
  return (
    <div>
    <section 
    style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: 'black', cursor: isRotating ? 'grabbing' : 'grab'}}>
      <Canvas
        camera={{ near: 0.2, far: 1000 }}
        style={{ width: '100%' }}
      >
          <Suspense fallback={<CustomLoader/>}>
            <directionalLight position={[1,1,1]} intensity={2} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 5, 10]} intensity={2} />
            <spotLight
              position={[0, 50, 10]}
              angle={0.15}
              penumbra={1}
              intensity={2}
            />
            <hemisphereLight groundColor="#000000" intensity={1} />
            <Bridge 
              position={bridgePosition}
              scale={bridgeScale}
              rotation={bridgeRotation}
              isRotating={isRotating}
              setIsRotating={setIsRotating}
              setCurrentStage={setCurrentStage}
            />
            <Html>
              <h1 style={{ display: 'flex', position: 'relative', width: 800, color: 'green', marginTop: 200, marginLeft: -350 }}>Welcome to Island of Wizardry!</h1>
            </Html>
          </Suspense>
      </Canvas>
    </section>
    </div>
  )
}

export default App
