import React from "react";

interface FlashcardProps {
  title: string;
  field: string;
  bgColor: string;
  totalUsers: number;
  selectedCountry: string | null;
  selectedYear: number | null;
  selectedLanguage: string | null;
}

const Flashcard: React.FC<FlashcardProps> = ({
  title,
  field,
  bgColor,
  totalUsers,
  selectedCountry,
  selectedYear,
  selectedLanguage,
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${bgColor} text-white`}>
      <h2 className="text-3xl font-extrabold mb-4">{title}</h2>
      <div className="text-5xl font-bold mb-2">{totalUsers}</div>
      <div className="text-lg text-gray-300">
        <p className="mb-1">
          <strong>Country:</strong> {selectedCountry || "N/A"}
        </p>
        <p className="mb-1">
          <strong>Year:</strong> {selectedYear || "N/A"}
        </p>
        <p className="mb-1">
          <strong>Language:</strong> {selectedLanguage || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default Flashcard;
