import Link from "next/link";
import React from "react";

type Props = {};

export default function Footer({}: Props) {
  return (
    <nav className="flex items-end h-96 bg-slate-400 py-16">
      <div>
        <ul>
          <li>
            <Link href={"/"}>Home</Link>
          </li>
        </ul>
        <div>
          <p>Copyright@</p>
        </div>
      </div>
    </nav>
  );
}
