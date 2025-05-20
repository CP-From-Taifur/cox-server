import React, { useState, useRef } from 'react'
import ReactTable from '../../ReactTables/ReactTable';
import { voucherTableColumns } from '../../../utils/reactTableColumns';
import { getErrors, hasData, toastDefault } from '../../../utils/handler.utils';
import useGet from '../../../hooks/useGet';
import UiHandler from '../../UiHandler';
import { toast } from 'react-toastify';
import axiosInstance from '../../../common/axios';



function Voucher(props) {
    const packageId = props.match.params.id;
    const [uniqueState, setUniqueState] = useState(false)
    const [loadingPage, setLoadingPage] = useState(null)
    const [voucherCount, setVoucherCount] = useState(0)
    const [voucherData, loading, error] = useGet(`admin/packages/${packageId}/voucher`, '', uniqueState)

    const dataRef = useRef(null);

    const addVoucherHandler = (e) => {
        e.preventDefault()
        setLoadingPage(true)
        console.log(dataRef.current.value.split('\n'))
        axiosInstance.post(`/admin/packages/add-voucher`, {
            data: dataRef.current.value.split('\n'),
            package_id: packageId

        }).then(res => {
            toast.success('Voucher created successfully', toastDefault)
            dataRef.current.value = ''

            setUniqueState(!uniqueState)
        }).catch(err => {
            toast.error(getErrors(err, false, true), toastDefault)
            setLoadingPage(false)
        })
    }

    const onDataChange = () => {
        if(dataRef.current.value === '') {
            setVoucherCount(0)
            return;
        }
        setVoucherCount(dataRef.current.value.split('\n').length);
    }


    const deleteVoucher = (id) => {
        if (window.confirm('Are you sure')) {
            toast.promise(
                axiosInstance.get(`admin/packages/delete-voucher/${id}`),
                {
                    pending: 'Deleting voucher...',
                    error: {
                        render(err) {
                            console.log(err);
                            return getErrors(err.data, false, true)
                        }
                    },
                    success: {
                        render() {
                            setUniqueState(prev => !prev);
                            return 'Voucher deleted successfully'
                        }
                    }
                },
                toastDefault
            )
        }
    }

    const deleteall = () =>{
        selectedRowss.forEach((rowId) => {
            // Perform actions for each selected row
            toast.promise(
                axiosInstance.get(`admin/packages/delete-voucher/${rowId}`),
                {
                    pending: 'Deleting voucher...',
                    error: {
                        render(err) {
                            console.log(err);
                            return getErrors(err.data, false, true)
                        }
                    },
                    success: {
                        render() {
                            setUniqueState(prev => !prev);
                            return 'Voucher deleted successfully'
                        }
                    }
                },
                toastDefault
            )
        });
    }

    let editButton = {
        id: 'action',
        Header: "Action",
        accessor: 'id',
        Cell: (e) => {
            return <ul className="flex space-x-2">
                {/* <Link to={`/banner/edit/${e.value}`} className="cstm_btn_small">
                    Edit
                </Link> */}
                <button className="cstm_btn_small !bg-red-600 hover:!bg-red-700" type="button" onClick={() => deleteVoucher(e.vlue)}>
                    Delete
                </button>

            </ul>
        }
    };

    const [selectedRowss, setSelectedRowss] = useState([]);

    const handleCheckboxChange = (id) => {
      setSelectedRowss((prevSelectedRows) => {
        if (prevSelectedRows.includes(id)) {
          return prevSelectedRows.filter((rowId) => rowId !== id);
        } else {
          return [...prevSelectedRows, id];
        }
      });
    };

    let checkbox = {
        id: 'action',
        Header: "Action",
        accessor: 'id',
        Cell: (e) => {
            return <ul className="flex space-x-2">
                {/* <Link to={`/banner/edit/${e.value}`} className="cstm_btn_small">
                    Edit
                </Link> */}
                <input
                    type="checkbox"
                    checked={selectedRowss.includes(e.value)}
                    onChange={() => handleCheckboxChange(e.value)}
                />

            </ul>
        }
    }

    let withEditButton = [...voucherTableColumns, editButton]
    let withEditCheckbox = [...voucherTableColumns, checkbox]


    return (
        <section className="relative container_admin" >

            <div className="bg-white overflow-hidden rounded">
                <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap">
                    <h3 className="text-lg font-bold text-black">
                        Voucher
                    </h3>
                    {/* <Link className="cstm_btn" to="/banner/add">
                        Add new
                    </Link> */}

                   
                </div>

              

                <div className='p-2'>
                    <h3 className="text-lg font-bold text-black">
                        Product: {voucherData?.product?.name ?? 'Unkown'}
                    </h3>
                    <p>Package: {voucherData?.package.name}</p>
                </div>

       
                
                <div className='p-3'>
                    <form onSubmit={addVoucherHandler} >
                        <div>
                            <div className="form_grid">
                                <div>
                                    <label htmlFor="voucher_data">Voucher Data (Detect {voucherCount}) </label>
                                    <textarea onChange={onDataChange} ref={dataRef} id="voucher_data" className="form_input" placeholder="Voucher Data" required />
                                </div>
                            </div>


                            <div>
                                <button type="submit" className="cstm_btn w-full block">Add Voucher</button>
                            </div>
                        </div>
                    </form>
                </div>

                { selectedRowss.length > 0 && (
                    <button type="submit" className="cstm_btn mt-2 ml-5" onClick={deleteall}>DELETE ALL</button>
                )}
                    {/* Other content of your component */}
              

                <div>
                    <div className="relative min-h-[100px]">
                        <UiHandler data={voucherData?.vouchers} loading={loading} error={error} />
                        {hasData(voucherData?.vouchers, error) && (
                            <ReactTable tableId="banner_table" columns={withEditCheckbox} data={voucherData?.vouchers} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Voucher
