import toast from "react-hot-toast";
import BottomMenu from "../menu/BottomMenu";
import TopMenu from "../menu/TopMenu";
import Main from "./MainPage";
import { useEffect } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";


function HomeMobile() {
    const { setUser } = useAuth()
  
    useEffect(() => {
        const handleUrlToken = async () => {
            // 1. Nou chèche paramèt yo nan URL la
            const params = new URLSearchParams(window.location.search);
            const tokenFromUrl = params.get('token');

            if (tokenFromUrl) {
                try {
                    localStorage.setItem('h_mizik_token', tokenFromUrl);


                    const { data } = await api.get('/users/me');
                    setUser(data.user);

                    toast.success('Koneksyon reyisi!');
                    window.history.replaceState({}, document.title, window.location.pathname);
                    // window.location.href = '/dashboard';
                } catch (error) {
                    console.error("Token an pa valid:", error);
                    // localStorage.removeItem('h_mizik_token');
                }
            }
        };

        handleUrlToken();
    }, []);
    
    return <>
        <TopMenu />
           
        <div className="h-[100vh] overflow-y-scroll ">
            <Main />
         
        </div>

        {/* <BottomMPlayerMobile /> */}
        <BottomMenu />
    </>

}
export default HomeMobile;