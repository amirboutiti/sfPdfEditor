#  sfPdfEditor

## 🚀 Introduction

**sfPdfEditor** is a Salesforce-based project that enables **PDF display and editing** directly within Salesforce using **Lightning Web Components (LWC)** and **Apex**.

It relies on the **sfPdfEditorLib** library, which integrates **PDF.js, Fabric.js, and PDF-LIB** to provide advanced PDF manipulation capabilities.

⚠ **Note:**  
The **Salesforce code** is released under the **MIT license**, while the **sfPdfEditorLib** library, although included as a *static resource*, **cannot be modified** by users. However, it can be used as is.

---

## 🎯 **Key Features**
- 📄 **Display** PDFs stored in Salesforce.
- ✏ **Edit** PDFs (currently supports adding text, with future enhancements for shapes, signatures, and more).
- 🔄 **Component interaction**:
  - `pdfSelector` (provided as an example) lists the **10 most recent PDFs** in Salesforce and sends the selected file ID to `pdfViewer`.
  - `pdfViewer` displays and enables editing of the selected PDF.
  - Once modified, `pdfViewer` sends the updated file to `pdfSelector`, which **saves it back to Salesforce**.
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
| `pdfViewer` | Displays and allows editing of a given PDF. |
| `pdfSelector` | Lists the last 10 stored PDFs and sends the selected file ID to `pdfViewer`. |
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
4. **Add `pdfSelector` to a Lightning page:**  
   - Navigate to **Setup** → **Lightning App Builder**.  
   - Select the page where you want to add `pdfSelector`.  
   - Drag and drop the `pdfSelector` component onto the page.  
   - Save and activate the page.

---

## 🖥 **Usage**
### 1️⃣ Selecting a PDF file from Salesforce
- The `pdfSelector` component lists the **10 most recent PDF files** stored in Salesforce.
- When a user selects a file, its **ID is sent** to `pdfViewer`.

### 2️⃣ Displaying and editing the PDF file
- `pdfViewer` retrieves and displays the selected file using **sfPdfEditorLib**.
- The user can **edit the PDF** (add text, annotations, signatures, etc.).

### 3️⃣ Saving the modified file
- Once modifications are done, the user clicks **"Save"**.
- `pdfViewer` sends the modified file to `pdfSelector`, which **stores it back in Salesforce**.

---

## 📜 **License**
- The **Salesforce code** is available under the **[MIT license](LICENSE)**.
- The **sfPdfEditorLib** library, although included as a *static resource*, **cannot be modified** by users but can be used as is.

---

## 🛠 **Contributing**
Contributions are welcome to improve the project.  
However, please respect the **sfPdfEditorLib** restrictions when making changes.

🔗 **GitHub Repository**: [https://github.com/amirboutiti/sfPdfEditor](https://github.com/amirboutiti/sfPdfEditor)

---

## 📞 **Support**
If you encounter any issues or have suggestions, feel free to open an **issue** on GitHub or contact me directly.

---
