import './app.css'
import {db, auth} from './firebaseConnection'
import {
  doc, 
  collection, 
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'

import {createUserWithEmailAndPassword} from 'firebase/auth'

import { useState, useEffect } from 'react'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

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

  async function novoUsuario(){
    
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(()=>{
      alert("Usuario cadastrado com com sucesso")
      setEmail('')
      setSenha('')
    })
    .catch((err)=>{
      if(err.code === 'auth/weak-password'){
        alert("Senha muito fraca ")
      } else if (err.code === 'auth/email-already-in-use'){
        alert("Email já existe")
      }
    })

  }

  


  return (
    <div className="App">

      <h1>ReactJS + Firebase :)</h1>

      <div className='container'>
        <h2>Usuários</h2>
        <label>Email: </label>
        <input 
          placeholder='Digite um email'
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
        />

        <label>Senha: </label>
        <input 
          type="password"
          placeholder='Informe sua senha'
          value={senha}
          onChange={(e)=>{setSenha(e.target.value)}}
        />

        <button onClick={novoUsuario}>Cadastrar</button>

      </div>

      <br/><br/>
      <hr/>

      <div className='container'>

          <h2>POSTS</h2>

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
