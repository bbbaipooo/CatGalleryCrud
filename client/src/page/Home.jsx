import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const [auth, setAuth] = useState(false)
  // const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [cats, setCats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + `/verify`)
      .then(res => {
        console.log(res.data.Status)
        if (res.data.Status === "Success") {
          setAuth(true)
          setName(res.data.name)
        } else {
          setAuth(false)
          setMessage(res.data.Error)
        }
      })
      .then(err => console.log(err));

  })

  const handleDelete = () => {
    axios.get(process.env.REACT_APP_API_URL + `/logout`)
      .then(res => {
        location.reload(true);
      }).catch(err => console.log(err))
  }

  //Cats
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

  const deleteCat = (id) => {
    axios.delete(process.env.REACT_APP_API_URL + `/deleteCat/${id}` ).then((response) => {
        setCats(
            cats.filter((val) => {
                return val.id != id
            })
        )
    })
  }

  const filteredCats = cats.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className='max-w-screen select-none'>
      <div className='bg-[#ede3da] flex justify-between items-center h-[58px]  pr-3 pl-4 p-2'>
        <div className='flex items-center font-bold text-[#2a2822] '>Welcome {name}</div>
        {auth ?
            <div className="">
                <button onClick={handleDelete} className='bg-[#Fef6f5] hover:bg-slate-500 hover:text-white w-[85px] h-[38px] rounded-xl font-bold text-[#2a2822] shadow-md'>Logout</button>
            </div>
            :
            <div className=" ">
                <Link to="/login"><button className='bg-[#Fef6f5] hover:bg-slate-500 hover:text-white w-[85px] h-[38px] rounded-xl font-bold text-[#2a2822] shadow-md'>Login</button></Link>
            </div>
        }
      </div>
      <div className=" h-[480px] bg-[#d6b3dd] flex justify-center static shadow-lg">
        <div className='bg-lime-100 z-0 sm:w-[300px] w-[150px] sm:h-[300px] h-[150px] m-[78px] sm:mt-[98px] mt-[170px] sm:ml-[0px] ml-[30px] absolute rounded-full '></div>
        <div className='z-10 w-[280px]  lg:text-[120px] sm:text-[100px] text-[60px] font-bold flex justify-end items-center'><div className='text-right text-[#2a2822]'>Cat </div></div>
        <div className='flex items-center ml-3'>
          <img className='w-[450px] z-10' src="https://cdn.discordapp.com/attachments/887322828716781598/1210893235271237722/Pngtreeisolated_cat_on_white_background_9158356.png?ex=65ec3734&is=65d9c234&hm=d291bbe9bc90777ae2c9a8c3607d9e2b42553910ac5c71b17356033996aa2100&" alt="" />
        </div>
        <div className='z-10 lg:text-[110px] sm:text-[90px] text-[50px] text-[#2a2822] font-bold flex items-center'>Gallery</div>
      </div>
      {auth?
        <div>
          {/* Click Add Cat */}
          <div className='flex justify-center items-center sm:h-[200px] h-[150px] mb-[50px] mt-10 bg-[#e4ecc9] m-7 rounded-[30px] '>
            <div>
              <Link to="/addcat"><button className='bg-yellow-500 hover:bg-yellow-600 shadow-lg  text-white sm:text-[25px] font-bold py-2 px-4 rounded-full sm:w-[450px] sm:h-[80px]'>add cat in gallery</button></Link>
            </div>
          </div>
          {/* Search Box */}
          <div className="flex justify-center mt-5">
            <input
              type="text"
              placeholder="Search Name Cats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block sm:w-[800px] h-[50px] rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset p-5 ring-[#ea9ce3] placeholder:text-[#b95eb2] focus:ring-2 focus:ring-inset focus:ring-[#ea9ce3] sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        :
        <div>
          {/* Click Get Started */}
          <div className='flex justify-center items-center sm:h-[200px] h-[150px] mb-[50px] mt-10 bg-[#e4e4e4] m-7 rounded-[30px] '>
            <div>
              <Link to="/login"><button className='bg-[#6fcfb5] hover:bg-[#5cb19a] shadow-lg  text-white sm:text-[25px] font-bold py-2 px-4 rounded-full sm:w-[470px] sm:h-[90px]'>Get Started </button></Link>
            </div>
          </div>
        </div>
      }
      {/* Read */}
      <div className='flex justify-center mt-5 '>
        <div className='grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 mb-10 mt-5'>
          {filteredCats.map((val, key) => {
            return (
              <div key={val.id} className='rounded-3xl shadow-lg'>
                <div className='sm:w-[340px] w-[250px] sm:h-[355px] h-[330px] rounded-3xl  relative  bg-[#d0cec7] '>
                  {/* bg-[#d0cec7] */}
                  <div className='flex justify-center'>
                    <img className='sm:w-[170px] w-[125px] sm:h-[170px] h-[125px] mt-5 z-20 rounded-full' src={`http://localhost:8800/images/`+val.image} alt="cat1" />
                  </div>
                  <div className='absolute top-[110px] z-0 bg-[#f4eedc] sm:w-[340px] w-[250px] rounded-3xl '>
                    <div className='sm:mt-[90px] mt-[70px]'>
                      <div className=' m-8 text-[20px] font-semibold text-[#2a2822]'>
                        <p className='pb-1 font-bold'>Name : {val.name}</p>
                        <p>Age : {val.age}</p>
                        <p>Gender : {val.gender}</p>
                        <p>Temperament : {val.temperament}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {auth?
                  <div>
                    <div className='sm:w-[340px] w-[250px] h-[90px] bg-slate-200 mt-[-18px]  rounded-b-3xl flex'>
                      <button onClick={() => deleteCat(val.id)}>
                        <div className='sm:w-[170px] w-[125px] h-[90px] bg-slate-400 hover:bg-slate-500 hover:text-white  rounded-bl-3xl flex items-center justify-center pt-3 font-bold text-lg text-[#2a2822]'>
                          Delete
                        </div>
                      </button>
                      <Link to={`/update/${val.id}`}>
                        <button>
                          <div className='sm:w-[170px] w-[125px] h-[90px] bg-slate-300 hover:bg-slate-500 hover:text-white rounded-br-3xl  flex items-center justify-center pt-3 font-bold text-lg text-[#2a2822]'>
                            Update
                          </div>
                        </button>
                      </Link>
                    </div>
                  </div>
                  :
                  <div></div>}
              </div>
            )
          })}
        </div>
      </div>
      <div className='flex justify-center bg-[#b6cfc8] rounded-t-full mt-5'>
          <img className='z-10 mt-2' src="https://cdn.discordapp.com/attachments/887322828716781598/1211261729510785054/cat_3.png?ex=65ed8e64&is=65db1964&hm=747e1cc36f935ed664a54723bb6cd06f383b7202c69df7bc824f813913547860&" alt="" />
      </div>
    </div>
  )
}

export default Home
