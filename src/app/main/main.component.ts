import { Activity } from '../activity';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatTable } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor() { }

  activitiesComplete = false;

  activities = Array<Activity>();
  moneyList = Array<Activity>();
  motivationList = Array<Activity>();

  activityName = '';

  displayedColumns: string[] = ['name', 'money', 'motivation', 'total'];

  resultsGraphLabels = [];
  resultsGraphData = [];
  resultsGraphType = 'pie';

  @ViewChild(MatTable) table: MatTable<any>;

  ngOnInit() {

  }

  addActivity() {
    if (this.activityName !== '' && this.activities.length < 12) {

      const newActivity: Activity = new Activity(this.activityName);

      this.activities.push(newActivity);
      this.moneyList.push(newActivity);
      this.motivationList.push(newActivity);
      this.activityName = '';
    }
    this.activitiesComplete = this.activities.length > 0;
  }
  removeActivity(a: Activity) {
    let index: number;
    index = this.activities.indexOf(a);
    if (index !== -1) {
      this.activities.splice(index, 1);
    }
    index = this.moneyList.indexOf(a);
    if (index !== -1) {
      this.moneyList.splice(index, 1);
    }
    index = this.motivationList.indexOf(a);
    if (index !== -1) {
      this.motivationList.splice(index, 1);
    }
    this.activitiesComplete = this.activities.length > 0;
  }

  moneyDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.moneyList,
      event.previousIndex,
      event.currentIndex
    );
  }

  motivationDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.motivationList,
      event.previousIndex,
      event.currentIndex
    );
  }

  stepChanged(event: StepperSelectionEvent) {
    if (event.selectedIndex === 3) {
      this.generateResults();
    }
  }

  generateResults() {
    this.moneyList.forEach((activity, i) => {
      activity.money = this.moneyList.length - i;
    });
    this.motivationList.forEach((activity, i) => {
      activity.motivation = this.motivationList.length - i;
      activity.calculateValue();
    });
    this.activities = this.activities.sort((a, b) => {
      if (a.total > b.total) {
        return -1;
      }
      if (a.total < b.total) {
        return 1;
      }
      return 0;
    });

    this.table.renderRows();

    this.resultsGraphLabels = this.activities.map((a) => {
      return a.name;
    });
    this.resultsGraphData = this.activities.map((a) => {
      return a.total;
    });
  }
}
