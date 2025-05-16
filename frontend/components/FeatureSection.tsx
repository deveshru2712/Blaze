import React from "react";
import Card from "./Card";

const FeatureSection = () => {
  const blazeFeatures = [
    {
      icon: "🔒",
      title: "End-to-End Encryption",
      description:
        "Every message is secured with military-grade encryption. Not even Blaze can read them.",
      category: "Security",
    },
    {
      icon: "🤝",
      title: "Instant Friend Connections",
      description:
        "One-tap add friends via username, QR code, or contacts—no awkward requests.",
      category: "Social",
    },
    {
      icon: "⚡",
      title: "Blazing Fast Delivery",
      description:
        "Messages arrive in milliseconds, with smooth animations that feel like butter.",
      category: "Sweetness",
    },
    {
      icon: "👁️",
      title: "Self-Destructing Messages",
      description: "Set timers for sensitive chats to vanish without a trace.",
      category: "Security",
    },
    {
      icon: "🎨",
      title: "Expressive Emoji & Themes",
      description:
        "React with 3D emoji or pick a candy-colored theme for your chats.",
      category: "Sweetness",
    },
    {
      icon: "🖼️",
      title: "Instant Image Send",
      description:
        "Share high-quality images with lightning-fast uploads and previews.",
      category: "Social",
    },
  ];

  return (
    <div className="my-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto border rounded-2xl border-slate-400/30 p-6 sm:p-8 backdrop-blur-sm bg-white/5">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">
          Blaze Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blazeFeatures.map((feature, index) => (
            <Card
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              category={feature.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
