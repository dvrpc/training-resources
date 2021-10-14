import { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import he from "he";
import "./App.css";

const Title = (props) => (
  <a target="_blank" href={props.LINK}>
    {he.decode(props.TITLE)}
  </a>
);

const Row = (props) => (
  <>
    <h2>
      <Title {...props} />
    </h2>
  </>
);

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await fetch(
        "https://www.dvrpc.org/asp/training/data.aspx"
      ).then((d) => d.json());
      setData(result);
    })();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: (d) => <Title {...d} />,
      },
      {
        Header: "Category",
        accessor: "CATEGORY",
      },
      {
        Header: "TYPE",
        accessor: "TYPE",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "TIME",
        accessor: "TIME",
      },
    ],
    []
  );

  const table = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    table;

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "sort-desc"
                          : "sort-asc"
                        : ""
                    }
                  >
                    {
                      // Render the header
                      column.render("Header")
                    }
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default App;
