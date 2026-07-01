import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LoginForm } from './LoginForm';
import { InfiniteMarquee } from "../../utilities/components/InfiniteMarquee";
import { CircleAnimation } from '../../utilities/components/CircleAnimation';

export const Login = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.from(leftColRef.current, {
          x: -50,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
        gsap.from(rightColRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: 0.2,
        });
      }, containerRef);
    } catch (e) {
      // Animasi gagal, UI tetap berfungsi
    }
    return () => ctx?.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid lg:grid-cols-5 md:grid-cols-1 min-h-screen"
    >
      {/* Kolom Kiri — Branding */}
      <div
        ref={leftColRef}
        className="lg:flex hidden col-span-3 bg-primary flex flex-col space-y-6 justify-center"
      >
        <div className=" flex justify-between items-center px-6">
          <div className="flex gap-1">
            {[...Array(2)].map((_, i) => {
              return (
                <>
                  <CircleAnimation key={i} index={i} className="bg-secondary" />
                </>
              );
            })}
          </div>
          <p className="text-secondary font-subHeading text-md">
            Just Task
          </p>
        </div>
        <InfiniteMarquee
          text="TaskFlow Manager"
          speed={50}
          containerClassName=""
          textClassName="text-5xl sm:text-7xl xl:text-8xl text-third"
        />
        <div className="flex justify-center items-center">
          <p className="w-[70%] text-secondary font-subHeading text-md text-center">
            Minimal berprogres dikit hari ini, biar gak nyesel belakangan
          </p>
        </div>
      </div>

      {/* Kolom Kanan — Form Login */}
      <div
        ref={rightColRef}
        className="col-span-2 bg-fourty flex flex-col justify-between"
      >
        <InfiniteMarquee
          text="TaskFlow Manager"
          speed={60}
          containerClassName=""
          textClassName="md:hidden outlineTypo text-5xl sm:text-7xl xl:text-8xl text-primary"
        />
        <div className="">
          <div className="px-6">
            <p className=" text-2xl font-bold text-primary text-right">
              What's Up Peeps
            </p>
            <p className="text-md text-primary/60 text-right">
              Welcome back
            </p>
          </div>
          <div className="px-6">
            <LoginForm />
          </div>
        </div>
        <InfiniteMarquee
          text="TaskFlow Manager"
          speed={40}
          containerClassName=""
          textClassName="md:hidden outlineTypo text-5xl sm:text-7xl xl:text-8xl text-primary"
        />
      </div>
    </div>
  );
};
