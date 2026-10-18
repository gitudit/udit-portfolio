import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** What to show instead when a child throws. Defaults to nothing. */
  fallback?: ReactNode;
  /** Appears in the console so a failing vignette is easy to find. */
  label?: string;
}
interface State {
  failed: boolean;
}

/** Keeps one broken vignette or overlay from taking the whole ride down. */
export default class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[${this.props.label ?? "boundary"}]`, error, info.componentStack);
  }

  override render(): ReactNode {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
