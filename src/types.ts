export type EntryType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  type: EntryType;
  category: string;
  amount: number;
  note: string;
}
