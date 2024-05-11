import React from "react";

const AmenityItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-1">{children}</div>;
};

export default AmenityItem;
