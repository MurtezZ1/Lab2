import { MessageSquare, Send, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { createReview, getReviews } from "@/services/reviewService";

type ProductFeedbackProps = {
  productId: number | string;
  compact?: boolean;
};

export default function ProductFeedback({ productId, compact = false }: ProductFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    getReviews(productId).then((reviews) => {
      const latest = reviews[0];
      if (latest?.rating) setRating(latest.rating);
      if (latest?.comment) setComment(latest.comment);
    }).catch(() => undefined);
  }, [productId]);

  const visibleRating = hoveredRating || rating;
  const reviewText = useMemo(() => {
    if (rating === 0) return compact ? "Rate" : "No rating yet";
    return compact ? `${rating}/5` : `Your rating: ${rating}/5`;
  }, [compact, rating]);

  const saveFeedback = async () => {
    if (rating === 0 && comment.trim().length === 0) return;
    if (!user) return;
    await createReview(productId, { rating, comment: comment.trim() });

    setIsSaved(true);
    setIsOpen(false);
    setTimeout(() => setIsSaved(false), 2200);
  };

  return (
    <div className={compact ? "space-y-2" : "rounded-2xl border border-white/10 bg-white/5 p-4"}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              aria-label={`Rate ${star} stars`}
              className="rounded-md p-0.5 text-gray-500 transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              <Star
                className={`transition-colors ${compact ? "h-4 w-4" : "h-6 w-6"} ${
                  star <= visibleRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400">{reviewText}</span>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-primary/40 hover:text-white"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Feedback
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={compact ? 2 : 4}
            placeholder="Write your feedback..."
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-primary"
          />
          <button
            type="button"
            onClick={saveFeedback}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-primary/90"
          >
            <Send className="h-3.5 w-3.5" />
            Save feedback
          </button>
        </div>
      )}

      {isSaved && <p className="text-xs font-medium text-green-300">Feedback saved.</p>}
    </div>
  );
}
