export default function TrelloImportPage() {
  return (
    <div>
      <h1>Trello Import</h1>
      <form action="/api/admin/trello-import" method="post" encType="multipart/form-data">
        <input type="file" name="file" accept="application/json" required />
        <label><input type="checkbox" name="dryRun" value="true" defaultChecked /> Dry Run</label>
        <button>Upload</button>
      </form>
      <h2>Inventory Workbook Import</h2>
      <form action="/api/admin/inventory-import" method="post" encType="multipart/form-data">
        <input type="file" name="file" accept=".xlsx,.xls" required />
        <button>Import Workbook</button>
      </form>
    </div>
  );
}
