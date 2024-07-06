import { useEffect } from "react";
import "./App.css";
import * as signalR from "@microsoft/signalr";

function App() {
  const createHub = () => {
    //Create connection
    let connection = new signalR.HubConnectionBuilder()
      .withUrl("wss://localhost:44343/hubs/view", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    //On view update message from client
    connection.on("viewCountUpdate", (value) => {
      var counter = document.getElementById("viewCounter");
      counter.innerText = value.toString();
    });

    //Notify server we're watching
    const notify = () => {
      connection.send("notifyWatching");
    };

    // start connection
    const startSuccess = () => {
      console.log("🌟 Connected.");
      notify();
    };

    const startFail = (err) => {
      console.error("💥 Conection failed", err);
    };

    connection.start().then(startSuccess, startFail);
  };

  useEffect(() => {
    createHub();
  }, []);

  return (
    <div>
      <h2>Clients conected: </h2>
      <span id="viewCounter">0</span>
    </div>
  );
}

export default App;
