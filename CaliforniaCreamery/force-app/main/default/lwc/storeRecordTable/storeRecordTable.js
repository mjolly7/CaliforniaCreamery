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
    @track tableHasData = false;


   

    connectedCallback() {
        this.isLoading = true;
        fetchTableInfo().then((data,error) => {
            let baseUrl = window.location.origin;
            if(data) {
                let dataWrapper = JSON.parse(data);
                this.stores = dataWrapper.Stores;
                this.tableHasData = dataWrapper.Stores.length > 0;
                this.filteredStores = this.stores;

                
                //Convert the values to list of fields
                    //This supports iterating over the column values to support dynamic tables
                this.filteredStores.forEach(store=> {
                    store.url = baseUrl + '/' + store.Id;
                    store.fieldValues = [];
                    store.fieldValues.push({"value":store.City});
                    store.fieldValues.push({"value":store.State});
                    store.fieldValues.push({"value":store.Amount,"isCurrency":true});
                });

                //Add city names to picklist options
                dataWrapper.GeoInfo.Cities.forEach((cityName) => {
                    this.cities.push(cityName);                    
                });
                //this.cities.sort();
            } else if(error) {
                console.log('error::: ' + JSON.stringify(error));
            } else {
                console.log('no data');
            }
            this.isLoading = false;
        });
    }    

    handleCityChange(e) {
        this.selectedCity = e.target.value;
        if(this.selectedCity == '-') {
            this.showTotalAmount = false;
            this.filteredStores = this.stores;
        } else {
            //Only show total amount when the city filter is applied
            this.showTotalAmount = true;
            this.filteredStores = this.stores.filter((store) => store.City == this.selectedCity);
            this.totalAmount = this.filteredStores.reduce(function(accumulator,currentStore) {return accumulator + currentStore.Amount;},0);
        }

        //Refresh the child table component
        this.template.querySelector("c-record-table").applyFilter(this.filteredStores);
    }
}