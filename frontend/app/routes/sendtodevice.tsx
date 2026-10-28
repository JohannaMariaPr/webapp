import { Link } from "react-router";

export default function SendToDevice() {
  return (
    <main className="send-device-page">
      <div className="send-device-card">
        <p className="send-device-label">Open on your phone</p>
        <h1>Send to device</h1>
        <p className="send-device-copy">
          This experience is designed for mobile devices only.
          <br />
          Please open it on your phone to start your hike.
        </p>
        <Link to="/allhikes" className="send-device-button">
          Back to hikes
        </Link>
      </div>
    </main>
  );
}
