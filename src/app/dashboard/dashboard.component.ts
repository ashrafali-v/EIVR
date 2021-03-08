import { Component, OnInit, OnDestroy,Pipe,PipeTransform } from '@angular/core';
import { CommonAppService } from '../services/common-app.service';
import { DashboardService } from '../services/dashboard.service';
import { switchMap, takeUntil, catchError, delay, take, map } from 'rxjs/operators'
import { timer, Subject, of,forkJoin } from 'rxjs';
/*---------- Thousand suffix pipe eg:1k,2.3k etcc ------------ */
@Pipe({
  name: 'thousandSuff'
})
export class ThousandSuffixesPipe implements PipeTransform {
  transform(number: number, args?: any): any {
        if (isNaN(number)) return null; // will only work value is a number
        if (number === null) return null;
        if (number === 0) return null;
        let abs = Math.abs(number);
        const rounder = Math.pow(10, 1);
        const isNegative = number < 0; // will also work for Negetive numbers
        let key = '';

        const powers = [
            {key: 'Q', value: Math.pow(10, 15)},
            {key: 'T', value: Math.pow(10, 12)},
            {key: 'B', value: Math.pow(10, 9)},
            {key: 'M', value: Math.pow(10, 6)},
            {key: 'K', value: 1000}
        ];

        for (let i = 0; i < powers.length; i++) {
            let reduced = abs / powers[i].value;
            reduced = Math.round(reduced * rounder) / rounder;
            if (reduced >= 1) {
                abs = reduced;
                key = powers[i].key;
                break;
            }
        }
        return (isNegative ? '-' : '') + abs + key;
    }
}
/*---------- Thousand suffix pipe eg:1k,2.3k etcc ------------ */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  update$: Subject<any> = new Subject();
  systemHaelth$: any;
  totalCallCountToday: any;
  totalPaymentCountToday: any;
  totalCSRCountToday: number;
  errorObject: any;
  private killTrigger: Subject<void> = new Subject();
  single: any[];
  multi: any[];
  view: any[];
  loaderPaymentsTab: boolean = true;
  loaderCallsTab: boolean = true;
  tabSelection:any;
  isError: boolean = false;
  period: any;
  health:any;
  healthStatus:any;
  /*---- Chart options----*/
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition = 'below';
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  groupPadding = 15;
  barPadding = 0;
  /*---- Chart options----*/
  /*-----Chart array declarations-------*/
  forkJoinArray: any = [];
  noOfPaymentsProcessed: any;
  amountOfPaymentsProcessed: any;
  noOfPaymentsDenied: any;
  totalNoOfTextMessages: any;
  totalCallsRecieved: any;
  totalCallsTransferedIvrToCsr: any;
  callsCompleted: any;
  averageDurationOfCalls: any;
  callsTerminatedBeforeCompletion: any;
  /*-----Chart array declarations-------*/
  paymentChartsColorScheme = {
    domain: ['#fd7e14', '#020B7A', '#dc3545']
  };
  totalTextMessagesColorScheme = {
    domain: ['#0CC474']
  };
  callsTransferedIvrToCsrColorSceme = {
    domain: ['#EF4460']
  };
  totalCallsRecievedColorScheme = {
    domain: ['#fd7e14', '#020B7A']
  };
  callsCompletedColorSceme = {
    domain: ['#47CEF9']
  };
  averageDurationColorSceme = {
    domain: ['#0CC474']
  };
  constructor(private sharedService: CommonAppService,private dashboardService:DashboardService) {
    this.sharedService.setComponentStatus(true, true, true);
  }

  ngOnInit(): void {
    this.tabSelection = 'payment';
    this.view = [700, 200];
    this.getPaymentsData();
    this.errorObject = null;
    timer(0, 5 * 60 * 1000).pipe(
      takeUntil(this.killTrigger),
      switchMap(() => this.dashboardService.getSystemHealth()),
      catchError(error => of('Error'))
    ).subscribe(result =>{
      switch(result){
        case 'HEALTHY':
          this.health = 'HEALTHY';
          this.healthStatus = 'good';
          break;
        case 'WARNING':
          this.health = 'WARNING';
          this.healthStatus = 'avarage';
          break;
        case 'ERROR':
          this.health = 'ERROR';
          this.healthStatus = 'bad';
          break;
        default:
          this.health = 'HEALTHY';
          this.healthStatus = 'good';
      }
    });

    timer(0, 5 * 60 * 1000).pipe(
      takeUntil(this.killTrigger),
      switchMap(() => this.dashboardService.getTodayCallCount()),
      catchError(error => of('Error'))
    ).subscribe(result => this.totalCallCountToday = result);

    timer(0, 5 * 60 * 1000).pipe(
      takeUntil(this.killTrigger),
      switchMap(() => this.dashboardService.getTodayPayment()),
      catchError(error => of('Error'))
    ).subscribe(result => this.totalPaymentCountToday = result);

    timer(0, 5 * 60 * 1000).pipe(
      takeUntil(this.killTrigger),
      switchMap(() => this.dashboardService.getTodayCSRCount()),
      catchError(error => of('Error'))
    ).subscribe(result =>{this.totalCSRCountToday = result.data});

    function yAxisTickFormatting(value) {
      return this.currencyTickFormatting(value);
    }
  }
  ngOnDestroy() {
    this.killTrigger.next();
  }
  currencyTickFormatting(value) {
    return '$' + value.toLocaleString();
  }
  getPaymentsData(){
    const noOfPaymentsProcessed$ = this.dashboardService.getPaymentsProcessed().pipe(catchError(error => of(undefined)));
    const amountOfPaymentsProcessed$ = this.dashboardService.getPaymentsAmountProcessed().pipe(catchError(error => of(undefined)));
    const noOfPaymentsDenied$ = this.dashboardService.getPaymentsDenied().pipe(catchError(error => of(undefined)));
    const totalNoOfTextMessages$ = this.dashboardService.getToatlTextMessages().pipe(catchError(error => of(undefined)));

    const example = forkJoin(
      //of('World').pipe(delay(3000)),
      noOfPaymentsProcessed$, amountOfPaymentsProcessed$, noOfPaymentsDenied$, totalNoOfTextMessages$
    );

    example.subscribe(([noOfPaymentsProcessed, amountOfPaymentsProcessed, noOfPaymentsDenied, totalNoOfTextMessages]) => {
      this.loaderPaymentsTab = false;
      noOfPaymentsProcessed = [{"name":"2021.02.19","series":[{"name":"CREDITCARD","value":0},{"name":"DEBITCARD","value":0}]},{"name":"2021.02.18","series":[{"name":"CREDITCARD","value":20},{"name":"DEBITCARD","value":0}]},{"name":"2021.02.17","series":[{"name":"CREDITCARD","value":0},{"name":"DEBITCARD","value":0}]},{"name":"2021.02.16","series":[{"name":"CREDITCARD","value":0},{"name":"DEBITCARD","value":0}]}]
      Object.assign(this, { noOfPaymentsProcessed });
      Object.assign(this, { amountOfPaymentsProcessed });
      Object.assign(this, { noOfPaymentsDenied });
      Object.assign(this, { totalNoOfTextMessages });
    });
  }
  getCallsData(){
    const totalCallsRecieved$ = this.dashboardService.getTotalCalls().pipe(catchError(error => of(undefined)));
      const totalCallsTransferedIvrToCsr$ = this.dashboardService.getCallsTransferedCSR().pipe(catchError(error => of(undefined)));
      const callsCompleted$ = this.dashboardService.getCallsCompleted().pipe(catchError(error => of(undefined)));
      const averageDurationOfCalls$ = this.dashboardService.getCallDuration().pipe(catchError(error => of(undefined)));
      const callsTerminatedBeforeCompletion$ = this.dashboardService.getCallTerminated().pipe(catchError(error => of(undefined)));

      const example = forkJoin(
        totalCallsRecieved$, totalCallsTransferedIvrToCsr$, callsCompleted$, averageDurationOfCalls$, callsTerminatedBeforeCompletion$
      );
      example.subscribe(([totalCallsRecieved, totalCallsTransferedIvrToCsr, callsCompleted, averageDurationOfCalls, callsTerminatedBeforeCompletion]) => {
        this.loaderCallsTab = false;
        Object.assign(this, { totalCallsRecieved });
        Object.assign(this, { totalCallsTransferedIvrToCsr });
        Object.assign(this, { callsCompleted });
        Object.assign(this, { averageDurationOfCalls });
        Object.assign(this, { callsTerminatedBeforeCompletion });
      });
  }
  onSelectTab(tab:any) {
    this.tabSelection = tab;
    if (this.loaderCallsTab) {
      this.getCallsData();
    }
    if (this.loaderPaymentsTab) {
      this.getPaymentsData();
    }
  }
  //event handler for the select element's change event
  selectChangeHandler(event: any) {
    //update the ui
    this.update$.next(true);
    this.period = event.target.value;
    var count = 4;
    this.dashboardService.setQueryParams(this.period,count);
    if(this.tabSelection == 'payment'){
      this.loaderPaymentsTab = false;
      this.loaderCallsTab = true;
      this.getPaymentsData();
    }else{
      this.loaderPaymentsTab = true;
      this.loaderCallsTab = false;
      this.getCallsData();
    }
  }
}
