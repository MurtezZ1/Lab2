import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-black text-white">Page not found</h1>
      <p className="mt-3 text-gray-400">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary/90">
        Back Home
      </Link>
    </div>
  );
}
