import Link from "next/link";
import React from "react";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiArrowUpRight,
} from "react-icons/fi";

const Footer = () => {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/deveshru2712",
      icon: <FiGithub className="w-5 h-5" />,
    },
    {
      name: "Twitter",
      url: "https://x.com/deveshru2712",
      icon: <FiTwitter className="w-5 h-5" />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/devesh-chandra-ru2712",
      icon: <FiLinkedin className="w-5 h-5" />,
    },
  ];

  return (
    <footer className="mb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto px-8 py-12 border border-slate-200/10 rounded-3xl bg-gradient-to-br from-black/80 to-slate-900/80 backdrop-blur-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6 max-w-md">
            <div className="flex items-center gap-3 group">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Blaze
              </h2>
              <span className="text-3xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                🔥
              </span>
            </div>
            <p className="text-slate-300/80 text-lg">
              The fastest way to connect with your audience. Lightning-fast
              messaging with premium security.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 w-full sm:w-auto">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Explore More
              </h3>
              <Link
                href="https://github.com/deveshru2712"
                className="group flex items-center gap-1 text-xl font-semibold text-white hover:text-transparent hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-400 bg-clip-text transition-all duration-300 w-fit"
                target="_blank"
                rel="noopener noreferrer"
              >
                Our Products
                <FiArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Connect With Us
              </h3>
              <ul className="flex flex-col gap-3">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <Link
                      href={social.url}
                      className="group flex items-center gap-3 text-lg font-medium text-white hover:text-transparent hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-400 bg-clip-text transition-all duration-300 w-fit"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-slate-300 group-hover:text-orange-400 transition-colors duration-300">
                        {social.icon}
                      </span>
                      {social.name}
                      <FiArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-6 border-t border-slate-800 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Blaze. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
