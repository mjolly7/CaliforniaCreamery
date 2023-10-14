import fetchTableInfo from '@salesforce/apex/StoreTableController.fetchTableInfo';
import { LightningElement, track } from 'lwc';

export default class StoreRecordTable extends LightningElement {
    @track isLoading;
    colNames = ['Name','City','State','Amount'];
    @track stores;
    @track filteredStores;    
    @track cities = [];
    @track selectedCity = '-';
    
    @track totalAmount = 0;
    @track showTotalAmount = false;

    @track sortDirection = 'asc';

    connectedCallback() {
        this.isLoading = true;
        console.log('!!!!!!!!!!!!!!!!!!!!!');
        fetchTableInfo().then((data,error) => {
            let baseUrl = window.location.origin;
            if(data) {
                console.log('data::: ' + JSON.stringify(data));
                let dataWrapper = JSON.parse(data);
                this.stores = dataWrapper.Stores;
                this.filteredStores = this.stores;
                this.filteredStores.forEach(store=> {
                    store.url = baseUrl + '/' + store.Id;
                });
                dataWrapper.GeoInfo.Cities.forEach((cityName) => {
                    console.log('cityName:::: ' + JSON.stringify(cityName));
                    this.cities.push(cityName);
                    
                });
                console.log('@@@@@@@@@@@@@@@@@@@@@@');
                console.log('this.cities:::: ' + JSON.stringify(this.cities));
            } else if(error) {
                console.log('error::: ' + JSON.stringify(error));
            } else {
                console.log('no data');
            }
            this.isLoading = false;
        });
    }

    sortColumn(e) {
        console.log('111111111');
        console.log('sorting currtarget::: ' + e.currentTarget.dataset.type);
        console.log('sorting target::: ' + e.target.dataset.type);
        let fieldName = e.target.dataset.type;
        this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';
        this.filteredStores.sort((a,b) => {
            console.log('a::: ' + a[fieldName]);
            console.log('b::: ' + b[fieldName]);
            console.log('this.sortDirection::: ' + this.sortDirection);
            console.log(a[fieldName] > b[fieldName]);
            console.log(b[fieldName] < a[fieldName]);
            if(this.sortDirection == 'asc') {
                return a[fieldName] > b[fieldName];
            } else {
                return b[fieldName] < a[fieldName];
            }            
        });
        console.log('this.filteredStores::: ' + JSON.stringify(this.filteredStores));
        
        
    }

    handleCityChange(e) {
        console.log('changing city:::::  ' + JSON.stringify(e));
        console.log('value:: ' + e.target.value);
        this.selectedCity = e.target.value;
        if(this.selectedCity == '-') {
            this.showTotalAmount = false;
            this.filteredStores = this.stores;
        } else {
            this.showTotalAmount = true;
            this.filteredStores = this.stores.filter((store) => store.City == this.selectedCity);
            this.totalAmount = this.filteredStores.reduce(function(accumulator,currentStore) {return accumulator + currentStore.Amount;},0);
            console.log('amount:::: ' + JSON.stringify(this.totalAmount));
        }
        console.log('this.filteredStores ~~~~~~> ' + JSON.stringify(this.filteredStores));

    }
}