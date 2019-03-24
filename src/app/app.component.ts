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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public breakpointObserver: BreakpointObserver) { }
  title = 'time-chart';
  @ViewChild(MatTable) table: MatTable<any>;

  activitiesComplete = false;
  smallScreen = false;

  activities = Array<Activity>();
  moneyList = Array<Activity>();
  motivationList = Array<Activity>();

  activityName = '';

  displayedColumns: string[] = ['name', 'money', 'motivation', 'total'];

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

  ngOnInit() {
    this.breakpointObserver
      .observe(['(min-width: 550px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.smallScreen = false;
        } else {
          this.smallScreen = true;
        }
      });
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
