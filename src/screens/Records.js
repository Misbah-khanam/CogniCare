import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../conponents/Navbar/Navbar'
import DataTable from 'datatables.net'
import api from '../api/Api'
import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import './Records.css'

const Records = () => {

    const [records, setRecords] = useState([])
    const tableRef = useRef(null);
    const dataTable = useRef(null);

    const fetchRecords = () => {
        api.post(
            'score/get-all-score/', {
            organisation: JSON.parse(localStorage.getItem("user"))[0].fields.organisation
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
            }
        }
        ).then(response => {
            console.log(response.data)
            setRecords(response.data.scores)
        })
    }

    const dateConverter = (date) => {
        if (date === undefined) return "";
        const parsedDate = new Date(date);
        const formattedDate = parsedDate.toLocaleString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const [month, day, year] = formattedDate.split('/');
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        fetchRecords()
    },[])



    useEffect(() => {
        if (records.length === 0) {
            if (dataTable.current) {
                dataTable.current.clear().draw();
            }
            return;
        }

        if (!dataTable.current) {
            dataTable.current = new DataTable(tableRef.current, {
                dom: 'Bfrtip',
            });
        }

        dataTable.current.clear();


        records.forEach((row, index) => {
            dataTable.current.row.add([
                index + 1,
                row.name,
                dateConverter(row.created_at),
                row.score.toFixed(2)
            ]);
        });

        dataTable.current.draw();
    }, [records]);

    useEffect(() => {
        if (records.length === 0 && dataTable.current) {
            dataTable.current.destroy();
            dataTable.current = null;
        }
    }, [records]);


    return (
        <div>
            <Navbar />
            {records && <div className='page-body'>
                <div className="table-wrapper">
                    <table ref={tableRef} id="result-table">
                        <thead>
                            <tr>
                                <th>Sno</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>}
        </div>
    )
}

export default Records