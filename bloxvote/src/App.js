import CustomButton from "./components/CustomButton";

export default function App() {
  return (
    <div>
      <CustomButton>OPEN</CustomButton>
      <CustomButton buttonStyle={"btn-color2"}>NOT STARTED</CustomButton>
    </div>
  );
}
