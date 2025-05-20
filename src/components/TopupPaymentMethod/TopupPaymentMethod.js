import { getErrors, toastDefault } from "../../utils/handler.utils";
import { topupPaymentMethodsTableColumns } from "../../utils/reactTableColumns";
import Table from "../react-table/Table";
import { Link } from 'react-router-dom'
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import { useRef } from "react";

function TopupPaymentMethod() {

    const reloadRefFunc = useRef(null)

    const inActivePayment = (id) => {
        if (window.confirm('Are you sure')) {
            toast.promise(
                axiosInstance.post(`admin/topup-payment-method/inactive/${id}`),
                {
                    pending: 'Inactivating payment method...',
                    error: {
                        render(err) {
                            console.log(err);
                            return getErrors(err.data, false, true)
                        }
                    },
                    success: {
                        render() {
                            reloadRefFunc.current()
                            return 'Payment method inactivated successfully'
                        }
                    }
                },
                toastDefault
            )
        }
    }

    const activePayment = (id) => {
        toast.promise(
            axiosInstance.post(`admin/topup-payment-method/active/${id}`),
            {
                pending: 'Activating payment method...',
                error: {
                    render(err) {
                        console.log(err);
                        return getErrors(err.data, false, true)
                    }
                },
                success: {
                    render() {
                        reloadRefFunc.current()
                        return 'Payment method activated successfully'
                    }
                }
            },
            toastDefault
        )
    }


    let editButton = {
        id: 'action',
        Header: "Action",
        accessor: 'is_active',
        Cell: (e) => {
            const id = e.row.original.id
            if (parseInt(e.value) === 1) {
                return <button className="cstm_btn_small !bg-gray-500 hover:!bg-gray-700" type="button" onClick={() => inActivePayment(id)}>
                    Inactive
                </button>
            }
            return <button className="cstm_btn_small" type="button" onClick={() => activePayment(id)}>
                Active
            </button>
        }
    };

    const withEditButton = [...topupPaymentMethodsTableColumns, editButton]

    return (
        <div className="md:px-5" >
            <div className="bg-white py-5 mb-5 px-5">
                <Table
                    reloadRefFunc={reloadRefFunc}
                    tableTitle="Topup payment methods"
                    tableId="topup_payment_methods_table"
                    url="/admin/topup-pyament-methods"
                    selectData={(res) => ({
                        data: res.data.data,
                    })}
                    disableGlobalSearch
                    disablePagination
                    disableRowsPerPage
                    selectError={(err) => getErrors(err, true)[0]}
                    columns={withEditButton}
                />
            </div>
        </div>
    )
}

export default TopupPaymentMethod