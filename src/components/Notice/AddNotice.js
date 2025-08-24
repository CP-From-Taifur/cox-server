import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../common/axios';
import useUpload from '../../hooks/useUpload';
import { getErrors, toastDefault } from '../../utils/handler.utils';
import Loader from '../Loader/Loader';

function AddNotice() {
    // const title = useRefnull);
    const image = useRef(null);
    const link = useRef(null);
    const notice = useRef(null);
    const is_active = useRef(null);
    const type = useRef(null);

    const [noticeLogo, setNoticeLogo] = useState(null)
    const { path, uploading } = useUpload(noticeLogo)

    const [loading, setLoading] = useState(null)
    const history = useHistory()

    const createPaymentMethodHandler = (e) => {
        e.preventDefault()

        if (!uploading) {
            setLoading(true)
            axiosInstance.post('/admin/notice/create', {
                title: '',
                image: path,
                link: link.current.value,
                notice: notice.current.value,
                for_home_modal: 1,
                type: type.current.value,
                is_active: is_active.current.checked ? 1 : 0,
            }).then(res => {
                toast.success('Notice created successfully', toastDefault)

                setTimeout(() => {
                    history.push('/notice')
                }, 1500);
            }).catch(err => {
                toast.error(getErrors(err, false, true), toastDefault)
                setLoading(false)
            })
        }
    }

    return (
        <section className="relative container_admin" >
            <div className="bg-white overflow-hidden rounded">
                <div className="px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-black">
                        Create new notice
                    </h3>
                </div>
                <div className="py-10 px-4" >
                    <div className="w-full md:w-[70%] mx-auto py-6 relative border border-gray-200 px-4">
                        {loading && <Loader absolute />}
                        <form onSubmit={createPaymentMethodHandler} >
                            <div>
                                {/* <div>
                                        <label htmlFor="title">Title</label>
                                        <input ref={title} id="title" className="form_input" type="text" placeholder="Title" required />
                                    </div> */}
                                <div>
                                    <label htmlFor="image">Image</label>
                                    <input ref={image} id="image" className="form_input" type="file" onChange={e => setNoticeLogo(e.target.files[0])} />
                                </div>


                                <div>
                                    <label htmlFor="link">Link</label>
                                    <input ref={link} id="link" className="form_input" type="text" placeholder="Link" />
                                </div>
                                <div>
                                    <label htmlFor="notice">Notice</label>
                                    <textarea required ref={notice} id="notice" className="form_input" placeholder="Notice" cols="30" rows="10"></textarea>
                                </div>

                                <div>
                                    <label htmlFor="type">Notice Type</label>
                                    <select ref={type} defaultValue="popup" id="type" required className="form_input">
                                        <option value="popup">Popup</option>
                                        <option value="flat_page_top">Flat Page Top</option>
                                    </select>
                                </div>
                                

                                <div className="cursor-pointer" >
                                    <input ref={is_active} id="is_active" type="checkbox" className="mr-2" />
                                    <label htmlFor="is_active" className="select-none cursor-pointer">Is Active</label>
                                </div>



                                <div className="mt-4">
                                    <button type="submit" disabled={uploading} className="cstm_btn w-full block">Create Notice</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AddNotice
