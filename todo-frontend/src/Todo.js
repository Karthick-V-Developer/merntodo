import { useEffect,useState} from 'react'
export default function Todo(){
    const[title,setTitle]=useState("")
    const[description,setDescription]=useState("")
    const [todos,setTodos]=useState([])
    const[error,setError]=useState("");
    const[message,setMessage]=useState("");
    const[editId,seteditId]=useState("-1");
    const[editTitle,seteditTitle]=useState("")
    const[editDescription,setEditDescription]=useState("")
    const apiUrl="http://localhost:8000"
    const handlesubmit=()=>{
        setError("")
        if (title.trim()!=='' && description.trim()!==''){
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'

                },
                body:JSON .stringify({title,description})
            }).then((res)=>{
                if (res.ok){
                    setTodos([...todos,{title,description}])
                    setTitle("")
                    setDescription("")
                    setMessage("Item added successfully")
                    setTimeout(()=>{
                        setMessage("");

                    },3000)
                }else{
                    setError("Unable to create Todo item")

                }

            }).catch(()=>{
                setError("Unable to create Todo item")

            })
          
            

        }


    }
    useEffect(()=>{
        getItems()
    },[])
    const getItems=()=>{
        fetch(apiUrl+"/todos")
        .then((res)=> res.json())
        .then((res)=>{
            setTodos(res)
        })
    }
    const handleEdit=(item)=>{
        seteditId(item._id);
         seteditTitle(item.title);
         setEditDescription(item.description);
    }
    const handleUpdate=()=>{
        setError("")
        if (editTitle.trim()!=='' && editDescription.trim()!==''){
            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'

                },
                body:JSON .stringify({title:editTitle,description:editDescription})
            }).then((res)=>{
                if (res.ok){
                    const updatedTodos=todos.map((item)=>{
                        if(item._id==editId){
                            item.title=editTitle;
                            item.description=editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos)
                    seteditTitle("")
                    setEditDescription("")
                    setMessage("Item updated successfully")
                    setTimeout(()=>{
                        setMessage("");

                    },3000)
                    seteditId(-1)
                }else{
                    setError("Unable to create Todo item")

                }

            }).catch(()=>{
                setError("Unable to create Todo item")

            })
          
            

        }


    }
    const handleEditCancel=()=>{
        seteditId(-1)
    }
    const handleDelete=(id)=>{
        if(window.confirm('Are you sure ypu want to delete?')){
            fetch(apiUrl+'/todos/'+id,{
                method:"DELETE"
            }).then(()=>{
                const updatedTodos=todos.filter((item)=>item._id!==id)
                setTodos(updatedTodos)
            })
        }

    }
    return <><div className="row p-3 bg-success text-light">
    <div className="col-12 text-center">
      <h1>ToDo Project with MERN stack</h1>
    </div>
  </div>
  
    <div className="row">
        <h3>Add Item</h3>
       {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
        <input className="form-control" placeholder="Title" onChange={(e)=> setTitle(e.target.value)} value={title} type="text"></input>
        <input className="form-control" placeholder="Description"  onChange={(e)=> setDescription(e.target.value)} value = {description} type="text"></input>
        <button className="btn btn-dark" onClick={handlesubmit}>Submit</button>
        </div>
        {error && <p className='text-danger'>{error}</p>}

    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
        <ul className="list-group">
    {
        todos.map((item, index) =>
            <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2" key={index}>
        
        <div className="d-flex flex-column me-2">
            {
                editId==-1||editId!== item._id?<>
            
        <span className="fw-bold">{item.title}</span>
        <span>{item.description}</span>
        </>:<>
        <div>
        <div className="form-group d-flex gap-2">
        <input className="form-control" placeholder="Title" onChange={(e)=> seteditTitle(e.target.value)} value={editTitle} type="text"></input>
        <input className="form-control" placeholder="Description"  onChange={(e)=> setEditDescription(e.target.value)} value = {editDescription} type="text"></input>

        </div>
            
        </div>
        </>
}

        </div>
        
        <div className="d-flex gap-2">
        {editId==-1?<button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>:<button className="btn btn-warning"onClick={handleUpdate}>Update</button>}
        {editId==-1? <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>:
        <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}


        </div>
        
    </li>
    )
    }
           
         

        </ul>
        </div>
    </div>
    </>
}