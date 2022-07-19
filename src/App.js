import {useState} from 'react'
import './style.css'
import firebase from './firebaseConnection'

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

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
    .doc('123')
    .get()
    .then((snapshot)=>{
      setTitulo(snapshot.data().titulo)
      setAutor(snapshot.data().autor)
    })
    .catch((error)=>{
      console.log('Gerou algum erro: ' + error)
    })
  }

  return (
    <div className="App">
      <h1>React JS + Firebase </h1> <br/>

      <div className="container">

        <label>Titulo: </label>
        <textarea type="text" value={titulo} onChange={(e)=> setTitulo(e.target.value)} />

        <label>Autor: </label>
        <textarea type="text" value={autor} onChange={(e)=> setAutor(e.target.value)} />

        <button onClick={handleAdd}>Cadastrar</button>

        <button onClick={buscaPost}>Buscar Post</button>


      </div>

    </div>
  );
}

export default App;
