import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ArcProgressCardProps {
  title: string;
  percentage: number;
  bgColor: string;
}

const ArcProgressCard: React.FC<ArcProgressCardProps> = ({
  title,
  percentage,
  bgColor,
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${bgColor} text-white`}>
      <h2 className="text-3xl font-extrabold mb-4">{title}</h2>
      <div className="flex justify-center items-center">
        <div style={{ width: 200, height: 200 }}>
          <CircularProgressbarWithChildren
            value={percentage}
            styles={buildStyles({
              pathColor: "#3e98c7", // Set a distinct color for the arc
              trailColor: bgColor, // Match the trail color with the background color
            })}
          >
            <div className="text-4xl font-bold">{`${Math.round(
              percentage
            )}%`}</div>
          </CircularProgressbarWithChildren>
        </div>
      </div>
    </div>
  );
};

export default ArcProgressCard;
