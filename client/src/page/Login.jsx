import React,{useState} from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    // axios.defaults.withCredentials=true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(import.meta.env.VITE_REACT_APP_API_URL + `/login`, values)
            .then(res => {
                if (res.data.Status === "Success") {
                    console.log(res)
                    navigate('/')
                } else {
                    alert(res.data.Error)
                }
            })
            .then(err => console.log(err));
    }
    return (
        <>
            <div className="flex h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 select-none">
                
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-[100px] w-auto"
                        src="https://cdn.discordapp.com/attachments/887322828716781598/1211023889073967214/black-cat_1.png?ex=65ecb0e2&is=65da3be2&hm=f8f1da639118ffbea4650c236855888687fcf816013821792106d85dab28614e&"
                        alt="Your Company"
                    />
                    <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-[#2a2822">
                        Log in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6" >
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={e => setValues({ ...values, email: e.target.value })}
                                    required
                                    className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset p-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#ea9ce3] sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                {/* <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div> */}
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={e => setValues({ ...values, password: e.target.value })}
                                    required
                                    className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset p-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#ea9ce3] sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-[#d886d1] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#ea9ce3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Log in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold leading-6 text-[#d886d1] hover:text-[#ea9ce3]">
                            Sign Up
                        </Link>
                    </p>
                </div>
                <Link to="/">
                    <div className=' mt-9 p-2 pl-6 pr-6 font-bold text-white bg-[#65c58f] hover:bg-[#82deaa] rounded-full shadow-md '><button>back to home page</button></div>
                </Link>
            </div>
            
        </>
    )
}

export default Login
