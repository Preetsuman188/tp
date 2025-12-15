import {
  SpreadsheetComponent,
  SheetsDirective,
  SheetDirective,
  RangesDirective,
  RangeDirective,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-spreadsheet";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-spreadsheet/styles/material.css";

// Excel-like sheet with native ribbon, gridlines, filters, and editing.
export default function ExcelSheet({ columns = [], rows = [] }) {
  const data =
    rows.length > 0
      ? rows
      : [
          Object.fromEntries(
            (columns.length ? columns : ["Field 1", "Field 2"]).map((c) => [c, ""])
          ),
        ];

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden" style={{ overflowX: "auto" }}>
      <SpreadsheetComponent
        allowFiltering
        allowSorting
        allowNumberFormatting
        allowCellFormatting
        height={480}
        width={"100%"}
        showFormulaBar
        showRibbon
        enableContextMenu
      >
        <SheetsDirective>
          <SheetDirective name="Template">
            <RangesDirective>
              <RangeDirective dataSource={data} showFieldAsHeader />
            </RangesDirective>
            <ColumnsDirective>
              {(columns.length ? columns : ["Field 1", "Field 2"]).map((col) => (
                <ColumnDirective key={col} width={160} />
              ))}
            </ColumnsDirective>
          </SheetDirective>
        </SheetsDirective>
      </SpreadsheetComponent>
    </div>
  );
}
