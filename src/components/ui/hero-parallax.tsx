"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";



export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[2   00vh] bg-black overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20 mt-[-450px]">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full ">
      {/* Background Image */}
      {/* <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image/pexels-fauxels-3183183.jpg')`, // Replace with your image URL
        }}
      /> */}

  

  {/* Dark Overlay (optional for readability) */}
  {/* <div className="absolute inset-0 bg-black/75" /> */}

  {/* Geometric Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl" />
  </div>

  {/* Content Container */}
  <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
   
    {/* Main Heading */}
    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight text-balance">
      Connect with
      <span className="text-primary"> Industry <br /> Experts, </span>
      <span className="text-muted-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal">
        Who Drive Results
      </span>
    </h1>

    {/* Subheading */}
    <p className="text-lg sm:text-xl lg:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed text-pretty">
      Join a curated network of world-class professionals and unlock new opportunities for growth, collaboration,
      and innovation in your industry.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
      <button
        type="button"
        onClick={() => (user ? router.push('/community') : router.push('/register'))}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg overflow-hidden transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className="flex items-center gap-3">
          Start Connecting
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>

      <button onClick={()=> router.push('/services')} className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg overflow-hidden transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-ring">
        <span className="flex items-center gap-3">
          Browse Experts
        </span>
      </button>
    </div>
  </div>
</section>

  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <a
        // href={product.link}
        className="block group-hover/product:shadow-2xl "
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};

export const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/1.jpeg",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/3.jpeg",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/5.jpeg",
  },
 
  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/6.jpeg",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/7.jpeg",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/11.jpeg",
  },
 
  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/12.jpeg",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/14.jpeg",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/15.jpeg",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/16.jpeg",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/8.jpeg",
  },
 
  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/10.jpeg",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
     "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/17.jpeg",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/18.jpeg",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "/image/WhatsApp Unknown 2025-10-21 at 1.32.46 AM/19.jpeg",
  },
];
