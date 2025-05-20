import React, { useEffect } from 'react';
import './table-checkbox.scss';
function TableCheckbox({ indeterminate, className, onChange, ...props }, ref) {

    const defaultRef = React.useRef()
    const checkboxRef = ref || defaultRef

    useEffect(() => {
        if (indeterminate) {
            checkboxRef.current.indeterminate = true;
            checkboxRef.current.checked = false;
        } else {
            checkboxRef.current.indeterminate = false;
        }

        // handleChange(checkboxRef.current)
    }, [indeterminate]);

    return (
        <label className={`checkbox bounce ${className || ''}`}>
            <input
                type='checkbox'
                ref={checkboxRef}
                onChange={onChange && typeof onChange === 'function' ? onChange : undefined}
                {...props}
            />
            <div className='checkbox_icon_wrapper'>
                <svg viewBox='0 0 21 21' className='checked_svg'>
                    <polyline points='5 10.75 8.5 14.25 16 6'></polyline>
                </svg>

                <svg
                    viewBox='0 0 1024 1024'
                    strokeWidth={55}
                    className='indeterminate_svg'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        fill='#fff'
                        d='M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z'
                    ></path>
                </svg>
            </div>
        </label>
    );
}

export default React.forwardRef(TableCheckbox);