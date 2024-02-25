import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AddCat() {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        name: '',
        age: '',
        gender: '',
        temperament: '',
        image:''
    })

    const handleClick = (event) => {
        if (values.name !== '' && values.age !== '' && values.gender !== '' && values.temperament !== '' && values.image !== '') {
            event.preventDefault()
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("age", values.age);
            formData.append("gender", values.gender);
            formData.append("temperament", values.temperament);
            formData.append("image", values.image);

            axios.post(import.meta.env.VITE_REACT_APP_API_URL + `/createCat` , formData)
            .then((res)=>{
                console.log(res)
                navigate('/')
            }) 
            .catch(err => {
                console.log(err)
            })
        }
    }

    return (
        <div className='h-screen bg-[#f8f4ec] flex justify-center flex-col items-center select-none'>
            
            <div className='md:w-[600px] sm:w-[400px] w-[280px]'>
                <div className='mt-[10px]'>
                    <Link to="/"><button className='bg-yellow-500 w-[90px] h-[38px] text-white font-bold rounded-full'>back</button></Link>
                    <div className='flex justify-center'>
                        <h1 className='text-[30px] text-[#2a2822] font-bold'>Add Cat Data</h1>
                    </div>
                </div>
                <form  className="bg-white shadow-md rounded-[30px]  mt-3  p-8 pt-6 pb-5">
                    <div className='mb-3'>
                        <label htmlFor="name" className="block text-gray-600 text-sm font-bold mb-2">
                            Name:
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder='Enter name'
                            onChange={e => setValues({ ...values, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="age" className="block text-gray-600 text-sm font-bold mb-2">
                            Age:
                        </label>
                        <input
                            type="number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder='Enter age'
                            onChange={(e => setValues({ ...values, age: e.target.value }))}
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="gender" className="block text-gray-600 text-sm font-bold mb-2">
                            Gender:
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder='Enter gender'
                            required
                            onChange={(e => setValues({ ...values, gender: e.target.value }))}
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="temperament" className="block text-gray-600 text-sm font-bold mb-2">
                            Temperament
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder='Enter temperament'
                            onChange={(e => setValues({ ...values, temperament: e.target.value }))}
                            required
                        />
                    </div>
                    {/* photo */}
                    <div className="mt-5 mb-5 w-full ">
                        <input 
                            type="file" 
                            onChange={e=>setValues({ ...values, image: e.target.files[0] }) } 
                            required
                        />
                        {/* <button onClick={handleUpload} className='bg-green-500  text-white font-bold py-2 px-4 rounded'>Upload</button> */}
                    </div>
                    <div className='flex justify-end'>
                        <button onClick={handleClick} className='bg-green-500 w-[140px] h-[45px] text-white font-bold py-2 px-4 rounded-lg'>Add Cat</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCat
