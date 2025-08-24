import { useState } from "react"
import { useRef } from "react"
import Loader from '../Loader/Loader';
import axiosInstance from "../../common/axios";
import { toast } from 'react-toastify';
import { getErrors, hasData, toastDefault } from '../../utils/handler.utils';



function SendSms() {

    const [sending, setSending] = useState(false)
    

    const messageRef = useRef(null)
    const userLimitRef = useRef(null)
    const walletUserRef = useRef(null)


    const onSubmit = (e) => {
        e.preventDefault()
        setSending(true)
        const message = messageRef.current.value?.trim()
        const limit = userLimitRef.current.value?.trim()
        const walletChecked = walletUserRef.current.checked

        axiosInstance.post('/admin/send-sms', {
            message,
            user_limit: limit,
            only_wallet_user: walletChecked
        }).then(res => {
            e.target.reset()
            setSending(false)
            toast.success(`Message is sending to the server..`, toastDefault)
        }).catch(err => {
            e.target.reset()
            setSending(false)
            toast.error(`Failed to send message`, toastDefault)
        })

        
    }        

    return (
        <section className="relative container_admin" >
            <div className="bg-gray-100 overflow-hidden rounded">
                <div className="px-6 py-3 border-b bg-white flex flex-wrap items-center">
                    <h3 className="text-lg font-bold text-black mb-4 md:mb-0">
                        Send Sms
                    </h3>
                </div>

                {/* User list for select */}
                <div className="w-[60%] p-3 mx-auto bg-white my-6 rounded-md overflow-hidden" >
                    <form onSubmit={onSubmit} class="w-full max-w-lg">
                    
                        {
                            sending && <Loader absolute={false} />
                        }
                    
                        {!sending &&  <div>
                            <div className="form_grid">
                                <div>
                                    <label class="md:w-2/3 block text-gray-500 font-bold">
                                        <input ref={walletUserRef} class="mr-2 leading-tight" type="checkbox" />
                                        <span class="text-sm">
                                            Only wallet user
                                        </span>
                                    </label>
                                </div>
                                <div>
                                    <div>
                                        <input ref={userLimitRef} className="form_input" type="number" placeholder="Number of Users" />
                                    </div>
                                </div>
                            </div>
                            <div className="form_gird">

                                <div>
                                    <div className="px-4 py-2 font-bold border-b border-gray-200" >
                                        Type Message
                                    </div>
                                    <div className="py-4 px-4">
                                        <textarea rows="6" ref={messageRef} className="w-full resize-none form_input !mb-0" placeholder="Sms message"></textarea>
                                    </div>
                                    {/* Footer Start */}
                                    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3" >
                                        <button className="cstm_btn_small" type="submit">Send</button>
                                    </div>
                                </div>

                            </div>
                        </div>}
                    </form>
                </div>
            </div>
        </section>
    )
}

export default SendSms
