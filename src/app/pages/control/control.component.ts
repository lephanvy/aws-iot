import { Component, OnInit } from '@angular/core';
import AwsIotService from '../../services/aws-iot.service';
import * as AWS from 'aws-sdk';
import {CognitoUtil, CognitoCallback, LoggedInCallback} from '../../services/auth.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UserLoginService } from '../../services/login.service';
@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, LoggedInCallback {
  sp: number;
  pv;
  freq;
  temperature;
  client;
  value = 50;
  color = 'primary';
  mode = 'indeterminate';
  modeOne = 'determinate';
  errorMessage
  constructor(
    private cognitoUtil : CognitoUtil,
    private router: Router,
    private userService: UserLoginService
  ) {
    this.userService.isAuthenticated(this);
    console.log(this.cognitoUtil.getCognitoCreds());
   }

  ngOnInit() {
   
    // this.mqtt =new AwsIotService(true, option );
    //
    // Attempt to authenticate to the Cognito Identity Pool.  Note that this
    // example only supports use of a pool which allows unauthenticated 
    // identities.
    //
    AWS.config.region = 'ap-southeast-1';
    let credentialSubset;
    console.log(this.client)
    var currentUser = this.cognitoUtil.getCurrentUser();
    credentialSubset = this.cognitoUtil.getCognitoCreds();
    console.log(currentUser)
    // console.log(credentials)
    console.log(AWS.config.credentials);
    if (currentUser != null) {
      currentUser.getSession(function(err, result) {
        if (result) {
          console.log('You are now logged in.');
          let poolArn = 'cognito-idp.'+ AWS.config.region +'.amazonaws.com/' + environment.userPoolId;
          // Add the User's Id Token to the Cognito credentials login map.
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: environment.identityPoolId,
            Logins: {
              [poolArn]: result.getIdToken().getJwtToken()
            }
          });
          AWS.config.update({region: AWS.config.region});
          AWS.config.getCredentials((error) => {
            if (error) {
              console.log(error);
            }
      
            const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;
            credentialSubset = { accessKeyId, secretAccessKey, sessionToken };
            console.log(credentialSubset)
          });
        }
      });
    }
    console.log(this.temperature);
    
    
    
    var clientId = `mqtt-explorer-${Math.floor((Math.random() * 1000000) + 1)}`;
    var option = {
      region: AWS.config.region,
      host: 'a1mfymhqf477u9.iot.ap-southeast-1.amazonaws.com',
      clientId: clientId,
      protocol: 'wss',
      maximumReconnectTimeMs: 8000,
      debug: true,
      accessKeyId: credentialSubset.accessKeyId,
      secretKey: credentialSubset.secretAccessKey,
      sessionToken: credentialSubset.sessionToken
    }
    this.client = new AwsIotService(true, option );

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
    if(this.sp){
      this.client.publish('temperature', this.sp);
    }

    if(this.pv){
      this.client.publish('temperature', this.sp);
    }

    if(this.freq){
      this.client.publish('temperature', this.sp);
    }
    
  }

  start(){
      this.client.publish('status', true);
  }

  stop(){
    this.client.publish('status', false);
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
