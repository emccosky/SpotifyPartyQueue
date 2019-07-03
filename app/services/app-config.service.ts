import keys from '../rsc/keys.json';

export class AppConfigService {
  
    constructor() {}

    public getClientId(): string {
        return keys.client_id;
    }

    public getClientSecret(): string {
        return keys.client_secret;
    }

}


