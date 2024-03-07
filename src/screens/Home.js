import React, {useState, useEffect} from 'react'
import Navbar from '../conponents/Navbar/Navbar'
import {
    TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
    TEModalFooter,
    TEInput,
    TESelect
} from "tw-elements-react";
import './Home.css'
import { useNavigate } from 'react-router-dom';
import api from '../api/Api';


const Home = () => {

    const [showModalAdd, setShowModalAdd] = useState(false);
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState()
    const [image, setImage] = useState()
    const [addedUsers, setAddedUsers] = useState(JSON.parse(localStorage.getItem('AddedUsers'))|| [])
    const navigate = useNavigate()

    const addMember = () => {
        // localStorage.setItem("AddedUsers",JSON.stringify([...addedUsers,{"name":name,"age":age,"gender":gender}]))
        // setAddedUsers(JSON.parse(localStorage.getItem('AddedUsers'))|| [])

        api.post('member/add-member/',{
          name: name,
          age: age,
          gender:gender,
          userEmail: JSON.parse(localStorage.getItem("user"))[0].fields.email
        },{
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': '{{ csrf_token }}',
          },
      }).then(response => {
        console.log(response.data)
        window.location.reload()
      }).catch(error => {
        console.log(error)
      })
    }

    const fetchInfo = () => {
      api.post(
        'member/get-member/',{
          organisation: JSON.parse(localStorage.getItem("user"))[0].fields.organisation
        },{
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': '{{ csrf_token }}',
          }
        }
      ).then(response => {
        console.log(response.data)
        setAddedUsers(response.data.members)
      })
    }

    const handleChat = (user) => {
      localStorage.setItem('member',JSON.stringify(user))
      navigate('/chat')
    }

    useEffect(() => {
      fetchInfo()
    },[])

    return (
    <div>
        <Navbar/>
        <div className='card-container'>
            {
                addedUsers.map((user) => {
                    return(
                        <div className='custom-card' onClick={() => {handleChat(user)}}>
                            <p className='card-content'>Name : {user.name}</p>
                            <p className='card-content'>Age : {user.age}</p>
                            <p className='card-content'>Gender : {user.gender}</p>
                        </div>
                    )
                })
            }
        </div>
        <div>
            <div>
                <button
                className='fixed bottom-10 right-10 bg-primary text-4xl rounded-full w-16 h-16 text-white shadow-[0_4px_9px_-4px_#3b71ca] hover:bg-primary-600 text-white pb-2'
                onClick={() => { setShowModalAdd(true) }}
                >+</button>
            </div>
        </div>

        <TEModal show={showModalAdd} setShow={setShowModalAdd}>
        <TEModalDialog>
          <TEModalContent>
            <TEModalHeader>
              <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                Add member
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                onClick={() => setShowModalAdd(false)}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </TEModalHeader>
            <TEModalBody>
              <div>
                {/* <div className="mb-3 w-96">
                  <input
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    type="file"
                    id="formFile"
                    onChange={(e) => { setImage(e.target.files) }}
                  />
                </div> */}
                <TEInput
                  type="text"
                  id="name"
                  label="Enter name"
                  onChange={(e) => { setName(e.target.value) }}
                  value={name}
                ></TEInput>
                <TEInput
                  type="text"
                  id="Age"
                  label="Enter Age"
                  className='mt-5'
                  onChange={(e) => { setAge(e.target.value) }}
                  value={age}
                ></TEInput>
                <TESelect
                  data={[{ text: "Female", value: "female" }, { text: "Male", value: "male" }, { text: "others", value: "others" }]}
                  placeholder="Select Gender"
                  className='mt-5'
                  onValueChange={(e) => { setGender(e.value) }}
                  value={gender}
                  preventFirstSelection
                />
                
              </div>
            </TEModalBody>
            <TEModalFooter>
              <TERipple rippleColor="light">

                <button
                  type="button"
                  className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  onClick={addMember}
                >
                  Add 
                </button>
              </TERipple>
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  )
}

export default Home