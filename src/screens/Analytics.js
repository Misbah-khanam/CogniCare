import React, {useEffect, useState} from 'react'
import Navbar from '../conponents/Navbar/Navbar'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './Analytics.css'
import Select from 'react-select'
import api from '../api/Api'

const Analytics = () => {

    const [members, setMembers] = useState([])
    const [memberName, setMemberName] = useState()

    const [options, setOptions] = useState()

    const fetchmembers = () => {
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
          let ret_members = []
          for(let i=0; i<response.data.members.length;i++){
            ret_members.push({value: response.data.members[i].name, label: response.data.members[i].name })
          }
          // console.log(ret_members)
          setMembers(ret_members)
        })
    }


    useEffect(() => {
        fetchmembers()
    },[])

    const dateConverter = (date) => {
      if (date === undefined) return "";
      const parsedDate = new Date(date);
      const formattedDate = parsedDate.toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const [month, day, year] = formattedDate.split('/');
      return `${day}/${month}/${year}`;
    };

    const fetchScores = (e) => {
      api.post(
        'score/get-member-score/',{
          "member_name":e.value
        },{
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': '{{ csrf_token }}',
          }
        }
      ).then(response => {
        // console.log(response.data)
        let categories = []
        let data = []
        for(let i=0;i<response.data.MemberScores.length;i++){
          categories.push(dateConverter(response.data.MemberScores[i].created_at))
          data.push(response.data.MemberScores[i].score)
        }
        let temp_options = {
          xAxis: {
              categories: categories,
          },
          title: {
            text: `${e.value}'s chart`
          },
          series: [{
            data: data
          }
        ]}
        
        setOptions(temp_options)
      })
    }

    
  return (
    <div>
        <Navbar/>
        <div className='graph-wrapper'>
            <Select
                options={members}
                className='member-select'
                onChange={(e) => {fetchScores(e)}}
            />
            
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    </div>
  )
}

export default Analytics