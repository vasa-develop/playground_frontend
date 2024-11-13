'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface CartPoleVisualizerProps {
  state?: {
    cart_position: number;
    cart_velocity: number;
    pole_angle: number;
    pole_velocity: number;
  };
}

const CartPoleVisualizer: React.FC<CartPoleVisualizerProps> = ({ state = { cart_position: 0, cart_velocity: 0, pole_angle: 0, pole_velocity: 0 } }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Constants for visualization
    const cartWidth = 50;
    const cartHeight = 30;
    const poleLength = 100;
    const cartY = height - cartHeight - 10;

    // Calculate cart position in canvas coordinates
    const cartX = (width / 2) + (state.cart_position * 50); // Scale position for visibility

    // Draw track
    ctx.beginPath();
    ctx.moveTo(0, cartY + cartHeight);
    ctx.lineTo(width, cartY + cartHeight);
    ctx.strokeStyle = '#666';
    ctx.stroke();

    // Draw cart
    ctx.fillStyle = '#4A5568';
    ctx.fillRect(cartX - cartWidth/2, cartY, cartWidth, cartHeight);

    // Draw pole
    ctx.beginPath();
    ctx.moveTo(cartX, cartY);
    const poleEndX = cartX + Math.sin(state.pole_angle) * poleLength;
    const poleEndY = cartY - Math.cos(state.pole_angle) * poleLength;
    ctx.lineTo(poleEndX, poleEndY);
    ctx.strokeStyle = '#2D3748';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw pole pivot
    ctx.beginPath();
    ctx.arc(cartX, cartY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2D3748';
    ctx.fill();
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    draw(context);
  }, [draw]);

  return (
    <div className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg shadow-sm"
      />
    </div>
  );
};

export default CartPoleVisualizer;
