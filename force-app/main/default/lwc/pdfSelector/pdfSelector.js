/***
* @author Amir BOUTITI
* @date   February 2025
* @description Example LWC component that demonstrates how to use the PdfViewer component.
* This component allows the user to select a PDF file from Salesforce, display it in PdfViewer,
* and save modifications back to Salesforce. If the file size is too large, it is split into chunks
* before being sent to the Apex controller.
*
* Legal Notice
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
***/

import { LightningElement, track, wire } from 'lwc';
import getPdfList from '@salesforce/apex/PdfController.getPdfList';
import savePdfToSalesforce from "@salesforce/apex/PdfController.savePdfToSalesforce";
import savePdfChunk from "@salesforce/apex/PdfController.savePdfChunk";
import { logMessage, showSuccessToast, showErrorToast } from 'c/utils';

export default class PdfSelector extends LightningElement {

    /**
     * @description Defines the debug level: 
     * 0 - No logs
     * 1 - Errors only
     * 2 - Info & warnings
     * 3 - Info, Warnings & Errors
     */
    debugLevel = 3;

    @track 
    pdfOptions = []; // List of available PDF options for selection.

    @track
    selectedPdfId = null; // Stores the selected PDF ID to be passed to PdfViewer.

    @track
    saveStatus = null;

    CHUNK_SIZE = 3 * 1024 * 1024; // Defines the chunk size for file uploads (3 MB).
    
    /**
     * @description Retrieves the list of available PDFs from Salesforce.
     */
    @wire(getPdfList)
    wiredPdfList({ error, data }) {
        if (data) {
            this.pdfOptions = data.map(pdf => ({
                label: pdf.Title,
                value: pdf.Id
            }));
        } else if (error) {
            showErrorToast(this, 'Error', 'Error retrieving PDFs');
            logMessage(this.debugLevel, 'error', 'Error retrieving PDFs: '+JSON.stringify(error));
        }
    }

    /**
     * @description Handles the selection of a PDF file.
     */
    handlePdfChange(event) {
        this.selectedPdfId = event.detail.value;
    }

    /**
     * @description Handles the save event from PdfViewer and determines if chunked upload is needed.
     */
    handleSave(event) {
        this.saveStatus = 'failure' ;
        try {
            const base64Pdf = event.detail;
            logMessage(this.debugLevel, 'info', 'Checking PDF size before sending...');
    
            // Verify if base64Pdf is valid
            if (!base64Pdf || base64Pdf.length === 0) {
                showErrorToast(this, 'Error', 'Empty PDF data.');
                return;
            }
                
            logMessage(this.debugLevel, 'info', `Base64 file size : ${base64Pdf.length} bytes`);
    
            // Check if the file can be sent in one request
            if (base64Pdf.length <= this.CHUNK_SIZE) { // 3 Mo
                logMessage(this.debugLevel, 'info', 'Sending the file in a single request...');
                this.uploadPdfToSalesforce(base64Pdf);
            } else {
                logMessage(this.debugLevel, 'info', 'File too large, sending in chunks...');
                this.uploadPdfToSalesforceAsync(base64Pdf);
            }
        } catch (error) {
            showErrorToast(this, 'Error checking the file', JSON.stringify(error));
            logMessage(this.debugLevel, 'error', 'Error checking the file: '+JSON.stringify(error));
            this.saveStatus = 'failure' ;
        }
    }

    /**
     * @description This function uploads a Base64-encoded PDF file to Salesforce in a single request. 
     */
    async uploadPdfToSalesforce(base64Pdf) {
        try {
            logMessage(this.debugLevel, 'info', 'Sending PDF to Salesforce...');
        
            // Verify if base64Pdf is valid
            if (!base64Pdf || base64Pdf.length === 0) {
                showErrorToast(this, 'Error', 'mpty PDF data.');
                return;
            }
                
            console.log("📌 Base64 file size: ", base64Pdf.length);
        
            if (base64Pdf.length > 10000000) { // file size limit of 10 Mo
                showErrorToast(this, 'Error', 'File too large.');
                logMessage(this.debugLevel, 'error', 'File too large.');
                return;
            }
        
            // Appeler Apex
            const result = await savePdfToSalesforce({ base64Data: base64Pdf });
            logMessage(this.debugLevel, 'info', `Document successfully saved to Salesforce : ${result}`);  
            showSuccessToast(this, 'Success', 'Document successfully saved to Salesforce.');    
            this.saveStatus = 'success';  
            
        } catch (error) {
            showErrorToast(this, 'Error sending PDF to Salesforce', JSON.stringify(error));
            logMessage(this.debugLevel, 'error', 'Error sending PDF to Salesforce: '+JSON.stringify(error));
            this.saveStatus = 'failure' ;
        }
    }

    /**
     * @description This function handles large PDF uploads by splitting the file into multiple chunks.
     */
    async uploadPdfToSalesforceAsync(base64Pdf) {
        try {
            logMessage(this.debugLevel, 'info', 'Splitting the file and sending to Salesforce...');        
            logMessage(this.debugLevel, 'info', `Total file size in Base64: ${base64Pdf.length} bytes`);
        
            const totalSize = base64Pdf.length;
            let startPosition = 0;
            let chunkIndex = 0;
            let contentDocId = null; // To store the document ID
        
            while (startPosition < totalSize) {
                const chunk = base64Pdf.substring(startPosition, startPosition + this.CHUNK_SIZE);
                const isLastChunk = startPosition + this.CHUNK_SIZE >= totalSize;
                startPosition += this.CHUNK_SIZE;
                chunkIndex++;
        
                logMessage(this.debugLevel, 'info', `📤 Sending chunk ${chunkIndex} (${chunk.length} bytes)`);
        
                try {
                    // Send each chunk to Apex
                    const response = await savePdfChunk({
                        base64Chunk: chunk,
                        isLastChunk: isLastChunk,
                        contentDocumentId: contentDocId // Null for the first call, Salesforce fills it
                    });
        
                    // Get the ContentDocument ID for attaching subsequent chunks
                    if (!contentDocId) {
                        contentDocId = response; // First call returns the document ID
                        logMessage(this.debugLevel, 'info', `First chunk saved, ContentDocumentId : ${contentDocId}`);    
                    }
                            
                    logMessage(this.debugLevel, 'info', `Chunk ${chunkIndex} sent successfully!`);  
                } catch (error) {
                    showErrorToast(this, `Error sending chunk ${chunkIndex}:`, JSON.stringify(error));
                    logMessage(this.debugLevel, 'error', `Error sending chunk ${chunkIndex}:`, JSON.stringify(error));
                    this.saveStatus = 'failure' ;
                    break;
                }
            }
            showSuccessToast(this, 'Success', 'Document successfully saved to Salesforce.');
            this.saveStatus = 'success';
        } catch (error) {
            showErrorToast(this, 'Error sending PDF to Salesforce', JSON.stringify(error));
            logMessage(this.debugLevel, 'error', 'Error sending PDF to Salesforce: '+JSON.stringify(error));
            this.saveStatus = 'failure';
        }
    }
}