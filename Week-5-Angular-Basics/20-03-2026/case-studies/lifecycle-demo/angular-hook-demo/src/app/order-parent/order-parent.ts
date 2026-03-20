import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderChild } from '../order-child/order-child';

@Component({
  selector: 'app-order-parent',
  standalone: true,
  imports: [CommonModule, OrderChild],
  templateUrl: './order-parent.html'
})
export class OrderParent {

  order = {
    id: 101,
    product: 'Laptop',
    status: 'Pending',
    price: 50000
  };

  updateOrder() {
    this.order = {
      ...this.order,
      status: this.order.status === 'Pending' ? 'Delivered' : 'Pending'
    };
  }

  destroyChild = true;

  toggleChild() {
    this.destroyChild = !this.destroyChild;
  }
}