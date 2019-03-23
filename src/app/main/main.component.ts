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

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor() { }

  activities = [];
  moneyList = [];
  motivationList = [];

  model = new Activity('');

  ngOnInit() {
  }

  addActivity() {
    this.activities.push(JSON.parse(JSON.stringify(this.model)));
    this.moneyList = JSON.parse(JSON.stringify(this.activities));
    this.motivationList = JSON.parse(JSON.stringify(this.activities));
    this.model = new Activity('');
  }

  moneyDrop(event: CdkDragDrop<string[]>) {
    console.log(event);
    moveItemInArray(
      this.activities,
      event.previousIndex,
      event.currentIndex
    );
  }

  /*
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }
  */
}
