import { useEffect } from "react";

interface FlowerPictureProps {
  water: number;
  setWater: React.Dispatch<React.SetStateAction<number[]>>;
  index: number;
}
function FlowerPicture(props: FlowerPictureProps) {
  const { water, setWater, index } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseHumidity = await fetch(
          `${import.meta.env.VITE_BASE_URL}lireHumidite-${index}`
        );
        if (!responseHumidity.ok) {
          throw new Error(`HTTP error! Status: ${responseHumidity.status}`);
        }
        const data = await responseHumidity.json();
        console.log("Réponse du serveur:", data);
        setWater((prevWater) => {
          const updatedWater = [...prevWater];
          updatedWater[index] = data / 16;
          return updatedWater;
        });
      } catch (error) {
        console.error("Erreur lors de la requête:", error);
      }
    };

    const intervalId = setInterval(fetchData, 3000);

    () => clearInterval(intervalId);
  }, [index, setWater]);
  const waterValue =
    water >= 250
      ? 0
      : water < 250 && water > 150
      ? 1
      : water < 149 && water > 75
      ? 2
      : 3;

  const flowerIMG: string[] = `${import.meta.env.VITE_BASE_IMG1},${
    import.meta.env.VITE_BASE_IMG2
  },${import.meta.env.VITE_BASE_IMG3},${import.meta.env.VITE_BASE_IMG4}`.split(
    ","
  );

  const prefix: string = import.meta.env.VITE_BASE_PREFIX;

  const urlIMG: string = prefix + flowerIMG[waterValue];

  return <img className="FlowerPicture" src={urlIMG} alt="plante" />;
}
export default FlowerPicture;
