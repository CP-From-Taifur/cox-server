import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../common/axios';
import useGet from '../../hooks/useGet';
import { getErrors, hasData, toastDefault } from '../../utils/handler.utils';
import { productBannerTableColumns } from '../../utils/reactTableColumns';
import ReactTable from '../ReactTables/ReactTable';
import UiHandler from '../UiHandler';

function ProductBanner() {
    const [uniqueState, setUniqueState] = useState(false);
    const [productBannerData, loading, error] = useGet(`admin/get-all-product-banners`, '', uniqueState);



    const deleteProductBannerHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product banner?')) {
            toast.promise(
                axiosInstance.delete(`admin/delete-product-banner/${id}`),
                {
                    pending: 'Deleting product banner...',
                    error: {
                        render(err) {
                            console.log(err);
                            return getErrors(err.data, false, true);
                        },
                    },
                    success: {
                        render() {
                            setUniqueState((prev) => !prev);
                            return 'Product banner deleted successfully';
                        },
                    },
                },
                toastDefault
            );
        }
    };

    let editButton = {
        id: 'action',
        Header: 'Action',
        accessor: 'id',
        Cell: (e) => {
            return (
                <ul className="flex space-x-2">
                    <Link to={`/product-banner/edit/${e.value}`} className="cstm_btn_small">
                        Edit
                    </Link>
                    <button
                        className="cstm_btn_small !bg-red-600 hover:!bg-red-700"
                        type="button"
                        onClick={() => deleteProductBannerHandler(e.value)}
                    >
                        Delete
                    </button>
                </ul>
            );
        },
    };

    let withEditButton = [...productBannerTableColumns, editButton];

    return (
        <section className="relative container_admin">
            <div className="bg-white overflow-hidden rounded">
                <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap">
                    <h3 className="text-lg font-bold text-black">Product Banners</h3>
                    <Link className="cstm_btn" to="/product-banner/add">
                        Add New
                    </Link>
                </div>
                <div>
                    <div className="relative min-h-[100px]">
                        <UiHandler data={productBannerData} loading={loading} error={error} />
                        {hasData(productBannerData, error) && (
                            <ReactTable
                                tableId="product_banner_table"
                                columns={withEditButton}
                                data={productBannerData}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductBanner;
