import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICountryMySuffix } from 'app/shared/model/country-my-suffix.model';
import { Principal } from 'app/core';
import { CountryMySuffixService } from './country-my-suffix.service';

@Component({
    selector: 'jhi-country-my-suffix',
    templateUrl: './country-my-suffix.component.html'
})
export class CountryMySuffixComponent implements OnInit, OnDestroy {
    countries: ICountryMySuffix[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private countryService: CountryMySuffixService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.countryService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<ICountryMySuffix[]>) => (this.countries = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.countryService.query().subscribe(
            (res: HttpResponse<ICountryMySuffix[]>) => {
                this.countries = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCountries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICountryMySuffix) {
        return item.id;
    }

    registerChangeInCountries() {
        this.eventSubscriber = this.eventManager.subscribe('countryListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
