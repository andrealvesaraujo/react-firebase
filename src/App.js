import './app.css'
import {db} from './firebaseConnection'
import {
  doc, 
  collection, 
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'

import { useState, useEffect } from 'react'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')

  const [posts, setPosts] = useState([])

  useEffect(()=>{
    async function loadPosts(){
        const unsub = onSnapshot(collection(db, 'posts'), (snapshot)=>{
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
    }

    loadPosts()
  }, [])


  async function handleAdd(){
    await addDoc(collection(db, 'posts'), {
      titulo: titulo,
      autor:autor
    })
    .then(()=>{
      alert("Cadastrado com sucesso")
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

  async function editarPost(){
    const docRef = doc(db, 'posts', idPost)

    await updateDoc(docRef, {
      titulo: titulo,
      autor:autor
    })
    .then(()=>{
      alert('Post atualizado com sucesso')
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch((err)=>{
      console.log("Erro ao atualizar post: ", err)
    })
  }

  async function excluirPost(id){
    
    const docRef = doc(db, 'posts', id)

    await deleteDoc(docRef)
    .then(()=>{
      alert("Post deletado com sucesso")
    })
    .catch((err)=>{
      console.log("Erro ao excluir post: ", err)
    })

  }

  


  return (
    <div className="App">

      <h1>ReactJS + Firebase :)</h1>
      <div className='container'>

          <label>ID do Post: </label>
          <input 
            placeholder='Digite o ID do post'
            value={idPost}
            onChange={(e)=>{setIdPost(e.target.value)}}
          />

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
          <button onClick={editarPost}>Atualizar post</button>

          <ul>
            {posts.map((post)=>{
              return (
                <li key={post.id}>
                  <strong>ID: {post.id}</strong> <br/>
                  <span>Titulo: {post.titulo}</span> <br/>
                  <span>Autor: {post.autor}</span> <br/>
                  <button onClick={() => excluirPost(post.id)}>Excluir</button> <br/><br/>
                </li>
              )
            })}
          </ul>
      </div>
    </div>
  );
}

export default App;
