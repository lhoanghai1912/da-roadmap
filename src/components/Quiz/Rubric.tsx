import React, { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import type { RubricBand, RubricProps } from './types';

const STORAGE_PREFIX = 'da-roadmap:rubric:';

const DEFAULT_BANDS: RubricBand[] = [
  { min: 0, label: 'Chưa đạt — làm lại', tone: 'fail' },
  { min: 60, label: 'Gần đạt — bổ sung phần thiếu', tone: 'warn' },
  { min: 80, label: 'Đạt — đưa vào portfolio', tone: 'pass' },
];

function readStorage(key: string): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(key: string, value: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* bo qua */
  }
}

export default function Rubric({ id, title, items, bands }: RubricProps): JSX.Element {
  const storageKey = `${STORAGE_PREFIX}${id}`;
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked(readStorage(storageKey));
  }, [storageKey]);

  const toggle = useCallback(
    (itemId: string) => {
      setChecked((prev) => {
        const next = prev.includes(itemId)
          ? prev.filter((c) => c !== itemId)
          : [...prev, itemId];
        writeStorage(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const maxPoints = useMemo(() => items.reduce((sum, i) => sum + i.points, 0), [items]);
  const total = useMemo(
    () => items.filter((i) => checked.includes(i.id)).reduce((sum, i) => sum + i.points, 0),
    [checked, items],
  );

  const percent = maxPoints > 0 ? Math.round((total / maxPoints) * 100) : 0;
  const bandList = bands ?? DEFAULT_BANDS;
  const band = [...bandList].sort((a, b) => b.min - a.min).find((b) => percent >= b.min) ?? bandList[0];

  return (
    <div className={styles.rubric}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>{title ?? 'Bảng chấm — tự đánh giá'}</span>
        <span className={styles.headerMeta}>Tick từng mục đã làm được. Điểm tính tự động.</span>
      </div>

      {items.map((item) => {
        const on = checked.includes(item.id);
        return (
          <label className={styles.rubricItem} key={item.id}>
            <input type="checkbox" checked={on} onChange={() => toggle(item.id)} />
            <span>
              {item.label}
              {item.hint ? <span className={styles.rubricHint}>{item.hint}</span> : null}
            </span>
            <span className={clsx(styles.rubricPoints, on && styles.rubricPointsOn)}>
              {on ? item.points : 0}/{item.points}
            </span>
          </label>
        );
      })}

      <div className={styles.rubricTotal}>
        <strong>
          {total}/{maxPoints} điểm ({percent}%)
        </strong>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
        </div>
        <span
          className={clsx(
            styles.band,
            band.tone === 'fail' && styles.bandFail,
            band.tone === 'warn' && styles.bandWarn,
            band.tone === 'pass' && styles.bandPass,
          )}
        >
          {band.label}
        </span>
      </div>
    </div>
  );
}
