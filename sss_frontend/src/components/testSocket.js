import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

export default function ClientComponent() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient();
    socket.on("FromAPI", data => {
      setResponse(data);
    });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();

  }, []);

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}