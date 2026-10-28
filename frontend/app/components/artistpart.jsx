export default function ArtistPart({ paintings = [] }) {
    const artist = paintings[0];

    return (
        <section className="p-3 sm:p-6">
            <h1 className="text-xs text-[#673C33]">
            More about...
            </h1>

            {paintings.length === 0 ? (
                <p className="mt-3 text-xs text-[#673C33]">No painting information available.</p>
            ) : (
                <div className="mt-3 space-y-3">
                    {artist?.artist && (
                        <h2 className="flex items-center justify-between gap-4 text-xl font-semibold text-[#673C33]">
                            <span className="flex items-center gap-2">
                                <img
                                    src="/Mappart/Vector1.png"
                                    alt=""
                                    aria-hidden="true"
                                    className="h-5 w-5 object-contain"
                                />
                                {artist.artist}
                            </span>
                            <span aria-hidden="true" className="text-2xl">
                                →
                            </span>
                        </h2>
                    )}

                    <div className="flex flex-wrap gap-3">
                    {paintings.map((painting) => {
                        const image = painting.image || painting.picture;

                        return (
                            <div key={painting.id || painting.title}>
                                {image ? (
                                    <img
                                        src={image}
                                        alt={painting.title || "Painting"}
                                        className="h-16 w-16 rounded-lg object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-center text-xs text-[#673C33] shadow-sm">
                                        No painting image
                                    </div>
                                )}
                                {painting.location && (
                                    <p className="mt-1 text-xs font-bold text-[#673C33]">
                                        {painting.location}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                    </div>

                    <p className="w-full text-sm leading-6 text-[#673C33] sm:text-base">
                        {artist?.artist_description || artist?.description || "No artist description available."}
                    </p>
                </div>
            )}
        </section>
    );
}   
