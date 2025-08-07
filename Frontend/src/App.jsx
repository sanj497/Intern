import {BrowserRouter, Routes, Route} from "react-router-dom";
import SelectPaymentType from "./pages/SelectPaymentType";
import Khalti from "./pages/khalti";
import {Provider} from "react-redux"
import store from "./store/store"
import Sucess from "./pages/PaymentSuccess"
import Login from "./pages/login"
import Register from "./pages/register"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import React from "react";
import Product from "./pages/product";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
function App() {

  return (
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SelectPaymentType/>}/>
      <Route path="/khalti" element={<Khalti/>}/>
      <Route path="/success" element={<Sucess/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/product" element={<Product/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>


    </Routes>
    </BrowserRouter>
    
      
    </Provider>
  )
}

export default App