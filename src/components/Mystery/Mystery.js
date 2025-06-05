import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
import axiosInstance from "../../common/axios";
import { hasData, toastDefault } from "../../utils/handler.utils";
import Table from "../react-table/Table";

function PackageListModal({ isOpen, onClose, packages }) {
  const [packageDetails, setPackageDetails] = useState([]);

  useEffect(() => {
    if (packages && packages.length > 0) {
      loadPackageDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packages]);

  const loadPackageDetails = async () => {
    try {
      const response = await axiosInstance.get('/admin/topup-packages');
      const allPackages = response.data?.data || [];
      
      // Parse package IDs if they're stored as strings
      const packageIds = packages.map(id => parseInt(id));
      
      // Count occurrences of each package ID
      const packageCounts = packageIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});
      
      // Get unique package IDs and map them to package details with counts
      const uniquePackageIds = [...new Set(packageIds)];
      const filteredPackages = allPackages
        .filter(pkg => uniquePackageIds.includes(pkg.id))
        .map(pkg => ({
          ...pkg,
          count: packageCounts[pkg.id] || 1
        }));
        
      setPackageDetails(filteredPackages);
    } catch (error) {
      console.error('Error loading package details:', error);
      toast.error('Failed to load package details', toastDefault);
    }
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '600px',
      width: '90%'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel="Package Details Modal"
      ariaHideApp={false}
    >
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Package Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {packageDetails.length > 0 ? (
            packageDetails.map((pkg) => (
              <div key={pkg.id} className="border-b py-3 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{pkg.name}</h3>
                    {pkg.count > 1 && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {pkg.count}x
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Price: {pkg.price}</p>
                  {pkg.tag && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                      {pkg.tag}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No package details available</p>
          )}
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total Packages: {packages.length} 
              {packageDetails.length !== packages.length && 
                ` (${packageDetails.length} unique)`
              }
            </p>
            <p className="text-sm font-semibold text-gray-800">
              Total Price: {packageDetails.reduce((total, pkg) => {
                const price = parseFloat(pkg.price) || 0;
                return total + (price * pkg.count);
              }, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function SearchMystery({ addSearchParam, removeSearchParam }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        className="form_input"
        placeholder="Search by name..."
        onChange={(e) => {
          if (e.target.value) {
            addSearchParam('search', e.target.value);
          } else {
            removeSearchParam('search');
          }
        }}
      />
    </div>
  );
}

function Mystery() {
  const history = useHistory();
  const [totalDataCount, setTotalDataCount] = useState(null);
  const [allPackages, setAllPackages] = useState([]); // Store all packages for price calculation
  const reloadRefFunc = useRef(null);
  const [selectedRows, setSelectedRows] = useState({
    rowsId: {},
    selectedFlatRows: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);

  // Load all packages when component mounts
  useEffect(() => {
    loadAllPackages();
  }, []);

  const loadAllPackages = async () => {
    try {
      const response = await axiosInstance.get('/admin/topup-packages');
      const packages = response.data?.data || [];
      console.log('Loaded packages:', packages.length, packages); // Debug log
      setAllPackages(packages);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  // Helper function to calculate total price for a row
  const calculateTotalPrice = (packageIds) => {
    if (!packageIds || !Array.isArray(packageIds)) {
      return 0;
    }

    // If allPackages is not loaded yet, return 0
    if (allPackages.length === 0) {
      return 0;
    }

    console.log('Calculating price for package IDs:', packageIds); // Debug log
    console.log('Available packages:', allPackages.map(p => ({ id: p.id, price: p.price }))); // Debug log

    const total = packageIds.reduce((sum, packageId) => {
      const pkg = allPackages.find(p => p.id === parseInt(packageId));
      if (pkg && pkg.price) {
        // Handle price as string or number
        const price = parseFloat(pkg.price) || 0;
        console.log(`Package ${pkg.id} (${pkg.name}): ${price}`); // Debug log
        return sum + price;
      } else {
        console.log(`Package not found or no price for ID: ${packageId}`); // Debug log
      }
      return sum;
    }, 0);

    console.log('Total calculated price:', total); // Debug log
    return total;
  };

  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Count',
      accessor: 'count',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Packages',
      accessor: 'package_ids',
      Cell: ({ value, row }) => {
        if (!value) return '-';
        
        // Count unique packages for display
        const uniquePackageIds = [...new Set(value.map(id => parseInt(id)))];
        const totalPackages = value.length;
        const uniqueCount = uniquePackageIds.length;
        
        return (
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => {
              setSelectedPackages(value);
              setIsModalOpen(true);
            }}
          >
            {totalPackages === uniqueCount 
              ? `${totalPackages} packages`
              : `${totalPackages} packages (${uniqueCount} unique)`
            }
          </button>
        );
      }
    },
    {
       id: 'total_package_price',
      Header: 'Total Package Price',
      accessor: 'package_ids',
      Cell: ({ value }) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return <span className="text-gray-400">-</span>;
        }
        
        const totalPrice = calculateTotalPrice(value);
        
        // Show loading state if packages haven't loaded yet
        if (allPackages.length === 0) {
          return <span className="text-gray-400">Loading...</span>;
        }
        
        // Show 0 if no valid packages found
        if (totalPrice === 0) {
          return <span className="text-gray-400">$0.00</span>;
        }
        
        return (
          <span className="font-medium text-green-600">
            ${totalPrice.toFixed(2)}
          </span>
        );
      }
    },
    {
      id: 'edit',
      Header: 'Action',
      accessor: 'id',
      Cell: (e) => {
        return (
          <ul className="flex space-x-2">
            <li 
              className="cstm_btn_small"
              onClick={() => handleEdit(e.value)}
            >
              Edit
            </li>
            <li 
              className="cstm_btn_small bg-yellow-500 hover:bg-yellow-600"
              onClick={() => handleResetCount(e.value)}
            >
              Reset Count
            </li>
            <li 
              className="cstm_btn_small bg-red-500 hover:bg-red-600"
              onClick={() => handleDelete(e.value)}
            >
              Delete
            </li>
          </ul>
        );
      }
    }
  ];

  // Add this function inside the Mystery component
  const handleResetCount = async (id) => {
    try {
      await toast.promise(
        axiosInstance.put(`/admin/mystery/update/${id}`, {
          count: 0
        }),
        {
          pending: 'Resetting count...',
          success: {
            render() {
              if (reloadRefFunc.current) {
                reloadRefFunc.current();
              }
              return 'Count reset successfully';
            }
          },
          error: 'Failed to reset count'
        },
        toastDefault
      );
    } catch (error) {
      console.error('Reset count error:', error);
    }
  };

  const handleEdit = async (id) => {
    history.push(`/mystery/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/mystery/delete/${id}`);
      if (reloadRefFunc.current) {
        reloadRefFunc.current();
      }
      toast.success('Mystery deleted successfully', toastDefault);
    } catch (error) {
      toast.error('Failed to delete mystery', toastDefault);
    }
  };

  return (
    <div className="md:px-5">
      <div className="bg-white py-5 mb-5 px-5">
        <div className="flex justify-between items-center mb-4">
          <button
            className="cstm_btn"
            onClick={() => history.push('/mystery/add')}
          >
            Create Mystery Box
          </button>
        </div>
        <Table
          customGlobalSearch={({ addSearchParam, removeSearchParam }) => (
            <SearchMystery
              addSearchParam={addSearchParam}
              removeSearchParam={removeSearchParam}
            />
          )}
          reloadRefFunc={reloadRefFunc}
          tableTitle="Mystery Boxes"
          tableSubTitle={hasData(totalDataCount) && `Total result: ${totalDataCount}`}
          tableId="mystery_table"
          url="/admin/mystery"
          selectData={(res) => {
            if (res?.data?.count) {
              setTotalDataCount(res.data.count);
            }
            return res.data;
          }}
          columns={columns}
          isSelectableRow
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          disableGlobalSearch
        />
      </div>

      <PackageListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packages={selectedPackages}
      />
    </div>
  );
}

export default Mystery;