/***
* @author Amir BOUTITI
* @date   February 2025
* @description PDF Viewer LWC component for integrating the sfPDFLib library into Salesforce.
* This component allows users to view and interact with PDF documents within a Lightning page.
* It leverages external JavaScript libraries for rendering and editing PDFs.
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

import { api, LightningElement, track, wire } from 'lwc';
import sfPdfEditorLib from '@salesforce/resourceUrl/sfPdfEditorLib';
import getPdfContent from '@salesforce/apex/PdfViewer.getPdfContent';
import { loadScript } from "lightning/platformResourceLoader";
import { logMessage, dispatchError } from 'c/utils';

export default class PdfViewer extends LightningElement {

    _debugLevel = 0; // Internal storage for debugLevel.

    /**
     * @description Defines the debug level: 
     * 0 - No logs
     * 1 - Errors only
     * 2 - Info & warnings
     * 3 - Info, Warnings & Errors
     */
    @api
    get debugLevel() {
        return this._debugLevel;
    }

    set debugLevel(value) {
        let numericValue = Number(value);
        if (!isNaN(numericValue) && [0, 1, 2, 3].includes(numericValue)) {
            this._debugLevel = numericValue;
        } else {
            logMessage(2, 'warning', 'Invalid debugLevel value. Resetting to 0.');
            this._debugLevel = 0;
        }
    }

    _pdfId; // Stores the PDF ID to be loaded.

    /**
     * Getter and setter for the pdfId property.
     * If a valid pdfId is provided, the PDF content is loaded from Salesforce.
     */
    @api
    get pdfId() {
        return this._pdfId;
    }

    set pdfId(value) {
        this._pdfId = value;
        if(this._pdfId != null && this._pdfId != undefined) {            
            this.loadPdfFromSalesforce();
        }
    }
    
    @track
    isScriptLoaded = false; // Tracks if the external script has been loaded.

    sfPdfEditor = null; // Holds the instance of the PDF Editor.

    /**
     * @description Lifecycle hook - called when the component is inserted into the DOM.
     * Loads the external PDF library if not already loaded.
     */
    connectedCallback() {
        if (!this.isScriptLoaded) {
            loadScript(this, sfPdfEditorLib + "/sfPdfEditor.js")
                .then(() => {
                    logMessage(this._debugLevel, 'info', 'SFPdfEditor.js loaded !');
                    this.isScriptLoaded = true;
                    this.initializeEditor();
                })
                .catch((error) => {
                    logMessage('error', 'Error loading PDF library:', error);
                    dispatchError(this, 'Error loading PDF library.', error);
                });
        }

        // Add a listener to receive the PDF from sfPdfEditor
        window.addEventListener("message", (event) => {
            if (event.data.modifiedPdf) {
                logMessage(this._debugLevel, 'info', 'Modified PDF received !');
                // Creates the event with the contact ID data.
                const savepdfEvent = new CustomEvent("save", { detail: event.data.modifiedPdf });

                // Dispatches the event.
                this.dispatchEvent(savepdfEvent);
            }
        });
    }

    /**
     * @description Initializes the PDF editor once the script is loaded.
     */
    initializeEditor() {
        const pdfContainer = this.template.querySelector(".pdf-container");
        if (!pdfContainer) {
            console.error("Élément `pdf-container` introuvable !");
            return;
        }
        this.sfPdfEditor = new SFPdfEditor({
            container: pdfContainer,
            basePath:sfPdfEditorLib
        });
        logMessage('info', 'PDF Editor initialized.');
    }

    /**
     * @description Loads the PDF content from Salesforce based on the provided pdfId.
     */
    async loadPdfFromSalesforce() {
        try {
            logMessage('info', 'Fetching PDF content for ID:', this._pdfId);
            const base64Pdf = await getPdfContent({ pdfId: this._pdfId });

            if (!base64Pdf) {
                throw new Error("The PDF file is empty or was not found.");
            }

            this.sfPdfEditor.loadPDF(base64Pdf);
            logMessage('info', 'PDF content loaded successfully.');
            
        } catch (error) {
            logMessage('error', 'Error loading PDF:', error);
            dispatchError(this, 'Error loading PDF.', error);
        }
    }
}