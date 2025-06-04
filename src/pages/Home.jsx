import { useEffect, useRef, useState } from 'react';
import '../index.css';
import Project from "../components/project";
import { ArrowDown } from 'phosphor-react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import MergedOrbAndTags from '../components/MergedOrbAndTags';

export default function Home() {
  const bubbleRef = useRef(null);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const interBubble = bubbleRef.current;
    if (!interBubble) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(move);
    }

    const onMouseMove = (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    const handleScroll = () => {
      setAtTop(window.scrollY <= 10);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', handleScroll);
    move();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Background + Blur Effects */}
      <div className="gradient-bg fixed top-0 left-0 w-screen h-screen z-[-1]">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div className="interactive" ref={bubbleRef}></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-row items-center justify-center text-white z-10 relative">
        {/* Left: Info */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start px-4 md:px-12 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 md:p-12 max-w-3xl shadow-xl text-white/90">
            <h1 className="font-anton text-5xl md:text-7xl mb-2 text-white">Leonard Keenan</h1>
            <h2 className="text-xl md:text-2xl text-purple-300 font-semibold mb-4">System Professional</h2>
            <p className="text-base md:text-lg leading-relaxed text-white/80">
              Building secure systems, smart tools, and clean interfaces.
              <br className="hidden sm:inline" />
              Always learning, always improving.
            </p>
          </div>
        </div>

        {/* Right: Orb */}
        <div className="w-1/2 h-[900px] flex items-center justify-center">
          <Canvas camera={{ position: [0, 0, 900], fov: 45, near: 0.1, far: 5000 }}>
            <ambientLight />
            <Suspense fallback={null}>
              <MergedOrbAndTags />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Project link="https://liminal-eosin.vercel.app/" image="/images/liminal.png" title="Liminal" description="a game made in three.js" />
          <Project link="https://time-traveler.vercel.app/" image="/images/time-traveler.png" title="Time Traveler" description="do you have the same song on repeat... i do." />
          <Project link="https://bindaddy-util.vercel.app/" image="/images/bd-util.png" title="BD-Util" description="client management tool for bindaddy" />
          <Project link="https://github.com/CanadianBleach/Unity-Weapon-Package" image="/images/unity-weapons-package.png" title="Unity Weapons Package" description="unity weapon management utility" />
        </div>
      </section>

      {/* Down Arrow */}
      <div
        className={`fixed bottom-4 left-1/2 m-4 -translate-x-1/2 z-20 text-white transition-opacity duration-500 ${
          atTop ? 'opacity-100' : 'opacity-0'
        } animate-bounce`}
      >
        <ArrowDown size={44} />
      </div>
    </>
  );
}
