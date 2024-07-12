import { createContext, useState } from "react";

export const ZoomContext = createContext({
  isZoomed: false,
  toggleZoom: () => {},
});

export default function ZoomContextProvider({ children }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const toggleZoom = () => setIsZoomed((prevIsZoomed) => !prevIsZoomed);
  return (
    <ZoomContext.Provider value={{ isZoomed, toggleZoom }}>
      {children}
    </ZoomContext.Provider>
  );
}
