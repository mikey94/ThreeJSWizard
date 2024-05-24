import React from 'react'
import { Html } from '@react-three/drei';

const CustomLoader = () => {
  return (
    <Html>
      <div style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
        <div style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'blue', animation: 'spin 2s linear infinite'}}/>
      </div>
    </Html>
  )
}

export default CustomLoader
