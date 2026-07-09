import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application error boundary caught an error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-background px-6 py-16 text-white">
        <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
            <AlertTriangle className="h-7 w-7 text-yellow-300" />
          </div>
          <h1 className="mt-6 text-3xl font-black">Something went wrong</h1>
          <p className="mt-3 text-gray-400">
            The page could not continue safely. Refresh the page or return to the previous screen.
          </p>
          {this.state.message && (
            <p className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300">
              {this.state.message}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary/80"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </button>
        </section>
      </main>
    );
  }
}
