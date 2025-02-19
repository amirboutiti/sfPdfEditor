/**
 * @author Amir BOUTITI
 * @date February 2025
 * @description Test class for PdfController
 * 
 * Legal Notice:
 * 
 * MIT License
 * 
 * Copyright (c) 2025 Amir BOUTITI
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
@isTest
public with sharing class PdfController_TEST {
    /**
     * @description Sets up test data before each test method runs.
     * This method inserts a sample ContentVersion record that simulates a PDF file.
     */
    @testSetup
    static void setupTestData() {
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
     * @description Tests the getPdfList method to ensure it retrieves a list of PDFs.
     */
    @isTest
    static void testGetPdfList() {
        Test.startTest();
        List<ContentVersion> pdfList = PdfController.getPdfList();
        Test.stopTest();

        System.assertNotEquals(0, pdfList.size(), 'The PDF list should not be empty.');
        System.assertEquals('Test PDF', pdfList[0].Title, 'The retrieved PDF title does not match.');
    }

    /**
     * @description Tests the savePdfToSalesforce method with valid data.
     */
    @isTest
    static void testSavePdfToSalesforceSuccess() {
        String base64Data = EncodingUtil.base64Encode(Blob.valueOf('New PDF content'));

        Test.startTest();
        String contentVersionId = PdfController.savePdfToSalesforce(base64Data);
        Test.stopTest();

        System.assertNotEquals(null, contentVersionId, 'The returned ContentVersion ID should not be null.');
        System.assertNotEquals('', contentVersionId, 'The returned ContentVersion ID should not be empty.');

        // Verify the PDF was actually inserted
        ContentVersion insertedPdf = [SELECT Id, Title FROM ContentVersion WHERE Id = :contentVersionId LIMIT 1];
        System.assertEquals('Modified PDF', insertedPdf.Title, 'The inserted PDF title does not match.');
    }

    /**
     * @description Tests the savePdfToSalesforce method with empty data (should fail).
     */
    @isTest
    static void testSavePdfToSalesforceFailure_EmptyData() {
        Test.startTest();
        try {
            PdfController.savePdfToSalesforce('');
            System.assert(false, 'Expected an AuraHandledException but none was thrown.');
        } catch (AuraHandledException e) {
            System.assertEquals(AuraHandledException.class.getName(), e.getTypeName(), 'AuraHandledException is expected');
        }
        Test.stopTest();
    }

    /**
     * @description Tests the savePdfChunk method with a valid first chunk.
     */
    @isTest
    static void testSavePdfChunk_FirstChunk() {
        String base64Chunk = EncodingUtil.base64Encode(Blob.valueOf('Chunk 1 content'));

        Test.startTest();
        String documentId = PdfController.savePdfChunk(base64Chunk, false, null);
        Test.stopTest();

        System.assertNotEquals(null, documentId, 'The returned ContentDocument ID should not be null.');
        System.assertNotEquals('', documentId, 'The returned ContentDocument ID should not be empty.');
    }

    /**
     * @description Tests the savePdfChunk method with an empty chunk (should fail).
     */
    @isTest
    static void testSavePdfChunkFailure_EmptyChunk() {
        Test.startTest();
        try {
            PdfController.savePdfChunk('', false, null);
            System.assert(false, 'Expected an AuraHandledException but none was thrown.');
        } catch (AuraHandledException e) {
            System.assertEquals(AuraHandledException.class.getName(), e.getTypeName(), 'AuraHandledException is expected');
        }
        Test.stopTest();
    }
}