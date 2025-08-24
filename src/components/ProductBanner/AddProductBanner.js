import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../common/axios';
import useGet from '../../hooks/useGet';
import useUpload from '../../hooks/useUpload';
import { getErrors, hasData, toastDefault } from '../../utils/handler.utils';
import Loader from '../Loader/Loader';

function AddProductBanner() {
    const title = useRef(null);
    const description = useRef(null);
    const image = useRef(null);
    const icon = useRef(null);
    const productId = useRef(null);
    const status = useRef(null);

    const [bannerImage, setBannerImage] = useState(null);
    const [iconImage, setIconImage] = useState(null);
    const { path: bannerPath, uploading: bannerUploading } = useUpload(bannerImage);
    const { path: iconPath, uploading: iconUploading } = useUpload(iconImage);

    const [uniqueState, setUniqueState] = useState(false);
    const [productData, productLoading, productError] = useGet(`admin/topup-products`, '', uniqueState);

    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const createProductBannerHandler = (e) => {
        e.preventDefault();

        if (!bannerUploading && !iconUploading) {
            setLoading(true);
            axiosInstance
                .post('admin/create-product-banner', {
                    title: title.current.value,
                    description: description.current.value,
                    image: bannerPath,
                    icon: iconPath,
                    product_id: productId.current.value,
                    status: status.current.checked ? 1 : 0,
                })
                .then(() => {
                    toast.success('Product banner created successfully', toastDefault);

                    setTimeout(() => {
                        history.push('/product-banner');
                    }, 1500);
                })
                .catch((err) => {
                    toast.error(getErrors(err, false, true), toastDefault);
                    setLoading(false);
                });
        }
    };

    return (
        <section className="relative container_admin">
            <div className="bg-white overflow-hidden rounded">
                <div className="px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-black">Create New Product Banner</h3>
                </div>
                <div className="py-10 px-4">
                    <div className="w-full md:w-[70%] mx-auto py-6 relative border border-gray-200 px-4">
                        {loading && <Loader absolute />}
                        <form onSubmit={createProductBannerHandler}>
                            <div>
                                <div>
                                    <label htmlFor="title">Title</label>
                                    <input
                                        ref={title}
                                        id="title"
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
                                        className="form_input"
                                        placeholder="Description"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="image">Banner Image</label>
                                    <input
                                        ref={image}
                                        id="image"
                                        className="form_input"
                                        type="file"
                                        onChange={(e) => setBannerImage(e.target.files[0])}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="icon">Icon Image</label>
                                    <input
                                        ref={icon}
                                        id="icon"
                                        className="form_input"
                                        type="file"
                                        required
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
                                            productData?.map((item) => (
                                                <option key={item.id} value={item.id}>
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
                                        type="checkbox"
                                        className="mr-2"
                                    />
                                    <label htmlFor="status" className="select-none cursor-pointer">
                                        Is Active
                                    </label>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={bannerUploading || iconUploading}
                                        className="cstm_btn w-full block"
                                    >
                                        Create Product Banner
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddProductBanner;
