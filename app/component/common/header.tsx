import {Link} from "@remix-run/react";
import {useRef} from "react";
import {getBaseUrl} from "~/utils/getBaseUrl";

const HeaderLayout = (props:{userName:string, title:string}) =>{
    const apiUrl = getBaseUrl();
    //로그아웃 API
    const logout = () => {
        fetch(`${apiUrl}/api/logout`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(async (res)=>{
                const data = await res.json()
                const response = data.state;
                if (response === 'Success'){
                    //로그인 페이지로 이동
                    location.reload();
                }else{
                    alert('로그아웃에 실패했습니다. 다시 시도해주세요.')
                    location.reload();
                }
            })
            .catch((err)=>{
                // console.log(err)
                alert('로그아웃에 실패했습니다. 다시 시도해주세요.')
                location.reload();
            })
    }

    const navRef = useRef<HTMLDivElement>(null);

    const openNav = () => {
        navRef.current?.classList.add('open');
    }

    const closeNav = () => {
        navRef.current?.classList.remove('open');
    }

    return  (
        <div>
            <div className="header main">
                <button className="btn-nav" onClick={openNav}>
                    <svg className="nav-bar" viewBox="0 0 448 512">
                        <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z">
                        </path>
                    </svg>
                </button>
                <h1>{props.title}</h1>
            </div>
            <div className="nav-wrap" ref={navRef}>
                <div className="nav-content-container">
                    <div className="nav-content title">
                        <span>Menu</span>
                    </div>
                    <div className="userInfo-container nav-content">
                        <svg className="header-icon"  viewBox="0 0 512 512">
                            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM164.1 325.5C158.3 318.8 148.2 318.1 141.5 323.9C134.8 329.7 134.1 339.8 139.9 346.5C162.1 372.1 200.9 400 255.1 400C311.1 400 349.8 372.1 372.1 346.5C377.9 339.8 377.2 329.7 370.5 323.9C363.8 318.1 353.7 318.8 347.9 325.5C329.9 346.2 299.4 368 255.1 368C212.6 368 182 346.2 164.1 325.5H164.1zM176.4 176C158.7 176 144.4 190.3 144.4 208C144.4 225.7 158.7 240 176.4 240C194 240 208.4 225.7 208.4 208C208.4 190.3 194 176 176.4 176zM300.8 233.6C318.4 210.1 353.6 210.1 371.2 233.6C376.5 240.7 386.5 242.1 393.6 236.8C400.7 231.5 402.1 221.5 396.8 214.4C366.4 173.9 305.6 173.9 275.2 214.4C269.9 221.5 271.3 231.5 278.4 236.8C285.5 242.1 295.5 240.7 300.8 233.6z">
                            </path>
                        </svg>
                        <span>{props.userName}</span>
                    </div>
                    <Link to="/room" className="nav-content">
                        <svg className="header-icon"  viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none">
                            </path>
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z">
                            </path>
                        </svg>
                        <span>메인</span>
                    </Link>
                    <Link to="/mypage" className="nav-content">
                        <svg className="header-icon"  viewBox="0 0 576 512">
                            <path d="M180.5 141.5C219.7 108.5 272.6 80 336 80C399.4 80 452.3 108.5 491.5 141.5C530.5 174.5 558.3 213.1 572.4 241.3C577.2 250.5 577.2 261.5 572.4 270.7C558.3 298 530.5 337.5 491.5 370.5C452.3 403.5 399.4 432 336 432C272.6 432 219.7 403.5 180.5 370.5C164.3 356.7 150 341.9 137.8 327.3L48.12 379.6C35.61 386.9 19.76 384.9 9.474 374.7C-.8133 364.5-2.97 348.7 4.216 336.1L50 256L4.216 175.9C-2.97 163.3-.8133 147.5 9.474 137.3C19.76 127.1 35.61 125.1 48.12 132.4L137.8 184.7C150 170.1 164.3 155.3 180.5 141.5L180.5 141.5zM416 224C398.3 224 384 238.3 384 256C384 273.7 398.3 288 416 288C433.7 288 448 273.7 448 256C448 238.3 433.7 224 416 224z">
                            </path>
                        </svg>
                        <span>마이페이지</span>
                    </Link>
                    <button onClick={logout} className="nav-content">
                        <svg className="header-icon" viewBox="0 0 24 24">
                            <path fill="none" d="M0 0h24v24H0z">
                            </path>
                            <path d="m3 8.41 9 9 7-7V15h2V7h-8v2h4.59L12 14.59 4.41 7 3 8.41z">
                            </path>
                        </svg>
                        <span>로그아웃</span>
                    </button>
                </div>
                <button className="btn-close" onClick={closeNav}>
                    <svg className="icon-close" viewBox="0 0 352 512">
                        <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default HeaderLayout;