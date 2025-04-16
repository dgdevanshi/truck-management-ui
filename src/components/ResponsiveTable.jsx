/**
 * A responsive table component that adapts to mobile screens
 * On small screens, it transforms into a card-like layout
 */
const ResponsiveTable = ({
  headers,
  data,
  renderRow,
  emptyMessage = "No data available",
}) => {
  if (!data || data.length === 0) {
    return <p className="py-4 text-center text-gray-500">{emptyMessage}</p>;
  }

  return (
    <>
      {/* Regular table for medium screens and up */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, rowIndex) => renderRow(item, rowIndex, "table"))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="sm:hidden space-y-4">
        {data.map((item, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            {headers.map((header, colIndex) => (
              <div key={colIndex} className="py-2">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  {header.label}
                </div>
                <div className="mt-1">
                  {header.render ? header.render(item) : item[header.key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default ResponsiveTable;
