'use client';

import React from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Generic error boundary for graceful failure.
 * Usage: wrap any subtree that may throw at runtime.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In a real app, send to Sentry / Datadog / log service
    if (typeof console !== "undefined") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          role="alert"
          className="mx-auto my-16 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center"
        >
          <AlertTriangle
            className="h-10 w-10 text-red-400"
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-white">
            Something went wrong
          </h2>
          <p className="text-sm text-white/70">
            We&apos;re sorry — an unexpected error occurred. Try reloading the
            page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-lg bg-[#7b39fc] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8a4dff]"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
