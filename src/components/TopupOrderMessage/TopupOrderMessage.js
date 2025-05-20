import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axiosInstance from "../../common/axios";
import { getErrors, toastDefault } from "../../utils/handler.utils";
import { TopupOrderMessageColums } from "../../utils/reactTableColumns";
import Table from "../react-table/Table";

import { Link } from "react-router-dom";

function TopupOrderMessage() {
    const reloadRefFunc = useRef(null)
    const [selectedRows, setSelectedRows] = useState({
        rowsId: {},
        selectedFlatRows: []
    })


    let actionMenu = {
        id: 'delete',
        Header: "Action",
        accessor: 'id',
        Cell: (e) => {
            return <ul className="flex space-x-2">
                <li className="cstm_btn_small" onClick={() => openChangeStatusModal(e.value)}>
                    Delete
                </li>
            </ul>
        }
    };
    let withActionMenu = [...TopupOrderMessageColums, actionMenu]


    const openChangeStatusModal = async (messageId) => {

        const confirm = await Swal.fire({
            title: 'Delete warning',
            text: "Are you sure you want to delete?",
            showCancelButton: true,
            focusConfirm: false
        })


        if (confirm) {
            toast.promise(
                axiosInstance.get(`/admin/topup-order-message/delete/${messageId}`),
                {
                    pending: 'Deleteing...',
                    error: {
                        render(err) {
                            console.log(err);
                            return getErrors(err.data, false, true)
                        }
                    },
                    success: {
                        render() {
                            reloadRefFunc.current()
                            return 'Order updated successfully'
                        }
                    }
                },
                toastDefault
            )
        }
    }

    return (
        <div className="md:px-5" >
            <div className="bg-white py-5 mb-5 px-5">
                <Link to="/topup-order-message/add-new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add new
                </Link>
                <Table
                    reloadRefFunc={reloadRefFunc}
                    tableTitle="Product Orders"
                    tableId="topup_order_message"
                    url="/admin/topup-order-message"
                    selectData={(res) => {
                        return {
                            data: res.data.data,
                        }
                    }}
                    queryString="order_id"
                    disableGlobalSearch
                    selectError={(err) => getErrors(err, true)[0]}
                    columns={withActionMenu}
                    isSelectableRow
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                />
            </div>
        </div>
    )
}

export default TopupOrderMessage