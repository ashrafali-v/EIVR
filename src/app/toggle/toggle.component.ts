import { Component, OnInit ,Directive, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import { CommonAppService } from '../services/common-app.service';
import { catchError,retry } from 'rxjs/operators';
import { Subject,of } from 'rxjs';
import { SubSink } from 'subsink';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CreateToggleComponent} from '../modals/create-toggle/create-toggle.component'
import {UpdateToggleComponent} from '../modals/update-toggle/update-toggle.component'

/*-------- Sort code----*/
interface Toggles {
  toggleKey: string;
  toggleValue: string;
  toggleInfo: string;
}
export type SortColumn = keyof Toggles | '';
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
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {
  private observableSubscriptions = new SubSink();
  public scrollbarOptions = { axis: 'y', theme: '3d-dark' };
  constructor(private sharedService: CommonAppService,private modalService: NgbModal,public toastService: ToastrService) { 
    this.sharedService.setComponentStatus(true,true,true);
  }
  toggles$:any = [];
  testToggles:any = [];
  testTogglestemp:any = [];
  currentPage: any = 1;
  pageSize: number = 10;
  toggleKey:any='';
  loadingError$ = new Subject<boolean>();
  /*-------- Sort code----*/
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  /*-------- Sort code----*/
  ngOnInit(): void {
    this.getAllToggles();
  }
  enableToggle(event:any){
    console.log(event);
  }
  getAllToggles(){
    this.sharedService.getAllToggles().pipe(
      catchError(error => {
        console.error('error loading the list of users', error);
        this.loadingError$.next(true);
        return of();
      }),
      retry(2)
    ).subscribe(result=>{
      this.toggles$ = result;
    });
    // this.toggles$ = [
    //   {
    //       "toggleKey": "lex_accountsave",
    //       "toggleValue": "4000,4000,500,false",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "minPaymentAmount",
    //       "toggleValue": "9",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "maxPaymentPerCall",
    //       "toggleValue": "6",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "mondayOpHourEnd",
    //       "toggleValue": "1630",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "lex-barge-in-enabled",
    //       "toggleValue": "true",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "thursdayOpHourEnd",
    //       "toggleValue": "1630",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "saturdayOpHourStart",
    //       "toggleValue": "745",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "saturdayOpHourEnd",
    //       "toggleValue": "1630",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "paymentProcessingTime",
    //       "toggleValue": "30000",
    //       "toggleInfo": null
    //   } ,
    //   {
    //     "toggleKey": "tuesdayOpHourEnd",
    //     "toggleValue": "1630",
    //     "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "lex-max-speech-duration-ms",
    //       "toggleValue": "3000",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "systemWarning",
    //       "toggleValue": "false",
    //       "toggleInfo": null
    //   },
    //   {
    //       "toggleKey": "lex_paymentexecutionstart",
    //       "toggleValue": "4000,4000,500,false",
    //       "toggleInfo": null
    //   }
    // ]

    this.testTogglestemp = this.toggles$;
  }
  searchToggle(){
    this.toggles$.length = 0;
    if(this.toggleKey != ''){
      this.toggleKey = this.toggleKey.trim();
      this.toggles$ = this.sharedService.searchToggle(this.toggleKey).pipe(
        catchError((error) => {
          console.error('error loading the list of users', error);
          this.loadingError$.next(true);
          return of();
        })
      );
    }else{
      return false;
    }
  }
  claerSearchToggle(){
    if(this.toggleKey != ''){
      this.toggleKey = '';
      this.getAllToggles();
    }else {
      return false;
    }
  }
  createToggle(){
    const createToggleModalRef = this.modalService.open(CreateToggleComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      scrollable: true,
      backdrop: 'static'
    });
    createToggleModalRef.componentInstance.modalTitle = "Create Toggle";
    createToggleModalRef.componentInstance.modalDescription = "Create message description";
    createToggleModalRef.componentInstance.emitService.subscribe((result) => {
      if (result) {
        this.observableSubscriptions.add(this.sharedService.saveToggle(result).subscribe(data => {
          createToggleModalRef.close();
          this.toggles$ = this.sharedService.getAllToggles().pipe(
            catchError((error) => {
              console.error('error loading the list of users', error);
              this.loadingError$.next(true);
              return of();
            })
          );
          this.toastService.success("A new toggle has been created.");
        }, err => {
          this.toastService.error("Failed to create a toggle.");
        }));
      }
    }, (reason) => {
      console.log(reason);
    });
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
      this.toggles$ = this.testTogglestemp;
    } else {
      this.toggles$ = [...this.toggles$].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
/*-------- Sort code----*/
editMessage(toggle: any) {
    const updateMessageModalRef = this.modalService.open(UpdateToggleComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      scrollable: true,
      backdrop: 'static'
    });
    updateMessageModalRef.componentInstance.modalTitle = "Edit message";
    updateMessageModalRef.componentInstance.modalDescription = "Edit message description";
    updateMessageModalRef.componentInstance.toggleValue = toggle.toggleValue;
    updateMessageModalRef.componentInstance.toggleKey = toggle.toggleKey;
    updateMessageModalRef.componentInstance.emitService.subscribe((result) => {
      if (result) {
        toggle.toggleValue = result;
        updateMessageModalRef.close(result);
        this.sharedService.saveToggle(toggle).subscribe(data => {
          this.toastService.success("Toggle updated successfully", "Success");
        }, err => {
          console.log(err);
          this.toastService.error('Toggle update failed', 'Error');
        });
      }
    }, (reason) => {
      console.log(reason);
    });
}
}
