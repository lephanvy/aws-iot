import { Component, OnInit } from '@angular/core';
import AwsIotService from '../../services/aws-iot.service';
import * as AWS from 'aws-sdk';
@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
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
  temperature;
  client;
  value = 50;
  color = 'primary';
  mode = 'indeterminate';
  modeOne = 'determinate';

  constructor() { }

  ngOnInit() {
    console.log(this.temperature);
    AWS.config.region = 'ap-southeast-1';

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'ap-southeast-1:d5edac6d-1272-4f6d-8173-11a3833c96ae'
    });
    var clientId = `mqtt-explorer-${Math.floor((Math.random() * 1000000) + 1)}`;
    var option = {
      region: AWS.config.region,
      host: 'a11hxdydcp5r2q.iot.ap-southeast-1.amazonaws.com',
      clientId: clientId,
      protocol: 'wss',
      maximumReconnectTimeMs: 8000,
      debug: true,
      accessKeyId: 'AKIAJBSUIWZDOAJFUFTA',
      secretKey: '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',
    }
    this.client = new AwsIotService(true, option );
    // this.mqtt =new AwsIotService(true, option );
    //
    // Attempt to authenticate to the Cognito Identity Pool.  Note that this
    // example only supports use of a pool which allows unauthenticated 
    // identities.
    //
    var cognitoIdentity = new AWS.CognitoIdentity();
    AWS.config.getCredentials(function (err) {
      console.log(AWS.config.credentials);
      console.log((<AWS.CognitoIdentityCredentials>AWS.config.credentials).identityId);
      if (!err) {
        // console.log('retrieved identity: ' + (<AWS.CognitoIdentityCredentials>AWS.config.credentials).identityId);
        var params = {
          IdentityId: (<AWS.CognitoIdentityCredentials>AWS.config.credentials).identityId
        };
        cognitoIdentity.getCredentialsForIdentity(params, function (err, data) {
          if (!err) {
            //
            // Update our latest AWS credentials; the MQTT client will use these
            // during its next reconnect attempt.
            //
            this.client.updateWebSocketCredentials(data.Credentials.AccessKeyId,
              data.Credentials.SecretKey,
              data.Credentials.SessionToken);
          } else {
            console.log('error retrieving credentials: ' + err);
            alert('error retrieving credentials: ' + err);
          }
        });
      } else {
        console.log('error retrieving identity:' + err);
        alert('error retrieving identity: ' + err);
      }
    });
    

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
  setValue(){
    if(this.Level_SP){
      this.client.publish('Level_SP', this.Level_SP);
    }

    if(this.Temper_SP){
      this.client.publish('Temper_SP', this.Temper_SP);
    }

    if(this.Kp){
      this.client.publish('Kp', this.Kp);
    }
    if(this.Ki){
      this.client.publish('Ki', this.Ki);
    }
    if(this.Kd){
      this.client.publish('Kd', this.Kd);
    }
    
  }

  mouseDown_start(){
    this.Start=1;
  }
  mouseUp_start(){
    this.Start=0;
  }
  mouseDown_stop(){
    this.Stop=1;
  }
  mouseUp_stop(){
    this.Stop=0;
  }
  /*
  start(){
      this.client.publish('status', true);
  }
*/
/*
  stop(){
    this.client.publish('status', false);
    //this.start_state=1;
  }
*/
}
