import { useParams } from "react-router-dom";

export default function Route() {
  const { id } = useParams();
  return (
    <div>
      <h1>Route: {id}</h1>
      <p>Welcome to the Route page!</p>
    </div>
  );
}
