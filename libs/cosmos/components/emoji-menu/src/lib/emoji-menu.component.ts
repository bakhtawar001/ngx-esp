import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'cos-emoji-menu',
  templateUrl: './emoji-menu.component.html',
  styleUrls: ['./emoji-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosEmojiMenuComponent {
  static ngAcceptInputType_readonly: BooleanInput;

  @Input() emoji = ':package:';

  private _readonly = false;

  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(value: any) {
    this._readonly = coerceBooleanProperty(value);
  }

  @Output() emojiChange = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter();

  @ViewChild('menuTrigger', { static: false }) menuTrigger?: MatMenuTrigger;

  selectEmoji = ($event: EmojiEvent) => {
    const selected = $event.emoji.colons;

    this.emoji = selected!;
    this.menuTrigger!.closeMenu();
    this.valueChange.emit({ newValue: selected });
    this.emojiChange.emit(this.emoji);
  };
}
