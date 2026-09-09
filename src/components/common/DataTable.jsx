// components/common/DataTable.jsx

import React from "react";

const DataTable = ({
  title,
  columns,
  data,
  loading = false,
  className="",
}) => {
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border overflow-auto inline-block ${className}`}>
      {title && (
        <div className="px-5 py-1 border-b">
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
      )}

      {/* <div className="overflow-x-auto "> */}
      <div className="max-h-[70vh] ">
        <table className="">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column?.key} 
                  className="px-4 py-1 text-left text-sm font-semibold text-gray-700"
                >
                  {column?.label} 
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns?.length}
                  className="text-center py-6"
                >
                  Loading...
                </td>
              </tr>
            ) : data?.length ? (
              data.map((row, index) => (
                <tr
                    key={row._id || index}
                  className="border-t hover:bg-gray-50"
                >
                  {columns.map((column) => (
                  <td
  key={column?.key}
  className="px-4 py-3 text-sm"
>
  {column.render
    ? column.render(row)
    : row[column?.key]}
</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns?.length}
                  className="text-center py-6"
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;