export function meta() {
  return [
    { title: "Saved hikes" },
    { name: "description", content: "Your saved hiking trails." },
  ];
}

export default function Saved() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-3xl font-bold">Saved hikes</h1>
      <p>Your saved trails will appear here.</p>
    </main>
  );
}
