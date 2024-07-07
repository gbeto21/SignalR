import { useEffect } from "react";
import "./App.css";
import * as signalR from "@microsoft/signalr";
import { CustomLogger } from "./CustomLogger";

function App() {
  //Create connection
  let connection = new signalR.HubConnectionBuilder()
    //   .configureLogging(signalR.LogLevel.Trace)
    .configureLogging(new CustomLogger())
    .withUrl("wss://localhost:44343/hubs/view", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .build();

  const createHub = () => {
    //On view update message from client
    connection.on("viewCountUpdate", (value) => {
      var counter = document.getElementById("viewCounter");
      counter.innerText = value.toString();
    });
    connection.on("incrementView", (val) => {
      const viewCountSpan = document.getElementById("viewCount");
      viewCountSpan.innerText = val;
      if (val % 10 === 0) connection.off("incrementView"); //Turns off the event handler.
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

  const handleClick = () => {
    const firstName = document.getElementById("inputFist").value;
    const lastName = document.getElementById("inputLast").value;

    connection
      .invoke("GetFullName", firstName, lastName)
      .then((val) => {
        alert(val);
      })
      .catch((er) => {
        console.error("💥 Error: ", er);
      });
  };

  const handleIncrement = () => {
    connection.invoke("IncrementServerView");
  };

  return (
    <div>
      <h2>Clients conected: </h2>
      <span id="viewCounter">0</span>
      <h2>Name concat</h2>
      <p>
        <input type="text" id="inputFist" />
        <input type="text" id="inputLast" />
        <button id="btnGetFullName" onClick={handleClick}>
          Get Full Name
        </button>
      </p>
      <p>
        <p>
          View Count: <span id="viewCount">0</span>
        </p>
        <button id="btnIncrement" onClick={handleIncrement}>
          Increment view
        </button>
      </p>
    </div>
  );
}

export default App;
