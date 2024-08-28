"use client";

import { EcsProvider } from "@/context/EcsContext";

export default function Home() {

  return (
    <EcsProvider>
       <div className="absolute left-5 top-5 h-auto w-auto">
        <img className="w-40" src="images/division3d_new.svg" />
      </div>
    </EcsProvider>
  );
}
