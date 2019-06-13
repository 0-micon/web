import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-form-label',
  templateUrl: './form-label.component.html',
  styleUrls: ['./form-label.component.scss']
})
export class FormLabelComponent implements OnInit {
  @Input() showSuccess: boolean;
  @Input() showError: boolean;
  @Input() showHelp: boolean;

  @Input() errorMessage: string;

  /**
   * The string content or a `TemplateRef` for the content to be displayed in the popover.
   *
   * If the title and the content are empty, the popover won't open.
   */
  @Input() helpTopic: string | TemplateRef<any>;

  /**
   * The title of the popover.
   *
   * If the title and the content are empty, the popover won't open.
   */
  @Input() helpTitle: string | TemplateRef<any>;

  constructor() {}

  ngOnInit() {}
}
