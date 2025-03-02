# 📘 pdfSelector - LWC Documentation

## 📌 Description
The `pdfSelector` component is a **Lightning Web Component (LWC)** that demonstrates how to use [`pdfViewer`](pdfViewer.md) in **modification mode** (editing enabled by default). 

It provides a list of the **10 most recent PDF files** stored in Salesforce and allows the user to select one to be displayed in [`pdfViewer`](pdfViewer.md) for modification.

---

## 🚀 Usage

The `pdfSelector` component can be added to an existing **Lightning Record Page** to test its functionality. 

### 📌 **Adding `pdfSelector` to a Lightning Page**

1. Navigate to **Setup** → **Lightning App Builder**.
2. Select an existing **Lightning Record Page** (e.g., Opportunity or Quote).
3. Click **Edit Page**.
4. Drag and drop the **`pdfSelector`** component into the page layout.
5. Save and activate the page.

Once added, it will display a list of recent PDF documents stored in Salesforce, allowing users to select and view them in [`pdfViewer`](pdfViewer.md).

---

## 🎯 Functionality

1. **Retrieving Recent PDFs**:  
   - The component fetches the **10 most recent ContentDocument records** from Salesforce.
   - It displays them as a selectable list.

2. **Selecting a PDF and sending parameters to [`pdfViewer`](pdfViewer.md)**:  
   - When the user clicks on a document, `pdfSelector` **sends the following parameters** to `pdfViewer`:
     - **`content-document-id`** (Required) → The selected PDF's Salesforce document ID.
     - **`debug-level`** (Optional, default `3`) → Enables logging for debugging.
     - **`read-only`** → Not explicitly passed, but by default, `pdfViewer` is in **modification mode (`readOnly=false`)**.

3. **Listening to Events from [`pdfViewer`](pdfViewer.md)**:  
   - **`onsave`**:  
     - Triggered when the user **saves modifications** in `pdfViewer`.  
     - `pdfSelector` listens to this event to handle the updated file (e.g., saving it in Salesforce).  
   - **`onerror`**:  
     - Triggered when an **error occurs** in `pdfViewer` (via `dispatchError`).  
     - `pdfSelector` listens to this event to display an error message or log debugging information.  

4. **Handling Save Events**:  
   - When modifications are made in `pdfViewer`, `pdfSelector` listens to the `onsave` event.  
   - The updated PDF is then processed and saved back to Salesforce.

5. **Error Handling via `dispatchError`**:  
   - If an error occurs, the `pdfSelector` component listens to the `onerror` event from `pdfViewer`.
   - Errors are logged or displayed for user feedback.
