'use client';

import * as React from 'react';

// Catches render-time errors from the example output — including rejections in
// deeply-nested async children that React resolves *after* the example's run()
// has returned (so the example's own try/catch can't see them). Without this a
// failing async child renders as silence; with it the error is shown.
export default class AlizarinErrorBoundary extends React.Component<
  { children: React.ReactNode; resetKey?: unknown },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode; resetKey?: unknown }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prev: { resetKey?: unknown }) {
    // Clear the error when a new run starts (resetKey changes).
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className='alizarin-error'>
          Error while rendering: { this.state.error.message }
        </div>
      );
    }
    return this.props.children;
  }
}
