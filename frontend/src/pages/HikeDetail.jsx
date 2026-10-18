import { useParams } from "react-router-dom";

export default function HikeDetail() {
  const { id } = useParams;
  return (
    <div>
      <h1>Hike Detail: {id}</h1>
      <p>Welcome to the Hike Detail page!</p>
    </div>
  );
}
