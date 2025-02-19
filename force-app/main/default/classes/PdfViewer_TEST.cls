@isTest
public with sharing class PdfViewer_TEST {

    /**
     * @description Sets up test data before each test method runs.
     * This method inserts a test ContentVersion record that simulates a PDF file.
     */
    @testSetup
    static void setupTestData() {
        // Create and insert a test ContentVersion record
        Blob testBlob = Blob.valueOf('Sample PDF content');
        ContentVersion testPdf = new ContentVersion(
            Title = 'Test PDF',
            PathOnClient = 'Test.pdf',
            VersionData = testBlob,
            IsMajorVersion = true
        );
        insert testPdf;
    }

    /**
     * @description Tests the getPdfContent method.
     * Ensures that the method correctly retrieves a PDF file's content in base64 format.
     */
    @isTest
    static void testGetPdfContentSuccess() {
        // Retrieve the test PDF record created in @testSetup
        Id testPdfId = [SELECT Id FROM ContentVersion WHERE Title = 'Test PDF' LIMIT 1].Id;

        Test.startTest();
        String base64Content = PdfViewer.getPdfContent(testPdfId);
        Test.stopTest();

        // Expected base64 value from the test blob
        String expectedBase64 = EncodingUtil.base64Encode(Blob.valueOf('Sample PDF content'));

        // Assert that the retrieved base64 content matches the expected value
        System.assertEquals(expectedBase64, base64Content, 'The retrieved base64 content does not match the expected value.');
    }

    /**
     * @description Tests the getPdfContent method with an empty ID.
     * Ensures that the method throws an exception when an invalid ID is provided.
     */
    @isTest
    static void testGetPdfContentWithEmptyId() {
        Test.startTest();
        try {
            PdfViewer.getPdfContent('');
            System.assert(false, 'Expected an AuraHandledException for empty ID but none was thrown.');
        } catch (Exception e) {
            System.assertEquals(AuraHandledException.class.getName(), e.getTypeName(), 'AuraHandledException is expected');
        }
        Test.stopTest();
    }

    /**
     * @description Tests the getPdfContent method with an invalid PDF ID.
     * Ensures that the method throws an exception when an invalid ID is provided.
     */
    @isTest
    static void testGetPdfContentFailure() {
        Id invalidPdfId = '06811000000AbcdAAC'; // Fake ContentVersion ID

        Test.startTest();
        try {
            String result = PdfViewer.getPdfContent(invalidPdfId);
            System.assert(false, 'Expected an exception but none was thrown.');
        } catch (Exception e) {
            System.assertEquals(AuraHandledException.class.getName(), e.getTypeName(), 'AuraHandledException is expected');
        }
        Test.stopTest();
    }
}