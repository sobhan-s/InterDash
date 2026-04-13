import React from "react";

const MAX_ERRORS = 20;

export default class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorLog: [] };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.setState((prev: any) => ({
      ...prev,
      errorLog: [...prev.errorLog, { error: error.toString(), time: Date.now() }]
        .slice(-MAX_ERRORS),
    }));
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: "red" }}>Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}



