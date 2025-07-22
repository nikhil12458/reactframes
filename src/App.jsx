import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  // current index and max index
  const [vals, setVals] = useState({
    currentIndex: 1,
    maxIndex: 422
  })
  const canvasRef = useRef(null);
  const imageObjects = useRef([]);
  const imagesLoaded = useRef(0);
  
  // preload images
  useEffect(() => {
    preloadImages();
  })
  
  const preloadImages = () => {
    for(let i = 0; i<=vals.maxIndex; i++){
      const imageUrl = `./imgs/frame_${i.toString().padStart(4, "0")}.jpg`;
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        imagesLoaded.current++;
        if(imagesLoaded.current === vals.maxIndex){
          // sho the first image
          loadImage(vals.currentIndex);
        }
      };
      imageObjects.current.push(img);
    }
  };

  // load images 
  const loadImage = (index) => {
    if(index >= 0 && index < vals.maxIndex) {
      const img = imageObjects.current[index];
      const canvas = canvasRef.current;
      
      if(canvas && img){
        let ctx = canvas.getContext("2d");
        if(ctx){
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const scaleX = canvas.width / img.width;
          const scaleY = canvas.height / img.height;
          const scale = Math.max(scaleX, scaleY);

          const newWidth = img.width * scale;
          const newHeight = img.height * scale;

          const offsetX = (canvas.width - newWidth) / 2;
          const offsetY = (canvas.height - newHeight) / 2;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

          setVals((prevVals)=>({
            ...prevVals, currentIndex: index
          }))
        }
      }
    }
  }

  const parentDivRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger:{
        trigger: parentDivRef.current,
        start: "top top",
        scrub: 2,
        // markers: true,
        end: "bottom bottom",
      }
    });
    tl.to(vals, {
      currentIndex: vals.maxIndex,
      onUpdate: () => {
        loadImage(Math.floor(vals.currentIndex));
      }
    })
  })

  return (
    <div className='w-full bg-zinc-900'>
      <div ref={parentDivRef} className='w-full h-[800vh] '>
        <div className="w-full h-screen sticky top-0 left-0">
          <canvas ref={canvasRef} className='w-full h-screen '></canvas>
        </div>
      </div>
    </div>
  )
}

export default App
