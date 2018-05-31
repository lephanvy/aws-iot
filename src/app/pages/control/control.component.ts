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

  sp: number;
  pv;
  freq;
  Temper_SP: number;
  Temper_PV1: number;
  Temper_PV2: number;
  Level_SP: number;
  Level_PV: number;
  Start: number;
  Stop: number;
  Run: number;
  ActFreq: number;
  Auto_Man: number;
  Pump_In: number;
  Pump_Cir: number;
  Pump_Out: number;
  Kp: number;
  Ki: number;
  Kd: number;
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
      "value": "30",

    }
     
  }

  ngOnInit() {
    this.userService.isAuthenticated(this);
    // this.mqtt =new AwsIotService(true, option );
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

    this.client.onMessage().subscribe(message => {
      console.log(message);
      console.log((message.payload.toString()))
      this.temperature = message
    });
    console.log(this.temperature)
    this.client.onEvent('connect').subscribe(() => {
      console.log('connect');
      this.client.subscribe('Auto_Man');
      this.client.publish('topic_1', JSON.stringify({ test_data: 1 }))
    });
    // this.mttq.on('reconnect', function () {
    //   console.log('reconnect')
    // });
  }
  setValue() {
    if (this.Level_SP) {
      this.dataSource_tank.value = this.Level_SP;
      this.client.publish('Level_SP', this.Level_SP);
    }

    if (this.Temper_SP) {
      this.client.publish('Temper_SP', this.Temper_SP);
    }

    if (this.Kp) {
      this.client.publish('Kp', this.Kp);
    }
    if (this.Ki) {
      this.client.publish('Ki', this.Ki);
    }
    if (this.Kd) {
      this.client.publish('Kd', this.Kd);
    }

  }

  mouseDown_start() {
    this.Start = 1;
    console.log(this.Start)
  }
  mouseUp_start() {
    this.Start = 0;
    console.log(this.Start)
  }
  mouseDown_stop() {
    this.Stop = 1;
  }
  mouseUp_stop() {
    this.Stop = 0;
  }



  /*start() {
    this.client.publish('status', true);
  }

  stop() {
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
