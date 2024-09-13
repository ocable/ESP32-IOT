import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [ledStatus, setLedStatus] = useState(0);

  const turnOnLED = () => {
    setLedStatus(ledStatus === 0 ? 1 : 0);
    socket.emit("turnOnBuiltInLED", {
      type: "cmd",
      body: {
        type: "digitalWrite", // Either "pinMode" or "digitalWrite"
        pin: 18,
        mode: "output", // Only for "pinMode" commands
        value: ledStatus, // Only for "digitalWrite" commands
      },
    });
  };

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <>
      <main>
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>Send Message</button>
        <h1>LED:</h1>
        <p>{messageReceived}</p>

        <button onClick={turnOnLED}>Toggle LED</button>
      </main>
    </>
  );
}

export default App;
