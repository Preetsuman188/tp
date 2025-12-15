import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";

// Register all modules once
ModuleRegistry.registerModules([AllCommunityModule]);

// Import styles (important)
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function DynamicTable({ columns = ["Column 1", "Column 2"], height = 320 }) {
  const [rowData, setRowData] = useState([{ id: 1 }]);
  const [colDefs, setColDefs] = useState(
    columns.map((col, idx) => ({ field: `col${idx + 1}`, headerName: col, editable: true }))
  );

  useEffect(() => {
    setColDefs(columns.map((col, idx) => ({ field: `col${idx + 1}`, headerName: col, editable: true })));
  }, [columns]);

  return (
    <div className="ag-theme-alpine" style={{ height, width: "100%", marginTop: 10 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        onCellValueChanged={() => setRowData([...rowData])}
        editType="fullRow"
      />
    </div>
  );
}
