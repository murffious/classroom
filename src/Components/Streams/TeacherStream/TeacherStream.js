import React, { useEffect, useState } from "react";
import PrimaryButton from './../../Buttons/PrimaryButton'

import { OTPublisher, OTSubscriber, createSession } from "opentok-react";

import './TeacherStream.scss'
import Axios from "axios";
import SecondaryButton from "../../Buttons/SecondaryButton";

const TeacherStream = props => {
  const [streams, setStreams] = useState([]);
  const [publish,setPublish] = useState(false)
  const [lectures,setLectures] = useState([])
  const [selectedLecture,setSelectedLecture] = useState({})
  const [record,setRecord] = useState(false)
  const {session_id, token, course_id} = props;

  const sessionHelper = createSession({
    apiKey: process.env.REACT_APP_OPENTOK_API_KEY,
    sessionId: session_id,
    token: token,
    onStreamsUpdated: streams => {
      setStreams(streams);
    }
  });
  // let sessionHelper = {}

  useEffect(() => {
    
    getLectures()
    return () => {
      sessionHelper.disconnect();
    };
  }, []);

  const getLectures = async()=>{
    const lRes = await Axios.get(`/info/lectures/course/${course_id}`)
    setLectures(lRes.data)
  }

  const mappedStreams = streams.map(stream => {
    return (
      <OTSubscriber
        key={stream.id}
        session={sessionHelper.session}
        stream={stream}
      />
    );
  })

  const mappedLectures = lectures.filter((lecture)=>lecture.archive_id===null).map((lecture,i)=>{
    return(
      <SecondaryButton key={i} onClick={()=>setSelectedLecture(lecture)} isActive={selectedLecture===lecture}>
        Lecture {i+1}    
      </SecondaryButton>
    )
  })

  const startStream = async() => {
    
    if(Object.keys(selectedLecture).length===0){
      return alert("You must select a lecture to start streaming")
    }
    else{
      if(record){
        const startRecording = await Axios.post(`/archive/record/start`,{session_id, lecture_id:selectedLecture.lecture_id, description:selectedLecture.lecture_description})
      }
      setPublish(true)
    }

  }

  const stopStream = async() => {
    
    setPublish(false)
    const stopRecording = await Axios.post(`/archive/record/stop`,{lecture_id:selectedLecture.lecture_id})
  
  }


  return (
    <div className='teacherStream'>
    {publish
      ? <div> 
      <OTPublisher properties={{width: '100%', height: '58vh', name:'teacher'}} session={sessionHelper.session} />
      {mappedStreams}
      <PrimaryButton onClick={stopStream}>End Lecture</PrimaryButton>
      </div>
      : <div>
        {mappedLectures}
        {console.log(record)}
        <p>Check to record this lecture</p>
        <input type='checkbox' onChange={()=>setRecord(!record)} value={record}/>
        <PrimaryButton onClick={startStream}>Start Lecture</PrimaryButton>
      </div>
    }
    </div>
  );
};



export default TeacherStream;
