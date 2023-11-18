import { useState, useEffect } from "react";
import io from "socket.io-client";

interface ToggleProps {
  index: number;
}

function Toggle(props: ToggleProps) {
  const { index } = props;
  const [isClassChange, setIsClassChange] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(`ws:${import.meta.env.VITE_BASE_URL}`);

    newSocket.on("connect", () => console.log("WebSocket connection opened"));
    newSocket.on("message", (data) => {
      const pompeActive = data === "Pompe activée";
      setIsClassChange(!pompeActive);
    });

    newSocket.on("disconnect", () =>
      console.log("WebSocket connection closed")
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  console.log("socket", socket);
  const handleClick = () => {
    setIsClassChange(!isClassChange);

    const action = isClassChange ? "activerPompe" : "desactiverPompe";

    fetch(`${import.meta.env.VITE_BASE_URL}${action}-${index}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Erreur lors de la requête:", error);
      });
  };

  const classChange: { classBall: string; background: string } = {
    classBall: isClassChange ? "ball" : "ballChange",
    background: isClassChange ? "backgroundBadOpacity" : "backgroundgreen",
  };

  return (
    <div className="Toggle">
      <p>{index}</p>
      <p>OFF</p>
      <div className={classChange.background} onClick={handleClick}>
        <div className={classChange.classBall}></div>
      </div>
      <p>ON</p>
    </div>
  );
}

export default Toggle;
