//Created by Matt Jolly - 10/14/2023
import { LightningElement, api, track } from 'lwc';

export default class RecordTable extends LightningElement {
    @api rows;
    @api colNames;

    @track sortedField;
    @track sortDirection = 1;
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
        this.sortedField = undefined;
        this.setSortedIcons();
    }

    sortColumn(e) {
        this.sortedField = e.target.dataset.type;

        //Reverse the sort order
        this.sortDirection = this.sortDirection * -1;

        //Sort the rows by selected column
        this.sortedRows.sort((a,b) => {
            return (a[this.sortedField] > b[this.sortedField] ? 1 :-1) * this.sortDirection;
        });
        
        this.setSortedIcons();
    }

    setSortedIcons() {
        this.columns.forEach(col => {
            col.isSortedAsc = col.name == this.sortedField && this.sortDirection == 1;
            col.isSortedDesc = col.name == this.sortedField && this.sortDirection == -1;            
        });
    }
}