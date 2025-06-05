import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();

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
          
          package_ids: values.package_ids.map((pkg) => pkg.actualValue),
        });
        toast.success("Mystery created successfully", toastDefault);
        resetForm();

        history.push("/mystery");
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
        actualValue: pkg.id, 
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
    
    // Always return all packages, regardless of what's already selected
    return allPackages
      .filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((option) => ({
        ...option,
      
        value: `${option.value}-${Date.now()}-${Math.random()}`,
        actualValue: option.actualValue, 
      }));
  };

  // Custom function to handle selection changes
  const handlePackageChange = (selectedOptions) => {
    // Each selection will have a unique value but same actualValue for duplicates
    const updatedOptions = selectedOptions ? selectedOptions.map((option, index) => ({
      ...option,
      // Ensure each selection has a truly unique identifier
      value: `${option.actualValue}-${Date.now()}-${index}-${Math.random()}`,
    })) : [];
    
    formik.setFieldValue("package_ids", updatedOptions);
  };

  // Custom component to display selected values with count
  const formatSelectedValues = () => {
    if (!formik.values.package_ids || formik.values.package_ids.length === 0) {
      return null;
    }

    // Group by actualValue to show counts
    const grouped = formik.values.package_ids.reduce((acc, pkg) => {
      const key = pkg.actualValue;
      if (!acc[key]) {
        acc[key] = {
          label: pkg.label,
          count: 0,
        };
      }
      acc[key].count++;
      return acc;
    }, {});

    return (
      <div className="mt-2 p-2 bg-gray-50 rounded">
        <small className="text-gray-600 font-medium">Selected Packages:</small>
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(grouped).map(([id, info]) => (
            <span
              key={id}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {info.label} {info.count > 1 && `(x${info.count})`}
            </span>
          ))}
        </div>
      </div>
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
              Select Packages (You can select the same package multiple times)
            </label>
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions={allPackages.map((option) => ({
                ...option,
                value: `${option.value}-${Date.now()}-${Math.random()}`,
                actualValue: option.value,
              }))}
              loadOptions={loadPackageOptions}
              value={formik.values.package_ids}
              onChange={handlePackageChange}
              onBlur={() => formik.setFieldTouched("package_ids", true)}
              className="basic-multi-select"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              isClearable
              placeholder="Search and select packages..."
              
              filterOption={() => true}
              isOptionDisabled={() => false}
             
              formatOptionLabel={(option) => (
                <div>
                  {option.label}
                  <small className="text-gray-500 ml-2">(can select multiple)</small>
                </div>
              )}
            />
            
            {/* Display selected packages with counts */}
            {formatSelectedValues()}
            
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