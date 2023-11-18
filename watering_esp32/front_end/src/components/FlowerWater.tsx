interface FlowerWaterProps {
  water: number;
}
function FlowerWater(props: FlowerWaterProps) {
  const { water } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styled: any[] = [];
  const minMax = () =>
    water >= 250
      ? styled.push({ height: `${water}px`, background: "linear-gradient(271deg, rgb(7 102 190 / 64%) 15%, rgba(0, 94, 224, 0.49) 35%, rgb(82 117 190 / 80%) 64%, rgb(101 117 156 / 41%) 100%)" })
      : styled.push({ height: `${water}px` });
  minMax();
  const combinedStyles = styled.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any, style: any) => ({ ...acc, ...style }),
    {}
  );

  return (
    <div className="FlowerWater">
      <div style={combinedStyles}></div>
    </div>
  );
}

export default FlowerWater;
