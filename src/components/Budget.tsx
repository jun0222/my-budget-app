"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const formatDisplayDate = (dateString: string) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  return `${year}/${month}/${day}`;
};

const categories = ["食費", "交通費", "住居費", "娯楽費", "収入"];
const stores = ["スーパー", "コンビニ", "レストラン", "会社", "その他"];
const items = ["食料品", "日用品", "交通", "給料", "その他"];

export default function Component() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(formatDate(new Date()));
  const [category, setCategory] = useState(categories[0]);
  const [store, setStore] = useState(stores[0]);
  const [item, setItem] = useState(items[0]);
  const [amount, setAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(formatDisplayDate(t.date));
      return (
        transactionDate.getFullYear() === currentYear &&
        transactionDate.getMonth() === currentMonth
      );
    });
    setTransactions(filteredTransactions);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      date,
      category,
      store,
      item,
      amount: parseFloat(amount),
      type: category === "収入" ? "income" : "expense",
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance((prevBalance) =>
      category === "収入"
        ? prevBalance + parseFloat(amount)
        : prevBalance - parseFloat(amount)
    );
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDate(formatDate(new Date()));
    setCategory(categories[0]);
    setStore(stores[0]);
    setItem(items[0]);
    setAmount("");
  };

  const handleDelete = (id) => {
    const transactionToDelete = transactions.find((t) => t.id === id);
    setBalance((prevBalance) =>
      transactionToDelete.type === "income"
        ? prevBalance - transactionToDelete.amount
        : prevBalance + transactionToDelete.amount
    );
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(transactions.length / transactionsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const totalPages = pageNumbers.length;
    const pageNumbersToShow = [];

    if (totalPages <= 7) {
      return pageNumbers.map((number) => (
        <Button
          key={number}
          onClick={() => setCurrentPage(number)}
          variant={currentPage === number ? "default" : "outline"}
          size="sm"
        >
          {number}
        </Button>
      ));
    }

    if (currentPage <= 4) {
      pageNumbersToShow.push(...pageNumbers.slice(0, 5), "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pageNumbersToShow.push(1, "...", ...pageNumbers.slice(totalPages - 5));
    } else {
      pageNumbersToShow.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pageNumbersToShow.map((number, index) =>
      number === "..." ? (
        <span key={index} className="px-2">
          ...
        </span>
      ) : (
        <Button
          key={index}
          onClick={() => setCurrentPage(number)}
          variant={currentPage === number ? "default" : "outline"}
          size="sm"
        >
          {number}
        </Button>
      )
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">
              残高: ¥{balance.toLocaleString()}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="icon" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新規取引</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="date">日付</Label>
                    <Input
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">分類</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue>{category}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="store">店舗</Label>
                    <Select value={store} onValueChange={setStore} required>
                      <SelectTrigger>
                        <SelectValue>{store}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="item">品物</Label>
                    <Select value={item} onValueChange={setItem} required>
                      <SelectTrigger>
                        <SelectValue>{item}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((i) => (
                          <SelectItem key={i} value={i}>
                            {i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">金額</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    追加
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2 h-[250px] overflow-y-auto">
            {currentTransactions.length > 0
              ? currentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{transaction.item}</span>
                        <span
                          className={`${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}¥
                          {transaction.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDisplayDate(transaction.date)} -{" "}
                        {transaction.store} - {transaction.category}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              : Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="py-2 border-b last:border-b-0">
                      <div className="h-[52px]"></div>
                    </div>
                  ))}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="icon"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {renderPageNumbers()}
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length))
              }
              disabled={currentPage === pageNumbers.length}
              size="icon"
              variant="outline"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
