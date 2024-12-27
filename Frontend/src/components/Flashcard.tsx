import React from "react";

interface FlashcardProps {
  title: string;

  bgColor: string;

  totalUsers: React.ReactNode;

  selectedCountry: React.ReactNode;

  selectedYear: React.ReactNode;
}

const Flashcard: React.FC<FlashcardProps> = ({
  title,
  bgColor,
  totalUsers,
  selectedCountry,
  selectedYear,
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${bgColor} text-white`}>
      <h2 className="text-3xl font-extrabold mb-4">{title}</h2>
      <div className="text-8xl font-bold mb-2">{totalUsers}</div>
      <div className="text-lg text-gray-300">
        <p className="text-5xl font-bold mb-2">{selectedCountry || "World"}</p>
        <p className="text-5xl font-bold mb-1">{selectedYear || "N/A"}</p>
      </div>
    </div>
  );
};

export default Flashcard;
