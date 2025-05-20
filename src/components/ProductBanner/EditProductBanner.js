import React, { useRef, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../common/axios';
import useGet from '../../hooks/useGet';
import useUpload from '../../hooks/useUpload';
import { getErrors, hasData, toastDefault } from '../../utils/handler.utils';
import Loader from '../Loader/Loader';

function EditProductBanner(props) {
    const history = useHistory();
    const bannerId = props.match.params.id;

    const [loading, setLoading] = useState(null);
    const [data, loadingData, error] = useGet(`admin/get-single-product-banner/${bannerId}`);
    const [productData, productLoading, productError] = useGet(`admin/topup-products`);
    const [bannerImage, setBannerImage] = useState(data?.image);
    const [iconImage, setIconImage] = useState(data?.icon);
    const { path: bannerPath, uploading: bannerUploading } = useUpload(bannerImage);
    const { path: iconPath, uploading: iconUploading } = useUpload(iconImage);

    const title = useRef(null);
    const description = useRef(null);
    const productId = useRef(null);
    const status = useRef(null);

    const editProductBannerHandler = (e) => {
        e.preventDefault();
        setLoading(true);

        axiosInstance
            .put(`/admin/update-product-banner/${bannerId}`, {
                title: title.current.value,
                description: description.current.value,
                image: bannerPath || data?.image,
                icon: iconPath || data?.icon,
                product_id: productId.current.value,
                status: status.current.checked ? 1 : 0,
            })
            .then(() => {
                toast.success('Product banner updated successfully', toastDefault);

                setTimeout(() => {
                    history.push('/product-banner');
                }, 1500);
            })
            .catch((err) => {
                toast.error(getErrors(err, false, true), toastDefault);
                setLoading(false);
            });
    };

    return (
        <section className="relative container_admin">
            <div className="bg-white overflow-hidden rounded">
                <div className="px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-black">Edit Product Banner</h3>
                </div>
                <div className="py-10 px-4">
                    <div className="w-full md:w-[70%] min-h-[300px] mx-auto py-6 relative border border-gray-200 px-4">
                        {loadingData && <Loader absolute />}
                        {loading && <Loader absolute />}
                        {hasData(data, loading, error) && (
                            <form onSubmit={editProductBannerHandler}>
                                <div>
                                    <div>
                                        <label htmlFor="title">Title</label>
                                        <input
                                            ref={title}
                                            id="title"
                                            defaultValue={data?.title}
                                            className="form_input"
                                            type="text"
                                            placeholder="Title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            ref={description}
                                            id="description"
                                            defaultValue={data?.description}
                                            className="form_input"
                                            placeholder="Description"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label htmlFor="banner">Banner Image</label>
                                        <input
                                            id="banner"
                                            className="form_input"
                                            type="file"
                                            onChange={(e) => setBannerImage(e.target.files[0])}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="icon">Icon Image</label>
                                        <input
                                            id="icon"
                                            className="form_input"
                                            type="file"
                                            onChange={(e) => setIconImage(e.target.files[0])}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="product">Product</label>
                                        <select
                                            ref={productId}
                                            id="product"
                                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            required
                                        >
                                            {hasData(productData) &&
                                                productData.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                        selected={item.id === data?.product_id}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                        {productLoading && <p>Loading products...</p>}
                                        {productError && <p>Error loading products</p>}
                                    </div>

                                    <div className="cursor-pointer mt-2">
                                        <input
                                            ref={status}
                                            id="status"
                                            defaultChecked={data?.status === true}
                                            type="checkbox"
                                            className="mr-2"
                                        />
                                        <label
                                            htmlFor="status"
                                            className="select-none cursor-pointer"
                                        >
                                            Is Active
                                        </label>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            disabled={bannerUploading || iconUploading}
                                            className="cstm_btn w-full block"
                                        >
                                            Update Product Banner
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default withRouter(EditProductBanner);
