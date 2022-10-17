import './app.css'
import {db} from './firebaseConnection'
import {doc, collection, addDoc, getDoc, getDocs} from 'firebase/firestore'
import { useState } from 'react'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')

  const [posts, setPosts] = useState([])


  async function handleAdd(){
    await addDoc(collection(db, 'posts'), {
      titulo: titulo,
      autor:autor
    })
    .then(()=>{
      console.log("Cadastrado com sucesso")
      setAutor('')
      setTitulo('')
    })
    .catch((error)=>{
      console.log("Error ao adicionar: " + error)
    })
  }

  async function buscarPost(){

    const postRef = collection(db, 'posts')

    await getDocs(postRef)
    .then((snapshot)=>{
      let lista = []

      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })
      setPosts(lista)
    })
    .catch((error)=>{
      console.log("Error ao buscar: " + error)
    })
  }

  


  return (
    <div className="App">

      <h1>ReactJS + Firebase :)</h1>
      <div className='container'>
          <label>Titulo: </label>
          <textarea 
            type="text" 
            placeholder='Digite o titulo'
            value={titulo}
            onChange={(e)=>{setTitulo(e.target.value)}}
          />

          <label>Autor: </label>
          <input 
            type="text" 
            placeholder='Autor do post'
            value={autor}
            onChange={(e)=>{setAutor(e.target.value)}}
          />

          <button onClick={handleAdd}>Cadastrar</button>
          <button onClick={buscarPost}>Buscar</button>

          <ul>
            {posts.map((post)=>{
              return (
                <li key={post.id}>
                  <span>Titulo: {post.titulo}</span> <br/>
                  <span>Autor: {post.autor}</span> <br/><br/>
                </li>
              )
            })}
          </ul>
      </div>
    </div>
  );
}

export default App;
