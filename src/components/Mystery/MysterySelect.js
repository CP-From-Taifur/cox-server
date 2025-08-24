import { useEffect, useState } from "react";
import axiosInstance from "../../common/axios";

const MysterySelect = ({ orderId, onMysterySelect }) => {
  const [mysteries, setMysteries] = useState([]);
  const [selectedMystery, setSelectedMystery] = useState('');

  useEffect(() => {
    // Fetch mysteries when component mounts
    axiosInstance.get('/admin/mystery')
      .then(res => {
        setMysteries(res.data.data || []);
      })
      .catch(err => {
        console.error('Error fetching mysteries:', err);
      });
  }, []);

  const handleSubmit = () => {

    if (selectedMystery) {
      onMysterySelect(orderId, selectedMystery);
      setSelectedMystery("")
    }
  };

 return (
    <div className="flex flex-col space-y-2 min-w-[200px]">
      <select 
        className="form_input w-full py-1 px-2 text-sm"
        value={selectedMystery}
        onChange={(e) => setSelectedMystery(e.target.value)}
      >
        <option value="">Select Mystery Box</option>
        {mysteries.map(mystery => (
          <option key={mystery.id} value={mystery.id}>
            {`${mystery.name} (${mystery.count})`}
          </option>
        ))}
      </select>
      {selectedMystery && (
        <button 
          className="cstm_btn_small bg-green-500 hover:bg-green-600 w-full text-center text-sm"
          onClick={handleSubmit}
        >
          Apply Mystery Box
        </button>
      )}
    </div>
  );
};

export default MysterySelect;