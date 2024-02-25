import React, { useState,useEffect } from 'react'
import axios from 'axios'
import {  useLocation,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function UpdateCat() {
    const location = useLocation()
    const catId = location.pathname.split("/")[2]
    const [cats, setCats] = useState([])
    // const navigate=useNavigate()

    const [values, setValues] = useState({
        name: '',
        age: '',
        gender: '',
        temperament: '',
        image:''
    })

    useEffect(() => {
      const getCats = async () => {
        try {
          const res = await axios.get(process.env.REACT_APP_API_URL + `/cats`);
          setCats(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getCats();
    }, []);

    const handleClick = (event) => {
      if (values.name !== '' && values.age !== '' && values.gender !== '' && values.temperament !== '' && values.image !== '') {
        event.preventDefault()
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("age", values.age);
        formData.append("gender", values.gender);
        formData.append("temperament", values.temperament);
        formData.append("image", values.image);

        axios.put(process.env.REACT_APP_API_URL + `/updateCat/${catId}`, formData)
        .then((res)=>{
            console.log(res)
            // navigate('/')
        }) 
        .catch(err => {
            console.log(err)
        })
      }
    }
 
  return (
    <div className='md:h-screen bg-[#f8f4ec] flex lg:flex-row flex-col justify-center items-center gap-[70px] select-none'>
      <div className=' flex justify-center flex-col items-center'>
        <div className='md:w-[600px]  sm:w-[400px] w-[280px] sm:mt-0 mt-4'>
            <div className='mt-[10px]'>
                <Link to="/"><button className='bg-yellow-500 w-[90px] h-[38px] text-white font-bold rounded-full sm:mb-0 mb-2'>back</button></Link>
                <div className='flex justify-center'>
                    <h1 className='text-[30px] text-[#2a2822] font-bold'>Update Cat Data</h1>
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
                </div>
                <div className='flex justify-end'>
                    <button onClick={handleClick} className='bg-green-500 w-[140px] h-[45px] text-white font-bold py-2 px-4 rounded-lg'>Update</button>
                </div>
            </form>
        </div>
      </div>
      <div className=''>
        {cats.map((val, key) => {
              if (val.id == catId) 
              return (
                <div key={val.id}>
                  <div className='sm:w-[340px] w-[280px] h-[355px] rounded-3xl  relative  bg-[#e6dfc5] sm:mb-0 mb-10'>
                    <div className='flex justify-center'>
                      <img className='w-[170px] h-[170px] mt-5 z-20 rounded-full' src={`http://localhost:8800/images/`+val.image} alt="cat1" />
                    </div>
                    <div className='absolute top-[110px] z-0 bg-[#7b735d] sm:w-[340px] w-[280px] pb-3 rounded-3xl '>
                      <div className='mt-[95px] '>
                        <div className=' m-8 text-[20px] font-semibold text-white'>
                          <p className='pb-1 font-bold'>Name : {val.name}</p>
                          <p>Age : {val.age}</p>
                          <p>Gender : {val.gender}</p>
                          <p>Temperament : {val.temperament}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

export default UpdateCat
