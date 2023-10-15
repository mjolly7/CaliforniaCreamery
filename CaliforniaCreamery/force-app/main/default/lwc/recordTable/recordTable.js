//Created by Matt Jolly - 10/14/2023
import { LightningElement, api, track } from 'lwc';

export default class RecordTable extends LightningElement {
    @api rows;
    @api colNames;

    @track sortedField;
    @track sortDirection = 'asc';
    @track sortedRows;
    @track columns;    

    connectedCallback() {
        //Objects passed from parent can't be modified directly. Use spread operator to 
            //create a new copy of the array 
        this.sortedRows = [...this.rows];
        
        //Add sorting control variables to column
        this.columns = [];
        this.colNames.forEach(cn => {
            this.columns.push({"name":cn, "isSortedAsc":false, "isSortedDesc":false});
        });
    }

    @api applyFilter(filteredStores) {
        this.sortedRows = [...filteredStores];
    }

    sortColumn(e) {
        let fieldName = e.target.dataset.type;
        this.sortedField = fieldName;
        this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';

        //Sort the rows by selected column
        this.sortedRows.sort((a,b) => {
            if(this.sortDirection == 'asc') {
                if(a[fieldName] > b[fieldName]) {
                    return 1;
                } else if(a[fieldName] < b[fieldName]) {
                    return -1;
                } else {
                    return 0
                }
            } else {
                if(a[fieldName] > b[fieldName]) {
                    return -1;
                } else if(a[fieldName] < b[fieldName]) {
                    return 1;
                } else {
                    return 0
                }
            }
        });
        
        //Add sorted column direction indicator
        this.columns.forEach(col => {
            if(col.name == this.sortedField) {
                col.isSortedAsc = this.sortDirection == 'asc';
                col.isSortedDesc = this.sortDirection == 'desc';
            } else {
                col.isSortedAsc = false;
                col.isSortedDesc = false;
            }
        });
    }
}