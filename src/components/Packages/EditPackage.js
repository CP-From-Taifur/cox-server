import { useEffect, useRef, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import useGet from "../../hooks/useGet";
import useUpload from "../../hooks/useUpload";
import {
  getErrors,
  hasData,
  imgPath,
  toastDefault,
} from "../../utils/handler.utils";
import Loader from "../Loader/Loader";
function EditPackage(props) {
  const history = useHistory();
  const packageId = props.match.params.id;
  const [uniqueState] = useState(false);
  const [loading, setLoading] = useState(null);
  const [imageState, setImageState] = useState({
    currentImage: null,
    previewUrl: null,
    isRemoved: false,
  });
  const [packageIcon, setPackageIcon] = useState(null);
  const { path, uploading } = useUpload(packageIcon);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [data, loadingData] = useGet(
    `admin/topup-package/${packageId}`,
    "",
    uniqueState
  );

  const [products, loadingProducts] = useGet(
    `admin/topup-products`,
    "",
    uniqueState
  );
 const [allPackages, loadPackages] = useGet(`admin/topup-packages`, "", uniqueState);

  const product_id = useRef(null);
  const name = useRef(null);
  const sell_price = useRef(null);
  const buy_price = useRef(null);
  const admin_com = useRef(null);
  const tag = useRef(null);
  const icon = useRef(null);
  const is_auto = useRef(null);
  const in_stock = useRef(null);
  const sortOrder = useRef(null);
  const packageIdsRef = useRef([]);
  
  const type = useRef(null);
  const bot_url = useRef(null);
  const code = useRef(null);

  const handleRemoveImage = () => {
    setImageState({
      currentImage: null,
      previewUrl: null,
      isRemoved: true,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPackageIcon(file);
    setImageState({
      isRemoved: false,
    });
  };

  useEffect(() => {
    if (data?.icon && !imageState.isRemoved) {
      setImageState({
        currentImage: null,
        previewUrl: data?.icon,
        isRemoved: false,
      });
    }
    if (path && !imageState.isRemoved) {
      setImageState({
        currentImage: null,
        previewUrl: path,
        isRemoved: false,
      });
    }
  }, [data?.icon, imageState.isRemoved, path]);

useEffect(() => {
  // Only run when allPackages and data are loaded
  if (allPackages && data?.package_ids) {
    // Find the packages that match the IDs
    const defaultSelected = data.package_ids
      .map(id => allPackages.find(pkg => pkg.id === id))
      .filter(Boolean);
    setSelectedPackages(defaultSelected);
    packageIdsRef.current = defaultSelected;
  }
}, [allPackages, data?.package_ids]);

  
  const loadPackageOptions = (inputValue) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter packages based on input
        const filtered = allPackages.filter(pkg =>
          pkg.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        
        // Return with unique values to allow multiple selection of same package
        const options = filtered.map(option => ({
          ...option,
          value: `${option.value}-${Date.now()}-${Math.random()}`,
          actualValue: option.value,
        }));
        
        resolve(options);
      }, 100); // Small delay to simulate async behavior
    });
  };
  

   const handlePackageChange = (selectedOptions) => {
    // Update the ref with selected values
    packageIdsRef.current = selectedOptions || [];
    // Update state for re-rendering
    setSelectedPackages(selectedOptions || []);
  };

  const editPackageHandler = (e) => {
    e.preventDefault();
    setLoading(true);

     const selectedPackageIds = packageIdsRef.current.map(pkg => pkg?.id);

    const formData = {
      product_id: product_id.current.value,
      name: name.current.value,
      icon: imageState.isRemoved ? "" : imageState.previewUrl,
      price: sell_price.current.value,
      buy_price: buy_price.current.value,
      admin_com: admin_com.current.value,
      tag: tag.current.value,
      type: type.current.value,
      sort_order: sortOrder.current.value,
      is_auto: is_auto.current.checked ? 1 : 0,
      package_ids: selectedPackageIds,
      in_stock: in_stock.current.checked ? 1 : 0,
      botUrl: bot_url.current.value,
      code: code.current.value,
    };
    axiosInstance
      .post(`/admin/topup-package/update/${packageId}`, formData)
      .then((res) => {
        toast.success("Topup package updated successfully", toastDefault);

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
          <h3 className="text-lg font-bold text-black">
            Edit topup package -- {data?.name}
          </h3>
        </div>
        <div className="py-10 px-4">
          <div className="w-full md:w-[70%] min-h-[250px] mx-auto py-6 relative border border-gray-200 px-4">
            {loadingData || loading || loadingProducts || loadPackages ? (
              <Loader absolute />
            ) : (
              ""
            )}
            {hasData(data) && hasData(products) && hasData(allPackages) && (
              <form onSubmit={editPackageHandler}>
                <div>
                  <div className="form_grid">
                    <div>
                      <label htmlFor="name">Product</label>
                      <select
                        defaultValue={data?.product_id}
                        ref={product_id}
                        className="form_input"
                      >
                        {products?.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="name">Name</label>
                      <input
                        ref={name}
                        id="name"
                        defaultValue={data?.name}
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
                      onChange={handleImageChange}
                    />

                    <div className="mt-2">
                      {!imageState.isRemoved && imageState.previewUrl && (
                        <div className="relative inline-block">
                          <img
                            src={imgPath(imageState.previewUrl)}
                            alt="package icon"
                            className="rounded-md w-24 h-20 object-contain"
                          />
                          <button
                            type="button"
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
                        step="any"
                        id="sell_price"
                        defaultValue={data?.price}
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
                        defaultValue={data?.buy_price}
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
                        defaultValue={data?.sort_order}
                        className="form_input"
                        type="text"
                        placeholder="Name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="sort_order">admin_com</label>
                      <input
                        ref={admin_com}
                        id="sort_order"
                        defaultValue={data?.admin_com}
                        className="form_input"
                        type="text"
                        placeholder="Name"
                        required
                      />
                    </div>
                  </div>

                       <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Packages (You can select the same package multiple times)
            </label>
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions={allPackages && allPackages.map((option) => ({
                ...option,
                value: `${option.value}-${Date.now()}-${Math.random()}`,
                actualValue: option.value,
              }))}
              loadOptions={loadPackageOptions}
              value={selectedPackages}
              onChange={handlePackageChange}
              className="basic-multi-select"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              isClearable
              placeholder="Search and select packages..."
              
              filterOption={() => true}
              isOptionDisabled={() => false}
             
              formatOptionLabel={(option) => (
                <div>
                  {option.name}
                  <small className="text-gray-500 ml-2">(can select multiple)</small>
                </div>
              )}
            />

            {/* Display selected packages */}
        {selectedPackages.length > 0 && (
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <small className="text-gray-600 font-medium">Selected Packages:</small>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedPackages.map((pkg, index) => (
                <span
                  key={pkg.value}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                >
                  {pkg.name}
                  <button
                    type="button"
                    onClick={() => {
                      const newPackages = selectedPackages.filter((_, i) => i !== index);
                      setSelectedPackages(newPackages);
                      packageIdsRef.current = newPackages;
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
                    </div>
                    <div>
                      <label htmlFor="sort_order">Tag</label>
                      <input
                        ref={tag}
                        id="sort_order"
                        defaultValue={data?.tag}
                        className="form_input"
                        type="text"
                        placeholder="Tag"
                      />
                    </div>

                  <div className="form_grid">
                    <div>
                      <label htmlFor="sort_order">Code</label>
                      <input
                        ref={code}
                        id="code"
                        defaultValue={data?.code}
                        className="form_input"
                        type="text"
                        placeholder="Code"
                      />
                    </div>
                    <div>
                      <label htmlFor="sort_order">Bot URL</label>
                      <input
                        ref={bot_url}
                        id="bot_url"
                        defaultValue={data?.botUrl}
                        className="form_input"
                        type="text"
                        placeholder="Bot URL"
                      />
                    </div>
                  </div>

                  <div className="my-2">
                    <div class="relative">
                      <select
                        ref={type}
                        id="type"
                        defaultValue={data?.type}
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
                      <label className="inline-flex items-center">
                        <input
                          ref={in_stock}
                          id="in_stock"
                          value="1"
                          className="form-checkbox"
                          type="checkbox"
                          defaultChecked={data?.in_stock == 1 ? true : false}
                        />
                        <span className="ml-2">In Stock</span>
                      </label>
                    </div>

                    <div>
                      <label className="inline-flex items-center">
                        <input
                          ref={is_auto}
                          id="is_auto"
                          value="1"
                          className="form-checkbox"
                          type="checkbox"
                          defaultChecked={data?.is_auto == 1 ? true : false}
                        />
                        <span className="ml-2">Is Auto</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      disabled={uploading || loading}
                      type="submit"
                      className="cstm_btn w-full block"
                    >
                      Edit package
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

export default withRouter(EditPackage);
