/***
* @author Amir BOUTITI
* @date   February 2025
* @description Utility functions for logging messages and showing toast notifications in Lightning Web Components (LWC).
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
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/**
 * Logs messages based on the specified debug level.
 * @param {number} debugLevel - The current debug level (0: off, 1: errors, 2: warnings & info, 3: all logs).
 * @param {string} level - The log level ('info', 'warning', 'error').
 * @param {string} message - The message to log.
 * @param {...any} args - Additional arguments to log.
 */
export function logMessage(debugLevel, level, message, ...args) {
    if (debugLevel > 0) {
        if (
            debugLevel === 3 || 
            (debugLevel === 2 && (level === 'info' || level === 'warning')) || 
            (debugLevel === 1 && level === 'error')
        ) {
            if (level === 'info') {
                console.log(`[INFO]: ${message}`, ...args);
            } else if (level === 'warning') {
                console.warn(`[WARN]: ${message}`, ...args);
            } else if (level === 'error') {
                console.error(`[ERROR]: ${message}`, ...args);
            }
        }
    }
}

/**
 * Displays a success toast notification in the LWC component.
 * @param {LightningElement} component - The LWC component instance.
 * @param {string} title - The title of the toast message.
 * @param {string} message - The message to display.
 */
export function showSuccessToast(component, title, message) {
    component.dispatchEvent(
        new ShowToastEvent({
            title: title,
            message: message,
            variant: 'success',
        }),
    );
}

/**
 * Displays an error toast notification in the LWC component.
 * @param {LightningElement} component - The LWC component instance.
 * @param {string} title - The title of the toast message.
 * @param {string} message - The message to display.
 */
export function showErrorToast(component, title, message) {
    component.dispatchEvent(
        new ShowToastEvent({
            title: title,
            message: message,
            variant: 'error',
        }),
    );
}

/**
 * Dispatches an error event from the component.
 * @param {LightningElement} component - The LWC component instance.
 * @param {string} errorMessage - The error message.
 * @param {any} [errorDetails=null] - Additional error details (optional).
 */
export function dispatchError(component, errorMessage, errorDetails = null) {
    const errorEvent = new CustomEvent('error', { 
        detail: { message: errorMessage, error: errorDetails } 
    });
    component.dispatchEvent(errorEvent);
}