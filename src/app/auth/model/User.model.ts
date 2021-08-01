export default class UserModel {
  token = '';
  username = '';
  roomname = '';

  constructor() {
  }

  setToken(token: string): void {
    localStorage.setItem('Token', token);
    this.token = token;
  }

  setUserName(username: string): void {
    this.username = username;
  }

  setRoomname(room: string): void {
    this.roomname = room;
  }
}
