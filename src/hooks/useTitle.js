import { useEffect, useRef } from "react";

const useTitle = (title) => {
  const documentDefined = typeof document !== "undefined";
  const originalTitle = useRef(documentDefined ? document.title : null);

  useEffect(() => {
    if (!documentDefined) return;
    const previousTitle = originalTitle.current;
    if (typeof title === "string" && document.title !== title)
      document.title = title;
    return () => {
      if (previousTitle !== null) document.title = previousTitle;
    };
  }, [documentDefined, title]);
};

export default useTitle;
