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

  sendSP: string;
  sendPID: string;

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
    this.ActFreq = parseFloat(plcdata.ActFreq)
    this.Kp = parseFloat(plcdata.Kp)
    this.Ki = parseFloat(plcdata.Ki)
    this.Kd = parseFloat(plcdata.Kd )
    this.Level_SP = parseFloat(plcdata.Level_SP)
    this.Level_PV = parseFloat(plcdata.Level_PV)
    this.Temper_SP = parseFloat(plcdata.Temper_SP)
    this.Temper_PV1 = parseFloat(plcdata.Temper_PV1)
    this.Temper_PV2 = parseFloat(plcdata.Temper_PV2)
    this.No_Batch = parseInt(plcdata.No_Batch)
    this.dataSource_tank.value = this.Level_PV;
    this.dataSource_thermo.value = this.Temper_PV1;
   
// Gán giá trị hiển thị bồn và đồng hồ nhiệt độ
   
   // this.dataSource_line.value = this.Level_PV;

  // this.

// line chart
/*
function addLeadingZero(num) {
  return (num <= 9) ? ("0" + num) : num;

}*/

//let currDate = new Date()
//let label = addLeadingZero(currDate.getHours()) + ":" +
      //              addLeadingZero(currDate.getMinutes()) + ":" +
        //            addLeadingZero(currDate.getSeconds())

        //            this.dataSource_line.strData = "&label=" + label + "&value=" + this.Level_PV;



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

            
          

      //this.client.publish('plc', JSON.stringify({"Level_SP": this.Level_SP}))
    });

   
   

    // Sự kiện khi kết nối thành công
    this.client.onEvent('connect').subscribe(() => {
      console.log('connect');
      
      this.client.subscribe('Update');
    
      this.client.publish('connection', JSON.stringify({ test_data: 1 }))
    //  alert('Connected to AWS IoT');
      
    });
    // this.mttq.on('reconnect', function () {
    //   console.log('reconnect')
    // });
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
/* {"Level_SP": this.sendLevel_SP,  
       "Temper_SP": this.sendTemper_SP,
       "Kp": this.sendKp,
       "Ki": this.sendKi,
       "Kd": this.sendKd
    }*/

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
 // ngOnDestroy() {
 // }
}
