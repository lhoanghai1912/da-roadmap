import React, { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import type { QuizProps, QuizQuestion } from './types';

type AnswerMap = Record<string, string[]>;

const STORAGE_PREFIX = 'da-roadmap:quiz:';

function readStorage(key: string): AnswerMap | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as AnswerMap) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: AnswerMap): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* localStorage bi chan — bo qua */
  }
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

export default function Quiz({ id, questions, passScore }: QuizProps): JSX.Element {
  const storageKey = `${STORAGE_PREFIX}${id}`;
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [graded, setGraded] = useState<boolean>(false);

  useEffect(() => {
    const saved = readStorage(storageKey);
    if (saved) {
      setAnswers(saved);
    }
  }, [storageKey]);

  const threshold = passScore ?? Math.ceil(questions.length * 0.7);

  const select = useCallback(
    (q: QuizQuestion, choiceId: string) => {
      if (graded) {
        return;
      }
      setAnswers((prev) => {
        const current = prev[q.id] ?? [];
        let next: string[];
        if (q.multi) {
          next = current.includes(choiceId)
            ? current.filter((c) => c !== choiceId)
            : [...current, choiceId];
        } else {
          next = [choiceId];
        }
        const updated = { ...prev, [q.id]: next };
        writeStorage(storageKey, updated);
        return updated;
      });
    },
    [graded, storageKey],
  );

  const score = useMemo(
    () => questions.filter((q) => sameSet(answers[q.id] ?? [], q.correct)).length,
    [answers, questions],
  );

  const answeredCount = useMemo(
    () => questions.filter((q) => (answers[q.id] ?? []).length > 0).length,
    [answers, questions],
  );

  const reset = useCallback(() => {
    setAnswers({});
    setGraded(false);
    writeStorage(storageKey, {});
  }, [storageKey]);

  const passed = score >= threshold;

  return (
    <div className={styles.quiz}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Bài kiểm tra — {questions.length} câu</span>
        <span className={styles.headerMeta}>
          Đã trả lời {answeredCount}/{questions.length} · Đạt khi ≥ {threshold} câu đúng
        </span>
      </div>

      {questions.map((q, index) => {
        const picked = answers[q.id] ?? [];
        const isCorrect = sameSet(picked, q.correct);
        return (
          <div className={styles.question} key={q.id}>
            <div className={styles.questionText}>
              <span className={styles.questionNum}>{index + 1}.</span>
              {q.question}
              {q.multi ? ' (chọn nhiều đáp án)' : ''}
            </div>

            {q.code ? <pre className={styles.codeBlock}>{q.code}</pre> : null}

            <div className={styles.choices}>
              {q.choices.map((c) => {
                const chosen = picked.includes(c.id);
                const shouldBe = q.correct.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={clsx(
                      styles.choice,
                      graded && styles.choiceLocked,
                      graded && shouldBe && styles.choiceCorrect,
                      graded && chosen && !shouldBe && styles.choiceWrong,
                    )}
                  >
                    <input
                      type={q.multi ? 'checkbox' : 'radio'}
                      name={`${id}-${q.id}`}
                      checked={chosen}
                      disabled={graded}
                      onChange={() => select(q, c.id)}
                    />
                    <span>{c.text}</span>
                    {graded && shouldBe ? (
                      <span className={clsx(styles.mark, styles.markCorrect)}>✓</span>
                    ) : null}
                    {graded && chosen && !shouldBe ? (
                      <span className={clsx(styles.mark, styles.markWrong)}>✕</span>
                    ) : null}
                  </label>
                );
              })}
            </div>

            {graded ? (
              <div className={styles.explain}>
                <span className={styles.explainLabel}>{isCorrect ? '✓ Đúng.' : '✕ Sai.'}</span>
                {q.explain}
              </div>
            ) : null}
          </div>
        );
      })}

      <div className={styles.actions}>
        {!graded ? (
          <button
            type="button"
            className="button button--primary"
            onClick={() => setGraded(true)}
            disabled={answeredCount === 0}
          >
            Chấm điểm
          </button>
        ) : null}
        <button type="button" className="button button--secondary button--outline" onClick={reset}>
          Làm lại
        </button>
        {!graded && answeredCount < questions.length ? (
          <span className={styles.headerMeta}>
            Còn {questions.length - answeredCount} câu chưa trả lời
          </span>
        ) : null}
      </div>

      {graded ? (
        <div className={clsx(styles.result, passed ? styles.resultPass : styles.resultFail)}>
          <span className={styles.scoreBig}>
            {score}/{questions.length}
          </span>
          {passed
            ? 'Đạt. Sang phần bài tập thực hành của stage này.'
            : `Chưa đạt (cần ≥ ${threshold}). Đọc lại phần giải thích ở các câu sai, ôn lại mục tương ứng trong stage rồi làm lại.`}
        </div>
      ) : null}
    </div>
  );
}
