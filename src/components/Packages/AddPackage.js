import { useRef, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import useGet from "../../hooks/useGet";
import useUpload from "../../hooks/useUpload";
import {
  getErrors,
  hasData,
  imgPath,
  toastDefault
} from "../../utils/handler.utils";
import Loader from "../Loader/Loader";

function AddPackage(props) {
  const history = useHistory();
  const productId = props.match.params.id;

  const [packageIcon, setPackageIcon] = useState(null);
  const { path, uploading } = useUpload(packageIcon);

  const [loading, setLoading] = useState(null);
  const [uniqueState] = useState(false);
  const [products, loadingProducts] = useGet(`admin/topup-products`);
  const [vouchers] = useGet(`admin/topup-packages/9`, "", uniqueState);

  const product_id = useRef(null);
  const name = useRef(null);
  const icon = useRef(null);
  const sell_price = useRef(null);
  const buy_price = useRef(null);
  const admin_com = useRef(null);
  const tag = useRef(null);
  const in_stock = useRef(null);
  const is_auto = useRef(null);
  const sortOrder = useRef(null);
  const voucher_id = useRef(null);
  const type = useRef(null);
  const bot_url = useRef(null);
  const code = useRef(null);
  const quantity = useRef(null);

  const handleRemoveImage = () => {
    setPackageIcon(null);
    if (icon.current) {
      icon.current.value = "";
    }
  };

  const addPackageHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(`/admin/topup-package/add`, {
        product_id: product_id.current.value,
        name: name.current.value,
        price: sell_price.current.value,
        buy_price: buy_price.current.value,
        admin_com: admin_com.current.value,
        tag: tag.current.value,
        icon: packageIcon ? path : null,
        type: type.current.value,
        sort_order: sortOrder.current.value,
        is_auto: is_auto.current.checked ? 1 : 0,
        voucher_id: voucher_id.current.value,
        in_stock: in_stock.current.checked ? 1 : 0,
        botUrl: bot_url.current.value,
        code: code.current.value,
        quantity: quantity.current.value,
      })
      .then((res) => {
        toast.success("Topup package created successfully", toastDefault);

        setTimeout(() => {
          history.push("/topup-packages");
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
          <h3 className="text-lg font-bold text-black">Add package</h3>
        </div>
        <div className="py-10 px-4">
          <div className="w-full md:w-[70%] min-h-[250px] mx-auto py-6 relative border border-gray-200 px-4">
            {loading || loadingProducts ? <Loader absolute /> : ""}
            {hasData(products) && (
              <form onSubmit={addPackageHandler}>
                <div>
                  <div className="form_grid">
                    <div>
                      <label htmlFor="name">Product</label>
                      <select
                        defaultValue={productId}
                        ref={product_id}
                        className="form_input"
                      >
                        {products?.map((product) => (
                          <option value={product.id}>{product.name}</option>
                        ))}
                      </select>
                    </div>
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
                  </div>
                  <div className="w-full">
                    <label htmlFor="icon">Icon</label>
                    <input
                      ref={icon}
                      id="Icon"
                      className="form_input w-full"
                      type="file"
                      onChange={(e) => setPackageIcon(e.target.files[0])}
                    />

<div className="mt-2">
  {packageIcon && (
    <div className="relative">
      <img
        src={imgPath(path)}
        alt="package icon"
        className="rounded-md w-24 h-20 object-contain" 
      />
      <button
        onClick={handleRemoveImage}
        className="absolute p-2 top-0 left-0 w-5 h-5 flex items-center justify-center bg-red-500 rounded-full text-white font-medium"
      >
        ×
      </button>
    </div>
  )}
</div>
                  </div>
                  <div className="form_grid">
                    <div>
                      <label htmlFor="sell_price">Sell price</label>
                      <input
                        ref={sell_price}
                        id="sell_price"
                        className="form_input"
                        type="number"
                        placeholder="Sell price"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="buy_price">Buy price</label>
                      <input
                        ref={buy_price}
                        id="buy_price"
                        className="form_input"
                        type="number"
                        placeholder="Buy price"
                        required
                      />
                    </div>
                  </div>

                  <div className="form_grid">
                    <div>
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

                    <div>
                      <label htmlFor="buy_price">admin_com</label>
                      <input
                        ref={admin_com}
                        id="admin_com"
                        className="form_input"
                        type="number"
                        placeholder="admin_com"
                        required
                      />
                    </div>
                  </div>
                  <div className="form_grid">
                    <div>
                      <label htmlFor="name">Voucher</label>
                      <select ref={voucher_id} className="form_input">
                        {vouchers?.map((voucher) => (
                          <option value={voucher.id}>{voucher.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="buy_price">Tag</label>
                      <input
                        ref={tag}
                        id="tag"
                        className="form_input"
                        type="number"
                        placeholder="tag"
                      />
                    </div>
                  </div>
                      <div className="form_grid">  
                   <div>
                      <label htmlFor="buy_price">Code</label>
                      <input
                        ref={code}
                        id="code"
                        className="form_input"
                        type="text"
                        placeholder="Code"
                      />
                    </div>
                   <div>

                    

                      <label htmlFor="buy_price">Bot URL</label>
                      <input
                        ref={bot_url}
                        id="bot_url"
                        className="form_input"
                        type="text"
                        placeholder="Bot URL"
                      />
                    </div>
                    </div>

                          <div>
                      <label htmlFor="buy_price">Quantity</label>
                      <input
                        ref={quantity}
                        id="quantity"
                        className="form_input"
                        type="number"
                        placeholder="quantity"
                      />
                    </div>

                  <div className="my-2">
                    <div class="relative">
                      <select
                        ref={type}
                        id="type"
                        class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option>Select Type</option>
                        <option value="25D">25D</option>
                        <option value="50D">50D</option>
                        <option value="115D">115D</option>
                        <option value="240D">240D</option>
                        <option value="610D">610D</option>
                        <option value="1240D">1240D</option>
                        <option value="2530D">2530D</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Level_Up_Pass">Level Up Pass</option>
                        <option value="2000_UC_CODE">2000 UC CODE</option>
                      </select>
                    </div>
                  </div>

                  <div className="form_grid">
                    <div>
                      <label class="inline-flex items-center">
                        <input
                          ref={in_stock}
                          id="in_stock"
                          value="1"
                          className="form-checkbox"
                          type="checkbox"
                        />
                        <span class="ml-2">In Stock</span>
                      </label>
                    </div>

                    <div>
                      <label class="inline-flex items-center">
                        <input
                          ref={is_auto}
                          id="is_auto"
                          value="1"
                          className="form-checkbox"
                          type="checkbox"
                        />
                        <span class="ml-2">Is Auto</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      disabled={uploading || loading}
                      type="submit"
                      className="cstm_btn w-full block"
                    >
                      Add package
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

export default withRouter(AddPackage);
