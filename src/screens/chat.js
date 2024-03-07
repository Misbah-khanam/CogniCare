import React, { useState, useEffect } from 'react'
import Navbar from '../conponents/Navbar/Navbar'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './chat.css'
import api from '../api/Api';
import {
    TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
    TEModalFooter,
} from "tw-elements-react";
import Select from 'react-select';
import languageOptions from '../data/languages.json'
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMicrophone, faPlay, faStop, faRefresh } from "@fortawesome/free-solid-svg-icons";

const Chat = () => {
    library.add(faMicrophone, faPlay, faStop, faRefresh)

    const [index, setIndex] = useState(0)
    const [answers, setAnswers] = useState([])
    const member = JSON.parse(localStorage.getItem("member"))
    const [msgModal, setMsgModal] = useState(false)
    const [msg, setMsg] = useState('')
    const [questions, setQuestions] = useState([])

    const [selectedLanguage, setSelectedLanguage] = useState('en-in');

    const handleChange = async(selectedOption) => {
        setSelectedLanguage(selectedOption.value);
        let translated_ques = [...questions]
        for(let i=0; i<questions.length; i++){
            const response = await api.post('score/translate/',{"text":questions[i],"target":selectedOption.value})
            console.log(response.data.translated)
            translated_ques[i] = response.data.translated
            setQuestions(translated_ques)
        }
    };

    const all_questions = [
        "How have you been feeling emotionally lately?",
        "What helps you feel calm when you're stressed?",
        "Are there things that make you feel anxious or worried?",
        "What activities do you enjoy that boost your mood?",
        "Do you have someone you trust to talk to about your feelings?",
        "How do you handle anger or frustration?",
        "What thoughts keep you awake at night?",
        "Have you experienced any recent changes in your life that have affected your emotions?",
        "How do you cope with loneliness?",
        "Can you think of a recent accomplishment that made you feel proud?",
        "What strategies do you use to manage negative thoughts?",
        "Do you feel supported by your friends and family?",
        "How do you deal with disappointment?",
        "Are there any self-care activities that you find particularly helpful?",
        "What's something you're looking forward to in the future?",
        "How do you recharge when you're feeling drained?",
        "Are there any hobbies or interests that bring you joy?",
        "Do you ever feel overwhelmed by your responsibilities?",
        "What do you do when you feel unsure about yourself or your decisions?",
        "How do you feel about your self-image and self-worth?",
        "Are there any past experiences that still affect your emotions today?",
        "What's something that always makes you smile?",
        "How do you express your emotions when you're feeling happy?",
        "Can you recall a time when you felt deeply loved and supported?",
        "How do you manage your time and prioritize tasks when feeling stressed?",
        "Do you have any fears or phobias that impact your daily life?",
        "What's your go-to method for relaxation when feeling tense?",
        "How do you navigate conflicts with others?",
        "Are there any goals or dreams you're currently pursuing?",
        "What role does gratitude play in your life?",
        "How do you handle setbacks or failures?",
        "What's your preferred way of dealing with difficult emotions?",
        "Do you feel fulfilled in your personal relationships?",
        "How do you cope with grief or loss?",
        "Can you identify any triggers that worsen your mood?",
        "How do you practice mindfulness or stay present in the moment?",
        "What's your perspective on seeking professional help for mental health?",
        "Do you find it easy to open up about your feelings?",
        "How do you maintain a positive attitude during tough times?",
        "What self-talk or affirmations do you use to boost your confidence?",
        "Are there any unresolved issues from your past that still bother you?",
        "How do you define success and happiness for yourself?",
        "What gives you a sense of purpose and meaning in life?",
        "How do you navigate social situations when feeling anxious?",
        "What boundaries do you set to protect your mental well-being?",
        "Can you recall a time when you felt truly content and at peace?",
        "How do you show compassion and kindness to yourself?",
        "What activities or environments help you feel grounded and centered?",
        "How do you balance work/school responsibilities with self-care?",
        "Are there any habits or routines that contribute to your overall well-being?"
    ];
    
    useEffect(() => {

        function getRandomQuestions(array, num) {
            const shuffled = array.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, num);
        }
        const randomQuestions = getRandomQuestions(all_questions, 5);
        setQuestions(randomQuestions)
    },[])

    // const translateText = async(text) => {
    //     const response = await api.post('score/translate/',{"text":text,"target":selectedLanguage})
    //     console.log(response.data.translated)
    //     return response.data.translated
    // }


    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const nextQues = () => {
        if ((transcript !== '' && transcript !== null && transcript !== undefined) || (answers[index] !== '' && answers[index] !== undefined && answers[index] !== null)) {
            let temp_answers = [...answers]
            if (temp_answers[index]) {
                if (transcript !== '') {
                    temp_answers[index] = transcript
                }
            } else {
                temp_answers.push(transcript)
            }
            setAnswers(temp_answers)
            if (index < questions.length - 1) {
                setIndex(index + 1)
                resetTranscript()
            }
        } else {
            console.log("answer this question to move further")
        }
        console.log(answers)
    }

    const prevQues = () => {

        let temp_answers = [...answers]
        if (temp_answers[index]) {
            if (transcript !== '') {
                temp_answers[index] = transcript
            }
        } else {
            if (transcript !== '') {
                temp_answers.push(transcript)
            }
        }
        setAnswers(temp_answers)
        if (index > 0) {
            setIndex(index - 1)
            resetTranscript()
        }

        console.log(answers)

    }

    const handleSubmit = () => {
        if (answers.length === 5) {
            setMsg("calculating Score....")
            setMsgModal(true)
            api.post(
                'score/calculate-score/', {
                member: member,
                answers: answers,
                userEmail: JSON.parse(localStorage.getItem("user"))[0].fields.email,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                }
            }
            ).then(response => {
                console.log(response.data)
                if(response.data.score){
                    let msg = ''
                    if(response.data.score >= 25){
                        msg = "Your mental health looks great! Continue enjoying life and try to help others who are struggling with their mental health."
                    }else{
                        msg = "You are going through a bad phase in life. But don't worry, bad times are not permanent. Try to seek help from a trained professional to improve your mental health."
                    }
                    setMsg(`your Score is:  ${response.data.score.toFixed(2).toString()} ${msg}` )
                }
            })
        }
    }

    return (
        <div>
            <Navbar />
            <div className='speech-wrapper'>
                <div className='speech-container'>
                    <Select
                        placeholder="Select Language"
                        onChange={handleChange}
                        options={Object.entries(languageOptions).map(([label, value]) => ({ label, value }))}
                    />
                    <p className='mt-4 ques-container font-bold'>{questions[index]}</p>
                    <FontAwesomeIcon icon="fa fa-microphone" className='text-8xl mt-16' style={{ color: listening ? 'red' : 'black' }} />
                    <p >Microphone: {listening ? 'on' : 'off'}</p>
                    <button onClick={() => {SpeechRecognition.startListening({ language: selectedLanguage })}}><FontAwesomeIcon icon='fa fa-play' className='text-3xl m-4' /></button>
                    <button onClick={SpeechRecognition.stopListening}><FontAwesomeIcon icon='fa fa-stop' className='text-3xl m-4' /></button>
                    <button onClick={resetTranscript}><FontAwesomeIcon icon='fa fa-refresh' className='text-3xl m-4' /></button>
                    <p>{transcript}</p>
                    <div className='flex justify-between mt-4 mb-4'>
                        <button onClick={() => { prevQues() }} className='ml-10 next-btn'>Prev</button>
                        <button onClick={() => { nextQues() }} className='mr-10 next-btn'>Next</button>
                    </div>
                </div>
                <div className='answer-container'>
                    <button className='submit-answers' onClick={() => { handleSubmit() }}>Submit</button>
                    <p className='font-bold'>Name: {member.name}</p>
                    {answers.map((ans, i) => {
                        return (
                            <p key={i} className='ans' >{ans}</p>
                        )
                    })}

                </div>
            </div>

            <TEModal show={msgModal} setShow={setMsgModal}>
                <TEModalDialog>
                    <TEModalContent>
                        <TEModalHeader>
                            <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                                Note
                            </h5>
                            <button
                                type="button"
                                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                onClick={() => setMsgModal(false)}
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
                            <div><p>{msg}</p></div>
                        </TEModalBody>
                        <TEModalFooter>
                            <TERipple rippleColor="light">

                                <button
                                    type="button"
                                    className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                    onClick={() => setMsgModal(false)}
                                >
                                    okay
                                </button>
                            </TERipple>
                        </TEModalFooter>
                    </TEModalContent>
                </TEModalDialog>
            </TEModal>
        </div>
    );
}

export default Chat