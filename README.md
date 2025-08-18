# 📊 GAS Finance Manager

Personal Finance Manager built with **Google Apps Script** and **Google Spreadsheet**.  
Track expenses, income, investments, and other transactions; categorize them, and view KPI dashboards filtered by date range.

---

## ⚠️ Access & Permissions

-   Request access from the **project owner** to be added as:
    -   **Editor** in the **Google Apps Script** project.
    -   Collaborator with proper permissions in the **Google Spreadsheet** used by the app.
-   Only **Gmail accounts** are supported to use this application.

---

## 🔧 Development Setup

1. Clone the repository.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Enable the Google Apps Script API in your Google account:
    - Open: Google Apps Script Dashboard
    - Turn on Google Apps Script API.

## ▶️ Running the App (GAS Runtime)

This app does not run locally. The HTML uses APIs that execute only on Google’s servers.

-   Open the project in the Apps Script Editor.
-   Go to Deploy → Test deployments and copy the generated test URL.
-   Use that URL to view and test changes in the GAS runtime.

## ⬆️ Uploading Changes (clasp)

Use clasp to sync code with Google Apps Script.

-   Check status:
    ```bash
    clasp status
    ```
-   Push changes:
    ```bash
    clasp push
    ```
-   Auto-upload on file changes:
    ```bash
    clasp push --watch
    ```
    | Tip: If there are remote changes, run clasp pull, resolve locally, and then clasp push.

## 🛠️ NPM Scripts

-   Start development mode:
    ```bash
    npm run gas:dev
    ```
-   Build the app:
    ```bash
    npm run gas:build
    ```

## 🎨 Tech Stack

-   Framework / UI
    -   [Tailwind CSS](https://tailwindcss.com/docs)
    -   [DaisyUI](https://daisyui.com/docs/install/)
    -   [Alpine.js](https://alpinejs.dev/start-here)
-   Libraries
    -   [date-fns](https://date-fns.org/docs/Getting-Started)
    -   [Cally.js](https://wicky.nillia.ms/cally/)
    -   [Notyf.js](https://carlosroso.com/notyf/)
    -   [Culori.js](https://culorijs.org/)
