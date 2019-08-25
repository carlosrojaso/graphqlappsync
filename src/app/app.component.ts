import { Component, ChangeDetectorRef } from '@angular/core';
import { APIService, CreateTodoInput, DeleteTodoInput, UpdateTodoInput } from './API.service';

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

  save(newItem: CreateTodoInput) {
    this.apiService.CreateTodo(newItem).then(
      (resolve) => {
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

  updateNote(itemToUpdate: any) {
    this.apiService.UpdateTodo(itemToUpdate).then(
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

  openDialog(item?: UpdateTodoInput) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
        id: '',
        name: '',
        description: ''
    };

    if (item) {
      dialogConfig.data = {
        id: item.id,
        name: item.name,
        description: item.description
      };
    }

    const dialogRef = this.dialog.open(TodoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        (data) => {
          if (data) {
            const newItem: CreateTodoInput = {
              name: data.name,
              description: data.description
            };

            if (item) {
              this.updateNote(data);
            } else {
              this.save(newItem);
            }
          }
        }
    );
  }
}
