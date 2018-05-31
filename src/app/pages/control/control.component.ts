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
  Temper_SP: number;
  Temper_PV1: number;
  Temper_PV2: number;
  Level_SP: number;
  Level_PV: number;
  Run: number;
  ActFreq: number;
  Auto_Man: number;
  Pump_In: number;
  Pump_Cir: number;
  Pump_Out: number;
  Kp: number;
  Ki: number;
  Kd: number;
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


  constructor(
    private cognitoUtil: CognitoUtil,
    private router: Router,
    private userService: UserLoginService,

  ) {
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
        "upperLimit": "70",
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
    //this.mqtt =new AwsIotService(true, option );
    //
    // Attempt to authenticate to the Cognito Identity Pool.  Note that this
    // example only supports use of a pool which allows unauthenticated 
    // identities.
    //
    AWS.config.region = 'ap-southeast-1';
    
    // console.log(credentialSubset)
    console.log(this.client)
      var currentUser = this.cognitoUtil.getCurrentUser();
      //  credentialSubset = this.cognitoUtil.getCognitoCreds();
       console.log(currentUser)
       // console.log(credentials)
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
   
              //  const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;
              //  credentialSubset = { accessKeyId, secretAccessKey, sessionToken };
              //  console.log(credentialSubset)
             });
           }
         });
       }
       console.log(this.temperature); 


       //vẫn dùng public access
       //ko connect khi login bằng cognito???
    var clientId = `MyRaspberry-${Math.floor((Math.random() * 1000000) + 1)}`;
    var option = {
      region: AWS.config.region,
      host: 'a1mfymhqf477u9.iot.ap-southeast-1.amazonaws.com',
      clientId: clientId,
      protocol: 'wss',
      maximumReconnectTimeMs: 8000,
      debug: true,
      accessKeyId:'AKIAJ3DTSVPKS5KBLSSA',// this.credentialSubset.accessKeyId,
      secretKey: '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' ,//this.credentialSubset.secretAccessKey,
      // sessionToken: this.credentialSubset.sessionToken
    }
    this.client = new AwsIotService(true, option);

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
    this.ActFreq = parseInt(plcdata.ActFreq)
    this.Kp = parseInt(plcdata.Kp)
    this.Ki = parseInt(plcdata.Ki)
    this.Kd = parseInt(plcdata.Kd )
    this.Level_SP = parseInt(plcdata.Level_SP)
    this.Level_PV = parseInt(plcdata.Level_PV)
    this.Temper_SP = parseInt(plcdata.Temper_SP)
    this.Temper_PV1 = parseInt(plcdata.Temper_PV1)
    this.Temper_PV2 = parseInt(plcdata.Temper_PV2)
    this.No_Batch = parseInt(plcdata.No_Batch)

// Gán giá trị hiển thị bồn và đồng hồ nhiệt độ
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
               } else
                   {
                    this.process_string = "Waiting..."
                    this.progressbarvalue = 0
                    this.progressbarbuffer = 0
                    }
            
          

      //this.client.publish('plc', JSON.stringify({"Level_SP": this.Level_SP}))
    });

    // Sự kiện khi kết nối thành công
    this.client.onEvent('connect').subscribe(() => {
      console.log('connect');
      this.client.subscribe('plc');
      this.client.publish('connection', JSON.stringify({ test_data: 1 }))
      
    });
    // this.mttq.on('reconnect', function () {
    //   console.log('reconnect')
    // });
  }
  setValue() {
   this.datafromWeb = "datafromWeb" + " " + this.sendLevel_SP + " " + this.sendTemper_SP + " " + this.sendKp + " " + this.sendKi + " " + this.sendKd
    this.client.publish('datafromWeb',this.datafromWeb)
    console.log(this.datafromWeb)
         }
/* {"Level_SP": this.sendLevel_SP,  
       "Temper_SP": this.sendTemper_SP,
       "Kp": this.sendKp,
       "Ki": this.sendKi,
       "Kd": this.sendKd
    }*/

  mouseDown_start() {
    this.sendStart = 1;
    let tempStart: string = "sendStart" + " " + this.sendStart
    this.client.publish('sendStart',tempStart);
    console.log("Start = 1")
  }
  mouseUp_start() {
    this.sendStart = 0;
    let tempStart: string = "sendStart" + " " + this.sendStart
    this.client.publish('sendStart',tempStart);
    console.log("Start = 0")
  }
  mouseDown_stop() {
    this.sendStop = 1;
    let tempStop: string = "sendStop" + " " + this.sendStop
    this.client.publish('sendStop',tempStop);
    console.log("Stop = 1")
  }
  mouseUp_stop() {
    this.sendStop = 0;
    let tempStop: string = "sendStop" + " " + this.sendStop
    this.client.publish('sendStop',tempStop);
    console.log("Stop = 0")
  }
  mouseDown_reset() {
    this.sendReset = 1;
    let tempReset: string = "sendReset" + " " + this.sendReset
    this.client.publish('sendReset',tempReset);
    console.log("Reset = 1")
  }
  mouseUp_reset() {
    this.sendReset = 0;
    let tempReset: string = "sendReset" + " " + this.sendReset
    this.client.publish('sendReset',tempReset);
    console.log("Reset = 0")
  }
  mouseDown_emergency() {
    this.sendEmergency = 1;
    let tempEmergency: string = "sendEmergency" + " " + this.sendEmergency
    this.client.publish('sendEmergency',tempEmergency);
    console.log("Emergency = 1")
  }
  mouseUp_emergency() {
    this.sendEmergency = 0;
    let tempEmergency: string = "sendEmergency" + " " + this.sendEmergency
    this.client.publish('sendEmergency',tempEmergency);
    console.log("Emergency = 0")
  }


  /*start() {   
    this.client.publish('status', true);
  }

  stop()  {
    this.client.publish('status', false);
    //this.start_state=1;
  }
*/
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
  ngOnDestroy() {

  }
}
