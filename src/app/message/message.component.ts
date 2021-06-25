import { Component, OnInit, OnDestroy,Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonAppService } from '../services/common-app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { ToastrService } from 'ngx-toastr';
import { UpdateMessageComponent } from '../modals/update-message/update-message.component'
import { ViewMessageComponent } from '../modals/view-message/view-message.component';
import { DeleteMessageComponent } from '../modals/delete-message/delete-message.component';
import { Subject,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/*-------- Sort code----*/
interface Messages {
  messageKey: string;
  messageText: string;
  messageFlow: string;
}
export type SortColumn = keyof Messages | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

/*-------- Sort code----*/
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  messages$: any = [];
  testMessages:any =[];
  testMessagestemp:any =[];
  getAllMessagesLoader: boolean = true;
  currentPage: any = 1;
  pageSize: number = 10;
  messageKey:any ='';
  loadingError$ = new Subject<boolean>();
  private observableSubscriptions = new SubSink();
  public scrollbarOptions = { axis: 'y', theme: '3d-dark' };
  /*-------- Sort code----*/
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  /*-------- Sort code----*/

  constructor(private sharedService: CommonAppService, private modalService: NgbModal, public toastr: ToastrService) {
    this.sharedService.setComponentStatus(true,true,true);
   }

  ngOnInit(): void {
    this.getAllMessages();
  }
  ngOnDestroy() {
    this.observableSubscriptions.unsubscribe();
  }
  getAllMessages(){
    // this.messages$ =  this.sharedService.getAllMessages().pipe(
    //   catchError((error) =>{
    //     console.error('error loading the list of messages', error);
    //     this.loadingError$.next(true);
    //     return of();
    //   })
    // );
    this.sharedService.getAllMessages().pipe(
      catchError((error) =>{
        console.error('error loading the list of messages', error);
        this.loadingError$.next(true);
        return of();
      })
    ).subscribe(result=>{
      this.messages$ = result;
    });

    // this.messages$ = [
    //   {
    //       "messageKey": "lexInvalidAutopayAccountSelMsg",
    //       "messageText": "This is an invalid entry.  To continue with payment, press 1 pound or say 1. For main menu, press 2 pound or say 2.  To speak with a customer service representative to stop the Automatic Bill Payment, press 0 pound or say 0.",
    //       "messageFlow": "Auto Pay Flow"
    //   },
    //   {
    //       "messageKey": "invalidTextPhoneMsg",
    //       "messageText": "<speak>The phone number entered is invalid.  Please enter your 10 digit phone number with area code, followed by the pound sign.</speak>",
    //       "messageFlow": "Payment Text Flow"
    //   },
    //   {
    //       "messageKey": "confirmAssociatedAccountMsg",
    //       "messageText": "<speak> The account associated with the number you are calling from is {accountNumber}. Press 1 pound or say Yes to confirm or press 2 pound or say No to enter a different account number. </speak>",
    //       "messageFlow": "Account Lookup Flow"
    //   },
    //   {
    //       "messageKey": "cashOnlyMsg",
    //       "messageText": "<speak> This account is not eligible to make a payment through the  pay by phone system.</speak>",
    //       "messageFlow": "Payment Eligibility Flow"
    //   },
    //   {
    //       "messageKey": "testKey",
    //       "messageText": "test message 12345",
    //       "messageFlow": null
    //   },
    //   {
    //       "messageKey": "payInvalidCreditCardMessage",
    //       "messageText": "<speak> The credit card number entered is invalid.  Please enter your credit card number, followed by the pound sign </speak>",
    //       "messageFlow": "Credit Card Flow"
    //   },
    //   {
    //       "messageKey": "payAmountConfirmation",
    //       "messageText": "<speak>The payment amount entered is ${paymentAmount}.  Press 1 pound or say Yes to confirm. Press 2 pound or say No to enter the payment amount.</speak>",
    //       "messageFlow": "Payment Enter Amount Flow"
    //   },
    //   {
    //       "messageKey": "lexTextSelectionPhoneMsg",
    //       "messageText": "Press 1 pound or say 1 to send text confirmation to the number you are calling from, Press 2 pound or say 2 to send text confirmation to a number from your utility account. ",
    //       "messageFlow": "Payment Terms Flow"
    //   },
    //   {
    //       "messageKey": "lexInvalidPayAmountConfirmation",
    //       "messageText": "The payment amount entered is ${paymentAmount}.  Press 1 pound or say Yes to confirm. Press 2 pound or say No to enter the payment amount. ",
    //       "messageFlow": "Payment Enter Amount Flow"
    //   },
    //   {
    //       "messageKey": "lexTextSelectionPhoneMsg",
    //       "messageText": "Press 1 pound or say 1 to send text confirmation to the number you are calling from, Press 2 pound or say 2 to send text confirmation to a number from your utility account. ",
    //       "messageFlow": "Payment Terms Flow"
    //   },
    //   {
    //       "messageKey": "lexInvalidPayAmountConfirmation",
    //       "messageText": "The payment amount entered is ${paymentAmount}.  Press 1 pound or say Yes to confirm. Press 2 pound or say No to enter the payment amount. ",
    //       "messageFlow": "Payment Enter Amount Flow"
    //   },
    //   {
    //       "messageKey": "maxCreditAccountMsg",
    //       "messageText": "<speak> This account has reached the maximum credit balance allowed and is ineligible to make payment through the pay by phone system.</speak>",
    //       "messageFlow": "Payment Eligibility Flow"
    //   },
    //   {
    //       "messageKey": "listAccountMsg",
    //       "messageText": "<speak>Please select from the following list which account you are calling about. {account1}, {account2}, {account3}, {account4} </speak>",
    //       "messageFlow": "Multi Account Flow"
    //   },
    //   {
    //       "messageKey": "lexTextConfirmationSentSuccess",
    //       "messageText": "We have sent you a text confirmation at phone number {phoneNumber}.  Your confirmation number is {transId}.  Press 1 pound or say 1 to make another payment, Press 2 pound or say 2 for main menu. To end your call, simply hang up. ",
    //       "messageFlow": "Payment Text Flow"
    //   }
    // ]
    this.testMessagestemp =this.messages$;
  }
  editMessage(message: any) {
    console.log(message);
    this.observableSubscriptions.add(this.sharedService.getMessage(message.messageKey).subscribe(data => {
      const updateMessageModalRef = this.modalService.open(UpdateMessageComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        scrollable: true,
        backdrop: 'static'
      });
      updateMessageModalRef.componentInstance.modalTitle = "Edit message";
      updateMessageModalRef.componentInstance.modalDescription = "Edit message description";
      updateMessageModalRef.componentInstance.messageKey = data[0].messageKey;
      updateMessageModalRef.componentInstance.messageValue = data[0].messageText;
      updateMessageModalRef.componentInstance.emitService.subscribe((result) => {
        if (result) {
          message.messageText = result;
          updateMessageModalRef.close();
          this.sharedService.saveMessage(message).subscribe(data => {
            this.toastr.success("Message updated successfully", "Success");
          }, err => {
            console.log(err);
            this.toastr.error('Message update failed', 'Error');
          });
        }
      }, (reason) => {
        console.log(reason);
      });
    }));
  }
  messageInfo(data: any) {
    const messageInfoModalRef = this.modalService.open(ViewMessageComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      scrollable: true,
      backdrop: 'static'
    });
    messageInfoModalRef.componentInstance.modalTitle = "View message";
    messageInfoModalRef.componentInstance.modalDescription = "View message description";
    messageInfoModalRef.componentInstance.messageKey = data.messageKey;
    messageInfoModalRef.componentInstance.messageValue = data.messageText;

  }
  deleteMessage(message: any,index:any) {
    const deleteMessageModalRef = this.modalService.open(DeleteMessageComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      scrollable: true,
      backdrop: 'static'
    });
    deleteMessageModalRef.componentInstance.modalTitle = "Delete message";
    deleteMessageModalRef.componentInstance.modalDescription = "Delete message description";
    deleteMessageModalRef.componentInstance.messageKey = message.messageKey;
    deleteMessageModalRef.componentInstance.emitService.subscribe((result) => {
      if (result) {
        var index = this.messages$.findIndex(x => x.messageKey == message.messageKey);
        this.messages$.splice(index,1);
        deleteMessageModalRef.close();
      }
    }, (reason) => {
      console.log(reason);
    });
  }
  searchMessage(){
    this.messages$.length = 0;
    if(this.messageKey != ''){
      this.messageKey = this.messageKey.trim();
      this.messages$ = this.sharedService.getMessage(this.messageKey).pipe(
        catchError((error) =>{
          console.error('error loading the list of messages', error);
          this.loadingError$.next(true);
          return of();
        })
      );
    }else{
      return false;
    }
  }
  clearSearchMessage(){
    if(this.messageKey != ''){
      this.messageKey = '';
      this.getAllMessages();
    }else {
      return false;
    }
  }


   /*-------- Sort code----*/

   onSort({column, direction}: SortEvent) {
     // resetting other headers
     this.headers.forEach(header => {
       if (header.sortable !== column) {
         header.direction = '';
       }
     });
 
     // sorting countries
     if (direction === '' || column === '') {
       this.messages$ = this.testMessagestemp;
     } else {
       this.messages$ = [...this.messages$].sort((a, b) => {
         const res = compare(a[column], b[column]);
         return direction === 'asc' ? res : -res;
       });
     }
   }
   /*-------- Sort code----*/


}
