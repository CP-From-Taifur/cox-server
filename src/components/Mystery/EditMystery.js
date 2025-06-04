import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import axiosInstance from "../../common/axios";
import { toastDefault } from "../../utils/handler.utils";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  package_ids: Yup.array()
    .min(1, "At least one package must be selected")
    .required("Packages are required"),
});

function EditMystery() {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    package_ids: [],
  });
const [packages, setPackages] = useState([]); // Add this state

  useEffect(() => {
    loadMysteryDetails();
    loadAllPackages();
  }, [id]);

  const loadMysteryDetails = async () => {
  try {
    const response = await axiosInstance.get(`/admin/mystery/${id}`);
    const mystery = response.data.data;
    
    setInitialValues({
      name: mystery.name,
      package_ids: [] // We'll set this after packages load
    });
    
    formik.setValues({
      name: mystery.name,
      package_ids: [] // We'll set this after packages load
    });

    // Store package IDs for later use
    setPackages(mystery.package_ids);
    
  } catch (error) {
    toast.error("Failed to load mystery details", toastDefault);
    history.push("/mystery");
  }
};

 const loadAllPackages = async () => {
  try {
    const response = await axiosInstance.get("/admin/voucher-packages");
    const options = response.data?.data?.map((pkg) => ({
      value: pkg.id,
      label: `${pkg.name} (${pkg.price})`,
    }));
    setAllPackages(options || []);
    
    // Update selected packages with correct labels
    if (packages.length > 0) {
      const selectedPackages = packages.map(packageId => {
        const matchedPackage = options.find(opt => opt.value === packageId);
        return matchedPackage || { value: packageId, label: "Package not found" };
      });
      
      formik.setFieldValue('package_ids', selectedPackages);
    }
  } catch (error) {
    toast.error("Failed to load packages", toastDefault);
  }
};

  // Update useEffect to handle dependencies properly
useEffect(() => {
  loadMysteryDetails();
}, [id]); // Only depend on id

useEffect(() => {
  if (packages.length > 0) {
    loadAllPackages();
  }
}, [packages]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        await axiosInstance.put(`/admin/mystery/update/${id}`, {
          name: values.name,
          package_ids: values.package_ids.map((pkg) => pkg.value),
        });
        toast.success("Mystery updated successfully", toastDefault);
        history.push("/mystery");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update mystery",
          toastDefault
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Mystery Box</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={`form-input w-full ${
              formik.touched.name && formik.errors.name ? "border-red-500" : ""
            }`}
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="package_ids" className="block mb-2">
            Packages
          </label>
          <Select
            id="package_ids"
            isMulti
            options={allPackages}
            value={formik.values.package_ids}
            onChange={(value) => formik.setFieldValue("package_ids", value)}
            onBlur={() => formik.setFieldTouched("package_ids", true)}
            className={
              formik.touched.package_ids && formik.errors.package_ids
                ? "border-red-500"
                : ""
            }
          />
          {formik.touched.package_ids && formik.errors.package_ids && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.package_ids}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="cstm_btn"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Mystery Box"}
          </button>
          <button
            type="button"
            className="cstm_btn bg-red-400 hover:bg-red-500"
            onClick={() => history.push("/mystery")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMystery;