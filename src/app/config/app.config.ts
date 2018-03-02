import {environment} from '../../environments/environment';

export class AppConfig {
  public apiUrl = 'http://4400796b.ngrok.io/admin';
  public username = environment.username;
  public password = environment.password;
  public checkPhoneNumberRegex = /^(?:0|\+?84)?(?:89|90|93|120|121|122|126|128)\d{7}$/;
  public checkEmailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  public loginPage = '/login';
  public VERSION = '[AIV]{version}[/AIV]';

  constructor() {
    const endpoint = sessionStorage.getItem('endpoint');
    if (endpoint) {
      this.apiUrl = endpoint.indexOf('http') == -1 ? 'http://' + endpoint : endpoint;
    }
  }
}
