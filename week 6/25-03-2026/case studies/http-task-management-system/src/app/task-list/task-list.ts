import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  tasks: Task[] = [];
  newTask: string = '';
  filter: string = 'all';

  addTask() {
    if (this.newTask.trim() === '') return;

    this.tasks.push({
      id: Date.now(),
      title: this.newTask,
      completed: false
    });

    this.newTask = '';
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
  }

  get filteredTasks() {
    if (this.filter === 'completed') {
      return this.tasks.filter(t => t.completed);
    }
    if (this.filter === 'pending') {
      return this.tasks.filter(t => !t.completed);
    }
    return this.tasks;
  }
}