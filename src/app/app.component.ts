import { Activity } from './activity';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatTable } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color } from 'ng2-charts';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Motivator } from './motivator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }
  title = 'formul8';
  minActivities = 2;
  @ViewChild(MatTable) table: MatTable<any>;

  activities = Array<Activity>();
  factor1List = Array<Activity>();
  factor2List = Array<Activity>();
  activityName = '';

  motivatorsList: Motivator[] = [
    new Motivator('', 'cogs'),
    new Motivator('', 'piggy-bank'),
    new Motivator('', 'trophy'),
    new Motivator('', 'heart'),
    new Motivator('', 'binoculars'),
    new Motivator('', 'dumbbell'),
    new Motivator('', 'pound-sign'),
    new Motivator('', 'smile'),
    new Motivator('', 'brain'),
    new Motivator('', 'eye'),
    new Motivator('', 'chart-line'),
    new Motivator('', 'lemon')
  ];
  motivator1: Motivator;
  motivator2: Motivator;

  displayedColumns: string[] = ['name', 'factor1', 'factor2', 'total'];

  resultsGraphData = [];
  resultsGraphLabels = [];
  resultsGraphType = 'pie';
  resultsGraphColors: Color[] = [/*
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }*/
  ];
  resultsGraphOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 1,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
    cutoutPercentage: 0
  };
  resultsGraphLegend = true;
  resultsGraphPlugins = [pluginDataLabels];

  motivatorEnable(m: Motivator) {
    if (this.motivator1 == null) {
      this.motivator1 = m;
    } else if (this.motivator2 == null) {
      this.motivator2 = m;
    } else {
      this.motivator1 = this.motivator2;
      this.motivator2 = m;
    }
  }
  motivatorDisable(m: Motivator) {
    if (this.motivator1 === m) {
      this.motivator1 = this.motivator2;
      this.motivator2 = null;
    }
    if (this.motivator2 === m) {
      this.motivator2 = null;
    }
  }
  motivatorEnabled(m: Motivator): boolean {
    return (this.motivator1 === m || this.motivator2 === m);
  }
  motivatorsComplete(): boolean {
    return (this.motivator1 != null && this.motivator2 != null);
  }

  addActivity() {
    if (this.activityName !== '' && this.activities.length < 12) {

      const newActivity: Activity = new Activity(this.activityName);

      this.activities.push(newActivity);
      this.factor1List.push(newActivity);
      this.factor2List.push(newActivity);
      this.activityName = '';
    }
  }
  removeActivity(a: Activity) {
    let index: number;
    index = this.activities.indexOf(a);
    if (index !== -1) {
      this.activities.splice(index, 1);
    }
    index = this.factor1List.indexOf(a);
    if (index !== -1) {
      this.factor1List.splice(index, 1);
    }
    index = this.factor2List.indexOf(a);
    if (index !== -1) {
      this.factor2List.splice(index, 1);
    }
  }

  factor1Drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.factor1List,
      event.previousIndex,
      event.currentIndex
    );
  }

  factor2Drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.factor2List,
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
    this.factor1List.forEach((activity, i) => {
      activity.factor1 = this.factor1List.length - i;
    });
    this.factor2List.forEach((activity, i) => {
      activity.factor2 = this.factor2List.length - i;
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

    /*this.resultsGraphLabels = this.activities.map((a, k) => {
      return a.name;
    });
    this.resultsGraphData = this.activities.map((a, k) => {
      return a.total;
    });*/

    this.resultsGraphLabels = [];
    this.resultsGraphData = [];

    this.activities.forEach((a, k) => {
      if (k <= 4) {
        this.resultsGraphLabels.push(a.name);
        this.resultsGraphData.push(a.total);
      } else if (k === 5) {
        this.resultsGraphLabels.push('Everything Else');
        this.resultsGraphData.push(a.total);
      } else {
        this.resultsGraphData[5] += a.total;
      }
    });
  }
}
