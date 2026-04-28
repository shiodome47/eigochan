interface StepIndicatorProps {
  current: number; // 1-based
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  const items = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div
      className="step-indicator"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`ステップ ${current} / ${total}`}
    >
      {items.map((n) => (
        <div
          key={n}
          className={`step-indicator__item${
            n < current ? " is-done" : n === current ? " is-current" : ""
          }`}
        />
      ))}
    </div>
  );
}
