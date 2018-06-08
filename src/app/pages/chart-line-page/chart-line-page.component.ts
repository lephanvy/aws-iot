import { Component, OnInit, OnDestroy } from '@angular/core';
import AwsIotService from '../../services/aws-iot.service';
//import * as AWS from 'aws-sdk';
//import { CognitoUtil, CognitoCallback, LoggedInCallback } from '../../services/auth.service';
import { environment } from 'environments/environment';
//import { Router } from '@angular/router';
//import { UserLoginService } from '../../services/login.service';
//import { TrendService } from '../../services/trend.service';

var chart_levelsp
var chart_levelpv
var chart_tempersp
var chart_temperpv

@Component({
  selector: 'app-chart-line-page',
  templateUrl: './chart-line-page.component.html',
  styleUrls: ['./chart-line-page.component.scss']
})
export class ChartLinePageComponent implements OnInit {
 // Khai báo biến nhận về
 Temper_SP_Run: number;
 Temper_PV1: number;
 Temper_PV2: number;
 Level_SP_Run: number;
 Level_PV: number;
 Run: number;
 ActFreq: number;
 Auto_Man: number;
 Pump_In: number;
 Pump_Cir: number;
 Pump_Out: number;
 No_Batch: number;
 // Khai báo biến gửi đi
 sendKp: number;
 sendKi: number;
 sendKd: number;
 sendStart: number;
 sendStop: number;
 sendLevel_SP: number;
 sendTemper_SP: number;
 sendEmergency: number;
 sendReset: number;
 // Biến tạm
 plcdata;
 onstyle;
 offstyle;
 auto_man_string: string;
 progressbarvalue: number;
 progressbarbuffer: number;
 process_string: string;

 datafromWeb: string;

 test: number;
 temperature;
 client;
 value = 50;
 color = 'primary';
 mode = 'indeterminate';
 modeOne = 'determinate';
 // Tank indicator
 id_tank = 'chart1';
 width_tank = 200;
 height_tank = 280;
 type_tank = 'cylinder';
 //error message
 errorMessage;
 // Fusion Chart
 dataFormat = 'json';
 dataSource_tank;
 credentialSubset;
 //Thermometer
 type_thermo = 'thermometer';
 width_thermo = 150;
 height_thermo = 195;
 dataSource_thermo;

 //Line chart
 type_line = 'realtimelinedy';
 width_line = 480;
 height_line = 320;
 dataSource_level;
 dataSource_temper;
events_level;
events_temper;

  constructor(
    //private trendService : TrendService
    
  ) {

    this.client = new AwsIotService;
 // Đồ thị mực nước   
    this.dataSource_level ={
      "chart": {
        "drawAnchors":'0',
        "showSecondaryLimits":"0", 
        "caption": "Level",
       // "subCaption": "Harry's Supermart",
        "captionFontSize": "20",
       // "subcaptionFontSize": "14",
        "baseFontColor" : "#333333",
        "baseFont" : "Helvetica Neue,Arial",                        
        "subcaptionFontBold": "0",
        "paletteColors" : "#13ad15,#0020c2",
        "bgColor" : "#ffffff",
        "canvasBgColor" : "#f7f4f4",
        "showBorder" : "0",
        "showShadow" : "0",
        "showCanvasBorder": "0",
        "showRealTimeValue": "0",
        "legendBorderAlpha": "0",
        "legendShadow": "0",
        "numbersuffix": "cm",
        "setadaptiveymin": "1",
      //  "showYAxisValues": "1",
      "showDivLineSecondaryValue" : "0",
        "setadaptivesymin": "1",
        "xaxisname": "Time",
        "labeldisplay": "Rotate",
        "slantlabels": "1",
        "pyaxisminvalue": "0",
        "pyaxismaxvalue": "50",
        "syaxisminvalue": "0",
        "syaxismaxvalue": "50",
        "divlineAlpha" : "100",
        "divlineColor" : "#999999",
        "showAlternateHGridColor" : "0",
        "divlineThickness" : "1",
        "divLineIsDashed" : "1",
        "divLineDashLen" : "1",
        "divLineGapLen" : "1",
        "numDisplaySets": "50"
    },
    "categories": [
        {
            "category": [
                { "label": "Start Update" }
            ]
        }
    ],
    "dataset": [
        {
            "seriesname": "Set Point",
            "showvalues": "0",
            "data": [
                { "value": "0" }
            ]
        },
        {
            "seriesname": "Current Value",
            "showvalues": "0",
        //    "parentyaxis": "S",
            "data": [
                { "value": "0" }
            ]
        }
    ],}
 // đồ thị nhiệt độ   
    this.dataSource_temper ={
      "chart": {
        "showSecondaryLimits":"0", 
        "drawAnchors":'0',
        "caption": "Temperature",
       // "subCaption": "Harry's Supermart",
        "captionFontSize": "20",
       // "subcaptionFontSize": "14",
        "baseFontColor" : "#333333",
        "baseFont" : "Helvetica Neue,Arial",                        
        "subcaptionFontBold": "0",
        "paletteColors" : "#f14501,#efbb00",
        "bgColor" : "#ffffff",
        "canvasBgColor" : "#f7f4f4",
        "showBorder" : "0",
        "showShadow" : "0",
        "showCanvasBorder": "0",
        "showRealTimeValue": "0",
        "legendBorderAlpha": "0",
        "legendShadow": "0",
        "numbersuffix": "°C",
        "setadaptiveymin": "1",
      //  "showYAxisValues": "1",
      "showDivLineSecondaryValue" : "0",
        "setadaptivesymin": "1",
        "xaxisname": "Time",
        "labeldisplay": "Rotate",
        "slantlabels": "1",
        "pyaxisminvalue": "0",
        "pyaxismaxvalue": "50",
        "syaxisminvalue": "0",
        "syaxismaxvalue": "50",
        "divlineAlpha" : "100",
        "divlineColor" : "#999999",
        "showAlternateHGridColor" : "0",
        "divlineThickness" : "1",
        "divLineIsDashed" : "1",
        "divLineDashLen" : "1",
        "divLineGapLen" : "1",
        "numDisplaySets": "50"
    },
    "categories": [
        {
            "category": [
                { "label": "Start Update" }
            ]
        }
    ],
    "dataset": [
        {
            "seriesname": "Set Point",
            "showvalues": "0",
            "data": [
                { "value": "0" }
            ]
        },
        {
            "seriesname": "Current Value",
            "showvalues": "0",
        //    "parentyaxis": "S",
            "data": [
                { "value": "0" }
            ]
        }
    ],}


   }

  ngOnInit() {
    chart_levelpv 
    chart_levelsp  
    chart_tempersp 
    chart_temperpv 
    this.client.onMessage().subscribe(message => {
      console.log(message);
      console.log((message.payload.toString()));
      let plcdata = JSON.parse(message.payload.toString());
   
    this.Run = parseInt(plcdata.Run) 
    this.Auto_Man = parseInt(plcdata.Auto_Man)
    this.Pump_In = parseInt(plcdata.Pump_In)
    this.Pump_Cir = parseInt(plcdata.Pump_Cir)
    this.Pump_Out = parseInt(plcdata.Pump_Out)
    this.ActFreq = parseFloat(plcdata.ActFreq)
    this.Level_SP_Run = parseFloat(plcdata.Level_SP_Run)
    this.Level_PV = parseFloat(plcdata.Level_PV)
    this.Temper_SP_Run = parseFloat(plcdata.Temper_SP_Run)
    this.Temper_PV1 = parseFloat(plcdata.Temper_PV1)
    this.Temper_PV2 = parseFloat(plcdata.Temper_PV2)
    this.No_Batch = parseInt(plcdata.No_Batch)
   // this.dataSource_tank.value = this.Level_PV;
  //  this.dataSource_thermo.value = this.Temper_PV1;
    chart_levelpv = parseFloat(plcdata.Level_PV)
    chart_levelsp = parseFloat(plcdata.Level_SP_Run)
    chart_tempersp= parseFloat(plcdata.Temper_SP_Run)
    chart_temperpv= parseFloat(plcdata.Temper_PV1)

    
 
  });
  this.events_temper = {
    'rendered': (evt, args) => {
        //Format minutes, seconds by adding 0 prefix accordingly
        function formatTime(time) {
            (time < 10) ? (time = "0" + time) : (time = time);
            return time;
        }
  
        evt.sender.chartInterval = setInterval(function() {
            //Get reference to the chart using its ID
            var chartRef = evt.sender,
                //We need to create a querystring format incremental update, containing
                //label in hh:mm:ss format
                //and a value (random).
                currDate = new Date(),
                label = formatTime(currDate.getHours()) + ":" + formatTime(currDate.getMinutes()) + ":" + formatTime(currDate.getSeconds()),
                //Get random number between 30 & 35 - rounded to 2 decimal places
             randomValue = Math.floor(Math.random() * 500) / 100 + 30,
                //Build Data String in format &label=...&value=...
                strData = "&label=" + label + "&value=" + chart_tempersp + "|" + chart_temperpv;
            //Feed it to chart.
            chartRef.feedData(strData);
  
        }, 500);
  
    },
    "disposed": function(evt, args) {
        clearInterval(evt.sender.chartInterval);
    }
  }
  this.events_level = {
      'rendered': (evt, args) => {
          //Format minutes, seconds by adding 0 prefix accordingly
          function formatTime(time) {
              (time < 10) ? (time = "0" + time) : (time = time);
              return time;
          }
  
          evt.sender.chartInterval = setInterval(function() {
              //Get reference to the chart using its ID
              var chartRef = evt.sender,
                  //We need to create a querystring format incremental update, containing
                  //label in hh:mm:ss format
                  //and a value (random).
                  currDate = new Date(),
                  label = formatTime(currDate.getHours()) + ":" + formatTime(currDate.getMinutes()) + ":" + formatTime(currDate.getSeconds()),
                  //Get random number between 30 & 35 - rounded to 2 decimal places
               randomValue = Math.floor(Math.random() * 500) / 100 + 30,
                  //Build Data String in format &label=...&value=...
                  strData = "&label=" + label + "&value=" + chart_levelsp + "|" + chart_levelpv;
              //Feed it to chart.
              chartRef.feedData(strData);
  
          }, 500);
  
      },
      "disposed": function(evt, args) {
          clearInterval(evt.sender.chartInterval);
      }
  }
  }
  


  mouseDown_start() {
    this.sendStart = 1;
    //let tempStart: string = " " + this.sendStart
    this.client.publish('Start_Stop'," 1");
    console.log("Start = 1")
  }
  mouseUp_start() {
    this.sendStart = 0;
   // let tempStart: string = " " + this.sendStart
   // this.client.publish('Start',tempStart);
    console.log("Start = 0")
  }
  mouseDown_stop() {
    this.sendStop = 1;
   // let tempStop: string = " " + this.sendStop
    this.client.publish('Start_Stop'," 2");
    console.log("Stop = 1")
  }
  mouseUp_stop() {
    this.sendStop = 0;
   // let tempStop: string = " " + this.sendStop
   // this.client.publish('Stop',tempStop);
    console.log("Stop = 0")
  }
mouseDown_reset() {
  this.sendReset = 1;
 // let tempReset: string = " " + this.sendReset
  this.client.publish('Resett'," ");
  console.log("Reset = 1")
}
mouseUp_reset() {
  this.sendReset = 0;
 // let tempReset: string = " " + this.sendReset
 // this.client.publish('Resett',tempReset);
  console.log("Reset = 0")
}
mouseDown_emergency() {
  this.sendEmergency = 1;
//  let tempEmergency: string = " " + this.sendEmergency
  this.client.publish('Emergency'," ");
  console.log("Emergency = 1")
}
mouseUp_emergency() {
  this.sendEmergency = 0;
//  let tempEmergency: string = " " + this.sendEmergency
//  this.client.publish('Emergency',tempEmergency);
  console.log("Emergency = 0")
}

}
