import React, { useEffect, useMemo } from 'react';
import { BiCaretUp } from 'react-icons/bi';
import { useRowSelect, useSortBy, useTable } from 'react-table';
import { getLocal, setLocal } from '../../utils/localStorage.utils';
import TableDropdown from '../Dropdowns/TableDropdown';

function ReactTable({ columns, data, tableId, isSelectableRow, setSelectedRows, selectedRows }) {
    if (!tableId) throw new Error('Table id is required')

    const IndeterminateCheckbox = React.forwardRef(
        ({ indeterminate, ...rest }, ref) => {
            const defaultRef = React.useRef()
            const resolvedRef = ref || defaultRef

            React.useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate
            }, [resolvedRef, indeterminate])

            return (
                <>
                    <input type="checkbox" ref={resolvedRef} {...rest} />
                </>
            )
        }
    )


    const table_id = tableId + '_schema';
    let table_schema = getLocal(table_id)
    if (!table_schema) {
        const defaultSchema = { hiddenColumns: [] }
        setLocal(table_id, defaultSchema)
        table_schema = defaultSchema
    }

    const tableColumns = useMemo(() => columns, [columns])
    const tableData = useMemo(() => data, [data])

    const tableInstance = useTable({
        columns: tableColumns, data: tableData,
        initialState: {
            selectedRowIds: selectedRows?.rowsId || {}
        }
    }, useSortBy,
        useRowSelect,
        hooks => {
            isSelectableRow && hooks.visibleColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <label className="p-2 cursor-pointer hover:bg-gray-200 duration-75" >
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </label>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <label className="p-2 cursor-pointer hover:bg-gray-100 duration-75" >
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </label>
                    ),
                },
                ...columns,
            ])
        }
    )

    let {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        state,
        setHiddenColumns,
        getToggleHideAllColumnsProps,
        initialState,
        selectedFlatRows
    } = tableInstance;

    initialState.hiddenColumns = table_schema.hiddenColumns

    const { hiddenColumns, selectedRowIds } = state;

    const _selectedFlarRows = useMemo(() => selectedRowIds, [selectedRowIds])

    setTimeout(() => {
        setLocal(table_id, { hiddenColumns: hiddenColumns })
    }, 300);


    useEffect(() => {
        typeof setSelectedRows === 'function' && setSelectedRows({ rowsId: _selectedFlarRows, selectedFlatRows })
    }, [_selectedFlarRows])


    return (
        <>
            <div className="px-3 md:px-6 py-2 flex items-center justify-end" >
                <TableDropdown>
                    <ul className="dropdown_ul">
                        <li>
                            <label className="dropdown_li bg-blue-600 bg-opacity-10">
                                <input type="checkbox" {...getToggleHideAllColumnsProps()} /> &nbsp; Toggle All
                            </label>
                        </li>
                        {
                            allColumns.map((column, i) => (
                                <li key={i}>
                                    <label key={i} className="dropdown_li">
                                        <input type="checkbox" {...column.getToggleHiddenProps()} />
                                        &nbsp;&nbsp;
                                        {column.Header}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                </TableDropdown>
            </div>
            <div className="overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                <div className="min-h-[250px]">
                    <table {...getTableProps()} className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            {// Loop over the header rows
                                headerGroups.map((headerGroup, i) => (
                                    // Apply the header row props
                                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                                        {// Loop over the headers in each row
                                            headerGroup.headers.map((column, i) => (
                                                // Apply the header cell props
                                                <th key={i} {...column.getHeaderProps(column.getSortByToggleProps())} {...column.getHeaderProps()} className="px-6 align-middle py-3.5 border-b border-gray-200 text-sm uppercase whitespace-nowrap text-left bg-white text-gray-900 font-bold select-none">
                                                    <div className="flex items-center">
                                                        {column.render('Header')}
                                                        <span className="block mt-[-4px]" >
                                                            {column.isSorted && <BiCaretUp size={20} className={`duration-150 ${column.isSortedDesc ? 'rotate-180' : ''}`} />}
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                    </tr>
                                ))}
                        </thead>
                        {/* Apply the table body props */}
                        <tbody {...getTableBodyProps()} className="react_table_tbody">
                            {// Loop over the table rows
                                rows.map((row, i) => {
                                    // Prepare the row for display
                                    prepareRow(row)
                                    return (
                                        // Apply the row props
                                        <tr {...row.getRowProps()} ket={i}>
                                            {// Loop over the rows cells
                                                row.cells.map((cell, i) => {
                                                    // Apply the cell props
                                                    return (
                                                        <td key={i} {...cell.getCellProps()} className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-gray-700 text-sm whitespace-nowrap p-4">
                                                            {// Render the cell contents
                                                                cell.render('Cell')}
                                                        </td>
                                                    )
                                                })}
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    )
}

export default ReactTable
