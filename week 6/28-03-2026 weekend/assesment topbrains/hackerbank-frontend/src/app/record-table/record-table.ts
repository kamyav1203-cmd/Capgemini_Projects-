import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../services/transaction';

@Component({
  selector: 'app-record-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './record-table.html',
  styleUrls: ['./record-table.css']
})
export class RecordTableComponent implements OnInit {

  transactions: any[] = [];
  filteredData: any[] = [];

  searchText: string = '';
  selectedDate: string = '';

  newTransaction = {
    date: '',
    description: '',
    type: 0,
    amount: 0,
    balance: 0
  };

  constructor(private service: TransactionService) {}

  ngOnInit(): void {
    this.service.getTransactions().subscribe({
      next: (data) => {

        // ✅ SAFE DATA MAPPING
        this.transactions = data.map((t: any) => ({
          date: t.Date || '',
          description: t.Description || '',
          type: t.Type ?? 0,
          amount: t.Amount ?? 0,
          balance: typeof t.Balance === 'string'
            ? parseFloat(t.Balance.replace(/[^0-9.-]+/g, ''))
            : (t.Balance ?? 0)
        }));

        this.filteredData = [...this.transactions];
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ FILTER (LIKE HACKERRANK GIF)
  applyFilter(): void {
    this.filteredData = this.transactions.filter((t) => {

      const desc = (t.description || '').toLowerCase();

      const matchesSearch =
        desc.includes((this.searchText || '').toLowerCase());

      const matchesDate =
        this.selectedDate ? t.date === this.selectedDate : true;

      return matchesSearch && matchesDate;
    });
  }

  // ✅ ADD (UI ONLY)
  addTransaction(): void {
    if (!this.newTransaction.date || !this.newTransaction.description) {
      alert('Fill all fields');
      return;
    }

    this.transactions.unshift({
      date: this.newTransaction.date || '',
      description: this.newTransaction.description || '',
      type: Number(this.newTransaction.type),
      amount: Number(this.newTransaction.amount),
      balance: Number(this.newTransaction.balance)
    });

    this.applyFilter();

    this.newTransaction = {
      date: '',
      description: '',
      type: 0,
      amount: 0,
      balance: 0
    };
  }

  // ✅ DELETE
  deleteTransaction(index: number): void {
    this.transactions.splice(index, 1);
    this.applyFilter();
  }
}