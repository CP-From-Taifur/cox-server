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
  const [rawPackageIds, setRawPackageIds] = useState([]); // Store the raw package IDs from API

  useEffect(() => {
    loadMysteryDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    loadAllPackages();
  }, []);

  // Load packages after both mystery details and all packages are loaded
  useEffect(() => {
    if (rawPackageIds.length > 0 && allPackages.length > 0) {
      loadSelectedPackages();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawPackageIds, allPackages]);

  const loadMysteryDetails = async () => {
    try {
      const response = await axiosInstance.get(`/admin/mystery/${id}`);
      const mystery = response.data.data;
      
      setInitialValues({
        name: mystery.name,
        package_ids: []
      });
      
      formik.setFieldValue("name", mystery.name);
      
      // Store raw package IDs (these might include duplicates)
      setRawPackageIds(mystery.package_ids || []);
      
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
        actualValue: pkg.id,
      }));
      setAllPackages(options || []);
    } catch (error) {
      toast.error("Failed to load packages", toastDefault);
    }
  };

  const loadSelectedPackages = () => {
    // Create selected packages array allowing duplicates
    const selectedPackages = rawPackageIds.map((packageId, index) => {
      const matchedPackage = allPackages.find(opt => opt.value === packageId);
      if (matchedPackage) {
        return {
          ...matchedPackage,
          value: `${matchedPackage.value}-${Date.now()}-${index}-${Math.random()}`,
          actualValue: matchedPackage.value,
        };
      }
      return {
        value: `${packageId}-${Date.now()}-${index}-${Math.random()}`,
        label: "Package not found",
        actualValue: packageId,
      };
    });
    
    formik.setFieldValue('package_ids', selectedPackages);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        await axiosInstance.put(`/admin/mystery/update/${id}`, {
          name: values.name,
          // Extract actual package IDs, preserving duplicates
          package_ids: values.package_ids.map((pkg) => pkg.actualValue),
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

  // Custom function to handle selection changes
  const handlePackageChange = (selectedOptions) => {
    const updatedOptions = selectedOptions ? selectedOptions.map((option, index) => ({
      ...option,
      // Ensure each selection has a unique identifier
      value: option.actualValue ? 
        `${option.actualValue}-${Date.now()}-${index}-${Math.random()}` : 
        `${option.value}-${Date.now()}-${index}-${Math.random()}`,
      actualValue: option.actualValue || option.value,
    })) : [];
    
    formik.setFieldValue("package_ids", updatedOptions);
  };

  // Get options with unique values to allow multiple selections
  const getOptionsWithUniqueValues = () => {
    return allPackages.map((option) => ({
      ...option,
      value: `${option.value}-${Date.now()}-${Math.random()}`,
      actualValue: option.value,
    }));
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
            Packages (You can select the same package multiple times)
          </label>
          <Select
            id="package_ids"
            isMulti
            options={getOptionsWithUniqueValues()}
            value={formik.values.package_ids}
            onChange={handlePackageChange}
            onBlur={() => formik.setFieldTouched("package_ids", true)}
            className={
              formik.touched.package_ids && formik.errors.package_ids
                ? "border-red-500"
                : ""
            }
            closeMenuOnSelect={false}
            isClearable
            placeholder="Search and select packages..."
            // Custom option rendering to show it's selectable multiple times
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