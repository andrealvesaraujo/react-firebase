import {useEffect, useState} from 'react'
import './style.css'
import firebase from './firebaseConnection'

function App() {

  const [idPost, setIdPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    async function loadPosts(){
      await firebase.firestore().collection('posts')
      .onSnapshot((doc)=>{
        let meusPosts = []

        doc.forEach((item)=>{
          meusPosts.push({
            id:item.id,
            titulo: item.data().titulo,
            autor: item.data().autor,
          })
        })

        setPosts(meusPosts)

      })
    }

    loadPosts()
  },[])

  async function handleAdd(){
    await firebase.firestore().collection('posts')
    .add({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log('Dados cadatrados com Sucesso')
      setTitulo('')
      setAutor('')
    })
    .catch((error)=>{
      console.log('Gerou algum erro: ' + error)
    })
  }

  async function buscaPost(){
    
    await firebase.firestore().collection('posts')
    .get()
    .then((snapshot)=>{
      let lista = []

      snapshot.forEach((doc)=>{
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
      })

      setPosts(lista)

    }).catch((error)=>{
      console.log('Deu algum erro: ' + error)
    })

  }

  async function editarPost(){
    await firebase.firestore().collection('posts')
    .doc(idPost)
    .update({
      titulo: titulo,
      autor: autor
    }).then(()=>{
      console.log('Dados atualizados com sucesso')
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch(()=>{
      console.log("Erro ao atualizar")
    })

  }

  return (
    <div className="App">
      <h1>React JS + Firebase </h1> <br/>

      <div className="container">

        <label>Id: </label>
        <textarea type="text" value={idPost} onChange={(e)=> setIdPost(e.target.value)} />

        <label>Titulo: </label>
        <textarea type="text" value={titulo} onChange={(e)=> setTitulo(e.target.value)} />

        <label>Autor: </label>
        <textarea type="text" value={autor} onChange={(e)=> setAutor(e.target.value)} />

        <button onClick={handleAdd}>Cadastrar</button>

        <button onClick={buscaPost}>Buscar Post</button>

        <button onClick={editarPost}>Editar Post</button>

        <br/>
        
        <ul>
          {posts.map((post)=>{
            return (
              <li key={post.id}>
                <span>Id: {post.id}</span> <br/>
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
