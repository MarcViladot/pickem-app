import {useEffect, useState} from 'react';

const useMobileView = () => {

    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobileView(true);
            } else {
                setIsMobileView(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    return [isMobileView]
};

export default useMobileView;
