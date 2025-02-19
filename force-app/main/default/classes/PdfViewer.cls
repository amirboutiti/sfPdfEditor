/**
 * @author Amir BOUTITI
 * @date February 2025
 * @description
 *  Apex Controller for retrieving the content of PDF files in Salesforce.
 *  This class is designed to work with the 'sfPdfEditor' library and provides 
 *  a method to fetch and return a PDF file as a base64-encoded string.
 * 
 * The class interacts with Salesforce's 'ContentVersion' to retrieve stored PDF files.
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
public with sharing class PdfViewer {
    /**
     * @description Retrieves the content of a PDF file in base64 format.
     * @param pdfId The ID of the ContentVersion record.
     * @returns The base64-encoded content of the PDF file.
     */
    @AuraEnabled
    public static String getPdfContent(String pdfId) {
        if(pdfId == null || pdfId == '') {
            throw new AuraHandledException('No PDF file ID provided.');
        }

        try {
            // Attempt to retrieve the ContentVersion record
            ContentVersion pdfFile = [
                SELECT VersionData FROM ContentVersion WHERE Id = :pdfId LIMIT 1
            ];
            return EncodingUtil.base64Encode(pdfFile.VersionData);
        } catch (Exception e) {
            throw new AuraHandledException('Failed to retrieve the ContentVersion record: ' + e.getMessage());
        }
    }
}