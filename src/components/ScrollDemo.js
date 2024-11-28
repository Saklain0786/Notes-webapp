import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation.tsx";


export function HeroScrollDesign({title1 , title2 , img}) {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              {title1} <br />
              <span className="text-2xl md:text-[3rem] font-bold mt-1 leading-none">
               {title2}
              </span>
            </h1>
          </>
        }
      >
        <img
          src={`${img}`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
