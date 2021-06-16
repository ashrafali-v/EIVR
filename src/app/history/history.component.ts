import { Component, OnInit,Injectable } from '@angular/core';
import { CommonAppService } from '../services/common-app.service';
import { catchError,retry } from 'rxjs/operators';
import { Subject,of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLogComponent } from '../modals/user-log/user-log.component';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class HistoryComponent implements OnInit {
  paymentList$:any = [];
  loadingError$ = new Subject<boolean>();
  currentPage: any = 1;
  pageSize: number = 10;
  day: any;
  month: any;
  public scrollbarOptions = { axis: 'y', theme: '3d-thick' };
  model: NgbDateStruct;
  placement = 'bottom';
  maxDate:any;
  constructor(private sharedService: CommonAppService,private modalService: NgbModal) { this.sharedService.setComponentStatus(true,true,true); }

  ngOnInit(): void {
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.getPayementsList('today');
  }
  getUserLog(contactId:any){
    const messageInfoModalRef = this.modalService.open(UserLogComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "xl",
      scrollable: true,
      backdrop: 'static'
    });
    messageInfoModalRef.componentInstance.modalTitle = "View User Info";
    messageInfoModalRef.componentInstance.modalDescription = "View userlog description";
    messageInfoModalRef.componentInstance.contactId = contactId; 
  }
  getPayementsList(dateStaus:string){
    let date = this.todayDate();
    if(dateStaus == 'custom'){
      console.log(this.model);
      date = this.model.month + '/' + this.model.day + '/' + this.model.year;
    }
    this.paymentList$ = this.sharedService.getPaymentList(date).pipe(
      catchError(error => {
        console.error('error loading the list of users', error);
        this.loadingError$.next(true);
        return of();
      }),
      retry(2)
    );
  }
  public todayDate() {
    const today = new Date();
    this.day = today.getDate();
    this.month = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var todayDate = this.month + '/' + this.day + '/' + yyyy;
    console.log(today);
    return todayDate;
  }
}
