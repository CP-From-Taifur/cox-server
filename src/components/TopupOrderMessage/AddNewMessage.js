import { useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import { getErrors, toastDefault } from "../../utils/handler.utils";

import { useHistory } from 'react-router-dom';
import Loader from '../Loader/Loader';

function AddNewMessage() {
    const [loading, setLoading] = useState(null)

    const messageRef = useRef(null);
    const history = useHistory()

    const createMessageHandler = (e) => {

        e.preventDefault()
        setLoading(true)
        axiosInstance.post('/admin/topup-order-message/create', {
            message: messageRef.current.value,

        }).then(res => {
            toast.success('Admin created successfully', toastDefault)

            setTimeout(() => {
                history.push('/topup-order-message')
            }, 1500);
        }).catch(err => {
            toast.error(getErrors(err, false, true), toastDefault)
        }).finally(() => setLoading(false))

    }
   

    return (
        <div className="md:px-5" >
            <div className="bg-white py-5 mb-5 px-5">
            {loading && <Loader absolute />}
                <form onSubmit={createMessageHandler} >
                    <div>
                        <div className="form_grid">
                            <div>
                                <label htmlFor="first_name">Message</label>
                                <input ref={messageRef} id="message" className="form_input" type="text" placeholder="Message" required />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="cstm_btn w-full block">Create Admin</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddNewMessage