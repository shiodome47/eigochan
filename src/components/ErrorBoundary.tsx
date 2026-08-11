import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("eigochan render error", error, info);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="page" style={{ padding: "24px 16px", maxWidth: 480, margin: "0 auto" }}>
        <section className="card">
          <h1 className="card__title">表示できませんでした</h1>
          <p className="form-hint">
            予期しないエラーが起きました。ページを再読み込みすると直ることがあります。
          </p>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button type="button" className="btn" onClick={this.handleReload}>
              再読み込み
            </button>
          </div>
        </section>
      </div>
    );
  }
}
