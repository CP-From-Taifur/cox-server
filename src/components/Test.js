import React from 'react'

import useGet from '../hooks/useGet'
import Handler from './UiHandler';

function Test() {
    const [data, loading, error] = useGet('admin/topup-package-permission/admin/1')
    return (
        <div className="w-[600px] h-[200px] mx-auto my-[80px] relative border border-gray-900">
            <Handler data={[]} loading={loading} error={error} />
        </div>
    )
}

export default Test
