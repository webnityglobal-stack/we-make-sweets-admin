import React from "react";

const DashStats = ({
 stats 
}) => {

console.log("stats", stats);
  
  return (
    <div className="border rounded-md shadow-sm overflow-hidden bg-white min-w-[220px]">
      <div className="bg-sky-400 text-black font-medium px-3 py-1 text-sm">
        {title}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {icon}
          </div>

          <div className="text-4xl font-medium">
            {value}
          </div>
        </div>

        {subText && (
          <p className="text-sm mt-1">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashStats;