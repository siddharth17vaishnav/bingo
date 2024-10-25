"use client";

import dynamic from "next/dynamic";
const Board = dynamic(() => import("@/section/Board"), { ssr: false });
export default function BingoApp() {
  return <Board />;
}
