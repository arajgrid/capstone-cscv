import { createContext, useEffect, useState } from "react";

export const WebSocketContextForklift = createContext(null);

const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL_FORKLIFT;

export default function WebSocketContextForkliftProvider({ children }) {
  const [json, setJson] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(websocketUrl);

    const handleOpen = (event) => {
      console.log("Connection is open");
      ws.send("Hello, server!");
    };

    const handleMessage = (event) => {
      const jsonReceived = JSON.parse(event.data);
      setJson(jsonReceived);
    };

    const handleError = (error) => {
      console.error("WebSocket error:", error);
    };

    const handleClose = () => {
      console.log("WebSocket connection closed");
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("error", handleError);
    ws.addEventListener("close", handleClose);

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("error", handleError);
      ws.removeEventListener("close", handleClose);
      ws.close();
    };
  }, []);

  return (
    <WebSocketContextForklift.Provider value={{ json }}>
      {children}
    </WebSocketContextForklift.Provider>
  );
}
