import { useEffect, useState, useMemo } from "react";
import { useTable } from "react-table";
import he from "he";
import "./App.css";

const Title = ({ value }) => <a href={value}>{he.decode(value)}</a>;

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
        accessor: "TITLE", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => <Title value={value} />,
      },
      {
        Header: "Category",
        accessor: "CATEGORY",
      },
      {
        Header: "IMAGE",
        accessor: "IMAGE",
      },
      {
        Header: "LINK",
        accessor: "LINK",
      },
      {
        Header: "TYPE",
        accessor: "TYPE",
      },
      {
        Header: "TIME",
        accessor: "TIME",
      },
    ],
    []
  );

  const table = useTable({ columns, data });

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
                  <th {...column.getHeaderProps()}>
                    {
                      // Render the header
                      column.render("Header")
                    }
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
