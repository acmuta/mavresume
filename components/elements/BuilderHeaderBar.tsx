"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { FaDiscord, FaGithub } from "react-icons/fa";

export const BuilderHeaderBar = () => {
  const [activeSection, setActiveSection] = useState("personal-info");

  useEffect(() => {
    const sections = document.querySelectorAll("div[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.35, // works better with animations
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <Fade
      direction="down"
      duration={500}
      className="relative w-full overflow-hidden"
    >
      {/* Header content */}
      <section className="relative flex items-center justify-between w-full p-6 z-10 bg-gradient-to-b from-[#101113] from-1% to-transparent">
        <Link
          href={"/"}
          className="text-xl w-1/2 md:w-1/4 text-center md:text-4xl font-bold mb-2 [mask-image:linear-gradient(to_bottom,black_40%,transparent)] [mask-size:100%_100%] [mask-repeat:no-repeat]"
        >
          MAV<span className="font-extralight">RESUME</span>
        </Link>

        <nav className="hidden md:flex w-fit font-semibold justify-center items-center gap-2">
          <h2
            className={`transition ${
              activeSection === "personal-info" ? "text-white" : "text-gray-500"
            }
            `}
          >
            Personal Info
          </h2>
          <ChevronRight />

          <h2
            className={`transition ${
              activeSection === "education" ? "text-white" : "text-gray-500"
            }`}
          >
            Education
          </h2>
          <ChevronRight />

          <h2
            className={`transition ${
              activeSection === "technical-skills"
                ? "text-white"
                : "text-gray-500"
            }`}
          >
            Technical Skills
          </h2>
          <ChevronRight />

          <h2
            className={`transition ${
              activeSection === "projects" ? "text-white" : "text-gray-500"
            }`}
          >
            Projects
          </h2>
          <ChevronRight />

          <h2
            className={`transition ${
              activeSection === "experience" ? "text-white" : "text-gray-500"
            }`}
          >
            Experience
          </h2>
        </nav>

        <div className="w-1/4 flex gap-4">
          <Link href="https://www.acmuta.com" className="flex items-center">
            <p className="font-bold text-[#51545c] hover:text-white transition cursor-pointer">
              Developed By ACM @ UTA
            </p>
          </Link>
          <Link href="https://discord.gg/WjrDwNn5es">
            <FaDiscord className="w-6 h-6 text-[#51545c] hover:text-white transition cursor-pointer mx-auto" />
          </Link>
          <Link href="https://github.com/acmuta/mavresume">
            <FaGithub className="w-6 h-6 text-[#51545c] hover:text-white transition cursor-pointer mx-auto" />
          </Link>
        </div>
      </section>
    </Fade>
  );
};
