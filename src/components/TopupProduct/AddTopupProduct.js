import { convertToHTML } from "draft-convert";
import { EditorState } from "draft-js";
import React, { useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import useGet from "../../hooks/useGet";
import useUpload from "../../hooks/useUpload";
import { getErrors, hasData, toastDefault } from "../../utils/handler.utils";
import Loader from "../Loader/Loader";

function AddTopupProduct() {
  const name = useRef(null);
  const logo = useRef(null);
  const input_lavel = useRef(null);
  const input_placeholder = useRef(null);
  const type = useRef(null);
  const brand = useRef(null);
  const is_active_product = useRef(null);
  const sortOrder = useRef(null);
  const redeemLink = useRef(null);
  const videoLink = useRef(null);
  const video_label = useRef(null);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [productLogo, setProductLogo] = useState(null);
  const { path, uploading } = useUpload(productLogo);
  const [category] = useGet(`v1/get-categorys`);

  const [loading, setLoading] = useState(null);
  const history = useHistory();

  const createProductHandler = (e) => {
    e.preventDefault();

    if (!uploading) {
      setLoading(true);
      axiosInstance
        .post("/admin/topup-product/create", {
          name: name.current.value,
          logo: path,
          category_id: brand.current.value,
          input_lavel: input_lavel.current.value,
          input_placeholder: input_placeholder.current.value,
          topup_type: type.current.value,
          is_active: is_active_product.current.checked ? 1 : 0,
          sort_order: sortOrder.current.value,
          redeem_link: redeemLink.current.value,
          video_link: videoLink.current.value,
          video_label: video_label.current.value,
          rules: convertToHTML(editorState.getCurrentContent()),
        })
        .then((res) => {
          toast.success("Product created successfully", toastDefault);

          setTimeout(() => {
            history.push("/topup-product");
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
          <h3 className="text-lg font-bold text-black">Create new product</h3>
        </div>
        <div className="py-10 px-4">
          <div className="w-full md:w-[70%] mx-auto py-6 relative border border-gray-200 px-4">
            {loading && <Loader absolute />}
            <form onSubmit={createProductHandler}>
              <div>
                <div className="form_grid">
                  <div>
                    <label htmlFor="name">Name</label>
                    <input
                      ref={name}
                      id="name"
                      className="form_input"
                      type="text"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="logo">Logo</label>
                    <input
                      ref={logo}
                      id="logo"
                      className="form_input"
                      type="file"
                      required
                      onChange={(e) => setProductLogo(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="form_grid">
                  <div>
                    <label htmlFor="input_lavel">Input label</label>
                    <input
                      ref={input_lavel}
                      id="input_lavel"
                      className="form_input"
                      type="text"
                      placeholder="Enter input lavel"
                    />
                  </div>
                  <div>
                    <label htmlFor="input_placeholder">Input placeholder</label>
                    <input
                      ref={input_placeholder}
                      id="input_placeholder"
                      className="form_input"
                      type="text"
                      placeholder="Enter input placeholder"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="redeem_link">Redeem Link</label>
                  <input
                    ref={redeemLink}
                    id="redeem_link"
                    className="form_input"
                    type="text"
                    placeholder="Redeem Link"
                  />
                </div>
                <div className="form_grid">
                  <div>
                    <label htmlFor="video_link">Video Link</label>
                    <input
                      ref={videoLink}
                      id="video_link"
                      className="form_input"
                      type="text"
                      placeholder="Video Link"
                    />
                  </div>
                  <div>
                    <label htmlFor="video_label">Video Label</label>
                    <input
                      ref={video_label}
                      id="video_label"
                      className="form_input"
                      type="text"
                      placeholder="Video Label"
                    />
                  </div>
                </div>

                <div className="flex items-center w-full gap-4">
                  <div className="flex-1">
                    <label htmlFor="sort_order">Sort Order</label>
                    <input
                      ref={sortOrder}
                      id="sort_order"
                      className="form_input"
                      type="text"
                      placeholder="Name"
                      defaultValue={1}
                      required
                    />
                  </div>

                  <div class="w-full flex-1">
                    <select
                      ref={brand}
                      name="brand"
                      id="brand"
                      class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      {hasData(category) &&
                        category?.map((item) => (
                          <option value={item?.id}>{item?.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <Editor
                  editorState={editorState}
                  editorStyle={{
                    height: 300,
                  }}
                  wrapperStyle={{
                    border: "1px solid #dcdcf3",
                    borderRadius: 6,
                  }}
                  onEditorStateChange={(e) => setEditorState(e)}
                />

                <div className="my-2">
                  <div class="relative">
                    <select
                      ref={type}
                      id="type"
                      class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="in_game">In game</option>
                      <option value="id_code">ID Code</option>
                      <option value="voucher">Vouchers</option>
                    </select>
                  </div>
                </div>
                <div className="my-2">
                  <label className="py-2 inline-block cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      ref={is_active_product}
                      className="mr-2"
                    />
                    Is active product
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="cstm_btn w-full block"
                  >
                    Create Product
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

export default AddTopupProduct;
