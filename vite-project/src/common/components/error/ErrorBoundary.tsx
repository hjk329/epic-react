import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";
import Fallback from "./Fallback";

interface ErrorState {
  hasError: boolean;
  errorMessage: string | null;
}

interface ErrorBoundaryProps {
  state?: ErrorState;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    const { errorMessage, hasError } = this.state;

    if (hasError) {
      return this.props.fallback || <Fallback errorMessage={errorMessage} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
