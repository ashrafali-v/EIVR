import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-toggle',
  templateUrl: './update-toggle.component.html',
  styleUrls: ['./update-toggle.component.scss']
})
export class UpdateToggleComponent implements OnInit {
  @Input() modalTitle: string;
  @Input() modalDescription: string;
  @Input() toggleValue: string;
  @Input() toggleKey: string;
  @Output() emitService = new EventEmitter();
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  saveToggle(toggle:any) {
    this.emitService.next(toggle);
  }


}
