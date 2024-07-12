const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function extractUsername(email) {
  if (typeof email !== "string") {
    throw new Error("The provided input is not a valid string");
  }
  const parts = email.split("@");
  if (parts.length !== 2) {
    throw new Error("The provided input is not a valid email address");
  }
  return parts[0];
}

export { formatDate, formatTime, extractUsername };
