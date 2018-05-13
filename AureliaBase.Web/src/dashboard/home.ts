import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

import { apiConfig } from './../settings';

@autoinject
export class Home {
    private httpClient: HttpClient;
    public entries: Array<any>;

    constructor(hc: HttpClient) {
        this.httpClient = hc;
    }

    public attached(): void {
        this.loadEntries();
    }

    public detached(): void {

    }

    private loadEntries(): void {
        this.httpClient.fetch(apiConfig.service + 'people')
            .then((response) => {
                return response.json()
                    .then((data) => {
                        this.entries = data;
                    })
            });
    }
}
