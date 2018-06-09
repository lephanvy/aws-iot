import { Component, OnInit, OnDestroy } from '@angular/core';
import AwsIotService from '../../services/aws-iot.service';
import * as AWS from 'aws-sdk';
import { CognitoUtil, CognitoCallback, LoggedInCallback } from '../../services/auth.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UserLoginService } from '../../services/login.service';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})

 

export class ControlComponent implements  OnInit, LoggedInCallback{

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
  Kp_Run: number;
  Ki_Run: number;
  Kd_Run: number;
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

  sendSP: string;
  sendPID: string;

  test: number;
  client;
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

 


  constructor(
    private cognitoUtil: CognitoUtil,
    private router: Router,
    private userService: UserLoginService,

  ) {
   // sessionStorage có công dụng tương tự như cookie, sẽ lưu trữ thông tin trên browser mà người dùng đang truy cập
   // Thông thường chúng ta sử dụng Session để lưu thông tin đăng nhập, giỏ hàng hoặc những dữ liệu mang tính chất tạm thời 
   // và mỗi client sẽ có dữ liệu khác nhau
   // Không gửi dữ liệu lên server, dữ liệu bị mất khi đóng trình duyệt.

   this.credentialSubset = JSON.parse(sessionStorage.getItem('awscrenditals'));
    // console.log(this.cognitoUtil.getCognitoCreds());
    this.dataSource_tank = {
      "chart": {
        "subcaptionFontBold": "0",
        "lowerLimit": "0",
        "upperLimit": "70",
        "lowerLimitDisplay": "Empty",
        "upperLimitDisplay": "Full",
        "numberSuffix": " cm",
        "showValue": "0",
        "majorTMNumber": "8",
        "showhovereffect": "1",
        "bgCOlor": "#ffffff",
        "borderAlpha": "0",
        "cylFillColor": "#008ee4"
      }
    };
    this.dataSource_thermo = {
      "chart": {
        "showBorder": "0",
        "lowerLimit": "20",
        "upperLimit": "60",
        "decimals": "1",
        "numberSuffix": "°C",
        "showhovereffect": "1",
        "thmFillColor": "#ff0000",
        "showGaugeBorder": "1",
        "gaugeBorderColor": "#383535",
        "gaugeBorderThickness": "2",
        "gaugeBorderAlpha": "30",
        "thmOriginX": "100",
        "chartBottomMargin": "20",
        "valueFontColor": "#000000",
        "theme": "fint",
        "bgColor": "FFFFFF",

      },
    }
 

// Đèn màu đỏ
    this.offstyle = {height: '110px',
    width : '110px',
   'background-color': '#e61912',
    'border-radius': '50%',
    'margin-top':'0',
      'margin-right':'auto',
      'margin-bottom':'0',
      'margin-left':'auto',
     'box-shadow': 'rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px'
    }
// Đèn màu xanh
    this.onstyle = {height: '110px',
    width : '110px',
    'background-color': 'rgb(32, 187, 12)',
    'border-radius': '50%',
    'margin-top':'0',
      'margin-right':'auto',
      'margin-bottom':'0',
      'margin-left':'auto',
     'box-shadow': 'rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, #89FF00 0 2px 12px'
    }

    
     }

  ngOnInit() {


  
    this.userService.isAuthenticated(this);
  
    // Attempt to authenticate to the Cognito Identity Pool.  
    //
    AWS.config.region = 'ap-southeast-1';
    var clientId = `MyRaspberry-${Math.floor((Math.random() * 1000000) + 1)}`;
    var option = {
      region: AWS.config.region,
      host: 'a1mfymhqf477u9.iot.ap-southeast-1.amazonaws.com',
      clientId: clientId,
      protocol: 'wss',
      maximumReconnectTimeMs: 8000,
      debug: true,
      accessKeyId: this.credentialSubset.accessKeyId,
      secretKey: this.credentialSubset.secretAccessKey,
      sessionToken: this.credentialSubset.sessionToken
    }
    this.client = new AwsIotService(true, option);
    
    console.log(this.client)
      var currentUser = this.cognitoUtil.getCurrentUser();
      
       console.log(currentUser)
       console.log(AWS.config.credentials);
       if (currentUser != null) {
         currentUser.getSession(function (err, result) {
           if (result) {
             console.log('You are now logged in.');
             let poolArn = 'cognito-idp.' + AWS.config.region + '.amazonaws.com/' + environment.userPoolId;
             // Add the User's Id Token to the Cognito credentials login map.
             AWS.config.credentials = new AWS.CognitoIdentityCredentials({
               IdentityPoolId: environment.identityPoolId,
               Logins: {
                 [poolArn]: result.getIdToken().getJwtToken()
               }
             });
             AWS.config.update({ region: AWS.config.region });
             AWS.config.getCredentials((error) => {
               if (error) {
                 console.log(error);
               }
              const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;
              this.client.updateWebSocketCredentials(accessKeyId, secretAccessKey, sessionToken)
              
             });
           }
         });
       }
      

    //Sự kiện nhận message
        // message.data --> topic
        // message.payload.toString() --> JSON string
    this.client.onMessage().subscribe(message => {
     console.log(message);
     console.log((message.payload.toString()));
    
    //Chuyển chuỗi JSON thành các biến riêng lẻ
   let plcdata = JSON.parse(message.payload.toString());
   
    this.Run = parseInt(plcdata.Run) 
    this.Auto_Man = parseInt(plcdata.Auto_Man)
    this.Pump_In = parseInt(plcdata.Pump_In)
    this.Pump_Cir = parseInt(plcdata.Pump_Cir)
    this.Pump_Out = parseInt(plcdata.Pump_Out)
    this.ActFreq = parseFloat(plcdata.ActFreq)
    this.Kp_Run = parseFloat(plcdata.Kp_Run)
    this.Ki_Run = parseFloat(plcdata.Ki_Run)
    this.Kd_Run = parseFloat(plcdata.Kd_Run)
    this.Level_SP_Run = parseFloat(plcdata.Level_SP_Run)
    this.Level_PV = parseFloat(plcdata.Level_PV)
    this.Temper_SP_Run = parseFloat(plcdata.Temper_SP_Run)
    this.Temper_PV1 = parseFloat(plcdata.Temper_PV1)
    this.Temper_PV2 = parseFloat(plcdata.Temper_PV2)
    this.No_Batch = parseInt(plcdata.No_Batch)
    this.dataSource_tank.value = this.Level_PV;
    this.dataSource_thermo.value = this.Temper_PV1;
   
   

    if (this.Auto_Man ===0) {this.auto_man_string ="MANUAL"
    } else {this.auto_man_string ="AUTO"}
    if ((this.Pump_In ===1) && (this.Pump_Cir ===0) && (this.Pump_Out ===0))
       {
      this.process_string = "Pump In"
      this.progressbarvalue = 0
      this.progressbarbuffer = 33.33
       } else if ((this.Pump_In ===0) && (this.Pump_Cir ===1) && (this.Pump_Out ===0))
           {
            this.process_string = "Circulating"
            this.progressbarvalue = 33.33
            this.progressbarbuffer = 66.67
           } else if ((this.Pump_In ===0) && (this.Pump_Cir ===0) && (this.Pump_Out ===1))
               {
            this.process_string = "Pump Out"
            this.progressbarvalue = 66.67
            this.progressbarbuffer = 100
               } else if ((this.Pump_In ===0) && (this.Pump_Cir ===0) && (this.Pump_Out ===0))
                   {
                    this.process_string = "Waiting..."
                    this.progressbarvalue = 0
                    this.progressbarbuffer = 0
                    } else {
                      this.process_string = "Error!!!"
                      this.progressbarvalue = 0
                      this.progressbarbuffer = 0
                      }
    });

   
    // Sự kiện khi kết nối thành công
    this.client.onEvent('connect').subscribe(() => {
      console.log('connect');
      this.client.subscribe('Update');
      this.client.publish('connection', JSON.stringify({ test_data: 1 }))
      
    });

  }

  
  setSP() {
   this.sendSP =" " + (this.sendLevel_SP*100) + " " + (this.sendTemper_SP*100)
    this.client.publish('setSPPP',this.sendSP)
    console.log(this.sendSP)
         }
  setPID() {
          this.sendPID =" " + (this.sendKp*100) + " " + (this.sendKi*100) + " " + (this.sendKd*100)
           this.client.publish('setPIDDD',this.sendPID)
           console.log(this.sendPID)
                }  


  mouseDown_start() {
    this.sendStart = 1;
    this.client.publish('Start_Stop'," 1");
    console.log("Start = 1")
  }
  mouseUp_start() {
    this.sendStart = 0;
    console.log("Start = 0")
  }
  mouseDown_stop() {
    this.sendStop = 1;
    this.client.publish('Start_Stop'," 2");
    console.log("Stop = 1")
  }
  mouseUp_stop() {
    this.sendStop = 0;
    console.log("Stop = 0")
  }
  mouseDown_reset() {
    this.sendReset = 1;
    this.client.publish('Resett'," ");
    console.log("Reset = 1")
  }
  mouseUp_reset() {
    this.sendReset = 0;
    console.log("Reset = 0")
  }
  mouseDown_emergency() {
    this.sendEmergency = 1;
    this.client.publish('Emergency'," ");
    console.log("Emergency = 1")
  }
  mouseUp_emergency() {
    this.sendEmergency = 0;
    console.log("Emergency = 0")
  }


  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
      console.log("result: " + this.errorMessage);
    } else { //success
      //move to the next step
      console.log("redirecting");
      this.router.navigate(['/']);
    }
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn)
      this.router.navigate(['/login']);
  }

}
