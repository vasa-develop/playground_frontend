'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './page.module.css';

export default function ElectronDensity() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create electron density visualization
    const createElectronDensity = () => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
        wireframe: false
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Add wireframe
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 })
      );
      scene.add(wireframe);
    };

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Set camera position
    camera.position.z = 5;

    // Create the visualization
    createElectronDensity();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };

    const handleMouseDown = () => {
      isDragging = true;
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y
        };

        scene.rotation.y += deltaMove.x * 0.01;
        scene.rotation.x += deltaMove.y * 0.01;
      }

      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(2, Math.min(10, camera.position.z));
    };

    // Add event listeners
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleWheel);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleWheel);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        FermiNet Electron Density Visualization<br/>
        Use mouse to rotate, scroll to zoom
      </div>
      <div ref={containerRef} />
    </div>
  );
}
