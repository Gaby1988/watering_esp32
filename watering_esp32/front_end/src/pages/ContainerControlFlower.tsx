import { useState, useEffect } from "react";
import FlowerPicture from "../components/FlowerPicture";
import FlowerWater from "../components/FlowerWater";
import Toggle from "../components/Toggle";

function ContainerControlFlower() {
  const [water, setWater] = useState<number[]>([]);
  const [numberPumps, setNumberPumps] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const response: Response = await fetch(`${import.meta.env.VITE_BASE_URL}informer`);
        console.log(response);
        const data = await response.json();
        setNumberPumps(parseInt(data));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  return (
    <div className="containerGlobal">
      {numberPumps > 0 ? (
        [...Array(numberPumps)].map((_, index: number) => (
          <div className="ContainerControlFlower">
            <FlowerPicture
              water={water[index]}
              setWater={setWater}
              index={index}
            />
            <FlowerWater water={water[index]} />
            <Toggle index={index} />
          </div>
        ))
      ) : (
        <p>En cours de chargement</p>
      )}
    </div>
  );
}
export default ContainerControlFlower;
