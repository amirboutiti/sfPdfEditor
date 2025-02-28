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
import { logMessage, showSuccessToast, showErrorToast } from 'c/utils';

export default class PdfSelectorReadOnly extends LightningElement {
    
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

}