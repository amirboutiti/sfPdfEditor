# 📘 pdfSelectorReadOnly - LWC Documentation

## 📌 Description
The `pdfSelectorReadOnly` component is a **Lightning Web Component (LWC)** that demonstrates how to use [`pdfViewer`](pdfViewer.md) in **read-only mode**. 

It provides a list of the **10 most recent PDF files** stored in Salesforce and allows the user to select one to be displayed in [`pdfViewer`](pdfViewer.md) **without editing capabilities**.

---

## 🚀 Usage

The `pdfSelectorReadOnly` component can be added to an existing **Lightning Record Page** to test its functionality. 

### 📌 **Adding `pdfSelectorReadOnly` to a Lightning Page**

1. Navigate to **Setup** → **Lightning App Builder**.
2. Select an existing **Lightning Record Page** (e.g., Opportunity or Quote).
3. Click **Edit Page**.
4. Drag and drop the **`pdfSelectorReadOnly`** component into the page layout.
5. Save and activate the page.

Once added, it will display a list of recent PDF documents stored in Salesforce, allowing users to select and view them in [`pdfViewer`](pdfViewer.md) in **read-only mode**.

---

## 🎯 Functionality

1. **Retrieving Recent PDFs**:  
   - The component fetches the **10 most recent ContentDocument records** from Salesforce.
   - It displays them as a selectable list.

2. **Selecting a PDF and sending parameters to [`pdfViewer`](pdfViewer.md)**:  
   - When the user clicks on a document, `pdfSelectorReadOnly` **sends the following parameters** to `pdfViewer`:
     - **`content-document-id`** (Required) → The selected PDF's Salesforce document ID.
     - **`debug-level`** (Optional, default `3`) → Enables logging for debugging.
     - **`read-only=true`** → Ensures that `pdfViewer` is in **read-only mode**.

3. **Listening to Events from [`pdfViewer`](pdfViewer.md)**:  
   - **`onerror`**:  
     - Triggered when an **error occurs** in `pdfViewer` (via `dispatchError`).  
     - `pdfSelectorReadOnly` listens to this event to display an error message or log debugging information.  

4. **Error Handling via `dispatchError`**:  
   - If an error occurs, the `pdfSelectorReadOnly` component listens to the `onerror` event from `pdfViewer`.
   - Errors are logged or displayed for user feedback.
