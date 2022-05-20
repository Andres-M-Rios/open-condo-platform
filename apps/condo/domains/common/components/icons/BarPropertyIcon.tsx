import React from 'react'
import Icon from '@ant-design/icons'

const BarPropertyIconSVG: React.FC = () => {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.24382 8.12727C1.06427 7.79424 0.98109 7.41776 1.00361 7.04008C1.02613 6.6624 1.15346 6.29848 1.37131 5.98914C1.72732 5.46678 2.2041 5.03803 2.76118 4.73925L9.01143 1.48622C9.62576 1.16678 10.308 1 11.0004 1C11.6928 1 12.3751 1.16678 12.9894 1.48622L19.2388 4.74175C19.7959 5.04053 20.2727 5.46928 20.6287 5.99164C20.8465 6.30097 20.9739 6.6649 20.9964 7.04258C21.0189 7.42026 20.9357 7.79674 20.7562 8.12977C20.5629 8.49543 20.273 8.80105 19.918 9.01335C19.563 9.22565 19.1566 9.3365 18.743 9.33383H18.4997V15.9999H19.333C19.554 15.9999 19.7659 16.0877 19.9222 16.2439C20.0784 16.4002 20.1662 16.6121 20.1662 16.8331C20.1662 17.0541 20.0784 17.2661 19.9222 17.4223C19.7659 17.5786 19.554 17.6664 19.333 17.6664H2.66786C2.44686 17.6664 2.23492 17.5786 2.07865 17.4223C1.92239 17.2661 1.8346 17.0541 1.8346 16.8331C1.8346 16.6121 1.92239 16.4002 2.07865 16.2439C2.23492 16.0877 2.44686 15.9999 2.66786 15.9999H3.50111V9.33383H3.2578C2.8438 9.33641 2.43705 9.22526 2.0819 9.0125C1.72675 8.79973 1.43685 8.49352 1.24382 8.12727ZM5.16762 15.9999H7.66739V9.33383H5.16762V15.9999ZM9.33391 9.33383V15.9999H12.6669V9.33383H9.33391ZM16.8332 9.33383H14.3334V15.9999H16.8332V9.33383ZM2.72035 7.35485C2.77263 7.45124 2.85043 7.53138 2.94523 7.58649C3.04003 7.64161 3.14817 7.66957 3.2578 7.66732H18.743C18.8527 7.66957 18.9608 7.64161 19.0556 7.58649C19.1504 7.53138 19.2282 7.45124 19.2805 7.35485C19.3186 7.29115 19.337 7.21763 19.3334 7.14351C19.3299 7.06939 19.3045 6.99797 19.2605 6.93822C19.0586 6.63817 18.7873 6.39122 18.4697 6.21828L12.2203 2.96275C11.8437 2.76729 11.4256 2.66526 11.0013 2.66526C10.5769 2.66526 10.1588 2.76729 9.7822 2.96275L3.53278 6.21828C3.21529 6.39177 2.9441 6.63896 2.74201 6.93905C2.69793 6.99855 2.67236 7.06973 2.6685 7.14368C2.66465 7.21764 2.68268 7.29108 2.72035 7.35485Z" fill="currentColor" stroke="#82879F" strokeWidth="0.4"/>
            <path d="M19.9981 20.1666C19.9981 20.3876 19.9104 20.5995 19.7541 20.7558C19.5978 20.9121 19.3859 20.9998 19.1649 20.9998H2.83326C2.61226 20.9998 2.40032 20.9121 2.24406 20.7558C2.08779 20.5995 2 20.3876 2 20.1666C2 19.9456 2.08779 19.7337 2.24406 19.5774C2.40032 19.4211 2.61226 19.3333 2.83326 19.3333H19.1649C19.3859 19.3333 19.5978 19.4211 19.7541 19.5774C19.9104 19.7337 19.9981 19.9456 19.9981 20.1666Z" fill="currentColor" stroke="#82879F" strokeWidth="0.4"/>
        </svg>
    )
}

export const BarPropertyIcon: React.FC = (props) => {
    return (
        <Icon component={BarPropertyIconSVG} {...props}/>
    )
}
