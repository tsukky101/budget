import { useMemo, useState } from "react";
import "./App.css";
import type { EntryType } from "./types";
import { useTransactions } from "./useTransactions";

const INCOME_CATS = ["給与", "副業", "ボーナス", "その他"];
const EXPENSE_CATS = [
  "食費",
  "住居",
  "光熱費",
  "交通",
  "娯楽",
  "医療",
  "その他",
];

function formatMonth(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function formatYen(n: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function App() {
  const { transactions, add, remove } = useTransactions();
  const [month, setMonth] = useState(() => formatMonth(new Date()));
  const [type, setType] = useState<EntryType>("expense");
  const [date, setDate] = useState(() => {
    const t = new Date();
    return t.toISOString().slice(0, 10);
  });
  const [category, setCategory] = useState(EXPENSE_CATS[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const cats = type === "income" ? INCOME_CATS : EXPENSE_CATS;

  const filtered = useMemo(
    () => transactions.filter((t) => t.date.startsWith(month)),
    [transactions, month]
  );

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  }, [filtered]);

  const sortedList = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = amount.replace(/,/g, "").trim();
    const n = Number(raw);
    if (!raw || Number.isNaN(n) || n <= 0) return;
    add({
      date,
      type,
      category,
      amount: Math.round(n),
      note: note.trim(),
    });
    setAmount("");
    setNote("");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>家計簿</h1>
        <p>収支を記録します。データはこのブラウザに保存されます。</p>
      </header>

      <div className="month-bar">
        <label>
          表示月
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
      </div>

      <section className="summary" aria-label="月次サマリー">
        <div className="summary-card income">
          <span>収入</span>
          <strong>{formatYen(totals.income)}</strong>
        </div>
        <div className="summary-card expense">
          <span>支出</span>
          <strong>{formatYen(totals.expense)}</strong>
        </div>
        <div className="summary-card balance">
          <span>収支</span>
          <strong
            className={
              totals.balance >= 0 ? "positive" : "negative"
            }
          >
            {formatYen(totals.balance)}
          </strong>
        </div>
      </section>

      <section className="panel" aria-labelledby="form-heading">
        <h2 id="form-heading">追加</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field full">
            <label id="type-label">種類</label>
            <div
              className="type-toggle"
              role="group"
              aria-labelledby="type-label"
            >
              <button
                type="button"
                className={
                  type === "income" ? "active-income" : ""
                }
                onClick={() => {
                  setType("income");
                  setCategory(INCOME_CATS[0]);
                }}
              >
                収入
              </button>
              <button
                type="button"
                className={
                  type === "expense" ? "active-expense" : ""
                }
                onClick={() => {
                  setType("expense");
                  setCategory(EXPENSE_CATS[0]);
                }}
              >
                支出
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="tx-date">日付</label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="tx-cat">カテゴリ</label>
            <select
              id="tx-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tx-amount">金額（円）</label>
            <input
              id="tx-amount"
              type="text"
              inputMode="numeric"
              placeholder="例: 3500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="tx-note">メモ（任意）</label>
            <textarea
              id="tx-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="店名・内容など"
            />
          </div>
          <div className="full">
            <button type="submit" className="submit-btn">
              登録
            </button>
          </div>
        </form>
      </section>

      <section className="list-section" aria-labelledby="list-heading">
        <div className="list-header">
          <h2 id="list-heading">
            {month.slice(0, 4)}年{month.slice(5, 7)}月の明細
          </h2>
          <span className="count">{sortedList.length} 件</span>
        </div>
        {sortedList.length === 0 ? (
          <p className="empty">この月の取引はまだありません。</p>
        ) : (
          <ul className="tx-list">
            {sortedList.map((t) => (
              <li key={t.id} className="tx-item">
                <div className="tx-main">
                  <div className="tx-row1">
                    <span className="tx-date">{t.date}</span>
                    <span className="tx-category">{t.category}</span>
                    <span className="tx-category">
                      {t.type === "income" ? "収入" : "支出"}
                    </span>
                  </div>
                  {t.note ? (
                    <p className="tx-note">{t.note}</p>
                  ) : null}
                </div>
                <div
                  className={`tx-amount ${t.type === "income" ? "income" : "expense"}`}
                >
                  {t.type === "income" ? "+" : "−"}
                  {formatYen(t.amount)}
                </div>
                <div className="tx-actions">
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => remove(t.id)}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
