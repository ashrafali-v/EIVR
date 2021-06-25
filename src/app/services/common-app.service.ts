import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { ComponentStatus } from '../model/component.status';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonAppService {
  @Output() OnChange: EventEmitter<any> = new EventEmitter();
  @Output() Ontoggle: EventEmitter<any> = new EventEmitter();
  @Output() OnLoggedIn: EventEmitter<any> = new EventEmitter();
  jsonHttpHeader: any;
  textHttpHeader: any;
  headerSatus: boolean = true;
  asideSatus: boolean = true;
  footerSatus: boolean = true;
  componentStatus: any;
 // serviceBase = 'https://dbtyc7vkc3gw7.cloudfront.net/eivr/dashboard/';
 serviceBase = 'https://d1y2d7gwuud31v.cloudfront.net/eivr/dashboard/';
  eivrApiEndpoints = {
    UserLogin: 'login/',
    GetAllMessages: 'getAllMessages/',
    GetMessageByKey: 'getMessageByKey/',
    SaveMessage: 'saveMessages/',
    GetAllToggles: 'getAllToggles/',
    GetToggleByKey: 'getToggleByKey/',
    SaveToggle: 'saveToggle/',
    GetLogByContactId: 'getContactId/',
    GetLogByPhoneNumber: 'getContactDetailByPhone/',
    GetLogByAccountNumber: 'getAccountByNo/',
    PaymentList: 'paymentList/',
    SingleAuth:'loginSession/'
  }
  constructor(private httpClient: HttpClient) {
    this.componentStatus = new ComponentStatus();
    this.jsonHttpHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    this.textHttpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', accept: 'text/plain' }),
      responseType: 'text'
    }
  }
  public getUserLogin(userNmae: any, password: any) {
    var url = this.eivrApiEndpoints['UserLogin'];
    return this.httpClient.get(this.serviceBase + url + '?username=' + userNmae + '&password=' + password, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public getPortalAuthentication(token:any){
    var url = this.eivrApiEndpoints['SingleAuth'];
    return this.httpClient.get(this.serviceBase + url + '?token='+token,this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public getAllMessages() {
    var url = this.eivrApiEndpoints['GetAllMessages'];
    return this.httpClient.get(this.serviceBase + url, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public getMessage(key: any) {
    var url = this.eivrApiEndpoints['GetMessageByKey'] + '?messageKey=' + key;
    return this.httpClient.get(this.serviceBase + url, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public saveMessage(message: any) {
    var url = this.eivrApiEndpoints['SaveMessage'];
    var data = { "messageKey": message.messageKey, "messageText": message.messageText,"messageFlow":message.messageFlow };
    return this.httpClient.post(this.serviceBase + url, data, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  setComponentStatus(header: boolean, aside: boolean, footer: boolean) {

    this.componentStatus.header = header;
    this.componentStatus.aside = aside;
    this.componentStatus.footer = footer;
    this.OnChange.emit(this.componentStatus);
  }
  public getComponentStatus(): Observable<any> {
    return this.OnChange;
  }
  setMenuToggle(status: boolean) {
    this.Ontoggle.emit(status);
  }
  public getMenuToggle(): Observable<any> {
    return this.Ontoggle;
  }
  public getAllToggles() {
    var url = this.eivrApiEndpoints['GetAllToggles'];
    return this.httpClient.get(this.serviceBase + url, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public searchToggle(key: any) {
    var url = this.eivrApiEndpoints['GetToggleByKey'];
    return this.httpClient.get(this.serviceBase + url + '?toggleKey=' + key, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public saveToggle(toggle: any) {
    var url = this.eivrApiEndpoints['SaveToggle'];
    var data = {"toggleKey":toggle.toggleKey,"toggleValue":toggle.toggleValue,"toggleInfo":toggle.toggleInfo};
    return this.httpClient.post(this.serviceBase + url, data, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public getCallLogByContactId(key: any) {
    var url = this.eivrApiEndpoints['GetLogByContactId'];
    return this.httpClient.get(this.serviceBase + url + '?contactId=' + key, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public getCallLogByPhoneNumber(key: any) {
    var url = this.eivrApiEndpoints['GetLogByPhoneNumber'];
    return this.httpClient.get(this.serviceBase + url + '?phoneNumber=' + key, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  public getCallLogByAccountNumber(key: any) {
    var url = this.eivrApiEndpoints['GetLogByAccountNumber'];
    return this.httpClient.get(this.serviceBase + url + '?accountNo=' + key, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
  setLoggedInStatus(status: boolean) {
    this.OnLoggedIn.emit(status);
  }
  public getLoggedInStatus(): Observable<any> {
    return this.OnLoggedIn;
  }
  public getPaymentList(date:any) {
    var url = this.eivrApiEndpoints['PaymentList'];
    return this.httpClient.get(this.serviceBase + url + '?dateString=' + date, this.jsonHttpHeader).pipe(
      map((res: any) => res)
    )
  }
}
