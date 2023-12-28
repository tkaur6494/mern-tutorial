import { getNotesList } from "./notesApi"
import {useState, useEffect} from "react"
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom"

const NotesList = () => {
    const navigate = useNavigate()
    const [notesList, setNotesList] = useState([])
    useEffect(()=>{
        getNotesList().then(data=>{
            setNotesList(data)
        }).catch(err=>console.log(err))
    },[])

    const formatDate = (date_string) => {
        return new Intl.DateTimeFormat("en-US", { month: "long", day:"2-digit" }).format(new Date(date_string))
    }
    
    const newNoteClick = () => {
        navigate("/dash/notes/new")
    }
    
    return (
        <>
         <h1>Notes List</h1>
        <div className="table__container">
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Created On</th>
                        <th>Updated On</th>
                        <th>Title</th>
                        <th>Owner</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        notesList.map(note=>{
                            return (
                                <tr key={note._id}>
                                    <td>{note.completed ? "Completed" : "Open"}</td>
                                    <td>{formatDate(note.createdAt)}</td>
                                    <td>{formatDate(note.updatedAt)}</td>
                                    <td>{note.title}</td>
                                    <td>{note.username}</td>
                                    <td><FontAwesomeIcon icon={faEdit}/></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
        <button className="create__button" onClick={newNoteClick}>Create new note</button>
        </>
       
    )
}

export default NotesList