import { useFormik } from "formik";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
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

function CreateMystery() {
  const [isLoading, setIsLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);

  useEffect(() => {
    loadAllPackages();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      package_ids: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);
        await axiosInstance.post("/admin/mystery/create", {
          name: values.name,
          package_ids: values.package_ids.map((pkg) => pkg.value),
        });
        toast.success("Mystery created successfully", toastDefault);
        resetForm();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to create mystery",
          toastDefault
        );
      } finally {
        setIsLoading(false);
      }
    },
  });


  const loadAllPackages = async () => {
    try {
      const response = await axiosInstance.get("/admin/voucher-packages");

      const options = response.data?.data?.map((pkg) => ({
        value: pkg.id,
        label: `${pkg.name} (${pkg.price})`,
      }));
      setAllPackages(options || []);
    } catch (error) {
      console.error("Error loading packages:", error);
    }
  };

  const loadPackageOptions = async (inputValue) => {
    if (allPackages.length === 0) {
      await loadAllPackages();
    }

    return allPackages.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  return (
    <div className="md:px-5">
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-5">Create Mystery Box</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="form_input w-full"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Packages
            </label>{" "}
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions={allPackages}
              loadOptions={loadPackageOptions}
              value={formik.values.package_ids}
              onChange={(value) => formik.setFieldValue("package_ids", value)}
              onBlur={() => formik.setFieldTouched("package_ids", true)}
              className="basic-multi-select"
              classNamePrefix="select"
            />
            {formik.touched.package_ids && formik.errors.package_ids && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.package_ids}
              </div>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="cstm_btn">
            {isLoading ? "Creating..." : "Create Mystery Box"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMystery;
