import { useContext } from "react";
import { TimeBlockContext } from "../context/TimeBlockContext";

const useTimeBlocks = () => {
  const context = useContext(TimeBlockContext);
  if (!context) {
    throw new Error("useTimeBlocks must be used within a TimeBlockProvider");
  }
  return context;
};

export default useTimeBlocks;
