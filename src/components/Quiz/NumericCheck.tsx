import React, { useState, type JSX } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import type { NumericCheckProps } from './types';

type Status = 'idle' | 'correct' | 'wrong';

export default function NumericCheck({
  answer,
  tolerance = 0.01,
  unit,
  explain,
  label,
}: NumericCheckProps): JSX.Element {
  const [value, setValue] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');
  const [revealed, setRevealed] = useState<boolean>(false);

  const check = (): void => {
    const parsed = Number.parseFloat(value.replace(',', '.'));
    if (Number.isNaN(parsed)) {
      setStatus('wrong');
      return;
    }
    setStatus(Math.abs(parsed - answer) <= tolerance ? 'correct' : 'wrong');
  };

  return (
    <div className={styles.numeric}>
      <span className={styles.numericLabel}>{label ?? 'Đáp án của bạn:'}</span>
      <input
        className={styles.numericInput}
        type="text"
        inputMode="decimal"
        value={value}
        placeholder="nhập số"
        onChange={(e) => {
          setValue(e.target.value);
          setStatus('idle');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            check();
          }
        }}
      />
      {unit ? <span>{unit}</span> : null}
      <button type="button" className="button button--sm button--primary" onClick={check}>
        Kiểm tra
      </button>
      <button
        type="button"
        className="button button--sm button--secondary button--outline"
        onClick={() => setRevealed((r) => !r)}
      >
        {revealed ? 'Ẩn' : 'Xem đáp án'}
      </button>

      {status !== 'idle' ? (
        <div
          className={clsx(
            styles.numericFeedback,
            status === 'correct' ? styles.markCorrect : styles.markWrong,
          )}
        >
          {status === 'correct' ? '✓ Đúng.' : '✕ Chưa đúng. Kiểm tra lại công thức và đơn vị.'}
        </div>
      ) : null}

      {revealed ? (
        <div className={styles.numericFeedback}>
          <strong>
            Đáp án: {answer}
            {unit ? ` ${unit}` : ''}
          </strong>
          <br />
          {explain}
        </div>
      ) : null}
    </div>
  );
}
