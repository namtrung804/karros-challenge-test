import {Component, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {TranslateService} from "@ngx-translate/core";
import {AlertService} from "../../services/alert.service";

@Component({

  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  message: any;
  public isModalShown: boolean = false;
  fadeIn: boolean = true;
  classNoti: string = 'success';

  constructor(private alertService: AlertService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => {
      this.message = message;
      if (this.message) {
        this.fadeIn = true;
        if (this.message.type == 'error') {
          this.classNoti = 'critical';
        }
        setTimeout(() => {
          this.fadeIn = false;
          this.closeNoti();
        }, 6000);
      }
    });

  }

  closeNoti() {
    this.message = '';
  }

  reloadPage() {
    location.reload();
  }

  public onHidden(): void {
    this.isModalShown = false;
  }
}
