import { Activity } from '../activity';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


export interface ActivityElement {
  name: string;
  money: number;
  motivation: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor() { }

  activities = [new Activity('Dog', 0, 0), new Activity('Lemon', 0, 0)];

  model = new Activity('', 0, 0);

  ngOnInit() {
  }

  onSubmit() {
    this.activities.push(JSON.parse(JSON.stringify(this.model)));
    this.model = new Activity('', 0, 0);
  }

  /*
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }
  */
}
