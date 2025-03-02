#  sfPdfEditor

## 🚀 Introduction

**sfPdfEditor** is a Salesforce-based project that enables **PDF display and editing** directly within Salesforce using **Lightning Web Components (LWC)** and **Apex**.

It relies on the **sfPdfEditorLib** library, which integrates **PDF.js, Fabric.js, and PDF-LIB** to provide advanced PDF manipulation capabilities.

⚠ **Note:**  
The **Salesforce code** is released under the **MIT license**, while the **sfPdfEditorLib** library, although included as a *static resource*, **cannot be modified** by users. However, it can be used as is.

---

## 🎯 **Key Features**
- 📄 **Display** PDFs stored in Salesforce.
- ✏ **Edit** PDFs (supports adding **text, shapes, highlights, and signatures**).
- 🔄 **Component interaction**:
  - [`pdfSelector`](pdfSelector.md) (provided as an example) lists the **10 most recent PDFs** in Salesforce and sends the selected file ID to [`pdfViewer`](pdfViewer.md).
  - `pdfSelectorReadOnly` provides a **read-only** version of [`pdfSelector`](pdfSelector.md), allowing users to view PDFs without modification.
  - [`pdfViewer`](pdfViewer.md) displays PDFs and allows **editing (text, shapes, highlights, and signatures)**.
  - Once modified, [`pdfViewer`](pdfViewer.md) sends the updated file to [`pdfSelector`](pdfSelector.md), which **saves it back to Salesforce**.
- 🚨 **Error Handling**:
  - [`pdfViewer`](pdfViewer.md) dispatches an **`onerror` event** when an issue occurs.
  - [`pdfSelector`](pdfSelector.md) and `pdfSelectorReadOnly` listen for this event to **log errors or provide user feedback**.
- 🔗 **Seamless Salesforce integration** via LWC and Apex.

---

## 📌 **Project Structure**
### 📂 **Apex Components**
| File | Description |
|------|------------|
| `PdfController.cls` | Main controller for handling PDF files in Salesforce. |
| `PdfViewer.cls` | Manages PDF retrieval and storage logic. |
| `PdfController_TEST.cls` | Unit tests for `PdfController.cls`. |
| `PdfViewer_TEST.cls` | Unit tests for `PdfViewer.cls`. |

### ⚡ **Lightning Web Components (LWC)**
| Component | Description |
|-----------|------------|
| [`pdfViewer`](pdfViewer.md) | Displays and allows editing of a given PDF (text, shapes, highlights, and signatures). |
| [`pdfSelector`](pdfSelector.md) | Lists the last 10 stored PDFs and sends the selected file ID to [`pdfViewer`](pdfViewer.md) for editing. |
| [`pdfSelectorReadOnly`](pdfSelectorReadOnly.md) | Read-only version of [`pdfSelector`](pdfSelector.md), allowing users to view PDFs without modification. |
| `utils` | Utility functions for PDF management. |

---

## 🔧 **Installation**
### 🏗 Deploying via SFDX
1. **Clone the project:**
   ```sh
   git clone https://github.com/amirboutiti/sfPdfEditor.git
   ```
2. **Authenticate with a Salesforce org:**
   ```sh
   sfdx force:auth:web:login -a <yourOrgAlias>
   ```
3. **Deploy the project to your org:**
   ```sh
   sfdx force:source:deploy -p force-app -u <yourOrgAlias>
   ```
4. **Add [`pdfSelector`](pdfSelector.md) or [`pdfSelectorReadOnly`](pdfSelectorReadOnly.md) to a Lightning page:**  
   - Navigate to **Setup** → **Lightning App Builder**.  
   - Select the page where you want to add [`pdfSelector`](pdfSelector.md) or [`pdfSelectorReadOnly`](pdfSelectorReadOnly.md).  
   - Drag and drop the component onto the page.  
   - Save and activate the page.

---

## 🖥 **Usage**
### 1️⃣ Selecting a PDF file from Salesforce
- The [`pdfSelector`](pdfSelector.md) component lists the **10 most recent PDF files** stored in Salesforce.
- When a user selects a file, its **ID is sent** to [`pdfViewer`](pdfViewer.md).
- The [`pdfSelectorReadOnly`](pdfSelectorReadOnly.md) component allows viewing PDFs **without editing capabilities**.

### 2️⃣ Displaying and editing the PDF file
- [`pdfViewer`](pdfViewer.md) retrieves and displays the selected file using **sfPdfEditorLib**.
- The user can **edit the PDF** (add **text, shapes, highlights, and signatures**).

### 3️⃣ Saving the modified file
- Once modifications are done, the user clicks **"Save"**.
- [`pdfViewer`](pdfViewer.md) sends the modified file to [`pdfSelector`](pdfSelector.md), which **stores it back in Salesforce**.

### 4️⃣ Handling errors
- [`pdfViewer`](pdfViewer.md) dispatches an **`onerror` event** when an issue occurs.
- [`pdfSelector`](pdfSelector.md) and [`pdfSelectorReadOnly`](pdfSelectorReadOnly.md) listen for this event to **log errors or provide user feedback**.

---

## 📜 **License**
- The **Salesforce code** is available under the **[MIT license](LICENSE)**.
- The **sfPdfEditorLib** library, although included as a *static resource*, **cannot be modified** by users but can be used as is.
