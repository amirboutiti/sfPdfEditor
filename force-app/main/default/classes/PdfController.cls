/**
 * @author Amir BOUTITI
 * @date February 2025
 * @description
 *  Apex Controller demonstrating an example of how to use the 'sfPdfEditor' library
 *  for managing PDF files in Salesforce.  
 *  This class provides methods to:
 *   - Retrieve a list of available PDF files.
 *   - Save a new PDF file.
 *   - Handle chunked PDF uploads for large files.
 *
 *  The class interacts with Salesforce's 'ContentVersion' and 'ContentDocument'
 *  to manage PDF storage and retrieval.
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

public with sharing class PdfController {

    /**
     * @description Retrieves the list of available PDF files stored in Salesforce.
     * @returns A list of the latest 10 PDFs (ContentVersion) ordered by creation date.
     */
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getPdfList() {
        return [SELECT Id, Title FROM ContentVersion WHERE FileType = 'PDF' ORDER BY CreatedDate DESC LIMIT 10];
    }

    /**
     * @description Saves a new PDF file to Salesforce.
     * @param base64Data The base64-encoded string representing the PDF file.
     * @returns A success message with the created ContentVersion ID.
     * @throws AuraHandledException if the base64 data is empty or exceeds the size limit (10MB).
     */
    @AuraEnabled
    public static String savePdfToSalesforce(String base64Data) {
        System.debug('Starting savePdfToSalesforce');

        if (String.isEmpty(base64Data)) {
            throw new AuraHandledException('Error: Empty PDF data.');
        }

        try {
            System.debug('File size in Base64 : ' + base64Data.length());

            // Decode base64 data into a Blob
            Blob pdfBlob = EncodingUtil.base64Decode(base64Data);

            System.debug('Created PDF Blob, size : ' + pdfBlob.size());

            // Create a new ContentVersion record
            ContentVersion cv = new ContentVersion();
            cv.Title = 'Modified PDF';
            cv.PathOnClient = 'modified.pdf';
            cv.VersionData = pdfBlob;
            cv.IsMajorVersion = true;
            
            insert cv;
            
            System.debug('PDF successfully saved. ID : ' + cv.Id);
            return cv.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error saving PDF : ' + e.getMessage());
        }
    }

    /**
     * @description Saves a chunk of a large PDF file in Salesforce.
     * This method handles chunked file uploads and reconstructs the final file when all chunks are received.
     * @param base64Chunk A base64-encoded chunk of the PDF file.
     * @param isLastChunk A boolean indicating whether this is the last chunk.
     * @param contentDocumentId The ID of the ContentDocument (null for the first chunk).
     * @returns The ContentDocument ID.
     * @throws AuraHandledException if the chunk data is empty.
     */
    @AuraEnabled
    public static String savePdfChunk(String base64Chunk, Boolean isLastChunk, String contentDocumentId) {
        if (String.isEmpty(base64Chunk)) {
            throw new AuraHandledException('The received chunk is empty.');
        }

        try {
            ContentVersion cv;
            String documentId = contentDocumentId;

            // Step 1: If this is the first chunk, create a new ContentDocument
            if (String.isEmpty(contentDocumentId)) {
                cv = new ContentVersion();
                cv.Title = 'Modified PDF';
                cv.PathOnClient = 'ModifiedPDF.pdf';
                cv.VersionData = EncodingUtil.base64Decode(base64Chunk);
                cv.IsMajorVersion = false; // Temporary minor version
                insert cv;

                // Retrieve the newly created ContentDocument ID
                ContentDocument doc = [SELECT Id FROM ContentDocument WHERE LatestPublishedVersionId = :cv.Id LIMIT 1];
                documentId = doc.Id;
            } else {
                // Step 2: Add a chunk as a new version of the existing ContentDocument
                cv = new ContentVersion();
                cv.ContentDocumentId = documentId;
                cv.Title = 'Modified PDF - Chunk';
                cv.PathOnClient = 'ModifiedPDF_Chunk.pdf';
                cv.VersionData = EncodingUtil.base64Decode(base64Chunk);
                cv.IsMajorVersion = false;
                insert cv;
            }

            // Step 3: If this is the last chunk, assemble the full file
            if (isLastChunk) {
                List<ContentVersion> chunks = [
                    SELECT Id, VersionData FROM ContentVersion
                    WHERE ContentDocumentId = :documentId
                    ORDER BY CreatedDate ASC
                ];

                // Concatenate all chunk data
                String completeBase64 = '';
                for (ContentVersion chunk : chunks) {
                    completeBase64 += EncodingUtil.base64Encode(chunk.VersionData);
                }
                Blob completeFile = EncodingUtil.base64Decode(completeBase64);

                // Create a final version with the complete file data
                ContentVersion finalCv = new ContentVersion();
                finalCv.ContentDocumentId = documentId;
                finalCv.Title = 'Final Modified PDF';
                finalCv.PathOnClient = 'ModifiedPDF_Final.pdf';
                finalCv.VersionData = completeFile;
                finalCv.IsMajorVersion = true;
                insert finalCv;
            }

            return documentId;
        } catch (Exception e) {
            throw new AuraHandledException('Error saving PDF : ' + e.getMessage());
        }
    }
}