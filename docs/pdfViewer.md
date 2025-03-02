# 📘 pdfViewer - LWC Documentation

## 📌 Description
The `pdfViewer` component is a **Lightning Web Component (LWC)** that displays and edits PDFs using the **sfPdfEditorLib** library. 

It supports two modes:
- **Read-only (`readOnly=true`)**: The PDF is displayed but cannot be edited.
- **Edit mode (`readOnly=false`)**: The user can **add text, shapes, highlights, and signatures** to the PDF.

This component **requires the Salesforce document ID** (`ContentDocumentId`) to retrieve and display the file.

---

## 🚀 Usage
```html
<c-pdfViewer content-document-id="069XXXXXXXXXXXX" read-only="false" debug-level="3"></c-pdfViewer>
```

| Attribute               | Type    | Required | Description |
|------------------------|---------|----------|-------------|
| `content-document-id`  | `String` | ✅ Yes | The Salesforce document ID to display. |
| `read-only`           | `Boolean` | ❌ No (default: `false`) | Enables/disables PDF editing. |
| `debug-level`         | `Number` | ❌ No (default: `3`) | Defines the logging level: |
|          | | 0 - No logs (Default logs) |
|          | | 1 - Errors only |
|          | | 2 - Info & warnings |
|          | | 3 - Info, Warnings & Errors |

---

## 🎯 Functionality

1. **Loading the PDF file**:  
   - `pdfViewer` uses **`content-document-id`** to retrieve the PDF from Salesforce.
   - It makes an **Apex call** to fetch the file in **Base64** format.
   - The file is then loaded into the **sfPdfEditorLib** library.

2. **Displaying the PDF using `sfPdfEditorLib`**:  
   - An instance of **`SFPdfEditor`** is created to render the PDF using **PDF.js, Fabric.js, and PDF-LIB**.

3. **Read/Edit Modes**:  
   - If `readOnly=true` → the PDF is displayed without editing tools.  
   - If `readOnly=false` → the user can **add text, shapes, highlights, and signatures** to the PDF.

4. **Saving modifications (if in edit mode)**:  
   - The user can save changes through **Salesforce ContentDocument**.
   - The updated PDF file is sent via the `onsave` event. To get and save the updated file, you should listen to the `onsave` event on `pdfViewer` and process the saving file in the parent component.

5. **Error Handling via `dispatchError`**:  
   - If an error occurs, the `pdfViewer` component dispatches an **`onerror` event**.
   - The parent component should listen for this event to handle errors gracefully.

---

## 🎟️ Events

| Event        | Description |
|-------------|-------------|
| `onsave`    | Triggered when the user saves changes to the PDF. The updated PDF file is sent via this event. |
| `onerror`   | Triggered when an error occurs in the PDF viewer (dispatched via `dispatchError`). The event includes an error message for debugging. |

---

## 🔗 LWC Examples using `pdfViewer`
- [`pdfSelector`](pdfSelector.md) - Selects a Salesforce PDF document and sends it to `pdfViewer`.
- [`pdfSelectorReadOnly`](pdfSelectorReadOnly.md) - Read-only version of `pdfSelector`.

