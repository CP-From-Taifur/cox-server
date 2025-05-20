import React, { useRef, useState } from 'react'
import { useHistory, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../common/axios';
import useGet from '../../hooks/useGet';
import useUpload from '../../hooks/useUpload';
import { getErrors, hasData, toastDefault } from '../../utils/handler.utils';
import Loader from '../Loader/Loader';
function EditNotice(props) {
    const history = useHistory()
    const noticeId = props.match.params.id;

    const [loading, setLoading] = useState(null)
    const [data, loadingData, error] = useGet(`admin/notice/${noticeId}`)
    const [noticeImage, setNoticeLogo] = useState(data?.image)
    const { path, uploading } = useUpload(noticeImage)

    // const title = useRef(null);
    const image = useRef(null);
    const link = useRef(null);
    const notice = useRef(null);
    const type = useRef(null);
    
    const is_active = useRef(null);

    console.log(data);

    const editPaymentMethodHandler = (e) => {
        e.preventDefault()
        setLoading(true)
        axiosInstance.post(`/admin/notice/update/${noticeId}`, {
            title: '',
            image: path || data?.image,
            link: link.current.value,
            notice: notice.current.value,
            for_home_modal: 1,
            type: type.current.value,
            is_active: is_active.current.checked ? 1 : 0,
        }).then(res => {
            toast.success('Notice updated successfully', toastDefault)

            setTimeout(() => {
                history.push('/notice')
            }, 1500);
        }).catch(err => {
            toast.error(getErrors(err, false, true), toastDefault)
            setLoading(false)
        })
    }

    return (
        <section className="relative container_admin" >
            <div className="bg-white overflow-hidden rounded">
                <div className="px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-black">
                        Edit notice
                    </h3>
                </div>
                <div className="py-10 px-4" >
                    <div className="w-full md:w-[70%] min-h-[300px] mx-auto py-6 relative border border-gray-200 px-4">
                        {loadingData && <Loader absolute />}
                        {loading && <Loader absolute />}
                        {
                            hasData(data, loading, error) && (
                                <form onSubmit={editPaymentMethodHandler} >
                                    <div>

                                        <div>
                                            <label htmlFor="image">Image</label>
                                            <input ref={image} id="image" className="form_input" type="file" onChange={e => setNoticeLogo(e.target.files[0])} />
                                        </div>

                                        <div>
                                            <label htmlFor="link">Link</label>
                                            <input ref={link} id="link" defaultValue={data?.link} className="form_input" type="text" placeholder="Link" />
                                        </div>
                                        <div>
                                            <label htmlFor="notice">Notice</label>
                                            <textarea required ref={notice} id="notice" className="form_input" type="text" placeholder="Notice" cols="30" rows="10" defaultValue={data?.notice}>

                                            </textarea>
                                        </div>

                                        <div>
                                            <label htmlFor="type">Notice Type</label>
                                            <select ref={type} defaultValue={data?.type} id="type" required className="form_input">
                                                <option value="popup">Popup</option>
                                                <option value="flat_page_top">Flat Page Top</option>
                                            </select>
                                        </div>
                                        
                                        <div className="cursor-pointer" >
                                            <input ref={is_active} id="is_active" defaultChecked={data?.is_active == 1} type="checkbox" className="mr-2" />
                                            <label htmlFor="is_active" className="select-none cursor-pointer">Is Active</label>
                                        </div>



                                        <div className="mt-4">
                                            <button type="submit" disabled={uploading} className="cstm_btn w-full block">Updated Notice</button>
                                        </div>
                                    </div>
                                </form>
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default withRouter(EditNotice)
