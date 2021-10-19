import React, { useEffect, useState, useMemo } from "react";
import he from "he";
import { Container } from "reactstrap";
import TableContainer from "./TableContainer";
import { SelectColumnFilter } from "./filters";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const doFetch = async () => {
      const response = await fetch(
        "https://www.dvrpc.org/asp/training/data.aspx"
      );
      const body = await response.json();
      setData(body);
    };
    doFetch();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "TITLE",
        Cell: ({ row: { original } }) => (
          <a href={original.LINK} target="_blank" rel="noreferrer">
            {he.decode(original.TITLE)}
          </a>
        ),
      },
      {
        Header: "Category",
        accessor: "CATEGORY",
        Filter: SelectColumnFilter,
        filter: "equals",
      },
      {
        Header: "Type",
        accessor: "TYPE",
        Filter: SelectColumnFilter,
        filter: "equals",
      },
      {
        Header: "Date",
        accessor: "TIME",
        disableFilters: true,
      },
    ],
    []
  );

  return (
    <Container style={{ marginTop: "2rem" }}>
      <TableContainer columns={columns} data={data} />
    </Container>
  );
};

export default App;
