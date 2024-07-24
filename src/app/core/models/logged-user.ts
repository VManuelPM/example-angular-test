export class LoggedUser {
  get token(): null | string {
    if (!this._expiration || new Date() > this._expiration) {
      return null;
    }
    return this._token;
  }

  constructor(
    public username: string,
    public roles: string[],
    private _token: string,
    public _expiration: Date
  ) {
  }
}


