import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Subject, Observable } from 'rxjs';

class HotkeyConfig {
  [key: string]: string[];
}

class ConfigModel {
  hotkeys: HotkeyConfig;
}

export class Command {
  name: string;
  combo: string;
  ev: KeyboardEvent;
}

@Injectable()
export class CommandService {

  private subject: Subject<Command>;
  commands: Observable<Command>;

  constructor(private hotkeysService: HotkeysService, private http: HttpClient) {

    this.subject = new Subject<Command>();
    this.commands = this.subject.asObservable();

    this.http.get<ConfigModel>('assets/configHotKey.json').subscribe(
      data => {
                  for (const key in data.hotkeys) {
                    const commands = data.hotkeys[key];
                    hotkeysService.add(new Hotkey(key, (ev, combo) => this.hotkey(ev, combo, commands)));
                  }
              },
      error => console.log('errore HotKey')
    );
  }

  hotkey(ev: KeyboardEvent, combo: string, commands: string[]): boolean {
    console.log('hotkey event', combo);
    commands.forEach(c => {
      const command = {
        name: c,
        ev: ev,
        combo: combo
      } as Command;
      this.subject.next(command);
    });
    return true;
  }
}
