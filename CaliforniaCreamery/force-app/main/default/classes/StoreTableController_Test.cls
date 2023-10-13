//Created by Matt Jolly - 10/12/2023
@IsTest
public class StoreTableController_Test {
    @TestSetup
    static void makeData(){
        Store__c s1 = new Store__c();
        s1.City__c = 'Houston';
        s1.State__c = 'Texas';
        s1.Name  = 'Houston 1';

        Store__c s2 = new Store__c();
        s2.City__c = 'Houston';
        s2.State__c = 'Texas';
        s2.Name  = 'Houston 2';

        Store__c s3 = new Store__c();
        s3.City__c = 'Wichita';
        s3.State__c = 'Kansas';
        s3.Name  = 'Central Wichita';

        insert new List<Store__c>{s1,s2,s3};

        Opportunity opp1a = new Opportunity();
        opp1a.Name = 'opp1a';
        opp1a.CloseDate = Date.today();
        opp1a.Amount = 99.99;
        opp1a.StageName = 'Holding';
        opp1a.Store__c = s1.Id;

        Opportunity opp1b = new Opportunity();
        opp1b.Name = 'opp1b';
        opp1b.CloseDate = Date.today();
        opp1b.Amount = .01;
        opp1b.StageName = 'Holding';
        opp1b.Store__c = s1.Id;

        Opportunity opp2 = new Opportunity();
        opp2.Name = 'opp2';
        opp2.CloseDate = Date.today();
        opp2.Amount = 200.01;
        opp2.StageName = 'Holding';
        opp2.Store__c = s2.Id;

        insert new List<Opportunity>{opp1a, opp1b, opp2};
    }

    @IsTest
    public static void fetchTableInfo_empty_Test() {
        delete [SELECT Id FROM Store__c];
        System.test.startTest();
            String tableInfoString = StoreTableController.fetchTableInfo();
        System.test.stopTest();

        System.assertEquals(null, tableInfoString);
    }

    @IsTest
    public static void fetchTableInfo_Test() {
        System.test.startTest();
            String tableInfoString = StoreTableController.fetchTableInfo();
        System.test.stopTest();

        StoreTableController.TableWrapper tw = 
                (StoreTableController.TableWrapper)JSON.deserialize(tableInfoString, StoreTableController.TableWrapper.class);

        System.assertEquals(2, tw.GeoInfo.Cities.size(), 'The geographic info wrapper does not have the expected cities');
        System.assert(tw.GeoInfo.Cities.contains('Houston'), 'The geographic info wrapper does not have the expected cities');
        System.assert(tw.GeoInfo.Cities.contains('Wichita'), 'The geographic info wrapper does not have the expected cities');
        
        System.assertEquals(2, tw.GeoInfo.States.size(), 'The geographic info wrapper does not have the expected states');
        System.assert(tw.GeoInfo.States.contains('Texas'), 'The geographic info wrapper does not have the expected states');
        System.assert(tw.GeoInfo.States.contains('Kansas'), 'The geographic info wrapper does not have the expected states');

        System.assertEquals(3, tw.Stores.size(), 'The list of stores is not the expected size');

        System.assertEquals('Central Wichita', tw.Stores[0].Name, 'The store information is not populated correctly');
        System.assertEquals(0, tw.Stores[0].Amount, 'The store information is not populated correctly');

        System.assertEquals('Houston 1', tw.Stores[1].Name, 'The store information is not populated correctly');
        System.assertEquals(100.00, tw.Stores[1].Amount, 'The store information is not populated correctly');

        System.assertEquals('Houston 2', tw.Stores[2].Name, 'The store information is not populated correctly');
        System.assertEquals(200.01, tw.Stores[2].Amount, 'The store information is not populated correctly');        
    }
}