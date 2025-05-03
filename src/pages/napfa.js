import React from "react";

const equipmentList = [
  {
    name: "Sit and Reach Machine",
    description: "Measures hamstring and lower back flexibility. Ergonomic design for easy use and accurate results.",
    image: "/images/sitandreach.jpg"
  },
  {
    name: "Inclined Pull-Up Bar",
    description: "Adjustable height, stable steel construction, perfect for upper body strength tests.",
    image: "placeholder-image-url"
  },
  {
    name: "Standing Board Jump Mat",
    description: "Color-coded jump mats to measure explosive leg power with ease. Available in various materials.",
    image: "placeholder-image-url"
  },
  {
    name: "SBJ Draw on Floor / EDPM",
    description: "Durable slip-resistant flooring with pre-marked jump test indicators.",
    image: "placeholder-image-url"
  },
  {
    name: "Shuttle Run Mat & Blocks",
    description: "Shock-absorbing mat with high-grip surface and foam blocks for 10x4m shuttle run drills.",
    image: "placeholder-image-url"
  },
  {
    name: "Casio Stopwatch / SEIKO IPPT Stopwatch with Printer",
    description: "Precision timing devices, including SEIKO models that support automatic printing for results recording.",
    image: "placeholder-image-url"
  },
  {
    name: "School Sit-Up / Gym Mats",
    description: "High-density foam mats in various colors. Wipe-clean PVC surface, foldable options available.",
    image: "placeholder-image-url"
  },
  {
    name: "Mat Trolley",
    description: "Easy storage and transport for multiple gym mats – sturdy, rust-resistant frame.",
    image: "placeholder-image-url"
  },
  {
    name: "Customized Equipment",
    description: "Stainless steel handles, frames, and custom installations for unique training needs.",
    image: "placeholder-image-url"
  },
  {
    name: "Whistle / 3-Tone E-Whistle",
    description: "Classic and electronic whistles for timing, safety, and instruction.",
    image: "placeholder-image-url"
  },
  {
    name: "Number Tags",
    description: "Durable, visible number tags for participant tracking during events and assessments.",
    image: "placeholder-image-url"
  }
];

export default function Napfa() {
  return (
    <div className="p-6 max-w-7xl mx-auto container">
      <h1 className="text-3xl font-bold mb-6 text-center">NAPFA Equipment – Wholesale Supply</h1>
      <p className="mb-12 text-gray-700 text-center max-w-3xl mx-auto">
        Equip your facility with durable, high-performance NAPFA test equipment. Bulk pricing available for schools and institutions.
      </p>

      <div className="space-y-12">
        {equipmentList.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row items-center gap-6 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full md:w-1/2 h-64 object-cover rounded-lg bg-gray-100"
            />
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
