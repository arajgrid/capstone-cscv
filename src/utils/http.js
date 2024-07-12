import axios from "axios";
import { useContext } from "react";
import { LoadingContext } from "../store/LoadingContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VIDEO_SOURCES = {
  PPE: "src/main/resources/helmet.mp4",
  FORKLIFT: "src/main/resources/forklift_final.mp4",
};

async function stopStreaming(type) {
  try {
    const response = await axios.post(
      "/video/stop",
      { type },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error stopping streaming:", error);
  }
}

async function startStreaming(source, type) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/video/start`,
      new URLSearchParams({
        source,
        type,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error starting streaming:", error);
  }
}

const handlePpeClick = async () => {
  const { setLoading } = useContext(LoadingContext);
  try {
    setLoading(true);
    await stopStreaming("rtmp");
    await startStreaming(VIDEO_SOURCES.PPE, "rtmp");
  } catch (error) {
    console.error("Error handling PPE click:", error);
  } finally {
    setLoading(false);
  }
};

const handleForkliftClick = async () => {
  const { setLoading } = useContext(LoadingContext);
  try {
    setLoading(true);
    await stopStreaming("rtmp");
    await startStreaming(VIDEO_SOURCES.FORKLIFT, "rtmp");
  } catch (error) {
    console.error("Error handling Forklift click:", error);
  } finally {
    setLoading(false);
  }
};

export { handlePpeClick, handleForkliftClick };
