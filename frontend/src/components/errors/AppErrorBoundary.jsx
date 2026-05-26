import { Component } from 'react';
import * as Sentry from '@sentry/react';
import ErrorFallback from './ErrorFallback';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.reset}
          title={this.props.title}
        />
      );
    }
    return this.props.children;
  }
}

export default AppErrorBoundary;
