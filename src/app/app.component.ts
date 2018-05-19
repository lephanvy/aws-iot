import { Component, OnInit } from '@angular/core';
import { MenuToggleService } from './services/menu-toggle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  temperature = '';
  data = {};
  mqttClient;
  constructor(public isToggle : MenuToggleService) {
    
  }

  /**
   * Page content class change
   * Track menu open or not using MenuToggleService
   * And add extra class for differernt design
   *
   * @param {isMenuOpen} bool
   * @return {style} obj
   */
  pageContentClasses (isMenuOpen) {
    isMenuOpen = this.isToggle.menu.getValue();
    let style = {
      'an-page-content' : true,
      'menu-open' : !isMenuOpen,
    }
    return style;
  }
  ngOnInit(){
   
  }
}
