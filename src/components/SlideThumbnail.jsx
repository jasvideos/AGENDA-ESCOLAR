import React, { useEffect, useRef } from 'react';
import { renderSlideToCanvas } from '../utils/renderer';
import QRCode from 'qrcode';

const SlideThumbnail = ({ slide, width = 200, height = 112 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      
      await renderSlideToCanvas(ctx, slide, {
        width,
        height,
        origW: 960,
        origH: 540,
        QRCode
      });
    };

    render();
    return () => { isMounted = false; };
  }, [slide, width, height]);

  return (
    <div style={{ 
      width, 
      height, 
      borderRadius: '6px', 
      overflow: 'hidden', 
      border: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: '#000',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
    }}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        style={{ display: 'block', width: '100%', height: '100%' }} 
      />
    </div>
  );
};

export default SlideThumbnail;
