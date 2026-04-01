import { useCallback, useEffect, useState } from "react";
import type { Transaction } from "./types";

const STORAGE_KEY = "budget-book-transactions";

function load(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Transaction =>
        typeof t === "object" &&
        t !== null &&
        typeof (t as Transaction).id === "string" &&
        typeof (t as Transaction).date === "string" &&
        ((t as Transaction).type === "income" ||
          (t as Transaction).type === "expense") &&
        typeof (t as Transaction).category === "string" &&
        typeof (t as Transaction).amount === "number" &&
        typeof (t as Transaction).note === "string"
    );
  } catch {
    return [];
  }
}

function save(list: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(load());
  }, []);

  const persist = useCallback((next: Transaction[]) => {
    setTransactions(next);
    save(next);
  }, []);

  const add = useCallback(
    (t: Omit<Transaction, "id">) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      persist([{ ...t, id }, ...transactions]);
    },
    [transactions, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(transactions.filter((x) => x.id !== id));
    },
    [transactions, persist]
  );

  return { transactions, add, remove };
}
