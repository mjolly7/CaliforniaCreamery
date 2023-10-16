import { createElement } from 'lwc';
import StoreRecordTable from 'c/storeRecordTable';

const mockStoreList = require('./data/storesList.json');
const mockFetchTableInfo = jest.fn();

jest.mock(
    '@salesforce/apex/StoreTableController.fetchTableInfo',
    () => ({
        default: mockFetchTableInfo,
    }),
    { virtual: true }
);


describe('c-store-record-table', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });


    it('fetch data on load', () => {
        // Create a new component
        const element = createElement('c-store-record-table', {
            is: StoreRecordTable,
        });
        document.body.appendChild(element);

        // Simulate a resolved promise with the mock data
        mockFetchTableInfo.mockResolvedValue(mockStoreList);

        return Promise.resolve().then(() => {
            // Check that the component has rendered with the data
            console.log('element.shadowRoot:::::: ' + JSON.stringify(element.shadowRoot));
            const tableElement = element.shadowRoot.querySelector('c-record-table');
            expect(tableElement).toBeTruthy();
            expect(element.isLoading).toBe(false);
            expect(element.tableHasData).toBe(true);            
            expect(element.filteredStores).toEqual(mockStoreList.Stores);
        });
    });

});