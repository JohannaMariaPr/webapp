import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

export default function View360() {
  return (
    <section className="w-full">
      <h2 className="mb-4 text-2xl font-bold">360 View</h2>

      <ReactPhotoSphereViewer
        src="/360panoramas/Monsklint.png"
        height="500px"
        width="100%"
      />
    </section>
  );
}
