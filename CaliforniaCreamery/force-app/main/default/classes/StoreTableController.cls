public with sharing class StoreTableController {    
    
    @AuraEnabled
    public static String fetchTableInfo(){
        try {
            List<Store__c> stores = [
                    SELECT 
                        Id, 
                        Name, 
                        City__c, 
                        State__c,
                        (SELECT Id, Amount, CloseDate FROM Opportunities__r)
                    FROM Store__c 
                    ORDER BY Name ASC
                    LIMIT 9999];
            if(!stores.isEmpty()) {
                GeographicInformation geoInfo = new GeographicInformation();
                List<StoreWrapper> storeWrappers = new List<StoreWrapper>();
                for(Store__c store :stores) {
                    storeWrappers.add(new StoreWrapper(store));
                    geoInfo.addStoreInfo(store);
                }
                return JSON.serialize(new TableWrapper(storeWrappers,geoInfo));
            } else {
                return null;
            }            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class TableWrapper {
        public List<StoreWrapper> Stores;
        public GeographicInformation GeoInfo;

        public TableWrapper(List<StoreWrapper> strs, GeographicInformation gInfo) {
            Stores = strs;
            GeoInfo = gInfo;
        }
    }

    public class StoreWrapper {
        public String Name;
        public String City;
        public String State;
        public Decimal Amount;

        public StoreWrapper(Store__c store) {
            Name = store.Name;
            City = store.City__c;
            State = store.State__c;
            Amount = 0;
            if(!store.Opportunities__r.isEmpty()) {
                for(Opportunity opp :store.Opportunities__r) {
                    if(opp.Amount != null) {
                        Amount = Amount + opp.Amount;
                    }
                }
            }
        }
    }

    public class GeographicInformation {
        public Set<String> Cities;
        public Set<String> States;

        public GeographicInformation() {
            Cities = new Set<String>();
            States = new Set<String>();
        }

        public void addStoreInfo(Store__c s) {
            Cities.add(s.City__c);
            States.add(s.State__c);
        }
    }
}