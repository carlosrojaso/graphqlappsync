import { Component, ChangeDetectorRef } from '@angular/core';
import { APIService, CreateTodoInput, DeleteTodoInput } from './API.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'graphqlappsync';
  notes: Array<CreateTodoInput> = [];

  constructor( private apiService: APIService, private cd: ChangeDetectorRef, private dialog: MatDialog) {
    this.updateNotesList();
  }

  save() {
    const todoItem: CreateTodoInput = {
      name: 'Task 1',
      description: 'New Task'
    };

    this.apiService.CreateTodo(todoItem).then(
      (resolve) => {
        console.log('response >>>', resolve);
        this.updateNotesList();
      }
    ).catch(
      (error) => {
        console.log('error >>>', error);
      }
    );
  }

  deleteNote(itemId: string) {
    const itemToDelete: DeleteTodoInput = {
      id: itemId
    };

    this.apiService.DeleteTodo(itemToDelete).then(
      (resolve) => {
        this.updateNotesList();
      }
    ).catch(
      (error) => {
        console.log('error >>>', error);
      }
    );
  }

  updateNotesList() {
    this.notes = [];
    this.apiService.ListTodos().then(
      (resolve) => {
        resolve.items.forEach(
          (item) => {
            this.notes.push(item);
          }
        );
        this.cd.detectChanges();
      }
    ).catch(
      (error) => {
        console.log('error >>>', error);
      }
    );
  }

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
        id: '',
        name: '',
        description: ''
    };

    this.dialog.open(TodoDialogComponent, dialogConfig);

    const dialogRef = this.dialog.open(TodoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => console.log('Dialog output:', data)
    );
  }
}
