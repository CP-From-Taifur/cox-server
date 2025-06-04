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
      const filteredPackages = allPackages.filter(pkg => packageIds.includes(pkg.id));
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
      maxWidth: '500px',
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
      ariaHideApp={false} // Add this line to prevent the modal warning
    >
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Package Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {packageDetails.length > 0 ? (
            packageDetails.map((pkg) => (
              <div key={pkg.id} className="border-b py-2">
                <h3 className="font-medium">{pkg.name}</h3>
                <p className="text-sm text-gray-600">Price: {pkg.price}</p>
                {pkg.tag && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {pkg.tag}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No package details available</p>
          )}
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
  const reloadRefFunc = useRef(null);
  const [selectedRows, setSelectedRows] = useState({
    rowsId: {},
    selectedFlatRows: [],
  });

   const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);


  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
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
        return (
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => {
              setSelectedPackages(value);
              setIsModalOpen(true);
            }}
          >
            {value.length} packages
          </button>
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