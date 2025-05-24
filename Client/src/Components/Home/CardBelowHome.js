import React from "react";
import {
  ShoppingCart,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Settings,
} from "lucide-react";

const features = [
  {
    Icon: ShoppingCart,
    title: "Diverse Listings",
    desc: "Post items, services or tutoring with flexible pricing.",
  },
  {
    Icon: MessageCircle,
    title: "Real-Time Chat",
    desc: "Negotiate and share extra photos in-app.",
  },
  {
    Icon: MapPin,
    title: "Safe Meetups",
    desc: "Pin campus landmarks for public exchanges.",
  },
  {
    Icon: ShieldCheck,
    title: "Community Moderation",
    desc: "Student-admins approve listings and enforce rules.",
  },
  {
    Icon: Settings,
    title: "AI Price Advisor",
    desc: "Data-backed price suggestions for your listings.",
  },
];

export default function CardBelowHome() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {features.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <Icon size={32} className="text-indigo-600 mb-4" />
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
