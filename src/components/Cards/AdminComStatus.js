import React, { useRef,useState,useEffect } from 'react';
import axios from "axios";
import { hasData } from "../../utils/handler.utils";
import { comUsedByAdminsTableColumns } from "../../utils/reactTableColumns";
import ReactTable from '../ReactTables/ReactTable';
import UiHandler from "../UiHandler";
import { getLocal, getSession } from "../../utils/localStorage.utils";
const token = getLocal('token') || getSession('token')

export default function CardSocialTraffic() {
    const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);
  const date = useRef(new Date());
  const enddate = useRef(new Date());
  useEffect(() => {
    setLoading(true);
    axios({
			baseURL: process.env.REACT_APP_API_ENDPOINT,
			timeout: 10000,
			headers: {
			  authorization: token
			},
			method: "GET",
			url: '/admin/com-by-admin/'+new Date().toISOString().slice(0, 10)+'/'+new Date().toISOString().slice(0, 10)
		  }).then((res) => {
			const dataa = res.data.data || res.data
			setData(dataa);
			setLoading(false);
		  })
			.catch((err) => {
			  setError(err);
			  setLoading(false);
			});
  }, []);

  const addPackageHandler = (e) => {
		setLoading(true);
    setError(false);
    if(enddate.current.value==""){
      enddate.current.value=date.current.value
    }
    if(date.current.value==""){
      date.current.value=enddate.current.value
    }
    if(date.current.value=="" && enddate.current.value==""){
      date.current.value = new Date()
      enddate.current.value = new Date()
    }
		axios({
			baseURL: process.env.REACT_APP_API_ENDPOINT,
			timeout: 10000,
			headers: {
			  authorization: token
			},
			method: "GET",
			url: '/admin/com-by-admin/'+date.current.value+'/'+enddate.current.value
		  }).then((res) => {
			const dataa = res.data.data || res.data
			setData(dataa);
			setLoading(false);
		  })
			.catch((err) => {
        console.log(err)
			  setError(err);
			  setLoading(false);
			});
  }
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded">
        <div className="rounded-t mb-0 border-0">
          <div className="flex flex-wrap md:flex-nowrap justify-between w-full items-center">
            <div className="relative px-4 flex-shrink-0 pt-2">
			          <div className="relative w-full max-w-full flex flex-grow justify-end text-right">
                  <input onChange={addPackageHandler} ref={date} type='date' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'/>
                  <input onChange={addPackageHandler} ref={enddate} type='date' className='ml-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'/>
                </div>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <UiHandler absoluteLoader={true} data={data} loading={loading} error={error} />
          {hasData(data, loading, error) && <ReactTable tableId="completed_order_by_admin" data={data} columns={comUsedByAdminsTableColumns} />}
        </div>
      </div>
    </>
  );
}
