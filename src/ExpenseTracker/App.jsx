import { useState } from "react"
import "../ExpenseTracker/index.css"

function App() {
  const [title,setTitle] = useState("");
  const [amount,setAmount] = useState(0);
  const [items,setItems] = useState([]);
  const handleTitle =(e) =>{
    setTitle(e.target.value)
  }
  const handleAmount =(e) =>{
    setAmount(e.target.value)
  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(title !== ""){
      const newItems = {
        id: Math.floor(Math.random() * 100000000),
        title,
        amount : +amount,
      }
      setItems([...items,newItems]);
      setAmount("");
      setTitle("");
    }
  }
  const amounts = items.map(item => item.amount);
  const income = amounts
  .filter(item => item > 0)
  .reduce((acc, item) => (acc += item), 0)
  .toFixed(2)
  const expenses =  (amounts.filter(amount => amount < 0).reduce((acc,amount)=> (acc += amount),0) * -1).toFixed(2)
  const balance = amounts.reduce((acc,amount)=> (acc += amount) ,0).toFixed(2);
  const delItems = (id)=>{
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems)

  }
  return(
    <>
    <h2>expense tracker</h2>
    <h4>Your Balance</h4>
    <h3>${balance}</h3>
    <div className="inc-exp-container">
      <div className="income">
        <h2>Income</h2>
        <span className="money plus">{income}</span>
      </div>
      <div className="expense">
        <h2>Expense</h2>
        <span className="money minus">{expenses}</span>
      </div>
    </div>
    <h3>History</h3>
    <ul className="list">
      {items.map(item =>{
      return(
        <>
        <li className={item.amount < 0 ? 'minus' : 'plus'} key={item.id}>
        {item.title} 
        <span>${item.amount}</span>
        <button className="delete-btn" onClick={()=> delItems(item.id)}>X</button></li>
        </>
      )
      })}
    </ul>
    <h3>Add new transaction</h3>
    <form action="">
     <div className="form_control">
     <label htmlFor="title">
        <input autoComplete="off" value={title} onChange={handleTitle} type="text" id='title' name='title' placeholder='Enter Text...' />
      </label>
     </div>
     <div className="form_control">
      <label htmlFor="amount">
        <input value={amount} onChange={handleAmount} type="number" id='amount' name='amount' placeholder='Enter amount...' />
      </label>
      </div>
      <button className="btn" onClick={handleSubmit} type='submit'>Add Transaction</button>
    </form>
    </>
  )
}

export default App
