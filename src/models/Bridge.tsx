/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { a } from '@react-spring/three'
import { Mesh, MeshBasicMaterial } from 'three'
import { GLTF } from 'three-stdlib'
import bridgeScene from '../assets/threeD/bridge.glb'

type ModelType = {
    isRotating: boolean,
    setIsRotating: (value: boolean) => void,
    setCurrentStage: (value: number | null) => void,
    [x: string]: any
}

type GLTFResult = GLTF & {
    nodes: {
      characters_STONE_a_0: Mesh
      characters_STONE_a_0_1: Mesh
      characters001_charcters_0: Mesh
      characters002_watermill_0: Mesh
      characters003_terrain_left_0: Mesh
      characters004_house_0: Mesh
      characters005_bridge_0: Mesh
      characters006_tree_0: Mesh
      characters007_bush_0: Mesh
      characters007_bush_0_1: Mesh
      characters008_water_0: Mesh
      characters009_terrain_right_0: Mesh
      characters010_wheat_0: Mesh
    }
    materials: {
      STONE_a: MeshBasicMaterial
      charcters: MeshBasicMaterial
      watermill: MeshBasicMaterial
      terrain_left: MeshBasicMaterial
      house: MeshBasicMaterial
      bridge: MeshBasicMaterial
      tree: MeshBasicMaterial
      bush: MeshBasicMaterial
      water: MeshBasicMaterial
      terrain_right: MeshBasicMaterial
      wheat: MeshBasicMaterial
    }
  }

const Model = ({isRotating, setIsRotating, setCurrentStage,...props}: ModelType) => {
  const bridgeRef = useRef<any>(null!) 
  const { nodes, materials } = useGLTF(bridgeScene) as GLTFResult
  const { gl, viewport } = useThree();
  const lastX = useRef(0)
  const rotationSpeed = useRef(0)
  const dampingFactor = 0.55

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    setIsRotating(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    lastX.current = clientX
  }
  const handlePointerUp = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    setIsRotating(false)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const delta = (clientX - lastX.current) / viewport!.width
    bridgeRef.current.rotation.z += delta * 0.01 * Math.PI
    lastX.current =  clientX
    rotationSpeed.current = delta * 0.01 * Math.PI
  }
  const handlePointerMove = (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    e.stopPropagation()
    e.preventDefault()

    if(isRotating) {
        handlePointerUp(e)
    }
  }

  const handleKeyDown = (e: any) => {
    if (e.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      bridgeRef.current.rotation.z += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (e.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      bridgeRef.current.rotation.z -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  const handleKeyUp = (e: any) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  const handleTouchStart = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }

  const handleTouchEnd = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }

  const handleTouchMove = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  
    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;
  
      bridgeRef.current.rotation.z += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  }

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointermove', handlePointerMove)
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);
    return () => {
        canvas.removeEventListener('pointerdown', handlePointerDown)
        canvas.removeEventListener('pointerup', handlePointerUp)
        canvas.removeEventListener('pointermove', handlePointerMove)
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchend", handleTouchEnd);
        canvas.removeEventListener("touchmove", handleTouchMove);
    }
  }, [handlePointerDown, handlePointerMove, handlePointerUp, gl])

  useFrame(() => {
    // If not rotating, apply damping to slow down the rotation (smoothly)
    if (!isRotating) {
      // Apply damping factor
      rotationSpeed.current *= dampingFactor;

      // Stop rotation when speed is very small
      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0.01;
      }

      bridgeRef.current.rotation.z += rotationSpeed.current;
    } else {
      // When rotating, determine the current stage based on island's orientation
      const rotation = bridgeRef.current.rotation.z;

      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  });
  return (
    <a.group {...props} ref={bridgeRef}>
            <mesh
              geometry={nodes.characters_STONE_a_0.geometry}
              material={materials.STONE_a}
            />
            <mesh
              geometry={nodes.characters_STONE_a_0_1.geometry}
              material={materials.STONE_a}
            />
            <mesh
              geometry={nodes.characters007_bush_0.geometry}
              material={materials.bush}
            />
            <mesh
              geometry={nodes.characters007_bush_0_1.geometry}
              material={materials.bush}
            />
          <mesh
            geometry={nodes.characters001_charcters_0.geometry}
            material={materials.charcters}
          />
          <mesh
            geometry={nodes.characters002_watermill_0.geometry}
            material={materials.watermill}
          />
          <mesh
            geometry={nodes.characters003_terrain_left_0.geometry}
            material={materials.terrain_left}
          />
          <mesh
            geometry={nodes.characters004_house_0.geometry}
            material={materials.house}
          />
          <mesh
            geometry={nodes.characters005_bridge_0.geometry}
            material={materials.bridge}
          />
          <mesh
            geometry={nodes.characters006_tree_0.geometry}
            material={materials.tree}
          />
          <mesh
            geometry={nodes.characters008_water_0.geometry}
            material={materials.water}
          />
          <mesh
            geometry={nodes.characters009_terrain_right_0.geometry}
            material={materials.terrain_right}
          />
          <mesh
            geometry={nodes.characters010_wheat_0.geometry}
            material={materials.wheat}
          />
    </a.group>
  )
}

useGLTF.preload('/baker_and_the_bridge.glb')

export default Model