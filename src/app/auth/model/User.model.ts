export default class UserModel {
  private _username: string;
  private _roomname: string;

  constructor(username: string, roomname: string) {
    this._username = username;
    this._roomname = roomname;
  }

  set username(username: string) {
    this._username = username;
  }

  get username(): string {
    return this._username;
  }

  set roomname(username: string) {
    this._roomname = username;
  }

  get roomname(): string {
    return this._roomname;
  }
}
