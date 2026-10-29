import { Link } from "react-router";

type Review = {
  id: number;
  "Star rating": string;
  review_title: string;
  "Review description": string;
  Picture: string;
};

type HikeReviewProps = {
  reviews: Review[];
  hikeId?: string;
};

export default function HikeReview({ reviews, hikeId }: HikeReviewProps) {
    return (
      <div className="bg-background px-8 py-3 font-body">
       {/* Show the review section image. */}
       <img
      src="/Mappart/Itemr.png"
         alt="Review"
         className="mx-auto my-6 w-full max-w-xs rounded-lg shadow-lg"
      />
    {/* Link to the page with all reviews. */}
    <p className="w-full max-w-3xl mx-auto text-right text-[#673C33] underline">
      Show all
    </p>
    {/* Let the user open the review form. */}
    <h1 className="text-2xl font-bold text-[#673C33]">
      <Link to={`/reviews?hike=${hikeId}`}>
        Rate this hike <span aria-hidden="true">→</span>
      </Link>
    </h1>
    {/* Show a message or the reviews for this hike. */}
    <div className="mt-4 space-y-4">
      {reviews.length === 0 ? (
        <p className="text-sm text-[#673C33]">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <article key={review.id} className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
            <img
              src={review.Picture}
              alt={review.review_title}
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-[#673C33]">{review.review_title}</h2>
                {/* Turn the rating number into stars. */}
                <p
                  className="text-lg text-[#FFC100]"
                  aria-label={review["Star rating"]}
                >
                  {Array.from({ length: 5 }, (_, index) =>
                    index < Number.parseInt(review["Star rating"], 10) ? "★" : "☆",
                  )}
                </p>
              </div>
              <p className="mt-2 text-sm text-[#673C33]">{review["Review description"]}</p>
            </div>
          </article>
        ))
      )}
    </div>
    </div>
  );
}